import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { login } from './modules/users/services/user.service';
import tw from 'tailwind-react-native-classnames';

export default function Index() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await login(email, password);
      console.log('User:', user);
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={tw`flex-1 justify-center items-center p-4 bg-blue-100`}>
      <Text style={tw`text-3xl font-bold mb-6 text-blue-800`}>Login</Text>
      <TextInput
        style={tw`w-full p-3 mb-4 border border-gray-400 rounded-lg`}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={tw`w-full p-3 mb-4 border border-gray-400 rounded-lg`}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}