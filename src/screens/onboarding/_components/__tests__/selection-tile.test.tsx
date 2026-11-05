import { render, screen, userEvent } from "@testing-library/react-native";
import { View } from "react-native";

import { SelectionTile } from "../selection-tile";

describe("SelectionTile", () => {
  it.each(["l", "s"] as const)(
    "%s 크기에서 제목·보조 문구와 선택 여부를 알린다",
    async (size) => {
      await render(
        <SelectionTile
          icon={<View />}
          title="경제"
          subtitle="Economy"
          size={size}
          isSelected
        />,
      );
      expect(
        screen.getByRole("checkbox", { name: "경제 Economy" }),
      ).toBeChecked();
    },
  );

  it("누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <SelectionTile icon={<View />} title="커리어" onPress={onPress} />,
    );
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    await user.press(screen.getByRole("checkbox"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
