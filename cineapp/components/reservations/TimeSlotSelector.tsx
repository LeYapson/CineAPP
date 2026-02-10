'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TimeSlot } from '@/lib/types/session';
import { reservationAPI } from '@/lib/api/reservation';

interface TimeSlotSelectorProps {
  movieId: number;
  movieTitle: string;
  posterUrl?: string;
}

export default function TimeSlotSelector({ movieId, movieTitle, posterUrl }: TimeSlotSelectorProps) {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Générer les dates pour les 7 prochains jours
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };

  const dates = generateDates();

  useEffect(() => {
    const fetchTimeSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Utiliser les données mock pour le développement
        const slots = await reservationAPI.getMockTimeSlots(movieId, selectedDate);
        setTimeSlots(slots);
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Erreur lors du chargement des créneaux horaires');
        console.error('Erreur chargement time slots:', err);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchTimeSlots();
    }
  }, [movieId, selectedDate]);

  const handleDateSelect = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    setSelectedTimeSlot(timeSlot);
  };

  const handleContinue = () => {
    if (selectedTimeSlot) {
      router.push(`/reservations/${selectedTimeSlot.sessionId}?movieId=${movieId}`);
    }
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    return date.toLocaleDateString('fr-FR', options);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sélectionnez une séance</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Informations du film */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {posterUrl && (
              <div className="relative aspect-[2/3] bg-gray-200">
                <img
                  src={posterUrl}
                  alt={movieTitle}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">{movieTitle}</h2>
              <p className="text-gray-600 mb-4">
                Sélectionnez une date et un horaire pour réserver vos places.
              </p>
              
              {selectedTimeSlot && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-blue-800">Séance sélectionnée</p>
                  <p className="text-blue-600">{selectedTimeSlot.formattedTime}</p>
                  <p className="text-sm text-gray-600">
                    {selectedTimeSlot.availableSeats} places disponibles
                  </p>
                  <p className="text-sm text-gray-600">
                    {selectedTimeSlot.format} • {selectedTimeSlot.language}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sélection de date et horaire */}
        <div className="lg:col-span-2">
          {/* Sélection de date */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Choisissez une date</h2>
            <div className="grid grid-cols-7 gap-2">
              {dates.map((date, index) => {
                const dateStr = date.toISOString().split('T')[0];
                const isSelected = dateStr === selectedDate;
                const isPastDate = date < new Date();
                
                return (
                  <button
                    key={index}
                    onClick={() => !isPastDate && handleDateSelect(date)}
                    disabled={isPastDate}
                    className={`p-3 rounded-lg transition-colors text-center ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : isPastDate
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="text-xs font-semibold">{formatDate(date).split(' ')[0].substring(0, 3)}</div>
                    <div className="text-lg font-bold">{date.getDate()}</div>
                    <div className="text-xs">{formatDate(date).split(' ')[2].substring(0, 3)}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sélection d'horaire */}
          {selectedDate ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">Choisissez un horaire</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Chargement des horaires...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                  <p className="text-red-700">{error}</p>
                  <button
                    onClick={() => {
                      const date = new Date(selectedDate);
                      handleDateSelect(date);
                    }}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Réessayer
                  </button>
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {timeSlots.map((timeSlot) => {
                    const isSelected = selectedTimeSlot?.sessionId === timeSlot.sessionId;
                    
                    return (
                      <button
                        key={timeSlot.sessionId}
                        onClick={() => handleTimeSlotSelect(timeSlot)}
                        className={`p-4 border rounded-lg transition-colors ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-semibold">{timeSlot.formattedTime}</p>
                            <p className="text-sm text-gray-600 mt-1">
                              {timeSlot.availableSeats} places disponibles
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-blue-600">
                              {timeSlot.price.toFixed(2)}€
                            </p>
                            <div className="flex gap-1 mt-1">
                              {timeSlot.format && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {timeSlot.format}
                                </span>
                              )}
                              {timeSlot.language && (
                                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                  {timeSlot.language}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Aucune séance disponible pour cette date.</p>
                  <p className="text-gray-500 mt-2">Veuillez choisir une autre date.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Veuillez sélectionner une date pour voir les horaires disponibles.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bouton de continuation */}
      {selectedTimeSlot && (
        <div className="mt-8 sticky bottom-4 bg-white py-4 border-t">
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Continuer la réservation
          </button>
        </div>
      )}
    </div>
  );
}