import { useState } from "react";
import { Button, CircularProgress, ButtonProps } from "@mui/material";

type LoadingButtonType = {
  buttonText: string;
  color?: ButtonProps["color"];
  variant?: "text" | "outlined" | "contained";
  className?: string;
  onSubmit: () => Promise<void> | void;
  size?: ButtonProps["size"];
  disabled?: boolean;
};

const LoadingButton = ({
  buttonText,
  color = "primary",
  variant = "contained",
  className = "",
  size = "large",
  disabled = false,
  onSubmit,
}: LoadingButtonType) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await onSubmit();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={className}
      color={color}
      variant={variant}
      disabled={loading || disabled}
      onClick={handleClick}
      size={size}
      startIcon={loading && <CircularProgress size={16} />}
    >
      {buttonText}
    </Button>
  );
};

export default LoadingButton;
