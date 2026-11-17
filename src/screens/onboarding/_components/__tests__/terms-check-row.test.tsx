import { render, screen, userEvent } from "@testing-library/react-native";

import { TermsCheckRow } from "../terms-check-row";

describe("TermsCheckRow", () => {
  it("체크 상태를 알리고, 누르면 토글을 부른다", async () => {
    const onToggle = jest.fn();
    const user = userEvent.setup();
    await render(
      <TermsCheckRow
        label="[필수] 이용약관 동의"
        isChecked
        onToggle={onToggle}
      />,
    );
    const checkbox = screen.getByRole("checkbox", {
      name: "[필수] 이용약관 동의",
    });
    expect(checkbox).toBeChecked();
    await user.press(checkbox);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it("보기가 있으면 누를 때 본문 열기를 부르고, 없으면 보기를 숨긴다", async () => {
    const onView = jest.fn();
    const user = userEvent.setup();
    const { rerender } = await render(
      <TermsCheckRow
        label="[필수] 이용약관 동의"
        isChecked={false}
        onToggle={jest.fn()}
        onView={onView}
      />,
    );
    await user.press(
      screen.getByRole("link", { name: "[필수] 이용약관 동의 보기" }),
    );
    expect(onView).toHaveBeenCalledTimes(1);

    await rerender(
      <TermsCheckRow
        label="[선택] 마케팅"
        isChecked={false}
        onToggle={jest.fn()}
      />,
    );
    expect(screen.queryByText("보기")).toBeNull();
  });
});
