import { Dialog } from "@/components/dialog/dialog";
import { useDialogStore } from "@/stores/dialog-store";

/** 루트에 한 번 두고, 어디서든 openDialog로 띄운다. 버튼을 누르면 닫고 콜백을 부른다 */
export function DialogHost() {
  const { options, isVisible, closeDialog } = useDialogStore();
  if (!options) return null;

  const { onConfirm, onCancel } = options;
  return (
    <Dialog
      {...options}
      visible={isVisible}
      onConfirm={() => {
        closeDialog();
        onConfirm();
      }}
      onCancel={
        onCancel &&
        (() => {
          closeDialog();
          onCancel();
        })
      }
    />
  );
}
