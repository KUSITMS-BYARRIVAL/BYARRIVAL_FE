import { render, screen, userEvent } from "@testing-library/react-native";
import * as WebBrowser from "expo-web-browser";

import { ARCHIVE_ARTICLES, ARCHIVE_SMALLTALKS } from "@/mocks/archive";

import { ArchiveList } from "../archive-list";

jest.mock("expo-web-browser", () => ({ openBrowserAsync: jest.fn() }));

const renderList = (articles = ARCHIVE_ARTICLES) =>
  render(
    <ArchiveList
      tab="article"
      articles={articles}
      smalltalks={ARCHIVE_SMALLTALKS}
      onRemoveArticle={jest.fn()}
      onRemoveSmalltalk={jest.fn()}
    />,
  );

describe("ArchiveList", () => {
  it("담은 기사 수와, 담은 기사에 있는 분야 칩만 보여준다", async () => {
    await renderList();
    expect(screen.getByText("내가 직접 담은 4개의 기사")).toBeOnTheScreen();
    for (const label of ["전체", "경제", "테크", "글로벌", "라이프"]) {
      expect(screen.getByRole("button", { name: label })).toBeOnTheScreen();
    }
    expect(screen.queryByRole("button", { name: "사회" })).toBeNull();
  });

  it("분야 칩을 누르면 그 분야 기사만 보여준다", async () => {
    const user = userEvent.setup();
    await renderList();
    await user.press(screen.getByRole("button", { name: "테크" }));
    const [economy, , tech] = ARCHIVE_ARTICLES;
    expect(screen.getByText(tech.title)).toBeOnTheScreen();
    expect(screen.queryByText(economy.title)).toBeNull();
  });

  it("카드를 누르면 원문을 열고, 북마크를 누르면 그 기사로 onRemoveArticle을 호출한다", async () => {
    const user = userEvent.setup();
    const onRemoveArticle = jest.fn();
    await render(
      <ArchiveList
        tab="article"
        articles={ARCHIVE_ARTICLES.slice(0, 1)}
        smalltalks={ARCHIVE_SMALLTALKS}
        onRemoveArticle={onRemoveArticle}
        onRemoveSmalltalk={jest.fn()}
      />,
    );
    const [article] = ARCHIVE_ARTICLES;
    await user.press(screen.getByText(article.title));
    expect(WebBrowser.openBrowserAsync).toHaveBeenCalledWith(article.url);
    await user.press(screen.getByRole("button", { name: "북마크" }));
    expect(onRemoveArticle).toHaveBeenCalledWith(article);
  });

  it("고른 분야의 마지막 기사가 빠지면 '전체'로 돌아가 남은 기사를 모두 보여준다", async () => {
    const user = userEvent.setup();
    const { rerender } = await renderList();
    await user.press(screen.getByRole("button", { name: "테크" }));

    const withoutTech = ARCHIVE_ARTICLES.filter((a) => a.category !== "tech");
    await rerender(
      <ArchiveList
        tab="article"
        articles={withoutTech}
        smalltalks={ARCHIVE_SMALLTALKS}
        onRemoveArticle={jest.fn()}
        onRemoveSmalltalk={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "전체" })).toBeSelected();
    expect(screen.queryByRole("button", { name: "테크" })).toBeNull();
    for (const article of withoutTech) {
      expect(screen.getByText(article.title)).toBeOnTheScreen();
    }
  });
});
