import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';
import {
  getReservationsByUser,
  createReservation,
} from '@/lib/api/reservations-store';

/**
 * Extraire l'userId depuis le token JWT via le micro-service auth.
 * Le mobile et le web envoient le même header Authorization: Bearer <token>.
 */
async function getUserIdFromToken(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  try {
    const res = await fetch(`${API_CONFIG.AUTH_SERVICE}/api/v1/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return null;
    const user = await res.json();
    return user.id || user._id || user.sub || null;
  } catch {
    return null;
  }
}

/**
 * GET /api/reservations
 * Retourne toutes les réservations de l'utilisateur authentifié.
 * Header requis : Authorization: Bearer <token>
 */
export async function GET(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const reservations = await getReservationsByUser(userId);
  return NextResponse.json(reservations);
}

/**
 * POST /api/reservations
 * Crée une nouvelle réservation pour l'utilisateur authentifié.
 * Header requis : Authorization: Bearer <token>
 * Body : { seanceId, movieTitle, salle, horaire, nbPlaces, seats, total }
 */
export async function POST(req: NextRequest) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  try {
    const body = await req.json();

    const { seanceId, movieTitle, salle, horaire, nbPlaces, seats, total } = body;

    if (!seanceId || !movieTitle || !salle || !horaire || !nbPlaces || !seats || !total) {
      return NextResponse.json(
        { error: 'Données de réservation incomplètes' },
        { status: 400 }
      );
    }

    const reservation = await createReservation(userId, {
      seanceId,
      movieTitle,
      salle,
      horaire,
      nbPlaces,
      seats,
      total,
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (err) {
    console.error('Erreur création réservation:', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la réservation' },
      { status: 500 }
    );
  }
}
