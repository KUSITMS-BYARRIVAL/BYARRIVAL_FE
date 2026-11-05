import { render, screen } from "@testing-library/react-native";

import { CalendarCell } from "../calendar-cell";

const boxClass = () => screen.getByText("15").parent?.props.className;
const textClass = () => screen.getByText("15").props.className;

describe("CalendarCell", () => {
  it("status와 isToday를 생략하면 기록 없음 스타일로 표시한다", async () => {
    await render(<CalendarCell label="15" />);
    expect(boxClass()).not.toContain("bg-");
    expect(boxClass()).not.toContain("border-2");
    expect(textClass()).toContain("text-secondary");
  });

  it("complete는 진한 초록 배경과 채움 위 글자색을 쓴다", async () => {
    await render(<CalendarCell label="15" status="complete" />);
    expect(boxClass()).toContain("bg-green-500");
    expect(textClass()).toContain("text-on-fill-default");
  });

  it("attendance는 연한 초록 배경과 채움 위 글자색을 쓴다", async () => {
    await render(<CalendarCell label="15" status="attendance" />);
    expect(boxClass()).toContain("bg-green-300");
    expect(textClass()).toContain("text-on-fill-default");
  });

  it("offday는 회색 배경과 보조 글자색을 쓴다", async () => {
    await render(<CalendarCell label="15" status="offday" />);
    expect(boxClass()).toContain("bg-icon-background");
    expect(textClass()).toContain("text-secondary");
  });

  it("isToday가 false면 테두리를 붙이지 않는다", async () => {
    await render(<CalendarCell label="15" status="complete" isToday={false} />);
    expect(boxClass()).not.toContain("border-2");
  });

  it("className으로 받은 크기 클래스를 칸에 붙인다", async () => {
    await render(<CalendarCell label="15" className="h-12 flex-1" />);
    expect(boxClass()).toContain("h-12");
    expect(boxClass()).toContain("flex-1");
  });

  it.each([
    ["before", "border-green-500"],
    ["attendance", "border-green-600"],
    ["complete", "border-green-700"],
    ["offday", "border-green-500"],
  ] as const)(
    "isToday이고 status가 %s면 border-2와 %s를 붙인다",
    async (status, borderClass) => {
      await render(<CalendarCell label="15" status={status} isToday />);
      expect(boxClass()).toContain("border-2");
      expect(boxClass()).toContain(borderClass);
    },
  );

  it("읽기 도구용 레이블에 이름·상태·현재 여부를 담는다", async () => {
    await render(<CalendarCell label="15" status="complete" isToday />);
    expect(screen.getByLabelText("15, 완주, 현재")).toBeTruthy();
  });

  it("before 상태는 레이블에 상태를 넣지 않는다", async () => {
    await render(<CalendarCell label="3월" />);
    expect(screen.getByLabelText("3월")).toBeTruthy();
  });
});
