import { ReactElement, MouseEvent } from "react";
import { Chip } from "@mui/material";
import { getStatusColor } from "@utils/index";

type ChipType = {
  className?: string;
  onClick?: (event: MouseEvent) => void;
  text: string;
  icon?: ReactElement;
  type: string;
  variant?: "filled" | "outlined";
  isActive?: boolean;
};

const ChipComponent = ({
  className,
  onClick,
  text,
  icon = undefined,
  type,
  variant = "filled",
  isActive = true,
}: ChipType) => {
  const color = getStatusColor(type, isActive);
  const { boxClass, textColor } = color;

  return (
    <Chip
      className={`${className} ${boxClass} ${textColor} flex-row-reverse `}
      label={text}
      onClick={onClick}
      icon={icon}
      variant={variant}
      sx={{
        backgroundColor: "white",
        "& .MuiChip-label": {
          padding: "0",
          paddingLeft: icon ? "0.5rem" : "0",
        },
        "& .MuiChip-icon": {
          marginRight: "0rem",
          marginLeft: "0rem",
          fontSize: "1.25rem",
        },
      }}
    />
  );
};

export default ChipComponent;
