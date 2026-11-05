import { render, screen, userEvent } from "@testing-library/react-native";

import { TimeSelector } from "../time-selector";

describe("TimeSelector", () => {
  it("시·분을 두 자리 숫자판으로 나눠 보여준다", async () => {
    await render(<TimeSelector hour={8} minute={5} />);
    expect(screen.getAllByText("0")).toHaveLength(2);
    expect(screen.getByText("8")).toBeOnTheScreen();
    expect(screen.getByText("5")).toBeOnTheScreen();
  });

  it("스크린리더에 시각을 읽어 주고 누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<TimeSelector hour={18} minute={30} onPress={onPress} />);
    await user.press(screen.getByRole("button", { name: "18시 30분" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
