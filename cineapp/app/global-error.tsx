'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur globale capturée:', error);
  }, [error]);

  return (
    <html lang="fr">
      <body className="bg-[#0a0a0a] text-white flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full text-center space-y-6 px-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl
            bg-amber-500/10 text-amber-500 mx-auto">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Une erreur inattendue est survenue
            </h2>
            <p className="text-gray-400">
              Le site rencontre actuellement un problème technique. Nos équipes en sont informées.
            </p>
          </div>

          <button
            onClick={reset}
            className="px-6 py-2.5 font-medium rounded-xl bg-indigo-600 text-white
              hover:bg-indigo-500 transition-all"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
