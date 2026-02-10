import PrivateRoute from '@/components/auth/PrivateRoute';
import SeatSelector from '@/components/reservations/SeatSelector';

export const metadata = {
  title: 'Sélection des sièges - CineApp',
  description: 'Sélectionnez vos sièges pour la séance',
};

interface ReservationDetailsPageProps {
  params: {
    id: string;
  };
  searchParams: {
    movieId?: string;
  };
}

function ReservationDetailsContent({ params, searchParams }: ReservationDetailsPageProps) {
  const sessionId = parseInt(params.id);
  const movieId = searchParams.movieId ? parseInt(searchParams.movieId) : null;

  if (isNaN(sessionId) || !movieId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg max-w-2xl mx-auto">
          <p className="text-red-700 mb-4">
            Paramètres de réservation invalides. Veuillez sélectionner un film et une séance valides.
          </p>
          <a
            href="/films"
            className="inline-block px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retour aux films
          </a>
        </div>
      </div>
    );
  }

  return (
    <SeatSelector sessionId={sessionId} movieId={movieId} />
  );
}

export default function ReservationDetailsPage({ params, searchParams }: ReservationDetailsPageProps) {
  return (
    <PrivateRoute>
      <ReservationDetailsContent params={params} searchParams={searchParams} />
    </PrivateRoute>
  );
}