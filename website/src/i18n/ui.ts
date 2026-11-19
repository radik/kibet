import { DEFAULT_LOCALE, type Locale } from './locales.ts';
import en, { type Dictionary, type UIKey } from './dictionaries/en.ts';
import de from './dictionaries/de.ts';
import ru from './dictionaries/ru.ts';
import fr from './dictionaries/fr.ts';
import tt from './dictionaries/tt.ts';

export type { Dictionary, UIKey };

/**
 * Fallback for missing translations: any key a locale's dictionary does not
 * define is shown in this locale. To remove the fallback for a locale, fill
 * its dictionary and type it as `Dictionary` instead of `Partial<Dictionary>`
 * (ru.ts is the example). `node src/i18n/missing-keys.ts` lists the gaps.
 */
export const FALLBACK_LOCALE = DEFAULT_LOCALE;

/** The FALLBACK_LOCALE dictionary; complete by type. */
const fallback: Dictionary = en;

export const dictionaries: Readonly<Record<Locale, Partial<Dictionary>>> = {
  en,
  de,
  ru,
  fr,
  tt,
};

/** 'Photo {n} · {angle}' → 'n' | 'angle'. */
type Placeholders<S extends string> =
  S extends `${string}{${infer Name}}${infer Rest}`
    ? Name | Placeholders<Rest>
    : never;

/** What `t()` takes after the key: nothing, or every placeholder of the English string. */
type TArgs<K extends UIKey> = [Placeholders<(typeof en)[K]>] extends [never]
  ? []
  : [vars: Record<Placeholders<(typeof en)[K]>, string | number>];

type Vars = Readonly<Record<string, string | number>>;

/**
 * Returns `t(key, vars?)` for one locale.
 *
 *   const t = useTranslations(locale);
 *   t('nav.collection');                    // 'Collection'
 *   t('photo.label', { n: 1, angle: 'Front' }); // 'Photo 1 · Front'
 */
export function useTranslations(locale: Locale) {
  const dictionary = dictionaries[locale];
  return function t<K extends UIKey>(key: K, ...args: TArgs<K>): string {
    const template = dictionary[key] ?? fallback[key];
    const [vars] = args as unknown as [Vars?];
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (match, name: string) =>
      name in vars ? String(vars[name]) : match,
    );
  };
}

export type Translate = ReturnType<typeof useTranslations>;

/** Dictionary keys `locale` does not define yet, so they show in English. */
export function missingKeys(locale: Locale): UIKey[] {
  const dictionary = dictionaries[locale];
  return (Object.keys(fallback) as UIKey[]).filter(
    (key) => dictionary[key] === undefined,
  );
}

/**
 * Long-form text kept next to its data instead of in the dictionaries
 * (model descriptions, “about the print”). Complete by type: every locale is
 * required, so a missing translation is a type error and nothing falls back.
 */
export type Localized = Readonly<Record<Locale, string>>;

export function localized(text: Localized, locale: Locale): string {
  return text[locale];
}
