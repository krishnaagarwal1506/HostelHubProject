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
import AppLogo from "@src/svg/AppLogo";

type sidebarPropType = {
  isSidebarOpen: boolean;
  sidebarFields: SidebarValueType[];
  toogleSideBar: () => void;
};

const Sidebar = ({
  isSidebarOpen,
  sidebarFields,
  toogleSideBar,
}: sidebarPropType) => {
  const location = useLocation();
  const locationPath: string = location.pathname.slice(
    location.pathname.lastIndexOf("/") + 1
  );
  const navigate = useNavigate();
  const sidebarboxCss = isSidebarOpen
    ? "lg:min-w-[200px] lg:w-1/4"
    : "lg:w-24 hidden";
  const logoHeadingCss = isSidebarOpen ? "lg:block " : "lg:hidden";

  return (
    <Box
      className={`fixed w-60 z-10 lg:z-0 h-screen bg-primary-main lg:static overflow-hidden animate-slidein lg:block lg:transition-all ${sidebarboxCss}`}
      data-testid="sidebar"
    >
      <Box className="flex justify-center items-center gap-x-2.5 pt-3">
        <AppLogo className="w-14 h-14" fill="#fff" />
        <Typography
          className={`hidden text-white ${logoHeadingCss}`}
          variant="h4"
        >
          HostelHub
        </Typography>
      </Box>
      <List className="flex flex-col mt-4">
        {sidebarFields.map(({ path, field, icon }: SidebarValueType) => {
          const isCurrentPage = path === locationPath;
          const listbuttonCss = isCurrentPage
            ? "bg-background-default rounded-l-2xl"
            : "bg-primary-main";
          const listSvgCss = isCurrentPage ? "fill-primary-main" : "fill-white";
          const listTextCss = isCurrentPage
            ? "text-primary-main"
            : "text-white";
          const IconComponent = icon;
          const navigateEndPoint =
            path === DASHBOARD_ENDPOINT ? "" : `/${DASHBOARD_ENDPOINT}/${path}`;

          return (
            <ListItem
              key={field.toString()}
              className="pl-5 h-16"
              disablePadding
              onClick={() => {
                if (window.innerWidth < 1024) {
                  toogleSideBar();
                }
                navigate(navigateEndPoint);
              }}
            >
              <ListItemButton
                className={`h-14 ${listbuttonCss} transition-transform`}
              >
                <ListItemIcon>
                  <IconComponent className={listSvgCss} />
                </ListItemIcon>
                <ListItemText className={listTextCss} primary={field} />
              </ListItemButton>

              <Box
                className={`before:content-[''] before:bg-primary-main before:rounded-br-full before:absolute before:top-0 before:right-0 before:w-4 before:h-4 absolute right-0 -top-3 w-4 h-4  bg-background-default ${
                  isCurrentPage ? "z-50" : "hidden"
                }`}
              ></Box>
              <Box
                className={`before:content-[''] before:bg-primary-main before:rounded-tr-full before:absolute before:top-0 before:right-0 before:w-4 before:h-4 absolute right-0 -bottom-3 w-4 h-4  bg-background-default ${
                  isCurrentPage ? "z-50" : "hidden"
                }`}
              ></Box>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;
