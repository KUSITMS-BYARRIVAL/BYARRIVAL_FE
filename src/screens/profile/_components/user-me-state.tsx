import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { TextButton } from "@/components/button/text-button";
import { useGetMe } from "@/hooks/queries/use-get-me";
import type { UserMeResponse } from "@/types/user/user.types";

type UserMeStateProps = {
  children: (me: UserMeResponse) => ReactNode;
};

// 마이 설정 화면 공통: 내 정보(GET /users/me)를 불러오는 중 · 실패 상태를 보여주고, 받으면 children을 그린다
export function UserMeState({ children }: UserMeStateProps) {
  const { data, isPending, isError, refetch } = useGetMe();

  if (isPending) {
    return (
      <Text className="py-10 text-center text-tertiary text-body1-m">
        내 정보를 불러오는 중이에요
      </Text>
    );
  }
  if (isError) {
    return (
      <View className="items-center gap-3 py-10">
        <Text className="text-center text-tertiary text-body1-m">
          내 정보를 불러오지 못했어요
        </Text>
        <TextButton label="다시 시도" onPress={() => refetch()} />
      </View>
    );
  }
  return children(data);
}
