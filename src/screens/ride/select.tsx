import { Text, View } from "react-native";

// shortcut: 화면 이동 확인용 빈 화면, 기사 고르기 퍼블리싱 때 교체
export function SelectScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-grey-100">
      <Text className="text-primary text-heading3-sb">기사 고르기</Text>
    </View>
  );
}
