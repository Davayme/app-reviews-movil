// src/services/movieService.ts

export const getNowPlayingMovies = async (idUser: number, language: string, page: number, region: string) => {
  try {
    const response = await fetch(`http://localhost:3000/movies/now-playing?idUser=${idUser}&language=${language}&page=${page}&region=${region}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.results; // Devolver solo la propiedad results
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};