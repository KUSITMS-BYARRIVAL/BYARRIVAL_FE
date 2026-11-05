// Figma Typography 토큰 (Default.tokens.json)
// tailwind.config.js에서 require하므로 CommonJS로 작성한다

/** 굵기 → Pretendard 폰트 이름. RN은 커스텀 폰트에서 fontWeight로 굵기를 고르지 못하므로 폰트 이름으로 지정한다 */
const FONT_FAMILY_BY_WEIGHT = {
  400: "Pretendard-Regular",
  500: "Pretendard-Medium",
  600: "Pretendard-SemiBold",
  700: "Pretendard-Bold",
};

/** Typography/Semantic 토큰. 키가 클래스 이름이 된다 (`text-heading1-b`). letterSpacing은 Figma처럼 %로 적고 없으면 0이다. */
const TYPOGRAPHY = {
  // Figma Time Digit 숫자(48px·Bold·135%·-2%). 시맨틱 이름이 없어 용도로 이름 붙인다
  "digit-b": {
    fontSize: 48,
    lineHeight: 135,
    fontWeight: 700,
    letterSpacing: -2,
  },
  "display1-b": {
    fontSize: 32,
    lineHeight: 140,
    fontWeight: 700,
    letterSpacing: -2,
  },
  "heading1-b": { fontSize: 28, lineHeight: 125, fontWeight: 700 },
  "heading2-b": { fontSize: 24, lineHeight: 135, fontWeight: 700 },
  "heading2-sb": {
    fontSize: 22,
    lineHeight: 140,
    fontWeight: 600,
    letterSpacing: -2,
  },
  "heading3-sb": { fontSize: 18, lineHeight: 140, fontWeight: 600 },
  "title1-sb": {
    fontSize: 20,
    lineHeight: 140,
    fontWeight: 600,
    letterSpacing: -1,
  },
  "title2-sb": {
    fontSize: 18,
    lineHeight: 140,
    fontWeight: 600,
    letterSpacing: -1,
  },
  "title3-sb": {
    fontSize: 16,
    lineHeight: 140,
    fontWeight: 600,
    letterSpacing: -1,
  },
  "body1-r": { fontSize: 16, lineHeight: 150, fontWeight: 400 },
  "body1-m": { fontSize: 16, lineHeight: 150, fontWeight: 500 },
  "body1-sb": { fontSize: 16, lineHeight: 150, fontWeight: 600 },
  "body2-r": { fontSize: 14, lineHeight: 150, fontWeight: 400 },
  "body2-m": { fontSize: 14, lineHeight: 150, fontWeight: 500 },
  "body2-sb": { fontSize: 14, lineHeight: 150, fontWeight: 600 },
  "body3-r": { fontSize: 13, lineHeight: 140, fontWeight: 400 },
  "body3-m": { fontSize: 13, lineHeight: 140, fontWeight: 500 },
  "label1-sb": {
    fontSize: 17,
    lineHeight: 140,
    fontWeight: 600,
    letterSpacing: -1,
  },
  "label2-sb": { fontSize: 14, lineHeight: 140, fontWeight: 600 },
  "label3-sb": { fontSize: 12, lineHeight: 140, fontWeight: 600 },
  "caption1-r": { fontSize: 12, lineHeight: 140, fontWeight: 400 },
  "caption1-m": { fontSize: 12, lineHeight: 140, fontWeight: 500 },
};

/** RN은 lineHeight에 %를 쓸 수 없으므로 px로 변환한다 */
function toLineHeightPx(fontSize, lineHeightPercent) {
  return Math.round(fontSize * lineHeightPercent) / 100;
}

module.exports = { FONT_FAMILY_BY_WEIGHT, TYPOGRAPHY, toLineHeightPx };
