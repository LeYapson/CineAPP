import { API_CONFIG } from '@/config/api';

export interface Film {
  id: number;
  title: string;
  original_title: string;
  overview: string | null;
  release_date: string | null;
  poster: string | null;
  backdrop: string | null;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
}

export interface FilmDetailed extends Film {
  tagline: string | null;
  runtime: number | null;
  budget: number;
  revenue: number;
  status: string;
  genres: Genre[];
  homepage: string | null;
  imdb_id: string | null;
  production_countries: string[];
  spoken_languages: string[];
  images: MediaImage;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MediaImage {
  poster_small: string | null;
  poster_medium: string | null;
  poster_large: string | null;
  poster_original: string | null;
  backdrop_small: string | null;
  backdrop_medium: string | null;
  backdrop_large: string | null;
  backdrop_original: string | null;
}

export interface FilmListResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: Film[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string | null;
  profile_image: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_image: string | null;
}

export interface CreditsResponse {
  cast: CastMember[];
  crew: CrewMember[];
  directors: CrewMember[];
  writers: CrewMember[];
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  url: string | null;
}

class FilmsAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.FILMS_SERVICE;
  }

  private async fetchAPI<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`Erreur API Films: ${response.status}`);
    }

    return response.json();
  }

  async getPopularMovies(page: number = 1, language: string = 'fr-FR'): Promise<FilmListResponse> {
    return this.fetchAPI<FilmListResponse>('/api/movies/popular', {
      page: page.toString(),
      language,
    });
  }

  async getTopRatedMovies(page: number = 1, language: string = 'fr-FR'): Promise<FilmListResponse> {
    return this.fetchAPI<FilmListResponse>('/api/movies/top-rated', {
      page: page.toString(),
      language,
    });
  }

  async getNowPlayingMovies(page: number = 1, language: string = 'fr-FR'): Promise<FilmListResponse> {
    return this.fetchAPI<FilmListResponse>('/api/movies/now-playing', {
      page: page.toString(),
      language,
    });
  }

  async getUpcomingMovies(page: number = 1, language: string = 'fr-FR'): Promise<FilmListResponse> {
    return this.fetchAPI<FilmListResponse>('/api/movies/upcoming', {
      page: page.toString(),
      language,
    });
  }

  async getMovieDetails(movieId: number, language: string = 'fr-FR'): Promise<FilmDetailed> {
    return this.fetchAPI<FilmDetailed>(`/api/movies/${movieId}`, { language });
  }

  async getMovieCredits(movieId: number): Promise<CreditsResponse> {
    return this.fetchAPI<CreditsResponse>(`/api/movies/${movieId}/credits`);
  }

  async getMovieVideos(movieId: number, language: string = 'fr-FR'): Promise<Video[]> {
    return this.fetchAPI<Video[]>(`/api/movies/${movieId}/videos`, { language });
  }

  async searchMovies(query: string, page: number = 1, language: string = 'fr-FR'): Promise<FilmListResponse> {
    return this.fetchAPI<FilmListResponse>('/api/search/movies', {
      q: query,
      page: page.toString(),
      language,
    });
  }

  async getMovieGenres(language: string = 'fr-FR'): Promise<Genre[]> {
    return this.fetchAPI<Genre[]>('/api/genres/movies', { language });
  }
}

export const filmsAPI = new FilmsAPI();