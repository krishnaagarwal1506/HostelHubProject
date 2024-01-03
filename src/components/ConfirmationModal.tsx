import { ReactNode } from "react";
import { Button } from "@mui/material";

import DialogModal from "./DialogModal";
import LoadingButton from "./LoadingButton";
import { DELETE, ERROR, PRIMARY } from "@src/constant";

type DialogModalPropsTypes = {
  isOpen: boolean;
  title: string;
  buttontext: string;
  buttonType: string;
  cancelButtonText?: string;
  children: React.ReactNode;
  handleClose: () => void;
  handleSubmit: () => void;
  dialogTitleClassName?: string;
  iconButtonClasses?: string;
};

const ConfirmationModal = ({
  isOpen,
  title,
  buttontext,
  buttonType,
  cancelButtonText = "Cancel",
  children,
  handleClose,
  handleSubmit,
  dialogTitleClassName = "",
  iconButtonClasses = "",
}: DialogModalPropsTypes) => {
  const actions: ReactNode = (
    <>
      <Button variant="outlined" size="large" onClick={handleClose}>
        {cancelButtonText}
      </Button>
      <LoadingButton
        buttonText={buttontext}
        onSubmit={handleSubmit}
        color={buttonType === DELETE ? ERROR : PRIMARY}
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
      dialogTitleClassName={`bg-primary-main text-white mb-4 ${dialogTitleClassName}`}
      iconButtonClasses={`text-white ${iconButtonClasses}`}
    >
      {children}
    </DialogModal>
  );
};

export default ConfirmationModal;
