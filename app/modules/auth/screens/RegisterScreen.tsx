import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import tw from 'tailwind-react-native-classnames';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    // Aquí puedes agregar la lógica para registrar al usuario
    console.log('Registrando usuario:', { name, email, password });
    // Navegar a la pantalla de inicio de sesión después del registro
    router.push('/modules/auth/screens/LoginScreen');
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-4 bg-gray-900`}>
      <Text style={tw`text-4xl font-bold mb-8 text-yellow-400`}>Registrarse</Text>
      <TextInput
        style={tw`w-full p-4 mb-4 bg-gray-800 text-white rounded-lg`}
        placeholder="Nombre"
        placeholderTextColor="#ccc"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={tw`w-full p-4 mb-4 bg-gray-800 text-white rounded-lg`}
        placeholder="Correo electrónico"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={tw`w-full p-4 mb-8 bg-gray-800 text-white rounded-lg`}
        placeholder="Contraseña"
        placeholderTextColor="#ccc"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={tw`p-4 rounded-lg bg-teal-500 w-full`}
        onPress={handleRegister}
      >
        <Text style={tw`text-lg text-center text-gray-900`}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={tw`p-4 rounded-lg mt-4 bg-pink-500 w-full`}
        onPress={() => router.push('/modules/auth/screens/LoginScreen')}
      >
        <Text style={tw`text-lg text-center text-gray-900`}>Ir al Login</Text>
      </TouchableOpacity>
    </View>
  );
}