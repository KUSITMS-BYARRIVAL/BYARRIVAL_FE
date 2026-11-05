import type { ReactNode } from "react";
import { Pressable, type PressableProps, Text, View } from "react-native";

import { ArrowRightSIcon } from "@/assets/icons";
import { cn } from "@/lib/cn";
import { SEMANTIC } from "@/theme/colors";

type ListRowProps = Omit<PressableProps, "children"> & {
  /** 왼쪽 아이콘 (예: AlarmIcon). 종류가 늘어날 수 있어 노드로 받는다 */
  icon?: ReactNode;
  label: string;
  /** 오른쪽 보조 문구 (예: 현재 설정 값) */
  subtext?: string;
  hasArrow?: boolean;
  /** danger는 로그아웃·탈퇴처럼 되돌리기 어려운 동작에 쓴다 */
  tone?: "default" | "danger";
  className?: string;
};

export function ListRow({
  icon,
  label,
  subtext,
  hasArrow = true,
  tone = "default",
  className,
  ...props
}: ListRowProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        "flex-row items-center justify-between bg-white px-5 py-4",
        className,
      )}
      {...props}
    >
      {({ pressed }) => (
        <>
          {pressed && <View className="absolute inset-0 bg-btn-pressed" />}
          <View className="flex-1 flex-row items-center gap-2">
            {icon}
            <Text
              numberOfLines={1}
              className={cn(
                "max-w-[213px] text-body2-m",
                tone === "danger" ? "text-danger" : "text-strong",
              )}
            >
              {label}
            </Text>
          </View>
          {(subtext || hasArrow) && (
            <View className="flex-row items-center">
              {subtext && (
                <Text
                  numberOfLines={1}
                  className="max-w-[213px] text-tertiary text-body3-r"
                >
                  {subtext}
                </Text>
              )}
              {hasArrow && (
                <ArrowRightSIcon color={SEMANTIC.icon["on-fill-muted"]} />
              )}
            </View>
          )}
        </>
      )}
    </Pressable>
  );
}
