// Types pour les séances de cinéma

export interface CinemaRoom {
  id: number;
  name: string;
  capacity: number;
  description?: string;
  features?: string[]; // Ex: ["3D", "Dolby Atmos", "Accessible"]
}

export interface MovieSession {
  id: number;
  movieId: number;
  roomId: number;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  availableSeats: number;
  totalSeats: number;
  price: number;
  format?: string; // "2D", "3D", "IMAX", etc.
  language?: string; // "VF", "VO", etc.
  room?: CinemaRoom;
  movie?: {
    id: number;
    title: string;
    poster?: string;
    duration?: number;
  };
}

export interface SessionListResponse {
  sessions: MovieSession[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'reserved' | 'selected' | 'unavailable';
  type?: 'standard' | 'premium' | 'accessible';
  price?: number;
}

export interface SeatMap {
  roomId: number;
  sessionId: number;
  seats: Seat[];
  rows: string[];
  seatsPerRow: number;
}

export interface Reservation {
  id: string;
  userId: string;
  sessionId: number;
  seats: Seat[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  updatedAt: string;
  paymentStatus?: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: string;
  session?: MovieSession;
}

export interface CreateReservationRequest {
  sessionId: number;
  seatIds: string[];
  paymentMethod?: string;
  userData?: {
    email: string;
    phone?: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface ReservationResponse {
  reservation: Reservation;
  paymentUrl?: string;
  qrCode?: string;
}

export interface TimeSlot {
  time: string;
  formattedTime: string;
  sessionId: number;
  availableSeats: number;
  price: number;
  format?: string;
  language?: string;
}

export interface SessionFilter {
  movieId?: number;
  date?: string;
  roomId?: number;
  format?: string;
  language?: string;
  minAvailableSeats?: number;
}