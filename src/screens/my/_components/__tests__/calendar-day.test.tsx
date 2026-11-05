import { render, screen } from "@testing-library/react-native";

import { CalendarDay } from "../calendar-day";

const boxClass = () => screen.getByText("15").parent?.props.className;
const textClass = () => screen.getByText("15").props.className;

describe("CalendarDay", () => {
  it("status와 isToday를 생략하면 기록 없음 스타일로 표시한다", async () => {
    await render(<CalendarDay day={15} />);
    expect(boxClass()).not.toContain("bg-");
    expect(boxClass()).not.toContain("border-2");
    expect(textClass()).toContain("text-secondary");
  });

  it("complete는 진한 초록 배경과 채움 위 글자색을 쓴다", async () => {
    await render(<CalendarDay day={15} status="complete" />);
    expect(boxClass()).toContain("bg-green-500");
    expect(textClass()).toContain("text-on-fill-default");
  });

  it("attendance는 연한 초록 배경과 채움 위 글자색을 쓴다", async () => {
    await render(<CalendarDay day={15} status="attendance" />);
    expect(boxClass()).toContain("bg-green-300");
    expect(textClass()).toContain("text-on-fill-default");
  });

  it("offday는 회색 배경과 보조 글자색을 쓴다", async () => {
    await render(<CalendarDay day={15} status="offday" />);
    expect(boxClass()).toContain("bg-icon-background");
    expect(textClass()).toContain("text-secondary");
  });

  it("isToday가 false면 테두리를 붙이지 않는다", async () => {
    await render(<CalendarDay day={15} status="complete" isToday={false} />);
    expect(boxClass()).not.toContain("border-2");
  });

  it.each([
    ["before", "border-green-500"],
    ["attendance", "border-green-600"],
    ["complete", "border-green-700"],
    ["offday", "border-green-500"],
  ] as const)(
    "isToday이고 status가 %s면 border-2와 %s를 붙인다",
    async (status, borderClass) => {
      await render(<CalendarDay day={15} status={status} isToday />);
      expect(boxClass()).toContain("border-2");
      expect(boxClass()).toContain(borderClass);
    },
  );
});
