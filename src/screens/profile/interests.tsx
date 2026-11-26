import { Text, View } from "react-native";

import { TextButton } from "@/components/button/text-button";
import { useReplaceInterestCategories } from "@/hooks/mutations/use-replace-interest-categories";
import { useGetCategories } from "@/hooks/queries/use-get-categories";
import { track } from "@/lib/analytics";
import { InterestTile } from "@/screens/_components/interest-tile";
import { INTERESTS } from "@/screens/_constants";
import { toCategoryIds, toInterests } from "@/screens/_helpers";
import type { Interest } from "@/stores/onboarding-store";
import { useToastStore } from "@/stores/toast-store";

import { SettingsLayout } from "./_components/settings-layout";
import { UserMeState } from "./_components/user-me-state";

// 2개씩 한 줄로 나눈다 (Figma 2열 · 간격 8px)
const ROWS = Array.from({ length: Math.ceil(INTERESTS.length / 2) }, (_, i) =>
  INTERESTS.slice(i * 2, i * 2 + 2),
);

const SAVE_ERROR_MESSAGE =
  "관심 분야를 저장하지 못했어요. 잠시 후 다시 시도해 주세요.";

// Figma 마이 - 설정(관심 카테고리): 여러 개 고를 수 있고 누르면 바로 저장된다 (PUT /users/me/interest-categories)
export function ProfileInterestsScreen() {
  const {
    data: categories,
    isError: isCategoriesError,
    refetch,
  } = useGetCategories();
  const { mutate, isPending } = useReplaceInterestCategories();
  const showToast = useToastStore((state) => state.showToast);

  const save = (next: Interest[]) => {
    if (!categories) return;
    const ids = toCategoryIds(next, categories);
    // 서버 카테고리 이름이 앱 선택지와 맞지 않으면 빈 목록이 저장되므로 보내지 않는다
    if (ids.length === 0) {
      showToast({ message: SAVE_ERROR_MESSAGE });
      return;
    }
    mutate(ids, {
      onSuccess: () => track("setting_change", { field: "category" }),
    });
  };

  if (isCategoriesError) {
    return (
      <SettingsLayout title="관심 카테고리">
        <View className="items-center gap-3 py-10">
          <Text className="text-center text-tertiary text-body1-m">
            관심 분야 목록을 불러오지 못했어요
          </Text>
          <TextButton label="다시 시도" onPress={() => refetch()} />
        </View>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="관심 카테고리" contentClassName="gap-2">
      <UserMeState>
        {(me) => {
          const interests = categories
            ? toInterests(me.categoryIds, categories)
            : [];
          return ROWS.map((row) => (
            <View key={row[0]!.value} className="flex-row gap-2">
              {row.map(({ value, title, Icon, SelectedIcon }) => {
                const isSelected = interests.includes(value);
                return (
                  <InterestTile
                    key={value}
                    Icon={isSelected ? SelectedIcon : Icon}
                    title={title}
                    isSelected={isSelected}
                    // 마지막 하나는 빼지 못하게 해 관심 분야가 비지 않도록 한다
                    disabled={
                      !categories ||
                      isPending ||
                      (isSelected && interests.length === 1)
                    }
                    onPress={() =>
                      save(
                        isSelected
                          ? interests.filter((item) => item !== value)
                          : [...interests, value],
                      )
                    }
                    className="flex-1"
                  />
                );
              })}
            </View>
          ));
        }}
      </UserMeState>
    </SettingsLayout>
  );
}
