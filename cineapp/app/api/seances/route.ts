import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/config/api';

const SEANCES_URL = API_CONFIG.SEANCES_SERVICE;

/** GET /api/seances — proxy vers le micro-service */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filmId = searchParams.get('filmId');

    const res = await fetch(`${SEANCES_URL}/seances`, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error(`Erreur micro-service séances: ${res.status}`);
      return NextResponse.json(
        { error: 'Le service des séances est temporairement indisponible' },
        { status: 502 }
      );
    }

    let seances = await res.json();

    // Filtrer par filmId si fourni
    if (filmId) {
      seances = seances.filter((s: { filmId: number }) => s.filmId === parseInt(filmId));
    }

    return NextResponse.json(seances);
  } catch (error) {
    console.error('Erreur proxy séances:', error);
    return NextResponse.json(
      { error: 'Impossible de contacter le service de séances' },
      { status: 502 }
    );
  }
}

/** POST /api/seances — créer une séance */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const res = await fetch(`${SEANCES_URL}/seances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`Erreur création séance: ${res.status}`, text);
      return NextResponse.json(
        { error: 'Impossible de créer la séance. Le service est temporairement indisponible.' },
        { status: 502 }
      );
    }

    const seance = await res.json();
    return NextResponse.json(seance, { status: 201 });
  } catch (error) {
    console.error('Erreur création séance:', error);
    return NextResponse.json(
      { error: 'Impossible de créer la séance' },
      { status: 502 }
    );
  }
}
