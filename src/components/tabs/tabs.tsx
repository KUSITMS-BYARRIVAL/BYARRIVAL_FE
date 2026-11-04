import { Pressable, Text, View } from "react-native";

import { cn } from "@/lib/cn";

type TabsItem = {
  value: string;
  label: string;
  count?: number;
};

type TabsProps = {
  items: TabsItem[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    // Figma의 좌우 여백(px-5)은 페이지 여백과 겹칠 수 있어 사용처에서 className으로 준다
    <View
      accessibilityRole="tablist"
      className={cn("flex-row gap-[18px]", className)}
    >
      {items.map((item) => {
        const isSelected = item.value === value;

        return (
          <Pressable
            key={item.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            className="min-h-[51px] flex-1 flex-row items-center justify-center gap-0.5 p-2"
            onPress={() => onChange(item.value)}
          >
            <Text
              className={cn(
                "text-label2-sb",
                isSelected ? "text-primary" : "text-tertiary",
              )}
            >
              {item.label}
            </Text>
            {item.count !== undefined && (
              <Text
                className={cn(
                  "text-caption1-r",
                  isSelected ? "text-secondary" : "text-tertiary",
                )}
              >
                · {item.count}
              </Text>
            )}
            {isSelected && (
              <View className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-grey-700" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
