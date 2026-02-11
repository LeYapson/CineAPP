'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Seance } from '@/lib/types/seance';
import { seancesAPI } from '@/lib/api/seances';

interface TimeSlotSelectorProps {
  movieId: number;
  movieTitle: string;
  posterUrl?: string;
}

export default function TimeSlotSelector({ movieId, movieTitle, posterUrl }: TimeSlotSelectorProps) {
  const [seances, setSeances] = useState<Seance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSeance, setSelectedSeance] = useState<Seance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Charger les séances depuis le micro-service
  useEffect(() => {
    const fetchSeances = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await seancesAPI.getOrCreateSeancesByFilm(movieId);
        setSeances(data);
      } catch (err) {
        console.error('Erreur chargement séances:', err);
        setError('Le service des séances est temporairement indisponible. Veuillez réessayer ultérieurement.');
      } finally {
        setLoading(false);
      }
    };
    fetchSeances();
  }, [movieId]);

  // Dates uniques des séances disponibles
  const availableDates = [...new Set(
    seances.map((s) => new Date(s.horaire).toISOString().split('T')[0])
  )].sort();

  // Séances du jour sélectionné
  const seancesForDate = seances.filter((s) => {
    const dateStr = new Date(s.horaire).toISOString().split('T')[0];
    return dateStr === selectedDate;
  }).sort((a, b) => new Date(a.horaire).getTime() - new Date(b.horaire).getTime());

  // Générer les 7 prochains jours pour l'UI
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };
  const dates = generateDates();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date.toISOString().split('T')[0]);
    setSelectedSeance(null);
  };

  const handleContinue = () => {
    if (selectedSeance) {
      router.push(
        `/reservations/${selectedSeance.id}?movieId=${movieId}&movieTitle=${encodeURIComponent(movieTitle)}`
      );
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });

  const formatTime = (isoString: string) =>
    new Date(isoString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const hasSeancesOnDate = (dateStr: string) => availableDates.includes(dateStr);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[hsl(var(--fg))] mb-8">Sélectionnez une séance</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar film */}
        <div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] overflow-hidden">
            {posterUrl && (
              <div className="aspect-[2/3]">
                <img src={posterUrl} alt={movieTitle} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-5">
              <h2 className="text-lg font-bold text-[hsl(var(--fg))] mb-1">{movieTitle}</h2>
              <p className="text-sm text-[hsl(var(--fg-muted))]">
                Sélectionnez une date et un horaire.
              </p>

              {selectedSeance && (
                <div className="mt-4 p-3.5 rounded-xl bg-[hsl(var(--accent)/0.08)] border border-[hsl(var(--accent)/0.2)]">
                  <p className="text-sm font-semibold text-[hsl(var(--accent))]">Séance sélectionnée</p>
                  <p className="text-[hsl(var(--fg))] font-medium mt-0.5">
                    {formatTime(selectedSeance.horaire)}
                  </p>
                  <p className="text-xs text-[hsl(var(--fg-muted))] mt-0.5">
                    Salle {selectedSeance.numeroSalle} · {selectedSeance.nombrePlacesRestantes} places restantes
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 mx-auto border-3 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-sm text-[hsl(var(--fg-muted))]">Chargement des séances…</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[hsl(var(--danger)/0.3)] bg-[hsl(var(--danger)/0.05)] p-6 text-center">
              <p className="text-[hsl(var(--fg))] font-medium mb-2">Service temporairement indisponible</p>
              <p className="text-sm text-[hsl(var(--fg-muted))] mb-4">Le service des séances est en maintenance. Veuillez réessayer dans quelques instants.</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] rounded-xl text-sm font-medium hover:brightness-110 transition-all"
              >
                Réessayer
              </button>
            </div>
          ) : seances.length === 0 ? (
            <div className="rounded-2xl border border-[hsl(var(--warning)/0.3)] bg-[hsl(var(--warning)/0.05)] p-8 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--warning)/0.1)] flex items-center justify-center">
                <svg className="w-7 h-7 text-[hsl(var(--warning))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <p className="text-[hsl(var(--fg))] font-semibold mb-1">Aucune séance disponible</p>
              <p className="text-sm text-[hsl(var(--fg-muted))]">
                Il n&apos;y a pas encore de séance prévue pour ce film.
              </p>
            </div>
          ) : (
            <>
              {/* Date selector */}
              <div>
                <h2 className="text-sm font-semibold text-[hsl(var(--fg))] mb-3">Choisissez une date</h2>
                <div className="grid grid-cols-7 gap-2">
                  {dates.map((date, i) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isSelected = dateStr === selectedDate;
                    const hasSeances = hasSeancesOnDate(dateStr);
                    return (
                      <button
                        key={i}
                        onClick={() => handleDateSelect(date)}
                        disabled={!hasSeances}
                        className={`p-2.5 rounded-xl text-center transition-all ${
                          isSelected
                            ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] shadow-md shadow-[hsl(var(--accent)/0.3)]'
                            : hasSeances
                              ? 'bg-[hsl(var(--bg-card))] border border-[hsl(var(--border))] text-[hsl(var(--fg))] hover:border-[hsl(var(--border-hover))]'
                              : 'bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg-subtle))] cursor-not-allowed opacity-50'
                        }`}
                      >
                        <div className="text-[10px] font-semibold uppercase">
                          {formatDate(date).split(' ')[0].substring(0, 3)}
                        </div>
                        <div className="text-lg font-bold">{date.getDate()}</div>
                        <div className="text-[10px]">
                          {formatDate(date).split(' ')[2]?.substring(0, 3)}
                        </div>
                        {hasSeances && !isSelected && (
                          <div className="w-1.5 h-1.5 mx-auto mt-1 rounded-full bg-[hsl(var(--accent))]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Séances du jour */}
              {selectedDate ? (
                <div>
                  <h2 className="text-sm font-semibold text-[hsl(var(--fg))] mb-3">Séances disponibles</h2>

                  {seancesForDate.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {seancesForDate.map((seance) => {
                        const isSelected = selectedSeance?.id === seance.id;
                        const isFull = seance.nombrePlacesRestantes <= 0;
                        return (
                          <button
                            key={seance.id}
                            onClick={() => !isFull && setSelectedSeance(seance)}
                            disabled={isFull}
                            className={`p-4 rounded-xl border text-left transition-all ${
                              isFull
                                ? 'border-[hsl(var(--border))] bg-[hsl(var(--bg-subtle))] opacity-60 cursor-not-allowed'
                                : isSelected
                                  ? 'border-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.06)] ring-1 ring-[hsl(var(--accent)/0.3)]'
                                  : 'border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] hover:border-[hsl(var(--border-hover))]'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-lg font-bold text-[hsl(var(--fg))]">
                                  {formatTime(seance.horaire)}
                                </p>
                                <p className="text-xs text-[hsl(var(--fg-muted))] mt-0.5">
                                  Salle {seance.numeroSalle}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className={`text-sm font-semibold ${
                                  isFull
                                    ? 'text-[hsl(var(--danger))]'
                                    : seance.nombrePlacesRestantes < 10
                                      ? 'text-[hsl(var(--warning))]'
                                      : 'text-[hsl(var(--success))]'
                                }`}>
                                  {isFull ? 'Complet' : `${seance.nombrePlacesRestantes} places`}
                                </p>
                                <p className="text-[10px] text-[hsl(var(--fg-subtle))] mt-0.5">
                                  / {seance.nombrePlacesTotal}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-[hsl(var(--fg-muted))]">Aucune séance cette date.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-[hsl(var(--fg-muted))]">Sélectionnez une date pour voir les séances.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sticky CTA */}
      {selectedSeance && (
        <div className="mt-8 sticky bottom-4 z-20">
          <button
            onClick={handleContinue}
            className="w-full py-4 rounded-2xl font-bold text-[hsl(var(--accent-fg))] text-lg
              bg-[hsl(var(--accent))] hover:brightness-110
              shadow-lg shadow-[hsl(var(--accent)/0.3)] transition-all active:scale-[0.98]"
          >
            Choisir mes places →
          </button>
        </div>
      )}
    </div>
  );
}