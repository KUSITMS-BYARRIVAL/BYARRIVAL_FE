import { fireEvent, render, screen } from "@testing-library/react-native";
import { View } from "react-native";

import { Notification } from "../notification";

const props = {
  icon: <View />,
  title: "7일 연속 출근길 달성!",
  body: "최장 기록 12일까지 5일 남았어요.",
  time: "1시간 전",
};

describe("Notification", () => {
  it("제목·본문·시간을 렌더하고 누르면 onPress를 호출한다", async () => {
    const onPress = jest.fn();
    await render(<Notification {...props} onPress={onPress} />);
    expect(screen.getByText(props.body)).toBeTruthy();
    expect(screen.getByText(props.time)).toBeTruthy();
    await fireEvent.press(screen.getByText(props.title));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("안 읽은 알림이면 점을 표시한다", async () => {
    await render(<Notification {...props} isUnread />);
    expect(screen.getByTestId("unread-dot")).toBeTruthy();
  });

  it("읽은 알림이면 점이 없다", async () => {
    await render(<Notification {...props} />);
    expect(screen.queryByTestId("unread-dot")).toBeNull();
  });
});
