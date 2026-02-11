'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api/auth';

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  // Ajoutez d'autres champs utilisateur si nécessaire
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Charger l'utilisateur au démarrage si un token existe
  useEffect(() => {
    const checkInitialAuth = async () => {
      try {
        // Vérifier si un token existe dans localStorage
        const token = localStorage.getItem('accessToken');
        if (token) {
          await checkAuth();
        }
      } catch (err) {
        console.error('Erreur de vérification initiale:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkInitialAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Aucun token trouvé');
      }

      // Récupérer les informations utilisateur
      const userData = await authAPI.getCurrentUser(token);
      
      setUser(userData);
      setAccessToken(token);
      
      return;
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Session expirée. Veuillez vous reconnecter.');
      console.error('Erreur de vérification d\'authentification:', err);
      await logout();
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      console.log('Début de la tentative de connexion pour:', username);
      const response = await authAPI.login({ username, password });
      
      console.log('Tokens reçus:', {
        accessToken: response.accessToken ? '****' : 'null',
        refreshToken: response.refreshToken ? '****' : 'null'
      });

      // Stockage sécurisé des tokens
      // Utiliser les tokens normalisés (accessToken/refreshToken)
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Récupérer les informations utilisateur
      const userData = await authAPI.getCurrentUser(response.accessToken);
      
      console.log('Données utilisateur récupérées:', userData);
      setUser(userData);
      setAccessToken(response.accessToken);
      
      // Redirection vers la page d'accueil ou la page précédente
      router.push('/');
      
    } catch (err) {
      const error = err as Error;
      console.error('Erreur complète de connexion:', err);
      setError(error.message || 'Identifiants incorrects. Veuillez réessayer.');
      // Ne pas throw l'erreur ici pour éviter les doublons dans les logs
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userData);
      
      // Stockage sécurisé des tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Essayer de récupérer les informations utilisateur
      // Si le backend ne retourne pas d'utilisateur, créer un objet utilisateur minimal
      try {
        const registeredUser = await authAPI.getCurrentUser(response.accessToken);
        setUser(registeredUser);
      } catch (userError) {
        // Si on ne peut pas récupérer l'utilisateur, créer un objet minimal
        console.warn('Impossible de récupérer les informations utilisateur:', userError);
        const minimalUser = {
          id: 'temp-id',
          username: userData.username,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
        };
        setUser(minimalUser);
      }
      
      setAccessToken(response.accessToken);
      
      // Ne pas faire de redirection ici - laisser le composant gérer cela
      return {
        success: true,
        user: user,
        accessToken: response.accessToken,
      };
      
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
      console.error('Erreur d\'inscription:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Récupérer le refresh token pour le logout
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (err) {
      console.error('Erreur lors de la déconnexion:', err);
    } finally {
      // Supprimer les tokens et réinitialiser l'état
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setAccessToken(null);
      
      // Redirection vers la page de connexion
      router.push('/login');
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      if (!accessToken) {
        throw new Error('Utilisateur non authentifié');
      }

      // Appel à l'API pour mettre à jour l'utilisateur
      const updatedUser = await authAPI.getCurrentUser(accessToken); // À remplacer par l'API de mise à jour réelle
      
      setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
      
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la mise à jour du profil.');
      console.error('Erreur de mise à jour utilisateur:', err);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        error,
        login,
        register,
        logout,
        checkAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
}