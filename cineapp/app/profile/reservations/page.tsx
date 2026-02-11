'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface StoredReservation {
  id: string;
  movieTitle: string;
  salle: number;
  horaire: string;
  nbPlaces: number;
  seats: string[];
  total: number;
  reference: string;
  createdAt: string;
}

export default function UserReservationsPage() {
  const [reservations, setReservations] = useState<StoredReservation[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Veuillez vous connecter pour voir vos réservations.');
        setLoaded(true);
        return;
      }

      const res = await fetch('/api/reservations', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
        } else {
          setError('Impossible de charger les réservations.');
        }
        setLoaded(true);
        return;
      }

      const data = await res.json();
      setReservations(data);
    } catch {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const formatFullDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch { return 'Date inconnue'; }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch { return '--:--'; }
  };

  const formatCreatedAt = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      });
    } catch { return ''; }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const res = await fetch(`/api/reservations/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
      }
    } catch { /* ignore */ }
  };

  if (!loaded) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <div className="w-10 h-10 mx-auto border-3 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[hsl(var(--fg))]">Mes réservations</h1>
        <span className="text-sm text-[hsl(var(--fg-muted))]">
          {reservations.length} réservation{reservations.length !== 1 ? 's' : ''}
        </span>
      </div>

      {error && (
        <div className="rounded-2xl border border-[hsl(var(--danger)/0.3)] bg-[hsl(var(--danger)/0.05)] p-6 text-center mb-6">
          <p className="text-sm text-[hsl(var(--danger))]">{error}</p>
        </div>
      )}

      {reservations.length === 0 && !error ? (
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--bg-subtle))]
            flex items-center justify-center text-[hsl(var(--fg-subtle))]">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-[hsl(var(--fg))] mb-1">Aucune réservation</h2>
          <p className="text-sm text-[hsl(var(--fg-muted))] mb-5">
            Vous n&apos;avez pas encore de réservation. Explorez notre catalogue et réservez votre prochaine séance !
          </p>
          <Link href="/films"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] rounded-xl font-medium hover:brightness-110 transition-all">
            Explorer les films
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))]
                overflow-hidden hover:border-[hsl(var(--accent)/0.3)] transition-colors"
            >
              {/* Barre accent */}
              <div className="h-1 bg-gradient-to-r from-[hsl(var(--accent))] to-[hsl(var(--accent)/0.3)]" />

              <div className="p-5">
                {/* En-tête */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[hsl(var(--fg))]">{r.movieTitle}</h3>
                    <p className="text-xs text-[hsl(var(--fg-subtle))] mt-0.5">
                      Réservé le {formatCreatedAt(r.createdAt)}
                    </p>
                  </div>
                  <span className="inline-block bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))]
                    px-3 py-1 rounded-lg font-semibold text-xs tracking-wide">
                    #{r.reference}
                  </span>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                  <div>
                    <span className="block text-[hsl(var(--fg-subtle))] text-xs mb-0.5">Date</span>
                    <span className="font-medium text-[hsl(var(--fg))]">{formatFullDate(r.horaire)}</span>
                  </div>
                  <div>
                    <span className="block text-[hsl(var(--fg-subtle))] text-xs mb-0.5">Horaire</span>
                    <span className="font-medium text-[hsl(var(--fg))]">{formatTime(r.horaire)}</span>
                  </div>
                  <div>
                    <span className="block text-[hsl(var(--fg-subtle))] text-xs mb-0.5">Salle</span>
                    <span className="font-medium text-[hsl(var(--fg))]">Salle {r.salle}</span>
                  </div>
                  <div>
                    <span className="block text-[hsl(var(--fg-subtle))] text-xs mb-0.5">Total</span>
                    <span className="font-bold text-[hsl(var(--accent))]">{r.total.toFixed(2)} €</span>
                  </div>
                </div>

                {/* Places */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-[hsl(var(--fg-muted))] mr-1">
                    {r.nbPlaces} place{r.nbPlaces > 1 ? 's' : ''} :
                  </span>
                  {r.seats.map((s) => (
                    <span key={s}
                      className="px-2 py-0.5 rounded-md bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg))] text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--bg-subtle))]">
                <button
                  onClick={() => handleDelete(r.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium
                    text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger)/0.1)] transition-colors"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}