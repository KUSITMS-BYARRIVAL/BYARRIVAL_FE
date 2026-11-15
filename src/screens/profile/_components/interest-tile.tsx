import type { ComponentType } from "react";
import { Pressable, Text, View } from "react-native";
import type { SvgProps } from "react-native-svg";

import { CheckCircleIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { PALETTE } from "@/theme/colors";

type InterestTileProps = {
  Icon: ComponentType<SvgProps>;
  title: string;
  isSelected: boolean;
  onPress: () => void;
  disabled?: boolean;
  className?: string;
};

// Figma SelectionButton_Category (마이 - 설정 관심 카테고리): 160px 높이, 60px 아이콘과 이름을 가운데에 둔다
// 온보딩 SelectionTile(40px 아이콘·영문 부제·아래 정렬)과 시안이 달라 이 화면 전용으로 둔다
export function InterestTile({
  Icon,
  title,
  isSelected,
  onPress,
  disabled,
  className,
}: InterestTileProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityLabel={title}
      accessibilityState={{ checked: isSelected, disabled }}
      disabled={disabled}
      onPress={onPress}
      className={cn(
        "h-[160px] items-center justify-center rounded border p-5",
        isSelected
          ? "border-brand bg-card-green"
          : "border-transparent bg-card-white",
        className,
      )}
    >
      <View className="items-center gap-2">
        <Icon width={60} height={60} />
        <Text
          numberOfLines={1}
          className={cn(
            "text-center text-label1-sb",
            isSelected ? "text-primary" : "text-secondary",
          )}
        >
          {title}
        </Text>
      </View>
      {/* Figma Selection Indicato: 30px, 위 12px·오른쪽 14px */}
      {isSelected && (
        <CheckCircleIcon
          width={30}
          height={30}
          color={PALETTE.green[500]}
          style={{ position: "absolute", top: 12, right: 14 }}
        />
      )}
    </Pressable>
  );
}
