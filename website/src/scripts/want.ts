/**
 * «Want» buttons, status lines and the `kibet:want` event.
 *
 * Button markup contract (rendered by src/components/WantButton.astro):
 * - `button[data-want-model]`: model slug. Every button of one model shows
 *   the same state; pressing any of them toggles that model.
 * - `aria-pressed`, `.text`, `data-text-pressed`, `data-label-pressed`: the
 *   rendered text and aria-label are the unpressed ones; the pressed ones are
 *   swapped in while the model is wanted.
 * - `data-want-source`: 'home-card' | 'home-photo' | 'model-page'.
 * - Event context, read from the button, then from its closest
 *   `[data-want-scope]` element: `data-want-variant`, `data-want-color`,
 *   `data-want-footnote`, `data-want-inscription` ('on' / 'off'). Pages keep
 *   these current as the visitor picks (e.g. the gallery's colour), or pass
 *   `context` to initWantButtons.
 *
 * Every toggle dispatches `kibet:want` on `document` with WantEventDetail.
 * This module sends nothing anywhere; analytics, if any, listen to the event.
 */
import { getWanted, onWantedChange, toggleWanted } from './want-store.ts';

export {
  WANT_STORAGE_KEY,
  getWanted,
  isWanted,
  onWantedChange,
  setWanted,
  toggleWanted,
} from './want-store.ts';

export const WANT_EVENT = 'kibet:want';

export const WANT_SOURCES = ['home-card', 'home-photo', 'model-page'] as const;
export type WantSource = (typeof WANT_SOURCES)[number];

/** What the visitor had picked when they pressed «Want». */
export interface WantContext {
  variant?: string;
  color?: string;
  /** 'none', or the footnote language ('en', 'de'). */
  footnote?: string;
  /** Models with the tulip mark: lettering chosen (true) or not (false). */
  inscription?: boolean;
}

export interface WantEventDetail extends Readonly<WantContext> {
  readonly model: string;
  readonly pressed: boolean;
  readonly source: WantSource;
}

declare global {
  interface DocumentEventMap {
    'kibet:want': CustomEvent<WantEventDetail>;
  }
}

export interface WantButtonsOptions {
  /** Extra event context for a button, over what its data attributes give. */
  readonly context?: (button: HTMLButtonElement) => WantContext;
}

const BUTTON_SELECTOR = 'button[data-want-model]';

let installed = false;
let extraContext: WantButtonsOptions['context'];

function isWantSource(value: string | undefined): value is WantSource {
  return (
    value !== undefined && (WANT_SOURCES as readonly string[]).includes(value)
  );
}

function contextOf(button: HTMLButtonElement): WantContext {
  const context: WantContext = {};
  const scope = button.closest<HTMLElement>('[data-want-scope]');
  for (const element of [button, scope]) {
    if (!element) continue;
    const { wantVariant, wantColor, wantFootnote, wantInscription } =
      element.dataset;
    if (context.variant === undefined && wantVariant) {
      context.variant = wantVariant;
    }
    if (context.color === undefined && wantColor) context.color = wantColor;
    if (context.footnote === undefined && wantFootnote) {
      context.footnote = wantFootnote;
    }
    if (
      context.inscription === undefined &&
      (wantInscription === 'on' || wantInscription === 'off')
    ) {
      context.inscription = wantInscription === 'on';
    }
  }
  return { ...context, ...extraContext?.(button) };
}

function renderButton(button: HTMLButtonElement, pressed: boolean): void {
  const { dataset } = button;
  const text = button.querySelector<HTMLElement>('.text');
  // Remember the unpressed text and label the first time round.
  const idleText = dataset.textIdle ?? text?.textContent ?? '';
  dataset.textIdle = idleText;
  const idleLabel =
    dataset.labelIdle ?? button.getAttribute('aria-label') ?? undefined;
  if (idleLabel !== undefined) dataset.labelIdle = idleLabel;

  button.setAttribute('aria-pressed', String(pressed));
  const nextText = pressed ? (dataset.textPressed ?? idleText) : idleText;
  if (text && text.textContent !== nextText) text.textContent = nextText;
  const nextLabel = pressed ? (dataset.labelPressed ?? idleLabel) : idleLabel;
  if (nextLabel !== undefined) button.setAttribute('aria-label', nextLabel);
}

/** Brings every want button under `root` in line with the stored set. */
export function syncWantButtons(root: ParentNode = document): void {
  const wanted = getWanted();
  const buttons = root.querySelectorAll<HTMLButtonElement>(BUTTON_SELECTOR);
  for (const button of Array.from(buttons)) {
    const model = button.dataset.wantModel;
    if (model) renderButton(button, wanted.has(model));
  }
}

function onClick(event: MouseEvent): void {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>(BUTTON_SELECTOR);
  if (!button || button.disabled) return;
  const model = button.dataset.wantModel;
  if (!model) return;

  // Toggling notifies the store listeners, which re-render all buttons.
  const pressed = toggleWanted(model);
  const source = button.dataset.wantSource;
  const detail: WantEventDetail = {
    ...contextOf(button),
    model,
    pressed,
    source: isWantSource(source) ? source : 'home-card',
  };
  document.dispatchEvent(
    new CustomEvent<WantEventDetail>(WANT_EVENT, { detail }),
  );
}

/**
 * Makes every want button on the page work: one delegated click listener
 * (buttons added later work too), state from the store, kept in sync across
 * buttons and tabs. Safe to call more than once; a later `context` replaces
 * an earlier one.
 */
export function initWantButtons(options: WantButtonsOptions = {}): void {
  if (options.context) extraContext = options.context;
  if (!installed) {
    installed = true;
    document.addEventListener('click', onClick);
    onWantedChange(() => syncWantButtons());
  }
  syncWantButtons();
}

/**
 * Keeps a status line showing how many models are wanted.
 *
 * - `data-text-none`: text for zero.
 * - `data-text-count`: text for one or more, with a `{count}` placeholder.
 * - `data-want-known` (optional): space-separated slugs to count; others in
 *   storage (e.g. from a renamed model) are ignored.
 *
 * Give the element `role="status"` (polite live region) in the markup.
 */
export function initWantStatus(element: HTMLElement): void {
  const known = element.dataset.wantKnown?.split(/\s+/).filter(Boolean);
  const render = (wanted: ReadonlySet<string>): void => {
    const count = known
      ? known.filter((slug) => wanted.has(slug)).length
      : wanted.size;
    const text =
      count === 0
        ? element.dataset.textNone
        : element.dataset.textCount?.replace('{count}', String(count));
    if (text !== undefined && element.textContent?.trim() !== text) {
      element.textContent = text;
    }
  };
  render(getWanted());
  onWantedChange(render);
}
