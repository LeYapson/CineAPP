'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            🎬 CineApp
          </Link>
          
          <div className="flex gap-8 items-center">
            <Link 
              href="/" 
              className="text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Accueil
            </Link>
            <Link 
              href="/films" 
              className="text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Films
            </Link>
            
            {!loading && user ? (
              <>
                <Link 
                  href="/reservations" 
                  className="text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Réserver
                </Link>
                <Link 
                  href="/profile" 
                  className="text-lg hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium"
                >
                  Mon compte
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold text-white"
                  disabled={loading}
                >
                  {loading ? 'Déconnexion...' : 'Déconnexion'}
                </button>
              </>
            ) : (
              <Link 
                href="/login" 
                className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-white"
              >
                Connexion
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}