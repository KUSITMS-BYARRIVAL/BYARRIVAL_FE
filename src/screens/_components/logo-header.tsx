import type { ReactNode } from "react";
import { Pressable, View } from "react-native";

import { LogoIllustration } from "@/assets/illustrations";

type LogoHeaderProps = {
  onLogoPress?: () => void;
  right?: ReactNode;
};

// 보관함 · 마이의 공통 Header(h-11)와 높이를 맞춘다
export function LogoHeader({ onLogoPress, right }: LogoHeaderProps) {
  return (
    <View className="h-11 flex-row items-center justify-between px-5">
      {onLogoPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="홈으로"
          onPress={onLogoPress}
        >
          <LogoIllustration />
        </Pressable>
      ) : (
        <LogoIllustration />
      )}
      {right}
    </View>
  );
}
