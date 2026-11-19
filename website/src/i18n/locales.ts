/**
 * Locale list and metadata.
 *
 * Keep `LOCALES` in step with `i18n.locales` in astro.config.mjs (same codes,
 * same order). English is the default locale and is served without a prefix.
 */
export const LOCALES = ['en', 'de', 'ru', 'fr', 'tt'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE = 'en' satisfies Locale;

export interface LocaleMeta {
  readonly code: Locale;
  /** Value for `<html lang>`, `hreflang` and `lang` attributes. */
  readonly htmlLang: string;
  /** Short label shown in the language switcher. */
  readonly label: string;
  /** Language name in that language, read out by screen readers. */
  readonly nativeName: string;
  /** Open Graph locale (language_TERRITORY). */
  readonly ogLocale: string;
}

export const LOCALE_META: Readonly<Record<Locale, LocaleMeta>> = {
  en: {
    code: 'en',
    htmlLang: 'en',
    label: 'EN',
    nativeName: 'English',
    ogLocale: 'en_GB',
  },
  de: {
    code: 'de',
    htmlLang: 'de',
    label: 'DE',
    nativeName: 'Deutsch',
    ogLocale: 'de_DE',
  },
  ru: {
    code: 'ru',
    htmlLang: 'ru',
    label: 'RU',
    nativeName: 'Русский',
    ogLocale: 'ru_RU',
  },
  fr: {
    code: 'fr',
    htmlLang: 'fr',
    label: 'FR',
    nativeName: 'Français',
    ogLocale: 'fr_FR',
  },
  tt: {
    code: 'tt',
    htmlLang: 'tt',
    label: 'TT',
    nativeName: 'Татарча',
    ogLocale: 'tt_RU',
  },
};

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
  );
}
