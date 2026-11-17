import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

import { AiCircleIcon, ClockIcon } from "@/assets/icons";
import { CategoryBadge } from "@/components/badge/category-badge";
import { cn } from "@/lib/cn";
import type { Category } from "@/theme/category";

// Figma Card_News Selected 그림자 (Drop Shadow 0 10 20 #0000001A)
const SELECTED_SHADOW = { boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" };

type NewsCardProps = {
  category: Category;
  categoryLabel: string;
  /** 읽는 데 걸리는 시간(분) */
  readMinutes: number;
  title: string;
  /** AI 요약 한 줄 (AI 아이콘 옆) */
  aiSummary: string;
  image: string | number;
  /** 뉴스 탑승하기에서 고른 기사면 위쪽 영역이 초록 배경·테두리가 되고 그림자가 생긴다 */
  isSelected?: boolean;
  onPress?: () => void;
  className?: string;
};

export function NewsCard({
  category,
  categoryLabel,
  readMinutes,
  title,
  aiSummary,
  image,
  isSelected = false,
  onPress,
  className,
}: NewsCardProps) {
  return (
    // 그림자는 overflow-hidden에 잘리지 않도록 바깥 Pressable에 두고, 둥근 모서리 자르기는 안쪽 View가 맡는다
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      accessibilityRole={onPress ? "checkbox" : undefined}
      accessibilityState={onPress ? { checked: isSelected } : undefined}
      className={cn("rounded", className)}
      style={isSelected ? SELECTED_SHADOW : undefined}
    >
      <View className="overflow-hidden rounded">
        {/* 선택 전에도 흰 테두리로 두께를 둬 눌러도 크기가 바뀌지 않게 한다 */}
        <View
          className={cn(
            "gap-5 rounded-t border border-b-0 p-5",
            isSelected
              ? "border-brand bg-card-green"
              : "border-white bg-card-white",
          )}
        >
          <View className="gap-1.5">
            <View className="flex-row items-center gap-2">
              <CategoryBadge category={category} label={categoryLabel} />
              <View className="flex-row items-center gap-1">
                <View className="size-5 items-center justify-center">
                  <ClockIcon width={20} height={20} />
                </View>
                <Text className="text-secondary text-caption1-m">
                  {readMinutes}분
                </Text>
              </View>
            </View>
            <Text numberOfLines={2} className="text-primary text-title2-sb">
              {title}
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <AiCircleIcon />
            <Text className="flex-1 text-secondary text-caption1-m">
              {aiSummary}
            </Text>
          </View>
        </View>
        <Image
          source={image}
          contentFit="cover"
          style={{ width: "100%", height: 267 }}
        />
      </View>
    </Pressable>
  );
}
