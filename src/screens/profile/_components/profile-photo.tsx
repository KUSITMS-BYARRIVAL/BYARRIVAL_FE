import { Image } from "expo-image";
import { useRef, useState } from "react";
import { Platform, Pressable, Text } from "react-native";

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
  // 앨범을 열 때는 시트를 페이드 없이 바로 닫는다
  const [isPicking, setIsPicking] = useState(false);
  const isPickPendingRef = useRef(false);
  const { mutate: change, isPending: isChanging } = useChangeProfileImage();
  const { mutate: remove, isPending: isRemoving } = useDeleteProfileImage();
  const isSaving = isChanging || isRemoving;
  const showToast = useToastStore((state) => state.showToast);

  const pick = async () => {
    try {
      const image = await pickSquareImage();
      if (image) change(image);
    } catch {
      showToast({ message: "사진을 불러오지 못했어요" });
    }
  };

  const startPick = () => {
    setIsPicking(true);
    setIsSheetOpen(false);
    // iOS는 닫히는 중인 시트 위에 사진 선택 화면을 띄우지 못해 다 닫힌 뒤(onDismiss, iOS만 호출) 연다
    if (Platform.OS === "ios") isPickPendingRef.current = true;
    else pick();
  };

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="프로필 사진 바꾸기"
        accessibilityState={{ busy: isSaving }}
        disabled={isSaving}
        className={isSaving ? "opacity-50" : undefined}
        onPress={() => {
          setIsPicking(false);
          setIsSheetOpen(true);
        }}
      >
        {imageUrl ? (
          <Image
            source={imageUrl}
            accessibilityIgnoresInvertColors
            // expo-image는 NativeWind className을 받지 않아 style로 지정 (기본 아이콘과 같은 80, rounded-full)
            style={{ width: 80, height: 80, borderRadius: 40 }}
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
        animationType={isPicking ? "none" : "fade"}
        onDismiss={() => {
          if (!isPickPendingRef.current) return;
          isPickPendingRef.current = false;
          pick();
        }}
      >
        <Pressable
          accessibilityRole="button"
          className="h-14 justify-center px-5"
          onPress={startPick}
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
