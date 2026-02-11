'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', firstName: '', lastName: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        setLoading(false);
        return;
      }

      await register({
        username: formData.username, email: formData.email,
        password: formData.password, firstName: formData.firstName,
        lastName: formData.lastName,
      });

      setSuccess(true);
      setTimeout(() => {
        const redirectPath = localStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin');
          router.push(redirectPath);
        } else {
          router.push('/');
        }
      }, 2000);
    } catch (err) {
      const error = err as Error;
      if (error.message.includes('409') || error.message.includes('déjà utilisé')) {
        setError('Ce nom d\'utilisateur ou cet email est déjà utilisé.');
      } else if (error.message.includes('400') || error.message.includes('invalides')) {
        setError('Les informations fournies sont invalides.');
      } else if (error.message.includes('API') || error.message.includes('network')) {
        setError('Impossible de contacter le serveur.');
      } else {
        setError(error.message || 'Erreur lors de l\'inscription.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-6">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[hsl(var(--success)/0.1)]
          flex items-center justify-center text-[hsl(var(--success))]">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-lg font-semibold text-[hsl(var(--fg))]">Inscription réussie !</p>
        <p className="text-sm text-[hsl(var(--fg-muted))] mt-1">Redirection en cours…</p>
      </div>
    );
  }

  const inputClass = `w-full px-4 py-3 rounded-xl border border-[hsl(var(--border))]
    bg-[hsl(var(--input-bg))] text-[hsl(var(--fg))] placeholder:text-[hsl(var(--fg-subtle))]
    focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent
    transition-shadow text-sm`;

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-[hsl(var(--fg))] mb-1.5">
          Nom d&apos;utilisateur <span className="text-[hsl(var(--danger))]">*</span>
        </label>
        <input id="username" name="username" type="text" autoComplete="username" required
          className={inputClass} placeholder="votre_pseudo"
          value={formData.username} onChange={handleChange} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[hsl(var(--fg))] mb-1.5">
          Email <span className="text-[hsl(var(--danger))]">*</span>
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required
          className={inputClass} placeholder="vous@exemple.com"
          value={formData.email} onChange={handleChange} />
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-[hsl(var(--fg))] mb-1.5">
            Prénom
          </label>
          <input id="firstName" name="firstName" type="text" autoComplete="given-name"
            className={inputClass} placeholder="Jean"
            value={formData.firstName} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-[hsl(var(--fg))] mb-1.5">
            Nom
          </label>
          <input id="lastName" name="lastName" type="text" autoComplete="family-name"
            className={inputClass} placeholder="Dupont"
            value={formData.lastName} onChange={handleChange} />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[hsl(var(--fg))] mb-1.5">
          Mot de passe <span className="text-[hsl(var(--danger))]">*</span>
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" required
          className={inputClass} placeholder="6 caractères minimum"
          value={formData.password} onChange={handleChange} />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-[hsl(var(--danger)/0.08)]
          border border-[hsl(var(--danger)/0.2)] text-[hsl(var(--danger))] text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
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
            Inscription…
          </span>
        ) : 'S\'inscrire'}
      </button>

      {/* Terms */}
      <p className="text-center text-xs text-[hsl(var(--fg-subtle))]">
        En vous inscrivant, vous acceptez nos{' '}
        <Link href="#" className="text-[hsl(var(--accent))] hover:underline">
          Conditions d&apos;utilisation
        </Link>{' '}
        et notre{' '}
        <Link href="#" className="text-[hsl(var(--accent))] hover:underline">
          Politique de confidentialité
        </Link>.
      </p>
    </form>
  );
}