import { View } from "react-native";

import { SelectionCard } from "@/screens/_components/selection-card";
import { USER_TYPES } from "@/screens/_constants";
import { useProfileStore } from "@/stores/profile-store";

import { SettingsLayout } from "./_components/settings-layout";

// Figma 마이 - 설정(이동 상황): 고르면 바로 저장된다
export function ProfileUserTypeScreen() {
  const userType = useProfileStore((state) => state.userType);
  const setUserType = useProfileStore((state) => state.setUserType);

  return (
    <SettingsLayout title="이동 상황">
      <View accessibilityRole="radiogroup" className="gap-2">
        {USER_TYPES.map(({ type, title, description, Asset }) => (
          <SelectionCard
            key={type}
            asset={<Asset />}
            title={title}
            description={description}
            isSelected={userType === type}
            onPress={() => setUserType(type)}
          />
        ))}
      </View>
    </SettingsLayout>
  );
}
