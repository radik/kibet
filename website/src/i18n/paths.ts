import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from './locales.ts';

/*
 * Paths in this module are "locale-neutral": the English path of a page,
 * e.g. '/' or '/models/berlin/'. Every helper returns paths with a leading and
 * a trailing slash (astro.config.mjs: trailingSlash 'always').
 */

function normalize(path: string): string {
  const withLead = path.startsWith('/') ? path : `/${path}`;
  return withLead.endsWith('/') ? withLead : `${withLead}/`;
}

/** '/models/berlin/' + 'de' → '/de/models/berlin/'; English stays unprefixed. */
export function localizePath(path: string, locale: Locale): string {
  const neutral = normalize(path);
  return locale === DEFAULT_LOCALE ? neutral : `/${locale}${neutral}`;
}

export interface LocalePath {
  readonly locale: Locale;
  /** Locale-neutral path. */
  readonly path: string;
}

/** '/de/models/berlin/' → { locale: 'de', path: '/models/berlin/' }. */
export function splitLocale(pathname: string): LocalePath {
  const normalized = normalize(pathname);
  const first = normalized.split('/')[1];
  if (first !== DEFAULT_LOCALE && isLocale(first)) {
    return { locale: first, path: normalized.slice(first.length + 1) };
  }
  return { locale: DEFAULT_LOCALE, path: normalized };
}

/**
 * Value for a `[...locale]` rest parameter in getStaticPaths: `undefined`
 * builds the unprefixed English route, any other locale builds `/<code>/…`.
 */
export function localeParam(locale: Locale): string | undefined {
  return locale === DEFAULT_LOCALE ? undefined : locale;
}

export interface LocaleLink {
  readonly locale: Locale;
  readonly href: string;
  /** False when the page has no version in this locale; href is then that locale's home. */
  readonly available: boolean;
}

/**
 * The same page in every locale, in `LOCALES` order. Used by the language
 * switcher (all entries) and by hreflang (only `available` entries).
 * Pages that exist in only some locales (e.g. legal pages) pass
 * `availableLocales`; the other locales then point at their home page.
 */
export function localeLinks(
  path: string,
  availableLocales: readonly Locale[] = LOCALES,
): LocaleLink[] {
  return LOCALES.map((locale) => {
    const available = availableLocales.includes(locale);
    return {
      locale,
      available,
      href: localizePath(available ? path : '/', locale),
    };
  });
}

export type LegalPage = 'impressum' | 'datenschutz';

/** Locales with their own legal pages; all others link to the English ones. */
export const LEGAL_LOCALES: readonly Locale[] = ['en', 'de'];

/** The locale whose legal pages a visitor in `locale` is sent to. */
export function legalLocale(locale: Locale): Locale {
  return LEGAL_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
}

/** '/impressum/', '/de/impressum/', '/datenschutz/', '/de/datenschutz/'. */
export function legalPath(page: LegalPage, locale: Locale): string {
  return localizePath(`/${page}/`, legalLocale(locale));
}
