'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { filmsAPI } from '@/lib/api/films';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [popularMovies, setPopularMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        const response = await filmsAPI.getPopularMovies(1, 'fr-FR');
        setPopularMovies(response.results.slice(0, 6));
      } catch (err) {
        setError('Impossible de charger les films populaires');
        console.error('Erreur chargement films:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  const featuredMovie = popularMovies[0];

  return (
    <div className="min-h-screen -mt-20">
      {/* ── Hero Section ── */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(222,47%,4%)] via-[hsl(220,50%,12%)] to-[hsl(222,47%,6%)]" />
        
        {featuredMovie && (
          <div className="absolute inset-0">
            <img
              src={featuredMovie.backdrop || '/placeholder-film.jpg'}
              alt=""
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--bg))] via-[hsl(222,47%,6%)/80%] to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
              bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent))] text-sm font-medium border border-[hsl(var(--accent)/0.3)]">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
              Votre cinéma en ligne
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-5 leading-tight"
          >
            L'expérience cinéma
            <br />
            <span className="text-gradient">réinventée</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-[hsl(215,20%,70%)] mb-8 max-w-xl mx-auto"
          >
            Découvrez, réservez et vivez le cinéma en seulement quelques clics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/films"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5
                bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))] rounded-xl font-bold text-base
                hover:brightness-110 shadow-lg shadow-[hsl(var(--accent)/0.3)] transition-all active:scale-[0.97]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
              Explorer les films
            </Link>
            <Link
              href="/reservations"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5
                bg-transparent border-2 border-white/20 text-white rounded-xl font-semibold text-base
                hover:bg-white/10 hover:border-white/40 transition-all active:scale-[0.97]"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
              Réserver
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      </section>

      {/* ── Films populaires ── */}
      <section className="py-16 px-4 bg-[hsl(var(--bg))]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--fg))]">
                Films populaires
              </h2>
              <p className="text-[hsl(var(--fg-muted))] mt-1">Les plus vus en ce moment</p>
            </div>
            <Link
              href="/films"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium
                text-[hsl(var(--primary-text))] hover:underline"
            >
              Tout voir
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="skeleton aspect-[2/3] rounded-xl" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-[hsl(var(--danger))] mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[hsl(var(--danger))] text-white rounded-xl font-medium hover:brightness-110 transition-all"
              >
                Réessayer
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {popularMovies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <Link href={`/films/${movie.id}`} className="group block">
                    <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-[hsl(var(--bg-subtle))]
                      ring-1 ring-[hsl(var(--border))] group-hover:ring-[hsl(var(--accent)/0.5)]
                      shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      <img
                        src={movie.poster || '/placeholder-film.jpg'}
                        alt={movie.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Rating badge */}
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-lg
                        bg-black/60 backdrop-blur-sm text-white text-xs font-bold">
                        <svg className="w-3 h-3 text-[hsl(var(--accent))]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {movie.vote_average?.toFixed(1) || 'N/A'}
                      </div>

                      {/* Title overlay on hover */}
                      <div className="absolute bottom-0 left-0 right-0 p-3
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-semibold line-clamp-2">{movie.title}</p>
                      </div>
                    </div>
                    <div className="mt-2.5 px-0.5">
                      <h3 className="text-sm font-semibold text-[hsl(var(--fg))] line-clamp-1 group-hover:text-[hsl(var(--primary-text))] transition-colors">
                        {movie.title}
                      </h3>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Pourquoi CineAPP ── */}
      <section className="py-16 px-4 bg-[hsl(var(--bg-elevated))]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--fg))] mb-3">
              Pourquoi choisir CineAPP ?
            </h2>
            <p className="text-[hsl(var(--fg-muted))] max-w-lg mx-auto">
              Une expérience simplifiée, de la découverte à votre siège.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🎬', title: 'Large catalogue', desc: 'Blockbusters, indépendants, classiques — tout y est.' },
              { icon: '⚡', title: 'Réservation rapide', desc: 'En 2 clics, choisissez votre film, votre séance et vos places.' },
              { icon: '🔒', title: 'Paiement sécurisé', desc: 'Transactions chiffrées et multiples moyens de paiement.' },
              { icon: '📱', title: 'E-billets', desc: 'Recevez vos billets par email, présentez-les sur votre téléphone.' },
              { icon: '💎', title: 'Expérience premium', desc: 'Salles confortables, image et son exceptionnels.' },
              { icon: '🎁', title: 'Offres exclusives', desc: 'Réductions et avantages réservés à nos membres.' },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl border border-[hsl(var(--border))]
                  bg-[hsl(var(--bg-card))] hover:bg-[hsl(var(--bg-card-hover))]
                  hover:border-[hsl(var(--border-hover))] transition-all duration-300"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-base font-semibold text-[hsl(var(--fg))] mb-1.5">{feature.title}</h3>
                <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-10 rounded-3xl bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(220,80%,40%)]
            shadow-2xl shadow-[hsl(var(--primary)/0.25)]">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Prêt à vivre l'expérience ?
            </h2>
            <p className="text-blue-100 mb-7 max-w-md mx-auto">
              Réservez vos places dès maintenant et profitez du cinéma.
            </p>
            <Link
              href="/films"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[hsl(var(--primary))]
                rounded-xl font-bold text-base hover:bg-blue-50 transition-all active:scale-[0.97] shadow-lg"
            >
              Voir les films
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
