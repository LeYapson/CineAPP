'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Seance } from '@/lib/types/seance';
import { seancesAPI } from '@/lib/api/seances';

interface SeatSelectorProps {
  seanceId: number;
  movieId: number;
}

/* ── Types pour la grille ── */
type SeatStatus = 'available' | 'taken' | 'selected';
interface Seat {
  row: string;
  number: number;
  status: SeatStatus;
}

export default function SeatSelector({ seanceId, movieId }: SeatSelectorProps) {
  const [seance, setSeance] = useState<Seance | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const movieTitle = searchParams.get('movieTitle') || 'Film';

  const MAX_SEATS = 10;
  const PRICE_PER_SEAT = 9.99;

  // Charger la séance
  useEffect(() => {
    const fetchSeance = async () => {
      try {
        setLoading(true);
        setError(null);
        const seances = await seancesAPI.getSeancesByFilm(movieId);
        const found = seances.find((s) => s.id === seanceId);
        if (!found) throw new Error('Séance introuvable');
        setSeance(found);
      } catch (err) {
        console.error('Erreur chargement séance:', err);
        setError('Le service de réservation est temporairement indisponible. Veuillez réessayer ultérieurement.');
      } finally {
        setLoading(false);
      }
    };
    fetchSeance();
  }, [seanceId, movieId]);

  /* ── Générer la grille de sièges ── */
  const seatGrid = useMemo(() => {
    if (!seance) return [];

    const total = seance.nombrePlacesTotal;
    const taken = total - seance.nombrePlacesRestantes;
    const seatsPerRow = total <= 60 ? 10 : total <= 100 ? 12 : 14;
    const nbRows = Math.ceil(total / seatsPerRow);
    const rowLetters = 'ABCDEFGHIJKLMNOP'.slice(0, nbRows);

    // Générer des sièges "pris" de façon déterministe (basé sur seanceId)
    const takenSet = new Set<string>();
    const seed = seanceId * 7 + total * 3;
    let idx = 0;
    while (takenSet.size < taken && idx < total * 3) {
      const pseudoRand = ((seed + idx * 31) * 16807) % 2147483647;
      const seatIdx = pseudoRand % total;
      const r = Math.floor(seatIdx / seatsPerRow);
      const s = (seatIdx % seatsPerRow) + 1;
      if (r < nbRows) {
        const actualRow = rowLetters[r];
        const actualSeatsInRow = r === nbRows - 1
          ? total - (nbRows - 1) * seatsPerRow
          : seatsPerRow;
        if (s <= actualSeatsInRow) {
          takenSet.add(`${actualRow}${s}`);
        }
      }
      idx++;
    }

    const grid: Seat[][] = [];
    for (let r = 0; r < nbRows; r++) {
      const row: Seat[] = [];
      const actualSeatsInRow = r === nbRows - 1
        ? total - (nbRows - 1) * seatsPerRow
        : seatsPerRow;
      const rowLetter = rowLetters[r];
      for (let s = 1; s <= actualSeatsInRow; s++) {
        const id = `${rowLetter}${s}`;
        row.push({
          row: rowLetter,
          number: s,
          status: takenSet.has(id) ? 'taken' : 'available',
        });
      }
      grid.push(row);
    }
    return grid;
  }, [seance, seanceId]);

  /* ── Handlers ── */
  const toggleSeat = (row: string, number: number) => {
    const id = `${row}${number}`;
    setSelectedSeats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < MAX_SEATS) {
        next.add(id);
      }
      return next;
    });
  };

  const handleReserver = async () => {
    if (!seance || selectedSeats.size < 1) return;
    try {
      setReserving(true);
      setError(null);
      const nbPlaces = selectedSeats.size;
      const seatsArray = Array.from(selectedSeats).sort();

      // 1. Réserver les places dans le micro-service séances
      await seancesAPI.reserverPlaces(seance.id, nbPlaces);

      // 2. Sauvegarder la réservation côté serveur (API Next.js)
      const token = localStorage.getItem('accessToken');
      let reference = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

      if (token) {
        try {
          const res = await fetch('/api/reservations', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              seanceId: seance.id,
              movieTitle,
              salle: seance.numeroSalle,
              horaire: seance.horaire,
              nbPlaces,
              seats: seatsArray,
              total: nbPlaces * PRICE_PER_SEAT,
            }),
          });
          if (res.ok) {
            const saved = await res.json();
            reference = saved.reference;
          }
        } catch {
          // Pas critique si l'enregistrement échoue, la réservation séance est déjà faite
        }
      }

      router.push(
        `/reservations/confirmation?seanceId=${seance.id}&seats=${nbPlaces}&movieTitle=${encodeURIComponent(movieTitle)}&salle=${seance.numeroSalle}&horaire=${encodeURIComponent(seance.horaire)}&ref=${reference}&selectedSeats=${encodeURIComponent(seatsArray.join(','))}`
      );
    } catch (err) {
      console.error('Erreur réservation:', err);
      setError('La réservation n\u2019a pas pu être effectuée. Le service est temporairement indisponible.');
      setReserving(false);
    }
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const formatFullDate = (iso: string) =>
    new Date(iso).toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    });

  const getSeatColor = (seat: Seat) => {
    const id = `${seat.row}${seat.number}`;
    if (seat.status === 'taken')
      return 'bg-[hsl(var(--fg-subtle)/0.3)] text-[hsl(var(--fg-subtle)/0.5)] cursor-not-allowed';
    if (selectedSeats.has(id))
      return 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] shadow-md shadow-[hsl(var(--accent)/0.3)] scale-110';
    return 'bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg-muted))] hover:bg-[hsl(var(--accent)/0.2)] hover:text-[hsl(var(--fg))] cursor-pointer';
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <div className="w-10 h-10 mx-auto border-3 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-[hsl(var(--fg-muted))]">Chargement de la séance…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error && !seance) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-6 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl
            bg-[hsl(var(--warning,40_100%_50%)/0.1)] text-[hsl(var(--warning,40_100%_50%))] mx-auto">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-[hsl(var(--fg))] font-semibold mb-1">Service en maintenance</p>
            <p className="text-sm text-[hsl(var(--fg-muted))]">Le service de réservation est temporairement indisponible. Veuillez réessayer dans quelques instants.</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.push('/films')}
              className="px-4 py-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] rounded-xl text-sm font-medium hover:brightness-110 transition-all">
              Films
            </button>
            <button onClick={() => window.location.reload()}
              className="px-4 py-2 rounded-xl text-sm font-medium bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg-muted))] hover:bg-[hsl(var(--bg-card-hover))] transition-colors">
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!seance) return null;

  const nbPlaces = selectedSeats.size;
  const total = nbPlaces * PRICE_PER_SEAT;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b border-[hsl(var(--border))]">
          <h1 className="text-xl font-bold text-[hsl(var(--fg))] mb-1">Choisissez vos places</h1>
          <p className="text-sm text-[hsl(var(--fg-muted))]">
            {movieTitle} — Salle {seance.numeroSalle} — {formatFullDate(seance.horaire)} à {formatTime(seance.horaire)}
          </p>
        </div>

        <div className="p-6 space-y-6">

          {/* Écran */}
          <div className="text-center">
            <div className="mx-auto max-w-xs h-2 rounded-full bg-gradient-to-r from-transparent via-[hsl(var(--accent)/0.5)] to-transparent mb-1" />
            <span className="text-[10px] uppercase tracking-widest text-[hsl(var(--fg-subtle))] font-medium">
              Écran
            </span>
          </div>

          {/* Grille de sièges */}
          <div className="flex flex-col items-center gap-1.5 overflow-x-auto py-2">
            {seatGrid.map((row, ri) => (
              <div key={ri} className="flex items-center gap-1">
                {/* Lettre de rangée */}
                <span className="w-6 text-center text-xs font-bold text-[hsl(var(--fg-subtle))]">
                  {row[0]?.row}
                </span>

                {/* Sièges */}
                <div className="flex gap-1">
                  {row.map((seat) => {
                    const id = `${seat.row}${seat.number}`;
                    return (
                      <button
                        key={id}
                        disabled={seat.status === 'taken'}
                        onClick={() => toggleSeat(seat.row, seat.number)}
                        title={seat.status === 'taken' ? 'Occupé' : `${seat.row}${seat.number}`}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-t-lg text-[10px] font-semibold
                          transition-all duration-150 flex items-center justify-center
                          ${getSeatColor(seat)}`}
                      >
                        {seat.number}
                      </button>
                    );
                  })}
                </div>

                {/* Lettre de rangée (droite) */}
                <span className="w-6 text-center text-xs font-bold text-[hsl(var(--fg-subtle))]">
                  {row[0]?.row}
                </span>
              </div>
            ))}
          </div>

          {/* Légende */}
          <div className="flex justify-center gap-5 text-xs text-[hsl(var(--fg-muted))]">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-t-md bg-[hsl(var(--bg-subtle))]" />
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-t-md bg-[hsl(var(--accent))]" />
              <span>Sélectionné</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-t-md bg-[hsl(var(--fg-subtle)/0.3)]" />
              <span>Occupé</span>
            </div>
          </div>

          {/* Sièges sélectionnés */}
          {nbPlaces > 0 && (
            <div className="rounded-xl bg-[hsl(var(--accent)/0.08)] border border-[hsl(var(--accent)/0.2)] p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[hsl(var(--fg))]">Places sélectionnées :</span>
                {Array.from(selectedSeats).sort().map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
              {nbPlaces >= MAX_SEATS && (
                <p className="text-xs text-[hsl(var(--warning))] mt-2">
                  Maximum {MAX_SEATS} places par réservation
                </p>
              )}
            </div>
          )}

          {/* Récap prix */}
          {nbPlaces > 0 && (
            <div className="rounded-xl border border-[hsl(var(--border))] p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[hsl(var(--fg-muted))]">{nbPlaces} × {PRICE_PER_SEAT.toFixed(2)} €</span>
                <span className="text-[hsl(var(--fg))]">{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-[hsl(var(--border))]">
                <span className="text-[hsl(var(--fg))]">Total</span>
                <span className="text-[hsl(var(--accent))]">{total.toFixed(2)} €</span>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="rounded-xl border border-[hsl(var(--warning,40_100%_50%)/0.3)] bg-[hsl(var(--warning,40_100%_50%)/0.05)] p-3 text-center">
              <p className="text-sm text-[hsl(var(--fg-muted))]">Le service est temporairement indisponible. Veuillez réessayer.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-5 border-t border-[hsl(var(--border))] bg-[hsl(var(--bg-subtle))]">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3 rounded-xl font-medium text-sm
              bg-[hsl(var(--bg-card))] text-[hsl(var(--fg-muted))] border border-[hsl(var(--border))]
              hover:bg-[hsl(var(--bg-card-hover))] hover:text-[hsl(var(--fg))] transition-colors"
          >
            Retour
          </button>
          <button
            onClick={handleReserver}
            disabled={reserving || nbPlaces < 1}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-[hsl(var(--accent-fg))]
              bg-[hsl(var(--accent))] hover:brightness-110 shadow-md shadow-[hsl(var(--accent)/0.3)]
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {reserving ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[hsl(var(--accent-fg))] border-t-transparent rounded-full animate-spin" />
                Réservation…
              </span>
            ) : nbPlaces > 0 ? (
              `Réserver ${nbPlaces} place${nbPlaces > 1 ? 's' : ''} — ${total.toFixed(2)} €`
            ) : (
              'Sélectionnez vos places'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}