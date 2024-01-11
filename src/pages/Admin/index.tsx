import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Skeleton,
  SelectChangeEvent,
} from "@mui/material";
import { ChartWrapperOptions } from "react-google-charts";
import AlertComponent from "@components/Alert";
import Chart from "@components/Chart";
import ErrorComponent from "@components/ErrorComponent";
import ErrorBoundary from "@components/ErrorBoundry";
import DashboardDetail from "./DashboardDetail";
import NoticeList from "./notice/NoticeList";
import StaffTable from "./StaffTable";
import useAlert from "@src/hooks/useAlert";
import {
  fetchData,
  dateFormat,
  extractArrayFromApiData,
  catchErrorMessage,
} from "@utils/index";
import {
  AdminDashboardDataTypes,
  NoticeDataType,
  graphDataType,
  StaffMembersType,
  ErrorType,
  SeverityType,
  StaffStatusType,
} from "@ts/types";
import {
  ADMIN_DASHBOARD_DETAIL,
  ADMIN_DASHBOARD_DETAIL_URL,
  COMPLAINTS_STATS_URL,
  NOTICES_URL,
  ROOM_STATUS_DATA_URL,
  STAFF_LIST_URL,
  ERROR,
} from "@constant/index";
import colors from "@src/themes/colors";

const pieChartLegend = [
  { label: "Empty", color: colors.success.light },
  { label: "Partially Filled", color: colors.warning.main },
  { label: "Filled", color: colors.error.light },
  { label: "Not Available", color: colors.common.lightGray },
];

const pieChartOption: ChartWrapperOptions["options"] = {
  legend: {
    position: "none",
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
      <Box className="flex gap-8 justify-evenly mt-4">
        {[1, 2, 3, 4].map((index: number) => {
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

async function fetchDataAndUpdateState<T>(
  url: string,
  attribute: string,
  setData: React.Dispatch<React.SetStateAction<T>>,
  setError: React.Dispatch<
    React.SetStateAction<{ isError: boolean; message: string }>
  >,
  handleAlert: (
    isOpen?: boolean,
    message?: string,
    severity?: SeverityType
  ) => void
): Promise<void> {
  try {
    const response = await fetchData(url);
    const data = response.data.attributes[attribute];
    setData(data);
    setError({ isError: false, message: "" });
  } catch (error) {
    setError({ isError: true, message: error as string });
    handleAlert(true, catchErrorMessage(error), ERROR);
  }
}

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
  const { alert, handleAlert } = useAlert();
  const { isOpen, message, severity } = alert;

  useEffect(() => {
    getComplaintsData();
    getDashboardDetails();
    getRoomStatusDataForChart();
  }, []);

  useEffect(() => {
    getNoticesData();
  }, [updateNoticeCheck]);

  const getDashboardDetails = (): Promise<void> => {
    return fetchDataAndUpdateState<AdminDashboardDataTypes | null>(
      ADMIN_DASHBOARD_DETAIL_URL,
      "details",
      setDashboardData,
      setDashboardDataError,
      handleAlert
    );
  };

  const getRoomStatusDataForChart = (): Promise<void> => {
    return fetchDataAndUpdateState<graphDataType | null>(
      ROOM_STATUS_DATA_URL,
      "graphData",
      setRoomStatusData,
      setRoomStatusDataError,
      handleAlert
    );
  };

  const getComplaintsData = (): Promise<void> => {
    return fetchDataAndUpdateState<graphDataType | null>(
      COMPLAINTS_STATS_URL,
      "graphData",
      setCompliaintsStats,
      setCompliaintsStatsError,
      handleAlert
    );
  };

  const getNoticesData = async (): Promise<void> => {
    try {
      const response = await fetchData(NOTICES_URL);
      const data = extractArrayFromApiData<NoticeDataType>(response.data);
      const formatedData = data.map((value: NoticeDataType) => {
        return {
          ...value,
          date: dateFormat(value.date),
        };
      });
      formatedData.sort(
        (a: NoticeDataType, b: NoticeDataType) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setNotices(formatedData);
      setNoticeError({ isError: false, message: "" });
    } catch (error) {
      setNoticeError({ isError: true, message: error as string });
      handleAlert(true, catchErrorMessage(error), ERROR);
    }
  };

  const getStaffListData = async (): Promise<void> => {
    try {
      const response = await fetchData(STAFF_LIST_URL);
      const data = extractArrayFromApiData<StaffMembersType>(response.data);
      setStaffList(data);
      setStaffListError({ isError: false, message: "" });
    } catch (error) {
      setStaffListError({ isError: true, message: error as string });
      handleAlert(true, catchErrorMessage(error), ERROR);
    }
  };

  const handleSaffListFilter = async (
    event: SelectChangeEvent<StaffStatusType>
  ) => {
    const filter = event.target.value;
    if (filter === "All") {
      getStaffListData();
      return;
    }
    const url = `${STAFF_LIST_URL}?filters[status][$eq]=${filter}`;
    try {
      const response = await fetchData(url);
      const data = extractArrayFromApiData<StaffMembersType>(response.data);
      setStaffList(data);
      setStaffListError({ isError: false, message: "" });
    } catch (error) {
      setStaffListError({ isError: true, message: error as string });
      handleAlert(true, catchErrorMessage(error), ERROR);
    }
  };

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
            <Paper className="dashboard-paper">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={getNoticesData}
                message="Error in fetching data"
                heading="Notices"
                headingClassName="mx-8 mt-4"
              />
            </Paper>
          }
        >
          <NoticeList
            notices={notices}
            setupdateNoticeCheck={setupdateNoticeCheck}
          />
        </ErrorBoundary>
        <Paper className="dashboard-paper relative">
          <ErrorBoundary
            error={roomStatusDataError.isError}
            ErrorComponent={
              <ErrorComponent
                className="w-full h-full"
                onSubmit={getRoomStatusDataForChart}
                message="Error in fetching data"
                heading="Rooms Status"
                headingClassName="mx-8 mt-4"
              />
            }
          >
            <Typography className="mx-8 mt-4 mb-0 text-xl md:text-2xl font-medium self-start ">
              Rooms Status
            </Typography>
            <Chart
              data={roomStatusData}
              graphType="PieChart"
              options={pieChartOption}
              className="m-auto"
              Skeleton={PieChartSkeleton}
            />
            {roomStatusData && (
              <Box className="w-[90%] px-8 flex justify-center gap-4 flex-wrap top-[80%] absolute">
                {pieChartLegend.map(({ label, color }) => {
                  return (
                    <Box key={label} className="flex gap-1">
                      <Box
                        sx={{ backgroundColor: color }}
                        className={`rounded-full w-4 h-4`}
                      />
                      <Typography className="text-xs">{label}</Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
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
                onSubmit={getStaffListData}
                message="Error in fetching data"
                heading="Staff Members"
                headingClassName="mx-8 mt-4"
              />
            </Paper>
          }
        >
          <StaffTable
            staffList={staffList}
            getData={getStaffListData}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            handleFilter={handleSaffListFilter}
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
                heading="Complaints Statistics"
                headingClassName="mx-8 mt-4"
              />
            }
          >
            <Typography className="mx-8 mt-4 mb-0 text-xl md:text-2xl font-medium self-start">
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
      {isOpen && (
        <AlertComponent
          message={message}
          severity={severity}
          handleClose={() => handleAlert(false)}
        />
      )}
    </Box>
  );
};

export default AdminHome;
