import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, Text } from "react-native";

import { ProfileLargeIcon } from "@/assets/icons";
import { BottomSheet } from "@/components/bottom-sheet/bottom-sheet";
import { useChangeProfileImage } from "@/hooks/mutations/use-change-profile-image";
import { useDeleteProfileImage } from "@/hooks/mutations/use-delete-profile-image";
import { pickSquareImage } from "@/lib/pick-image";
import { useToastStore } from "@/stores/toast-store";

type ProfilePhotoProps = {
  imageUrl: string | null;
};

// [임시] 시안이 없어 사진을 누르면 '앨범에서 선택' / '기본 이미지로 변경' 시트를 띄운다
// (PUT · DELETE /users/me/profile-image). 실패는 전역 토스트
export function ProfilePhoto({ imageUrl }: ProfilePhotoProps) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { mutate: change, isPending: isChanging } = useChangeProfileImage();
  const { mutate: remove, isPending: isRemoving } = useDeleteProfileImage();
  const isSaving = isChanging || isRemoving;
  const showToast = useToastStore((state) => state.showToast);

  const pick = async () => {
    setIsSheetOpen(false);
    try {
      const image = await pickSquareImage();
      if (image) change(image);
    } catch {
      showToast({ message: "사진을 불러오지 못했어요" });
    }
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="프로필 사진 바꾸기"
        accessibilityState={{ busy: isSaving }}
        disabled={isSaving}
        className={isSaving ? "opacity-50" : undefined}
        onPress={() => setIsSheetOpen(true)}
      >
        {imageUrl ? (
          <Image
            source={imageUrl}
            accessibilityIgnoresInvertColors
            className="size-20 rounded-full"
            contentFit="cover"
          />
        ) : (
          <ProfileLargeIcon />
        )}
      </Pressable>
      <BottomSheet
        visible={isSheetOpen}
        title="프로필 사진"
        onClose={() => setIsSheetOpen(false)}
        buttonLabel="취소"
        onButtonPress={() => setIsSheetOpen(false)}
      >
        <Pressable
          accessibilityRole="button"
          className="h-14 justify-center px-5"
          onPress={pick}
        >
          <Text className="text-primary text-body1-m">앨범에서 선택</Text>
        </Pressable>
        {imageUrl && (
          <Pressable
            accessibilityRole="button"
            className="h-14 justify-center px-5"
            onPress={() => {
              setIsSheetOpen(false);
              remove();
            }}
          >
            <Text className="text-danger text-body1-m">기본 이미지로 변경</Text>
          </Pressable>
        )}
      </BottomSheet>
    </>
  );
}
