import { render, screen } from "@testing-library/react-native";

import { LoadingDots } from "../loading-dots";

describe("LoadingDots", () => {
  it("스크린 리더에 불러오는 중으로 알린다", async () => {
    await render(<LoadingDots />);
    expect(screen.getByLabelText("불러오는 중")).toBeOnTheScreen();
  });
});
