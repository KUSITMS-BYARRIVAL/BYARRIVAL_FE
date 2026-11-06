import { Redirect } from "expo-router";

// 앱을 처음 열면 인트로(ONB-01)부터 시작한다
// TODO: 로그인 토큰·온보딩 완료 여부에 따라 홈 또는 중단한 온보딩 단계로 보내기 (인증 연동 시)
export default function Index() {
  return <Redirect href="/intro" />;
}
