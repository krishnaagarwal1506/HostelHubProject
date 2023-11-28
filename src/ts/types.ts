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

export type AdminDashboardDataTypes = {
  numberOfStudents: number;
  complaitsPending: number;
  numberOfRooms: number;
};

export type AdminDashboardDetailsTypes = {
  label: string;
  icon: FC<SvgIconProps>;
  field: string;
  color: string;
};

export type NoticeDataType = {
  date: string;
  heading: string;
  content: string;
};
