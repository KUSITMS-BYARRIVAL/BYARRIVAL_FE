import { useState } from "react";

import { BottomSheet } from "@/components/bottom-sheet/bottom-sheet";
import { type Time, TimePicker } from "@/components/time-picker/time-picker";
import { TimeSetting } from "@/components/time-setting/time-setting";
import { TimeSettingRow } from "@/components/time-setting/time-setting-row";
import { useProfileStore, type Weekday } from "@/stores/profile-store";

import { WeeklySettingsLayout } from "./_components/weekly-settings-layout";
import { WEEKDAYS } from "./_constants";

type Target = "base" | Weekday;

// Figma 마이 - 설정(요일별 출근 시간)
export function ProfileDepartureTimeScreen() {
  const departureTimes = useProfileStore((state) => state.departureTimes);
  const travelMinutes = useProfileStore((state) => state.travelMinutes);
  const setBaseDepartureTime = useProfileStore(
    (state) => state.setBaseDepartureTime,
  );
  const setDepartureTime = useProfileStore((state) => state.setDepartureTime);
  // 시간을 고르는 대상. null이면 바텀시트를 닫는다
  const [target, setTarget] = useState<Target | null>(null);
  // 휠을 돌리는 동안의 값. 확인을 눌러야 저장한다
  const [draft, setDraft] = useState<Time>(departureTimes.base);

  // 요일 값이 없으면(쉬는 날) 기본 시각을 보여준다
  const timeOf = (weekday: Weekday) =>
    departureTimes.byWeekday[weekday] ?? departureTimes.base;

  const open = (next: Target) => {
    setDraft(next === "base" ? departureTimes.base : timeOf(next));
    setTarget(next);
  };

  const save = () => {
    if (target === "base") setBaseDepartureTime(draft);
    else if (target) setDepartureTime(target, draft);
    setTarget(null);
  };

  return (
    <WeeklySettingsLayout
      title="요일별 출근 시간"
      base={
        <TimeSettingRow
          label="기본"
          time={departureTimes.base}
          onPress={() => open("base")}
        />
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
            time={timeOf(value)}
            // 이동 시간이 0분인 쉬는 날은 흐리게 두고 바꿀 수 없다 (Figma 토·일)
            disabled={travelMinutes.byWeekday[value] === 0}
            onPress={() => open(value)}
          />
        ))}
      </TimeSetting>
    </WeeklySettingsLayout>
  );
}
