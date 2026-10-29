import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

import { TYPOGRAPHY } from "@/theme/typography";

// text-heading1-b 같은 타이포 토큰을 글자 크기로 등록한다.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: Object.keys(TYPOGRAPHY) }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
