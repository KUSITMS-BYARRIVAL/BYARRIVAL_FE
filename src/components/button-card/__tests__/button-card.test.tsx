import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { ButtonCard } from "../button-card";

describe("ButtonCard", () => {
  it("title이 있으면 제목을 header로 보여준다", async () => {
    await render(
      <ButtonCard title="오늘 다른 사람들이 많이 읽은 뉴스 TOP 3">
        <Text>행</Text>
      </ButtonCard>,
    );
    expect(
      screen.getByRole("header", {
        name: "오늘 다른 사람들이 많이 읽은 뉴스 TOP 3",
      }),
    ).toBeOnTheScreen();
    expect(screen.getByText("행")).toBeOnTheScreen();
  });

  it("title이 없으면 제목 없이 행만 보여준다", async () => {
    await render(
      <ButtonCard>
        <Text>행</Text>
      </ButtonCard>,
    );
    expect(screen.queryByRole("header")).toBeNull();
    expect(screen.getByText("행")).toBeOnTheScreen();
  });
});
