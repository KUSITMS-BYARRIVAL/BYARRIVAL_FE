import { NumericSpinner } from "@/components/numeric-spinner/numeric-spinner";
import { useProfileStore } from "@/stores/profile-store";

import { WeeklySettingsLayout } from "./_components/weekly-settings-layout";
import { WEEKDAYS } from "./_constants";

// 온보딩 이동 시간처럼 5분 단위, 최대 90분
const STEP = 5;
const MAX_MINUTES = 90;

const describe = (minutes: number) =>
  minutes > 0 ? `약 ${minutes}분` : "쉬는 날";

// Figma 마이 - 설정(요일별 이동 시간)
export function ProfileTravelTimeScreen() {
  const travelMinutes = useProfileStore((state) => state.travelMinutes);
  const setBaseTravelMinutes = useProfileStore(
    (state) => state.setBaseTravelMinutes,
  );
  const setTravelMinutes = useProfileStore((state) => state.setTravelMinutes);

  return (
    <WeeklySettingsLayout
      title="요일별 이동 시간"
      base={
        <NumericSpinner
          label="기본"
          description={describe(travelMinutes.base)}
          value={travelMinutes.base}
          onChange={setBaseTravelMinutes}
          step={STEP}
          max={MAX_MINUTES}
        />
      }
    >
      {WEEKDAYS.map(({ value, label }) => {
        const minutes = travelMinutes.byWeekday[value];
        return (
          <NumericSpinner
            key={value}
            label={label}
            description={describe(minutes)}
            value={minutes}
            onChange={(next) => setTravelMinutes(value, next)}
            step={STEP}
            max={MAX_MINUTES}
          />
        );
      })}
    </WeeklySettingsLayout>
  );
}
