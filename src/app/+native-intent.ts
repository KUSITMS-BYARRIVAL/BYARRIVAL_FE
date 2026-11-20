// 카카오 로그인 복귀 URL(kakao{앱키}://oauth...)은 카카오 SDK가 처리한다. 라우터가 받으면 Unmatched Route가 잠깐 뜬다
export function redirectSystemPath({ path }: { path: string }) {
  return path.startsWith("kakao") ? null : path;
}
