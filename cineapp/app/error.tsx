'use client';

import { useEffect } from 'react';
import ServiceUnavailable from '@/components/ui/ServiceUnavailable';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Erreur capturée par error boundary:', error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <ServiceUnavailable
        feature="cette page"
        onRetry={reset}
      />
    </div>
  );
}
