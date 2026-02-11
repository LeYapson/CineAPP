import PrivateRoute from '@/components/auth/PrivateRoute';
import Link from 'next/link';

export const metadata = {
  title: 'Mes commandes - CineApp',
  description: 'Consultez l\'historique de vos commandes',
};

function OrdersContent() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-[hsl(var(--fg))] mb-8">Mes commandes</h1>
      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--bg-card))] p-8 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[hsl(var(--bg-subtle))]
          flex items-center justify-center text-[hsl(var(--fg-subtle))]">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>
        <p className="text-[hsl(var(--fg-muted))] mb-5">
          Vous n&apos;avez pas encore passé de commandes.
        </p>
        <Link
          href="/films"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))]
            rounded-xl font-medium hover:brightness-110 transition-all"
        >
          Découvrir les films
        </Link>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <PrivateRoute>
      <OrdersContent />
    </PrivateRoute>
  );
}