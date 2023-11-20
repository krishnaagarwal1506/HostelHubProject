import { FC } from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";

export type SidebarValueType = {
  field: string;
  icon: FC<SvgIconProps>;
  path: string;
};

export type UserDetialsType = {
  name: string;
  email: string;
  role: string;
};
