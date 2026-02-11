'use client';

export default function HelpButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={() => alert('Fonctionnalité à implémenter')}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
          bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg-muted))]
          hover:bg-[hsl(var(--bg-card-hover))] hover:text-[hsl(var(--fg))] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        Nous contacter
      </button>
      <button
        onClick={() => alert('Fonctionnalité à implémenter')}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
          bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg-muted))]
          hover:bg-[hsl(var(--bg-card-hover))] hover:text-[hsl(var(--fg))] transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Voir les CGV
      </button>
    </div>
  );
}