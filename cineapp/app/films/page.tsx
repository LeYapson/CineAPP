import { Suspense } from 'react';
import { filmsAPI } from '@/lib/api/films';
import FilmGrid from '@/components/films/FilmGrid';

export const metadata = {
  title: 'Films - CineApp',
  description: 'Découvrez notre sélection de films',
};

interface FilmsPageProps {
  searchParams: Promise<{
    category?: 'popular' | 'top-rated' | 'now-playing' | 'upcoming';
  }>;
}

export default async function FilmsPage({ searchParams }: FilmsPageProps) {
  const { category = 'popular' } = await searchParams; // Await searchParams
  
  // Charger les films côté serveur pour le SEO
  let initialData;
  let title = 'Films Populaires';
  let description = 'Découvrez les films les plus populaires du moment';

  try {
    switch (category) {
      case 'top-rated':
        initialData = await filmsAPI.getTopRatedMovies();
        title = 'Films les mieux notés';
        description = 'Les films avec les meilleures notes de tous les temps';
        break;
      case 'now-playing':
        initialData = await filmsAPI.getNowPlayingMovies();
        title = 'Actuellement au cinéma';
        description = 'Les films actuellement disponibles en salle';
        break;
      case 'upcoming':
        initialData = await filmsAPI.getUpcomingMovies();
        title = 'Prochainement';
        description = 'Les films qui arrivent bientôt au cinéma';
        break;
      default:
        initialData = await filmsAPI.getPopularMovies();
    }
  } catch (error) {
    console.error('Erreur chargement films:', error);
    // Fallback avec données vides
    initialData = { results: [], page: 1, total_pages: 0, total_results: 0 };
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filtres de catégories */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600 mb-6">{description}</p>
        
        <div className="flex flex-wrap gap-3">
          <CategoryButton 
            href="/films?category=popular" 
            active={category === 'popular'}
          >
            Populaires
          </CategoryButton>
          <CategoryButton 
            href="/films?category=now-playing" 
            active={category === 'now-playing'}
          >
            Au cinéma
          </CategoryButton>
          <CategoryButton 
            href="/films?category=top-rated" 
            active={category === 'top-rated'}
          >
            Mieux notés
          </CategoryButton>
          <CategoryButton 
            href="/films?category=upcoming" 
            active={category === 'upcoming'}
          >
            Prochainement
          </CategoryButton>
        </div>
      </div>

      <Suspense fallback={<FilmGridSkeleton />}>
        <FilmGrid category={category} initialFilms={initialData.results} />
      </Suspense>
    </div>
  );
}

function CategoryButton({ 
  href, 
  active, 
  children 
}: { 
  href: string; 
  active: boolean; 
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {children}
    </a>
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