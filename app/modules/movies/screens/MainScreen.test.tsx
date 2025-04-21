import React from 'react';
import { render } from '@testing-library/react-native';
import MainScreen from './MainScreen'; 

// Mock de las dependencias
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Screen: () => null,
  }),
}));

// Mock de los componentes de las pestañas
jest.mock('../components/Inicio/HomeTab', () => 'HomeTab');
jest.mock('../components/Reviews/ReviewsTab', () => 'ReviewsTab');
jest.mock('../components/Watchlist/WatchlistTab', () => 'WatchlistTab');

// Mock del contexto de Watchlist
jest.mock('../context/WatchlistContext', () => ({
  WatchlistProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock de expo/vector-icons
jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

// Mock de constants
jest.mock('../../../common/utils/constants', () => ({
  colors: {
    yellow: '#fcbd00',
  },
}));

describe('MainScreen', () => {
  it('se renderiza correctamente', () => {
    // Si el componente se renderiza sin errores, la prueba pasará
    expect(() => render(<MainScreen />)).not.toThrow();
  });
});