import { API_CONFIG } from '@/config/api';
import { Seance } from '@/lib/types/seance';

/**
 * Client API pour le micro-service de séances (Spring Boot)
 * Base URL : http://192.168.27.79:8082
 */
class SeancesAPI {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.SEANCES_SERVICE;
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
      const text = await response.text().catch(() => '');
      throw new Error(text || `Erreur API Séances: ${response.status}`);
    }

    return response.json();
  }

  /** GET /seances — toutes les séances */
  async getAllSeances(): Promise<Seance[]> {
    return this.fetchAPI<Seance[]>('/seances');
  }

  /** Séances filtrées par filmId (côté client) */
  async getSeancesByFilm(filmId: number): Promise<Seance[]> {
    const all = await this.getAllSeances();
    return all.filter((s) => s.filmId === filmId);
  }

  /** POST /seances — créer une séance */
  async createSeance(seance: Omit<Seance, 'id'>): Promise<Seance> {
    return this.fetchAPI<Seance>('/seances', {
      method: 'POST',
      body: JSON.stringify(seance),
    });
  }

  /** PUT /seances/{id} — mettre à jour une séance */
  async updateSeance(id: number, seance: Seance): Promise<Seance> {
    return this.fetchAPI<Seance>(`/seances/${id}`, {
      method: 'PUT',
      body: JSON.stringify(seance),
    });
  }

  /** DELETE /seances/{id} */
  async deleteSeance(id: number): Promise<void> {
    await fetch(`${this.baseURL}/seances/${id}`, { method: 'DELETE' });
  }

  /** POST /seances/{id}/reserver?nbPlaces=X — réserver des places */
  async reserverPlaces(seanceId: number, nbPlaces: number): Promise<Seance> {
    return this.fetchAPI<Seance>(
      `/seances/${seanceId}/reserver?nbPlaces=${nbPlaces}`,
      { method: 'POST' }
    );
  }

  /**
   * Récupère les séances d'un film.
   * Si aucune séance n'existe, en génère automatiquement pour les 7 prochains jours
   * via POST /seances (seed automatique — utile car le micro-service utilise H2 en mémoire).
   */
  async getOrCreateSeancesByFilm(filmId: number): Promise<Seance[]> {
    let seances = await this.getSeancesByFilm(filmId);

    if (seances.length === 0) {
      // Seed : créer des séances pour les 7 prochains jours
      seances = await this.seedSeancesForFilm(filmId);
    }

    return seances;
  }

  /** Génère et crée des séances pour un film sur les 7 prochains jours */
  private async seedSeancesForFilm(filmId: number): Promise<Seance[]> {
    const created: Seance[] = [];
    const now = new Date();

    const horaires = [14, 17, 20]; // 14h, 17h, 20h
    const salles = [1, 2, 3];

    for (let day = 0; day < 7; day++) {
      for (let i = 0; i < horaires.length; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + day);
        date.setHours(horaires[i], 0, 0, 0);

        // Ne pas créer de séances dans le passé
        if (date <= now) continue;

        const nombrePlaces = [80, 120, 100][i];

        try {
          const seance = await this.createSeance({
            filmId,
            numeroSalle: salles[i],
            horaire: date.toISOString(),
            nombrePlacesTotal: nombrePlaces,
            nombrePlacesRestantes: nombrePlaces,
          });
          created.push(seance);
        } catch (err) {
          console.error('Erreur seed séance:', err);
        }
      }
    }

    return created;
  }
}

export const seancesAPI = new SeancesAPI();
