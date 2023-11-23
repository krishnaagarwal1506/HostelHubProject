import { useState } from "react";
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

import { SETTINGS } from "@constant/index";

type navbarPropsTypes = {
  toogleSideBar: () => void;
};

const Navbar = ({ toogleSideBar }: navbarPropsTypes) => {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
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
      <Toolbar className="h-20">
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
        <Typography className="grow font-extrabold text-3xl" variant="h5">
          DashBoard
        </Typography>
        <Box className="grow-0">
          <Tooltip title="Open settings">
            <IconButton className="p-0" onClick={handleOpenUserMenu}>
              <Avatar className="bg-primary-main" alt="Profile Logo" />
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
            onClose={handleCloseUserMenu}
          >
            {SETTINGS.map((setting: string) => (
              <MenuItem key={setting}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </Box>
  );
};

export default Navbar;
