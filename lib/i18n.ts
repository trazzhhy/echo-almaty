export const locales = ['ru', 'kk', 'en'] as const

export type Lang = (typeof locales)[number]
export type LocalizedText = Record<Lang, string>

export const defaultLang: Lang = 'ru'

// Remembers the last language a reader browsed, so "/" reopens it.
export const langCookieName = 'echo-almaty-lang'

// Order and labels of the header language switcher.
export const languageSwitcherOrder: Lang[] = ['kk', 'ru', 'en']
export const languageLabels: Record<Lang, string> = { ru: 'РУС', kk: 'ҚАЗ', en: 'ENG' }

// BCP 47 locales for Intl date/number formatting.
export const intlLocales: Record<Lang, string> = { ru: 'ru-RU', kk: 'kk-KZ', en: 'en-GB' }

// An article may be written in one language only. Until it is translated,
// other language pages show the first available version instead of a blank.
const contentFallbackOrder: Lang[] = ['ru', 'kk', 'en']

export const categories = [
  { slug: 'society', name: { ru: 'Общество', kk: 'Қоғам', en: 'Society' } },
  { slug: 'politics', name: { ru: 'Политика', kk: 'Саясат', en: 'Politics' } },
  { slug: 'culture', name: { ru: 'Культура', kk: 'Мәдениет', en: 'Culture' } },
  { slug: 'events', name: { ru: 'Ивенты', kk: 'Ивенттер', en: 'Events' } },
  { slug: 'sport', name: { ru: 'Спорт', kk: 'Спорт', en: 'Sport' } },
  { slug: 'business-economy', name: { ru: 'Бизнес и экономика', kk: 'Бизнес пен экономика', en: 'Business & Economy' } },
  { slug: 'interviews', name: { ru: 'Интервью', kk: 'Сұхбат', en: 'Interviews' } },
  { slug: 'analytics', name: { ru: 'Аналитика', kk: 'Талдау', en: 'Analysis' } },
] as const

export type CategorySlug = (typeof categories)[number]['slug']

type Dictionary = Record<string, LocalizedText>

const dictionary: Dictionary = {
  brandTitle: { ru: 'Эхо Алматы', kk: 'Эхо Алматы', en: 'Echo Almaty' },
  brandTagline: {
    ru: 'Новости и аналитика Казахстана',
    kk: 'Қазақстан жаңалықтары мен талдауы',
    en: 'News and analysis from Kazakhstan',
  },
  home: { ru: 'Главная', kk: 'Басты бет', en: 'Home' },
  news: { ru: 'Новости', kk: 'Жаңалықтар', en: 'News' },
  categoriesPage: { ru: 'Категории', kk: 'Санаттар', en: 'Categories' },
  archive: { ru: 'Архив', kk: 'Мұрағат', en: 'Archive' },
  authors: { ru: 'Авторы', kk: 'Авторлар', en: 'Authors' },
  advertising: { ru: 'Реклама', kk: 'Жарнама', en: 'Advertising' },
  privacyPolicy: { ru: 'Политика конфиденциальности', kk: 'Құпиялылық саясаты', en: 'Privacy Policy' },
  latest: { ru: 'Последние новости', kk: 'Соңғы жаңалықтар', en: 'Latest news' },
  latestFeed: { ru: 'Лента новостей', kk: 'Жаңалықтар легі', en: 'News feed' },
  popular: { ru: 'Популярное', kk: 'Танымал', en: 'Popular' },
  popular24h: { ru: 'Популярное за 24 часа', kk: 'Соңғы 24 сағаттағы танымал', en: 'Most read in 24 hours' },
  popularWeek: { ru: 'Популярное за неделю', kk: 'Аптадағы танымал', en: 'Most read this week' },
  mainNewsOfDay: { ru: 'Главная новость дня', kk: 'Күннің басты жаңалығы', en: 'Top story of the day' },
  more: { ru: 'Все материалы', kk: 'Барлық материал', en: 'See all' },
  readMore: { ru: 'Читать далее', kk: 'Толығырақ', en: 'Read more' },
  search: { ru: 'Поиск', kk: 'Іздеу', en: 'Search' },
  searchPlaceholder: {
    ru: 'Поиск по новостям, тегам и авторам',
    kk: 'Жаңалықтардан, тегтерден және авторлардан іздеу',
    en: 'Search news, tags and authors',
  },
  subscribe: { ru: 'Подписаться', kk: 'Жазылу', en: 'Subscribe' },
  subscriptionDone: { ru: 'Готово', kk: 'Дайын', en: 'Subscribed' },
  newsletterTitle: {
    ru: 'Ежедневная редакционная рассылка',
    kk: 'Күнделікті редакциялық таралым',
    en: 'Daily editorial newsletter',
  },
  newsletterText: {
    ru: 'Получайте главные материалы редакции и срочные обновления одним письмом.',
    kk: 'Редакцияның басты материалдарын және жедел жаңартуларын бір хатпен алыңыз.',
    en: 'Get the newsroom’s top stories and breaking updates in a single email.',
  },
  emailPlaceholder: { ru: 'Ваш e-mail', kk: 'Сіздің e-mail', en: 'Your email' },
  newsletterSuccess: {
    ru: 'Вы подписаны на редакционную рассылку.',
    kk: 'Сіз редакциялық таралымға жазылдыңыз.',
    en: 'You are now subscribed to our newsletter.',
  },
  searchNews: { ru: 'Поиск по новостям', kk: 'Жаңалықтардан іздеу', en: 'Search news' },
  noResults: { ru: 'Ничего не найдено', kk: 'Ештеңе табылмады', en: 'Nothing found' },
  results: { ru: 'Результаты поиска', kk: 'Іздеу нәтижелері', en: 'Search results' },
  relatedNews: { ru: 'Рекомендуемые новости', kk: 'Ұсынылатын жаңалықтар', en: 'Recommended stories' },
  source: { ru: 'Источник', kk: 'Дереккөз', en: 'Source' },
  gallery: { ru: 'Фотогалерея', kk: 'Фотогалерея', en: 'Photo gallery' },
  videos: { ru: 'Видео', kk: 'Бейне', en: 'Video' },
  tags: { ru: 'Теги', kk: 'Тегтер', en: 'Tags' },
  sections: { ru: 'Разделы', kk: 'Бөлімдер', en: 'Sections' },
  mainSections: { ru: 'Основные разделы', kk: 'Негізгі бөлімдер', en: 'Main sections' },
  contacts: { ru: 'Контакты', kk: 'Байланыс', en: 'Contact us' },
  siteDescription: {
    ru: 'Эхо Алматы — трёхъязычная редакционная платформа с новостями, аналитикой и продвинутым редакторским workflow.',
    kk: 'Эхо Алматы — жаңалықтар, талдау және кеңейтілген редакциялық workflow ұсынатын үш тілді платформа.',
    en: 'Echo Almaty is a trilingual newsroom platform for news, analysis and an advanced editorial workflow.',
  },
  aboutTitle: { ru: 'О проекте', kk: 'Жоба туралы', en: 'About us' },
  aboutText: {
    ru: 'Эхо Алматы — трёхъязычная редакционная платформа с новостями, аналитикой и полноценным редакторским workflow.',
    kk: 'Эхо Алматы — жаңалықтар, талдау және толыққанды редакциялық workflow ұсынатын үш тілді платформа.',
    en: 'Echo Almaty is a trilingual newsroom platform for news, analysis and a complete editorial workflow.',
  },
  rights: {
    ru: 'Все права защищены.',
    kk: 'Барлық құқықтар қорғалған.',
    en: 'All rights reserved.',
  },
  editorialUpdate: {
    ru: 'Контент обновляется редакцией в реальном времени',
    kk: 'Контент редакциямен нақты уақытта жаңартылады',
    en: 'Content is updated by the newsroom in real time',
  },
  inCategory: { ru: 'Материалы рубрики', kk: 'Айдар материалдары', en: 'Section stories' },
  allNews: { ru: 'Все новости', kk: 'Барлық жаңалықтар', en: 'All news' },
  allCategories: { ru: 'Все категории', kk: 'Барлық санаттар', en: 'All categories' },
  allAuthors: { ru: 'Все авторы', kk: 'Барлық авторлар', en: 'All authors' },
  allMonths: { ru: 'Все месяцы', kk: 'Барлық айлар', en: 'All months' },
  allYears: { ru: 'Все годы', kk: 'Барлық жылдар', en: 'All years' },
  categoryFilter: { ru: 'Категория', kk: 'Санат', en: 'Category' },
  authorFilter: { ru: 'Автор', kk: 'Автор', en: 'Author' },
  monthFilter: { ru: 'Месяц', kk: 'Ай', en: 'Month' },
  yearFilter: { ru: 'Год', kk: 'Жыл', en: 'Year' },
  sortBy: { ru: 'Сортировка', kk: 'Сұрыптау', en: 'Sort by' },
  sortNewest: { ru: 'Сначала новые', kk: 'Алдымен жаңалары', en: 'Newest first' },
  sortOldest: { ru: 'Сначала старые', kk: 'Алдымен ескілері', en: 'Oldest first' },
  sortPopular: { ru: 'По популярности', kk: 'Танымалдығы бойынша', en: 'Most popular' },
  applyFilters: { ru: 'Показать', kk: 'Көрсету', en: 'Apply' },
  clearFilters: { ru: 'Сбросить', kk: 'Тазалау', en: 'Reset' },
  archiveByDate: { ru: 'Архив по датам', kk: 'Күндер бойынша мұрағат', en: 'Archive by date' },
  browseCategories: { ru: 'Обзор категорий', kk: 'Санаттарға шолу', en: 'Browse categories' },
  authorsDesk: { ru: 'Редакция и авторы', kk: 'Редакция және авторлар', en: 'Newsroom and authors' },
  materials: { ru: 'материалов', kk: 'материал', en: 'articles' },
  foundMaterials: { ru: 'Найдено материалов', kk: 'Табылған материалдар', en: 'Articles found' },
  publishedToday: { ru: 'Опубликовано сегодня', kk: 'Бүгін жарияланған', en: 'Published today' },
  noArchive: { ru: 'В архиве пока нет материалов за выбранный период.', kk: 'Таңдалған кезең бойынша мұрағатта материалдар жоқ.', en: 'There are no articles in the archive for the selected period yet.' },
  contactEditorial: { ru: 'Связаться с редакцией', kk: 'Редакциямен байланысу', en: 'Contact the newsroom' },
  privacyShort: { ru: 'Конфиденциальность', kk: 'Құпиялылық', en: 'Privacy' },
  byAuthor: { ru: 'Автор', kk: 'Автор', en: 'Author' },
  backToHome: { ru: 'На главную', kk: 'Басты бетке', en: 'Back to home' },
  scheduledAt: { ru: 'Запланировано на', kk: 'Жоспарланған уақыт', en: 'Scheduled for' },
  publishedAt: { ru: 'Опубликовано', kk: 'Жарияланған', en: 'Published' },
  views: { ru: 'просмотров', kk: 'қаралым', en: 'views' },
  minRead: { ru: 'мин чтения', kk: 'мин оқу', en: 'min read' },
  hiddenFromHome: { ru: 'Скрыто с главной', kk: 'Басты беттен жасырылған', en: 'Hidden from the homepage' },
  reviewQueue: { ru: 'На модерации', kk: 'Модерацияда', en: 'In review' },
  language: { ru: 'Язык', kk: 'Тіл', en: 'Language' },
  serviceNavigation: { ru: 'Служебная навигация', kk: 'Қызметтік навигация', en: 'Site information' },
  notTranslated: {
    ru: 'Этот материал пока не переведён на русский язык и показан в оригинале.',
    kk: 'Бұл материал әлі қазақ тіліне аударылмаған және түпнұсқада көрсетілген.',
    en: 'This story is not yet available in English and is shown in the original language.',
  },
}

export type DictionaryKey = keyof typeof dictionary

export const primaryNavigation: Array<{ href: string; label: DictionaryKey }> = [
  { href: '', label: 'home' },
  { href: '/news', label: 'news' },
  { href: '/categories', label: 'categoriesPage' },
  { href: '/archive', label: 'archive' },
  { href: '/authors', label: 'authors' },
]

export const secondaryNavigation: Array<{ href: string; label: DictionaryKey }> = [
  { href: '/about', label: 'aboutTitle' },
  { href: '/contacts', label: 'contacts' },
  { href: '/advertising', label: 'advertising' },
  { href: '/search', label: 'search' },
  { href: '/privacy-policy', label: 'privacyPolicy' },
]

export function isLang(value: string): value is Lang {
  return locales.includes(value as Lang)
}

export function t(lang: Lang, key: keyof typeof dictionary): string {
  return dictionary[key][lang]
}

/** The language whose text `localize` shows for `lang`. */
export function resolveContentLang(text: LocalizedText, lang: Lang): Lang {
  if (text[lang]?.trim()) return lang
  return contentFallbackOrder.find((item) => text[item]?.trim()) ?? lang
}

export function localize(text: LocalizedText, lang: Lang): string {
  return text[resolveContentLang(text, lang)] ?? ''
}

export function hasTranslation(text: LocalizedText, lang: Lang): boolean {
  return Boolean(text[lang]?.trim())
}

export function getCategoryBySlug(slug: string) {
  return categories.find((item) => item.slug === slug)
}

// hreflang map for `alternates.languages`, e.g. { ru: '/ru/news', kk: '/kk/news', en: '/en/news' }.
export function languageAlternates(path = '', langs: readonly Lang[] = locales) {
  return Object.fromEntries(langs.map((lang) => [lang, withLang(lang, path)]))
}

export function withLang(lang: Lang, path = ''): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `/${lang}${normalized === '/' ? '' : normalized}`
}
