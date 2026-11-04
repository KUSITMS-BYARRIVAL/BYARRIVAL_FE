import { render, screen } from "@testing-library/react-native";

import { Badge } from "../badge";

const containerClass = () => screen.getByText("완독").parent?.props.className;
const labelClass = () => screen.getByText("완독").props.className;

describe("Badge", () => {
  it("label 텍스트를 렌더한다", async () => {
    await render(<Badge label="완독" />);
    expect(screen.getByText("완독")).toBeOnTheScreen();
  });

  it("기본값은 brand 색 S 크기다", async () => {
    await render(<Badge label="완독" />);
    expect(containerClass()).toContain("bg-green-opacity-100");
    expect(containerClass()).toContain("h-7");
    expect(labelClass()).toContain("text-caption1-m");
    expect(labelClass()).toContain("text-brand");
  });

  it("neutral은 기본 M 크기에 회색 배경과 label2-sb secondary 글자를 쓴다", async () => {
    await render(<Badge label="완독" color="neutral" />);
    expect(containerClass()).toContain("bg-grey-opacity-50");
    expect(containerClass()).toContain("py-1.5");
    expect(labelClass()).toContain("text-label2-sb");
    expect(labelClass()).toContain("text-secondary");
  });

  it("className을 컨테이너에 병합한다", async () => {
    await render(<Badge label="완독" className="mt-2" />);
    expect(containerClass()).toContain("mt-2");
  });
});
