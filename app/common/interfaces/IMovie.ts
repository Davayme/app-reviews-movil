export interface Movie {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number | null;
    release_date: string;
    inWatchlist: boolean;
    viewed: boolean;
  }
  
  export interface MovieResponse {
    results: Movie[];
    page: number;
    total_pages: number;
  }