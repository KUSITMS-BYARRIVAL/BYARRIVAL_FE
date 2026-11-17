import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { useGetRegions } from "@/hooks/queries/use-get-regions";

import { RegionPicker } from "../region-picker";

jest.mock("@/hooks/queries/use-get-regions");

const mockedUseGetRegions = jest.mocked(useGetRegions);
const setQuery = (query: object) =>
  mockedUseGetRegions.mockReturnValue(
    query as ReturnType<typeof useGetRegions>,
  );

const sidos = [
  {
    sidoId: 1,
    name: "서울",
    sigungus: [
      { sigunguId: 11, name: "강남구" },
      { sigunguId: 12, name: "강동구" },
    ],
  },
  { sidoId: 2, name: "경기", sigungus: [{ sigunguId: 21, name: "수원시" }] },
];
const loaded = { isPending: false, isError: false, data: sidos };

const renderPicker = async (
  props: Partial<Parameters<typeof RegionPicker>[0]> = {},
) => {
  const handlers = {
    onSelect: jest.fn(),
    onProvinceChange: jest.fn(),
    onQueryChange: jest.fn(),
  };
  await render(
    <RegionPicker
      value={null}
      province={null}
      query=""
      {...handlers}
      {...props}
    />,
  );
  return handlers;
};

describe("RegionPicker", () => {
  it("목록을 불러오는 중이면 안내 문구를 보여준다", async () => {
    setQuery({ isPending: true, isError: false });

    await renderPicker();

    expect(screen.getByText("지역 목록을 불러오는 중이에요")).toBeTruthy();
  });

  it("실패하면 '다시 시도'를 눌러 refetch를 호출한다", async () => {
    const refetch = jest.fn();
    setQuery({ isPending: false, isError: true, refetch });

    await renderPicker();
    await fireEvent.press(screen.getByText("다시 시도"));

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("province가 null이면 첫 번째 시/도의 시/군/구 목록을 보여준다", async () => {
    setQuery(loaded);

    await renderPicker();

    expect(screen.getByText("강남구")).toBeTruthy();
    expect(screen.queryByText("수원시")).toBeNull();
  });

  it("검색 결과를 누르면 시/도 탭 · 검색어 비우기 · 선택이 함께 호출된다", async () => {
    setQuery(loaded);

    const { onSelect, onProvinceChange, onQueryChange } = await renderPicker({
      query: "수원",
    });
    await fireEvent.press(screen.getByText("경기 수원시"));

    expect(onProvinceChange).toHaveBeenCalledWith("경기");
    expect(onQueryChange).toHaveBeenCalledWith("");
    expect(onSelect).toHaveBeenCalledWith({
      sidoId: 2,
      sidoName: "경기",
      sigunguId: 21,
      sigunguName: "수원시",
    });
  });

  it("공백뿐인 검색어는 검색으로 보지 않고 시/도 패널을 유지한다", async () => {
    setQuery(loaded);

    await renderPicker({ query: "   " });

    expect(screen.getByText("강남구")).toBeTruthy();
    expect(screen.queryByText("검색 결과가 없어요")).toBeNull();
  });

  it("검색 중이 아니면 aboveList를 보여준다", async () => {
    setQuery(loaded);
    const aboveList = <Text>선택한 지역</Text>;

    await renderPicker({ aboveList });
    expect(screen.getByText("선택한 지역")).toBeTruthy();
  });

  it("검색 중에는 aboveList를 숨긴다", async () => {
    setQuery(loaded);

    await renderPicker({ query: "강남", aboveList: <Text>선택한 지역</Text> });

    expect(screen.queryByText("선택한 지역")).toBeNull();
  });
});
