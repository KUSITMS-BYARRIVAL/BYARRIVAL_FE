import { Pressable, type PressableProps } from "react-native";

import { BookmarkIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

type BookmarkButtonProps = Omit<PressableProps, "children"> & {
  bookmarked: boolean;
  className?: string;
};

export function BookmarkButton({
  bookmarked,
  className,
  accessibilityState,
  ...props
}: BookmarkButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="북마크"
      accessibilityState={{ ...accessibilityState, selected: bookmarked }}
      // 28px 버튼은 손가락으로 누르기 작아 터치 영역만 넓힌다
      hitSlop={8}
      className={cn(
        "size-7 items-center justify-center rounded-full",
        className,
      )}
      {...props}
    >
      <BookmarkIcon
        color={
          bookmarked ? SEMANTIC.icon.brand : SEMANTIC.icon["on-fill-muted"]
        }
      />
    </Pressable>
  );
}
