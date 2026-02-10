import { NextResponse } from 'next/server';
import { authAPI } from '@/lib/api/auth';

export async function GET(request: Request) {
  const accessToken = request.headers.get('Authorization')?.replace('Bearer ', '');

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Non autorisé - Token manquant' },
      { status: 401 }
    );
  }

  try {
    const user = await authAPI.getCurrentUser(accessToken);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Erreur API Profile:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du profil' },
      { status: 500 }
    );
  }
}