import React from 'react';
import { render } from '@testing-library/react-native';
import MovieDetailScreen from './MovieDetailScreen';

// Mock de las dependencias de navegación
jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: { id: 1, userId: 1 }
  }),
  RouteProp: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock de los servicios
jest.mock('../services/movieService', () => ({
  getDetailMovie: jest.fn().mockResolvedValue({
    id: 1,
    title: 'Test Movie',
    tagline: 'Test Tagline',
    genres: [{ id: 1, name: 'Action' }],
    vote_average: 8.5,
    release_date: '2023-01-01',
    img: 'test.jpg',
    poster_path: '/test.jpg',
    runtime: 120,
    score: '8.5',
    inWatchlist: false,
    viewed: false,
    overview: 'Test overview',
    cast: [{ id: 1, name: 'Actor 1', profile_path: '/actor1.jpg' }],
    directors: [{ id: 2, name: 'Director 1', profile_path: '/director1.jpg' }],
  }),
}));

jest.mock('../services/reviewService', () => ({
  getUserReviewByMovie: jest.fn().mockResolvedValue(null),
}));

// Mock de los componentes
jest.mock('../components/MovieDetails/HeaderMovieDetails', () => ({
  HeaderMovieDetails: () => 'HeaderMovieDetails',
}));

jest.mock('../components/MovieDetails/DirectorAndCastSection', () => ({
  DirectorAndCastSection: () => 'DirectorAndCastSection',
}));

jest.mock('../components/MovieDetails/ListReviews', () => 'ListReviews');

jest.mock('../components/MovieDetails/ReviewModal', () => 'ReviewModal');

jest.mock('@/app/common/components/Loading/CustomLoading', () => ({
  CustomLoading: () => 'CustomLoading',
}));

// Mock de las utilidades
jest.mock('@/app/common/utils/constants', () => ({
  colors: {
    'background-color': '#000000',
    magenta: '#FF00FF',
  },
}));

jest.mock('tailwind-react-native-classnames', () => ({
  __esModule: true,
  default: (styles: string) => styles,
}));

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');

jest.mock('react-native-animatable', () => ({
  View: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('MovieDetailScreen', () => {
  it('se renderiza correctamente', async () => {
    // Si el componente se renderiza sin errores, la prueba pasará
    expect(() => render(<MovieDetailScreen />)).not.toThrow();
  });
});