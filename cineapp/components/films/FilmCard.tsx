import Image from 'next/image';
import Link from 'next/link';
import { Film } from '@/lib/api/films';

interface FilmCardProps {
  film: Film;
}

export default function FilmCard({ film }: FilmCardProps) {
  const posterUrl = film.poster || '/placeholder-film.jpg';
  const rating = film.vote_average.toFixed(1);

  return (
    <Link href={`/films/${film.id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
        <div className="relative aspect-[2/3] bg-gray-200">
          <Image
            src={posterUrl}
            alt={film.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            priority={false}
          />
          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-sm font-semibold">
            ⭐ {rating}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {film.title}
          </h3>
          
          {film.release_date && (
            <p className="text-gray-500 text-sm mb-2">
              {new Date(film.release_date).getFullYear()}
            </p>
          )}
          
          {film.overview && (
            <p className="text-gray-600 text-sm line-clamp-3">
              {film.overview}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}