import { Pressable, Text, View } from "react-native";

import { ArrowLeftSIcon, ArrowRightSIcon } from "@/assets/icons";
import { SEMANTIC } from "@/theme/colors";

type CalendarHeaderProps = {
  title: string;
  prevLabel: string;
  nextLabel: string;
  onPrev: () => void;
  onNext: () => void;
};

export function CalendarHeader({
  title,
  prevLabel,
  nextLabel,
  onPrev,
  onNext,
}: CalendarHeaderProps) {
  return (
    <View className="flex-row items-center gap-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={prevLabel}
        onPress={onPrev}
        hitSlop={8}
      >
        <ArrowLeftSIcon color={SEMANTIC.icon.primary} />
      </Pressable>
      {/* Figma 스타일명은 Title3/SB지만 값(16px·600)이 title2-sb와 같아 title2-sb를 쓴다 */}
      <Text className="text-primary text-title2-sb">{title}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={nextLabel}
        onPress={onNext}
        hitSlop={8}
      >
        <ArrowRightSIcon color={SEMANTIC.icon.primary} />
      </Pressable>
    </View>
  );
}
