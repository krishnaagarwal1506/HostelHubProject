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
