/**
 * English UI strings: the reference dictionary.
 *
 * - Its keys define `UIKey`; every other locale falls back to it.
 * - `{name}` is a placeholder; `t(key, { name })` must supply it (typed).
 * - No arrows and no ✓ in strings: components add them as aria-hidden
 *   decoration, so screen readers don't announce them.
 * - Legal: no price, size, buy, order, pre-order or cart wording, no email
 *   sign-up copy. The «Want» button is an interest poll, not a purchase.
 * - Print texts (Tatar phrases etc.) are not UI strings; they live untranslated
 *   in src/data/models.ts.
 */
const en = {
  // Document head
  'meta.home.title': 'Kibet — first collection',
  'meta.home.description':
    'T-shirts with Tatar phrases. The first collection: eight designs. The shop is not open yet.',
  'meta.model.title': '{title} — Kibet',
  'meta.notFound.title': 'Page not found — Kibet',
  'meta.notFound.description': 'Page not found.',

  // Accessibility
  'a11y.skipLink': 'Skip to content',

  // Header and navigation
  'header.homeLabel': 'Kibet, home',
  'header.navLabel': 'Main menu',
  'header.languageLabel': 'Language',
  'nav.collection': 'Collection',
  'nav.allModels': 'All designs',

  // Home: hero
  'hero.photoPlaceholder': 'Campaign photo',
  'hero.collection': 'First collection',
  'hero.status': 'Opening soon',
  'hero.cta': 'See the collection',
  // Alt text of the campaign photo (src/data/photos.ts). Describe the real
  // photo once it exists; until then a placeholder is shown instead.
  'hero.photoAlt': 'A person in a Kibet T-shirt on a street in a European city',

  // Home: “Kibet ябык*” block. The phrase itself is Tatar and is not
  // translated (src/data/brand.ts); this is its footnote, without the star.
  'closed.footnote':
    'The shop is closed. Kibet is Tatar for “shop”. We’re still deciding what goes in it.',

  // Home: collection grid
  'collection.heading': 'First collection · {count} designs',
  'collection.hint': 'Tap “Want” under the designs you’d wear',
  'collection.variantCount': '{count} versions',

  // Photos and carousels
  'photo.label': 'Photo {n} · {angle}',
  'photo.shirt': '{color} T-shirt',
  'photo.prev': 'Previous photo',
  'photo.next': 'Next photo',
  'photo.prevOf': '{title}: previous photo',
  'photo.nextOf': '{title}: next photo',
  'photo.zoomOpen': 'Open large photo',
  'photo.zoomButton': 'Zoom',
  'photo.zoomDialog': '{title}: large photo',
  'photo.close': 'Close',
  'photo.angles': 'Views',
  'photo.thumb': 'Photo {n}: {angle}',
  // Alt text of a product photo; {shirt} is `photo.shirt`, {angle} `angle.*`.
  'photo.alt': '{title}. {shirt}. {angle}',

  // Photo angles (PHOTO_ANGLES in src/data/models.ts)
  'angle.front': 'Front',
  'angle.back': 'Back',
  'angle.print': 'Print close-up',
  'angle.worn': 'Worn',

  // Shirt colours (SHIRT_COLORS in src/data/models.ts)
  'color.white': 'White',
  'color.black': 'Black',
  'color.label': 'Colour: {color}',
  'color.groupLabel': '{title}: T-shirt colour',

  // «Want» interest poll. Pressed states append an aria-hidden ✓.
  'want.button': 'Want',
  'want.buttonLabel': 'Want {title}',
  'want.buttonLabelPressed': 'Want {title}, marked',
  'want.large': 'I want this one',
  'want.largePressed': 'You want this one',

  // Home: vote summary
  'vote.title': 'What to print first',
  'vote.body': 'The designs with the most “Want”s get printed first.',
  'vote.statusNone': 'You haven’t marked anything yet.',
  'vote.statusCount': 'Designs marked: {count}. Thank you.',

  // Model page
  'model.crumb': 'First collection · {series}',
  'model.variant': 'Version: {name}',
  'model.inscription': 'Lettering “{print}”',
  'model.withInscription': 'With lettering',
  'model.withoutInscription': 'Without lettering',
  'model.footnote': 'Translation footnote',
  'model.footnoteHint': 'shown in the photo',
  'model.footnoteNone': 'No footnote',
  'model.about': 'About the print',
  'model.otherModels': 'Other designs',
  'model.wantIdle':
    'We’re not selling yet: we’re choosing which designs to print first.',
  'model.wantThanks': 'Thank you. Your vote is counted.',
  'model.wantThanksFootnote': 'Thank you. Noted, with footnote: {footnote}.',
  'model.wantThanksNoFootnote': 'Thank you. Noted, without a footnote.',
  'model.wantThanksInscription': 'Thank you. Noted, with lettering.',
  'model.wantThanksNoInscription': 'Thank you. Noted, without lettering.',
  'model.wantThanksVariantFootnote':
    'Thank you. Noted: “{variant}”, footnote: {footnote}.',
  'model.wantThanksVariantNoFootnote':
    'Thank you. Noted: “{variant}”, without a footnote.',

  // Series (SeriesId in src/data/models.ts)
  'series.cities': 'Cities',
  'series.gift': 'Gift',
  'series.family': 'Family',
  'series.childhood': 'From childhood',
  'series.pair': 'Pair',

  // Footer
  'footer.navLabel': 'Links',
  'footer.instagram': 'Instagram',
  'footer.impressum': 'Impressum',
  'footer.privacy': 'Privacy',

  // 404
  'notFound.heading': 'Page not found',
  'notFound.back': 'Back to the start',
} as const;

export type UIKey = keyof typeof en;

/** A complete dictionary. Incomplete locales use `Partial<Dictionary>`. */
export type Dictionary = { readonly [K in UIKey]: string };

export default en;
