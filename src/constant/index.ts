import {
  Dashboard as DashboardIcon,
  AccountBox as AccountBoxIcon,
  Assessment as AssessmentIcon,
  RestaurantMenu as RestaurantMenuIcon,
  BedroomParent as BedroomParentIcon,
} from "@mui/icons-material";

import { SidebarValueType } from "@ts/types";

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

export const DASHBOARD_ENDPOINT: string = "dashboard";

export const USER_DATA_URL: string =
  "https://api.npoint.io/de4471c76c2129b205d7";

export const ADMIN_DASHBOARD_DETAIL_URL: string =
  "https://api.npoint.io/afae6426adf49484df48";

export const NOTICES_URL: string = "https://api.npoint.io/dedd459425f10436406b";

export const ROOM_STATUS_DATA_URL: string =
  "https://api.npoint.io/89bedc5ce0a4a2482847";
