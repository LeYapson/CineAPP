'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Seat, SeatMap, MovieSession } from '@/lib/types/session';
import { reservationAPI } from '@/lib/api/reservation';
import { useAuth } from '@/context/AuthContext';

interface SeatSelectorProps {
  sessionId: number;
  movieId: number;
}

export default function SeatSelector({ sessionId, movieId }: SeatSelectorProps) {
  const [seatMap, setSeatMap] = useState<SeatMap | null>(null);
  const [session, setSession] = useState<MovieSession | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'seats' | 'confirmation'>('seats');
  const router = useRouter();
  const { user, accessToken } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Utiliser les données mock pour le développement
        const [seatMapData, sessionData] = await Promise.all([
          reservationAPI.getMockSeatMap(sessionId),
          reservationAPI.getMockSessions(movieId).then(response => {
            return response.sessions.find(s => s.id === sessionId) || null;
          })
        ]);

        setSeatMap(seatMapData);
        setSession(sessionData);
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement des données de réservation');
        console.error('Erreur chargement données réservation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sessionId, movieId]);

  const toggleSeatSelection = (seat: Seat) => {
    if (!seatMap || !session) return;

    // Ne pas permettre la sélection de sièges déjà réservés
    if (seat.status === 'reserved' || seat.status === 'unavailable') return;

    setSelectedSeats(prev => {
      // Vérifier si le siège est déjà sélectionné
      const isSelected = prev.some(s => s.id === seat.id);

      if (isSelected) {
        // Désélectionner le siège
        return prev.filter(s => s.id !== seat.id);
      } else {
        // Sélectionner le siège
        return [...prev, { ...seat, status: 'selected' as const }];
      }
    });
  };

  const getSeatStatus = (seatId: string): Seat['status'] => {
    const selectedSeat = selectedSeats.find(s => s.id === seatId);
    if (selectedSeat) return selectedSeat.status;
    
    const seat = seatMap?.seats.find(s => s.id === seatId);
    return seat?.status || 'unavailable';
  };

  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + (seat.price || 0), 0);
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      setError('Veuillez sélectionner au moins un siège');
      return;
    }
    setStep('confirmation');
  };

  const handleConfirmReservation = async () => {
    try {
      if (!session || !accessToken) return;

      // Préparer les données de réservation
      const reservationData = {
        sessionId: session.id,
        seatIds: selectedSeats.map(seat => seat.id),
        paymentMethod: 'cb', // Méthode de paiement par défaut
        userData: {
          email: user?.email || '',
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
        },
      };

      // En production, utiliser l'API réelle
      // const response = await reservationAPI.createReservation(reservationData, accessToken);

      // Pour le développement, simuler une réservation réussie
      console.log('Réservation simulée:', reservationData);

      // Redirection vers la page de confirmation
      router.push(`/reservations/confirmation?sessionId=${sessionId}&seats=${selectedSeats.length}`);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erreur lors de la création de la réservation');
      console.error('Erreur réservation:', err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des sièges...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg max-w-2xl mx-auto">
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/films')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Retour aux films
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!seatMap || !session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg max-w-2xl mx-auto">
          <p className="text-yellow-700 mb-4">
            Impossible de charger les données de la séance. Veuillez vérifier que la séance existe.
          </p>
          <button
            onClick={() => router.push('/films')}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
          >
            Retour aux films
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {step === 'seats' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de la séance */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
              <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">{session.movie?.title || 'Film inconnu'}</h1>
                
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Salle</span>
                    <span className="font-medium">{session.room?.name || 'Inconnue'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">
                      {new Date(session.startTime).toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Horaire</span>
                    <span className="font-medium">
                      {new Date(session.startTime).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })} - {new Date(session.endTime).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format</span>
                    <span className="font-medium">{session.format || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Langue</span>
                    <span className="font-medium">{session.language || 'VF'}</span>
                  </div>
                </div>
              </div>

              {/* Légende des sièges */}
              <div className="bg-gray-50 p-6 border-t">
                <h2 className="text-lg font-semibold mb-4">Légende</h2>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                    <span className="text-sm">Sélectionné</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
                    <span className="text-sm">Disponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
                    <span className="text-sm">Réservé</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded-sm"></div>
                    <span className="text-sm">Indisponible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-600 rounded-sm"></div>
                    <span className="text-sm">Premium</span>
                  </div>
                </div>
              </div>

              {/* Résumé de la sélection */}
              <div className="bg-white p-6 border-t">
                <h2 className="text-lg font-semibold mb-4">Votre sélection</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sièges</span>
                    <span className="font-medium">{selectedSeats.length} siège(s)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prix total</span>
                    <span className="font-bold text-blue-600">
                      {calculateTotalPrice().toFixed(2)} €
                    </span>
                  </div>
                  <button
                    onClick={handleContinue}
                    disabled={selectedSeats.length === 0}
                    className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                      selectedSeats.length === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Carte des sièges */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Sélectionnez vos sièges</h2>
              
              {/* Écran */}
              <div className="text-center mb-6">
                <div className="bg-gray-800 text-white py-2 rounded-t-lg mx-auto w-32 text-sm">
                  ÉCRAN
                </div>
              </div>

              {/* Grille des sièges */}
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full">
                  {seatMap.rows.map((row) => (
                    <div key={row} className="flex mb-2 justify-center">
                      <div className="w-8 text-center font-medium text-gray-600 mr-2">{row}</div>
                      {Array.from({ length: seatMap.seatsPerRow }, (_, i) => {
                        const seatId = `${row}${i + 1}`;
                        const status = getSeatStatus(seatId);
                        const seat = seatMap.seats.find(s => s.id === seatId);
                        
                        return (
                          <button
                            key={seatId}
                            onClick={() => toggleSeatSelection(seat!)}
                            disabled={status === 'reserved' || status === 'unavailable'}
                            className={`w-8 h-8 mx-1 rounded-sm flex items-center justify-center text-xs font-medium transition-colors ${
                              status === 'selected' ? 'bg-blue-600 text-white' :
                              status === 'available' ? 'bg-green-600 text-white hover:bg-green-700' :
                              status === 'reserved' ? 'bg-red-600 text-white cursor-not-allowed' :
                              'bg-gray-300 text-gray-500 cursor-not-allowed'
                            } ${
                              seat?.type === 'premium' && status !== 'reserved' ? 'border-2 border-yellow-500' : ''
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Numéros des sièges */}
              <div className="flex justify-center mt-4">
                <div className="w-8 mr-2"></div>
                {Array.from({ length: seatMap.seatsPerRow }, (_, i) => (
                  <div key={i} className="w-8 h-8 mx-1 flex items-center justify-center text-xs text-gray-500">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Étape de confirmation */
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-6">Confirmez votre réservation</h1>

            {/* Résumé de la réservation */}
            <div className="space-y-4 mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">Film</h2>
                <div className="flex items-center gap-4">
                  {session.movie?.poster && (
                    <img
                      src={session.movie.poster}
                      alt={session.movie.title}
                      className="w-16 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-medium">{session.movie?.title}</p>
                    <p className="text-sm text-gray-600">
                      {session.format} • {session.language} • {session.movie?.duration} min
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Séance</h2>
                <p className="text-gray-700">
                  {new Date(session.startTime).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })} à {new Date(session.startTime).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-gray-600 text-sm">
                  {session.room?.name} • {session.room?.features?.join(', ')}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Sièges</h2>
                <div className="flex flex-wrap gap-2">
                  {selectedSeats.map((seat) => (
                    <span
                      key={seat.id}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        seat.type === 'premium' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {seat.row}{seat.number}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-3">Prix</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sièges standard</span>
                    <span className="font-medium">
                      {selectedSeats.filter(seat => seat.type !== 'premium').length} × 
                      {selectedSeats.find(seat => seat.type !== 'premium')?.price?.toFixed(2) || '12.99'} €
                    </span>
                  </div>
                  {selectedSeats.some(seat => seat.type === 'premium') && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sièges premium</span>
                      <span className="font-medium">
                        {selectedSeats.filter(seat => seat.type === 'premium').length} × 
                        {selectedSeats.find(seat => seat.type === 'premium')?.price?.toFixed(2) || '18.99'} €
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-blue-600">{calculateTotalPrice().toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep('seats')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleConfirmReservation}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Confirmer la réservation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}