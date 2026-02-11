import Image from 'next/image';
import Link from 'next/link';
import { Film } from '@/lib/api/films';

interface FilmCardProps {
  film: Film;
}

export default function FilmCard({ film }: FilmCardProps) {
  const posterUrl = film.poster || '/placeholder-film.jpg';
  const rating = film.vote_average?.toFixed(1) || 'N/A';
  const releaseYear = film.release_date ? new Date(film.release_date).getFullYear() : null;

  const getRatingColor = () => {
    const v = film.vote_average || 0;
    if (v >= 8) return 'bg-[hsl(var(--success))]';
    if (v >= 6) return 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))]';
    if (v >= 4) return 'bg-[hsl(var(--warning))]';
    return 'bg-[hsl(var(--danger))]';
  };

  return (
    <Link href={`/films/${film.id}`} className="group block h-full">
      <div className="h-full rounded-2xl overflow-hidden
        bg-[hsl(var(--bg-card))] border border-[hsl(var(--border))]
        group-hover:border-[hsl(var(--border-hover))]
        group-hover:shadow-xl group-hover:shadow-[hsl(var(--shadow-color)/0.15)]
        group-hover:-translate-y-1 transition-all duration-300 flex flex-col">
        {/* Poster */}
        <div className="relative aspect-[2/3] bg-[hsl(var(--bg-subtle))] overflow-hidden">
          <Image
            src={posterUrl}
            alt={film.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Rating badge */}
          <div className={`absolute top-2.5 right-2.5 ${getRatingColor()} text-white
            px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-md`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {rating}
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <span className="inline-flex items-center gap-1 text-white text-xs font-medium
              bg-[hsl(var(--primary)/0.9)] px-3 py-1.5 rounded-lg backdrop-blur-sm">
              Voir le film →
            </span>
          </div>
        </div>
        
        {/* Info */}
        <div className="p-3.5 flex-1 flex flex-col gap-1.5">
          <h3 className="font-semibold text-sm text-[hsl(var(--fg))] line-clamp-2
            group-hover:text-[hsl(var(--primary-text))] transition-colors leading-snug">
            {film.title}
          </h3>
          
          <div className="flex items-center gap-2 text-xs text-[hsl(var(--fg-subtle))]">
            {releaseYear && <span>{releaseYear}</span>}
          </div>

          {film.overview && (
            <p className="text-xs text-[hsl(var(--fg-muted))] line-clamp-2 mt-auto leading-relaxed">
              {film.overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}