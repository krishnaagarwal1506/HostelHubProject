import { useState } from "react";

const useDialog = (onSubmit: () => void) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleDialogOpen = (): void => setOpen(true);

  const handleDialogClose = (): void => setOpen(false);

  const handleDialogSubmit = (): void => {
    onSubmit();
    handleDialogClose();
  };
  return { open, handleDialogOpen, handleDialogClose, handleDialogSubmit };
};

export default useDialog;
