import { Pressable, type PressableProps } from "react-native";

import { ShareIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

type ShareButtonProps = Omit<PressableProps, "children"> & {
  className?: string;
};

// Figma icon-share-fill: 흰 원(40px) 안의 초록 공유 아이콘
export function ShareButton({ className, ...props }: ShareButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="공유하기"
      className={cn(
        "size-10 items-center justify-center rounded-full bg-white",
        className,
      )}
      {...props}
    >
      <ShareIcon color={SEMANTIC.icon.brand} />
    </Pressable>
  );
}
