import PrivateRoute from '@/components/auth/PrivateRoute';
import Link from 'next/link';
import HelpButtons from '@/components/reservations/HelpButtons';

export const metadata = {
  title: 'Confirmation de réservation - CineApp',
  description: 'Votre réservation a été confirmée',
};

interface ConfirmationParams {
  seanceId?: string;
  seats?: string;
  movieTitle?: string;
  salle?: string;
  horaire?: string;
}

interface ReservationConfirmationPageProps {
  searchParams: Promise<ConfirmationParams>;
}

function ReservationConfirmationContent({
  seatCount,
  movieTitle,
  salle,
  horaire,
}: {
  seatCount: number;
  movieTitle: string;
  salle: string;
  horaire: string;
}) {
  const PRICE_PER_SEAT = 9.99;
  const total = seatCount * PRICE_PER_SEAT;

  const formatFullDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      });
    } catch {
      return 'Date inconnue';
    }
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '--:--';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[hsl(var(--bg-card))] rounded-2xl border border-[hsl(var(--border))] overflow-hidden shadow-lg">

          {/* Header de confirmation */}
          <div className="bg-[hsl(var(--success))] p-8 text-center text-white">
            <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Réservation confirmée !</h1>
            <p className="mt-2 text-white/80">Votre réservation a été enregistrée avec succès.</p>
          </div>

          {/* Contenu */}
          <div className="p-6 space-y-6">

            {/* Référence */}
            <div className="text-center py-3">
              <span className="inline-block bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))] px-5 py-2 rounded-xl font-semibold text-sm tracking-wide">
                Réf. #{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
              </span>
            </div>

            {/* Résumé */}
            <div>
              <h2 className="text-lg font-semibold text-[hsl(var(--fg))] mb-4 pb-2 border-b border-[hsl(var(--border))]">
                Résumé de votre réservation
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--fg-muted))]">Film</span>
                  <span className="font-medium text-[hsl(var(--fg))]">{movieTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--fg-muted))]">Date</span>
                  <span className="font-medium text-[hsl(var(--fg))]">{formatFullDate(horaire)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--fg-muted))]">Horaire</span>
                  <span className="font-medium text-[hsl(var(--fg))]">{formatTime(horaire)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--fg-muted))]">Salle</span>
                  <span className="font-medium text-[hsl(var(--fg))]">Salle {salle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[hsl(var(--fg-muted))]">Nombre de places</span>
                  <span className="font-medium text-[hsl(var(--fg))]">{seatCount} place{seatCount > 1 ? 's' : ''}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[hsl(var(--border))]">
                  <span className="font-semibold text-[hsl(var(--fg))]">Prix total</span>
                  <span className="font-bold text-[hsl(var(--accent))]">
                    {total.toFixed(2)} €
                  </span>
                </div>
              </div>
            </div>

            {/* Prochaines étapes */}
            <div>
              <h2 className="text-lg font-semibold text-[hsl(var(--fg))] mb-4 pb-2 border-b border-[hsl(var(--border))]">
                Prochaines étapes
              </h2>
              <div className="space-y-4">
                {[
                  { n: 1, title: 'Vérifiez votre email', desc: 'Un email de confirmation avec votre billet électronique a été envoyé à votre adresse email.' },
                  { n: 2, title: 'Présentez votre billet', desc: 'Présentez le QR code de votre billet électronique à l\'entrée du cinéma.' },
                  { n: 3, title: 'Profitez du film !', desc: 'Arrivez 15 minutes avant la séance pour un accès sans stress.' },
                ].map((step) => (
                  <div key={step.n} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent))] flex items-center justify-center text-xs font-bold">
                      {step.n}
                    </div>
                    <div>
                      <p className="font-medium text-[hsl(var(--fg))]">{step.title}</p>
                      <p className="text-[hsl(var(--fg-muted))] text-sm">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-[hsl(var(--border))]">
              <Link
                href="/profile/reservations"
                className="flex-1 text-center px-6 py-3 rounded-xl font-medium text-sm
                  bg-[hsl(var(--bg-subtle))] text-[hsl(var(--fg-muted))]
                  hover:bg-[hsl(var(--bg-card-hover))] hover:text-[hsl(var(--fg))] transition-colors"
              >
                Voir mes réservations
              </Link>
              <Link
                href="/films"
                className="flex-1 text-center px-6 py-3 rounded-xl font-medium text-sm
                  bg-[hsl(var(--accent))] text-[hsl(var(--accent-fg))]
                  hover:brightness-110 transition-all"
              >
                Réserver un autre film
              </Link>
            </div>
          </div>

          {/* Aide */}
          <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--bg-subtle))] p-6">
            <h3 className="font-semibold text-[hsl(var(--fg))] mb-2">Besoin d&apos;aide ?</h3>
            <p className="text-[hsl(var(--fg-muted))] text-sm mb-4">
              Contactez notre service client si vous avez des questions concernant votre réservation.
            </p>
            <HelpButtons />
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ReservationConfirmationPage({ searchParams }: ReservationConfirmationPageProps) {
  const params = await searchParams;
  const seatCount = params.seats ? parseInt(params.seats) : 0;
  const movieTitle = params.movieTitle || 'Film';
  const salle = params.salle || '?';
  const horaire = params.horaire || new Date().toISOString();

  return (
    <PrivateRoute>
      <ReservationConfirmationContent
        seatCount={seatCount}
        movieTitle={movieTitle}
        salle={salle}
        horaire={horaire}
      />
    </PrivateRoute>
  );
}