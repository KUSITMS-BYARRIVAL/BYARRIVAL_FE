import { View } from "react-native";

import { useUpdateMe } from "@/hooks/mutations/use-update-me";
import { track } from "@/lib/analytics";
import { SelectionCard } from "@/screens/_components/selection-card";
import { USER_TYPES } from "@/screens/_constants";
import { fromTravelType, toTravelType } from "@/types/user/user.mappers";

import { SettingsLayout } from "./_components/settings-layout";
import { UserMeState } from "./_components/user-me-state";

// Figma 마이 - 설정(이동 상황): 고르면 바로 저장된다 (PATCH /users/me)
export function ProfileUserTypeScreen() {
  const { mutate, isPending } = useUpdateMe();

  return (
    <SettingsLayout title="이동 상황">
      <UserMeState>
        {(me) => {
          const userType = me.travelType && fromTravelType(me.travelType);
          return (
            <View accessibilityRole="radiogroup" className="gap-2">
              {USER_TYPES.map(({ type, title, description, Asset }) => (
                <SelectionCard
                  key={type}
                  asset={<Asset />}
                  title={title}
                  description={description}
                  isSelected={userType === type}
                  disabled={isPending}
                  onPress={() =>
                    userType !== type &&
                    mutate(
                      { travelType: toTravelType(type) },
                      {
                        onSuccess: () =>
                          track("setting_change", { field: "situation" }),
                      },
                    )
                  }
                />
              ))}
            </View>
          );
        }}
      </UserMeState>
    </SettingsLayout>
  );
}
