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
  const { category = 'popular' } = await searchParams;
  
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
    initialData = { results: [], page: 1, total_pages: 0, total_results: 0 };
  }

  const categories = [
    { key: 'popular', label: 'Populaires', icon: '🔥' },
    { key: 'now-playing', label: 'Au cinéma', icon: '🎬' },
    { key: 'top-rated', label: 'Mieux notés', icon: '⭐' },
    { key: 'upcoming', label: 'Prochainement', icon: '📅' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[hsl(var(--fg))] mb-2">{title}</h1>
        <p className="text-[hsl(var(--fg-muted))]">{description}</p>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => {
          const isActive = category === cat.key;
          return (
            <a
              key={cat.key}
              href={`/films?category=${cat.key}`}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] shadow-sm'
                  : 'bg-[hsl(var(--bg-card))] text-[hsl(var(--fg-muted))] border border-[hsl(var(--border))] hover:bg-[hsl(var(--bg-card-hover))] hover:text-[hsl(var(--fg))] hover:border-[hsl(var(--border-hover))]'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </a>
          );
        })}
      </div>

      <Suspense fallback={<FilmGridSkeleton />}>
        <FilmGrid category={category} initialFilms={initialData.results} />
      </Suspense>
    </div>
  );
}

function FilmGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="skeleton aspect-[2/3] rounded-xl" />
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}