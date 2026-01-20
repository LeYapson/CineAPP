'use client';

import { useEffect, useState } from 'react';
import { filmsAPI, Film } from '@/lib/api/films';
import FilmCard from './FilmCard';

interface FilmGridProps {
  category?: 'popular' | 'top-rated' | 'now-playing' | 'upcoming';
  initialFilms?: Film[];
}

export default function FilmGrid({ 
  category = 'popular',
  initialFilms = []
}: FilmGridProps) {
  const [films, setFilms] = useState<Film[]>(initialFilms);
  const [loading, setLoading] = useState(!initialFilms.length);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (initialFilms.length > 0) {
      setLoading(false);
      return;
    }
    
    loadFilms();
  }, [category]);

  const loadFilms = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      switch (category) {
        case 'top-rated':
          response = await filmsAPI.getTopRatedMovies(page);
          break;
        case 'now-playing':
          response = await filmsAPI.getNowPlayingMovies(page);
          break;
        case 'upcoming':
          response = await filmsAPI.getUpcomingMovies(page);
          break;
        default:
          response = await filmsAPI.getPopularMovies(page);
      }

      setFilms(prev => page === 1 ? response.results : [...prev, ...response.results]);
      setHasMore(page < response.total_pages);
    } catch (err) {
      setError('Erreur lors du chargement des films');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => loadFilms()} 
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      )}

      {!loading && hasMore && films.length > 0 && (
        <div className="text-center mt-12">
          <button
            onClick={loadMore}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Charger plus de films
          </button>
        </div>
      )}

      {!loading && films.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">Aucun film trouvé</p>
        </div>
      )}
    </div>
  );
}