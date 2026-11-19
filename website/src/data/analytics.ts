/*
 * Umami Cloud tracker settings. The script is injected only after the
 * visitor opts in through the consent banner (src/scripts/analytics.ts);
 * before that, and after a decline, the site makes no request to Umami.
 *
 * Tracker attributes: https://docs.umami.is/docs/tracker-configuration
 */

/** Tracker script (Content-Security-Policy: script-src). */
export const UMAMI_SCRIPT_URL = 'https://cloud.umami.is/script.js';

/** Website ID in the Umami Cloud account (data-website-id). */
export const UMAMI_WEBSITE_ID = '8825aee0-92d2-4349-b44b-408874985014';

/**
 * Hostnames the tracker may send from (data-domains): Umami compares each
 * entry exactly with `location.hostname`, so localhost, workers.dev previews
 * and www (redirected to the apex) send nothing.
 */
export const UMAMI_DOMAINS: readonly string[] = ['kibet.eu'];

/**
 * Where the tracker posts page views and events (`/api/send`), as built into
 * the Umami Cloud script; not configured here (Content-Security-Policy:
 * connect-src). Change it only if the script's default host changes.
 */
export const UMAMI_COLLECT_ORIGIN = 'https://gateway.umami.is';
