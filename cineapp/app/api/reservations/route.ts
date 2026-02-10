import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json(
    { message: 'API Réservations - À implémenter' },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  return NextResponse.json(
    { message: 'Création de réservation - À implémenter' },
    { status: 201 }
  );
}