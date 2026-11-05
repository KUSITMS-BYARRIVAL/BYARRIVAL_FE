import { Pressable, type PressableProps, Text, View } from "react-native";

import { AppleIcon, KakaoIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";

type Provider = "apple" | "kakao";

// 로고·배경·글자색은 각 사 로그인 버튼 가이드를 따르므로 사용처에서 바꾸지 않는다
const PROVIDER = {
  apple: {
    label: "Apple로 로그인하기",
    Icon: AppleIcon,
    container: "bg-btn-apple",
    text: "text-on-fill-default text-label2-sb",
  },
  kakao: {
    label: "카카오로 로그인하기",
    Icon: KakaoIcon,
    container: "bg-btn-kakao",
    // Figma는 Noto Sans KR Medium이지만 앱 폰트(Pretendard Medium 14)로 맞춘다
    text: "text-primary text-body2-m",
  },
} satisfies Record<Provider, unknown>;

type SocialLoginButtonProps = Omit<PressableProps, "children"> & {
  provider: Provider;
  className?: string;
};

export function SocialLoginButton({
  provider,
  className,
  ...props
}: SocialLoginButtonProps) {
  const { label, Icon, container, text } = PROVIDER[provider];

  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "h-[53px] flex-row items-center justify-center gap-2.5 overflow-hidden rounded-sm px-7",
        container,
        className,
      )}
      {...props}
    >
      {({ pressed }) => (
        <>
          {pressed && <View className="absolute inset-0 bg-btn-pressed" />}
          <Icon />
          <Text className={text}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}
