import axios, { AxiosError, AxiosResponse } from 'axios';
import { AuthService } from './auth';
import { toast } from '@/hooks/use-toast';
import { env } from '@/lib/env';

// Configuration de base de l'API
export const api = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = AuthService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs et le refresh des tokens
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await AuthService.refreshToken();
        const newToken = AuthService.getAccessToken();
        
        if (newToken && originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Si le refresh échoue, rediriger vers la page de connexion
        AuthService.logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Afficher les erreurs avec toast
    if (error.response?.status !== 401) {
      const errorData = error.response?.data as { message?: string };
      const message = errorData?.message || 'Une erreur est survenue';
      toast({
        title: 'Erreur',
        description: message,
        variant: 'destructive',
      });
    }

    return Promise.reject(error);
  }
);

export default api;