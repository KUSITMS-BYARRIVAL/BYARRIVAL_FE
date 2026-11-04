import { render, screen, userEvent } from "@testing-library/react-native";

import { BookmarkButton } from "../bookmark-button";

describe("BookmarkButton", () => {
  it("북마크 여부를 selected 상태로 알린다", async () => {
    await render(<BookmarkButton bookmarked />);
    expect(screen.getByRole("button", { name: "북마크" })).toBeSelected();
  });

  it("누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(<BookmarkButton bookmarked={false} onPress={onPress} />);
    const button = screen.getByRole("button", { name: "북마크" });
    expect(button).not.toBeSelected();
    await user.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
