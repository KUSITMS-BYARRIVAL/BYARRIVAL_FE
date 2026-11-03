import { Pressable, type PressableProps, Text } from "react-native";

import DeleteIcon from "@/assets/icons/delete.svg";
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
  className,
  accessibilityState,
  ...props
}: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ ...accessibilityState, selected }}
      className={cn(
        "h-8 flex-row items-center justify-center gap-1.5 rounded-full px-3",
        selected ? "bg-green-opacity-100" : "bg-white",
        className,
      )}
      {...props}
    >
      <Text
        className={cn(
          "text-label2-sb",
          selected ? "text-brand" : "text-tertiary",
        )}
      >
        {label}
      </Text>
      {onDelete && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${label} 삭제`}
          hitSlop={8}
          onPress={onDelete}
        >
          <DeleteIcon color={SEMANTIC.icon.brand} />
        </Pressable>
      )}
    </Pressable>
  );
}
