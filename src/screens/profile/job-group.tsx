import { View } from "react-native";

import { useReplaceJobGroups } from "@/hooks/mutations/use-replace-job-groups";
import { SelectionTile } from "@/screens/_components/selection-tile";
import { JOB_GROUPS } from "@/screens/_constants";
import { fromJobGroupCode, toJobGroupCode } from "@/types/user/user.mappers";

import { SettingsLayout } from "./_components/settings-layout";
import { UserMeState } from "./_components/user-me-state";

// Figma 마이 - 설정(직군): 온보딩 직군 선택과 같은 3열 그리드, 고르면 바로 저장된다 (PUT /users/me/job-groups)
export function ProfileJobGroupScreen() {
  const { mutate, isPending } = useReplaceJobGroups();

  return (
    <SettingsLayout title="직군">
      <UserMeState>
        {(me) => {
          // 직군은 1개만 고르는 [임시] 단계라 첫 번째 직군을 선택 상태로 본다
          const jobGroup =
            me.jobGroups?.[0] && fromJobGroupCode(me.jobGroups[0]);
          return (
            <View
              accessibilityRole="radiogroup"
              className="flex-row flex-wrap justify-between gap-y-2"
            >
              {JOB_GROUPS.map(
                ({ value, title, example, Icon, SelectedIcon }) => {
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
                      disabled={isPending}
                      className="w-[32%]"
                      onPress={() => mutate([toJobGroupCode(value)])}
                    />
                  );
                },
              )}
            </View>
          );
        }}
      </UserMeState>
    </SettingsLayout>
  );
}
