import { Text, TextInput, type TextInputProps, View } from "react-native";

import { cn } from "@/lib/cn";
import { PALETTE, SEMANTIC } from "@/theme/colors";

type TextFieldProps = TextInputProps & {
  error?: boolean;
  helperText?: string;
  className?: string;
};

export function TextField({
  error = false,
  helperText,
  maxLength,
  value,
  className,
  ...props
}: TextFieldProps) {
  const hasHelper = !!helperText || maxLength !== undefined;
  const helperClass = cn(
    "text-caption1-r",
    error ? "text-danger" : "text-tertiary",
  );

  return (
    <View className={cn("gap-2", className)}>
      <TextInput
        maxLength={maxLength}
        value={value}
        placeholderTextColor={
          error ? SEMANTIC.text.danger : SEMANTIC.text["on-fill-muted"]
        }
        cursorColor={PALETTE.grey[600]}
        selectionColor={PALETTE.grey[600]}
        className={cn(
          "min-h-[54px] rounded-[14px] border border-default px-4 py-2.5 text-body2-m",
          error ? "bg-red-50 text-danger" : "bg-white text-primary",
        )}
        {...props}
      />
      {hasHelper && (
        <View className="flex-row justify-between px-1">
          <Text className={helperClass}>{helperText}</Text>
          {maxLength !== undefined && (
            // 글자 수는 value로 세므로 제어 컴포넌트로 써야 정확하다
            <Text className={helperClass}>
              {`${value?.length ?? 0}/${maxLength}`}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
