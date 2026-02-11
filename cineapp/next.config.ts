import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Autoriser l'accès depuis n'importe quelle IP du réseau local en dev
  allowedDevOrigins: ['*'],

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
    ],
  },

  // Proxy : les appels client passent par Next.js (même origine → pas de CORS)
  async rewrites() {
    const FILMS_URL = process.env.NEXT_PUBLIC_FILMS_API_URL || 'http://192.168.0.185:8000';
    const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://192.168.0.78:3000';
    const SEANCES_URL = process.env.NEXT_PUBLIC_SEANCES_API_URL || 'http://192.168.27.79:8082';

    return [
      {
        source: '/proxy-films/:path*',
        destination: `${FILMS_URL}/:path*`,
      },
      {
        source: '/proxy-auth/:path*',
        destination: `${AUTH_URL}/:path*`,
      },
      {
        source: '/proxy-seances/:path*',
        destination: `${SEANCES_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
