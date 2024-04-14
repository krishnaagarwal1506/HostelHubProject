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
  dateFormat,
  extractArrayFromApiData,
  catchErrorMessage,
} from "@utils/index";
import {
  NoticeDataType,
  StaffMembersType,
  StaffStatusType,
  fetchNoticeData,
  fetchStaffListData,
} from "@ts/types";
import {
  ADMIN_DASHBOARD_DETAIL,
  ADMIN_DASHBOARD_DETAIL_URL,
  COMPLAINTS_STATS_URL,
  NOTICES_URL,
  ROOM_STATUS_DATA_URL,
  STAFF_LIST_URL,
  ERROR,
  DEFAULT_ERROR_MESSAGE,
} from "@constant/index";
import colors from "@src/themes/colors";
import {
  useFetchAdminDashboardDetails,
  useFetchComplaintStatusGraphChart,
  useFetchNoticeData,
  useFetchRoomStatusGraphChart,
  useFetchStaffListData,
} from "@src/queryHooks/query";

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

const AdminHome = () => {
  const [notices, setNotices] = useState<NoticeDataType[] | null>(null);
  const [staffList, setStaffList] = useState<StaffMembersType[] | null>(null);
  const [staffListurl, setStaffListurl] = useState<string>(STAFF_LIST_URL);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const { alert, handleAlert } = useAlert();
  const { isOpen, message, severity } = alert;

  const {
    data: adminDashboardDetailData,
    isError: adminDashboardDetailDataError,
    refetch: refetchAdminDashboardDetailData,
    error: admindashboardError,
  } = useFetchAdminDashboardDetails(ADMIN_DASHBOARD_DETAIL_URL);

  const {
    data: roomStatusGraphData,
    isError: roomStatusGraphDataError,
    refetch: refetchRoomStatusGraphData,
    error: roomStatusGraphDataErrorMessage,
  } = useFetchRoomStatusGraphChart(ROOM_STATUS_DATA_URL);

  const {
    data: complaintGraphData,
    isError: complaintGraphDataError,
    refetch: refetchComplaintGraphData,
    error: complaintGraphDataErrorMessage,
  } = useFetchComplaintStatusGraphChart(COMPLAINTS_STATS_URL);

  const {
    data: noticeData,
    isError: noticeDataError,
    refetch: refetchNoticeData,
    error: noticeDataErrorMessage,
  } = useFetchNoticeData(NOTICES_URL);

  const {
    data: staffListData,
    isError: staffListError,
    refetch: refetchStaffListData,
    error: staffListDataErrorMessage,
  } = useFetchStaffListData(staffListurl);

  useEffect(() => {
    if (adminDashboardDetailDataError)
      handleAlert(
        true,
        catchErrorMessage(admindashboardError) || DEFAULT_ERROR_MESSAGE,
        ERROR
      );
  }, [adminDashboardDetailDataError]);

  useEffect(() => {
    if (roomStatusGraphDataError)
      handleAlert(
        true,
        catchErrorMessage(roomStatusGraphDataErrorMessage) ||
          DEFAULT_ERROR_MESSAGE,
        ERROR
      );
  }, [roomStatusGraphDataError]);

  useEffect(() => {
    if (complaintGraphDataError)
      handleAlert(
        true,
        catchErrorMessage(complaintGraphDataErrorMessage) ||
          DEFAULT_ERROR_MESSAGE,
        ERROR
      );
  }, [complaintGraphDataError]);

  useEffect(() => {
    if (noticeDataError)
      handleAlert(
        true,
        catchErrorMessage(noticeDataErrorMessage) || DEFAULT_ERROR_MESSAGE,
        ERROR
      );
  }, [noticeDataError]);

  useEffect(() => {
    if (staffListError)
      handleAlert(
        true,
        catchErrorMessage(staffListDataErrorMessage) || DEFAULT_ERROR_MESSAGE,
        ERROR
      );
  }, [staffListError]);

  useEffect(() => {
    if (noticeData) {
      getNoticesData(noticeData);
    }
  }, [noticeData]);

  useEffect(() => {
    if (staffListData) {
      getStaffListData(staffListData);
    }
  }, [staffListData]);

  const getNoticesData = (noticeData: fetchNoticeData) => {
    const data = extractArrayFromApiData<NoticeDataType>(noticeData.data);
    const formatedData = data.map((value: NoticeDataType) => {
      return {
        ...value,
        date: dateFormat(value.date),
      };
    });
    formatedData.sort(
      (a: NoticeDataType, b: NoticeDataType) =>
        new Date(b?.updatedAt || b.date).getTime() -
        new Date(a?.updatedAt || a.date).getTime()
    );
    setNotices(formatedData);
  };

  const getStaffListData = (staffListData: fetchStaffListData) => {
    const data = extractArrayFromApiData<StaffMembersType>(staffListData.data);
    setStaffList(data);
  };

  const handleSaffListFilter = async (
    event: SelectChangeEvent<StaffStatusType>
  ) => {
    const filter = event.target.value;
    if (filter === "All") {
      setStaffListurl(STAFF_LIST_URL);
      return;
    }
    const url = `${STAFF_LIST_URL}?filters[status][$eq]=${filter}`;
    setStaffListurl(url);
  };

  return (
    <Box className="p-4 w-full xl:p-8 flex flex-col  min-h-20 flex-grow-0 md:flex-grow md:min-h-1/2 overflow-scroll">
      <ErrorBoundary
        error={adminDashboardDetailDataError}
        ErrorComponent={
          <ErrorComponent
            className="w-full"
            boxClassName="h-40"
            onSubmit={refetchAdminDashboardDetailData}
            message="Error in fetching data"
          />
        }
      >
        <Box className="gap-4 flex-wrap flex w-full lg:flex-nowrap justify-center lg:justify-around xl:gap-8">
          {ADMIN_DASHBOARD_DETAIL.map((value) => {
            return (
              <DashboardDetail
                key={value.label}
                dashboardData={
                  adminDashboardDetailData?.data?.attributes["details"] || null
                }
                detail={value}
              />
            );
          })}
        </Box>
      </ErrorBoundary>
      <Box className="gap-4 mt-4  flex-grow flex-wrap h-screen flex justify-around lg:flex-nowrap xl:gap-8 md:min-h-[66%] lg:min-h-[75%]  xl:mt-8">
        <ErrorBoundary
          error={noticeDataError}
          ErrorComponent={
            <Paper className="dashboard-paper">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={refetchNoticeData}
                message="Error in fetching data"
                heading="Notices"
                headingClassName="mx-8 mt-4"
              />
            </Paper>
          }
        >
          <NoticeList notices={notices} />
        </ErrorBoundary>
        <Paper className="dashboard-paper relative">
          <ErrorBoundary
            error={roomStatusGraphDataError}
            ErrorComponent={
              <ErrorComponent
                className="w-full h-full"
                onSubmit={refetchRoomStatusGraphData}
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
              data={roomStatusGraphData?.data?.attributes["graphData"] || null}
              graphType="PieChart"
              options={pieChartOption}
              className="m-auto"
              Skeleton={PieChartSkeleton}
            />
            {roomStatusGraphData && (
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
          error={staffListError}
          ErrorComponent={
            <Paper className="dashboard-paper ">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={refetchStaffListData}
                message="Error in fetching data"
                heading="Staff Members"
                headingClassName="mx-8 mt-4"
              />
            </Paper>
          }
        >
          <StaffTable
            staffList={staffList}
            getData={refetchStaffListData}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
            handleFilter={handleSaffListFilter}
          />
        </ErrorBoundary>
        <Paper className="dashboard-paper ">
          <ErrorBoundary
            error={complaintGraphDataError}
            ErrorComponent={
              <ErrorComponent
                className="w-full h-full"
                onSubmit={refetchComplaintGraphData}
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
              data={complaintGraphData?.data?.attributes["graphData"] || null}
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
