/**
 * Shared helpers for the model page components: which pickers a model has,
 * the options shown first, and splitting a UI string around a placeholder.
 * The option values match the root's `data-want-*` attributes (see
 * src/scripts/model-page.ts).
 */
import {
  SHIRT_COLORS,
  printsOf,
  type FootnoteLang,
  type Model,
  type ShirtColor,
} from '../../data/models.ts';

/** Footnote languages, in picker order (names: FOOTNOTE_LANG_NAMES). */
export const FOOTNOTE_LANGS: readonly FootnoteLang[] = ['en', 'de'];

/** Footnote picker value for “no footnote”. */
export const NO_FOOTNOTE = 'none';

/** Lettering picker values. */
export const INSCRIPTION_ON = 'on';
export const INSCRIPTION_OFF = 'off';

/** The colour shown first (and the only one without JS). */
export const FIRST_COLOR: ShirtColor = SHIRT_COLORS[0].id;

/** Whether the model's print (or any variant) has a translation footnote. */
export function hasFootnote(model: Model): boolean {
  return printsOf(model).some((print) => print.footnote !== undefined);
}

/**
 * Splits a translated string around a placeholder, so its value can get an
 * element of its own (e.g. with `lang`): 'Version: {name}' → ['Version: ', ''].
 * Without the placeholder: [text, ''].
 */
export function splitAt(text: string, token: string): [string, string] {
  const at = text.indexOf(token);
  if (at < 0) return [text, ''];
  return [text.slice(0, at), text.slice(at + token.length)];
}
