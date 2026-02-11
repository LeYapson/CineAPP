import PrivateRoute from '@/components/auth/PrivateRoute';
import TimeSlotSelector from '@/components/reservations/TimeSlotSelector';
import { filmsAPI } from '@/lib/api/films';
import Link from 'next/link';

export const metadata = {
  title: 'Réservations - CineApp',
  description: 'Réservez vos places de cinéma',
};

interface ReservationsPageProps {
  searchParams: Promise<{
    film?: string;
  }>;
}

async function ReservationsContent({ searchParams }: ReservationsPageProps) {
  const { film } = await searchParams;
  const filmId = film ? parseInt(film) : null;

  if (filmId) {
    try {
      const filmData = await filmsAPI.getMovieDetails(filmId);
      return (
        <TimeSlotSelector
          movieId={filmId}
          movieTitle={filmData.title}
          posterUrl={filmData.images?.poster_large || filmData.poster || undefined}
        />
      );
    } catch {
      return (
        <div className="max-w-md mx-auto px-4 py-10">
          <div className="rounded-2xl border border-[hsl(var(--danger)/0.3)] bg-[hsl(var(--danger)/0.05)] p-6 text-center">
            <p className="text-[hsl(var(--fg))] font-medium mb-4">Erreur lors du chargement du film.</p>
            <Link href="/films"
              className="inline-flex px-5 py-2.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] rounded-xl font-medium hover:brightness-110 transition-all">
              Retour aux films
            </Link>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10 text-center">
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--bg-subtle))]
          flex items-center justify-center text-[hsl(var(--fg-subtle))]">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-[hsl(var(--fg))] mb-2">Réservations</h1>
        <p className="text-sm text-[hsl(var(--fg-muted))] mb-5">
          Sélectionnez un film pour commencer votre réservation.
        </p>
        <Link href="/films"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] rounded-xl font-medium hover:brightness-110 transition-all">
          Voir les films
        </Link>
      </div>
    </div>
  );
}

export default function ReservationsPage({ searchParams }: ReservationsPageProps) {
  return (
    <PrivateRoute>
      <ReservationsContent searchParams={searchParams} />
    </PrivateRoute>
  );
}