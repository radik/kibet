/**
 * The visitor's analytics consent decision, kept in localStorage.
 *
 * Stored under CONSENT_STORAGE_KEY as JSON, e.g.
 *   {"analytics":"granted","at":"2026-11-18T09:30:00.000Z"}
 * `analytics` is 'granted' or 'denied', `at` the time of the decision
 * (ISO 8601, UTC). A missing or malformed value means: no decision yet.
 *
 * Storage may be unavailable (private mode, blocked site data, quota): every
 * access is guarded. Without storage nothing counts as consented on load; a
 * choice made on the page holds in memory for that page view only.
 * No markup here; see ./consent-banner.ts and ./analytics.ts.
 */

/** localStorage key (named in the privacy policy). */
export const CONSENT_STORAGE_KEY = 'kibet:consent';

export type ConsentChoice = 'granted' | 'denied';

export interface ConsentRecord {
  readonly analytics: ConsentChoice;
  /** ISO 8601 time of the decision. */
  readonly at: string;
}

export type ConsentListener = (record: ConsentRecord | null) => void;

/** undefined: not read yet; null: no decision. */
let cache: ConsentRecord | null | undefined;
const listeners = new Set<ConsentListener>();

function isChoice(value: unknown): value is ConsentChoice {
  return value === 'granted' || value === 'denied';
}

function parse(raw: string | null): ConsentRecord | null {
  if (raw === null) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null) return null;
    const { analytics, at } = value as Record<string, unknown>;
    if (isChoice(analytics) && typeof at === 'string') {
      return { analytics, at };
    }
  } catch {
    // Malformed: treated as no decision.
  }
  return null;
}

function read(): ConsentRecord | null {
  try {
    return parse(window.localStorage.getItem(CONSENT_STORAGE_KEY));
  } catch {
    return null;
  }
}

function write(record: ConsentRecord): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // Storage unavailable: the decision holds in memory for this page view.
  }
}

function notify(): void {
  const record = getConsent();
  for (const listener of Array.from(listeners)) listener(record);
}

/** Another tab changed (or cleared) storage. */
function onStorage(event: StorageEvent): void {
  if (event.key !== CONSENT_STORAGE_KEY && event.key !== null) return;
  cache = read();
  notify();
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', onStorage);
}

/** The current decision, or null if the visitor has not decided. */
export function getConsent(): ConsentRecord | null {
  if (cache === undefined) cache = read();
  return cache;
}

/** True only after an explicit opt-in. */
export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === 'granted';
}

/** Records a decision (now) and notifies the listeners. */
export function setConsent(choice: ConsentChoice): void {
  const record: ConsentRecord = {
    analytics: choice,
    at: new Date().toISOString(),
  };
  cache = record;
  write(record);
  notify();
}

/**
 * Calls `listener` after every change, from this page or from another tab.
 * Returns a function that removes the listener.
 */
export function onConsentChange(listener: ConsentListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
