import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import tw from "tailwind-react-native-classnames";
import Icon from "react-native-vector-icons/FontAwesome";
import { colors } from "../../../common/utils/constants";
import { useToast } from "@/app/common/components/Toast/useToast";
import { loginUser } from "../services/authServices";
import { StyleSheet } from "react-native";
import { FirebaseError } from "firebase/app";

interface FormField {
  value: string;
  error: string;
}

interface FormData {
  email: FormField;
  password: FormField;
}
export default function LoginScreen() {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    email: { value: "", error: "" },
    password: { value: "", error: "" },
  });

  const validateField = (name: keyof FormData, value: string) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value.trim()) {
          error = "El email es requerido";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "El email no es válido";
        }
        break;
      case "password":
        if (!value.trim()) {
          error = "La contraseña es requerida";
        } else if (value.length < 6) {
          error = "La contraseña debe tener al menos 6 caracteres";
        }
        break;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: { value: value.trim(), error },
    }));
  };

  const handleChange = (name: keyof FormData, value: string) => {
    validateField(name, value);
  };

  const isFormValid = () => {
    return (
      formData.email.value.trim() !== "" &&
      formData.password.value.trim() !== "" &&
      !formData.email.error &&
      !formData.password.error
    );
  };
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

  const handleLogin = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    try {
      await loginUser(formData.email.value, formData.password.value);
      showToast("¡Bienvenido de nuevo!", "success");
      router.push("/modules/movies/screens/MainScreen");
    } catch (error: unknown) {
      let errorMessage = "Ha ocurrido un error";

      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            errorMessage = "No existe una cuenta con este correo";
            break;
          case "auth/wrong-password":
            errorMessage = "Contraseña incorrecta";
            break;
          case "auth/too-many-requests":
            errorMessage = "Demasiados intentos. Inténtalo más tarde";
            break;
          case "auth/network-request-failed":
            errorMessage = "Error de conexión. Verifica tu internet";
            break;
          default:
            errorMessage = "Error al iniciar sesión. Inténtalo de nuevo";
        }
      }

      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[tw`flex-1`, { backgroundColor: colors["background-color"] }]}
    >
      <View style={tw`flex-1 justify-center px-6`}>
        <View style={tw`mb-12`}>
          <Text style={tw`text-4xl font-bold text-center mb-2 text-yellow-400`}>
            CineScore
          </Text>
          <Text style={[tw`text-lg text-center`, { color: colors.azul }]}>
            Iniciar Sesión
          </Text>
        </View>

        <View style={[styles.container]}>
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
                value={formData.email.value}
                onChangeText={(text) => handleChange("email", text)}
                onFocus={() => setFocusedInput("email")}
                onBlur={() => setFocusedInput(null)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {formData.email.error && (
                <Text style={[tw`text-red-500 text-sm mt-1 ml-1`]}>
                  {formData.email.error}
                </Text>
              )}
            </View>
          </View>

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
                placeholder="Tu contraseña"
                placeholderTextColor="#9ca3af"
                value={formData.password.value}
                onChangeText={(text) => handleChange("password", text)}
                onFocus={() => setFocusedInput("password")}
                onBlur={() => setFocusedInput(null)}
                secureTextEntry
              />
              {formData.password.error && (
                <Text style={[tw`text-red-500 text-sm mt-1 ml-1`]}>
                  {formData.password.error}
                </Text>
              )}
            </View>
          </View>

          <View style={[styles.buttonContainer]}>
            <TouchableOpacity
              style={[
                tw`w-full rounded-2xl py-4 px-6`,
                {
                  backgroundColor: colors.azul,
                  opacity: isFormValid() ? 1 : 0.5,
                  shadowColor: colors.azul,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  elevation: 6,
                },
              ]}
              onPress={handleLogin}
              disabled={!isFormValid() || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={tw`flex-row items-center justify-center`}>
                  <Icon
                    name="sign-in"
                    size={20}
                    color="#fff"
                    style={tw`mr-2`}
                  />
                  <Text style={tw`text-center text-white text-lg font-bold`}>
                    Iniciar Sesión
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                tw`w-full rounded-2xl py-4 px-6 border-2`,
                {
                  borderColor: colors.yellow,
                  backgroundColor: "rgba(252, 189, 0, 0.1)",
                },
              ]}
              onPress={() =>
                router.push("/modules/auth/screens/RegisterScreen")
              }
            >
              <View style={tw`flex-row items-center justify-center`}>
                <Icon
                  name="user-plus"
                  size={20}
                  color={colors.yellow}
                  style={tw`mr-2`}
                />
                <Text
                  style={[
                    tw`text-center text-lg font-bold`,
                    { color: colors.yellow },
                  ]}
                >
                  Crear cuenta
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32, // equivalente a space-y-8
  },
  buttonContainer: {
    gap: 24, // equivalente a space-y-6
    marginTop: 48, // mt-12
    marginBottom: 32, // mb-8
  },
});
