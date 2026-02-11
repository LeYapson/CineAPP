'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ProfileContent() {
  const { user, logout } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[hsl(var(--fg))]">Mon profil</h1>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl text-sm font-medium
            bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg-muted))]
            hover:bg-[hsl(var(--bg-card-hover))] hover:text-[hsl(var(--fg))] transition-colors"
        >
          Déconnexion
        </button>
      </div>

      {user ? (
        <div className="space-y-6">
          {/* Info card */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-6">
            {/* Avatar + name */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[hsl(var(--border))]">
              <div className="w-16 h-16 rounded-2xl bg-[hsl(var(--accent)/0.15)]
                flex items-center justify-center text-[hsl(var(--accent))] text-2xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-lg font-bold text-[hsl(var(--fg))]">{user.username}</p>
                <p className="text-sm text-[hsl(var(--fg-muted))]">{user.email}</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-[hsl(var(--fg-subtle))] uppercase tracking-wider">Nom d&apos;utilisateur</p>
                <p className="font-medium text-[hsl(var(--fg))] mt-0.5">{user.username}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-[hsl(var(--fg-subtle))] uppercase tracking-wider">Email</p>
                <p className="font-medium text-[hsl(var(--fg))] mt-0.5">{user.email}</p>
              </div>
              {user.firstName && (
                <div>
                  <p className="text-xs font-medium text-[hsl(var(--fg-subtle))] uppercase tracking-wider">Prénom</p>
                  <p className="font-medium text-[hsl(var(--fg))] mt-0.5">{user.firstName}</p>
                </div>
              )}
              {user.lastName && (
                <div>
                  <p className="text-xs font-medium text-[hsl(var(--fg-subtle))] uppercase tracking-wider">Nom</p>
                  <p className="font-medium text-[hsl(var(--fg))] mt-0.5">{user.lastName}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-6 space-y-3">
            <h2 className="text-sm font-semibold text-[hsl(var(--fg))] mb-3">Actions</h2>
            <Link
              href="/profile/reservations"
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl
                bg-[hsl(var(--accent)/0.1)] text-[hsl(var(--accent))] font-medium
                hover:bg-[hsl(var(--accent)/0.2)] transition-colors"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                Mes réservations
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <button
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-left
                bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg-muted))] font-medium
                hover:bg-[hsl(var(--bg-card-hover))] hover:text-[hsl(var(--fg))] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Modifier le profil
            </button>
            <button
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-left
                bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg-muted))] font-medium
                hover:bg-[hsl(var(--bg-card-hover))] hover:text-[hsl(var(--fg))] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Changer le mot de passe
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-[hsl(var(--fg-muted))]">
          Chargement des informations…
        </div>
      )}
    </div>
  );
}