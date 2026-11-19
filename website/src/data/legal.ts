/*
 * Facts the legal pages (Impressum, Datenschutzerklärung) render from. The
 * page texts live in src/components/legal/; this file holds every value in
 * them that the owner has to supply or confirm.
 *
 * TODO(owner): before publishing, replace every "[…]" placeholder below with
 * the real value and confirm the ANALYTICS settings against the Umami Cloud
 * account. Until then the Impressum and the privacy policy are incomplete
 * and must not go live.
 */

export interface LocalizedText {
  readonly de: string;
  readonly en: string;
}

export interface Operator {
  /** Full name of the private individual running the site. */
  readonly name: string;
  /** Street and house number of a ladungsfähige address (no P.O. box). */
  readonly street: string;
  readonly postalCode: string;
  readonly city: string;
  readonly country: LocalizedText;
  readonly email: string;
  /** Optional second direct contact channel; null renders nothing. */
  readonly phone: string | null;
}

/** Site operator (Diensteanbieter and data controller). */
export const OPERATOR: Operator = {
  name: '[NAME]',
  street: '[STRASSE HAUSNUMMER]',
  postalCode: '[PLZ]',
  city: '[ORT]',
  country: { de: 'Deutschland', en: 'Germany' },
  email: '[E-MAIL]',
  phone: null,
};

export interface SupervisoryAuthority {
  readonly name: string;
  /** Absolute https URL of the authority's website. */
  readonly url: string;
}

/**
 * Data-protection supervisory authority of the federal state the operator
 * lives in (for private individuals and businesses: the Landesbeauftragte/r
 * für Datenschutz, in Bavaria the BayLDA). List of authorities:
 * https://www.bfdi.bund.de/DE/Service/Anschriften/Laender/Laender-node.html
 */
export const SUPERVISORY_AUTHORITY: SupervisoryAuthority = {
  name: '[NAME DER DATENSCHUTZ-AUFSICHTSBEHÖRDE]',
  url: '[URL DER DATENSCHUTZ-AUFSICHTSBEHÖRDE]',
};

/**
 * Umami Cloud settings the privacy policy describes. Check them in the Umami
 * account and the script tag; the text changes with them.
 */
export interface AnalyticsSettings {
  /**
   * How often Umami changes the salt of its visitor hash, i.e. for how long
   * page views of one visitor can be linked. Umami's documented default is
   * 'monthly'. Use 'daily' only if the script tag carries
   * data-salt-rotation="daily" AND Umami confirms Umami Cloud honours it
   * (the attribute needs ENABLE_CLIENT_SALT on the server).
   */
  readonly idRotation: 'daily' | 'monthly';
  /** Data retention of the Umami Cloud plan: Hobby 6, Pro 24, Business 60. */
  readonly retentionMonths: number;
}

export const ANALYTICS: AnalyticsSettings = {
  idRotation: 'monthly',
  retentionMonths: 6,
};

/** “Last updated” line of both legal pages. */
export const LEGAL_LAST_UPDATED = {
  datetime: '2026-11',
  de: 'November 2026',
  en: 'November 2026',
} as const;
