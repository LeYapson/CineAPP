import { filmsAPI } from '@/lib/api/films';
import FilmCard from '@/components/films/FilmCard';
import Link from 'next/link';

export default async function Home() {
  const [popularFilms, nowPlayingFilms] = await Promise.all([
    filmsAPI.getPopularMovies(1),
    filmsAPI.getNowPlayingMovies(1),
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Bienvenue sur CineApp
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Découvrez les films à l'affiche et réservez vos places en ligne
        </p>
      </section>

      {/* Films au cinéma */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Actuellement au cinéma</h2>
          <Link 
            href="/films?category=now-playing"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {nowPlayingFilms.results.slice(0, 5).map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </section>

      {/* Films populaires */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Films populaires</h2>
          <Link 
            href="/films"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {popularFilms.results.slice(0, 10).map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </section>
    </div>
  );
}