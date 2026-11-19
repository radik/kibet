import type { Dictionary } from './en.ts';

/**
 * Tatar UI strings, Cyrillic script. Complete: typed as `Dictionary`, so a
 * missing key is a type error. MACHINE-DRAFTED from the Russian original
 * (ru.ts): pending review by a native speaker. Visitors are addressed with
 * «сез». “Designs” are «модельләр» and «Want» is «Телим», as in the consent
 * banner (../consent.ts).
 */
const tt: Dictionary = {
  // Document head
  'meta.home.title': 'Kibet — беренче коллекция',
  'meta.home.description':
    'Татарча гыйбарәләр язылган футболкалар. Беренче коллекция: сигез модель. Кибет әлегә ябык.',
  'meta.model.title': '{title} — Kibet',
  'meta.notFound.title': 'Бит табылмады — Kibet',
  'meta.notFound.description': 'Бит табылмады.',

  // Accessibility
  'a11y.skipLink': 'Эчтәлеккә күчү',

  // Header and navigation
  'header.homeLabel': 'Kibet, баш биткә',
  'header.navLabel': 'Төп меню',
  'header.languageLabel': 'Тел',
  'nav.collection': 'Коллекция',
  'nav.allModels': 'Барлык модельләр',

  // Home: hero
  'hero.photoPlaceholder': 'Кампания фотосы',
  'hero.collection': 'Беренче коллекция',
  'hero.status': 'Тиздән ачыла',
  'hero.cta': 'Коллекцияне карау',
  'hero.photoAlt': 'Европа шәһәре урамында Kibet футболкасы кигән кеше',

  // Home: «Kibet ябык» block (footnote only, without the star). A Tatar
  // reader needs no “kibet means shop”: the footnote restates the phrase in
  // Cyrillic, which ties the Latin brand spelling to the word.
  'closed.footnote': 'Кибет ябык. Анда нәрсә булачагын әле хәл итәбез.',

  // Home: collection grid. A noun after a numeral stays singular in Tatar,
  // so these fit every count.
  'collection.heading': 'Беренче коллекция · {count} модель',
  'collection.hint':
    'Кияр идем дигән модельләр астындагы «Телим» төймәсенә басыгыз',
  'collection.variantCount': '{count} вариант',

  // Photos and carousels
  'photo.label': 'Фото {n} · {angle}',
  'photo.shirt': '{color} футболка',
  'photo.prev': 'Алдагы фото',
  'photo.next': 'Киләсе фото',
  'photo.prevOf': '{title}: алдагы фото',
  'photo.nextOf': '{title}: киләсе фото',
  'photo.zoomOpen': 'Фотоны зурайтып ачу',
  'photo.zoomButton': 'Зурайту',
  'photo.zoomDialog': '{title}: зур фото',
  'photo.close': 'Ябу',
  'photo.angles': 'Ракурслар',
  'photo.thumb': 'Фото {n}: {angle}',
  'photo.alt': '{title}. {shirt}. {angle}',

  // Photo angles
  'angle.front': 'Алдан',
  'angle.back': 'Арттан',
  'angle.print': 'Принт якыннан',
  'angle.worn': 'Кигән килеш',

  // Shirt colours
  'color.white': 'Ак',
  'color.black': 'Кара',
  'color.label': 'Төс: {color}',
  'color.groupLabel': '{title}: футболка төсе',

  // «Телим»
  'want.button': 'Телим',
  'want.buttonLabel': 'Телим: {title}',
  'want.buttonLabelPressed': 'Телим: {title}, билгеләнгән',
  'want.large': 'Шушыны телим',
  'want.largePressed': 'Сез моны телисез',

  // Home: vote summary
  'vote.title': 'Башта нәрсә бастырырга',
  'vote.body': 'Иң күп «Телим» җыйган модельләрне беренче итеп бастырачакбыз.',
  'vote.statusNone': 'Сез әлегә бернәрсә дә билгеләмәдегез.',
  'vote.statusCount': 'Сез билгеләгән модельләр: {count}. Рәхмәт!',

  // Model page
  'model.crumb': 'Беренче коллекция · {series}',
  'model.variant': 'Вариант: {name}',
  'model.inscription': '«{print}» язуы',
  'model.withInscription': 'Язу белән',
  'model.withoutInscription': 'Язусыз',
  'model.footnote': 'Тәрҗемәле искәрмә',
  'model.footnoteHint': 'фотода күренә',
  'model.footnoteNone': 'Искәрмәсез',
  'model.about': 'Принт турында',
  'model.otherModels': 'Башка модельләр',
  'model.wantIdle':
    'Әлегә сатмыйбыз: башта кайсы модельләрне бастырачагыбызны хәл итәбез.',
  'model.wantThanks': 'Рәхмәт! Тавышыгыз исәпкә алынды.',
  'model.wantThanksFootnote':
    'Рәхмәт! Искәрмәле вариантны да исәпкә алабыз: {footnote}.',
  'model.wantThanksNoFootnote':
    'Рәхмәт! Искәрмәсез вариантны да исәпкә алабыз.',
  'model.wantThanksInscription': 'Рәхмәт! Язулы вариантны исәпкә алабыз.',
  'model.wantThanksNoInscription': 'Рәхмәт! Язусыз вариантны исәпкә алабыз.',
  'model.wantThanksVariantFootnote':
    'Рәхмәт! Искәрмәле «{variant}» вариантын исәпкә алабыз: {footnote}.',
  'model.wantThanksVariantNoFootnote':
    'Рәхмәт! Искәрмәсез «{variant}» вариантын исәпкә алабыз.',

  // Series
  'series.cities': 'Шәһәрләр',
  'series.gift': 'Бүләк',
  'series.family': 'Гаилә',
  'series.childhood': 'Балачактан',
  'series.pair': 'Пар',

  // Footer. Impressum and Datenschutz as in ru.ts (the pages are English).
  'footer.navLabel': 'Сылтамалар',
  'footer.instagram': 'Instagram',
  'footer.impressum': 'Impressum',
  'footer.privacy': 'Datenschutz',

  // 404
  'notFound.heading': 'Бит табылмады',
  'notFound.back': 'Баш биткә',
};

export default tt;
