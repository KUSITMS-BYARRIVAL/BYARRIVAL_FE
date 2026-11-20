import { render, screen, userEvent } from "@testing-library/react-native";

import { Toggle } from "../toggle";

describe("Toggle", () => {
  it("켜져 있으면 brand 색이고 스크린리더에 켜짐으로 알린다", async () => {
    await render(
      <Toggle accessibilityLabel="알림" value onValueChange={jest.fn()} />,
    );
    const toggle = screen.getByRole("switch", { name: "알림" });
    expect(toggle).toBeChecked();
    expect(toggle.props.className).toContain("bg-btn-brand");
  });

  it("꺼져 있으면 비활성 색이다", async () => {
    await render(
      <Toggle
        accessibilityLabel="알림"
        value={false}
        onValueChange={jest.fn()}
      />,
    );
    const toggle = screen.getByRole("switch", { name: "알림" });
    expect(toggle).not.toBeChecked();
    expect(toggle.props.className).toContain("bg-btn-disabled");
  });

  it("누르면 반대 값으로 onValueChange를 호출한다", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    await render(
      <Toggle
        accessibilityLabel="알림"
        value={false}
        onValueChange={onValueChange}
      />,
    );
    await user.press(screen.getByRole("switch", { name: "알림" }));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it("disabled면 눌러도 호출하지 않는다", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    await render(
      <Toggle
        accessibilityLabel="알림"
        value={false}
        onValueChange={onValueChange}
        disabled
      />,
    );
    await user.press(screen.getByRole("switch", { name: "알림" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
