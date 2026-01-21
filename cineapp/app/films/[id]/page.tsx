import Image from 'next/image';
import { notFound } from 'next/navigation';
import { filmsAPI } from '@/lib/api/films';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // Await params
    const film = await filmsAPI.getMovieDetails(parseInt(id));
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

export default async function FilmDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Await params
  let film, credits, videos;

  try {
    [film, credits, videos] = await Promise.all([
      filmsAPI.getMovieDetails(parseInt(id)),
      filmsAPI.getMovieCredits(parseInt(id)),
      filmsAPI.getMovieVideos(parseInt(id)),
    ]);
  } catch (error) {
    console.error('Erreur chargement film:', error);
    notFound();
  }

  const posterUrl = film.images.poster_large || '/placeholder-film.jpg';
  const backdropUrl = film.images.backdrop_large || posterUrl;
  const trailers = videos.filter(v => v.type === 'Trailer' && v.site === 'YouTube');
  const runtime = film.runtime ? `${Math.floor(film.runtime / 60)}h ${film.runtime % 60}min` : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Backdrop Header */}
      <div className="relative h-[50vh] md:h-[60vh] mb-8">
        <Image
          src={backdropUrl}
          alt={film.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              {film.title}
            </h1>
            {film.tagline && (
              <p className="text-xl text-gray-200 italic">{film.tagline}</p>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Colonne gauche - Poster et bouton */}
          <div className="md:col-span-1">
            <div className="sticky top-4 space-y-4">
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
                className="block w-full bg-blue-600 text-white text-center py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                🎬 Réserver des places
              </Link>

              {/* Informations supplémentaires */}
              <div className="bg-white rounded-lg p-4 shadow-md space-y-3">
                {film.status && (
                  <div>
                    <span className="text-gray-500 text-sm">Statut</span>
                    <p className="font-semibold">{film.status}</p>
                  </div>
                )}
                
                {film.production_countries.length > 0 && (
                  <div>
                    <span className="text-gray-500 text-sm">Pays</span>
                    <p className="font-semibold">{film.production_countries.join(', ')}</p>
                  </div>
                )}

                {film.budget > 0 && (
                  <div>
                    <span className="text-gray-500 text-sm">Budget</span>
                    <p className="font-semibold">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(film.budget)}
                    </p>
                  </div>
                )}

                {film.revenue > 0 && (
                  <div>
                    <span className="text-gray-500 text-sm">Recettes</span>
                    <p className="font-semibold">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'USD',
                        maximumFractionDigits: 0,
                      }).format(film.revenue)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite - Informations détaillées */}
          <div className="md:col-span-2 space-y-8">
            {/* Stats principales */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                  <span className="text-3xl">⭐</span>
                  <div>
                    <div className="font-bold text-xl">{film.vote_average.toFixed(1)}</div>
                    <div className="text-gray-600 text-xs">{film.vote_count.toLocaleString()} votes</div>
                  </div>
                </div>
                
                {runtime && (
                  <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                    <span className="text-2xl">⏱️</span>
                    <div className="font-semibold">{runtime}</div>
                  </div>
                )}
                
                {film.release_date && (
                  <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-lg">
                    <span className="text-2xl">📅</span>
                    <div className="font-semibold">
                      {new Date(film.release_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {film.genres.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Genres</h2>
                <div className="flex flex-wrap gap-2">
                  {film.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Synopsis */}
            {film.overview && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {film.overview}
                </p>
              </div>
            )}

            {/* Réalisateurs et Scénaristes */}
            {(credits.directors.length > 0 || credits.writers.length > 0) && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Équipe créative</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {credits.directors.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-600 mb-2">Réalisation</h3>
                      <div className="space-y-2">
                        {credits.directors.map((director) => (
                          <div key={director.id} className="flex items-center gap-3">
                            {director.profile_image && (
                              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={director.profile_image}
                                  alt={director.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <p className="font-semibold">{director.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {credits.writers.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-600 mb-2">Scénario</h3>
                      <div className="space-y-2">
                        {credits.writers.slice(0, 3).map((writer) => (
                          <div key={writer.id} className="flex items-center gap-3">
                            {writer.profile_image && (
                              <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={writer.profile_image}
                                  alt={writer.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <p className="font-semibold">{writer.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Casting */}
            {credits.cast.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-6">Distribution</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {credits.cast.slice(0, 12).map((actor) => (
                    <div key={actor.id} className="text-center group">
                      <div className="relative aspect-[2/3] mb-3 rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                        {actor.profile_image ? (
                          <Image
                            src={actor.profile_image}
                            alt={actor.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-4xl">👤</span>
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-sm">{actor.name}</p>
                      {actor.character && (
                        <p className="text-gray-600 text-xs mt-1">{actor.character}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bandes annonces */}
            {trailers.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-2xl font-bold mb-4">Bandes-annonces</h2>
                <div className="space-y-4">
                  <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={`https://www.youtube.com/embed/${trailers[0].key}`}
                      title={trailers[0].name}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  
                  {trailers.length > 1 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {trailers.slice(1, 4).map((video) => (
                        <a
                          key={video.id}
                          href={`https://www.youtube.com/watch?v=${video.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <div className="aspect-video relative rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                            <Image
                              src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                              alt={video.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                              <span className="text-5xl">▶️</span>
                            </div>
                          </div>
                          <p className="text-sm font-semibold mt-2 line-clamp-2">{video.name}</p>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Liens externes */}
            <div className="flex gap-4">
              {film.homepage && (
                <a
                  href={film.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-800 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
                >
                  🌐 Site officiel
                </a>
              )}
              {film.imdb_id && (
                <a
                  href={`https://www.imdb.com/title/${film.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-yellow-400 text-black text-center py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                >
                  IMDb
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}