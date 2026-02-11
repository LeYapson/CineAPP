import { API_CONFIG } from '@/config/api';

export interface LoginResponse {
  access_token?: string; // Format du backend
  accessToken?: string; // Format normalisé
  refresh_token?: string; // Format du backend
  refreshToken?: string; // Format normalisé
  token?: string; // Format simplifié
  user?: {
    id: string;
    username: string;
    email: string;
    // Ajoutez d'autres champs utilisateur si nécessaire
  };
  [key: string]: any; // Pour les autres champs éventuels
}

export interface RegisterResponse {
  access_token?: string; // Format du backend
  accessToken?: string; // Format alternatif
  refresh_token?: string; // Format du backend
  refreshToken?: string; // Format alternatif
  token?: string; // Format simplifié
  user?: {
    id: string;
    username: string;
    email: string;
  };
  [key: string]: any; // Pour les autres champs éventuels
}

class AuthAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.AUTH_SERVICE;
  }

  private async fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log(`Appel API: ${options.method || 'GET'} ${url}`);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Ajouter pour gérer les cookies si nécessaire
      });

      console.log(`Réponse API: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        // Gestion spécifique pour les erreurs 401
        if (response.status === 401) {
          try {
            const errorData = await response.json();
            console.error('Erreur 401 - Données d\'erreur:', errorData);
            // Message spécifique pour les credentials invalides
            if (errorData.message && errorData.message.includes('Invalid credentials')) {
              throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
            } else if (errorData.error && errorData.error.includes('invalid')) {
              throw new Error('Identifiants incorrects');
            } else {
              throw new Error(errorData.message || errorData.error || 'Authentification échouée');
            }
          } catch (e) {
            // Si on ne peut pas parser le JSON pour une erreur 401
            throw new Error('Nom d\'utilisateur ou mot de passe incorrect');
          }
        }
        
        try {
          const errorData = await response.json();
          console.error('Données d\'erreur du backend:', errorData);
          // Vérifier si le backend retourne un message d'erreur spécifique
          if (errorData.message) {
            throw new Error(errorData.message);
          } else if (errorData.error) {
            throw new Error(errorData.error);
          } else if (errorData.detail) {
            throw new Error(errorData.detail);
          } else {
            throw new Error(`Erreur API Auth: ${response.status}`);
          }
        } catch (e) {
          // Si on ne peut pas parser le JSON, utiliser un message générique
          const textError = await response.text().catch(() => response.statusText);
          throw new Error(`Erreur API Auth: ${response.status} - ${textError}`);
        }
      }

      const data = await response.json();
      console.log('Données de réponse:', data);
      return data;
    } catch (error) {
      console.error('Erreur réseau complète:', error);
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion réseau.');
        } else if (error.message.includes('NetworkError')) {
          throw new Error('Problème de réseau. Veuillez vérifier votre connexion.');
        }
      }
      throw new Error(`Erreur réseau: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    console.log('Tentative de connexion avec:', credentials.username);
    
    try {
      const response = await this.fetchAPI<RegisterResponse>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      console.log('Réponse brute du backend:', response);
      
      // Normaliser la réponse pour utiliser accessToken/refreshToken
      const normalizedResponse = {
        ...response,
        accessToken: response.access_token || response.accessToken || response.token,
        refreshToken: response.refresh_token || response.refreshToken || response.token,
        user: response.user || null,
      };
      
      // Vérifier que la réponse normalisée contient bien les tokens
      if (!normalizedResponse.accessToken || !normalizedResponse.refreshToken) {
        console.error('Réponse du backend login:', response);
        throw new Error('Réponse de connexion invalide - tokens manquants. Format attendu: {access_token, refresh_token}');
      }
      
      console.log('Connexion réussie, tokens obtenus');
      return normalizedResponse as LoginResponse;
    } catch (error) {
      console.error('Erreur détaillée de connexion:', error);
      throw error;
    }
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    phoneNumber?: string;
  }): Promise<RegisterResponse> {
    // Validation des données avant envoi
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error('Le nom d\'utilisateur, l\'email et le mot de passe sont requis');
    }

    if (userData.password.length < 6) {
      throw new Error('Le mot de passe doit contenir au moins 6 caractères');
    }

    // Formatage des données pour le backend
    const formattedData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      ...(userData.firstName && { firstName: userData.firstName }),
      ...(userData.lastName && { lastName: userData.lastName }),
      ...(userData.birthDate && { birthDate: userData.birthDate }),
      ...(userData.phoneNumber && { phoneNumber: userData.phoneNumber }),
    };

    try {
      const response = await this.fetchAPI<RegisterResponse>('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(formattedData),
      });
      
      // Normaliser la réponse pour utiliser accessToken/refreshToken
      // Votre backend utilise access_token et refresh_token (avec underscore)
      const normalizedResponse = {
        ...response,
        accessToken: response.access_token || response.accessToken || response.token,
        refreshToken: response.refresh_token || response.refreshToken || response.token,
      };
      
      // Vérifier que la réponse normalisée contient bien les tokens
      if (!normalizedResponse.accessToken || !normalizedResponse.refreshToken) {
        console.error('Réponse du backend:', response);
        throw new Error('Réponse d\'inscription invalide - tokens manquants. Format attendu: {access_token, refresh_token}');
      }
      
      return normalizedResponse;
    } catch (error) {
      // Améliorer le message d'erreur
      const err = error as Error;
      
      // Essayer de parser la réponse d'erreur si c'est une réponse HTTP
      try {
        if (err.message.includes('Failed to fetch')) {
          throw new Error('Impossible de contacter le serveur. Veuillez vérifier votre connexion.');
        }
        
        // Extraire le message d'erreur du backend si disponible
        const errorResponse = JSON.parse(err.message.replace('Error: ', ''));
        if (errorResponse && errorResponse.message) {
          throw new Error(errorResponse.message);
        }
      } catch (e) {
        // Si on ne peut pas parser, utiliser le message par défaut
      }
      
      if (err.message.includes('400')) {
        throw new Error('Les informations fournies sont invalides. Veuillez vérifier vos données.');
      } else if (err.message.includes('409')) {
        throw new Error('Ce nom d\'utilisateur ou cet email est déjà utilisé.');
      } else if (err.message.includes('500')) {
        throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        throw new Error(err.message || 'Erreur lors de l\'inscription. Veuillez réessayer plus tard.');
      }
    }
  }

  async logout(refreshToken: string): Promise<void> {
    return this.fetchAPI<void>('/api/v1/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    return this.fetchAPI<{ accessToken: string }>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async checkAvailability(field: 'username' | 'email', value: string): Promise<{ available: boolean }> {
    return this.fetchAPI<{ available: boolean }>(`/api/v1/auth/check-availability?${field}=${encodeURIComponent(value)}`);
  }

  async getCurrentUser(accessToken: string): Promise<any> {
    return this.fetchAPI<any>('/api/v1/users/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }
}

export const authAPI = new AuthAPI();