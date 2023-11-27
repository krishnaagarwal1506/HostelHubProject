import { useState } from "react";

const UseDialog = (onSubmit: () => void) => {
  const [open, setOpen] = useState<boolean>(false);
  const handleDialogOpen = (): void => setOpen(true);

  const handleDialogClose = (): void => setOpen(false);

  const handleDialogSubmit = (): void => {
    onSubmit();
    handleDialogClose();
  };
  return { open, handleDialogOpen, handleDialogClose, handleDialogSubmit };
};

export default UseDialog;
