import type { FC } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { SvgProps } from "react-native-svg";

import { cn } from "@/lib/cn";

type TabBarItem = {
  key: string;
  label: string;
  // 아이콘이 다색 일러스트라 색으로 상태를 바꿀 수 없어 선택/비선택 아이콘을 따로 받는다
  icon: FC<SvgProps>;
  selectedIcon: FC<SvgProps>;
};

type TabBarProps = {
  items: TabBarItem[];
  selectedKey: string;
  onSelect: (key: string) => void;
  className?: string;
};

export function TabBar({
  items,
  selectedKey,
  onSelect,
  className,
}: TabBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      accessibilityRole="tablist"
      className={cn(
        "flex-row justify-between border-t border-grey-200 bg-nav-background px-[34px] pt-2",
        className,
      )}
      // 홈 인디케이터 영역은 기기마다 달라 safe area로 채운다
      style={{ paddingBottom: bottom + 4 }}
    >
      {items.map(({ key, label, icon: Icon, selectedIcon: SelectedIcon }) => {
        const isSelected = key === selectedKey;

        return (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            className="w-[50px] items-center gap-1"
            onPress={() => onSelect(key)}
          >
            {isSelected ? <SelectedIcon /> : <Icon />}
            <Text
              className={cn(
                "text-label3-sb",
                isSelected ? "text-green-800" : "text-grey-400",
              )}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
