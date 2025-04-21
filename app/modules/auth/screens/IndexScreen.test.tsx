import React from 'react';
import { render } from '@testing-library/react-native';
import IndexScreen from './IndexScreen'; 

// Mock de las dependencias
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../services/authServices', () => ({
  getPopularMovies: jest.fn().mockResolvedValue(['/path1.jpg', '/path2.jpg']),
}));

// Mock de react-native-vector-icons
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

// Mock de tailwind-react-native-classnames
jest.mock('tailwind-react-native-classnames', () => ({
  __esModule: true,
  default: () => ({}),
}));

describe('IndexScreen', () => {
  it('se renderiza correctamente', () => {
    const { getByTestId } = render(<IndexScreen />);
    
    // Verificamos que el indicador de carga se muestre inicialmente
    expect(getByTestId('loading-indicator')).toBeTruthy();
  });
});