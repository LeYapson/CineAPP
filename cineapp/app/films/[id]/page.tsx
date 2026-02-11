import Image from 'next/image';
import { notFound } from 'next/navigation';
import { filmsAPI } from '@/lib/api/films';
import Link from 'next/link';
import YouTubeThumbnail from '@/components/ui/YouTubeThumbnail';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const film = await filmsAPI.getMovieDetails(parseInt(id));
    return {
      title: `${film.title} - CineApp`,
      description: film.overview || film.tagline,
    };
  } catch {
    return { title: 'Film introuvable - CineApp' };
  }
}

export default async function FilmDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let film, credits, videos;

  try {
    const filmResponse = await filmsAPI.getMovieDetails(parseInt(id));
    const creditsResponse = await filmsAPI.getMovieCredits(parseInt(id)).catch(() => ({
      cast: [], crew: [], directors: [], writers: []
    }));
    const videosResponse = await filmsAPI.getMovieVideos(parseInt(id)).catch(() => []);
    [film, credits, videos] = [filmResponse, creditsResponse, videosResponse];
  } catch (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl
          bg-[hsl(var(--bg-card))] border border-[hsl(var(--border))]">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[hsl(var(--danger)/0.1)]
            flex items-center justify-center text-[hsl(var(--danger))]">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[hsl(var(--fg))] mb-2">Film indisponible</h1>
          <p className="text-[hsl(var(--fg-muted))] mb-6 text-sm">
            {error instanceof Error && error.message.includes('contacter le serveur')
              ? 'Le serveur semble inaccessible.'
              : 'Une erreur est survenue.'}
          </p>
          <Link
            href="/films"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))]
              rounded-xl font-medium hover:brightness-110 transition-all"
          >
            ← Retour aux films
          </Link>
        </div>
      </div>
    );
  }

  const posterUrl = film.images?.poster_large || film.poster || '/placeholder-film.jpg';
  const backdropUrl = film.images?.backdrop_large || film.backdrop || posterUrl;
  const trailers = (videos as any[])?.filter(v => v.type === 'Trailer' && v.site === 'YouTube') || [];
  const runtime = film.runtime ? `${Math.floor(film.runtime / 60)}h ${film.runtime % 60}min` : null;

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))] -mt-20">
      {/* ── Backdrop Hero ── */}
      <div className="relative h-[45vh] md:h-[55vh]">
        <Image src={backdropUrl} alt={film.title} fill sizes="100vw" className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--bg))] via-[hsl(var(--bg)/0.6)] to-transparent" />
        
        {/* Back button */}
        <div className="absolute top-24 left-4 sm:left-8 z-10">
          <Link href="/films"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium
              bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Films
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-1.5 drop-shadow-lg">
              {film.title}
            </h1>
            {film.tagline && (
              <p className="text-lg text-white/70 italic">{film.tagline}</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 -mt-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
          
          {/* ── Sidebar ── */}
          <div className="space-y-5">
            {/* Poster */}
            <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl
              ring-2 ring-[hsl(var(--border))]">
              <Image src={posterUrl} alt={film.title} fill sizes="(max-width: 1024px) 100vw, 300px" className="object-cover" />
            </div>
            
            {/* CTA Réserver — 1 clic depuis le détail */}
            <Link
              href={`/reservations?film=${film.id}`}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl
                bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] font-bold text-lg
                hover:brightness-110 shadow-lg shadow-[hsl(var(--accent)/0.3)] transition-all active:scale-[0.97]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Réserver des places
            </Link>

            {/* Info card */}
            <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-5 space-y-4">
              {film.status && (
                <div>
                  <span className="text-xs font-medium text-[hsl(var(--fg-subtle))] uppercase tracking-wider">Statut</span>
                  <p className="font-semibold text-[hsl(var(--fg))] mt-0.5">{film.status}</p>
                </div>
              )}
              {(film as any).production_countries?.length > 0 && (
                <div>
                  <span className="text-xs font-medium text-[hsl(var(--fg-subtle))] uppercase tracking-wider">Pays</span>
                  <p className="font-semibold text-[hsl(var(--fg))] mt-0.5">{(film as any).production_countries.join(', ')}</p>
                </div>
              )}
              {(film as any).budget > 0 && (
                <div>
                  <span className="text-xs font-medium text-[hsl(var(--fg-subtle))] uppercase tracking-wider">Budget</span>
                  <p className="font-semibold text-[hsl(var(--fg))] mt-0.5">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((film as any).budget)}
                  </p>
                </div>
              )}
              {(film as any).revenue > 0 && (
                <div>
                  <span className="text-xs font-medium text-[hsl(var(--fg-subtle))] uppercase tracking-wider">Recettes</span>
                  <p className="font-semibold text-[hsl(var(--fg))] mt-0.5">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format((film as any).revenue)}
                  </p>
                </div>
              )}
              
              {/* External links */}
              {(film.homepage || (film as any).imdb_id) && (
                <div className="flex gap-2 pt-2 border-t border-[hsl(var(--border))]">
                  {film.homepage && (
                    <a href={film.homepage} target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium
                        bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg-muted))]
                        hover:bg-[hsl(var(--bg-card-hover))] hover:text-[hsl(var(--fg))] transition-colors">
                      Site officiel
                    </a>
                  )}
                  {(film as any).imdb_id && (
                    <a href={`https://www.imdb.com/title/${(film as any).imdb_id}`} target="_blank" rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold
                        bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))]
                        hover:bg-[hsl(var(--accent)/0.25)] transition-colors">
                      IMDb
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Main content ── */}
          <div className="space-y-6">
            {/* Stats row */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                bg-[hsl(var(--accent)/0.1)] border border-[hsl(var(--accent)/0.2)]">
                <svg className="w-5 h-5 text-[hsl(var(--accent))]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold text-[hsl(var(--fg))]">{film.vote_average.toFixed(1)}</span>
                <span className="text-xs text-[hsl(var(--fg-muted))]">{film.vote_count.toLocaleString()} votes</span>
              </div>
              
              {runtime && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                  bg-[hsl(var(--bg-card))] border border-[hsl(var(--border))]">
                  <svg className="w-4 h-4 text-[hsl(var(--fg-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-[hsl(var(--fg))]">{runtime}</span>
                </div>
              )}
              
              {film.release_date && (
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                  bg-[hsl(var(--bg-card))] border border-[hsl(var(--border))]">
                  <svg className="w-4 h-4 text-[hsl(var(--fg-muted))]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="font-medium text-[hsl(var(--fg))]">
                    {new Date(film.release_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            {(film as any).genres?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(film as any).genres.map((genre: any) => (
                  <span key={genre.id}
                    className="px-3.5 py-1.5 rounded-xl text-sm font-medium
                      bg-[hsl(var(--primary-text)/0.1)] text-[hsl(var(--primary-text))]
                      border border-[hsl(var(--primary-text)/0.15)]">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {film.overview && (
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-6">
                <h2 className="text-lg font-bold text-[hsl(var(--fg))] mb-3">Synopsis</h2>
                <p className="text-[hsl(var(--fg-muted))] leading-relaxed">{film.overview}</p>
              </div>
            )}

            {/* Crew */}
            {((credits as any)?.directors?.length > 0 || (credits as any)?.writers?.length > 0) && (
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-6">
                <h2 className="text-lg font-bold text-[hsl(var(--fg))] mb-4">Équipe créative</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {(credits as any)?.directors?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-medium text-[hsl(var(--fg-subtle))] uppercase tracking-wider mb-2">Réalisation</h3>
                      <div className="space-y-2">
                        {(credits as any).directors.map((d: any) => (
                          <div key={d.id} className="flex items-center gap-3">
                            {d.profile_image && (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-[hsl(var(--border))]">
                                <Image src={d.profile_image} alt={d.name} fill sizes="40px" className="object-cover" />
                              </div>
                            )}
                            <span className="font-medium text-[hsl(var(--fg))]">{d.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {(credits as any)?.writers?.length > 0 && (
                    <div>
                      <h3 className="text-xs font-medium text-[hsl(var(--fg-subtle))] uppercase tracking-wider mb-2">Scénario</h3>
                      <div className="space-y-2">
                        {(credits as any).writers.slice(0, 3).map((w: any) => (
                          <div key={w.id} className="flex items-center gap-3">
                            {w.profile_image && (
                              <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 ring-1 ring-[hsl(var(--border))]">
                                <Image src={w.profile_image} alt={w.name} fill sizes="40px" className="object-cover" />
                              </div>
                            )}
                            <span className="font-medium text-[hsl(var(--fg))]">{w.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cast */}
            {(credits as any)?.cast?.length > 0 && (
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-6">
                <h2 className="text-lg font-bold text-[hsl(var(--fg))] mb-4">Distribution</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                  {(credits as any).cast.slice(0, 12).map((actor: any) => (
                    <div key={actor.id} className="text-center group">
                      <div className="relative aspect-[2/3] mb-2 rounded-xl overflow-hidden
                        bg-[hsl(var(--bg-subtle))] ring-1 ring-[hsl(var(--border))]
                        group-hover:ring-[hsl(var(--border-hover))] transition-all">
                        {actor.profile_image ? (
                          <Image src={actor.profile_image} alt={actor.name} fill sizes="(max-width: 640px) 33vw, (max-width: 1024px) 16vw, 120px" className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[hsl(var(--fg-subtle))]">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="font-medium text-xs text-[hsl(var(--fg))] line-clamp-1">{actor.name}</p>
                      {actor.character && (
                        <p className="text-[10px] text-[hsl(var(--fg-subtle))] line-clamp-1 mt-0.5">{actor.character}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trailers */}
            {trailers?.length > 0 && (
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-6">
                <h2 className="text-lg font-bold text-[hsl(var(--fg))] mb-4">Bandes-annonces</h2>
                <div className="aspect-video rounded-xl overflow-hidden ring-1 ring-[hsl(var(--border))]">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailers[0].key}`}
                    title={trailers[0].name as string}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                
                {trailers.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                    {trailers.slice(1, 4).map((video: any) => (
                      <a key={video.id} href={`https://www.youtube.com/watch?v=${video.key}`}
                        target="_blank" rel="noopener noreferrer" className="group">
                        <div className="aspect-video relative rounded-xl overflow-hidden
                          ring-1 ring-[hsl(var(--border))] group-hover:ring-[hsl(var(--border-hover))] transition-all">
                          <YouTubeThumbnail videoKey={video.key} videoName={video.name} className="object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center
                            group-hover:bg-black/50 transition-colors">
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                        <p className="text-xs font-medium text-[hsl(var(--fg-muted))] mt-1.5 line-clamp-1">{video.name}</p>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}