import { act, fireEvent, render, screen } from "@testing-library/react-native";

import { SEMANTIC } from "@/theme/colors";

import { Button } from "../button";

type Node = { type: string; props: Record<string, unknown>; children?: Node[] };

// .svg import는 Jest에서 SvgMock 호스트 요소로 대체된다 (__mocks__/svg-mock.js)
function collectIcons(node: Node | Node[] | null): Node[] {
  if (!node) return [];
  if (Array.isArray(node)) return node.flatMap(collectIcons);
  const own = node.type === "SvgMock" ? [node] : [];
  return [...own, ...(node.children ?? []).flatMap(collectIcons)];
}

const getIcons = () => collectIcons(screen.toJSON() as unknown as Node);
const iconColor = () => getIcons()[0].props.color;
const childTypes = () =>
  ((screen.toJSON() as unknown as Node).children ?? []).map((c) => c.type);
async function pressAndHold() {
  await fireEvent(screen.getByRole("button"), "responderGrant", {
    persist: jest.fn(),
    nativeEvent: {},
  });
  await act(() => jest.advanceTimersByTime(200));
}

describe("Button", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  describe("기본 동작", () => {
    it("label 텍스트를 렌더한다", async () => {
      await render(<Button label="확인" />);
      expect(screen.getByText("확인")).toBeOnTheScreen();
    });

    it("눌렀을 때 onPress를 한 번 호출한다", async () => {
      const onPress = jest.fn();
      await render(<Button label="확인" onPress={onPress} />);
      await fireEvent.press(screen.getByRole("button"));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("기본 props에서 button role이고 disabled가 false인 accessibilityState를 가진다", async () => {
      await render(<Button label="확인" />);
      expect(screen.getByRole("button")).toBeEnabled();
    });

    it("label이 빈 문자열이어도 크래시 없이 렌더한다", async () => {
      await render(<Button label="" />);
      expect(screen.getByRole("button")).toBeOnTheScreen();
    });
  });

  describe("disabled", () => {
    it("disabled일 때 눌러도 onPress를 호출하지 않는다", async () => {
      const onPress = jest.fn();
      await render(<Button label="확인" disabled onPress={onPress} />);
      await fireEvent.press(screen.getByRole("button"));
      expect(onPress).not.toHaveBeenCalled();
    });

    it("disabled일 때 accessibilityState.disabled가 true다", async () => {
      await render(<Button label="확인" disabled />);
      expect(screen.getByRole("button")).toBeDisabled();
    });

    it("disabled가 undefined이면 활성 상태로 취급한다", async () => {
      await render(<Button label="확인" disabled={undefined} />);
      expect(screen.getByRole("button")).toBeEnabled();
    });

    it("accessibilityState를 넘겨도 disabled 상태가 유지된다", async () => {
      await render(
        <Button
          label="확인"
          disabled
          accessibilityState={{ selected: true }}
        />,
      );
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toBeSelected();
    });
  });

  describe("눌림 상태와 content 색", () => {
    it("brand를 누르는 동안 아이콘 색이 on-fill-muted로 바뀐다", async () => {
      await render(<Button label="확인" icon="left" />);
      expect(iconColor()).toBe(SEMANTIC.text["on-fill-default"]);
      await pressAndHold();
      expect(iconColor()).toBe(SEMANTIC.text["on-fill-muted"]);
    });

    it("neutral-weak는 눌러도 아이콘 색이 secondary로 유지된다", async () => {
      await render(<Button label="확인" color="neutral-weak" icon="left" />);
      const before = iconColor();
      await pressAndHold();
      expect(iconColor()).toBe(before);
    });

    it.each([
      ["brand", "on-fill-muted"],
      ["neutral", "on-fill-default"],
    ] as const)(
      "disabled %s는 아이콘 색이 %s다",
      async (color, contentColor) => {
        await render(
          <Button label="확인" color={color} icon="left" disabled />,
        );
        expect(iconColor()).toBe(SEMANTIC.text[contentColor]);
      },
    );
  });

  describe("icon prop", () => {
    it("icon이 없으면 화살표 아이콘을 렌더하지 않는다", async () => {
      await render(<Button label="확인" />);
      expect(getIcons()).toHaveLength(0);
    });

    it("icon이 left이면 아이콘이 label 앞에 렌더된다", async () => {
      await render(<Button label="확인" icon="left" />);
      expect(childTypes()).toEqual(["SvgMock", "Text"]);
    });

    it("icon이 right이면 아이콘이 label 뒤에 렌더된다", async () => {
      await render(<Button label="확인" icon="right" />);
      expect(childTypes()).toEqual(["Text", "SvgMock"]);
    });
  });
});
