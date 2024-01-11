import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";

import { AuthContext } from "@context/AuthContext";
import Navbar from "@components/Navbar";
import Sidebar from "@components/Sidebar";
import Loader from "@src/components/Loader";

import { ADMIN, ADMIN_SIDEBAR, STUDENT_SIDEBAR } from "@constant/index";

const DashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const authContext = useContext(AuthContext);

  if (authContext.isLoading) return <Loader />;
  const {
    user: { role },
  } = authContext;
  const sidebarFields = role === ADMIN ? ADMIN_SIDEBAR : STUDENT_SIDEBAR;

  const toogleSideBar = (): void => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <Box className="flex h-full lg:h-screen w-screen">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        sidebarFields={sidebarFields}
        toogleSideBar={toogleSideBar}
      />
      <Box className="relative  w-full h-full md:h-screen flex flex-col">
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
