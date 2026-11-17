import { Pressable, Text, View } from "react-native";

import { CheckCircleIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { PALETTE } from "@/theme/colors";

type TermsCheckRowProps = {
  label: string;
  isChecked: boolean;
  onToggle: () => void;
  /** 약관 본문 보기. 없으면 '보기'를 숨긴다 */
  onView?: () => void;
  /** 전체 동의 줄은 글자를 크게 보여준다 */
  isAll?: boolean;
};

export function TermsCheckRow({
  label,
  isChecked,
  onToggle,
  onView,
  isAll = false,
}: TermsCheckRowProps) {
  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked }}
        accessibilityLabel={label}
        onPress={onToggle}
        className="flex-1 flex-row items-center gap-3.5"
      >
        <CheckCircleIcon
          width={24}
          height={24}
          color={isChecked ? PALETTE.green[500] : PALETTE.green[100]}
        />
        <Text
          className={cn(
            isAll
              ? "text-on-fill-default text-heading3-sb"
              : "text-on-fill-muted text-caption1-r",
          )}
        >
          {label}
        </Text>
      </Pressable>
      {onView && (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${label} 보기`}
          onPress={onView}
          className="px-[5px]"
        >
          <Text className="text-on-fill-default underline text-caption1-r">
            보기
          </Text>
        </Pressable>
      )}
    </View>
  );
}
