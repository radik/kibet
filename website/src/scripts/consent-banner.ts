/**
 * Consent banner behaviour. Markup: src/components/consent/ConsentBanner.astro.
 *
 * - `[data-consent-banner]`: the banner, rendered `hidden`; shown here on
 *   every page until the visitor decides (so without JavaScript it never
 *   appears, and nothing is tracked either). Non-modal: no focus trap, no
 *   focus move when it appears on its own; a polite live region
 *   (`[data-consent-announce]`) tells screen readers it is there.
 * - `[data-consent-choice="granted" | "denied"]`: the two equal buttons.
 * - `[data-consent-current]`: the decision in force, shown when reopened;
 *   texts from the banner's `data-current-granted` / `data-current-denied`.
 * - `[data-consent-open]` (footer, rendered `hidden`): reopens the banner
 *   and moves focus into it; Escape or a choice closes it and returns focus.
 * - `data-saved-granted` / `data-saved-denied`: announced after a choice.
 *
 * While the banner shows, the page gets bottom padding of its height so the
 * end of the page stays readable and focused elements are not hidden.
 */
import {
  getConsent,
  onConsentChange,
  setConsent,
  type ConsentChoice,
} from './consent.ts';

const ANNOUNCE_DELAY = 400;
const ANNOUNCE_CLEAR = 10000;

let installed = false;

function isChoice(value: string | undefined): value is ConsentChoice {
  return value === 'granted' || value === 'denied';
}

export function initConsentBanner(): void {
  if (installed) return;
  const found = document.querySelector<HTMLElement>('[data-consent-banner]');
  if (!found) return;
  const banner: HTMLElement = found;
  installed = true;

  const announcer = document.querySelector<HTMLElement>(
    '[data-consent-announce]',
  );
  const current = banner.querySelector<HTMLElement>('[data-consent-current]');
  const title = banner.querySelector<HTMLElement>('[data-consent-title]');
  const text = banner.querySelector<HTMLElement>('[data-consent-text]');
  const openers = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-consent-open]'),
  );
  const resize =
    'ResizeObserver' in window ? new ResizeObserver(() => reserve()) : null;

  /** The footer control that opened the banner, if any. */
  let opener: HTMLElement | null = null;
  let announceTimer: number | undefined;

  function announce(message: string | undefined, delay = 50): void {
    if (!announcer || !message) return;
    window.clearTimeout(announceTimer);
    announcer.textContent = '';
    announceTimer = window.setTimeout(() => {
      announcer.textContent = message;
      announceTimer = window.setTimeout(() => {
        announcer.textContent = '';
      }, ANNOUNCE_CLEAR);
    }, delay);
  }

  /** Keeps the end of the page clear of the fixed banner. */
  function reserve(): void {
    const space = banner.hidden ? '' : `${banner.offsetHeight}px`;
    document.body.style.paddingBottom = space;
    document.documentElement.style.scrollPaddingBottom = space;
  }

  function setExpanded(expanded: boolean): void {
    for (const button of openers) {
      button.setAttribute('aria-expanded', String(expanded));
    }
  }

  function renderCurrent(): void {
    if (!current) return;
    const choice = getConsent()?.analytics;
    let message: string | undefined;
    if (choice === 'granted') message = banner.dataset.currentGranted;
    if (choice === 'denied') message = banner.dataset.currentDenied;
    current.textContent = message ?? '';
    current.hidden = !message;
  }

  function show(from: HTMLElement | null): void {
    opener = from;
    renderCurrent();
    const wasHidden = banner.hidden;
    banner.hidden = false;
    setExpanded(true);
    resize?.observe(banner);
    reserve();
    if (from) {
      banner.focus();
    } else if (wasHidden) {
      const message = [title?.textContent, text?.textContent]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join('. ');
      announce(message, ANNOUNCE_DELAY);
    }
  }

  function hide(): void {
    if (banner.hidden) return;
    const hadFocus = banner.contains(document.activeElement);
    banner.hidden = true;
    resize?.disconnect();
    reserve();
    setExpanded(false);
    const target = opener;
    opener = null;
    if (hadFocus && target?.isConnected) target.focus();
  }

  banner.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>('[data-consent-choice]');
    const choice = button?.dataset.consentChoice;
    if (!isChoice(choice)) return;
    setConsent(choice);
    hide();
    announce(
      choice === 'granted'
        ? banner.dataset.savedGranted
        : banner.dataset.savedDenied,
    );
  });

  banner.addEventListener('keydown', (event) => {
    // Only a reopened banner closes without a choice; on first visit the
    // banner simply stays (nothing is tracked until the visitor accepts).
    if (event.key === 'Escape' && getConsent() !== null) {
      event.preventDefault();
      hide();
    }
  });

  for (const button of openers) {
    button.hidden = false;
    button.addEventListener('click', () => {
      if (banner.hidden || opener !== button) show(button);
      else hide();
    });
  }

  // Decided in another tab: close a banner this page opened on its own.
  onConsentChange((record) => {
    if (record !== null && opener === null) hide();
    else renderCurrent();
  });

  if (getConsent() === null) show(null);
}
