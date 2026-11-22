import { Pressable, type PressableProps, View } from "react-native";

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
      {({ pressed }) => (
        <>
          {/* QA: 누르면 원 전체를 Grey 300으로 */}
          {pressed && (
            <View className="absolute inset-0 rounded-full bg-grey-300" />
          )}
          <ShareIcon color={SEMANTIC.icon.brand} />
        </>
      )}
    </Pressable>
  );
}
