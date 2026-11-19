import { SITE_NAME } from '../../data/brand.ts';
import type { Locale } from '../../i18n/locales.ts';
import type { LegalPage } from '../../i18n/paths.ts';

/*
 * Head and heading text of the legal pages. The body text is in the
 * <Page><Language>.astro components next to this file; German is the binding
 * version, English a courtesy translation.
 */

/** Languages the legal texts exist in (see LEGAL_LOCALES in i18n/paths.ts). */
export type LegalLanguage = 'de' | 'en';

/** German for the German locale, English for every other one. */
export function legalLanguage(locale: Locale): LegalLanguage {
  return locale === 'de' ? 'de' : 'en';
}

export interface LegalPageMeta {
  /** Visible <h1>. */
  readonly heading: string;
  /** Document <title>. */
  readonly title: string;
  /** <meta name="description">. */
  readonly description: string;
}

type MetaByLanguage = Readonly<Record<LegalLanguage, LegalPageMeta>>;

export const LEGAL_PAGE_META: Readonly<Record<LegalPage, MetaByLanguage>> = {
  impressum: {
    de: {
      heading: 'Impressum',
      title: `Impressum — ${SITE_NAME}`,
      description:
        'Impressum von kibet.eu: wer diese Website betreibt und wie Sie uns erreichen.',
    },
    en: {
      heading: 'Impressum (legal notice)',
      title: `Impressum (legal notice) — ${SITE_NAME}`,
      description:
        'Legal notice for kibet.eu: who runs this website and how to reach us.',
    },
  },
  datenschutz: {
    de: {
      heading: 'Datenschutzerklärung',
      title: `Datenschutzerklärung — ${SITE_NAME}`,
      description:
        'Welche Daten kibet.eu verarbeitet: Auslieferung über Cloudflare, Besucherstatistik mit Umami, „Want“-Markierungen im Browser.',
    },
    en: {
      heading: 'Privacy policy',
      title: `Privacy policy — ${SITE_NAME}`,
      description:
        'What data kibet.eu processes: delivery via Cloudflare, visitor statistics with Umami, “Want” marks stored in your browser.',
    },
  },
};
