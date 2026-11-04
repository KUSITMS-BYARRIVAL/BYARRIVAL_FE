import { fireEvent, render, screen } from "@testing-library/react-native";
import type { ReactElement } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  TabArchiveIcon,
  TabArchiveSelectedIcon,
  TabHomeIcon,
  TabHomeSelectedIcon,
} from "@/assets/icons";

import { TabBar } from "../tab-bar";

const renderWithSafeArea = (ui: ReactElement) =>
  render(
    <SafeAreaProvider
      initialMetrics={{
        frame: { x: 0, y: 0, width: 393, height: 852 },
        insets: { top: 0, left: 0, right: 0, bottom: 0 },
      }}
    >
      {ui}
    </SafeAreaProvider>,
  );

const ITEMS = [
  {
    key: "home",
    label: "홈",
    icon: TabHomeIcon,
    selectedIcon: TabHomeSelectedIcon,
  },
  {
    key: "archive",
    label: "보관함",
    icon: TabArchiveIcon,
    selectedIcon: TabArchiveSelectedIcon,
  },
];

describe("TabBar", () => {
  it("selectedKey에 해당하는 탭만 선택 상태가 된다", async () => {
    await renderWithSafeArea(
      <TabBar items={ITEMS} selectedKey="archive" onSelect={jest.fn()} />,
    );
    expect(screen.getByRole("tab", { name: "보관함" })).toBeSelected();
    expect(screen.getByRole("tab", { name: "홈" })).not.toBeSelected();
  });

  it("탭을 누르면 해당 key로 onSelect를 호출한다", async () => {
    const onSelect = jest.fn();
    await renderWithSafeArea(
      <TabBar items={ITEMS} selectedKey="archive" onSelect={onSelect} />,
    );
    await fireEvent.press(screen.getByRole("tab", { name: "홈" }));
    expect(onSelect).toHaveBeenCalledWith("home");
  });
});
