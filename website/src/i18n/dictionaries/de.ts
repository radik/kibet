import type { Dictionary } from './en.ts';

/**
 * German UI strings. Complete: typed as `Dictionary`, so a missing key is a
 * type error. Translated from the Russian original (ru.ts); pending review
 * by a native speaker. Visitors are addressed with “Sie”, as the original
 * uses «вы». “Designs” are „Entwürfe“, as in the consent banner
 * (../consent.ts), which also quotes `want.button`.
 */
const de: Dictionary = {
  // Document head
  'meta.home.title': 'Kibet — erste Kollektion',
  'meta.home.description':
    'T-Shirts mit tatarischen Sprüchen. Die erste Kollektion: acht Entwürfe. Der Laden ist noch geschlossen.',
  'meta.model.title': '{title} — Kibet',
  'meta.notFound.title': 'Seite nicht gefunden — Kibet',
  'meta.notFound.description': 'Seite nicht gefunden.',

  // Accessibility
  'a11y.skipLink': 'Zum Inhalt springen',

  // Header and navigation
  'header.homeLabel': 'Kibet, zur Startseite',
  'header.navLabel': 'Hauptmenü',
  'header.languageLabel': 'Sprache',
  'nav.collection': 'Kollektion',
  'nav.allModels': 'Alle Entwürfe',

  // Home: hero
  'hero.photoPlaceholder': 'Kampagnenfoto',
  'hero.collection': 'Erste Kollektion',
  'hero.status': 'Eröffnung demnächst',
  'hero.cta': 'Kollektion ansehen',
  'hero.photoAlt':
    'Eine Person im Kibet-T-Shirt auf einer Straße in einer europäischen Stadt',

  // Home: «Kibet ябык» block (footnote only, without the star)
  'closed.footnote':
    'Der Laden ist geschlossen. Kibet heißt auf Tatarisch „Laden“. Was es darin geben wird, entscheiden wir noch.',

  // Home: collection grid. Plural forms fit every count but 1.
  'collection.heading': 'Erste Kollektion · {count} Entwürfe',
  'collection.hint':
    'Drücken Sie „Will ich“ unter den Entwürfen, die Sie tragen würden',
  'collection.variantCount': '{count} Varianten',

  // Photos and carousels
  'photo.label': 'Foto {n} · {angle}',
  'photo.shirt': 'T-Shirt in {color}',
  'photo.prev': 'Vorheriges Foto',
  'photo.next': 'Nächstes Foto',
  'photo.prevOf': '{title}: vorheriges Foto',
  'photo.nextOf': '{title}: nächstes Foto',
  'photo.zoomOpen': 'Foto groß anzeigen',
  'photo.zoomButton': 'Vergrößern',
  'photo.zoomDialog': '{title}: Großansicht',
  'photo.close': 'Schließen',
  'photo.angles': 'Ansichten',
  'photo.thumb': 'Foto {n}: {angle}',
  'photo.alt': '{title}. {shirt}. {angle}',

  // Photo angles
  'angle.front': 'Vorderseite',
  'angle.back': 'Rückseite',
  'angle.print': 'Aufdruck im Detail',
  'angle.worn': 'Getragen',

  // Shirt colours (nouns: they fill «Farbe: {color}» and «T-Shirt in {color}»)
  'color.white': 'Weiß',
  'color.black': 'Schwarz',
  'color.label': 'Farbe: {color}',
  'color.groupLabel': '{title}: T-Shirt-Farbe',

  // «Will ich»
  'want.button': 'Will ich',
  'want.buttonLabel': 'Will ich: {title}',
  'want.buttonLabelPressed': 'Will ich: {title}, markiert',
  'want.large': 'Das will ich',
  'want.largePressed': 'Sie wollen das',

  // Home: vote summary
  'vote.title': 'Was zuerst gedruckt wird',
  'vote.body': 'Die Entwürfe mit den meisten „Will ich“ drucken wir zuerst.',
  'vote.statusNone': 'Sie haben noch nichts markiert.',
  'vote.statusCount': 'Markierte Entwürfe: {count}. Danke!',

  // Model page
  'model.crumb': 'Erste Kollektion · {series}',
  'model.variant': 'Variante: {name}',
  'model.inscription': 'Schriftzug „{print}“',
  'model.withInscription': 'Mit Schriftzug',
  'model.withoutInscription': 'Ohne Schriftzug',
  'model.footnote': 'Fußnote mit Übersetzung',
  'model.footnoteHint': 'auf dem Foto zu sehen',
  'model.footnoteNone': 'Ohne Fußnote',
  'model.about': 'Zum Aufdruck',
  'model.otherModels': 'Weitere Entwürfe',
  'model.wantIdle':
    'Wir verkaufen noch nicht: Wir wählen aus, welche Entwürfe zuerst gedruckt werden.',
  'model.wantThanks': 'Danke! Ihre Stimme wird gezählt.',
  'model.wantThanksFootnote': 'Danke! Notiert, mit Fußnote: {footnote}.',
  'model.wantThanksNoFootnote': 'Danke! Notiert, ohne Fußnote.',
  'model.wantThanksInscription': 'Danke! Notiert, mit Schriftzug.',
  'model.wantThanksNoInscription': 'Danke! Notiert, ohne Schriftzug.',
  'model.wantThanksVariantFootnote':
    'Danke! Notiert: „{variant}“, Fußnote: {footnote}.',
  'model.wantThanksVariantNoFootnote':
    'Danke! Notiert: „{variant}“, ohne Fußnote.',

  // Series
  'series.cities': 'Städte',
  'series.gift': 'Geschenk',
  'series.family': 'Familie',
  'series.childhood': 'Aus der Kindheit',
  'series.pair': 'Paar',

  // Footer
  'footer.navLabel': 'Links',
  'footer.instagram': 'Instagram',
  'footer.impressum': 'Impressum',
  'footer.privacy': 'Datenschutz',

  // 404
  'notFound.heading': 'Seite nicht gefunden',
  'notFound.back': 'Zur Startseite',
};

export default de;
