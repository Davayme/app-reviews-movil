import React from 'react';
import { render } from '@testing-library/react-native';

// Mock todos los módulos antes de importar el componente
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mockear firebase/app antes de importar el componente
jest.mock('firebase/app', () => ({
  FirebaseError: class FirebaseError extends Error {
    code: any;
    constructor(code: any, message: string | undefined) {
      super(message);
      this.code = code;
    }
  }
}));

jest.mock('../services/authServices', () => ({
  loginUser: jest.fn().mockResolvedValue({ id: '123', email: 'test@example.com' }),
}));

jest.mock('../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: jest.fn(),
  }),
}));

jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');
jest.mock('react-native-vector-icons/FontAwesome', () => 'FontAwesome');

jest.mock('@/app/common/components/Toast/useToast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

jest.mock('tailwind-react-native-classnames', () => ({
  __esModule: true,
  default: () => ({}),
}));

// Importar el componente después de los mocks
import LoginScreen from './LoginScreen';

describe('LoginScreen', () => {
  it('se renderiza correctamente', () => {
    const { getByTestId } = render(<LoginScreen />);
    
    // Verificamos que el formulario se muestre correctamente
    expect(getByTestId('login-form')).toBeTruthy();
  });
});