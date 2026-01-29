import axios from 'axios';
import type { ApiResponse, Movie, MovieDetail } from '../types/api';

// Use environment variable or fallback to a default (needs to be updated by user)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api.php';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getHome = async () => {
  const response = await api.get<ApiResponse<Movie[]>>('', {
    params: { action: 'home' },
  });
  return response.data;
};

export const getTrending = async () => {
  const response = await api.get<ApiResponse<Movie[]>>('', {
    params: { action: 'trending' },
  });
  return response.data;
};

export const getMovies = async (page = 1) => {
  const response = await api.get<ApiResponse<Movie[]>>('', {
    params: { action: 'movies', page },
  });
  return response.data;
};

export const getSeries = async (page = 1) => {
  const response = await api.get<ApiResponse<Movie[]>>('', {
    params: { action: 'series', page },
  });
  return response.data;
};

export const searchContent = async (query: string, page = 1) => {
  const response = await api.get<ApiResponse<Movie[]>>('', {
    params: { action: 'search', q: query, page },
  });
  return response.data;
};

export const getDetail = async (slug: string) => {
  const response = await api.get<ApiResponse<MovieDetail>>('', {
    params: { action: 'detail', slug },
  });
  return response.data;
};
