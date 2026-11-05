import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProfileIcon } from "@/assets/icons";
import { MyHomeTrainIllustration } from "@/assets/illustrations";
import { Header } from "@/components/header/header";

type MySummaryHeroProps = {
  totalHours: number;
  monthMinutes: number;
  readCount: number;
  onPressProfile: () => void;
  /** 첫 화면을 꽉 채우도록 사용처가 잰 화면 높이 */
  minHeight?: number;
};

export function MySummaryHero({
  totalHours,
  monthMinutes,
  readCount,
  onPressProfile,
  minHeight,
}: MySummaryHeroProps) {
  const { top } = useSafeAreaInsets();

  return (
    // 배경이 상태 표시줄 뒤까지 이어지도록 여백은 안쪽에 준다
    <View
      className="bg-green-opacity-100"
      style={{ paddingTop: top, minHeight }}
    >
      <Header
        title="나의 기록"
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="프로필"
            hitSlop={10}
            onPress={onPressProfile}
          >
            <ProfileIcon />
          </Pressable>
        }
      />
      <View className="gap-3.5 p-5">
        {/* 공용 Badge는 rounded-full·label2-sb까지만 있어 시안(rounded-sm·label1-sb)과 달라 직접 그린다 */}
        <View className="self-start rounded-sm bg-green-opacity-100 px-3 py-1.5">
          <Text className="text-brand text-label1-sb">총 {totalHours} H</Text>
        </View>
        <View className="gap-2">
          <View className="gap-1">
            <Text className="text-strong text-heading2-sb">이번 달,</Text>
            <Text className="text-strong text-display1-b">
              {`${Math.floor(monthMinutes / 60)}시간 ${monthMinutes % 60}분을\n채웠어요`}
            </Text>
          </View>
          <Text className="text-secondary text-body2-m">
            {`그냥 지나갈 수 있었던 출근 시간이\n${readCount}개의 이야기로 채워졌어요.`}
          </Text>
        </View>
      </View>
      {/* Figma 배경 프레임에서 문구 아래(y=367~)만 viewBox로 잘라 쓴다. 기기 너비에 맞춰 비율대로 늘어나고, 남는 높이는 위쪽 여백(mt-auto)이 흡수한다 */}
      <View className="mt-auto aspect-[393/396] w-full">
        <MyHomeTrainIllustration width="100%" height="100%" />
      </View>
    </View>
  );
}
