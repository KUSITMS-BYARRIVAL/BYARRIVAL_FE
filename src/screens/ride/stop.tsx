import { Text, View } from "react-native";

// shortcut: 화면 이동 확인용 빈 화면, 정거장 퍼블리싱 때 교체
export function StopScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-grey-100">
      <Text className="text-primary text-heading3-sb">정거장</Text>
    </View>
  );
}
