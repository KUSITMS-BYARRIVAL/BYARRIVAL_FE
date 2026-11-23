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

// 로그아웃 후 재로그인처럼 다시 구독할 때 같은 초기 알림이 또 와도 한 번만 처리한다
const handledMessageIds = new Set<string>();

/** 푸시를 눌러 앱이 열리면(꺼진 상태 · 백그라운드 모두) 그 푸시의 data를 넘긴다. 해제 함수를 돌려준다 */
export const onPushOpened = (listener: (data: PushData) => void) => {
  const messaging = getMessaging();
  // 해제 뒤에 초기 알림 조회가 끝나도 넘기지 않는다 (로그아웃 상태에서 읽음 처리 · 이동 방지)
  let isUnsubscribed = false;
  const handle = (message: RemoteMessage | null) => {
    if (isUnsubscribed || !message?.data) return;
    if (message.messageId) {
      if (handledMessageIds.has(message.messageId)) return;
      handledMessageIds.add(message.messageId);
    }
    listener(message.data as PushData);
  };
  getInitialNotification(messaging)
    .then(handle)
    .catch(() => undefined);
  const unsubscribe = onNotificationOpenedApp(messaging, handle);
  return () => {
    isUnsubscribed = true;
    unsubscribe();
  };
};

/** 앱을 보고 있을 때 푸시가 오면 알린다 (FCM은 이때 OS 알림을 띄우지 않는다). 해제 함수를 돌려준다 */
export const onForegroundPush = (listener: () => void) =>
  onMessage(getMessaging(), listener);
