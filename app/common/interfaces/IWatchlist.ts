export interface IWatchlistMovie {
    id: number;
    title: string;
    posterPath: string;
    releaseDate: string;
    createdAt: string;
  }
  
  export interface IWatchlistItem {
    id: number;
    userId: number;
    movieId: number;
    viewed: boolean;
    addedAt: string;
    movie: IWatchlistMovie;
  }
  
  export interface IWatchlistResponse {
    data: IWatchlistItem[];
    statusCode: number;
    message?: string;
  }