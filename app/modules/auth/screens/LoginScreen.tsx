import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { login } from '../services/authServices';
import tw from 'tailwind-react-native-classnames';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      console.log('User:', user);
      router.push('/modules/movies/screens/IndexScreen');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={[tw`flex-1 justify-center items-center p-4`, { backgroundColor: '#1b1b1b' }]}>
      <Text style={[tw`text-3xl font-bold mb-6`, { color: '#fcbd00' }]}>Login</Text>
      <TextInput
        style={[tw`w-full p-3 mb-4 border rounded-lg`, { borderColor: '#e75793', color: '#10ccd0' }]}
        placeholder="Email"
        placeholderTextColor="#10ccd0"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[tw`w-full p-3 mb-4 border rounded-lg`, { borderColor: '#e75793', color: '#10ccd0' }]}
        placeholder="Password"
        placeholderTextColor="#10ccd0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} color="#e75793" />
    </View>
  );
}