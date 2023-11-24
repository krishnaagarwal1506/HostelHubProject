import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { SidebarValueType } from "@ts/types";
import { DASHBOARD_ENDPOINT } from "@constant/index";
import logo from "@assets/logo.svg";

type sidebarPropType = {
  isSidebarOpen: boolean;
  sidebarFields: SidebarValueType[];
};

const Sidebar = ({ isSidebarOpen, sidebarFields }: sidebarPropType) => {
  const location = useLocation();

  const locationPath: string = location.pathname.slice(
    location.pathname.lastIndexOf("/") + 1
  );
  const navigate = useNavigate();
  const sidebarboxCss = isSidebarOpen ? " lg:w-1/4" : "lg:w-24 hidden";
  const logoHeadingCss = isSidebarOpen ? "lg:block " : "lg:hidden";

  return (
    <Box
      className={`fixed w-60 z-10 lg:z-0 h-screen bg-primary-main lg:static overflow-hidden animate-slidein lg:block lg:transition-all ${sidebarboxCss} `}
    >
      <Box className="flex justify-center gap-x-2.5 pt-5">
        <img className="w-10 h-10" src={logo} alt="logo" />
        <Typography
          className={`hidden text-white ${logoHeadingCss}`}
          variant="h4"
        >
          HostelHub
        </Typography>
      </Box>
      <List className="flex flex-col mt-4">
        {sidebarFields.map(({ path, field, icon }: SidebarValueType) => {
          const listbuttonCss =
            path === locationPath
              ? "bg-background-default rounded-l-2xl"
              : "bg-primary-main";
          const listSvgCss =
            path === locationPath ? "fill-primary-main" : "fill-white";
          const listTextCss =
            path === locationPath ? "text-primary-main" : "text-white";
          const IconComponent = icon;
          const navigateEndPoint =
            path === DASHBOARD_ENDPOINT ? "" : `/${DASHBOARD_ENDPOINT}/${path}`;

          return (
            <ListItem
              key={field.toString()}
              className="pl-5 h-16"
              disablePadding
              onClick={() => navigate(navigateEndPoint)}
            >
              <ListItemButton className={listbuttonCss}>
                <ListItemIcon>
                  <IconComponent className={listSvgCss} />
                </ListItemIcon>
                <ListItemText className={listTextCss} primary={field} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
