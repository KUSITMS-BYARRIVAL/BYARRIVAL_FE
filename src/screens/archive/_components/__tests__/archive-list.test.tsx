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
  it("담은 기사 수와, 전체·8개 분야 칩을 모두 보여준다", async () => {
    await renderList();
    expect(screen.getByText("스크랩한 4개의 기사")).toBeOnTheScreen();
    for (const label of [
      "전체",
      "경제",
      "테크",
      "커리어",
      "과학",
      "사회",
      "글로벌",
      "라이프",
      "문화",
    ]) {
      expect(screen.getByRole("button", { name: label })).toBeOnTheScreen();
    }
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

  it("고른 분야에 담은 기사가 없으면 빈 문구를 보여준다", async () => {
    const user = userEvent.setup();
    await renderList();
    await user.press(screen.getByRole("button", { name: "사회" }));
    expect(screen.getByRole("button", { name: "사회" })).toBeSelected();
    expect(
      screen.getByText(
        "아직 담은 기사가 없어요.\n읽다가 북마크를 눌러 담아보세요",
      ),
    ).toBeOnTheScreen();
    for (const article of ARCHIVE_ARTICLES) {
      expect(screen.queryByText(article.title)).toBeNull();
    }
  });
});
