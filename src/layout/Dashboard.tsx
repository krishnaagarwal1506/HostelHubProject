import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import { AuthContext } from "@context/AuthContext";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";

import { ADMIN_SIDEBAR, STUDENT_SIDEBAR, ADMIN_ROLE } from "@constant/index";

const DashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const authContext = useContext(AuthContext);

  const toogleSideBar = (): void => setIsSidebarOpen(!isSidebarOpen);

  if (authContext === null) return null;

  const { user } = authContext;
  const sidebarFields =
    user.role === ADMIN_ROLE ? ADMIN_SIDEBAR : STUDENT_SIDEBAR;

  return (
    <Box className="flex h-full lg:h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} sidebarFields={sidebarFields} />
      <Box className="relative w-full h-full md:h-screen flex flex-col">
        <Navbar toogleSideBar={toogleSideBar} />
        <Outlet />
        <Box
          className={`lg:hidden absolute top-0 h-full w-full backdrop-blur-sm ${
            !isSidebarOpen && "hidden"
          }`}
          onClick={toogleSideBar}
        />
      </Box>
    </Box>
  );
};

export default DashBoard;
