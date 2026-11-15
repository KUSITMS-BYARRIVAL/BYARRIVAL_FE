import { render, screen, userEvent } from "@testing-library/react-native";

import { TimeSetting } from "../time-setting";
import { TimeSettingRow } from "../time-setting-row";

describe("TimeSettingRow", () => {
  it("12시간제로 오전·오후와 시각을 보여준다", async () => {
    await render(
      <TimeSetting>
        <TimeSettingRow label="월" time={{ hour: 8, minute: 0 }} />
        <TimeSettingRow label="목" time={{ hour: 13, minute: 5 }} />
      </TimeSetting>,
    );
    expect(screen.getByText("08:00")).toBeOnTheScreen();
    expect(screen.getByText("오전")).toBeOnTheScreen();
    expect(screen.getByText("01:05")).toBeOnTheScreen();
    expect(screen.getByText("오후")).toBeOnTheScreen();
  });

  it("시간 칸을 누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <TimeSettingRow
        label="화"
        time={{ hour: 9, minute: 0 }}
        onPress={onPress}
      />,
    );
    await user.press(screen.getByRole("button", { name: "화 오전 09:00" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("disabled면 누를 수 없다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <TimeSettingRow
        label="토"
        time={{ hour: 0, minute: 0 }}
        disabled
        onPress={onPress}
      />,
    );
    const button = screen.getByRole("button", { name: "토 오전 12:00" });
    expect(button).toBeDisabled();
    await user.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });
});
