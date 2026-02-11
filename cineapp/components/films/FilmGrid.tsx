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
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl
          bg-[hsl(var(--danger)/0.1)] text-[hsl(var(--danger))] mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <p className="text-[hsl(var(--fg-muted))] text-lg mb-4">{error}</p>
        <button 
          onClick={() => loadFilms()} 
          className="px-6 py-2.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] rounded-xl font-medium
            hover:brightness-110 transition-all"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {films.map((film) => (
          <FilmCard key={film.id} film={film} />
        ))}
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-3 py-12">
          <div className="w-5 h-5 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full animate-spin" />
          <p className="text-[hsl(var(--fg-muted))]">Chargement...</p>
        </div>
      )}

      {!loading && hasMore && films.length > 0 && (
        <div className="text-center mt-10">
          <button
            onClick={loadMore}
            className="px-7 py-3 bg-[hsl(var(--bg-card))] text-[hsl(var(--fg))]
              border border-[hsl(var(--border))] rounded-xl font-medium
              hover:bg-[hsl(var(--bg-card-hover))] hover:border-[hsl(var(--border-hover))]
              transition-all"
          >
            Charger plus de films
          </button>
        </div>
      )}

      {!loading && films.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-4">🎬</div>
          <p className="text-[hsl(var(--fg-muted))] text-lg">Aucun film trouvé</p>
        </div>
      )}
    </div>
  );
}