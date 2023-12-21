import { useState, useContext } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Menu,
  Tooltip,
  Avatar,
  MenuItem,
  Toolbar,
  IconButton,
} from "@mui/material";
import SegmentIcon from "@mui/icons-material/Segment";
import { AuthContext } from "@src/context/AuthContext";

import {
  SETTINGS,
  NAVBAR_TITLE_ADMIN,
  NAVBAR_TITLE_STUDENT,
  ADMIN,
} from "@constant/index";

type navbarPropsTypes = {
  toogleSideBar: () => void;
};

const Navbar = ({ toogleSideBar }: navbarPropsTypes) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const {
    handleLogout,
    user: { role },
  } = useContext(AuthContext);
  const navBarTitle =
    role === ADMIN ? NAVBAR_TITLE_ADMIN : NAVBAR_TITLE_STUDENT;
  const locationPath: string = location.pathname.slice(
    location.pathname.lastIndexOf("/") + 1
  );

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCLose = () => {
    setAnchorElUser(null);
  };

  const positioning: {
    vertical: number | "top" | "center" | "bottom";
    horizontal: number | "center" | "right" | "left";
  } = {
    vertical: "top",
    horizontal: "right",
  };

  return (
    <Box className="h-20 bg-background-default" position="static">
      <Toolbar className="h-20 px-2.5 md:px-5 animate-slideDown">
        <IconButton
          className="mr-4"
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toogleSideBar}
        >
          <SegmentIcon className="text-3xl" />
        </IconButton>
        <Typography
          className="grow font-bold text-2xl md:text-3xl"
          variant="h5"
        >
          {navBarTitle[locationPath]}
        </Typography>
        <Box className="grow-0">
          <Tooltip title="Open settings">
            <IconButton className="p-0" onClick={handleOpen}>
              <Avatar
                className="bg-primary-main w-8 h-8 md:h-10 md:w-10"
                alt="Profile Logo"
              />
            </IconButton>
          </Tooltip>
          <Menu
            className="mt-11"
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={positioning}
            keepMounted
            transformOrigin={positioning}
            open={Boolean(anchorElUser)}
            onClose={handleCLose}
            sx={{
              "& .MuiMenu-paper": {
                top: "60px !important",
              },
            }}
          >
            {SETTINGS.map((setting: string) => (
              <MenuItem key={setting}>
                <Typography
                  onClick={() => {
                    handleLogout(true);
                  }}
                  textAlign="center"
                >
                  {setting}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </Box>
  );
};

export default Navbar;
