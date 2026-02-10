import PrivateRoute from '@/components/auth/PrivateRoute';
import Link from 'next/link';
import HelpButtons from '@/components/reservations/HelpButtons';

export const metadata = {
  title: 'Confirmation de réservation - CineApp',
  description: 'Votre réservation a été confirmée',
};

interface ReservationConfirmationPageProps {
  searchParams: {
    sessionId?: string;
    seats?: string;
  };
}

function ReservationConfirmationContent({ searchParams }: ReservationConfirmationPageProps) {
  const sessionId = searchParams.sessionId;
  const seatCount = searchParams.seats ? parseInt(searchParams.seats) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header de confirmation */}
          <div className="bg-green-600 text-white p-6 text-center">
            <div className="text-4xl mb-2">✅</div>
            <h1 className="text-2xl font-bold">Réservation confirmée !</h1>
            <p className="mt-2">Votre réservation a été enregistrée avec succès.</p>
          </div>

          {/* Détails de la réservation */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Informations générales */}
              <div className="text-center py-4">
                <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold">
                  Référence: #{Math.floor(Math.random() * 1000000)}
                </div>
              </div>

              {/* Résumé de la réservation */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Résumé de votre réservation</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre de sièges</span>
                    <span className="font-medium">{seatCount} siège(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date de la séance</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix total</span>
                    <span className="font-bold text-blue-600">
                      {(seatCount * 12.99).toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Prochaines étapes */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">Prochaines étapes</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Vérifiez votre email</p>
                      <p className="text-gray-600 text-sm">
                        Un email de confirmation avec votre billet électronique a été envoyé à votre adresse email.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Présentez votre billet</p>
                      <p className="text-gray-600 text-sm">
                        Présentez le QR code de votre billet électronique à l'entrée du cinéma.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Profitez du film !</p>
                      <p className="text-gray-600 text-sm">
                        Arrivez 15 minutes avant la séance pour un accès sans stress.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                <Link
                  href="/profile/orders"
                  className="flex-1 text-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Voir mes réservations
                </Link>
                <Link
                  href="/films"
                  className="flex-1 text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Réserver un autre film
                </Link>
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Besoin d'aide ?</h3>
            <p className="text-gray-600 mb-3">
              Contactez notre service client si vous avez des questions concernant votre réservation.
            </p>
            <HelpButtons />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReservationConfirmationPage({ searchParams }: ReservationConfirmationPageProps) {
  return (
    <PrivateRoute>
      <ReservationConfirmationContent searchParams={searchParams} />
    </PrivateRoute>
  );
}