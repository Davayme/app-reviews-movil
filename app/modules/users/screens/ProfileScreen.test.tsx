import React from 'react';
import { render } from '@testing-library/react-native';
import ProfileScreen from './ProfileScreen';

// Mock del hook de autenticación
jest.mock('@/app/modules/auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { uid: 'test-user-id' }
  }),
}));

// Mock del servicio de usuario
jest.mock('../services/userService', () => ({
  getUserProfile: jest.fn().mockResolvedValue({
    id: 'test-user-id',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: '2023-01-01',
    reviews: { total: 10, average: 7.5 },
    watchlist: { total: 5, completed: 3 }
  }),
}));

// Mock de los componentes
jest.mock('../components/UserProfileInfo', () => 'UserProfileInfo');
jest.mock('../components/UserStats', () => 'UserStats');

// Mock de expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

// Mock de las utilidades
jest.mock('@/app/common/utils/constants', () => ({
  colors: {
    'background-color': '#000000',
    yellow: '#FFFF00'
  },
}));

describe('ProfileScreen', () => {
  it('se renderiza correctamente', () => {
    // Si el componente se renderiza sin errores, la prueba pasará
    expect(() => render(<ProfileScreen />)).not.toThrow();
  });
});