import { localizePath } from '../i18n/paths.ts';
import type { Locale } from '../i18n/locales.ts';
import type { Localized } from '../i18n/ui.ts';

/*
 * The first collection: one entry per model page (/models/<slug>/), in
 * collection order.
 *
 * Print texts are the product and are never translated, Tatar phrases
 * included. What gets localized is the text about them (`description`,
 * `about`). No prices, sizes or stock here, by design (legal).
 *
 * The Tatar (`tt`) texts do not explain Tatar words to a Tatar reader; they
 * describe the custom or the context instead. The de, fr and tt texts are
 * pending review by a native speaker.
 */

/** Series ids; labels are the `series.<id>` dictionary keys. */
export type SeriesId = 'cities' | 'gift' | 'family' | 'childhood' | 'pair';

/** Photo angles, in carousel order; labels are `angle.<id>`. */
export const PHOTO_ANGLES = ['front', 'back', 'print', 'worn'] as const;
export type PhotoAngle = (typeof PHOTO_ANGLES)[number];

/** Shirt colours, in swatch order; labels are `color.<id>`. */
export const SHIRT_COLORS = [
  { id: 'white', swatch: 'var(--color-white)' },
  { id: 'black', swatch: 'var(--color-shirt-dark)' },
] as const;
export type ShirtColor = (typeof SHIRT_COLORS)[number]['id'];

/** Languages a translation footnote can be printed in. */
export type FootnoteLang = 'en' | 'de';

/**
 * Footnote option names. Endonyms on purpose: they name the language printed
 * on the shirt, so they read the same on every locale's page.
 */
export const FOOTNOTE_LANG_NAMES: Readonly<Record<FootnoteLang, string>> = {
  en: 'English',
  de: 'Deutsch',
};

/** Printed translation, shown as “* text” under the print when chosen. */
export type Footnote = Readonly<Record<FootnoteLang, string>>;

export interface Print {
  /** Exactly as printed. Never translated. */
  readonly text: string;
  /** BCP 47 tag of the printed text, for its `lang` attribute. */
  readonly lang: 'tt' | 'de' | 'fr';
  readonly footnote?: Footnote;
}

export interface Variant extends Print {
  readonly key: string;
  /** Variant name, in Tatar: render with lang="tt". */
  readonly name: string;
}

export type ModelSlug =
  | 'berlin'
  | 'paris'
  | 'kuchtenech'
  | 'abi-malae'
  | 'abi-kyzy'
  | 'achuymny'
  | 'bashymny'
  | 'ir-hatyn';

interface ModelBase {
  readonly slug: ModelSlug;
  /** Display title. Not translated. */
  readonly title: string;
  /**
   * Language of the title. Tatar titles are 'tt'; the city names are left
   * unset so they inherit the page language.
   */
  readonly titleLang?: 'tt';
  readonly series: SeriesId;
  /** Kibet tulip above the lettering (city series); lettering is optional. */
  readonly mark: boolean;
  readonly description: Localized;
  /** “About the print” text. */
  readonly about: Localized;
}

export interface SinglePrintModel extends ModelBase {
  readonly print: Print;
  readonly variants?: undefined;
}

/** One model page offering several prints, e.g. Ир / Хатын. */
export interface VariantModel extends ModelBase {
  readonly print?: undefined;
  readonly variants: readonly [Variant, Variant, ...Variant[]];
}

export type Model = SinglePrintModel | VariantModel;

const LETTERING_ONLY: Localized = {
  en: 'Lettering only, no picture. Kibet Serif Display Bold, with an italic footnote marked by the Kibet star.',
  ru: 'Только надпись, без картинки. Kibet Serif Display Bold, сноска курсивом со звездой Kibet.',
  de: 'Nur Schriftzug, kein Bild. Kibet Serif Display Bold, Fußnote kursiv, mit dem Kibet-Stern.',
  fr: 'Uniquement du texte, sans image. Kibet Serif Display Bold, note de traduction en italique, avec l’étoile Kibet.',
  tt: 'Бары язу гына, рәсемсез. Kibet Serif Display Bold, курсив искәрмә Kibet йолдызчыгы белән.',
};

export const MODELS: readonly Model[] = [
  {
    slug: 'berlin',
    title: 'Berlin',
    series: 'cities',
    mark: true,
    print: { text: 'Ick bin Tatar', lang: 'de' },
    description: {
      en: '“I’m Tatar” in Berlin dialect.',
      ru: '«Я татарин» на берлинском диалекте.',
      de: '„Ich bin Tatar“ auf Berlinerisch.',
      fr: '« Je suis tatar » en dialecte berlinois.',
      tt: '«Мин татар» — Берлин диалектында.',
    },
    about: {
      en: 'A tulip with the silhouette of the Berlin TV Tower, and the phrase “Ick bin Tatar” underneath.',
      ru: 'Тюльпан с силуэтом Берлинской телебашни, под ним фраза «Ick bin Tatar».',
      de: 'Eine Tulpe mit der Silhouette des Berliner Fernsehturms, darunter der Satz „Ick bin Tatar“.',
      fr: 'Une tulipe avec la silhouette de la tour de télévision de Berlin et, en dessous, la phrase « Ick bin Tatar ».',
      tt: 'Берлин телевидение манарасы силуэты төшерелгән лалә, астында «Ick bin Tatar» гыйбарәсе.',
    },
  },
  {
    slug: 'paris',
    title: 'Paris',
    series: 'cities',
    mark: true,
    print: { text: 'Chuis Tatar', lang: 'fr' },
    description: {
      en: '“I’m Tatar” in casual spoken French.',
      ru: '«Я татарин» на разговорном французском.',
      de: '„Ich bin Tatar“ in französischer Umgangssprache.',
      fr: '« Je suis tatar », comme on le dit à l’oral.',
      tt: '«Мин татар» — француз сөйләм телендә.',
    },
    about: {
      en: 'The tulip from the cities series, with the phrase “Chuis Tatar” underneath.',
      ru: 'Тюльпан из серии городов, под ним фраза «Chuis Tatar».',
      de: 'Die Tulpe der Städte-Serie, darunter der Satz „Chuis Tatar“.',
      fr: 'La tulipe de la série Villes avec, en dessous, la phrase « Chuis Tatar ».',
      tt: 'Шәһәрләр сериясеннән лалә, астында «Chuis Tatar» гыйбарәсе.',
    },
  },
  {
    slug: 'kuchtenech',
    title: 'Күчтәнәч',
    titleLang: 'tt',
    series: 'gift',
    mark: false,
    print: {
      text: 'күчтәнәч',
      lang: 'tt',
      footnote: {
        en: 'a little gift from home',
        de: 'ein Mitbringsel von zu Hause',
      },
    },
    description: {
      en: 'A gift you bring back from home or from a trip. Give this T-shirt to someone and it becomes a күчтәнәч itself.',
      ru: 'Гостинец, который привозят из дома или из поездки. Футболка, которую дарят, сама становится күчтәнәч.',
      de: 'Ein Mitbringsel von zu Hause oder von einer Reise. Verschenkt wird dieses T-Shirt selbst zum күчтәнәч.',
      fr: 'Le petit cadeau qu’on rapporte de chez soi ou de voyage. Offert, ce T-shirt devient lui-même un күчтәнәч.',
      tt: 'Туган яктан яки сәфәрдән буш кул белән кайтмыйлар. Бүләк итсәгез, бу футболка үзе дә күчтәнәч булачак.',
    },
    about: LETTERING_ONLY,
  },
  {
    slug: 'abi-malae',
    title: 'Әби малае',
    titleLang: 'tt',
    series: 'family',
    mark: false,
    print: {
      text: 'әби малае',
      lang: 'tt',
      footnote: { en: "grandma's boy", de: 'Omas Junge' },
    },
    description: {
      en: 'Grandma’s boy. Said of a boy raised, and spoiled, by his әби, his grandmother.',
      ru: 'Бабушкин внук. Так говорят о мальчике, которого вырастила и избаловала әби.',
      de: 'Omas Junge. So nennt man einen Jungen, den seine әби, die Großmutter, großgezogen und verwöhnt hat.',
      fr: 'Le petit-fils à mamie. Se dit d’un garçon que l’әби, sa grand-mère, a élevé et gâté.',
      tt: 'Әбисе тәрбияләп үстергән һәм иркәләп бозган малай турында шулай диләр.',
    },
    about: {
      en: 'Lettering only, no picture. Its pair is “Әби кызы”.',
      ru: 'Только надпись, без картинки. В паре есть «Әби кызы».',
      de: 'Nur Schriftzug, kein Bild. Das Gegenstück: „Әби кызы“.',
      fr: 'Uniquement du texte, sans image. Son pendant : « Әби кызы ».',
      tt: 'Бары язу гына, рәсемсез. Пары — «Әби кызы».',
    },
  },
  {
    slug: 'abi-kyzy',
    title: 'Әби кызы',
    titleLang: 'tt',
    series: 'family',
    mark: false,
    print: {
      text: 'әби кызы',
      lang: 'tt',
      footnote: { en: "grandma's girl", de: 'Omas Mädchen' },
    },
    description: {
      en: 'Grandma’s girl. Said of a girl raised, and spoiled, by her әби, her grandmother.',
      ru: 'Бабушкина внучка. Так говорят о девочке, которую вырастила и избаловала әби.',
      de: 'Omas Mädchen. So nennt man ein Mädchen, das seine әби, die Großmutter, großgezogen und verwöhnt hat.',
      fr: 'La petite-fille à mamie. Se dit d’une fille que l’әби, sa grand-mère, a élevée et gâtée.',
      tt: 'Әбисе тәрбияләп үстергән һәм иркәләп бозган кыз турында шулай диләр.',
    },
    about: {
      en: 'Lettering only, no picture. Its pair is “Әби малае”.',
      ru: 'Только надпись, без картинки. В паре есть «Әби малае».',
      de: 'Nur Schriftzug, kein Bild. Das Gegenstück: „Әби малае“.',
      fr: 'Uniquement du texte, sans image. Son pendant : « Әби малае ».',
      tt: 'Бары язу гына, рәсемсез. Пары — «Әби малае».',
    },
  },
  {
    slug: 'achuymny',
    title: 'Ачуымны китермә',
    titleLang: 'tt',
    series: 'childhood',
    mark: false,
    print: {
      text: 'ачуымны китермә',
      lang: 'tt',
      footnote: { en: "don't make me angry", de: 'reg mich nicht auf' },
    },
    description: {
      en: '“Don’t make me angry.” A line everyone heard from the grown-ups.',
      ru: '«Не зли меня». Фраза, которую каждый слышал от взрослых.',
      de: '„Reg mich nicht auf.“ Ein Satz, den jeder von den Erwachsenen zu hören bekam.',
      fr: '« Ne m’énerve pas. » Une phrase que tout le monde a entendue de la bouche des adultes.',
      tt: 'Һәркем балачакта олылардан ишеткән сүз.',
    },
    about: LETTERING_ONLY,
  },
  {
    slug: 'bashymny',
    title: 'Башымны катырма',
    titleLang: 'tt',
    series: 'childhood',
    mark: false,
    print: {
      text: 'башымны катырма',
      lang: 'tt',
      footnote: { en: "don't drive me crazy", de: 'mach mich nicht verrückt' },
    },
    description: {
      en: '“Don’t drive me crazy.” Another line everyone heard from the grown-ups.',
      ru: '«Не морочь мне голову». Ещё одна фраза, которую все слышали от взрослых.',
      de: '„Mach mich nicht verrückt.“ Noch so ein Satz, den jeder von den Erwachsenen zu hören bekam.',
      fr: '« Ne me casse pas la tête. » Encore une phrase que tout le monde a entendue de la bouche des adultes.',
      tt: 'Һәркем балачакта олылардан ишеткән тагын бер сүз.',
    },
    about: LETTERING_ONLY,
  },
  {
    slug: 'ir-hatyn',
    title: 'Ир / Хатын',
    titleLang: 'tt',
    series: 'pair',
    mark: false,
    variants: [
      {
        key: 'ir',
        name: 'Ир',
        text: 'ир',
        lang: 'tt',
        footnote: { en: 'husband', de: 'Ehemann' },
      },
      {
        key: 'hatyn',
        name: 'Хатын',
        text: 'хатын',
        lang: 'tt',
        footnote: { en: 'wife', de: 'Ehefrau' },
      },
    ],
    description: {
      en: '“Husband” and “wife”. A matching pair: wear one, or both.',
      // Mockup: «можно взять одну или обе»; «взять» (take) reads as buying.
      ru: '«Муж» и «жена». Парные футболки: можно носить одну или обе.',
      de: '„Ehemann“ und „Ehefrau“. Partner-T-Shirts: Man kann eins tragen oder beide.',
      fr: '« Mari » et « femme ». Des T-shirts assortis : on peut en porter un seul, ou les deux.',
      tt: 'Парлы футболкалар: берсен генә дә, икесен дә киеп йөрергә була.',
    },
    about: {
      en: 'Lettering only, no picture. Both share one layout, so they read as a pair.',
      ru: 'Только надпись, без картинки. Две модели с одинаковой вёрсткой, чтобы смотрелись парой.',
      de: 'Nur Schriftzug, kein Bild. Beide Entwürfe haben dasselbe Layout, damit sie als Paar wirken.',
      fr: 'Uniquement du texte, sans image. Deux modèles à la mise en page identique, pour former une paire.',
      tt: 'Бары язу гына, рәсемсез. Ике модельнең дә макеты бер үк, пар булып күренсеннәр өчен.',
    },
  },
];

export function getModel(slug: string): Model | undefined {
  return MODELS.find((model) => model.slug === slug);
}

/** The model's prints: one, or one per variant. */
export function printsOf(model: Model): readonly Print[] {
  return model.variants ?? (model.print ? [model.print] : []);
}

/** Previous and next model in collection order, wrapping around. */
export function modelNeighbours(model: Model): { prev: Model; next: Model } {
  const index = MODELS.indexOf(model);
  const count = MODELS.length;
  return {
    prev: MODELS[(index + count - 1) % count],
    next: MODELS[(index + 1) % count],
  };
}

/** '/models/berlin/', '/de/models/berlin/', … */
export function modelPath(slug: ModelSlug, locale: Locale): string {
  return localizePath(`/models/${slug}/`, locale);
}
