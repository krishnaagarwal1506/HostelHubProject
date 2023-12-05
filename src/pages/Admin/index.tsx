import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Skeleton } from "@mui/material";
import {
  ChartWrapperOptions,
  GoogleChartWrapper,
  ReactGoogleChartProps,
} from "react-google-charts";

import Chart from "@components/Chart";
import ErrorComponent from "@components/ErrorComponent";
import ErrorBoundary from "@components/ErrorBoundry";
import DashboardDetail from "./DashboardDetail";
import NoticeList from "./notice/NoticeList";
import StaffTable from "./StaffTable";

import { fetchData } from "@utils/index";
import {
  AdminDashboardDataTypes,
  NoticeDataType,
  graphDataType,
  StaffMembersType,
  ErrorType,
} from "@ts/types";
import {
  ADMIN_DASHBOARD_DETAIL,
  ADMIN_DASHBOARD_DETAIL_URL,
  COMPLAINTS_STATS_URL,
  NOTICES_URL,
  ROOM_STATUS_DATA_URL,
  STAFF_LIST_URL,
} from "@constant/index";
import colors from "@src/themes/colors";

const pieChartOption: ChartWrapperOptions["options"] = {
  legend: {
    position: "bottom",
    textStyle: {
      fontName: "Lato",
      fontSize: 12,
      bold: false,
    },
    animation: {
      startup: true,
      easing: "out",
      duration: 1500,
    },
  },
  colors: [
    colors.success.light,
    colors.warning.main,
    colors.error.light,
    colors.common.lightGray,
  ],
  chartArea: { top: 20, width: "70%", height: "70%" },
  fontSize: 12,
  animation: {
    startup: true,
    easing: "out",
    duration: 1500,
  },
};

const lineChartOptions: ChartWrapperOptions["options"] = {
  curveType: "function",
  legend: { position: "bottom" },
  chartArea: { top: 30, width: "80%", height: "80%" },
  fontSize: 14,
  colors: [colors.error.main, colors.success.main],
  hAxis: {
    title: "Year",
  },
  vAxis: {
    title: "Complaints",
  },
  animation: {
    startup: true,
    easing: "out",
    duration: 1500,
  },
};

const PieChartSkeleton = () => {
  return (
    <>
      <Skeleton
        className="scale-100 mt-6"
        variant="circular"
        height={300}
        width={300}
      />
      <Box className="flex gap-2 mt-4">
        {[1, 2, 3].map((index: number) => {
          return (
            <Box key={index} className="mr-1">
              <Skeleton variant="circular" height={20} width={20} />
              <Skeleton height={20} width={70} />
            </Box>
          );
        })}
      </Box>
    </>
  );
};

const LineChartSkeleton = () => {
  return (
    <Skeleton
      className="scale-100 mt-6"
      variant="rounded"
      height="80%"
      width="90%"
    />
  );
};

const AdminHome = () => {
  const [dashboardData, setDashboardData] =
    useState<AdminDashboardDataTypes | null>(null);
  const [dashboardDataError, setDashboardDataError] = useState<ErrorType>({
    isError: false,
    message: "",
  });
  const [notices, setNotices] = useState<NoticeDataType[] | null>(null);
  const [noticeError, setNoticeError] = useState<ErrorType>({
    isError: false,
    message: "",
  });
  const [updateNoticeCheck, setupdateNoticeCheck] = useState<boolean>(false);
  const [roomStatusData, setRoomStatusData] = useState<graphDataType | null>(
    null
  );
  const [roomStatusDataError, setRoomStatusDataError] = useState<ErrorType>({
    isError: false,
    message: "",
  });
  const [complaintsStats, setCompliaintsStats] = useState<graphDataType | null>(
    null
  );
  const [complaintsStatsError, setCompliaintsStatsError] = useState<ErrorType>({
    isError: false,
    message: "",
  });
  const [staffList, setStaffList] = useState<StaffMembersType[] | null>(null);
  const [staffListError, setStaffListError] = useState<ErrorType>({
    isError: false,
    message: "",
  });

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const navigate = useNavigate();

  useEffect(() => {
    getComplaintsData();
    getDashboardDetails();
    getRoomStatusDataForChart();
  }, []);
  useEffect(() => {
    getNoticesData();
  }, [updateNoticeCheck]);

  const getDashboardDetails = async (): Promise<void> => {
    try {
      const data = await fetchData(ADMIN_DASHBOARD_DETAIL_URL);
      setDashboardData(data);
      setDashboardDataError({ isError: false, message: "" });
    } catch (error) {
      setDashboardDataError({ isError: true, message: error as string });
    }
  };

  const getRoomStatusDataForChart = async (): Promise<void> => {
    try {
      const response = await fetchData(ROOM_STATUS_DATA_URL);
      setRoomStatusData(response);
      setRoomStatusDataError({ isError: false, message: "" });
    } catch (error) {
      setRoomStatusDataError({ isError: true, message: error as string });
    }
  };
  const getComplaintsData = async (): Promise<void> => {
    try {
      const response = await fetchData(COMPLAINTS_STATS_URL);
      setCompliaintsStats(response);
      setCompliaintsStatsError({ isError: false, message: "" });
    } catch (error) {
      setCompliaintsStatsError({ isError: true, message: error as string });
    }
  };
  const getNoticesData = async (): Promise<void> => {
    try {
      const response = await fetchData(NOTICES_URL);
      setNotices(response);
      setNoticeError({ isError: false, message: "" });
    } catch (error) {
      setNoticeError({ isError: true, message: error as string });
    }
  };

  const getStaffListData = async (
    pagination: boolean,
    page?: number
  ): Promise<void> => {
    try {
      const response = await fetchData(STAFF_LIST_URL);
      if (!pagination) setStaffList(response);
      else {
        const start = page! * 10;
        const end = start + 10;
        setStaffList(response.slice(start, end));
      }
      setStaffListError({ isError: false, message: "" });
    } catch (error) {
      setStaffListError({ isError: true, message: error as string });
    }
  };

  const handleChartSelect = (chartWrapper: GoogleChartWrapper) => {
    const chart = chartWrapper.getChart();
    const selection = chart.getSelection();

    if (selection.length > 0) {
      const selectedRow = selection[0].row;
      const seletedTable = chartWrapper.getDataTable();
      if (!seletedTable) return null;
      const selectedLabel = seletedTable.getValue(selectedRow, 0);
      navigate(`/rooms?area=${selectedLabel}`);
    }
  };
  const chartEvents: ReactGoogleChartProps["chartEvents"] = [
    {
      eventName: "select",
      callback: ({ chartWrapper }: { chartWrapper: GoogleChartWrapper }) =>
        handleChartSelect(chartWrapper),
    },
  ];

  return (
    <Box className="p-4 w-full xl:p-8 flex flex-col  min-h-20 flex-grow-0 md:flex-grow md:min-h-1/2 overflow-scroll">
      <ErrorBoundary
        error={dashboardDataError.isError}
        ErrorComponent={
          <ErrorComponent
            className="w-full"
            boxClassName="h-40"
            onSubmit={getDashboardDetails}
            message="Error in fetching data"
          />
        }
      >
        <Box className="gap-4 flex-wrap flex w-full lg:flex-nowrap justify-center lg:justify-around xl:gap-8">
          {ADMIN_DASHBOARD_DETAIL.map((value) => {
            return (
              <DashboardDetail
                key={value.label}
                dashboardData={dashboardData}
                detail={value}
              />
            );
          })}
        </Box>
      </ErrorBoundary>

      <Box className="gap-4 mt-4  flex-grow flex-wrap h-screen flex justify-around lg:flex-nowrap xl:gap-8 md:min-h-[66%] lg:min-h-[75%]  xl:mt-8">
        <ErrorBoundary
          error={noticeError.isError}
          ErrorComponent={
            <Paper className="dashboard-paper ">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={() => getNoticesData()}
                message="Error in fetching data"
              />
            </Paper>
          }
        >
          <NoticeList
            notices={notices}
            setupdateNoticeCheck={setupdateNoticeCheck}
          />
        </ErrorBoundary>
        <Paper className="dashboard-paper ">
          <ErrorBoundary
            error={roomStatusDataError.isError}
            ErrorComponent={
              <ErrorComponent
                className="w-full h-full"
                onSubmit={getRoomStatusDataForChart}
                message="Error in fetching data"
              />
            }
          >
            <Typography className="mx-8 mt-4 mb-0 text-2xl font-medium self-start">
              Rooms Status
            </Typography>
            <Chart
              data={roomStatusData}
              graphType="PieChart"
              options={pieChartOption}
              className="m-auto"
              Skeleton={PieChartSkeleton}
              chartEvents={chartEvents}
            />
          </ErrorBoundary>
        </Paper>
      </Box>
      <Box className="gap-4 mt-4 py-4 flex-grow flex-wrap h-screen flex justify-around lg:py-0 lg:flex-nowrap xl:gap-8 md:min-h-[66%] lg:min-h-[75%]  xl:mt-8">
        <ErrorBoundary
          error={staffListError.isError}
          ErrorComponent={
            <Paper className="dashboard-paper ">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={() => getStaffListData(false)}
                message="Error in fetching data"
              />
            </Paper>
          }
        >
          <StaffTable
            staffList={staffList}
            getData={getStaffListData}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
          />
        </ErrorBoundary>
        <Paper className="dashboard-paper ">
          <ErrorBoundary
            error={complaintsStatsError.isError}
            ErrorComponent={
              <ErrorComponent
                className="w-full h-full"
                onSubmit={getComplaintsData}
                message="Error in fetching data"
              />
            }
          >
            <Typography className="mx-8 mt-4 mb-0 text-2xl font-medium self-start">
              Complaints Statistics
            </Typography>
            <Chart
              data={complaintsStats}
              graphType="LineChart"
              options={lineChartOptions}
              className="m-auto mr-4"
              Skeleton={LineChartSkeleton}
            />
          </ErrorBoundary>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminHome;
