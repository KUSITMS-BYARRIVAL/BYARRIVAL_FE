import { TextInput, type TextInputProps, View } from "react-native";

import { SearchIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { PALETTE, SEMANTIC } from "@/theme/colors";

type SearchFieldProps = TextInputProps & {
  className?: string;
};

export function SearchField({ className, ...props }: SearchFieldProps) {
  return (
    <View
      className={cn(
        "min-h-[54px] flex-row items-center gap-2 rounded-[14px] border border-default bg-white px-4",
        className,
      )}
    >
      <SearchIcon color={SEMANTIC.icon["on-fill-muted"]} />
      <TextInput
        placeholderTextColor={SEMANTIC.text["on-fill-muted"]}
        cursorColor={PALETTE.grey[600]}
        selectionColor={PALETTE.grey[600]}
        returnKeyType="search"
        // iOS 한 줄 TextInput에 lineHeight를 주면 영문 아래꼬리가 잘려서 body2-m에서 행간만 뺐다
        className="flex-1 font-pretendard-medium text-[14px] text-primary"
        {...props}
      />
    </View>
  );
}
