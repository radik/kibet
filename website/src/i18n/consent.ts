import type { Locale } from './locales.ts';

/**
 * Strings of the consent banner (src/components/consent/) and the footer’s
 * “Privacy settings” control, in every locale. Kept apart from
 * ./dictionaries/ and complete by type: no English fallback here.
 *
 * - `{want}` in `text` is replaced with the locale’s «Want» button text
 *   (dictionary key `want.button`), so banner and button always match.
 * - ru, fr and tt link to the English privacy policy (see legalPath), hence
 *   “(in English)” in their `policyLink`.
 * - The privacy policy quotes `settings` and `decline` (de and en); it reads
 *   them from here.
 * - fr and tt are MACHINE-DRAFTED, pending review by a native speaker.
 */
export interface ConsentStrings {
  /** Banner heading; also the banner region’s accessible name. */
  readonly title: string;
  /** Banner text, with a `{want}` placeholder. */
  readonly text: string;
  /** Link text to the privacy policy. */
  readonly policyLink: string;
  readonly accept: string;
  readonly decline: string;
  /** Footer control that reopens the banner. */
  readonly settings: string;
  /** Shown in the reopened banner: the decision in force. */
  readonly currentGranted: string;
  readonly currentDenied: string;
  /** Announced to screen readers after a choice. */
  readonly savedGranted: string;
  readonly savedDenied: string;
}

const en: ConsentStrings = {
  title: 'Usage statistics',
  text: 'May we count visits? With your consent, Umami, a US provider with data storage in the EU, records which pages are viewed and which designs get a “{want}”. No cookies, no tracking across other websites. You can change your choice at any time under Privacy settings.',
  policyLink: 'Privacy policy',
  accept: 'Accept',
  decline: 'Decline',
  settings: 'Privacy settings',
  currentGranted: 'Current choice: accepted.',
  currentDenied: 'Current choice: declined.',
  savedGranted: 'Usage statistics accepted.',
  savedDenied: 'Usage statistics declined.',
};

const de: ConsentStrings = {
  title: 'Besucherstatistik',
  text: 'Dürfen wir Besuche zählen? Mit Ihrer Einwilligung erfasst Umami, ein US-Anbieter mit Datenspeicherung in der EU, welche Seiten aufgerufen werden und welche Entwürfe ein „{want}“ bekommen. Ohne Cookies und ohne Tracking über andere Websites hinweg. Ihre Entscheidung können Sie jederzeit unter „Datenschutz-Einstellungen“ ändern.',
  policyLink: 'Datenschutzerklärung',
  accept: 'Akzeptieren',
  decline: 'Ablehnen',
  settings: 'Datenschutz-Einstellungen',
  currentGranted: 'Aktuelle Auswahl: akzeptiert.',
  currentDenied: 'Aktuelle Auswahl: abgelehnt.',
  savedGranted: 'Besucherstatistik akzeptiert.',
  savedDenied: 'Besucherstatistik abgelehnt.',
};

const ru: ConsentStrings = {
  title: 'Статистика посещений',
  text: 'Можно нам вести статистику посещений? С вашего согласия Umami — американский сервис, который хранит данные в ЕС, — учитывает, какие страницы открывают и какие модели получают «{want}». Без cookie и без отслеживания на других сайтах. Изменить решение можно в любой момент в разделе «Настройки конфиденциальности».',
  policyLink: 'Политика конфиденциальности (на английском)',
  accept: 'Принять',
  decline: 'Отклонить',
  settings: 'Настройки конфиденциальности',
  currentGranted: 'Текущий выбор: принято.',
  currentDenied: 'Текущий выбор: отклонено.',
  savedGranted: 'Вы разрешили статистику посещений.',
  savedDenied: 'Вы отказались от статистики посещений.',
};

// MACHINE-DRAFTED: pending native review.
const fr: ConsentStrings = {
  title: 'Statistiques de visite',
  text: 'Pouvons-nous compter les visites ? Avec votre accord, Umami, un prestataire américain qui stocke les données dans l’UE, enregistre les pages consultées et les modèles qui reçoivent un « {want} ». Sans cookies ni suivi sur d’autres sites. Vous pouvez modifier votre choix à tout moment dans « Paramètres de confidentialité ».',
  policyLink: 'Politique de confidentialité (en anglais)',
  accept: 'Accepter',
  decline: 'Refuser',
  settings: 'Paramètres de confidentialité',
  currentGranted: 'Choix actuel : accepté.',
  currentDenied: 'Choix actuel : refusé.',
  savedGranted: 'Statistiques de visite acceptées.',
  savedDenied: 'Statistiques de visite refusées.',
};

// MACHINE-DRAFTED: pending native review. Tatar in Cyrillic script.
const tt: ConsentStrings = {
  title: 'Килүчеләр статистикасы',
  text: 'Сайтка керүләрне санарга рөхсәт итәсезме? Сезнең ризалыгыгыз белән Umami — мәгълүматны Европа Берлегендә саклаучы АКШ хезмәте — нинди битләр ачылганын һәм нинди модельләргә «{want}» басылганын исәпли. Cookie файлларсыз һәм башка сайтларда күзәтүсез. Карарыгызны теләсә кайсы вакытта «Хосусыйлык көйләүләре» бүлегендә үзгәртә аласыз.',
  policyLink: 'Хосусыйлык сәясәте (инглизчә)',
  accept: 'Ризалашам',
  decline: 'Баш тартам',
  settings: 'Хосусыйлык көйләүләре',
  currentGranted: 'Хәзерге карар: рөхсәт ителде.',
  currentDenied: 'Хәзерге карар: кире кагылды.',
  savedGranted: 'Килүчеләр статистикасына рөхсәт бирелде.',
  savedDenied: 'Килүчеләр статистикасыннан баш тартылды.',
};

export const CONSENT_STRINGS: Readonly<Record<Locale, ConsentStrings>> = {
  en,
  de,
  ru,
  fr,
  tt,
};

export function consentStrings(locale: Locale): ConsentStrings {
  return CONSENT_STRINGS[locale];
}

/** Banner text with the locale’s «Want» button text filled in. */
export function consentText(locale: Locale, want: string): string {
  return CONSENT_STRINGS[locale].text.replace('{want}', want);
}
