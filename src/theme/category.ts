import type { SEMANTIC } from "@/theme/colors";

export type Category = keyof typeof SEMANTIC.category.background;

// 동적 클래스 이름은 Tailwind가 수집하지 못하므로 리터럴로 매핑한다
export const CATEGORY_CLASS: Record<
  Category,
  { bg: string; text: string; selectedBg: string }
> = {
  economy: {
    bg: "bg-category-economy",
    text: "text-category-economy",
    selectedBg: "bg-light-green-600",
  },
  tech: {
    bg: "bg-category-tech",
    text: "text-category-tech",
    selectedBg: "bg-ice-blue-600",
  },
  career: {
    bg: "bg-category-career",
    text: "text-category-career",
    selectedBg: "bg-marine-blue-600",
  },
  science: {
    bg: "bg-category-science",
    text: "text-category-science",
    selectedBg: "bg-royal-blue-600",
  },
  society: {
    bg: "bg-category-society",
    text: "text-category-society",
    selectedBg: "bg-cobalt-600",
  },
  global: {
    bg: "bg-category-global",
    text: "text-category-global",
    selectedBg: "bg-navy-600",
  },
  life: {
    bg: "bg-category-life",
    text: "text-category-life",
    selectedBg: "bg-blue-purple-600",
  },
  culture: {
    bg: "bg-category-culture",
    text: "text-category-culture",
    selectedBg: "bg-purple-600",
  },
};
