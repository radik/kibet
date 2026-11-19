/**
 * The visitor's «Want» marks: a set of model slugs, kept in localStorage so
 * the home page and the model pages share it (also across open tabs).
 *
 * Storage may be unavailable (private mode, blocked site data, quota): every
 * access is guarded, and the set then lives in memory for this page view.
 * No page markup here; see ./want.ts for the buttons, status lines and the
 * `kibet:want` event.
 */

/** localStorage key; the value is a JSON array of model slugs. */
export const WANT_STORAGE_KEY = 'kibet:wanted';

/**
 * Same-page change event on `window`, detail: the new array of slugs. Keeps
 * every copy of this module in step should a bundler ever duplicate it
 * (each copy keeps its own cache), with or without storage.
 */
const SYNC_EVENT = 'kibet:wanted-sync';

export type WantedListener = (wanted: ReadonlySet<string>) => void;

let cache: Set<string> | undefined;
const listeners = new Set<WantedListener>();

function slugsOf(value: unknown): Set<string> {
  if (!Array.isArray(value)) return new Set();
  return new Set(
    value.filter((slug): slug is string => typeof slug === 'string'),
  );
}

function read(): Set<string> {
  try {
    const raw = window.localStorage.getItem(WANT_STORAGE_KEY);
    return raw === null ? new Set() : slugsOf(JSON.parse(raw));
  } catch {
    return new Set();
  }
}

function write(wanted: ReadonlySet<string>): void {
  try {
    // Nothing marked: leave no trace on the device (the privacy policy
    // promises the key exists only while the visitor has marked designs).
    if (wanted.size === 0) {
      window.localStorage.removeItem(WANT_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(
      WANT_STORAGE_KEY,
      JSON.stringify(Array.from(wanted)),
    );
  } catch {
    // Storage unavailable: the in-memory set still works for this page.
  }
}

function current(): Set<string> {
  cache ??= read();
  return cache;
}

function notify(): void {
  const snapshot = getWanted();
  for (const listener of Array.from(listeners)) listener(snapshot);
}

/** Another tab changed storage. */
function onStorage(event: StorageEvent): void {
  // key null: the whole storage was cleared.
  if (event.key !== WANT_STORAGE_KEY && event.key !== null) return;
  cache = read();
  notify();
}

/** This page changed the set (this copy of the module or another one). */
function onSync(event: Event): void {
  if (!(event instanceof CustomEvent)) return;
  const detail: unknown = event.detail;
  cache = slugsOf(detail);
  notify();
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', onStorage);
  window.addEventListener(SYNC_EVENT, onSync);
}

/** A copy of the current set of wanted model slugs. */
export function getWanted(): ReadonlySet<string> {
  return new Set(current());
}

export function isWanted(slug: string): boolean {
  return current().has(slug);
}

/**
 * Marks or unmarks one model. Listeners run (synchronously) only when
 * something changed.
 */
export function setWanted(slug: string, pressed: boolean): void {
  const wanted = current();
  if (wanted.has(slug) === pressed) return;
  if (pressed) wanted.add(slug);
  else wanted.delete(slug);
  write(wanted);
  window.dispatchEvent(
    new CustomEvent<string[]>(SYNC_EVENT, { detail: Array.from(wanted) }),
  );
}

/** Flips one model and returns its new state (true: wanted). */
export function toggleWanted(slug: string): boolean {
  const pressed = !isWanted(slug);
  setWanted(slug, pressed);
  return pressed;
}

/**
 * Calls `listener` with the new set after every change, from this page or
 * from another tab. Returns a function that removes the listener.
 */
export function onWantedChange(listener: WantedListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
