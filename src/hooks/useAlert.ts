import { useState } from "react";
import { SeverityType } from "@ts/types";

const useAlert = () => {
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    message: string;
    severity: SeverityType;
  }>({
    isOpen: false,
    message: "",
    severity: "error",
  });
  const handleAlert = (
    isOpen: boolean = false,
    message: string = "",
    severity: SeverityType = "error"
  ): void => {
    setAlert({
      isOpen,
      message,
      severity,
    });
  };
  return { alert, handleAlert };
};

export default useAlert;
