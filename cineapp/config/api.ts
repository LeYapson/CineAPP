/**
 * Configuration API.
 *
 * Côté SERVEUR (SSR / Route Handlers) : appels directs aux micro-services.
 * Côté CLIENT (navigateur)            : appels via le proxy Next.js rewrites
 *   → même origine, donc pas de CORS.
 */
const isServer = typeof window === 'undefined';

export const API_CONFIG = {
  FILMS_SERVICE: isServer
    ? (process.env.NEXT_PUBLIC_FILMS_API_URL || 'http://192.168.0.185:8000')
    : '/proxy-films',
  AUTH_SERVICE: isServer
    ? (process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://192.168.0.78:3000')
    : '/proxy-auth',
  SEANCES_SERVICE: isServer
    ? (process.env.NEXT_PUBLIC_SEANCES_API_URL || 'http://192.168.27.79:8082')
    : '/proxy-seances',
};