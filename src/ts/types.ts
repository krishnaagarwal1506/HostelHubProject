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
  path: string;
};

export type NoticeDataType = {
  id?: number;
  date: string;
  title: string;
  content: string;
};

export type NoticeStateProps = {
  notice: NoticeDataType;
  isNoticeModalOpen: boolean;
  isEditable: boolean;
  addNewNotice: boolean;
};

export type graphDataType =
  | [string, string | number][]
  | [string, string | number, string | number][];

export type StaffMembersType = {
  id: number;
  name: string;
  position: string;
  status: "Present" | "Absent";
};

export type StudentInfoType = {
  id: number;
  studentName: string;
  roomNumber: number;
  mobileNumber: string;
  guardianName: string;
  guardianPhoneNumber: string;
  address: string;
  aadharCardNumber: string;
  email: string;
};

export type StudentInfoStateType = {
  studentInfo: StudentInfoType;
  isStudentInfoModalOpen: boolean;
  isEditable: boolean;
};

export type SeverityType = "error" | "info" | "success" | "warning";
