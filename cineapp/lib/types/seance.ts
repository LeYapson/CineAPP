// Types correspondant au micro-service de séances (Spring Boot)
// Swagger : http://192.168.27.79:8082/v3/api-docs

export interface Seance {
  id: number;
  filmId: number;
  numeroSalle: number;
  horaire: string; // ISO date string
  nombrePlacesTotal: number;
  nombrePlacesRestantes: number;
}

export interface CreateSeanceRequest {
  filmId: number;
  numeroSalle: number;
  horaire: string;
  nombrePlacesTotal: number;
  nombrePlacesRestantes: number;
}
