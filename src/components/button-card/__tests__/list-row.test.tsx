import { render, screen, userEvent } from "@testing-library/react-native";

import { ListRow } from "../list-row";

describe("ListRow", () => {
  it("문구와 보조 문구를 보여주고 누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <ListRow label="출근 시간" subtext="08:00" onPress={onPress} />,
    );
    expect(screen.getByText("08:00")).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: "출근 시간 08:00" }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("보조 문구 없이 문구만 보여줄 수 있다", async () => {
    await render(<ListRow label="로그아웃" tone="danger" hasArrow={false} />);
    expect(screen.getByRole("button", { name: "로그아웃" })).toBeOnTheScreen();
  });
});
