import { render, screen } from "@testing-library/react-native";

import { NicknamePreviewCard } from "../nickname-preview-card";

describe("NicknamePreviewCard", () => {
  it("입력한 닉네임으로 인사 문구를 미리 보여준다", async () => {
    await render(<NicknamePreviewCard nickname="출근러" />);
    expect(screen.getByText("출근러님,")).toBeOnTheScreen();
    expect(screen.getByText("오늘 출근길도 화이팅!")).toBeOnTheScreen();
  });
});
