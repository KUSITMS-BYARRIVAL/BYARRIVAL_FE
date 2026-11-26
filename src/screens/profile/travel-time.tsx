import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";

import { NumericSpinner } from "@/components/numeric-spinner/numeric-spinner";
import { useReplaceWeeklyCommute } from "@/hooks/mutations/use-replace-weekly-commute";
import { useUpdateMe } from "@/hooks/mutations/use-update-me";
import { useGetMe } from "@/hooks/queries/use-get-me";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { track } from "@/lib/analytics";
import { useToastStore } from "@/stores/toast-store";
import type { UserMeResponse } from "@/types/user/user.types";

import { SettingsLayout } from "./_components/settings-layout";
import { UserMeState } from "./_components/user-me-state";
import { WeeklySettingsLayout } from "./_components/weekly-settings-layout";
import { MAX_MINUTES, MINUTE_STEP, WEEKDAYS } from "./_constants";
import {
  earliestTime,
  toDailyCommutes,
  toWeeklyPlan,
  type WeeklyPlan,
} from "./_helpers";

const TITLE = "요일별 이동 시간";
// +/- 를 연달아 누르는 동안은 화면에만 반영하고, 멈춘 뒤 한 번만 저장한다
const SAVE_DELAY_MS = 600;
const DEFAULT_MINUTES = 30;
const NO_COMMUTE_DAY_MESSAGE = "이동하는 요일이 하루 이상 있어야 저장돼요";

const describe = (minutes: number) =>
  minutes > 0 ? `약 ${minutes}분` : "쉬는 날";

// Figma 마이 - 설정(요일별 이동 시간)
// 기본 → PATCH /users/me, 요일 → PUT /users/me/weekly-commute. 0분이면 쉬는 날(이동하지 않는 요일)
export function ProfileTravelTimeScreen() {
  const { data: me } = useGetMe();
  if (!me) {
    return (
      <SettingsLayout title={TITLE}>
        <UserMeState>{() => null}</UserMeState>
      </SettingsLayout>
    );
  }
  return <TravelTimeForm me={me} />;
}

function TravelTimeForm({ me }: { me: UserMeResponse }) {
  const { mutate: updateMe } = useUpdateMe();
  const { mutate: replaceWeekly } = useReplaceWeeklyCommute();
  const queryClient = useQueryClient();
  // 기본·요일 저장이 함께 나가면 응답 순서에 따라 캐시가 한쪽 변경을 잃으므로, 끝나면 내 정보를 다시 받는다
  const refreshMe = () =>
    queryClient.invalidateQueries({ queryKey: ["user", "getMe"] });
  const showToast = useToastStore((state) => state.showToast);
  const [base, setBase] = useState(me.defaultCommuteMinutes ?? DEFAULT_MINUTES);
  const [plan, setPlan] = useState(() => toWeeklyPlan(me.weeklyCommute));

  const trackChange = () => track("setting_change", { field: "commute_time" });
  const saveBase = useDebouncedCallback((minutes: number) => {
    updateMe(
      { defaultCommuteMinutes: minutes },
      { onSuccess: trackChange, onSettled: refreshMe },
    );
  }, SAVE_DELAY_MS);
  const saveWeekly = useDebouncedCallback((next: WeeklyPlan) => {
    const days = toDailyCommutes(next);
    // 서버는 이동하는 요일이 하루 이상이어야 받는다
    if (days.length === 0) {
      showToast({ message: NO_COMMUTE_DAY_MESSAGE });
      return;
    }
    replaceWeekly(days, { onSuccess: trackChange, onSettled: refreshMe });
  }, SAVE_DELAY_MS);

  const changeDay = (weekday: keyof WeeklyPlan, minutes: number) => {
    // 쉬는 날을 이동하는 날로 바꾸면 출근 시각은 기본(가장 이른) 시각으로 채운다
    const time =
      plan[weekday].minutes === 0 ? earliestTime(plan) : plan[weekday].time;
    const next = { ...plan, [weekday]: { minutes, time } };
    setPlan(next);
    saveWeekly(next);
  };

  return (
    <WeeklySettingsLayout
      title={TITLE}
      base={
        <NumericSpinner
          label="기본"
          description={describe(base)}
          value={base}
          onChange={(minutes) => {
            setBase(minutes);
            saveBase(minutes);
          }}
          step={MINUTE_STEP}
          // 기본 이동 시간에는 쉬는 날(0분)이 없다
          min={MINUTE_STEP}
          max={MAX_MINUTES}
        />
      }
    >
      <View className="gap-3 rounded bg-white p-5">
        {WEEKDAYS.map(({ value, label }) => {
          const { minutes } = plan[value];
          return (
            <NumericSpinner
              key={value}
              label={label}
              description={describe(minutes)}
              value={minutes}
              onChange={(next) => changeDay(value, next)}
              step={MINUTE_STEP}
              max={MAX_MINUTES}
            />
          );
        })}
      </View>
    </WeeklySettingsLayout>
  );
}
