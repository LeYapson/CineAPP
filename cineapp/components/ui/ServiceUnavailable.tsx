'use client';

interface ServiceUnavailableProps {
  /** Nom de la fonctionnalité affectée (ex: "le catalogue de films") */
  feature?: string;
  /** Afficher un bouton pour réessayer */
  onRetry?: () => void;
  /** Style compact (inline dans une page) ou pleine page */
  compact?: boolean;
}

export default function ServiceUnavailable({
  feature,
  onRetry,
  compact = false,
}: ServiceUnavailableProps) {
  const message = feature
    ? `La fonctionnalité « ${feature} » est temporairement indisponible.`
    : 'Cette fonctionnalité est temporairement indisponible.';

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 px-4 rounded-2xl
        bg-[hsl(var(--bg-card))] border border-[hsl(var(--border))]">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl
          bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning,40_100%_50%))]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M11.42 15.17l-1.42-.88a1.18 1.18 0 01-.42-.91V9.59c0-.37.17-.72.42-.91l1.42-.88a1.18 1.18 0 011.16 0l1.42.88c.25.19.42.54.42.91v3.79c0 .37-.17.72-.42.91l-1.42.88a1.18 1.18 0 01-1.16 0z" />
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-sm text-[hsl(var(--fg-muted))] text-center">{message}</p>
        <p className="text-xs text-[hsl(var(--fg-muted)/0.7)] text-center">
          Nos équipes travaillent à rétablir le service. Veuillez réessayer ultérieurement.
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-1 px-4 py-2 text-sm font-medium rounded-xl
              bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))]
              hover:brightness-110 transition-all"
          >
            Réessayer
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icône maintenance */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl
          bg-[hsl(var(--warning,40_100%_50%)/0.1)] text-[hsl(var(--warning,40_100%_50%))]
          mx-auto">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M11.42 15.17l-1.42-.88a1.18 1.18 0 01-.42-.91V9.59c0-.37.17-.72.42-.91l1.42-.88a1.18 1.18 0 011.16 0l1.42.88c.25.19.42.54.42.91v3.79c0 .37-.17.72-.42.91l-1.42.88a1.18 1.18 0 01-1.16 0z" />
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[hsl(var(--fg))]">
            Service en maintenance
          </h2>
          <p className="text-[hsl(var(--fg-muted))]">{message}</p>
          <p className="text-sm text-[hsl(var(--fg-muted)/0.7)]">
            Nos équipes travaillent à rétablir le service. Veuillez réessayer dans quelques instants.
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 font-medium rounded-xl
              bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))]
              hover:brightness-110 transition-all"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  );
}
