import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { useGetMe } from "@/hooks/queries/use-get-me";

import { UserMeState } from "../user-me-state";

jest.mock("@/hooks/queries/use-get-me");

const mockedUseGetMe = jest.mocked(useGetMe);
const setQuery = (query: object) =>
  mockedUseGetMe.mockReturnValue(query as ReturnType<typeof useGetMe>);

const renderState = () =>
  render(
    <UserMeState>
      {(me) => <Text>{`내 닉네임 ${me.nickname}`}</Text>}
    </UserMeState>,
  );

describe("UserMeState", () => {
  it("불러오는 중이면 안내 문구만 보이고 children은 그리지 않는다", async () => {
    setQuery({ isPending: true, isError: false });

    await renderState();

    expect(screen.getByText("내 정보를 불러오는 중이에요")).toBeTruthy();
    expect(screen.queryByText(/내 닉네임/)).toBeNull();
  });

  it("실패하면 '다시 시도'를 눌러 refetch를 호출한다", async () => {
    const refetch = jest.fn();
    setQuery({ isPending: false, isError: true, refetch });

    await renderState();
    await fireEvent.press(screen.getByText("다시 시도"));

    expect(screen.getByText("내 정보를 불러오지 못했어요")).toBeTruthy();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("데이터가 있으면 children에 me를 넘겨 그린다", async () => {
    setQuery({
      isPending: false,
      isError: false,
      data: { nickname: "홍길동" },
    });

    await renderState();

    expect(screen.getByText("내 닉네임 홍길동")).toBeTruthy();
  });
});
