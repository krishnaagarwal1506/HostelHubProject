import { FC, ChangeEvent, MouseEventHandler } from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";

export type ErrorType = {
  isError: boolean;
  message: string;
};

export type SidebarValueType = {
  field: string;
  icon: FC<SvgIconProps>;
  path: string;
};

export type UserDetailsType = {
  id: number;
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
  isModalOpen: boolean;
  isEditable: boolean;
  add: boolean;
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
  id?: number;
  studentName: string;
  roomNumber: number | null;
  mobileNumber: string;
  guardianName: string;
  guardianPhoneNumber: string;
  address: string;
  email: string;
  password: string;
  govId: string;
  govIdImage: string;
};
export type AddStudentStateType = StudentInfoType & {
  confirmPassword: string;
};

export type StudentInfoStateType = {
  studentInfo: StudentInfoType;
  isStudentInfoModalOpen: boolean;
  isEditable: boolean;
};

export type SeverityType = "error" | "info" | "success" | "warning" | "";

export type StepperFormType = {
  student: AddStudentStateType;
  validateError: (value: string, type: string) => boolean;
  getHelperText: (
    value: string,
    type: string,
    confirmPassword?: string
  ) => string;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClick: MouseEventHandler<HTMLDivElement>;
};

export type ComplaintStatusType = "pending" | "resolved" | "invalid";

export type ComplaintType = {
  id?: number;
  date: string;
  type: string;
  description: string;
  studentName: string;
  status: ComplaintStatusType;
};

export type ComplaintStateType = {
  complaint: ComplaintType;
  isModalOpen: boolean;
  isModalEditable: boolean;
};

export type StaffStatusType = "Present" | "Absent" | "All";
