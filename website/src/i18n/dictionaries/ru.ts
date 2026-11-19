import type { Dictionary } from './en.ts';

/**
 * Russian UI strings. Complete: typed as `Dictionary`, so a missing key is a
 * type error. Source copy is from the design mockups; strings the mockups did
 * not contain (head meta, skip link, language label, 404) were written for
 * the site. Changed from the mockup for legal reasons: `collection.hint` said
 * «которые купили бы» (would buy) and now says «которые хотели бы носить».
 */
const ru: Dictionary = {
  // Document head
  'meta.home.title': 'Kibet — первая коллекция',
  'meta.home.description':
    'Футболки с татарскими фразами. Первая коллекция: восемь моделей. Магазин пока закрыт.',
  'meta.model.title': '{title} — Kibet',
  'meta.notFound.title': 'Страница не найдена — Kibet',
  'meta.notFound.description': 'Страница не найдена.',

  // Accessibility
  'a11y.skipLink': 'Перейти к содержанию',

  // Header and navigation
  'header.homeLabel': 'Kibet, на главную',
  'header.navLabel': 'Основное меню',
  'header.languageLabel': 'Язык',
  'nav.collection': 'Коллекция',
  'nav.allModels': 'Все модели',

  // Home: hero
  'hero.photoPlaceholder': 'Фото кампании',
  'hero.collection': 'Первая коллекция',
  'hero.status': 'Скоро открытие',
  'hero.cta': 'Смотреть коллекцию',
  'hero.photoAlt': 'Человек в футболке Kibet на улице европейского города',

  // Home: «Kibet ябык*» block (footnote only, without the star)
  'closed.footnote':
    'Магазин закрыт. Kibet по-татарски значит «магазин». Пока решаем, что в нём будет.',

  // Home: collection grid. Plural forms fit counts 5–20 / 2–4 respectively.
  'collection.heading': 'Первая коллекция · {count} моделей',
  'collection.hint': 'Нажмите «Хочу» под моделями, которые хотели бы носить',
  'collection.variantCount': '{count} варианта',

  // Photos and carousels
  'photo.label': 'Фото {n} · {angle}',
  'photo.shirt': '{color} футболка',
  'photo.prev': 'Предыдущее фото',
  'photo.next': 'Следующее фото',
  'photo.prevOf': '{title}: предыдущее фото',
  'photo.nextOf': '{title}: следующее фото',
  'photo.zoomOpen': 'Открыть фото крупно',
  'photo.zoomButton': 'Крупно',
  'photo.zoomDialog': '{title}: фото крупно',
  'photo.close': 'Закрыть',
  'photo.angles': 'Ракурсы',
  'photo.thumb': 'Фото {n}: {angle}',
  'photo.alt': '{title}. {shirt}. {angle}',

  // Photo angles
  'angle.front': 'Спереди',
  'angle.back': 'Сзади',
  'angle.print': 'Принт крупно',
  'angle.worn': 'На человеке',

  // Shirt colours (feminine: they agree with «футболка»)
  'color.white': 'Белая',
  'color.black': 'Чёрная',
  'color.label': 'Цвет: {color}',
  'color.groupLabel': '{title}: цвет футболки',

  // «Хочу»
  'want.button': 'Хочу',
  'want.buttonLabel': 'Хочу {title}',
  'want.buttonLabelPressed': 'Хочу {title}, отмечено',
  'want.large': 'Хочу такую',
  'want.largePressed': 'Вы хотите эту',

  // Home: vote summary
  'vote.title': 'Что печатать первым',
  'vote.body':
    'Модели, которые наберут больше всего «Хочу», напечатаем первыми.',
  'vote.statusNone': 'Вы пока ничего не отметили.',
  'vote.statusCount': 'Вы отметили моделей: {count}. Спасибо!',

  // Model page
  'model.crumb': 'Первая коллекция · {series}',
  'model.variant': 'Вариант: {name}',
  'model.inscription': 'Надпись «{print}»',
  'model.withInscription': 'С надписью',
  'model.withoutInscription': 'Без надписи',
  'model.footnote': 'Сноска с переводом',
  'model.footnoteHint': 'видно на фото',
  'model.footnoteNone': 'Без сноски',
  'model.about': 'О принте',
  'model.otherModels': 'Другие модели',
  'model.wantIdle':
    'Пока не продаём: выбираем, какие модели напечатать первыми.',
  'model.wantThanks': 'Спасибо! Учтём ваш голос.',
  'model.wantThanksFootnote':
    'Спасибо! Учтём и вариант со сноской: {footnote}.',
  'model.wantThanksNoFootnote': 'Спасибо! Учтём и вариант без сноски.',
  'model.wantThanksInscription': 'Спасибо! Учтём вариант с надписью.',
  'model.wantThanksNoInscription': 'Спасибо! Учтём вариант без надписи.',
  'model.wantThanksVariantFootnote':
    'Спасибо! Учтём вариант «{variant}» со сноской: {footnote}.',
  'model.wantThanksVariantNoFootnote':
    'Спасибо! Учтём вариант «{variant}» без сноски.',

  // Series
  'series.cities': 'Города',
  'series.gift': 'Подарок',
  'series.family': 'Семья',
  'series.childhood': 'Из детства',
  'series.pair': 'Пара',

  // Footer
  'footer.navLabel': 'Ссылки',
  'footer.instagram': 'Instagram',
  'footer.impressum': 'Impressum',
  'footer.privacy': 'Datenschutz',

  // 404
  'notFound.heading': 'Страница не найдена',
  'notFound.back': 'На главную',
};

export default ru;
