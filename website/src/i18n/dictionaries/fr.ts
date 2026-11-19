import type { Dictionary } from './en.ts';

/**
 * French UI strings. Complete: typed as `Dictionary`, so a missing key is a
 * type error. Translated from the Russian original (ru.ts); pending review
 * by a native speaker. Vouvoiement. Typography as in ../consent.ts: a
 * no-break space (U+00A0) before : ; ? ! and inside « ».
 * The translation footnote is called « note de traduction » / « traduction ».
 */
const fr: Dictionary = {
  // Document head
  'meta.home.title': 'Kibet — première collection',
  'meta.home.description':
    'Des T-shirts avec des expressions tatares. Première collection : huit modèles. La boutique est encore fermée.',
  'meta.model.title': '{title} — Kibet',
  'meta.notFound.title': 'Page introuvable — Kibet',
  'meta.notFound.description': 'Page introuvable.',

  // Accessibility
  'a11y.skipLink': 'Aller au contenu',

  // Header and navigation
  'header.homeLabel': 'Kibet, accueil',
  'header.navLabel': 'Menu principal',
  'header.languageLabel': 'Langue',
  'nav.collection': 'Collection',
  'nav.allModels': 'Tous les modèles',

  // Home: hero
  'hero.photoPlaceholder': 'Photo de campagne',
  'hero.collection': 'Première collection',
  'hero.status': 'Ouverture prochaine',
  'hero.cta': 'Voir la collection',
  'hero.photoAlt':
    'Une personne en T-shirt Kibet dans une rue d’une ville européenne',

  // Home: «Kibet ябык» block (footnote only, without the star)
  'closed.footnote':
    'La boutique est fermée. Kibet signifie « boutique » en tatar. Nous réfléchissons encore à ce que nous y mettrons.',

  // Home: collection grid. Plural forms fit every count but 0 and 1.
  'collection.heading': 'Première collection · {count} modèles',
  'collection.hint':
    'Appuyez sur « J’en veux » sous les modèles que vous porteriez',
  'collection.variantCount': '{count} variantes',

  // Photos and carousels
  'photo.label': 'Photo {n} · {angle}',
  'photo.shirt': 'T-shirt {color}',
  'photo.prev': 'Photo précédente',
  'photo.next': 'Photo suivante',
  'photo.prevOf': '{title} : photo précédente',
  'photo.nextOf': '{title} : photo suivante',
  'photo.zoomOpen': 'Agrandir la photo',
  'photo.zoomButton': 'Agrandir',
  'photo.zoomDialog': '{title} : photo en grand',
  'photo.close': 'Fermer',
  'photo.angles': 'Vues',
  'photo.thumb': 'Photo {n} : {angle}',
  'photo.alt': '{title}. {shirt}. {angle}',

  // Photo angles
  'angle.front': 'De face',
  'angle.back': 'De dos',
  'angle.print': 'Motif en gros plan',
  'angle.worn': 'Porté',

  // Shirt colours (lower case: they follow «T-shirt» and «Couleur:»)
  'color.white': 'blanc',
  'color.black': 'noir',
  'color.label': 'Couleur : {color}',
  'color.groupLabel': '{title} : couleur du T-shirt',

  // «J’en veux»
  'want.button': 'J’en veux',
  'want.buttonLabel': 'J’en veux : {title}',
  'want.buttonLabelPressed': 'J’en veux : {title}, sélectionné',
  'want.large': 'Je veux celui-ci',
  'want.largePressed': 'Vous voulez celui-ci',

  // Home: vote summary
  'vote.title': 'À imprimer en premier',
  'vote.body':
    'Les modèles qui recevront le plus de « J’en veux » seront imprimés en premier.',
  'vote.statusNone': 'Vous n’avez encore rien sélectionné.',
  'vote.statusCount': 'Modèles sélectionnés : {count}. Merci !',

  // Model page
  'model.crumb': 'Première collection · {series}',
  'model.variant': 'Variante : {name}',
  'model.inscription': 'Inscription « {print} »',
  'model.withInscription': 'Avec inscription',
  'model.withoutInscription': 'Sans inscription',
  'model.footnote': 'Note de traduction',
  'model.footnoteHint': 'visible sur la photo',
  'model.footnoteNone': 'Sans traduction',
  'model.about': 'À propos du motif',
  'model.otherModels': 'Autres modèles',
  'model.wantIdle':
    'Nous ne vendons pas encore : nous choisissons les modèles à imprimer en premier.',
  'model.wantThanks': 'Merci ! Votre vote est pris en compte.',
  'model.wantThanksFootnote':
    'Merci ! C’est noté, avec traduction : {footnote}.',
  'model.wantThanksNoFootnote': 'Merci ! C’est noté, sans traduction.',
  'model.wantThanksInscription': 'Merci ! C’est noté, avec inscription.',
  'model.wantThanksNoInscription': 'Merci ! C’est noté, sans inscription.',
  'model.wantThanksVariantFootnote':
    'Merci ! C’est noté : « {variant} », traduction : {footnote}.',
  'model.wantThanksVariantNoFootnote':
    'Merci ! C’est noté : « {variant} », sans traduction.',

  // Series
  'series.cities': 'Villes',
  'series.gift': 'Cadeau',
  'series.family': 'Famille',
  'series.childhood': 'Enfance',
  'series.pair': 'Duo',

  // Footer. Impressum and Datenschutz as in ru.ts (the pages are English).
  'footer.navLabel': 'Liens',
  'footer.instagram': 'Instagram',
  'footer.impressum': 'Impressum',
  'footer.privacy': 'Datenschutz',

  // 404
  'notFound.heading': 'Page introuvable',
  'notFound.back': 'Retour à l’accueil',
};

export default fr;
