import { API_CONFIG } from '@/config/api';
import { 
  MovieSession, 
  SessionListResponse, 
  SeatMap, 
  Reservation, 
  ReservationResponse, 
  CreateReservationRequest,
  TimeSlot,
  SessionFilter,
  Seat 
} from '@/lib/types/session';

class ReservationAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.RESERVATIONS_SERVICE;
  }

  private async fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur API Réservations: ${response.status}`);
    }

    return response.json();
  }

  // Récupérer les séances pour un film spécifique
  async getSessionsByMovie(movieId: number, filters?: SessionFilter): Promise<SessionListResponse> {
    const params = new URLSearchParams();
    
    if (filters) {
      if (filters.date) params.append('date', filters.date);
      if (filters.format) params.append('format', filters.format);
      if (filters.language) params.append('language', filters.language);
      if (filters.minAvailableSeats) params.append('minAvailableSeats', filters.minAvailableSeats.toString());
    }
    
    const query = params.toString();
    return this.fetchAPI<SessionListResponse>(`/api/sessions/movie/${movieId}${query ? `?${query}` : ''}`);
  }

  // Récupérer les séances pour une date spécifique
  async getSessionsByDate(date: string): Promise<SessionListResponse> {
    return this.fetchAPI<SessionListResponse>(`/api/sessions/date/${date}`);
  }

  // Récupérer les détails d'une séance
  async getSessionDetails(sessionId: number): Promise<MovieSession> {
    return this.fetchAPI<MovieSession>(`/api/sessions/${sessionId}`);
  }

  // Récupérer la carte des sièges pour une séance
  async getSeatMap(sessionId: number): Promise<SeatMap> {
    return this.fetchAPI<SeatMap>(`/api/sessions/${sessionId}/seats`);
  }

  // Créer une réservation
  async createReservation(
    reservationData: CreateReservationRequest,
    accessToken?: string
  ): Promise<ReservationResponse> {
    return this.fetchAPI<ReservationResponse>('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
      headers: {
        ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
      },
    });
  }

  // Récupérer les réservations d'un utilisateur
  async getUserReservations(accessToken: string): Promise<Reservation[]> {
    return this.fetchAPI<Reservation[]>('/api/reservations/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  // Récupérer les détails d'une réservation
  async getReservationDetails(reservationId: string, accessToken: string): Promise<Reservation> {
    return this.fetchAPI<Reservation>(`/api/reservations/${reservationId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  // Annuler une réservation
  async cancelReservation(reservationId: string, accessToken: string): Promise<Reservation> {
    return this.fetchAPI<Reservation>(`/api/reservations/${reservationId}/cancel`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
  }

  // Récupérer les créneaux horaires disponibles pour un film
  async getTimeSlots(movieId: number, date: string): Promise<TimeSlot[]> {
    return this.fetchAPI<TimeSlot[]>(`/api/sessions/${movieId}/timeslots?date=${date}`);
  }

  // Récupérer les salles de cinéma
  async getCinemaRooms(): Promise<{ rooms: { id: number; name: string }[] }> {
    return this.fetchAPI<{ rooms: { id: number; name: string }[] }>('/api/rooms');
  }

  // Mock data pour le développement (à supprimer en production)
  async getMockSessions(movieId: number): Promise<SessionListResponse> {
    // Générer des données mock pour le développement
    const mockSessions: MovieSession[] = [];
    const now = new Date();
    
    // Générer des séances pour les 7 prochains jours
    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      
      // 3 séances par jour
      for (let j = 0; j < 3; j++) {
        const hour = 14 + j * 4; // 14h, 18h, 22h
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(startTime);
        endTime.setHours(hour + 2, 30, 0, 0); // Durée moyenne d'un film
        
        mockSessions.push({
          id: Math.floor(Math.random() * 1000000),
          movieId,
          roomId: j + 1,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          availableSeats: Math.floor(Math.random() * 50) + 10,
          totalSeats: 100,
          price: 12.99,
          format: j === 0 ? '3D' : '2D',
          language: 'VF',
          room: {
            id: j + 1,
            name: `Salle ${j + 1}`,
            capacity: 100,
            features: j === 0 ? ['3D', 'Dolby Atmos'] : ['Dolby Digital'],
          },
          movie: {
            id: movieId,
            title: 'Film Mock',
            poster: '/placeholder-film.jpg',
            duration: 150,
          },
        });
      }
    }
    
    return {
      sessions: mockSessions,
      total: mockSessions.length,
      page: 1,
      totalPages: 1,
    };
  }

  async getMockSeatMap(sessionId: number): Promise<SeatMap> {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 12;
    const seats: Seat[] = [];
    
    // Générer des sièges
    rows.forEach((row, rowIndex) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        const statuses = ['available', 'available', 'available', 'reserved'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        
        seats.push({
          id: `${row}${i}`,
          row,
          number: i,
          status: randomStatus as 'available' | 'reserved' | 'selected' | 'unavailable',
          type: rowIndex < 2 ? 'premium' : 'standard',
          price: rowIndex < 2 ? 18.99 : 12.99,
        });
      }
    });
    
    return {
      roomId: 1,
      sessionId,
      seats,
      rows,
      seatsPerRow,
    };
  }

  async getMockTimeSlots(movieId: number, date: string): Promise<TimeSlot[]> {
    const timeSlots = [
      { time: '14:00', formattedTime: '14:00', sessionId: 1, availableSeats: 45, price: 12.99, format: '2D', language: 'VF' },
      { time: '18:00', formattedTime: '18:00', sessionId: 2, availableSeats: 32, price: 14.99, format: '3D', language: 'VF' },
      { time: '22:00', formattedTime: '22:00', sessionId: 3, availableSeats: 28, price: 12.99, format: '2D', language: 'VO' },
    ];
    
    return timeSlots;
  }
}

export const reservationAPI = new ReservationAPI();