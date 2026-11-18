import { fireEvent, render, screen } from "@testing-library/react-native";
import { router } from "expo-router";

import { useGetUnreadCount } from "@/hooks/queries/use-get-unread-count";

import { AlarmButton } from "../alarm-button";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));
jest.mock("@/hooks/queries/use-get-unread-count", () => ({
  useGetUnreadCount: jest.fn(),
}));

const mockUnreadCount = (data: { count: number } | undefined) =>
  jest
    .mocked(useGetUnreadCount)
    .mockReturnValue({ data } as ReturnType<typeof useGetUnreadCount>);

describe("AlarmButton", () => {
  it("안 읽은 알림이 있으면 접근성 라벨로 알린다", async () => {
    mockUnreadCount({ count: 3 });
    await render(<AlarmButton />);
    expect(
      screen.getByRole("button", { name: "알림, 새 알림 있음" }),
    ).toBeTruthy();
  });

  it("안 읽은 알림이 0개면 일반 라벨이고, 누르면 알림 화면으로 이동한다", async () => {
    mockUnreadCount({ count: 0 });
    await render(<AlarmButton />);
    await fireEvent.press(screen.getByRole("button", { name: "알림" }));
    expect(router.push).toHaveBeenCalledWith("/notifications");
  });

  it("개수를 불러오기 전에는 일반 라벨이다", async () => {
    mockUnreadCount(undefined);
    await render(<AlarmButton />);
    expect(screen.getByRole("button", { name: "알림" })).toBeTruthy();
  });
});
