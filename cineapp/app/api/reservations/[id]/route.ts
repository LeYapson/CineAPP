import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';
import { deleteReservation } from '@/lib/api/reservations-store';

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
 * DELETE /api/reservations/[id]
 * Supprime une réservation de l'utilisateur authentifié.
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const { id } = await params;

  let deleted: boolean;
  try {
    deleted = await deleteReservation(userId, id);
  } catch (err) {
    console.error('Erreur suppression réservation:', err);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression' },
      { status: 500 }
    );
  }

  if (!deleted) {
    return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
