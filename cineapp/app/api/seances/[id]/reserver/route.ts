import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

const SEANCES_URL = API_CONFIG.SEANCES_SERVICE;

/** POST /api/seances/[id]/reserver?nbPlaces=X */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const nbPlaces = searchParams.get('nbPlaces');

    if (!nbPlaces || isNaN(parseInt(nbPlaces))) {
      return NextResponse.json(
        { error: 'Paramètre nbPlaces manquant ou invalide' },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${SEANCES_URL}/seances/${id}/reserver?nbPlaces=${nbPlaces}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return NextResponse.json(
        { error: text || `Erreur réservation: ${res.status}` },
        { status: res.status }
      );
    }

    const seance = await res.json();
    return NextResponse.json(seance);
  } catch (error) {
    console.error('Erreur réservation:', error);
    return NextResponse.json(
      { error: 'Impossible de réserver' },
      { status: 502 }
    );
  }
}
