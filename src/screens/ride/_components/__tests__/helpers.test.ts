import { canAddToCart, isCartStartable } from "../helpers";

const TARGET = 15;

describe("canAddToCart", () => {
  it("담은 뒤 합계가 정확히 T×120%면 담을 수 있다", () => {
    expect(canAddToCart(14, 4, TARGET)).toBe(true);
  });

  it("담은 뒤 합계가 T×120%를 넘으면 담을 수 없다", () => {
    expect(canAddToCart(15, 4, TARGET)).toBe(false);
  });
});

describe("isCartStartable", () => {
  it("합계가 70% 미만이고 더 담을 카드가 있으면 시작할 수 없다", () => {
    expect(isCartStartable(8, [2, 3], TARGET)).toBe(false);
  });

  it("합계가 70~120% 경계 안이면 시작할 수 있다", () => {
    expect(isCartStartable(10.5, [2], TARGET)).toBe(true);
    expect(isCartStartable(18, [], TARGET)).toBe(true);
  });

  it("70% 미만이어도 남은 카드가 모두 상한을 넘으면 시작할 수 있다", () => {
    expect(isCartStartable(10, [9, 12], TARGET)).toBe(true);
  });

  it("남은 카드가 없으면 시작할 수 있다", () => {
    expect(isCartStartable(0, [], TARGET)).toBe(true);
  });
});
