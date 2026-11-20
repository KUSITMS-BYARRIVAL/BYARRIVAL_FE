import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import type { ReactNode } from "react";
import { Linking, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  AlarmIcon,
  BagIcon,
  CallIcon,
  CategoryMonoIcon,
  ClockMIcon,
  IdentificationIcon,
  LocationIcon,
  LogoutIcon,
  PaperIcon,
  PenIcon,
  SubwayMonoIcon,
} from "@/assets/icons";
import { ButtonCard } from "@/components/button-card/button-card";
import { ListRow } from "@/components/button-card/list-row";
import { Header } from "@/components/header/header";
import { Toggle } from "@/components/toggle/toggle";
import { useLogout } from "@/hooks/mutations/use-logout";
import { useWithdraw } from "@/hooks/mutations/use-withdraw";
import { useGetCategories } from "@/hooks/queries/use-get-categories";
import { regionLabelOf } from "@/screens/_components/region-picker";
import { INTERESTS, JOB_GROUPS, USER_TYPES } from "@/screens/_constants";
import { toInterests } from "@/screens/_helpers";
import { useDialogStore } from "@/stores/dialog-store";
import { fromJobGroupCode, fromTravelType } from "@/types/user/user.mappers";
import type { UserMeResponse } from "@/types/user/user.types";

import { ProfilePhoto } from "./_components/profile-photo";
import { UserMeState } from "./_components/user-me-state";
import { useNotificationToggle } from "./_hooks/use-notification-toggle";

// 카카오톡 오픈채팅 '도착까지 고객센터'
const CUSTOMER_CENTER_URL = "https://open.kakao.com/o/sch3rQXi";
const PRIVACY_POLICY_URL =
  "https://hyunjin-lee.notion.site/406a5a5532818056926be2b8a92583f1";

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

// Figma 마이 - 설정(프로필): 마이 홈 프로필 버튼으로 들어온다 (GET /users/me)
export function ProfileScreen() {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-default" style={{ paddingTop: top }}>
      <Header title="프로필" onBack={router.back} />
      <ScrollView
        contentContainerClassName="gap-9 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: Math.max(bottom, 30) }}
      >
        <UserMeState>{(me) => <ProfileContent me={me} />}</UserMeState>
      </ScrollView>
    </View>
  );
}

function ProfileContent({ me }: { me: UserMeResponse }) {
  const { data: categories } = useGetCategories();
  const openDialog = useDialogStore((state) => state.openDialog);
  const { mutate: logout } = useLogout();
  const { mutate: withdraw } = useWithdraw();
  const notification = useNotificationToggle();

  const userType = me.travelType && fromTravelType(me.travelType);
  const jobGroup = me.jobGroups?.[0] && fromJobGroupCode(me.jobGroups[0]);
  const interests = categories ? toInterests(me.categoryIds, categories) : [];
  const userTypeLabel = USER_TYPES.find(({ type }) => type === userType)?.title;
  const jobGroupLabel = JOB_GROUPS.find(
    ({ value }) => value === jobGroup,
  )?.title;
  const interestLabels = INTERESTS.filter(({ value }) =>
    interests.includes(value),
  )
    .map(({ title }) => title)
    .join(", ");

  // 세션을 비운 뒤 로그인 화면으로 (뒤로 가기로 돌아오지 않게 replace)
  const goToSignIn = () => router.replace("/sign-in");

  return (
    <>
      <View className="items-center gap-3.5">
        <ProfilePhoto imageUrl={me.profileImageUrl} />
        {/* TODO: 닉네임 수정 화면은 시안이 없어 연필 아이콘만 둔다 */}
        <View className="flex-row items-center gap-0.5">
          <Text className="text-strong text-title1-sb">{me.nickname}</Text>
          <PenIcon />
        </View>
      </View>
      <View className="gap-9">
        <ButtonCard>
          <ListRow
            icon={<ClockMIcon />}
            label="요일별 이동 시간"
            onPress={() => router.push("/profile/travel-time")}
          />
          <ListRow
            icon={<BagIcon />}
            label="요일별 출근 시간"
            onPress={() => router.push("/profile/departure-time")}
          />
        </ButtonCard>
        <Section title="개인 설정">
          {/* [임시] 시안이 없어 이동 대신 토글. 줄 자체는 누를 수 없고 토글만 읽힌다 */}
          <ListRow
            icon={<AlarmIcon />}
            label="알림"
            hasArrow={false}
            disabled
            accessible={false}
            trailing={
              <Toggle
                accessibilityLabel="알림"
                value={notification.isOn}
                onValueChange={notification.toggle}
                disabled={!notification.isReady}
                // 아래 줄 화살표(>)는 24px 아이콘 안에서 오른쪽 9px가 비어 있어 끝을 맞춘다
                className="mr-[9px]"
              />
            }
          />
          <ListRow
            icon={<SubwayMonoIcon />}
            label="이동 상황"
            subtext={userTypeLabel}
            onPress={() => router.push("/profile/user-type")}
          />
          <ListRow
            icon={<IdentificationIcon />}
            label="직군"
            subtext={jobGroupLabel}
            onPress={() => router.push("/profile/job-group")}
          />
          <ListRow
            icon={<LocationIcon />}
            label="근무 지역"
            subtext={me.region ? regionLabelOf(me.region) : undefined}
            onPress={() => router.push("/profile/region")}
          />
          <ListRow
            icon={<CategoryMonoIcon />}
            label="관심 카테고리"
            subtext={interestLabels}
            onPress={() => router.push("/profile/interests")}
          />
        </Section>
        <Section title="기타">
          <ListRow
            icon={<CallIcon />}
            label="고객센터"
            // 인앱 브라우저는 카카오톡 앱으로 넘어가지 않아 시스템으로 연다 (설치돼 있으면 카카오톡 실행)
            onPress={() => Linking.openURL(CUSTOMER_CENTER_URL)}
          />
          <ListRow
            icon={<PaperIcon />}
            label="개인정보 처리방침"
            onPress={() => WebBrowser.openBrowserAsync(PRIVACY_POLICY_URL)}
          />
          <ListRow
            icon={<LogoutIcon />}
            label="로그아웃"
            tone="danger"
            hasArrow={false}
            onPress={() =>
              openDialog({
                title: "로그아웃할까요?",
                confirmLabel: "로그아웃",
                confirmColor: "danger",
                onConfirm: () => logout(undefined, { onSettled: goToSignIn }),
                cancelLabel: "취소",
              })
            }
          />
          {/* [임시] 탈퇴 진입점은 시안이 없어 기타 섹션 마지막 줄로 둔다 */}
          <ListRow
            icon={<LogoutIcon />}
            label="회원 탈퇴"
            tone="danger"
            hasArrow={false}
            onPress={() =>
              openDialog({
                title: "탈퇴할까요?",
                description:
                  "탈퇴 후 6개월 안에 같은 계정으로 다시 로그인하면 기록이 복원돼요.",
                confirmLabel: "탈퇴",
                confirmColor: "danger",
                onConfirm: () => withdraw(undefined, { onSuccess: goToSignIn }),
                cancelLabel: "취소",
              })
            }
          />
        </Section>
      </View>
    </>
  );
}
