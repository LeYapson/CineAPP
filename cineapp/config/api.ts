export const API_CONFIG = {
  FILMS_SERVICE: process.env.NEXT_PUBLIC_FILMS_API_URL || 'http://192.168.0.185:8000',
  AUTH_SERVICE: process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://192.168.0.78:3000',
  SEANCES_SERVICE: process.env.NEXT_PUBLIC_SEANCES_API_URL || 'http://192.168.27.79:8082',
};

// Log des URLs de configuration pour le débogage
if (typeof window !== 'undefined') {
  console.log('Configuration API chargée:', {
    FILMS_SERVICE: API_CONFIG.FILMS_SERVICE,
    AUTH_SERVICE: API_CONFIG.AUTH_SERVICE,
  });
  
  // Avertissement si les URLs semblent être des adresses locales
  if (API_CONFIG.FILMS_SERVICE.includes('192.168') || API_CONFIG.FILMS_SERVICE.includes('localhost')) {
    console.warn('⚠️ Attention: Le service de films utilise une URL locale. Assurez-vous que le serveur est accessible depuis ce réseau.');
  }
  
  if (API_CONFIG.AUTH_SERVICE.includes('192.168') || API_CONFIG.AUTH_SERVICE.includes('localhost')) {
    console.warn('⚠️ Attention: Le service d\'authentification utilise une URL locale. Assurez-vous que le serveur est accessible depuis ce réseau.');
  }
}