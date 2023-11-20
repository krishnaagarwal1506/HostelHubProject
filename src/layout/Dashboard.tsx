import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import { AuthContext } from "@context/AuthContext";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";

import { ADMIN_SIDEBAR, STUDENT_SIDEBAR } from "@constant/index";

const DashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const authContext = useContext(AuthContext);

  if (authContext === null) {
    return null;
  }
  const { user } = authContext;
  const sidebarFields = user.role === "admin" ? ADMIN_SIDEBAR : STUDENT_SIDEBAR;

  const toogleSideBar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box className="flex h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} sidebarFields={sidebarFields} />
      <Box className="relative w-full flex flex-col">
        <Navbar toogleSideBar={toogleSideBar} />
        <Outlet />
        <Box
          className={`lg:hidden absolute top-0 h-full w-full backdrop-blur-sm ${
            isSidebarOpen && "hidden"
          }`}
          onClick={toogleSideBar}
        ></Box>
      </Box>
    </Box>
  );
};

export default DashBoard;
