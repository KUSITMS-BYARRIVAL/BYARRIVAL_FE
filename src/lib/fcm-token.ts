import {
  getMessaging,
  getToken,
  onTokenRefresh,
} from "@react-native-firebase/messaging";

// v27에서 deprecated지만 대체 API register()는 FID 방식이라, FCM 토큰으로 보내는 지금 서버와 맞지 않아 토큰 API를 쓴다

/** async라 네이티브 모듈이 없을 때도 throw 대신 reject한다 */
export const getFcmToken = async () => getToken(getMessaging());

export const onFcmTokenRefresh = (listener: (token: string) => void) =>
  onTokenRefresh(getMessaging(), listener);
