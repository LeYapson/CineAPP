import { NextResponse } from 'next/server';
import { filmsAPI } from '@/lib/api/films';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'popular';
  const page = parseInt(searchParams.get('page') || '1');

  try {
    let data;
    
    switch (category) {
      case 'top-rated':
        data = await filmsAPI.getTopRatedMovies(page);
        break;
      case 'now-playing':
        data = await filmsAPI.getNowPlayingMovies(page);
        break;
      case 'upcoming':
        data = await filmsAPI.getUpcomingMovies(page);
        break;
      default:
        data = await filmsAPI.getPopularMovies(page);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur API Films:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des films' },
      { status: 500 }
    );
  }
}