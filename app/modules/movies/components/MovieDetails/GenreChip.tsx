import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface GenreChipProps {
  genre: { id: number; name: string };
}

const genreStyles: { [key: number]: { color: string; emoji: string } } = {
  28: { color: '#FF5733', emoji: '🔥' }, // Acción
  12: { color: '#FFC300', emoji: '🌍' }, // Aventura
  16: { color: '#FF33FF', emoji: '🎨' }, // Animación
  35: { color: '#33FF57', emoji: '😂' }, // Comedia
  80: { color: '#900C3F', emoji: '🔪' }, // Crimen
  99: { color: '#C70039', emoji: '📚' }, // Documental
  18: { color: '#581845', emoji: '🎭' }, // Drama
  10751: { color: '#DAF7A6', emoji: '👨‍👩‍👧‍👦' }, // Familia
  14: { color: '#FFC0CB', emoji: '🧚' }, // Fantasía
  36: { color: '#FFD700', emoji: '🏛️' }, // Historia
  27: { color: '#8B0000', emoji: '👻' }, // Terror
  10402: { color: '#FF69B4', emoji: '🎵' }, // Música
  9648: { color: '#800080', emoji: '🕵️' }, // Misterio
  10749: { color: '#FF1493', emoji: '❤️' }, // Romance
  878: { color: '#00FFFF', emoji: '🚀' }, // Ciencia ficción
  10770: { color: '#FF4500', emoji: '📺' }, // Película de TV
  53: { color: '#808080', emoji: '🔍' }, // Suspense
  10752: { color: '#008000', emoji: '⚔️' }, // Bélica
  37: { color: '#A52A2A', emoji: '🤠' }, // Western
};

export const GenreChip: React.FC<GenreChipProps> = ({ genre }) => {
  const { color, emoji } = genreStyles[genre.id] || { color: '#FFF', emoji: '🎬' };

  return (
    <View style={[styles.chip, { backgroundColor: color }]}>
      <Text style={styles.chipText}>{emoji} {genre.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  chipText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
});