import { render, screen, userEvent } from "@testing-library/react-native";

import { SmalltalkCard } from "../smalltalk-card";

describe("SmalltalkCard", () => {
  it("장소·질문·이어서 문구를 보여주고 누르면 onPress를 호출한다", async () => {
    const user = userEvent.setup();
    const onPress = jest.fn();
    await render(
      <SmalltalkCard
        place="엘리베이터에서"
        question="대출 있으세요?"
        followUp="하반기엔 내릴 가능성이 60%라던데요."
        onPress={onPress}
      />,
    );
    expect(screen.getByText("엘리베이터에서")).toBeOnTheScreen();
    expect(
      screen.getByText("이어서 · 하반기엔 내릴 가능성이 60%라던데요."),
    ).toBeOnTheScreen();
    await user.press(screen.getByRole("button"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
