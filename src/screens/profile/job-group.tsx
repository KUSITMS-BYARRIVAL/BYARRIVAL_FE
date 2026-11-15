import { View } from "react-native";

import { SelectionTile } from "@/screens/_components/selection-tile";
import { JOB_GROUPS } from "@/screens/_constants";
import { useProfileStore } from "@/stores/profile-store";

import { SettingsLayout } from "./_components/settings-layout";

// Figma 마이 - 설정(직군): 온보딩 직군 선택과 같은 3열 그리드, 고르면 바로 저장된다
export function ProfileJobGroupScreen() {
  const jobGroup = useProfileStore((state) => state.jobGroup);
  const setJobGroup = useProfileStore((state) => state.setJobGroup);

  return (
    <SettingsLayout title="직군">
      <View
        accessibilityRole="radiogroup"
        className="flex-row flex-wrap justify-between gap-y-2"
      >
        {JOB_GROUPS.map(({ value, title, example, Icon, SelectedIcon }) => {
          const isSelected = jobGroup === value;
          const TileIcon = isSelected ? SelectedIcon : Icon;
          return (
            <SelectionTile
              key={value}
              accessibilityRole="radio"
              size="s"
              icon={<TileIcon />}
              title={title}
              subtitle={example}
              isSelected={isSelected}
              className="w-[32%]"
              onPress={() => setJobGroup(value)}
            />
          );
        })}
      </View>
    </SettingsLayout>
  );
}
