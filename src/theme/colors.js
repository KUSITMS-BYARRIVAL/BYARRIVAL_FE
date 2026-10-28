// Color 토큰
// tailwind.config.js에서 require하므로 CommonJS로 작성한다

/** hex + 투명도 → rgba 문자열 */
function withAlpha(hex, alpha) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Base 팔레트 */
const PALETTE = {
  transparent: "transparent",
  current: "currentColor",
  white: "#FFFFFF",
  green: {
    50: "#EEFAF4",
    100: "#D6F2E4",
    200: "#B6E7CF",
    300: "#94DCB8",
    400: "#74D2A3",
    500: "#55C88F",
    600: "#48AA7A",
    700: "#3C8E66",
    800: "#307252",
    900: "#265A40",
  },
  // Green 500 기준
  "green-opacity": {
    50: withAlpha("#55C88F", 0.05),
    100: withAlpha("#55C88F", 0.1),
    200: withAlpha("#55C88F", 0.18),
    300: withAlpha("#55C88F", 0.35),
    400: withAlpha("#55C88F", 0.59),
    500: withAlpha("#55C88F", 0.88),
  },
  orange: {
    50: "#FFF2EF",
    100: "#FFE0D8",
    200: "#FFC8B9",
    300: "#FFAE98",
    400: "#FF9579",
    500: "#FF7E5C",
    600: "#D96B4E",
    700: "#B55941",
    800: "#914834",
    900: "#733929",
  },
  // Orange 500 기준
  "orange-opacity": {
    50: withAlpha("#FF7E5C", 0.05),
    100: withAlpha("#FF7E5C", 0.1),
    200: withAlpha("#FF7E5C", 0.18),
    300: withAlpha("#FF7E5C", 0.35),
    400: withAlpha("#FF7E5C", 0.59),
    500: withAlpha("#FF7E5C", 0.88),
  },
  grey: {
    50: "#F8F8F8",
    100: "#F6F6F6",
    200: "#EBEBEB",
    300: "#D0D0D0",
    400: "#AAAAAA",
    500: "#838383",
    600: "#5D5D5D",
    700: "#3A3A3A",
    800: "#292929",
    900: "#1B1B1B",
  },
  // Grey 800(#292929) 기준
  "grey-opacity": {
    50: withAlpha("#292929", 0.03),
    100: withAlpha("#292929", 0.05),
    200: withAlpha("#292929", 0.1),
    300: withAlpha("#292929", 0.18),
    400: withAlpha("#292929", 0.31),
    500: withAlpha("#292929", 0.46),
    600: withAlpha("#292929", 0.58),
    700: withAlpha("#292929", 0.7),
    800: withAlpha("#292929", 0.8),
    900: withAlpha("#292929", 0.91),
  },
  // White Opacity 100은 white와 같다
  "white-opacity": {
    10: withAlpha("#FFFFFF", 0.1),
    20: withAlpha("#FFFFFF", 0.2),
    30: withAlpha("#FFFFFF", 0.3),
    40: withAlpha("#FFFFFF", 0.4),
    50: withAlpha("#FFFFFF", 0.5),
    60: withAlpha("#FFFFFF", 0.6),
    70: withAlpha("#FFFFFF", 0.7),
    80: withAlpha("#FFFFFF", 0.8),
    90: withAlpha("#FFFFFF", 0.9),
  },
  red: {
    50: "#FBF0F0",
    100: "#FAEAEA",
    200: "#FFCDCD",
    500: "#E75656",
    600: "#CD2F2F",
    700: "#C42727",
  },
  // 카테고리용 색. Figma에서 600 단계 이름이 그룹과 다른 색이 있어 그룹 이름 기준으로 정리했다
  // (Marine Blue/Cobalt 600, Cobalt/Light Green 600, Blue Purple/Light Brown 600)
  "light-green": { 300: "#EEFAF4", 600: "#55C88F" },
  "ice-blue": { 200: "#DFF8FA", 600: "#1EBFCA" },
  "marine-blue": { 200: "#DFF2F9", 600: "#1E99CA" },
  "royal-blue": { 200: "#CDE2F7", 600: "#1E74CA" },
  cobalt: { 200: "#D3DCF4", 600: "#1E4FCA" },
  navy: { 200: "#CFD4FC", 600: "#2C1ECA" },
  "blue-purple": { 200: "#DDCEF5", 600: "#5D1ECA" },
  purple: { 300: "#E0C9EC", 600: "#911ECA" },
};

/** 시맨틱 토큰  */
const SEMANTIC = {
  background: {
    default: PALETTE.grey[50],
    black: PALETTE.grey[900],
    white: PALETTE.white,
  },
  text: {
    strong: PALETTE.grey[900],
    primary: PALETTE.grey[800],
    secondary: PALETTE["grey-opacity"][700],
    tertiary: PALETTE["grey-opacity"][500],
    brand: PALETTE.green[600],
    "on-fill-default": PALETTE.white,
    "on-fill-muted": PALETTE.grey[300],
    "on-fill-accent": PALETTE.orange[500],
    danger: PALETTE.red[500],
  },
  category: {
    background: {
      career: PALETTE["marine-blue"][200],
      economy: PALETTE["light-green"][300],
      tech: PALETTE["ice-blue"][200],
      science: PALETTE["royal-blue"][200],
      society: PALETTE.cobalt[200],
      global: PALETTE.navy[200],
      life: PALETTE["blue-purple"][200],
      culture: PALETTE.purple[300],
    },
    text: {
      career: PALETTE["marine-blue"][600],
      economy: PALETTE["light-green"][600],
      tech: PALETTE["ice-blue"][600],
      science: PALETTE["royal-blue"][600],
      society: PALETTE.cobalt[600],
      global: PALETTE.navy[600],
      life: PALETTE["blue-purple"][600],
      culture: PALETTE.purple[600],
    },
  },
  btn: {
    brand: PALETTE.green[500],
    "neutral-weak": PALETTE.grey[200],
    neutral: PALETTE.grey[700],
    disabled: PALETTE.grey[300],
    danger: PALETTE.red[500],
    pressed: PALETTE["grey-opacity"][100],
  },
  card: {
    white: PALETTE.white,
    brand: PALETTE.green[500],
    black: PALETTE.grey[800],
    green: PALETTE.green[50],
    pressed: PALETTE["grey-opacity"][100],
    "pressed-2": PALETTE["grey-opacity"][200],
    wrong: PALETTE.red[100],
  },
  icon: {
    primary: PALETTE.grey[700],
    brand: PALETTE.green[500],
    secondary: PALETTE["grey-opacity"][700],
    "on-fill-default": PALETTE.white,
    "on-fill-muted": PALETTE.grey[300],
    warning: PALETTE.red[500],
    background: PALETTE.grey[200],
    "background-brand": PALETTE.green[100],
  },
  navigationBar: {
    icon: {
      default: PALETTE.grey[300],
      active: PALETTE.green[500],
      warning: PALETTE.red[500],
    },
    background: PALETTE.white,
  },
  border: {
    brand: PALETTE.green[300],
    red: PALETTE.red[200],
    default: PALETTE["grey-opacity"][200],
    "grey-200": PALETTE.grey[200],
  },
};

module.exports = { PALETTE, SEMANTIC };
