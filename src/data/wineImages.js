/** Carousel Images - Landscapes / Atmosphere */
export const CAROUSEL_SLIDES = [
  {
    id: 1,
    eyebrow: 'מבחר הבוטיק',
    title: 'קברנה סוביניון רזרב 2020',
    description:
      'יין הדגל שלנו. גוף מלא, טעמי פירות יער שחורים וסיומת קטיפתית שנשארת לאורך זמן.',
    img: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=1920&q=80',
  },
  {
    id: 2,
    eyebrow: 'לבנים מיוחדים',
    title: 'גוורצטרמינר צונן מהצפון',
    description:
      'ארומות משכרות של ליצ׳י וורדים. שילוב מושלם של מתיקות עדינה ורעננות מתפרצת.',
    img: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?w=1920&q=80',
  },
  {
    id: 3,
    eyebrow: 'סדרת האמנות',
    title: 'בלנד אדום — סדרת האמנות',
    description:
      'שילוב מרתק של סירה ופטי ורדו. יין עוצמתי עם ניחוחות של תבלינים ים-תיכוניים.',
    img: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=1920&q=80',
  },
  {
    id: 4,
    eyebrow: 'קיץ 2026',
    title: 'רוזה גרנאש',
    subTitle: 'קיצי ומרענן',
    description:
      'צבע ורדרד בהיר וניחוחות של תות שדה ופריחת הדרים. יין קליל שכיף לשתות מול השקיעה.',
    img: 'https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=1920&q=80',
  },
  {
    id: 5,
    eyebrow: 'יישון בחביות',
    title: 'שרדונה רזרב',
    subTitle: '12 חודשי אלון צרפתי',
    description:
      'יין לבן עשיר ומורכב, עם נגיעות של וניל, אגוז קלוי ופירות גלעין.',
    img: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=1920&q=80',
  },
];

/** Card Images - Real photos, different from carousel */
const winePhoto = (id) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=85&w=900&h=1100`;

// Keep mock data available for any components that haven't migrated to the API yet
export const CATALOG_PRODUCTS = [
  {
    id: 1,
    name: 'יין אדום יבש — קברנה סוביניון',
    price: 120,
    stock: 45,
    category: 'אדום',
    imageUrl: winePhoto('photo-1510812431401-41d2bd2722f3'),
  },
  {
    id: 2,
    name: 'שרדונה רזרב — כרם גליל',
    price: 95,
    stock: 30,
    category: 'לבן',
    imageUrl: winePhoto('photo-1629205606573-eb916d848e84'),
  },
  {
    id: 3,
    name: 'רוזה פרובאנס — גרנאש',
    price: 85,
    stock: 12,
    category: 'רוזה',
    imageUrl: winePhoto('photo-1553361371-8734ebada588'),
  },
  {
    id: 4,
    name: 'מהדורה מוגבלת — מרלו',
    price: 250,
    stock: 5,
    category: 'אדום',
    limited: true,
    imageUrl: winePhoto('photo-1474722886779-9ae983985799'),
  },
  {
    id: 5,
    name: 'פינו נואר — עמק אלון',
    price: 145,
    stock: 22,
    category: 'אדום',
    imageUrl: winePhoto('photo-1569529465846-df6f40bc0b48'),
  },
  {
    id: 6,
    name: 'פרוסקו — מבעבע איטלקי',
    price: 110,
    stock: 38,
    category: 'מבעבע',
    imageUrl: winePhoto('photo-1527281400648-7aae79c287bc'),
  },
  {
    id: 7,
    name: 'מלבק — ארגנטינה רזרב',
    price: 135,
    stock: 18,
    category: 'אדום',
    imageUrl: winePhoto('photo-1571613316888-6f45407139ca'),
  },
  {
    id: 8,
    name: 'ריזלינג — גרמניה יבש',
    price: 88,
    stock: 27,
    category: 'לבן',
    imageUrl: winePhoto('photo-1547595628-c61a29f496e0'),
  },
];

export const CARD_IMAGE_FALLBACK = winePhoto('photo-1510812431401-41d2bd2722f3');