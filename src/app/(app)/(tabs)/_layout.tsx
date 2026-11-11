import { Tabs } from "expo-router";

import {
  TabArchiveIcon,
  TabArchiveSelectedIcon,
  TabHomeIcon,
  TabHomeSelectedIcon,
  TabMyIcon,
  TabMySelectedIcon,
} from "@/assets/icons";
import { TabBar } from "@/components/tab-bar/tab-bar";

const TAB_ITEMS = [
  {
    key: "index",
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
  {
    key: "my",
    label: "마이",
    icon: TabMyIcon,
    selectedIcon: TabMySelectedIcon,
  },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={({ state, navigateToTab }) => (
        <TabBar
          items={TAB_ITEMS}
          selectedKey={state.routes[state.index].name}
          onSelect={(key) => {
            const route = state.routes.find((r) => r.name === key);
            if (route) navigateToTab(route.key);
          }}
        />
      )}
    >
      {/* SDK 58부터 레이아웃에 선언한 화면만 그려진다 */}
      <Tabs.Screen name="index" />
      <Tabs.Screen name="archive" />
      <Tabs.Screen name="my" />
    </Tabs>
  );
}
