'use client';

import { useAuth } from '@/context/AuthContext';

export default function ProfileContent() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mon profil</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Déconnexion
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {user ? (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-700">Informations personnelles</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Nom d'utilisateur</p>
                  <p className="font-medium">{user.username}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                {user.firstName && (
                  <div>
                    <p className="text-gray-600 text-sm">Prénom</p>
                    <p className="font-medium">{user.firstName}</p>
                  </div>
                )}
                {user.lastName && (
                  <div>
                    <p className="text-gray-600 text-sm">Nom de famille</p>
                    <p className="font-medium">{user.lastName}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <h2 className="text-xl font-semibold text-gray-700">Compte</h2>
              <div className="mt-4 space-y-3">
                <button
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Modifier le profil
                </button>
                <button
                  className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Changer le mot de passe
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">Chargement des informations...</p>
        )}
      </div>
    </div>
  );
}