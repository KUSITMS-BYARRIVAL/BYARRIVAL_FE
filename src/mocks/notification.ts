import type { NotificationType } from "@/screens/notifications/_constants";

// Figma 알림 화면 예시 문구. 제목·본문·시간 문구는 서버가 내려준다
export const NOTIFICATION_GROUPS: {
  label: string;
  items: {
    id: string;
    type: NotificationType;
    title: string;
    body: string;
    time: string;
    isRead: boolean;
  }[];
}[] = [
  {
    label: "오늘",
    items: [
      {
        id: "1",
        type: "ROUTE_READY",
        title: "07:55 · 오늘의 노선이 준비됐어요",
        body: "7개 정거장, 20분 노선이에요. 탭해서 바로 탑승해요",
        time: "방금",
        isRead: false,
      },
      {
        id: "2",
        type: "STREAK_MILESTONE",
        title: "7일 연속 출근길 달성!",
        body: "최장 기록 12일까지 5일 남았어요.",
        time: "1시간 전",
        isRead: false,
      },
      {
        id: "3",
        type: "SMALLTALK",
        title: "오늘의 스몰토크가 올라왔어요",
        body: "“기준금리 동결됐다던데, 혹시 대출 있으세요?”",
        time: "3시간 전",
        isRead: true,
      },
    ],
  },
  {
    label: "이번 주",
    items: [
      {
        id: "4",
        type: "SERVICE_NOTICE",
        title: "서비스 점검 안내",
        body: "10월 13일(화) 02:00~04:00 점검이 있어요.",
        time: "10월 11일",
        isRead: true,
      },
    ],
  },
];
