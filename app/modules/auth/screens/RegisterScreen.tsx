import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/FontAwesome";
import { registerUser } from "../services/authServices";
import { colors } from "../../../common/utils/constants";

export default function RegisterScreen() {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: { value: "", error: "" },
    email: { value: "", error: "" },
    password: { value: "", error: "" },
  });
  const [loading, setLoading] = useState(false);
  const getFocusedStyle = (fieldName: string, color: string) => ({
    backgroundColor: "#2d2d2d",
    color: "#fff",
    borderColor: focusedInput === fieldName ? color : "#374151",
    borderWidth: focusedInput === fieldName ? 2 : 1,
    shadowColor: focusedInput === fieldName ? color : "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: focusedInput === fieldName ? 0.7 : 0,
    shadowRadius: 8,
    elevation: focusedInput === fieldName ? 4 : 0,
  });
  const validateField = (name: string, value: string) => {
    let error = "";

    switch (name) {
      case "name":
        if (value.trim() === "") {
          error = "El nombre es requerido";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = "Correo electrónico inválido";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "La contraseña debe tener al menos 6 caracteres";
        } else if (!/^[A-Za-z0-9]+$/.test(value)) {
          error = "La contraseña solo puede contener letras y números";
        }
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: { value, error },
    }));
  };

  const handleChange = (name: string, value: string) => {
    validateField(name, value);
  };

  const isFormValid = () => {
    return Object.values(formData).every(
      (field) => field.value && !field.error
    );
  };

  const handleRegister = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    try {
      await registerUser(
        formData.email.value,
        formData.password.value,
        formData.name.value
      );
      router.push("/modules/auth/screens/LoginScreen");
    } catch (error: any) {
      setFormData((prev) => ({
        ...prev,
        email: { ...prev.email, error: error.message },
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[tw`flex-1`, { backgroundColor: colors["background-color"] }]}
    >
      <ScrollView
        contentContainerStyle={tw`flex-1 justify-center`}
        keyboardShouldPersistTaps="handled"
      >
        <View style={tw`px-6 py-8 mt-6`}>
          <View style={tw`mb-12`}>
            <Text
              style={tw`text-4xl font-bold text-center mb-2 text-yellow-400`}
            >
              CineScore
            </Text>
            <Text style={[tw`text-lg text-center`, { color: colors.azul }]}>
              Crear nueva cuenta
            </Text>
          </View>
          <View style={tw`space-y-8`}>
            {/* Input Nombre */}
            <View>
              <Text style={tw`text-white text-sm mb-3 ml-1`}>Nombre</Text>
              <View style={tw`relative`}>
                <View
                  style={tw`absolute inset-y-0 left-0 pl-4 flex items-center justify-center`}
                >
                  <Icon name="user" size={18} color={colors.yellow} />
                </View>
                <TextInput
                  style={[
                    tw`w-full rounded-xl pl-12 pr-4 py-4 text-base border`,
                    getFocusedStyle("name", "#fcbd00"),
                  ]}
                  placeholder="Tu nombre"
                  placeholderTextColor="#9ca3af"
                  value={formData.name.value}
                  onChangeText={(text) => handleChange("name", text)}
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {formData.name.error && (
                <Text style={tw`mt-2 text-red-400 text-sm ml-1`}>
                  {formData.name.error}
                </Text>
              )}
            </View>

            {/* Input Email - similar adjustments */}
            <View>
              <Text style={tw`text-white text-sm mb-3 ml-1`}>
                Correo electrónico
              </Text>
              <View style={tw`relative`}>
                <View
                  style={tw`absolute inset-y-0 left-0 pl-4 flex items-center justify-center`}
                >
                  <Icon name="envelope" size={18} color={colors.azul} />
                </View>
                <TextInput
                  style={[
                    tw`w-full rounded-xl pl-12 pr-4 py-4 text-base border`,
                    getFocusedStyle("email", "#10ccd0"),
                  ]}
                  placeholder="correo@ejemplo.com"
                  placeholderTextColor="#9ca3af"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email.value}
                  onChangeText={(text) => handleChange("email", text)}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {formData.email.error && (
                <Text style={tw`mt-2 text-red-400 text-sm ml-1`}>
                  {formData.email.error}
                </Text>
              )}
            </View>

            {/* Input Password - similar adjustments */}
            <View>
              <Text style={tw`text-white text-sm mb-3 ml-1`}>Contraseña</Text>
              <View style={tw`relative`}>
                <View
                  style={tw`absolute inset-y-0 left-0 pl-4 flex items-center justify-center`}
                >
                  <Icon name="lock" size={18} color={colors.magenta} />
                </View>
                <TextInput
                  style={[
                    tw`w-full rounded-xl pl-12 pr-4 py-4 text-base border`,
                    getFocusedStyle("password", "#e75793"),
                  ]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  value={formData.password.value}
                  onChangeText={(text) => handleChange("password", text)}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
              {formData.password.error && (
                <Text style={tw`mt-2 text-red-400 text-sm ml-1`}>
                  {formData.password.error}
                </Text>
              )}
            </View>

            <View style={tw`mt-12 mb-8 space-y-6`}>
              {/* Botón Registrarse */}
              <TouchableOpacity
                style={[
                  tw`w-full rounded-2xl py-4 px-6`,
                  {
                    backgroundColor: colors.azul,
                    opacity: !isFormValid() ? 0.5 : 1,
                    shadowColor: colors.azul,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 5,
                    elevation: 6,
                  },
                ]}
                onPress={handleRegister}
                disabled={!isFormValid() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={tw`flex-row items-center justify-center`}>
                    <Icon
                      name="user-plus"
                      size={20}
                      color="#fff"
                      style={tw`mr-2`}
                    />
                    <Text style={tw`text-center text-white text-lg font-bold`}>
                      Crear cuenta
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Botón Ya tengo cuenta */}
              <TouchableOpacity
                style={[
                  tw`w-full rounded-2xl py-4 px-6 border-2 mt-4`,
                  {
                    borderColor: colors.magenta,
                    backgroundColor: "rgba(231, 87, 147, 0.1)",
                  },
                ]}
                onPress={() => router.push("/modules/auth/screens/LoginScreen")}
              >
                <View style={tw`flex-row items-center justify-center`}>
                  <Icon
                    name="sign-in"
                    size={20}
                    color={colors.magenta}
                    style={tw`mr-2`}
                  />
                  <Text
                    style={[
                      tw`text-center text-lg font-bold`,
                      { color: colors.magenta },
                    ]}
                  >
                    Ya tengo una cuenta
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
