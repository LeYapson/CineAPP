'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function LoginForm() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(formData.username, formData.password);
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else {
        router.push('/');
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-[hsl(var(--fg))] mb-1.5">
          Nom d&apos;utilisateur
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))]
            bg-[hsl(var(--input-bg))] text-[hsl(var(--fg))] placeholder:text-[hsl(var(--fg-subtle))]
            focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent
            transition-shadow text-sm"
          placeholder="votre_pseudo"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--fg))] mb-1.5">
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))]
            bg-[hsl(var(--input-bg))] text-[hsl(var(--fg))] placeholder:text-[hsl(var(--fg-subtle))]
            focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent
            transition-shadow text-sm"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-[hsl(var(--danger)/0.08)]
          border border-[hsl(var(--danger)/0.2)] text-[hsl(var(--danger))] text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>
            {error.includes('Invalid credentials') || error.includes('Identifiants incorrects')
              ? 'Nom d\'utilisateur ou mot de passe incorrect.'
              : error.includes('réseau') || error.includes('serveur')
              ? 'Problème de connexion au serveur.'
              : error}
          </span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl font-semibold text-sm text-[hsl(var(--accent-fg))]
          bg-[hsl(var(--accent))] hover:brightness-110 transition-all
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2
          focus:ring-offset-[hsl(var(--bg-card))]"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-[hsl(var(--accent-fg)/0.3)] border-t-[hsl(var(--accent-fg))] rounded-full animate-spin" />
            Connexion…
          </span>
        ) : 'Se connecter'}
      </button>

      {/* Link */}
      <p className="text-center text-sm text-[hsl(var(--fg-muted))]">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-medium text-[hsl(var(--accent))] hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </form>
  );
}