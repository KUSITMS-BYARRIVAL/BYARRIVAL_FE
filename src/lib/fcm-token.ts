import {
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  type RemoteMessage,
} from "@react-native-firebase/messaging";

// v27에서 deprecated지만 대체 API register()는 FID 방식이라, FCM 토큰으로 보내는 지금 서버와 맞지 않아 토큰 API를 쓴다

/** async라 네이티브 모듈이 없을 때도 throw 대신 reject한다 */
export const getFcmToken = async () => getToken(getMessaging());

export const onFcmTokenRefresh = (listener: (token: string) => void) =>
  onTokenRefresh(getMessaging(), listener);

type PushData = Record<string, string>;

/** 푸시를 눌러 앱이 열리면(꺼진 상태 · 백그라운드 모두) 그 푸시의 data를 넘긴다. 해제 함수를 돌려준다 */
export const onPushOpened = (listener: (data: PushData) => void) => {
  const messaging = getMessaging();
  const handle = (message: RemoteMessage | null) => {
    if (message?.data) listener(message.data as PushData);
  };
  getInitialNotification(messaging)
    .then(handle)
    .catch(() => undefined);
  return onNotificationOpenedApp(messaging, handle);
};

/** 앱을 보고 있을 때 푸시가 오면 알린다 (FCM은 이때 OS 알림을 띄우지 않는다). 해제 함수를 돌려준다 */
export const onForegroundPush = (listener: () => void) =>
  onMessage(getMessaging(), listener);
