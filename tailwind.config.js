const plugin = require("tailwindcss/plugin");
const {
  FONT_FAMILY_BY_WEIGHT,
  TYPOGRAPHY,
  toLineHeightPx,
} = require("./src/theme/typography");
const { PALETTE, SEMANTIC } = require("./src/theme/colors");

const {
  background: iconBackground,
  "background-brand": iconBackgroundBrand,
  ...iconColors
} = SEMANTIC.icon;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    // extend가 아닌 교체: Tailwind 기본 색을 없애고 디자인 팔레트만 쓴다
    colors: PALETTE,
    extend: {
      // 시맨틱 컬러는 용도에 맞는 접두사에서만 쓸 수 있게 등록한다
      textColor: {
        ...SEMANTIC.text,
        category: SEMANTIC.category.text,
        icon: iconColors,
      },
      backgroundColor: {
        ...SEMANTIC.background,
        btn: SEMANTIC.btn,
        card: SEMANTIC.card,
        category: SEMANTIC.category.background,
        icon: {
          background: iconBackground,
          "background-brand": iconBackgroundBrand,
        },
        nav: { background: SEMANTIC.navigationBar.background },
      },
      borderColor: {
        ...SEMANTIC.border,
        red: { DEFAULT: SEMANTIC.border.red },
      },
      fontFamily: {
        "pretendard-regular": [FONT_FAMILY_BY_WEIGHT[400]],
        "pretendard-medium": [FONT_FAMILY_BY_WEIGHT[500]],
        "pretendard-semibold": [FONT_FAMILY_BY_WEIGHT[600]],
        "pretendard-bold": [FONT_FAMILY_BY_WEIGHT[700]],
      },
    },
  },
  plugins: [
    // 시맨틱 타이포 토큰: text-heading1-b 하나로 크기, 행간, 폰트(굵기)를 한 번에 적용한다
    plugin(({ addUtilities }) => {
      addUtilities(
        Object.fromEntries(
          Object.entries(TYPOGRAPHY).map(
            ([name, { fontSize, lineHeight, fontWeight }]) => [
              `.text-${name}`,
              {
                fontSize: `${fontSize}px`,
                lineHeight: `${toLineHeightPx(fontSize, lineHeight)}px`,
                fontFamily: FONT_FAMILY_BY_WEIGHT[fontWeight],
              },
            ],
          ),
        ),
      );
    }),
  ],
};
