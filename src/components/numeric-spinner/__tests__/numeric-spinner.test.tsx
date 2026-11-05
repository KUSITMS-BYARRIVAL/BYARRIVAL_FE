import { render, screen, userEvent } from "@testing-library/react-native";

import { NumericSpinner } from "../numeric-spinner";

describe("NumericSpinner", () => {
  it("이름·보조 문구·값을 보여주고 늘리기를 누르면 onChange를 호출한다", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    await render(
      <NumericSpinner
        label="월"
        description="약 30분"
        value={30}
        onChange={onChange}
        step={10}
      />,
    );
    expect(screen.getByText("약 30분")).toBeOnTheScreen();
    expect(screen.getByRole("adjustable", { name: "월" })).toBeOnTheScreen();
    await user.press(screen.getByRole("button", { name: "늘리기" }));
    expect(onChange).toHaveBeenCalledWith(40);
  });
});
