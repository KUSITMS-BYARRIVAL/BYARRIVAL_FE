import { useState } from "react";

import { BottomSheet } from "@/components/bottom-sheet/bottom-sheet";
import { type Time, TimePicker } from "@/components/time-picker/time-picker";
import { TimeSetting } from "@/components/time-setting/time-setting";
import { TimeSettingRow } from "@/components/time-setting/time-setting-row";
import { useReplaceWeeklyCommute } from "@/hooks/mutations/use-replace-weekly-commute";
import { useGetMe } from "@/hooks/queries/use-get-me";
import { useToastStore } from "@/stores/toast-store";

import { SettingsLayout } from "./_components/settings-layout";
import { UserMeState } from "./_components/user-me-state";
import { WeeklySettingsLayout } from "./_components/weekly-settings-layout";
import { WEEKDAYS, type Weekday } from "./_constants";
import {
  earliestTime,
  toDailyCommutes,
  toWeeklyPlan,
  type WeeklyPlan,
  withAllTimes,
} from "./_helpers";

const TITLE = "요일별 출근 시간";
const NO_COMMUTE_DAY_MESSAGE =
  "이동하는 요일이 있어야 출근 시간을 바꿀 수 있어요";

type Target = "base" | Weekday;

// Figma 마이 - 설정(요일별 출근 시간): 확인을 누르면 저장된다 (PUT /users/me/weekly-commute)
// 서버에 기본 출근 시각이 없어, 기본 = 이동하는 요일 중 가장 이른 시각이고 바꾸면 모든 요일을 한 번에 바꾼다
export function ProfileDepartureTimeScreen() {
  const { data: me } = useGetMe();
  const { mutate } = useReplaceWeeklyCommute();
  const showToast = useToastStore((state) => state.showToast);
  // 시간을 고르는 대상. null이면 바텀시트를 닫는다
  const [target, setTarget] = useState<Target | null>(null);
  // 휠을 돌리는 동안의 값. 확인을 눌러야 저장한다
  const [draft, setDraft] = useState<Time>({ hour: 8, minute: 0 });

  if (!me) {
    return (
      <SettingsLayout title={TITLE}>
        <UserMeState>{() => null}</UserMeState>
      </SettingsLayout>
    );
  }

  const plan = toWeeklyPlan(me.weeklyCommute);
  const base = earliestTime(plan);

  const open = (next: Target) => {
    setDraft(next === "base" ? base : plan[next].time);
    setTarget(next);
  };

  const save = () => {
    if (!target) return;
    const next: WeeklyPlan =
      target === "base"
        ? withAllTimes(plan, draft)
        : { ...plan, [target]: { ...plan[target], time: draft } };
    const days = toDailyCommutes(next);
    setTarget(null);
    if (days.length === 0) {
      showToast({ message: NO_COMMUTE_DAY_MESSAGE });
      return;
    }
    mutate(days);
  };

  return (
    <WeeklySettingsLayout
      title={TITLE}
      base={
        <TimeSettingRow label="기본" time={base} onPress={() => open("base")} />
      }
      overlay={
        <BottomSheet
          visible={target !== null}
          title="시간 설정"
          onClose={() => setTarget(null)}
          buttonLabel="확인"
          onButtonPress={save}
        >
          <TimePicker value={draft} onChange={setDraft} />
        </BottomSheet>
      }
    >
      <TimeSetting>
        {WEEKDAYS.map(({ value, label }) => (
          <TimeSettingRow
            key={value}
            label={label}
            time={plan[value].time}
            // 이동 시간이 0분인 쉬는 날은 흐리게 두고 바꿀 수 없다 (Figma 토·일)
            disabled={plan[value].minutes === 0}
            onPress={() => open(value)}
          />
        ))}
      </TimeSetting>
    </WeeklySettingsLayout>
  );
}
