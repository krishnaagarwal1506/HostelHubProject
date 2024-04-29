import { FC, ChangeEvent, MouseEventHandler } from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";

export type ErrorType = {
  isError: boolean;
  message: string;
};

export interface paginationType {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}

export type SidebarValueType = {
  field: string;
  icon: FC<SvgIconProps>;
  path: string;
};

export type UserDetailsType = {
  id: number | null;
  name: string;
  email: string;
  role: string;
  studentInfo?: StudentInfoType;
};

export type AdminDashboardDataTypes = {
  numberOfStudents: number | undefined;
  complaitsPending: number | undefined;
  applicationPending: number | undefined;
  numberOfStaff: number | undefined;
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
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
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
  user?: {
    data: {
      id: number;
      attributes: {
        username: string;
        email: string;
        provider: string;
      };
    };
  };
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
export type ApplicationStatusType = "pending" | "approved" | "rejected";

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

export type ApplicationsType = {
  id: number;
  date: string;
  subject: string;
  description: string;
  student: {
    data: {
      id: string;
      attributes: StudentInfoType;
    };
  };
  status: ApplicationStatusType;
  document?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
};

export type ApplicationStateType = {
  application: ApplicationsType;
  isModalOpen: boolean;
  isModalEditable: boolean;
};

export type StaffStatusType = "Present" | "Absent" | "All";

export interface FetchgraphData {
  data: {
    id: string;
    attributes: {
      graphData: graphDataType;
    };
  };
}

export interface fetchNoticeData {
  data: {
    id: number;
    attributes: NoticeDataType;
  }[];
}
export interface fetchStaffListData {
  data: {
    id: number;
    attributes: StaffMembersType;
  }[];
}

export interface fetchStudentListData {
  data: {
    id: number;
    attributes: StudentInfoType;
  }[];
  meta: {
    pagination: paginationType;
  };
}

export interface fetchComplaintListData {
  data: {
    id: number;
    attributes: ComplaintType;
  }[];
  meta: {
    pagination: paginationType;
  };
}

export interface fetchApplicationListData {
  data: {
    id: number;
    attributes: ApplicationsType;
  }[];
  meta: {
    pagination: paginationType;
  };
}
