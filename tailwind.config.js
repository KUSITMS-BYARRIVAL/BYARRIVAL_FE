const plugin = require("tailwindcss/plugin");
const {
  FONT_FAMILY_BY_WEIGHT,
  TYPOGRAPHY,
  toLineHeightPx,
} = require("./src/theme/typography");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
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
