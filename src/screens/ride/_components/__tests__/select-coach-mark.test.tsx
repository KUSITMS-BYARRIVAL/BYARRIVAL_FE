import { render, screen, userEvent } from "@testing-library/react-native";

import { SelectCoachMark } from "../select-coach-mark";

describe("SelectCoachMark", () => {
  it("안내 제목과 70% 안내 문구를 보여준다", async () => {
    await render(<SelectCoachMark onClose={jest.fn()} />);
    expect(
      screen.getByText(
        "어떤 뉴스가 궁금한가요?\n좌우로 넘기며 읽고 싶은 뉴스를\n골라보세요!",
      ),
    ).toBeOnTheScreen();
    expect(
      screen.getByText(
        "읽을 수 있는 시간의 70% 이상을 채우면\n뉴스 읽기가 시작돼요.",
      ),
    ).toBeOnTheScreen();
  });

  it("화면 읽기에서 눌러서 닫는 버튼으로 알린다", async () => {
    await render(<SelectCoachMark onClose={jest.fn()} />);
    expect(screen.getByHintText("눌러서 안내를 닫아요")).toBe(
      screen.getByRole("button"),
    );
  });

  it("누르면 onClose를 한 번 부른다", async () => {
    const onClose = jest.fn();
    const user = userEvent.setup();
    await render(<SelectCoachMark onClose={onClose} />);
    await user.press(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("누르기 전에는 onClose를 부르지 않는다", async () => {
    const onClose = jest.fn();
    await render(<SelectCoachMark onClose={onClose} />);
    expect(onClose).not.toHaveBeenCalled();
  });
});
