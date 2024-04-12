import { Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import cx from "classnames";
import { DASHBOARD_ENDPOINT } from "@src/constant";
import { SidebarValueType } from "@ts/types";

interface DownNavbar {
  sidebarFields: SidebarValueType[];
}

const MobileNavbar = ({ sidebarFields }: DownNavbar) => {
  const location = useLocation();
  const locationPath: string = location.pathname.slice(
    location.pathname.lastIndexOf("/") + 1
  );
  return (
    <Box className="fixed bottom-0 w-full flex justify-around items-center h-16 bg-primary-main rounded-t-xl md:hidden">
      {sidebarFields.map(({ field, icon: Icon, path }) => {
        const isCurrentPage = path === locationPath;
        const navigateEndPoint =
          path === DASHBOARD_ENDPOINT ? "" : `/${DASHBOARD_ENDPOINT}/${path}`;
        const listSvgCss = isCurrentPage ? "fill-primary-main" : "fill-white";
        const listLinkCss = +isCurrentPage ? "bg-white" : "bg-primary";
        return (
          <Link
            to={navigateEndPoint}
            className={cx(listLinkCss, "p-1 rounded-md")}
            key={field}
          >
            <Icon key={field} className={listSvgCss} />
          </Link>
        );
      })}
    </Box>
  );
};

export default MobileNavbar;
