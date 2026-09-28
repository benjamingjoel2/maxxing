import type { SavedTrip } from "./types";

const KEY = "maxxing.trips.v1";

function canUseStorage(): boolean {
  try {
    return typeof window !== "undefined" && !!window.localStorage;
  } catch {
    return false;
  }
}

export function loadTrips(): SavedTrip[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as SavedTrip[]) : [];
  } catch {
    return [];
  }
}

export function saveTrips(trips: SavedTrip[]): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(trips));
  } catch {
    // Storage may be full or blocked; the in-memory copy still works.
  }
}

export function addTrip(trip: SavedTrip): SavedTrip[] {
  const next = [trip, ...loadTrips().filter((t) => t.id !== trip.id)];
  saveTrips(next);
  return next;
}

export function removeTrip(id: string): SavedTrip[] {
  const next = loadTrips().filter((t) => t.id !== id);
  saveTrips(next);
  return next;
}

export function newTripId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// --- Subscription API for React's useSyncExternalStore -----------------------

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedTrips: SavedTrip[] = [];
const EMPTY: SavedTrip[] = [];

function notify(): void {
  for (const listener of listeners) listener();
}

export function subscribeTrips(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Returns a referentially stable array until the stored value changes. */
export function getTripsSnapshot(): SavedTrip[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedTrips = raw ? loadTrips() : EMPTY;
  }
  return cachedTrips;
}

/** On the server (and during hydration) we do not know yet. */
export function getTripsServerSnapshot(): null {
  return null;
}

export function addTripAndNotify(trip: SavedTrip): void {
  addTrip(trip);
  notify();
}

export function removeTripAndNotify(id: string): void {
  removeTrip(id);
  notify();
}
