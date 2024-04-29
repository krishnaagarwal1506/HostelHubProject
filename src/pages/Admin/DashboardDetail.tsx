import { useNavigate } from "react-router-dom";
import { Box, Skeleton, Paper, Typography } from "@mui/material";

import {
  AdminDashboardDataTypes,
  AdminDashboardDetailsTypes,
} from "@src/ts/types";
import ErrorBoundary from "@src/components/ErrorBoundry";
import ErrorComponent from "@src/components/ErrorComponent";

type DashboardDataErrorHandling = {
  [key in keyof AdminDashboardDataTypes]: {
    isError: boolean;
    refetch: () => void;
  };
};

type DashboardPropsTypes = {
  dashboardData: AdminDashboardDataTypes | null;
  detail: AdminDashboardDetailsTypes;
  dashboardDataErrorhandling: DashboardDataErrorHandling;
};

const DashboardDetail = ({
  dashboardData,
  detail,
  dashboardDataErrorhandling,
}: DashboardPropsTypes) => {
  const naviate = useNavigate();
  const { label, field, icon: IconComponent, color, path } = detail;
  const clickableClass = path ? "cursor-pointer hover:brightness-90" : "";
  const fieldValue = dashboardData
    ? dashboardData[field as keyof AdminDashboardDataTypes]?.toString()
    : null;
  return (
    <ErrorBoundary
      error={
        dashboardDataErrorhandling[field as keyof AdminDashboardDataTypes]
          .isError
      }
      ErrorComponent={
        <ErrorComponent
          className="w-2/5 px-4 md:w-[48%] lg:w-1/4 h-24 lg:h-32 flex-grow md:shrink-0 lg:shrink"
          boxClassName="h-40"
          onSubmit={
            dashboardDataErrorhandling[field as keyof AdminDashboardDataTypes]
              .refetch
          }
          message={`Error in fetching ${label}`}
        />
      }
    >
      <Paper
        onClick={() => naviate(path)}
        key={label}
        className={`w-2/5 px-4 md:w-[48%] lg:w-1/4 h-24 lg:h-32 flex flex-grow md:shrink-0 lg:shrink justify-between items-center rounded-xl ${clickableClass} ${color} `}
      >
        {fieldValue ? (
          <>
            <IconComponent className="text-4xl md:text-5xl xl:text-7xl px-0 text-white" />
            <Box className="h-4/5 flex flex-col items-end justify-evenly">
              <Typography className="md:text-xl lg:text-2xl font-semibold  text-white">
                {label}
              </Typography>
              <Typography className=" text-2xl lg:text-3xl font-semibold text-white">
                {fieldValue}
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Skeleton width="20%" height="50%" variant="rounded" />
            <Box className="w-3/5 h-full flex flex-col justify-center">
              <Skeleton width="90%" height="30%" />
              <Skeleton width="90%" height="30%" />
            </Box>
          </>
        )}
      </Paper>
    </ErrorBoundary>
  );
};

export default DashboardDetail;
