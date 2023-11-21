import { useContext } from "react";
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

import { AuthContext } from "@context/AuthContext";
import { SidebarValueType } from "@ts/types";

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
  const authContext = useContext(AuthContext);

  if (authContext === null) return null;
  const { user } = authContext;

  return (
    <Box
      className={`fixed w-60 z-10 lg:z-0 h-screen bg-primary-main lg:static overflow-hidden lg:block  ${
        isSidebarOpen ? "lg:w-1/4" : "lg:w-24 hidden"
      } `}
    >
      <Box className="flex justify-center gap-x-2.5 pt-5">
        <img className="w-10 h-10" src={logo} alt="logo" />
        <Typography
          className={`hidden text-white ${
            isSidebarOpen ? "lg:block " : "lg:hidden"
          }`}
          variant="h4"
        >
          HostelHub
        </Typography>
      </Box>
      <List className="flex flex-col mt-4">
        {sidebarFields.map((value) => (
          <ListItem
            key={value.field.toString()}
            className="pl-5 h-16"
            disablePadding
            onClick={() => {
              navigate(`/${user.role}/${value.path}`);
            }}
          >
            <ListItemButton
              className={`${
                value.path === locationPath
                  ? "bg-background-default rounded-l-2xl"
                  : "bg-primary-main"
              } `}
            >
              <ListItemIcon>
                <value.icon
                  className={`${
                    value.path === locationPath
                      ? "fill-primary-main"
                      : "fill-white"
                  }`}
                />
              </ListItemIcon>
              <ListItemText
                className={`${
                  value.path === locationPath
                    ? "text-primary-main"
                    : "text-white"
                } `}
                primary={value.field}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
