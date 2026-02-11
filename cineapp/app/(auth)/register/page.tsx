import RegisterForm from '@/components/auth/RegisterForm';
import Link from 'next/link';

export const metadata = {
  title: 'Inscription - CineApp',
  description: 'Créez votre compte CineApp',
};

export default function RegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-[hsl(var(--fg))]">
            <span className="w-10 h-10 rounded-xl bg-[hsl(var(--accent))] flex items-center justify-center text-[hsl(var(--accent-fg))] text-lg font-bold">C</span>
            CineApp
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-[hsl(var(--fg))]">
            Créez votre compte
          </h1>
          <p className="mt-1 text-sm text-[hsl(var(--fg-muted))]">
            Déjà membre ?{' '}
            <Link href="/login" className="font-medium text-[hsl(var(--accent))] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>

        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-6 sm:p-8 shadow-sm">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}