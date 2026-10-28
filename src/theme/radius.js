// Radius 토큰
// tailwind.config.js에서 require하므로 CommonJS로 작성한다

const RADIUS = {
  none: 0, // Figma에는 없지만 둥글기를 없앨 때 필요해서 둔다
  sm: 8,
  md: 16,
  DEFAULT: 20,
  xl: 24,
  full: 999,
};

module.exports = { RADIUS };
