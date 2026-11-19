/**
 * Consent-gated Umami analytics.
 *
 * - The tracker script (src/data/analytics.ts) is injected only once the
 *   visitor has opted in (./consent.ts): on the page view where they accept
 *   and on later ones. Before that, and after a decline, nothing is loaded
 *   and nothing is sent.
 * - Tracker features: automatic page views and the custom events below,
 *   nothing else. data-domains limits sending to the production hostname.
 * - Withdrawal on a page where the script is already loaded: the tracker's
 *   data-before-send hook asks for consent before every request and cancels
 *   it once consent is gone, so nothing more is sent without a reload; from
 *   the next page view on the script is not loaded at all.
 * - `kibet:want` events (./want.ts) dispatched while consent is granted are
 *   forwarded as `want` (pressed) or `unwant` events. Marks made before the
 *   opt-in are never sent.
 */
import {
  UMAMI_DOMAINS,
  UMAMI_SCRIPT_URL,
  UMAMI_WEBSITE_ID,
} from '../data/analytics.ts';
import { hasAnalyticsConsent, onConsentChange } from './consent.ts';
import type { WantEventDetail } from './want.ts';

/** Event data: flat; Umami keeps strings up to 500 characters. */
type EventData = Readonly<Record<string, string | boolean>>;

/** The part of the tracker API used here (docs: Tracker functions). */
interface UmamiTracker {
  track(eventName: string, data?: EventData): unknown;
}

/** Name of the window function passed as data-before-send. */
const BEFORE_SEND = 'kibetUmamiBeforeSend';

declare global {
  interface Window {
    umami?: UmamiTracker;
    kibetUmamiBeforeSend?: (type: string, payload: unknown) => unknown;
  }
}

/**
 * Event data keys forwarded from WantEventDetail when present: non-empty
 * strings, and booleans (inscription). `pressed` is the event name instead.
 */
const WANT_FIELDS = [
  'model',
  'color',
  'variant',
  'footnote',
  'inscription',
  'source',
] as const;
type WantField = (typeof WANT_FIELDS)[number];

const MAX_VALUE_LENGTH = 500;

let installed = false;
let script: HTMLScriptElement | undefined;
let ready = false;
/** Events from between injection and script load. */
const queue: Array<[name: string, data: EventData]> = [];

function load(): void {
  if (script) return;
  // Defined before the tracker runs; it looks the function up per request.
  window[BEFORE_SEND] = (_type, payload) =>
    hasAnalyticsConsent() ? payload : null;
  script = document.createElement('script');
  script.src = UMAMI_SCRIPT_URL;
  script.dataset.websiteId = UMAMI_WEBSITE_ID;
  script.dataset.domains = UMAMI_DOMAINS.join(',');
  script.dataset.beforeSend = BEFORE_SEND;
  script.addEventListener('load', () => {
    ready = true;
    flush();
  });
  script.addEventListener('error', () => {
    queue.length = 0;
  });
  document.body.append(script);
}

function flush(): void {
  const tracker = window.umami;
  const pending = queue.splice(0);
  if (!tracker || !hasAnalyticsConsent()) return;
  for (const [name, data] of pending) tracker.track(name, data);
}

function send(name: string, data: EventData): void {
  if (!hasAnalyticsConsent()) return;
  const tracker = window.umami;
  if (ready && tracker) tracker.track(name, data);
  else if (script) queue.push([name, data]);
}

function onWant(event: CustomEvent<WantEventDetail>): void {
  if (!hasAnalyticsConsent()) return;
  const detail: WantEventDetail | null = event.detail;
  if (!detail) return;
  const fields: Partial<Record<WantField, unknown>> = detail;
  const data: Record<string, string | boolean> = {};
  for (const key of WANT_FIELDS) {
    const value = fields[key];
    if (typeof value === 'string' && value !== '') {
      data[key] = value.slice(0, MAX_VALUE_LENGTH);
    } else if (typeof value === 'boolean') {
      data[key] = value;
    }
  }
  send(detail.pressed ? 'want' : 'unwant', data);
}

/** Starts analytics if consented, and follows later consent changes. */
export function initAnalytics(): void {
  if (installed) return;
  installed = true;
  // Event name: WANT_EVENT in ./want.ts (not imported, to keep that module
  // and its storage listeners off pages without want buttons).
  document.addEventListener('kibet:want', onWant);
  onConsentChange((record) => {
    if (record?.analytics === 'granted') load();
    else queue.length = 0;
  });
  if (hasAnalyticsConsent()) load();
}
