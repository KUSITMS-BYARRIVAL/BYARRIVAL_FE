import { useState } from "react";

import { Chip } from "@/components/chip/chip";
import { useChangeRegion } from "@/hooks/mutations/use-change-region";
import {
  RegionPicker,
  regionLabelOf,
} from "@/screens/_components/region-picker";

import { SettingsLayout } from "./_components/settings-layout";
import { UserMeState } from "./_components/user-me-state";

// Figma 마이 - 설정(근무 지역): 온보딩 근무지 선택과 같은 검색·지역 패널, 고르면 바로 저장된다 (PUT /users/me/region)
// 서버는 근무 지역을 비우는 API가 없어 칩에 삭제(X)를 두지 않는다
export function ProfileRegionScreen() {
  const { mutate } = useChangeRegion();
  const [province, setProvince] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  return (
    <SettingsLayout
      title="근무 지역"
      scrollable={false}
      contentClassName="gap-3.5"
    >
      <UserMeState>
        {(me) => (
          <RegionPicker
            value={me.region}
            onSelect={({ sigunguId }) => mutate(sigunguId)}
            province={province ?? me.region?.sidoName ?? null}
            onProvinceChange={setProvince}
            query={query}
            onQueryChange={setQuery}
            panelClassName="overflow-hidden rounded"
            aboveList={
              me.region && (
                <Chip
                  label={regionLabelOf(me.region)}
                  accessibilityHint="눌러서 해당 지역 목록으로 이동해요"
                  onPress={() => setProvince(me.region!.sidoName)}
                  className="self-start"
                />
              )
            }
          />
        )}
      </UserMeState>
    </SettingsLayout>
  );
}
