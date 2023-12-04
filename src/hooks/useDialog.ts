import { useState } from "react";

const useDialog = (onSubmit: () => void) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleDialogClick = (state: boolean): void => setOpen(state);

  const handleDialogSubmit = (): void => {
    onSubmit();
    handleDialogClick(false);
  };
  return { open, handleDialogClick, handleDialogSubmit };
};

export default useDialog;
