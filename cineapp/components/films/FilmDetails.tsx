import Image from 'next/image';
import { notFound } from 'next/navigation';
import { filmsAPI } from '@/lib/api/films';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const film = await filmsAPI.getMovieDetails(parseInt(params.id));
    return {
      title: `${film.title} - CineApp`,
      description: film.overview || film.tagline,
    };
  } catch {
    return {
      title: 'Film introuvable - CineApp',
    };
  }
}

export default async function FilmDetailsPage({ params }: { params: { id: string } }) {
  let film, credits, videos;

  try {
    [film, credits, videos] = await Promise.all([
      filmsAPI.getMovieDetails(parseInt(params.id)),
      filmsAPI.getMovieCredits(parseInt(params.id)),
      filmsAPI.getMovieVideos(parseInt(params.id)),
    ]);
  } catch (error) {
    notFound();
  }

  const posterUrl = film.images.poster_large || '/placeholder-film.jpg';
  const backdropUrl = film.images.backdrop_large || posterUrl;
  const trailers = videos.filter(v => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <div className="min-h-screen">
      {/* Backdrop Header */}
      <div className="relative h-[50vh] md:h-[60vh] mb-8">
        <Image
          src={backdropUrl}
          alt={film.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              {film.title}
            </h1>
            {film.tagline && (
              <p className="text-xl text-gray-300 italic">{film.tagline}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="sticky top-4">
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src={posterUrl}
                  alt={film.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              <Link
                href={`/reservations?film=${film.id}`}
                className="mt-4 block w-full bg-blue-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Réserver des places
              </Link>
            </div>
          </div>

          {/* Informations */}
          <div className="md:col-span-2 space-y-8">
            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="text-2xl font-bold text-yellow-500">⭐</span>
                <span className="ml-2 font-semibold">{film.vote_average.toFixed(1)}</span>
                <span className="ml-1 text-gray-600 text-sm">({film.vote_count} votes)</span>
              </div>
              
              {film.runtime && (
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="font-semibold">{film.runtime} min</span>
                </div>
              )}
              
              {film.release_date && (
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  <span className="font-semibold">
                    {new Date(film.release_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            {film.genres.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-3">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {film.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis */}
            {film.overview && (
              <div>
                <h2 className="text-2xl font-bold mb-3">Synopsis</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {film.overview}
                </p>
              </div>
            )}

            {/* Réalisateurs */}
            {credits.directors.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-3">Réalisation</h2>
                <div className="flex flex-wrap gap-4">
                  {credits.directors.map((director) => (
                    <div key={director.id} className="text-center">
                      <p className="font-semibold">{director.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Casting */}
            {credits.cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Casting</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {credits.cast.slice(0, 8).map((actor) => (
                    <div key={actor.id} className="text-center">
                      {actor.profile_image && (
                        <div className="relative aspect-[2/3] mb-2 rounded-lg overflow-hidden">
                          <Image
                            src={actor.profile_image}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="font-semibold text-sm">{actor.name}</p>
                      {actor.character && (
                        <p className="text-gray-600 text-xs">{actor.character}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bandes annonces */}
            {trailers.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Bandes-annonces</h2>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailers[0].key}`}
                    title={trailers[0].name}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}