import { Button } from "@mui/material";

import DialogModal from "./DialogModal";
import LoadingButton from "./LoadingButton";

type DialogModalPropsTypes = {
  isOpen: boolean;
  title: string;
  buttontext: string;
  buttonType: string;
  children: React.ReactNode;
  handleClose: () => void;
  handleSubmit: () => void;
};

const ConfirmationModal = ({
  isOpen,
  title,
  buttontext,
  buttonType,
  children,
  handleClose,
  handleSubmit,
}: DialogModalPropsTypes) => {
  const actions: React.ReactNode = (
    <>
      <Button variant="outlined" size="large" onClick={handleClose}>
        Cancel
      </Button>
      <LoadingButton
        buttonText={buttontext}
        onSubmit={handleSubmit}
        color={buttonType === "delete" ? "error" : "primary"}
      />
    </>
  );

  return (
    <DialogModal
      dialogSize="xs"
      isOpen={isOpen}
      title={title}
      handleClose={handleClose}
      actions={actions}
    >
      {children}
    </DialogModal>
  );
};

export default ConfirmationModal;
