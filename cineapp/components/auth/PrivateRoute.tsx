'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, error } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login') {
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-[hsl(var(--accent))] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-sm w-full rounded-2xl border border-[hsl(var(--danger)/0.3)]
          bg-[hsl(var(--danger)/0.05)] p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-[hsl(var(--danger)/0.1)]
            flex items-center justify-center text-[hsl(var(--danger))]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-[hsl(var(--fg))] font-medium mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="px-5 py-2.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] rounded-xl font-medium
              hover:brightness-110 transition-all"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}