# Cine Score 🎬

Aplicación móvil para descubrir, reseñar y gestionar películas. Los usuarios pueden explorar películas populares, escribir reseñas con calificaciones, mantener una lista de películas pendientes (watchlist) y ver las opiniones de otros usuarios.

## Características principales

- 🔐 Autenticación de usuarios (registro e inicio de sesión)
- 🎥 Exploración de películas populares y en cartelera
- 🔍 Búsqueda de películas
- ⭐ Sistema de reseñas con calificación y detección de spoilers
- 📋 Lista de películas por ver (Watchlist)
- 👤 Perfil de usuario con historial de reseñas
- ❤️ Sistema de likes en reseñas

## Tecnologías utilizadas

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | [Expo](https://expo.dev) (SDK 52) |
| **Lenguaje** | TypeScript |
| **UI** | React Native |
| **Navegación** | Expo Router (file-based routing) |
| **Autenticación** | Firebase Authentication |
| **Almacenamiento local** | AsyncStorage |
| **Estilos** | Tailwind React Native Classnames |
| **Animaciones** | React Native Reanimated, React Native Animatable |
| **Gráficos** | React Native Chart Kit, React Native SVG |
| **Componentes UI** | React Native Vector Icons, Expo Linear Gradient |

## APIs utilizadas

| API | Descripción |
|-----|-------------|
| **TMDB (The Movie Database)** | Obtención de información de películas, posters, calificaciones y búsqueda |
| **Backend propio** | API REST para gestión de usuarios, reseñas, watchlist y likes |
| **Firebase** | Autenticación de usuarios con email/contraseña |

## Instalación

1. Instalar dependencias

   ```bash
   npm install
   ```

2. Iniciar la aplicación

   ```bash
   npx expo start
   ```

## Comandos disponibles

```bash
npm start          # Inicia el servidor de desarrollo
npm run android    # Inicia en Android
npm run ios        # Inicia en iOS
npm run web        # Inicia en navegador web
npm run lint       # Ejecuta el linter
npm test           # Ejecuta los tests
```

## Estructura del proyecto

```
app/
├── common/           # Componentes, interfaces y utilidades compartidas
├── modules/
│   ├── auth/         # Autenticación (login, registro)
│   ├── movies/       # Películas (listado, detalle, reseñas, watchlist)
│   └── users/        # Perfil de usuario
├── _layout.tsx       # Layout principal con navegación
└── index.tsx         # Pantalla inicial
```

## Aprender más

- [Documentación de Expo](https://docs.expo.dev/)
- [Tutorial de Expo](https://docs.expo.dev/tutorial/introduction/)
- [TMDB API Documentation](https://developers.themoviedb.org/3)
