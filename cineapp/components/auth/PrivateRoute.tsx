'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si le chargement est terminé et qu'il n'y a pas d'utilisateur, rediriger
    if (!loading && !user) {
      // Stocker la page actuelle pour la redirection après connexion
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      router.push('/login');
    }
  }, [user, loading, router]);

  // Afficher un loader pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Afficher une erreur si nécessaire
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500 text-2xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-red-700 font-medium">
                {error}
              </p>
              <button
                onClick={() => router.push('/login')}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si tout est bon, afficher les enfants
  return <>{children}</>;
}