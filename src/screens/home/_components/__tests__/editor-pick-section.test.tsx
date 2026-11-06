import { render, screen, userEvent } from "@testing-library/react-native";

import { EditorPickSection } from "../editor-pick-section";

const SMALLTALK = {
  place: "엘리베이터에서",
  question: "기준금리 동결됐다는데 대출 있으세요?",
  followUp: "하반기엔 내릴 가능성이 60%라던데요.",
};

describe("EditorPickSection", () => {
  it("제목과 받은 스몰토크의 장소·대화 문구·이어지는 문구를 보여준다", async () => {
    await render(
      <EditorPickSection smalltalk={SMALLTALK} onMorePress={jest.fn()} />,
    );
    expect(screen.getByText("Editor’s Pick 스몰토크")).toBeOnTheScreen();
    expect(screen.getByText("엘리베이터에서")).toBeOnTheScreen();
    expect(screen.getByText(SMALLTALK.question)).toBeOnTheScreen();
    expect(
      screen.getByText(/하반기엔 내릴 가능성이 60%라던데요/),
    ).toBeOnTheScreen();
  });

  it("더보기를 누르면 onMorePress를 호출한다", async () => {
    const user = userEvent.setup();
    const onMorePress = jest.fn();
    await render(
      <EditorPickSection smalltalk={SMALLTALK} onMorePress={onMorePress} />,
    );
    await user.press(screen.getByRole("button", { name: "더보기" }));
    expect(onMorePress).toHaveBeenCalledTimes(1);
  });
});
