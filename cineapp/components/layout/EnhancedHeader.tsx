'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function EnhancedHeader() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile quand on navigue
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { name: 'Accueil', path: '/', icon: HomeIcon },
    { name: 'Films', path: '/films', icon: FilmIcon },
    { name: 'Réservations', path: '/reservations', icon: TicketIcon },
    ...(user ? [{ name: 'Profil', path: '/profile', icon: UserIcon }] : []),
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass border-b border-[hsl(var(--border))] shadow-lg shadow-[hsl(var(--shadow-color)/0.1)]'
          : 'bg-[hsl(var(--bg)/0.6)] backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--primary))] rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-[hsl(var(--fg))] tracking-tight">
              Ciné<span className="text-gradient">APP</span>
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] shadow-sm'
                      : 'text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))] hover:bg-[hsl(var(--bg-subtle))]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-[hsl(var(--fg-muted))] px-2">
                  {user.username}
                </span>
                <button
                  onClick={logout}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium
                    bg-[hsl(var(--danger)/0.1)] text-[hsl(var(--danger))]
                    hover:bg-[hsl(var(--danger)/0.2)] transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-sm font-medium
                    text-[hsl(var(--fg-muted))] hover:text-[hsl(var(--fg))]
                    hover:bg-[hsl(var(--bg-subtle))] transition-all"
                >
                  Connexion
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold
                    bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))]
                    hover:brightness-110 shadow-md transition-all"
                >
                  S'inscrire
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl
                bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg))]
                hover:bg-[hsl(var(--bg-card-hover))] transition-colors"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-[hsl(var(--border))]">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))]'
                      : 'text-[hsl(var(--fg-muted))] hover:bg-[hsl(var(--bg-subtle))] hover:text-[hsl(var(--fg))]'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}

            <div className="border-t border-[hsl(var(--border))] mt-2 pt-2">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-[hsl(var(--fg-muted))]">
                    Connecté : {user.username}
                  </div>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 text-left rounded-xl text-sm font-medium
                      text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger)/0.1)] transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="px-4 py-3 text-center rounded-xl text-sm font-medium
                      bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg))] hover:bg-[hsl(var(--bg-card-hover))] transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-3 text-center rounded-xl text-sm font-semibold
                      bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] hover:brightness-110 transition-all"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ── Icônes inline ── */
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function FilmIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
    </svg>
  );
}

function TicketIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}
