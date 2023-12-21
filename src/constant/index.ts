import {
  Dashboard as DashboardIcon,
  AccountBox as AccountBoxIcon,
  Assessment as AssessmentIcon,
  RestaurantMenu as RestaurantMenuIcon,
  BedroomParent as BedroomParentIcon,
  AssignmentIndRounded as AssignmentIndRoundedIcon,
  PendingActions,
  DoneAll,
  Error,
  ViewList,
} from "@mui/icons-material";

import { SidebarValueType, AdminDashboardDetailsTypes } from "@ts/types";

export const ADMIN = "admin" as const;
export const STUDENT = "student" as const;
export const PENDING = "pending" as const;
export const RESOLVED = "resolved" as const;
export const INVALID = "invalid" as const;
export const ALL = "all" as const;
export const ABSENT = "absent" as const;
export const PRESENT = "present" as const;
export const EMPTY = "empty" as const;
export const FILLED = "filled" as const;
export const PARTIAL_FILLED = "partialfilled" as const;
export const NOT_AVAILABLE = "notavailable" as const;
export const SUCCESS = "success" as const;
export const ERROR = "error" as const;
export const DELETE = "delete" as const;

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
  // {
  //   field: "Rooms",
  //   icon: BedroomParentIcon,
  //   path: "rooms",
  // },
];

export const NAVBAR_TITLE_ADMIN: { [key: string]: string } = {
  dashboard: "Dashboard",
  students: "Student Info.",
  complaints: "Complaints",
  canteenMenu: "Canteen Menu",
  rooms: "Rooms",
};
export const NAVBAR_TITLE_STUDENT: { [key: string]: string } = {
  dashboard: "My Dashboard",
  complaints: "My Complaints",
  canteenMenu: "Canteen Menu",
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
    path: "canteenMenu",
  },
];

export const SETTINGS: string[] = ["Logout"]; //removed Profile from Settings

export const METHOD = {
  GET: "GET" as const,
  POST: "POST" as const,
  PUT: "PUT" as const,
  DELETE: "DELETE" as const,
};

export const DASHBOARD_ENDPOINT: string = "dashboard";

export const BASE_URL: string = "http://localhost:1337";

export const USER_DATA_URL: string = "/api/users/me";

export const ADMIN_DASHBOARD_DETAIL_URL: string =
  BASE_URL + "/api/dashboard-detail";

export const NOTICES_URL: string = BASE_URL + "/api/notices";

export const ROOM_STATUS_DATA_URL: string =
  BASE_URL + "/api/room-status-graph-data";

export const STAFF_LIST_URL = BASE_URL + "/api/staff-lists";

export const COMPLAINTS_STATS_URL = BASE_URL + "/api/complaint-stats";

export const STUDENT_INFO_URL = BASE_URL + "/api/students";

export const COMPLAINTS_URL = BASE_URL + "/api/complaints";

export const STRAPI_USER_URL = BASE_URL + "/api/users";

export const USER_LOGIN_URL = BASE_URL + "/api/auth/local";

export const GOOGLE_LOGIN_CALLBACK = BASE_URL + "/api/auth/google/callback";

export const GOOGLE_LOGIN_URL = BASE_URL + "/api/connect/google/";

export const CANTEEN_MENU_URL = BASE_URL + "/api/menu-links/1";

export const STRAPI_FILE_UPLOAD_URL = BASE_URL + "/api/upload";

export const TODAY_MENU_URL = BASE_URL + "/api/todaymenu";

export const ROOM_INFO_URL = BASE_URL + "/api/room-info";

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
    path: "",
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
  "& .MuiFormLabel-root.Mui-focused": {
    color: "rgba(0, 0, 0, 0.6)",
  },
};

export const COMPLAINT_STATUS = [
  {
    status: ALL,
    icon: ViewList,
  },
  {
    status: PENDING,
    icon: PendingActions,
  },
  {
    status: RESOLVED,
    icon: DoneAll,
  },
  {
    status: INVALID,
    icon: Error,
  },
];

export const ID_TYPE = ["Aadhar Card", "Pan Card", "Institute Card"];

export const STEPPER_FORM_STEPS_NAME = [
  "Personal Info",
  "Guardian Info",
  "Password",
  "Goverment Id.",
];

export const STEPPER_FORM_STEPS_DESCRIPTION = [
  "Please provide Personal Information",
  "Please provide Guardian Info.",
  "Please provide password",
  "Enter your goverment id details",
];

export const STATUS_ICONS = {
  pending: PendingActions,
  resolved: DoneAll,
  invalid: Error,
};

export const COMPLAINT_TYPES_OPTIONS = [
  "Facilities and Services",
  "Internet and Connectivity",
  "Safety and Security",
  "Maintenance and Repairs",
  "Cleanliness and Hygiene",
  "Room Related",
  "Food related",
  "Hostel Staff",
  "Others",
];
