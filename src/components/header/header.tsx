import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { ArrowLeftLIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

type HeaderProps = {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  className?: string;
};

export function Header({ title, onBack, right, className }: HeaderProps) {
  return (
    <View
      className={cn(
        "h-11 flex-row items-center justify-between pr-5",
        !onBack && "pl-5",
        className,
      )}
    >
      <View className="flex-row items-center gap-2.5">
        {/* 공용 화살표 SVG가 Figma 아이콘보다 5.6px 왼쪽에 그려져 있어 Figma 여백 6px에 더해 보정 */}
        {onBack && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="뒤로가기"
            className="size-11 justify-center pl-[11.6px]"
            onPress={onBack}
          >
            <ArrowLeftLIcon color={SEMANTIC.icon.primary} />
          </Pressable>
        )}
        {title && (
          <Text
            accessibilityRole="header"
            className="text-primary text-heading3-sb"
          >
            {title}
          </Text>
        )}
      </View>
      {right && <View className="flex-row items-center gap-3">{right}</View>}
    </View>
  );
}
