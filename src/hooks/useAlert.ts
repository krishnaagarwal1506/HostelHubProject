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
  const handleAlertOpen = (message: string, severity: SeverityType): void =>
    setAlert({
      isOpen: true,
      message,
      severity,
    });

  const handleAlertClose = (): void =>
    setAlert({
      isOpen: false,
      message: "",
      severity: "error",
    });

  return { alert, handleAlertOpen, handleAlertClose };
};

export default useAlert;
