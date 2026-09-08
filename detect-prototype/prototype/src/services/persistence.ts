/**
 * localStorage persistence layer.
 *
 * The store hydrates from localStorage on init; if there's nothing there
 * (or the schema version doesn't match), it falls back to the seed data
 * in /data/*.ts. Every mutation writes back through `save()`.
 */

const STORAGE_KEY = 'detect-prototype-v1';
// v62 — prevSnapshot/nextSnapshot added to all multi-version rule history
// entries in rules.ts so Activity Log diffs show realistic before/after comparisons.
const SCHEMA_VERSION = 62;

export interface PersistedPayload<T> {
  schemaVersion: number;
  savedAt: string;
  data: T;
}

export function load<T>(): T | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedPayload<T>;
    if (parsed.schemaVersion !== SCHEMA_VERSION) {
      console.warn(
        `Detect store schema mismatch (got ${parsed.schemaVersion}, want ${SCHEMA_VERSION}). Reseeding.`,
      );
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed.data;
  } catch (err) {
    console.warn('Detect store load failed, reseeding:', err);
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function save<T>(data: T): void {
  try {
    const payload: PersistedPayload<T> = {
      schemaVersion: SCHEMA_VERSION,
      savedAt: new Date().toISOString(),
      data,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn('Detect store save failed:', err);
  }
}

export function clear(): void {
  localStorage.removeItem(STORAGE_KEY);
}
