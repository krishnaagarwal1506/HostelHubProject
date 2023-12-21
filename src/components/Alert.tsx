import { useEffect } from "react";
import Alert from "@mui/material/Alert";
import { SeverityType } from "@ts/types";

type AlertProps = {
  severity: SeverityType;
  message: string;
  handleClose: () => void;
};

const closeAlertAfterDelay = (handleClose: () => void) => {
  setTimeout(() => {
    handleClose();
  }, 3000);
};

const AlertComponent = ({ severity, message, handleClose }: AlertProps) => {
  useEffect(() => {
    closeAlertAfterDelay(handleClose);
  }, []);
  if (!severity) return null;
  return (
    <Alert
      className="w-3/4 md:w-1/3 lg:w-1/4 py-4 text-md fixed top-10 right-5 animate-slideinRight align-middle rounded-xl z-[1500]"
      variant="filled"
      severity={severity}
      onClose={handleClose}
    >
      {message}
    </Alert>
  );
};

export default AlertComponent;
