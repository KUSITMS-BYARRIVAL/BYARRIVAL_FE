import { Pressable, type PressableProps, Text, View } from "react-native";

import { DeleteIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

type ChipProps = Omit<PressableProps, "children"> & {
  label: string;
  selected?: boolean;
  onDelete?: () => void;
  className?: string;
};

export function Chip({
  label,
  selected = true,
  onDelete,
  disabled,
  className,
  accessibilityState,
  ...props
}: ChipProps) {
  // 삭제 버튼을 칩 버튼 안에 두면 스크린리더가 칩만 읽어 삭제 버튼에 닿지 못해 형제로 둔다
  return (
    <View
      className={cn(
        "h-8 flex-row items-center gap-1.5 overflow-hidden rounded-full",
        selected ? "bg-green-500" : "bg-white",
        className,
      )}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ ...accessibilityState, selected }}
        className={cn("h-full justify-center pl-3", !onDelete && "pr-3")}
        disabled={disabled}
        {...props}
      >
        <Text
          className={cn(
            "text-label2-sb",
            selected ? "text-on-fill-default" : "text-secondary",
          )}
        >
          {label}
        </Text>
      </Pressable>
      {onDelete && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} 삭제`}
          className="h-full justify-center pr-3"
          disabled={disabled}
          onPress={onDelete}
        >
          <DeleteIcon color={SEMANTIC.icon["on-fill-default"]} />
        </Pressable>
      )}
    </View>
  );
}
