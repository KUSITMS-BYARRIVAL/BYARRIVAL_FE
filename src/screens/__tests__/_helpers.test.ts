import * as WebBrowser from "expo-web-browser";

import { toJobGroupCode } from "@/types/user/user.mappers";

import { openArticle, toPopularChipLabel } from "../_helpers";

jest.mock("expo-web-browser", () => ({ openBrowserAsync: jest.fn() }));

beforeEach(() => {
  jest.mocked(WebBrowser.openBrowserAsync).mockClear();
});

describe("toPopularChipLabel", () => {
  it("직군 코드가 없으면 전체 칩이다", () => {
    expect(toPopularChipLabel(null)).toBe("전체");
  });

  it("직군 코드를 '내 직군 · {직군 이름}'으로 보여준다", () => {
    expect(toPopularChipLabel(toJobGroupCode("planning_marketing"))).toBe(
      "내 직군 · 기획·마케팅",
    );
  });

  it("앱에 없는 직군 코드면 코드를 그대로 보여준다", () => {
    expect(toPopularChipLabel("UNKNOWN")).toBe("내 직군 · UNKNOWN");
  });
});

describe("openArticle", () => {
  it("https 주소는 인앱 브라우저로 연다 (스킴 대소문자 무관)", () => {
    openArticle("https://example.com/a");
    openArticle("HTTPS://example.com/b");
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(
      "https://example.com/a",
    );
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(
      "HTTPS://example.com/b",
    );
  });

  it("https가 아닌 주소는 열지 않는다", () => {
    openArticle("http://example.com");
    openArticle("javascript:alert(1)");
    expect(WebBrowser.openBrowserAsync).not.toHaveBeenCalled();
  });
});
