import { promises as fs } from 'fs';
import path from 'path';
import { Reservation } from '@/lib/types/reservation';

/**
 * Stockage fichier JSON simple côté serveur.
 * Pour un projet en production, remplacer par une vraie BDD.
 * Le fichier est créé automatiquement s'il n'existe pas.
 */

const DATA_DIR = path.join(process.cwd(), 'data');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readReservations(): Promise<Reservation[]> {
  await ensureDataDir();
  try {
    const content = await fs.readFile(RESERVATIONS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

async function writeReservations(reservations: Reservation[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(RESERVATIONS_FILE, JSON.stringify(reservations, null, 2), 'utf-8');
}

export async function getReservationsByUser(userId: string): Promise<Reservation[]> {
  const all = await readReservations();
  return all
    .filter((r) => r.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createReservation(
  userId: string,
  data: Omit<Reservation, 'id' | 'userId' | 'createdAt' | 'reference'>
): Promise<Reservation> {
  const all = await readReservations();

  const reservation: Reservation = {
    id: crypto.randomUUID(),
    userId,
    ...data,
    reference: Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),
    createdAt: new Date().toISOString(),
  };

  all.push(reservation);
  await writeReservations(all);
  return reservation;
}

export async function deleteReservation(userId: string, reservationId: string): Promise<boolean> {
  const all = await readReservations();
  const idx = all.findIndex((r) => r.id === reservationId && r.userId === userId);
  if (idx === -1) return false;
  all.splice(idx, 1);
  await writeReservations(all);
  return true;
}

export async function getReservationById(reservationId: string): Promise<Reservation | null> {
  const all = await readReservations();
  return all.find((r) => r.id === reservationId) || null;
}
