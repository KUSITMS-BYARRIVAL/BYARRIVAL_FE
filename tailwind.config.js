/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // RN은 커스텀 폰트에서 fontWeight로 굵기를 고르지 못하므로 굵기별 폰트 이름을 직접 지정한다
      fontFamily: {
        "pretendard-regular": ["Pretendard-Regular"],
        "pretendard-medium": ["Pretendard-Medium"],
        "pretendard-semibold": ["Pretendard-SemiBold"],
        "pretendard-bold": ["Pretendard-Bold"],
      },
    },
  },
  plugins: [],
};
