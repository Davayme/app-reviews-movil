import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { registerUser } from "../services/authServices";
import { colors } from "../../../common/utils/constants";
import { MaterialIcons } from "@expo/vector-icons";

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
    <SafeAreaView style={[styles.flex1, { backgroundColor: colors["background-color"] }]}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>CineScore</Text>
            <Text style={styles.subtitle}>Crear nueva cuenta</Text>
          </View>
          <View style={styles.form}>
            {/* Input Nombre */}
            <View>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="person" size={18} color={colors.yellow} style={styles.icon} />
                <Text style={styles.inputLabel}>Nombre</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  getFocusedStyle("name", "#fcbd00"),
                ]}
                placeholder="Tu nombre"
                placeholderTextColor="#9ca3af"
                value={formData.name.value}
                onChangeText={(text) => handleChange("name", text)}
                onFocus={() => setFocusedInput("name")}
                onBlur={() => setFocusedInput(null)}
              />
              {formData.name.error && (
                <Text style={styles.errorText}>
                  {formData.name.error}
                </Text>
              )}
            </View>

            {/* Input Email */}
            <View>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="email" size={18} color={colors.azul} style={styles.icon} />
                <Text style={styles.inputLabel}>Correo electrónico</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
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
              {formData.email.error && (
                <Text style={styles.errorText}>
                  {formData.email.error}
                </Text>
              )}
            </View>

            {/* Input Password */}
            <View>
              <View style={styles.inputLabelContainer}>
                <MaterialIcons name="lock" size={18} color={colors.magenta} style={styles.icon} />
                <Text style={styles.inputLabel}>Contraseña</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
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
              {formData.password.error && (
                <Text style={styles.errorText}>
                  {formData.password.error}
                </Text>
              )}
            </View>

            <View style={styles.buttonContainer}>
              {/* Botón Registrarse */}
              <TouchableOpacity
                style={[
                  styles.registerButton,
                  {
                    opacity: !isFormValid() ? 0.5 : 1,
                  },
                ]}
                onPress={handleRegister}
                disabled={!isFormValid() || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.buttonContent}>
                    <Icon
                      name="user-plus"
                      size={20}
                      color="#fff"
                      style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>
                      Crear cuenta
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Botón Ya tengo cuenta */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => router.push("/modules/auth/screens/LoginScreen")}
              >
                <View style={styles.buttonContent}>
                  <Icon
                    name="sign-in"
                    size={20}
                    color={colors.magenta}
                    style={styles.buttonIcon}
                  />
                  <Text style={[styles.buttonText, { color: colors.magenta }]}>
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

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  scrollViewContent: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginTop: 24,
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: colors.yellow,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: colors.azul,
  },
  form: {
    gap: 32,
  },
  inputLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
  },
  errorText: {
    marginTop: 8,
    color: "#f87171",
    fontSize: 14,
    marginLeft: 4,
  },
  buttonContainer: {
    marginTop: 48,
    marginBottom: 32,
    gap: 24,
  },
  registerButton: {
    width: "100%",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: colors.azul,
    shadowColor: colors.azul,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  loginButton: {
    width: "100%",
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: colors.magenta,
    backgroundColor: "rgba(231, 87, 147, 0.1)",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
  },
});