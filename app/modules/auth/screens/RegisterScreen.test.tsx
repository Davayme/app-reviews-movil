import React from 'react';
import { render } from '@testing-library/react-native';

// Mock todos los módulos antes de importar el componente
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('../services/authServices', () => ({
  registerUser: jest.fn().mockResolvedValue({}),
}));

jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

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
import RegisterScreen from './RegisterScreen';

describe('RegisterScreen', () => {
  it('se renderiza correctamente', () => {
    const { getByTestId } = render(<RegisterScreen />);
    
    // Verificamos que el formulario se muestre correctamente
    expect(getByTestId('register-form')).toBeTruthy();
  });
});