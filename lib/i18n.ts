export const locales = ['ru', 'kk'] as const

export type Lang = (typeof locales)[number]
export type LocalizedText = Record<Lang, string>

export const categories = [
  { slug: 'society', name: { ru: 'Общество', kk: 'Қоғам' } },
  { slug: 'politics', name: { ru: 'Политика', kk: 'Саясат' } },
  { slug: 'culture-events', name: { ru: 'Культура и события', kk: 'Мәдениет пен оқиғалар' } },
  { slug: 'sport', name: { ru: 'Спорт', kk: 'Спорт' } },
  { slug: 'business-economy', name: { ru: 'Бизнес и экономика', kk: 'Бизнес пен экономика' } },
  { slug: 'interviews', name: { ru: 'Интервью', kk: 'Сұхбат' } },
  { slug: 'analytics', name: { ru: 'Аналитика', kk: 'Талдау' } },
] as const

export type CategorySlug = (typeof categories)[number]['slug']

type Dictionary = Record<string, LocalizedText>

const dictionary: Dictionary = {
  brandTitle: { ru: 'Эхо Алматы', kk: 'Эхо Алматы' },
  brandTagline: {
    ru: 'Новости и аналитика Казахстана',
    kk: 'Қазақстан жаңалықтары мен талдауы',
  },
  home: { ru: 'Главная', kk: 'Басты бет' },
  news: { ru: 'Новости', kk: 'Жаңалықтар' },
  categoriesPage: { ru: 'Категории', kk: 'Санаттар' },
  archive: { ru: 'Архив', kk: 'Мұрағат' },
  authors: { ru: 'Авторы', kk: 'Авторлар' },
  advertising: { ru: 'Реклама', kk: 'Жарнама' },
  privacyPolicy: { ru: 'Политика конфиденциальности', kk: 'Құпиялылық саясаты' },
  latest: { ru: 'Последние новости', kk: 'Соңғы жаңалықтар' },
  latestFeed: { ru: 'Лента новостей', kk: 'Жаңалықтар легі' },
  popular: { ru: 'Популярное', kk: 'Танымал' },
  popular24h: { ru: 'Популярное за 24 часа', kk: 'Соңғы 24 сағаттағы танымал' },
  popularWeek: { ru: 'Популярное за неделю', kk: 'Аптадағы танымал' },
  mainNewsOfDay: { ru: 'Главная новость дня', kk: 'Күннің басты жаңалығы' },
  more: { ru: 'Все материалы', kk: 'Барлық материал' },
  readMore: { ru: 'Читать далее', kk: 'Толығырақ' },
  search: { ru: 'Поиск', kk: 'Іздеу' },
  searchPlaceholder: {
    ru: 'Поиск по новостям, тегам и авторам',
    kk: 'Жаңалықтардан, тегтерден және авторлардан іздеу',
  },
  subscribe: { ru: 'Подписаться', kk: 'Жазылу' },
  subscriptionDone: { ru: 'Готово', kk: 'Дайын' },
  newsletterTitle: {
    ru: 'Ежедневная редакционная рассылка',
    kk: 'Күнделікті редакциялық таралым',
  },
  newsletterText: {
    ru: 'Получайте главные материалы редакции и срочные обновления одним письмом.',
    kk: 'Редакцияның басты материалдарын және жедел жаңартуларын бір хатпен алыңыз.',
  },
  emailPlaceholder: { ru: 'Ваш e-mail', kk: 'Сіздің e-mail' },
  newsletterSuccess: {
    ru: 'Вы подписаны на редакционную рассылку.',
    kk: 'Сіз редакциялық таралымға жазылдыңыз.',
  },
  searchNews: { ru: 'Поиск по новостям', kk: 'Жаңалықтардан іздеу' },
  noResults: { ru: 'Ничего не найдено', kk: 'Ештеңе табылмады' },
  results: { ru: 'Результаты поиска', kk: 'Іздеу нәтижелері' },
  relatedNews: { ru: 'Рекомендуемые новости', kk: 'Ұсынылатын жаңалықтар' },
  source: { ru: 'Источник', kk: 'Дереккөз' },
  gallery: { ru: 'Фотогалерея', kk: 'Фотогалерея' },
  videos: { ru: 'Видео', kk: 'Бейне' },
  tags: { ru: 'Теги', kk: 'Тегтер' },
  sections: { ru: 'Разделы', kk: 'Бөлімдер' },
  mainSections: { ru: 'Основные разделы', kk: 'Негізгі бөлімдер' },
  contacts: { ru: 'Контакты', kk: 'Байланыс' },
  aboutTitle: { ru: 'О проекте', kk: 'Жоба туралы' },
  aboutText: {
    ru: 'Эхо Алматы — двуязычная редакционная платформа с новостями, аналитикой и полноценным редакторским workflow.',
    kk: 'Эхо Алматы — жаңалықтар, талдау және толыққанды редакциялық workflow ұсынатын екі тілді платформа.',
  },
  rights: {
    ru: 'Все права защищены.',
    kk: 'Барлық құқықтар қорғалған.',
  },
  editorialUpdate: {
    ru: 'Контент обновляется редакцией в реальном времени',
    kk: 'Контент редакциямен нақты уақытта жаңартылады',
  },
  inCategory: { ru: 'Материалы рубрики', kk: 'Айдар материалдары' },
  allNews: { ru: 'Все новости', kk: 'Барлық жаңалықтар' },
  allCategories: { ru: 'Все категории', kk: 'Барлық санаттар' },
  allAuthors: { ru: 'Все авторы', kk: 'Барлық авторлар' },
  allMonths: { ru: 'Все месяцы', kk: 'Барлық айлар' },
  allYears: { ru: 'Все годы', kk: 'Барлық жылдар' },
  categoryFilter: { ru: 'Категория', kk: 'Санат' },
  authorFilter: { ru: 'Автор', kk: 'Автор' },
  monthFilter: { ru: 'Месяц', kk: 'Ай' },
  yearFilter: { ru: 'Год', kk: 'Жыл' },
  sortBy: { ru: 'Сортировка', kk: 'Сұрыптау' },
  sortNewest: { ru: 'Сначала новые', kk: 'Алдымен жаңалары' },
  sortOldest: { ru: 'Сначала старые', kk: 'Алдымен ескілері' },
  sortPopular: { ru: 'По популярности', kk: 'Танымалдығы бойынша' },
  applyFilters: { ru: 'Показать', kk: 'Көрсету' },
  clearFilters: { ru: 'Сбросить', kk: 'Тазалау' },
  archiveByDate: { ru: 'Архив по датам', kk: 'Күндер бойынша мұрағат' },
  browseCategories: { ru: 'Обзор категорий', kk: 'Санаттарға шолу' },
  authorsDesk: { ru: 'Редакция и авторы', kk: 'Редакция және авторлар' },
  materials: { ru: 'материалов', kk: 'материал' },
  foundMaterials: { ru: 'Найдено материалов', kk: 'Табылған материалдар' },
  publishedToday: { ru: 'Опубликовано сегодня', kk: 'Бүгін жарияланған' },
  noArchive: { ru: 'В архиве пока нет материалов за выбранный период.', kk: 'Таңдалған кезең бойынша мұрағатта материалдар жоқ.' },
  contactEditorial: { ru: 'Связаться с редакцией', kk: 'Редакциямен байланысу' },
  privacyShort: { ru: 'Конфиденциальность', kk: 'Құпиялылық' },
  byAuthor: { ru: 'Автор', kk: 'Автор' },
  backToHome: { ru: 'На главную', kk: 'Басты бетке' },
  scheduledAt: { ru: 'Запланировано на', kk: 'Жоспарланған уақыт' },
  publishedAt: { ru: 'Опубликовано', kk: 'Жарияланған' },
  views: { ru: 'просмотров', kk: 'қаралым' },
  minRead: { ru: 'мин чтения', kk: 'мин оқу' },
  hiddenFromHome: { ru: 'Скрыто с главной', kk: 'Басты беттен жасырылған' },
  reviewQueue: { ru: 'На модерации', kk: 'Модерацияда' },
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

export function localize(text: LocalizedText, lang: Lang): string {
  return text[lang]
}

export function getCategoryBySlug(slug: string) {
  return categories.find((item) => item.slug === slug)
}

export function getAlternateLang(lang: Lang): Lang {
  return lang === 'ru' ? 'kk' : 'ru'
}

export function withLang(lang: Lang, path = ''): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `/${lang}${normalized === '/' ? '' : normalized}`
}
