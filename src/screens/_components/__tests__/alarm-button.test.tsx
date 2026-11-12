import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { useNotificationStore } from "@/stores/notification-store";

import { AlarmButton } from "../alarm-button";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

describe("AlarmButton", () => {
  it("새 알림이 있으면 접근성 라벨로 알린다", async () => {
    useNotificationStore.setState({ hasNewNotification: true });
    await render(<AlarmButton />);
    expect(
      screen.getByRole("button", { name: "알림, 새 알림 있음" }),
    ).toBeTruthy();
  });

  it("새 알림이 없으면 일반 라벨이고, 누르면 알림 화면으로 이동한다", async () => {
    useNotificationStore.setState({ hasNewNotification: false });
    await render(<AlarmButton />);
    await fireEvent.press(screen.getByRole("button", { name: "알림" }));
    expect(router.push).toHaveBeenCalledWith("/notifications");
  });
});
