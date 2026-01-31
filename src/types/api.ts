export interface Movie {
  title: string;
  slug: string;
  thumbnail: string;
  rating: string;
  year: string;
  type: 'movie' | 'series';
  genres?: string[];
  genre?: string | string[];
}

export interface MovieDetail {
  slug: string;
  title: string;
  thumbnail: string;
  rating: string;
  year: string;
  country: string;
  genres: string[];
  cast: string[];
  synopsis: string;
  sources_id: string;
  player_url: string;
  episodes?: Episode[];
}

export interface Episode {
  season: number;
  episode: number;
  title: string;
  sources_id: string;
  player_url: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  page?: number;
  total?: number;
  note?: string;
}
