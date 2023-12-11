import {
  Dashboard as DashboardIcon,
  AccountBox as AccountBoxIcon,
  Assessment as AssessmentIcon,
  RestaurantMenu as RestaurantMenuIcon,
  BedroomParent as BedroomParentIcon,
  AssignmentIndRounded as AssignmentIndRoundedIcon,
  PendingActions,
  DoneAll,
  Dangerous,
  ViewList,
} from "@mui/icons-material";

import { SidebarValueType, AdminDashboardDetailsTypes } from "@ts/types";

export const ADMIN_SIDEBAR: SidebarValueType[] = [
  {
    field: "Dashboard",
    icon: DashboardIcon,
    path: "dashboard",
  },
  {
    field: "Student Info.",
    icon: AccountBoxIcon,
    path: "students",
  },
  {
    field: "Complaints",
    icon: AssessmentIcon,
    path: "complaints",
  },
  {
    field: "Canteen Menu",
    icon: RestaurantMenuIcon,
    path: "canteenMenu",
  },
  {
    field: "Rooms",
    icon: BedroomParentIcon,
    path: "rooms",
  },
];

export const NAVBAR_TITLE: { [key: string]: string } = {
  dashboard: "Dashboard",
  students: "Student Info.",
  complaints: "Complaints",
  canteenMenu: "Canteen Menu",
  rooms: "Rooms",
};

export const STUDENT_SIDEBAR: SidebarValueType[] = [
  {
    field: "Dashboard",
    icon: DashboardIcon,
    path: "dashboard",
  },
  {
    field: "Complaints",
    icon: AssessmentIcon,
    path: "complaints",
  },
  {
    field: "Canteen Menu",
    icon: RestaurantMenuIcon,
    path: "conteenMenu",
  },
];

export const SETTINGS: string[] = ["Profile", "Logout"];

export const METHOD = {
  GET: "GET" as const,
  POST: "POST" as const,
  PUT: "PUT" as const,
  DELETE: "DELETE" as const,
};

export const DASHBOARD_ENDPOINT: string = "dashboard";

export const BASE_URL: string = "http://localhost:1337";

export const USER_DATA_URL: string =
  "https://api.npoint.io/de4471c76c2129b205d7";

export const ADMIN_DASHBOARD_DETAIL_URL: string =
  BASE_URL + "/api/dashboard-detail";

export const NOTICES_URL: string = BASE_URL + "/api/notices";

export const ROOM_STATUS_DATA_URL: string =
  BASE_URL + "/api/room-status-graph-data";

export const STAFF_LIST_URL = BASE_URL + "/api/staff-lists";

export const COMPLAINTS_STATS_URL = BASE_URL + "/api/complaint-stats";

export const STUDENT_INFO_URL = "http://localhost:3001/studentInfo";

export const COMPLAINTS_URL = "http://localhost:3001/complaints";

export const ADMIN_DASHBOARD_DETAIL: AdminDashboardDetailsTypes[] = [
  {
    label: "Students",
    icon: AccountBoxIcon,
    field: "numberOfStudents",
    color: "bg-primary-main",
    path: "students",
  },
  {
    label: "Complaints",
    icon: AssessmentIcon,
    field: "complaitsPending",
    color: "bg-common-lightBlue",
    path: "complaints",
  },

  {
    label: "Rooms",
    icon: BedroomParentIcon,
    field: "numberOfRooms",
    color: "bg-success-light",
    path: "rooms",
  },
  {
    label: "Staff",
    icon: AssignmentIndRoundedIcon,
    field: "numberOfStaff",
    color: "bg-secondary-main",
    path: "",
  },
];

export const STUDENT_INFO_INPUTS = {
  studentNameInput: {
    label: "Student Name",
    name: "studentName",
    type: "text",
  },
  roomNumberInput: {
    label: "Room Number",
    name: "roomNumber",
    type: "number",
  },
  mobileNumberInput: {
    label: "Mobile Number",
    name: "mobileNumber",
    type: "tel",
  },
  guardianNameInput: {
    label: "Guardian Name",
    name: "guardianName",
    type: "text",
  },
  guardianPhoneNumberInput: {
    label: "Guardian Phone no.",
    name: "guardianPhoneNumber",
    type: "tel",
  },
  addressInput: {
    label: "Address",
    name: "address",
    type: "text",
  },
  emailInput: {
    label: "Student Email",
    name: "email",
    type: "email",
  },
  passwordInput: {
    label: "Password",
    name: "password",
    type: "password",
  },
  confirmPasswordInput: {
    label: "Confirm Password",
    name: "confirmPassword",
    type: "password",
  },
};

export const CONFIRM_PASSWORD_INPUT = {
  label: "Confirm Password",
  name: "confirmPassword",
  type: "password",
};

export const READ_ONLY_SX_VALUES = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "inherit",
    },
    "&.Mui-focused fieldset": {
      borderColor: "inherit",
      borderWidth: 1,
    },
    "&:hover fieldset": {
      borderColor: "inherit",
    },
  },
};

export const COMPLAINT_STATUS = [
  {
    status: "all",
    icon: ViewList,
  },
  {
    status: "pending",
    icon: PendingActions,
  },
  {
    status: "resolved",
    icon: DoneAll,
  },
  {
    status: "invalid",
    icon: Dangerous,
  },
];

export const ID_TYPE = ["Aadhar Card", "Pan Card", "Institute Card"];

export const STEPPER_FORM_STEPS_NAME = [
  "Personal Info",
  "Guardian Info",
  "Password",
  "Goverment Id.",
];
