import PrivateRoute from '@/components/auth/PrivateRoute';
import SeatSelector from '@/components/reservations/SeatSelector';
import Link from 'next/link';

export const metadata = {
  title: 'Réservation - CineApp',
  description: 'Réservez vos places pour la séance',
};

interface ReservationDetailsPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ movieId?: string; movieTitle?: string }>;
}

async function ReservationDetailsContent({ params, searchParams }: ReservationDetailsPageProps) {
  const { id } = await params;
  const { movieId: movieIdParam } = await searchParams;

  const seanceId = parseInt(id);
  const movieId = movieIdParam ? parseInt(movieIdParam) : null;

  if (isNaN(seanceId) || !movieId) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <div className="rounded-2xl border border-[hsl(var(--danger)/0.3)] bg-[hsl(var(--danger)/0.05)] p-6 text-center">
          <p className="text-[hsl(var(--fg))] font-medium mb-4">
            Paramètres de réservation invalides.
          </p>
          <Link href="/films"
            className="inline-flex px-5 py-2.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] rounded-xl font-medium hover:brightness-110 transition-all">
            Retour aux films
          </Link>
        </div>
      </div>
    );
  }

  return <SeatSelector seanceId={seanceId} movieId={movieId} />;
}

export default function ReservationDetailsPage(props: ReservationDetailsPageProps) {
  return (
    <PrivateRoute>
      <ReservationDetailsContent {...props} />
    </PrivateRoute>
  );
}