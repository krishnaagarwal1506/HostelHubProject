import {
  Dashboard as DashboardIcon,
  AccountBox as AccountBoxIcon,
  Assessment as AssessmentIcon,
  RestaurantMenu as RestaurantMenuIcon,
  BedroomParent as BedroomParentIcon,
  AssignmentIndRounded as AssignmentIndRoundedIcon,
} from "@mui/icons-material";

import { SidebarValueType, AdminDashboardDetailsTypes } from "@ts/types";

export const ADMIN_ROLE: string = "admin";

export const ADMIN_SIDEBAR: SidebarValueType[] = [
  {
    field: "Dashboard",
    icon: DashboardIcon,
    path: "home",
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

export const STUDENT_SIDEBAR: SidebarValueType[] = [
  {
    field: "Dashboard",
    icon: DashboardIcon,
    path: "home",
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

export const USER_DATA_URL: string =
  "https://api.npoint.io/de4471c76c2129b205d7";

export const ADMIN_DASHBOARD_DETAIL_URL: string =
  "https://api.npoint.io/afae6426adf49484df48";

export const NOTICES_URL: string = "https://api.npoint.io/dedd459425f10436406b";

export const ADMIN_DASHBOARD_DETAIL: AdminDashboardDetailsTypes[] = [
  {
    label: "Students",
    icon: AccountBoxIcon,
    field: "numberOfStudents",
    color: "bg-primary-main",
  },
  {
    label: "Complaints",
    icon: AssessmentIcon,
    field: "complaitsPending",
    color: "bg-colors-lightBlue",
  },

  {
    label: "Rooms",
    icon: BedroomParentIcon,
    field: "numberOfRooms",
    color: "bg-colors-lightGreen",
  },
  {
    label: "Staff",
    icon: AssignmentIndRoundedIcon,
    field: "numberOfStaff",
    color: "bg-secondry-main",
  },
];
