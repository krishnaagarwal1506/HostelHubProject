import { Button } from "@mui/material";

import DialogModal from "./DialogModal";

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
      <Button
        className="rounded-xl"
        variant="contained"
        size="large"
        color={buttonType === "delete" ? "error" : "primary"}
        onClick={handleSubmit}
      >
        {buttontext}
      </Button>
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
