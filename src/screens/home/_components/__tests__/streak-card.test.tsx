import { render, screen, userEvent } from "@testing-library/react-native";

import { StreakCard } from "../streak-card";

describe("StreakCard", () => {
  it("닉네임·유형별 길 이름·연속일·최장일을 보여주고 누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <StreakCard
        nickname="출근러"
        route="등굣길"
        streakDays={7}
        longestDays={12}
        onPress={onPress}
      />,
    );
    expect(screen.getByText("출근러님과의 등굣길")).toBeOnTheScreen();
    expect(screen.getByText("7")).toBeOnTheScreen();
    expect(screen.getByText("최장 12일")).toBeOnTheScreen();
    await user.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
