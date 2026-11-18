import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

// 서버에 저장 필드가 없어 기기에 남긴다 (토큰과 무관한 UI 플래그)
const COACH_SEEN_KEY = "ride-select-coach-seen";

// 뉴스 탑승하기 코치마크는 처음 한 번만 보여준다
export function useSelectCoachMark() {
  const [isCoachVisible, setIsCoachVisible] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(COACH_SEEN_KEY)
      .then((seen) => setIsCoachVisible(!seen))
      // 읽기 실패(키체인 오류 등) 시 안내 없이 바로 쓰게 둔다
      .catch(() => {});
  }, []);

  const closeCoach = () => {
    setIsCoachVisible(false);
    void SecureStore.setItemAsync(COACH_SEEN_KEY, "1");
  };

  return { isCoachVisible, closeCoach };
}
