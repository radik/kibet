import type { ShirtColor } from './models.ts';

/**
 * How each shirt colour is drawn on the model page while there is no photo
 * (print preview, angle thumbnails, photo controls). Text in `ink` and
 * `muted` keeps a contrast of at least 4.5:1 on `background`.
 */
export interface ShirtTone {
  readonly background: string;
  /** Print text and controls over the photo. */
  readonly ink: string;
  /** Secondary text: photo caption, counter, thumbnail numbers. */
  readonly muted: string;
}

export const SHIRT_TONES: Readonly<Record<ShirtColor, ShirtTone>> = {
  white: {
    background: 'var(--color-placeholder)',
    ink: 'var(--color-black)',
    muted: 'var(--color-grey-900)',
  },
  black: {
    background: 'var(--color-shirt-dark-alt)',
    ink: 'var(--color-white)',
    muted: 'var(--color-grey-400)',
  },
};

/** The tone as CSS custom properties, for a `style` attribute. */
export type ShirtToneVars = Readonly<
  Record<'--shirt-bg' | '--shirt-ink' | '--shirt-muted', string>
>;

export function shirtToneVars(color: ShirtColor): ShirtToneVars {
  const tone = SHIRT_TONES[color];
  return {
    '--shirt-bg': tone.background,
    '--shirt-ink': tone.ink,
    '--shirt-muted': tone.muted,
  };
}

export function isShirtColor(value: string): value is ShirtColor {
  return Object.keys(SHIRT_TONES).includes(value);
}
