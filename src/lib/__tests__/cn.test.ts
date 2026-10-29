import { cn } from "@/lib/utils";

describe("cn", () => {
  it("여러 클래스를 하나의 문자열로 합친다", () => {
    expect(cn("flex-1", "p-4")).toBe("flex-1 p-4");
  });

  it("falsy 값은 제외한다", () => {
    expect(cn("flex-1", false, null, undefined, "p-4")).toBe("flex-1 p-4");
  });

  it("조건부 클래스를 객체로 받을 수 있다", () => {
    expect(cn("p-4", { "bg-red-500": true, "bg-green-500": false })).toBe(
      "p-4 bg-red-500",
    );
  });

  it("충돌하는 Tailwind 클래스는 뒤에 오는 값으로 덮어쓴다", () => {
    expect(cn("p-2 text-grey-500", "p-4 text-red-500")).toBe(
      "p-4 text-red-500",
    );
  });

  it("타이포 토큰과 색상 클래스는 함께 유지한다", () => {
    expect(cn("text-heading1-b", "text-green-500")).toBe(
      "text-heading1-b text-green-500",
    );
  });

  it("타이포 토큰과 시맨틱 글자색은 함께 유지한다", () => {
    expect(cn("text-primary", "text-heading1-b")).toBe(
      "text-primary text-heading1-b",
    );
  });

  it("시맨틱 컬러끼리는 뒤에 오는 값으로 덮어쓴다", () => {
    expect(cn("text-primary", "text-brand")).toBe("text-brand");
    expect(cn("bg-default", "bg-btn-brand")).toBe("bg-btn-brand");
    expect(cn("border-default", "border-red")).toBe("border-red");
  });

  it("타이포 토큰끼리는 뒤에 오는 값으로 덮어쓴다", () => {
    expect(cn("text-body1-r", "text-heading1-b")).toBe("text-heading1-b");
  });
});
