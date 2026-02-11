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
          sizes="100vw"
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
              <p className="text-xl text-white/60 italic">{film.tagline}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="md:col-span-1">
            <div className="sticky top-4">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl ring-2 ring-[hsl(var(--border))]">
                <Image
                  src={posterUrl}
                  alt={film.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              <Link
                href={`/reservations?film=${film.id}`}
                className="mt-4 block w-full text-center py-3 rounded-xl font-semibold
                  bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))]
                  hover:brightness-110 transition-all shadow-lg shadow-[hsl(var(--accent)/0.3)]"
              >
                Réserver des places
              </Link>
            </div>
          </div>

          {/* Informations */}
          <div className="md:col-span-2 space-y-8">
            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-[hsl(var(--bg-subtle))] px-4 py-2 rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-[hsl(var(--fg))]">{film.vote_average.toFixed(1)}</span>
                <span className="text-[hsl(var(--fg-muted))] text-sm">({film.vote_count} votes)</span>
              </div>

              {film.runtime && (
                <div className="bg-[hsl(var(--bg-subtle))] px-4 py-2 rounded-xl">
                  <span className="font-semibold text-[hsl(var(--fg))]">{film.runtime} min</span>
                </div>
              )}

              {film.release_date && (
                <div className="bg-[hsl(var(--bg-subtle))] px-4 py-2 rounded-xl">
                  <span className="font-semibold text-[hsl(var(--fg))]">
                    {new Date(film.release_date).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            {film.genres.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-3 text-[hsl(var(--fg))]">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {film.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))] px-3 py-1 rounded-full text-sm font-medium"
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
                <h2 className="text-2xl font-bold mb-3 text-[hsl(var(--fg))]">Synopsis</h2>
                <p className="text-[hsl(var(--fg-muted))] leading-relaxed text-lg">
                  {film.overview}
                </p>
              </div>
            )}

            {/* Réalisateurs */}
            {credits.directors.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-3 text-[hsl(var(--fg))]">Réalisation</h2>
                <div className="flex flex-wrap gap-4">
                  {credits.directors.map((director) => (
                    <div key={director.id} className="text-center">
                      <p className="font-semibold text-[hsl(var(--fg))]">{director.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Casting */}
            {credits.cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[hsl(var(--fg))]">Casting</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {credits.cast.slice(0, 8).map((actor) => (
                    <div key={actor.id} className="text-center">
                      {actor.profile_image && (
                        <div className="relative aspect-[2/3] mb-2 rounded-xl overflow-hidden ring-1 ring-[hsl(var(--border))]">
                          <Image
                            src={actor.profile_image}
                            alt={actor.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <p className="font-semibold text-sm text-[hsl(var(--fg))]">{actor.name}</p>
                      {actor.character && (
                        <p className="text-[hsl(var(--fg-muted))] text-xs">{actor.character}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bandes annonces */}
            {trailers.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[hsl(var(--fg))]">Bandes-annonces</h2>
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailers[0].key}`}
                    title={trailers[0].name}
                    className="w-full h-full rounded-xl"
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