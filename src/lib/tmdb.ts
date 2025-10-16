import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const imageUrl = {
  original: (path: string) => `${IMAGE_BASE_URL}/original${path}`,
  w500: (path: string) => `${IMAGE_BASE_URL}/w500${path}`,
  w300: (path: string) => `${IMAGE_BASE_URL}/w300${path}`,
};

export type Movie = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  media_type?: 'movie' | 'tv';
};

export type MovieDetails = Movie & {
  genres: { id: number; name: string }[];
  runtime?: number;
  number_of_seasons?: number;
  videos?: {
    results: {
      id: string;
      key: string;
      type: string;
      site: string;
    }[];
  };
};

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const tmdb = {
  getTrending: async () => {
    const response = await tmdbApi.get('/trending/all/week');
    return response.data.results as Movie[];
  },

  getNetflixOriginals: async () => {
    const response = await tmdbApi.get('/discover/tv', {
      params: {
        with_networks: 213,
      },
    });
    return response.data.results as Movie[];
  },

  getTopRated: async () => {
    const response = await tmdbApi.get('/movie/top_rated');
    return response.data.results as Movie[];
  },

  getActionMovies: async () => {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: 28,
      },
    });
    return response.data.results as Movie[];
  },

  getComedyMovies: async () => {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: 35,
      },
    });
    return response.data.results as Movie[];
  },

  getHorrorMovies: async () => {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: 27,
      },
    });
    return response.data.results as Movie[];
  },

  getRomanceMovies: async () => {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: 10749,
      },
    });
    return response.data.results as Movie[];
  },

  getDocumentaries: async () => {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: 99,
      },
    });
    return response.data.results as Movie[];
  },

  getMovieDetails: async (id: number, mediaType: 'movie' | 'tv' = 'movie') => {
    const response = await tmdbApi.get(`/${mediaType}/${id}`, {
      params: {
        append_to_response: 'videos',
      },
    });
    return response.data as MovieDetails;
  },

  searchMovies: async (query: string) => {
    const response = await tmdbApi.get('/search/multi', {
      params: {
        query,
      },
    });
    return response.data.results as Movie[];
  },
};
