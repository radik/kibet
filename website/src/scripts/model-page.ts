/**
 * Model page: the visitor's options (colour, variant, lettering, footnote),
 * the print preview that follows them, the zoom dialog kept in step with the
 * page gallery, and the «Want» status note.
 *
 * Markup contract (src/components/model/*):
 * - `[data-model-page]` root. It is also the page's `[data-gallery]` root
 *   (src/scripts/gallery.ts; the colour swatches are its
 *   `[data-gallery-color-option]` buttons) and the `[data-want-scope]`
 *   (src/scripts/want.ts). Its `data-want-color`, `data-want-variant`,
 *   `data-want-footnote` ('none' | 'en' | 'de') and `data-want-inscription`
 *   ('on' | 'off') hold the options shown first; set only those the model
 *   has. They are kept current here, so `kibet:want` carries the choice.
 * - `button[data-option][data-value]`, `data-option` one of 'variant',
 *   'footnote', 'inscription': option buttons; `aria-pressed` kept current.
 * - `[data-show-color]`, `[data-show-variant]`, `[data-show-footnote]`,
 *   `[data-show-inscription]`: shown only while every option they name has
 *   that value, `hidden` otherwise. Render them for the first options.
 * - `dialog[data-zoom]` holding its own `[data-gallery]`; opened by
 *   `[data-zoom-open]` elements outside it, closed by `[data-zoom-close]`
 *   buttons inside it (and Esc). Arrow keys step through the photos. The
 *   root gets `data-zoom-ready` once the dialog works.
 * - `[data-want-note]` (role="status"): `data-model`, `data-text-idle`,
 *   `data-text-on` (footnote or lettering picked), `data-text-off`; the
 *   last two may contain `{variant}` and `{footnote}`, filled in with the
 *   picked option buttons' text.
 * - `--shirt-bg`, `--shirt-ink`, `--shirt-muted` on the root: the current
 *   colour's tone (src/data/shirt-tones.ts); render the first colour's.
 */
import { createGallery, type Gallery } from './gallery.ts';
import { initWantButtons, isWanted, onWantedChange } from './want.ts';
import { isShirtColor, shirtToneVars } from '../data/shirt-tones.ts';

/** Each option: its `data-want-*` and `data-show-*` dataset keys. */
const OPTIONS = {
  color: { want: 'wantColor', show: 'showColor' },
  variant: { want: 'wantVariant', show: 'showVariant' },
  footnote: { want: 'wantFootnote', show: 'showFootnote' },
  inscription: { want: 'wantInscription', show: 'showInscription' },
} as const;

type OptionName = keyof typeof OPTIONS;

const OPTION_NAMES: readonly OptionName[] = [
  'color',
  'variant',
  'footnote',
  'inscription',
];

/** Options set by `data-option` buttons (colour goes through the gallery). */
const PICKED: readonly string[] = ['variant', 'footnote', 'inscription'];

const SHOW_SELECTOR =
  '[data-show-color], [data-show-variant], [data-show-footnote], [data-show-inscription]';
const OPTION_SELECTOR = 'button[data-option]';

function isPicked(value: string | undefined): value is OptionName {
  return value !== undefined && PICKED.includes(value);
}

function optionValue(root: HTMLElement, name: OptionName): string | undefined {
  return root.dataset[OPTIONS[name].want];
}

function optionButtons(root: HTMLElement): HTMLButtonElement[] {
  return Array.from(root.querySelectorAll<HTMLButtonElement>(OPTION_SELECTOR));
}

/** Brings the `data-show-*` elements, option buttons and tone in line. */
function applyOptions(root: HTMLElement): void {
  const conditional = root.querySelectorAll<HTMLElement>(SHOW_SELECTOR);
  for (const element of Array.from(conditional)) {
    const shown = OPTION_NAMES.every((name) => {
      const wanted = element.dataset[OPTIONS[name].show];
      return wanted === undefined || wanted === optionValue(root, name);
    });
    if (element.hidden === shown) element.hidden = !shown;
  }
  for (const button of optionButtons(root)) {
    const name = button.dataset.option;
    if (!isPicked(name)) continue;
    const pressed = button.dataset.value === optionValue(root, name);
    button.setAttribute('aria-pressed', String(pressed));
  }
  const color = optionValue(root, 'color');
  if (color !== undefined && isShirtColor(color)) {
    for (const [property, value] of Object.entries(shirtToneVars(color))) {
      root.style.setProperty(property, value);
    }
  }
}

/** Visible text of the option button for `value`, e.g. 'English'. */
function optionText(
  root: HTMLElement,
  name: OptionName,
  value: string | undefined,
): string {
  for (const button of optionButtons(root)) {
    const { option, value: buttonValue } = button.dataset;
    if (option === name && buttonValue === value) {
      return button.textContent?.trim() ?? '';
    }
  }
  return value ?? '';
}

/** 'Noted: “{variant}”' + { variant: 'Ир' } → 'Noted: “Ир”'. */
function fill(
  template: string,
  values: Readonly<Record<string, string>>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  );
}

function renderNote(root: HTMLElement, note: HTMLElement): void {
  const { dataset } = note;
  let text = dataset.textIdle;
  if (dataset.model && isWanted(dataset.model)) {
    const footnote = optionValue(root, 'footnote');
    const inscription = optionValue(root, 'inscription');
    const on =
      footnote !== undefined ? footnote !== 'none' : inscription !== 'off';
    const template = (on ? dataset.textOn : dataset.textOff) ?? '';
    text = fill(template, {
      variant: optionText(root, 'variant', optionValue(root, 'variant')),
      footnote: optionText(root, 'footnote', footnote),
    });
  }
  if (text !== undefined && note.textContent !== text) {
    note.textContent = text;
  }
}

/**
 * Wires the zoom dialog to the page gallery. Returns the function that
 * brings the dialog's gallery in line with the page's, or undefined when
 * there is no dialog (or no dialog support: the zoom buttons are hidden).
 */
function initZoom(root: HTMLElement, page: Gallery): (() => void) | undefined {
  const dialog = root.querySelector<HTMLDialogElement>('dialog[data-zoom]');
  const zoomRoot = dialog?.querySelector<HTMLElement>('[data-gallery]');
  const candidates = root.querySelectorAll<HTMLElement>('[data-zoom-open]');
  const openers: HTMLElement[] = [];
  for (const element of Array.from(candidates)) {
    if (!dialog?.contains(element)) openers.push(element);
  }

  if (!dialog || !zoomRoot || typeof dialog.showModal !== 'function') {
    for (const opener of openers) {
      if (opener instanceof HTMLButtonElement) opener.hidden = true;
    }
    return undefined;
  }

  // Zoom → page here; page → zoom through sync(), from the page's onChange.
  const zoom = createGallery(zoomRoot, {
    onChange: (_zoom, state) => page.go(state.index),
  });
  const sync = (): void => {
    const { color, index } = page.state;
    if (color !== undefined) zoom.setColor(color);
    zoom.go(index);
  };

  // Focus goes back to the button that opened the dialog; after a click on
  // the photo itself (not focusable), to the «Zoom» button.
  const zoomButton = openers.find(
    (element) => element instanceof HTMLButtonElement,
  );
  let returnTo: HTMLElement | undefined;

  for (const opener of openers) {
    opener.addEventListener('click', () => {
      returnTo = opener instanceof HTMLButtonElement ? opener : zoomButton;
      sync();
      if (!dialog.open) dialog.showModal();
    });
  }
  const closers = dialog.querySelectorAll<HTMLElement>('[data-zoom-close]');
  for (const closer of Array.from(closers)) {
    closer.addEventListener('click', () => dialog.close());
  }
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') zoom.prev();
    else if (event.key === 'ArrowRight') zoom.next();
    else return;
    event.preventDefault();
  });
  dialog.addEventListener('close', () => {
    returnTo?.focus();
    returnTo = undefined;
  });

  root.dataset.zoomReady = '';
  return sync;
}

/** Starts one model page. Call once per `[data-model-page]` root. */
export function initModelPage(root: HTMLElement): void {
  const notes = Array.from(
    root.querySelectorAll<HTMLElement>('[data-want-note]'),
  );
  const refresh = (): void => {
    applyOptions(root);
    for (const note of notes) renderNote(root, note);
  };

  // The page gallery exists before the zoom one, which needs it.
  const link: { syncZoom?: (() => void) | undefined } = {};
  const page = createGallery(root, {
    onChange(_page, state) {
      if (state.color !== undefined) root.dataset.wantColor = state.color;
      refresh();
      link.syncZoom?.();
    },
  });
  link.syncZoom = initZoom(root, page);

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest<HTMLButtonElement>(OPTION_SELECTOR);
    const name = button?.dataset.option;
    const value = button?.dataset.value;
    if (!isPicked(name) || value === undefined) return;
    root.dataset[OPTIONS[name].want] = value;
    refresh();
  });

  initWantButtons();
  onWantedChange(() => {
    for (const note of notes) renderNote(root, note);
  });
  refresh();
}
