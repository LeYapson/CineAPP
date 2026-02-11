// Type de réservation stockée côté serveur
// Accessible depuis le web ET l'app mobile via l'API

export interface Reservation {
  id: string;              // UUID unique
  userId: string;          // ID de l'utilisateur (depuis le token JWT)
  seanceId: number;        // ID de la séance réservée
  movieTitle: string;      // Titre du film
  salle: number;           // Numéro de salle
  horaire: string;         // ISO date de la séance
  nbPlaces: number;        // Nombre de places
  seats: string[];         // Sièges choisis (ex: ["A3", "A4"])
  total: number;           // Prix total en €
  reference: string;       // Référence de réservation (6 chiffres)
  createdAt: string;       // ISO date de création
}

export interface CreateReservationRequest {
  seanceId: number;
  movieTitle: string;
  salle: number;
  horaire: string;
  nbPlaces: number;
  seats: string[];
  total: number;
}
