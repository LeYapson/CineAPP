import { Suspense } from 'react';
import { filmsAPI } from '@/lib/api/films';
import FilmGrid from '@/components/films/FilmGrid';

export const metadata = {
  title: 'Films - CineApp',
  description: 'Découvrez notre sélection de films',
};

export default async function FilmsPage() {
  // Charger les films côté serveur pour le SEO
  const initialData = await filmsAPI.getPopularMovies();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Films Populaires</h1>
        <p className="text-gray-600">
          Découvrez les films les plus populaires du moment
        </p>
      </div>

      <Suspense fallback={<FilmGridSkeleton />}>
        <FilmGrid initialFilms={initialData.results} />
      </Suspense>
    </div>
  );
}

function FilmGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-300 aspect-[2/3] rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      ))}
    </div>
  );
}