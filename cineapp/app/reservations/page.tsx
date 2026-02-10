import PrivateRoute from '@/components/auth/PrivateRoute';
import TimeSlotSelector from '@/components/reservations/TimeSlotSelector';
import { filmsAPI } from '@/lib/api/films';

export const metadata = {
  title: 'Réservations - CineApp',
  description: 'Réservez vos places de cinéma',
};

interface ReservationsPageProps {
  searchParams: {
    film?: string;
  };
}

async function ReservationsContent({ searchParams }: ReservationsPageProps) {
  const filmId = searchParams.film ? parseInt(searchParams.film) : null;
  
  if (filmId) {
    try {
      // Récupérer les informations du film
      const film = await filmsAPI.getMovieDetails(filmId);
      
      return (
        <TimeSlotSelector
          movieId={filmId}
          movieTitle={film.title}
          posterUrl={film.images?.poster_large || film.poster || undefined}
        />
      );
    } catch (error) {
      console.error('Erreur chargement film:', error);
      return (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
            <p className="text-red-700 mb-2">
              Erreur lors du chargement des informations du film.
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
  }

  // Si aucun film n'est sélectionné
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Réservations</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">
            Sélectionnez un film pour commencer votre réservation.
          </p>
          <a
            href="/films"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir les films
          </a>
        </div>
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