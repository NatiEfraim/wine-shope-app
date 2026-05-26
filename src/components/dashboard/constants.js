export const BOUTIQUE = {
  burgundy: '#5C2430',
  burgundyDark: '#3D1520',
  gold: '#C9A962',
  goldLight: '#E8D5A3',
  goldMuted: '#A68B4B',
  ink: '#2C2825',
  charcoal: '#1A1614',
  muted: '#8A8278',
  linen: '#E8E2D8',
  parchment: '#F0EBE3',
  cream: '#FAF7F2',
};

export const STATUS_META = {
  pending:   { label: 'ממתין לאישור', color: BOUTIQUE.goldMuted },
  approved:  { label: 'אושר',         color: BOUTIQUE.gold },
  delivered: { label: 'נשלח',          color: BOUTIQUE.ink },
  completed: { label: 'הושלם',         color: BOUTIQUE.burgundy },
};

export const HEBREW_MONTHS = [
  'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
  'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר',
];

export const WINE_HEBREW_NAMES = {
  'Cabernet Sauvignon': 'קברנה סוביניון',
  'Merlot': 'מרלו',
  'Chardonnay': 'שרדונה',
  'Rosé Wine': 'יין רוזה',
  'Pinot Noir': 'פינו נואר',
  'Sauvignon Blanc': 'סוביניון בלאן',
  'Shiraz': 'שירז',
  'Malbec': 'מלבק',
  'Gewürztraminer': 'גוורצטרמינר',
  'Riesling': 'ריזלינג',
  'Moscato': 'מוסקטו',
  'Zinfandel': 'זינפנדל',
  'Syrah Reserve': 'סירה רזרב',
  'White Blend': 'בלנד לבן',
  'Red Blend': 'בלנד אדום',
  'Sparkling Brut': 'יין מבעבע ברוט',
  'Prosecco': 'פרוסקו',
  'Port Wine': 'יין פורט',
  'Dessert Wine': 'יין קינוח',
  'Petit Verdot': 'פטיט ורדו',
  'Viognier': 'ויונייה',
  'Grenache': 'גרנש',
  'Tempranillo': 'טמפרניו',
  'Barbera': 'ברברה',
  'Chianti': 'קיאנטי',
  'Cava Brut': 'קאווה ברוט',
  'Ice Wine': 'יין קרח',
  'Organic Red Wine': 'יין אדום אורגני',
  'Organic White Wine': 'יין לבן אורגני',
  'Premium Rosé': 'רוזה פרימיום',
};

export function toHebrewWineName(name) {
  if (!name) return '';
  return WINE_HEBREW_NAMES[name] || name;
}

export const currencyFmt = new Intl.NumberFormat('he-IL', {
  style: 'currency',
  currency: 'ILS',
  maximumFractionDigits: 0,
});
