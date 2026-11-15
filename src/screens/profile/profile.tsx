import { router } from "expo-router";
import type { ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AlarmIcon,
  BagColorIcon,
  CallColorIcon,
  CategoryColorIcon,
  ClockColorIcon,
  IdentificationColorIcon,
  LocationColorIcon,
  LogoutColorIcon,
  PaperColorIcon,
  PenColorIcon,
  ProfileLargeIcon,
  SubwayColorIcon,
} from "@/assets/icons";
import { ButtonCard } from "@/components/button-card/button-card";
import { ListRow } from "@/components/button-card/list-row";
import { Header } from "@/components/header/header";
import {
  INTERESTS,
  JOB_GROUPS,
  regionLabel,
  USER_TYPES,
} from "@/screens/_constants";
import { useProfileStore } from "@/stores/profile-store";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-2">
      <Text accessibilityRole="header" className="text-primary text-title3-sb">
        {title}
      </Text>
      <ButtonCard>{children}</ButtonCard>
    </View>
  );
}

// Figma 마이 - 설정(프로필): 마이 홈 프로필 버튼으로 들어온다
export function ProfileScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { nickname, userType, jobGroup, region, interests } = useProfileStore();

  const userTypeLabel = USER_TYPES.find(({ type }) => type === userType)?.title;
  const jobGroupLabel = JOB_GROUPS.find(
    ({ value }) => value === jobGroup,
  )?.title;
  const interestLabels = INTERESTS.filter(({ value }) =>
    interests.includes(value),
  )
    .map(({ title }) => title)
    .join(", ");

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <Header title="프로필" onBack={router.back} />
      <ScrollView
        contentContainerClassName="gap-9 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: Math.max(bottom, 30) }}
      >
        <View className="items-center gap-3.5">
          <ProfileLargeIcon />
          {/* TODO: 닉네임 수정 화면은 시안이 없어 연필 아이콘만 둔다 */}
          <View className="flex-row items-center gap-0.5">
            <Text className="text-strong text-title1-sb">{nickname}</Text>
            <PenColorIcon />
          </View>
        </View>
        <View className="gap-9">
          <ButtonCard>
            <ListRow
              icon={<ClockColorIcon />}
              label="요일별 이동 시간"
              onPress={() => router.push("/profile/travel-time")}
            />
            <ListRow
              icon={<BagColorIcon />}
              label="요일별 출근 시간"
              onPress={() => router.push("/profile/departure-time")}
            />
          </ButtonCard>
          <Section title="개인 설정">
            {/* TODO: 알림·위젯 설정 화면은 시안이 없어 이동을 연결하지 않았다 */}
            <ListRow
              icon={<AlarmIcon />}
              label="알림 · 위젯"
              subtext="아침 · 저녁"
            />
            <ListRow
              icon={<SubwayColorIcon />}
              label="이동 상황"
              subtext={userTypeLabel}
              onPress={() => router.push("/profile/user-type")}
            />
            <ListRow
              icon={<IdentificationColorIcon />}
              label="직군"
              subtext={jobGroupLabel}
              onPress={() => router.push("/profile/job-group")}
            />
            <ListRow
              icon={<LocationColorIcon />}
              label="근무 지역"
              subtext={regionLabel(region)}
            />
            <ListRow
              icon={<CategoryColorIcon />}
              label="관심 카테고리"
              subtext={interestLabels}
            />
          </Section>
          {/* TODO: 고객센터·개인정보 처리방침 링크와 로그아웃은 연동 방식이 정해지면 연결 */}
          <Section title="기타">
            <ListRow icon={<CallColorIcon />} label="고객센터" />
            <ListRow icon={<PaperColorIcon />} label="개인정보 처리방침" />
            <ListRow
              icon={<LogoutColorIcon />}
              label="로그아웃"
              tone="danger"
              hasArrow={false}
            />
          </Section>
        </View>
      </ScrollView>
    </View>
  );
}
