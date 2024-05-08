import AlertComponent from "@components/Alert";
import Chart from "@components/Chart";
import ErrorBoundary from "@components/ErrorBoundry";
import ErrorComponent from "@components/ErrorComponent";
import {
  ADMIN_DASHBOARD_DETAIL,
  APPLICATIONS_URL,
  COMPLAINTS_STATS_URL,
  COMPLAINTS_URL,
  DEFAULT_ERROR_MESSAGE,
  ERROR,
  GYM_LIST_URL,
  NOTICES_URL,
  ROOM_STATUS_DATA_URL,
  STUDENT_INFO_URL,
} from "@constant/index";
import { Box, Paper, Skeleton, Typography } from "@mui/material";
import useAlert from "@src/hooks/useAlert";
import {
  useFetchApplicationListData,
  useFetchComplaintListData,
  useFetchComplaintStatusGraphChart,
  useFetchGymListData,
  useFetchNoticeData,
  useFetchRoomStatusGraphChart,
  useFetchStudentListData,
} from "@src/queryHooks/query";
import colors from "@src/themes/colors";
import {
  GymMembersType,
  NoticeDataType,
  fetchGymListData,
  fetchNoticeData,
} from "@ts/types";
import {
  catchErrorMessage,
  dateFormat,
  extractArrayFromApiData,
} from "@utils/index";
import { useEffect, useState } from "react";
import { ChartWrapperOptions } from "react-google-charts";
import DashboardDetail from "./DashboardDetail";
import NoticeList from "./notice/NoticeList";
import StaffTable from "./StaffTable";

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
  const [gymList, setGymList] = useState<GymMembersType[] | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const { alert, handleAlert } = useAlert();
  const { isOpen, message, severity } = alert;

  const {
    data: studenInfo,
    isError: studentInfoError,
    refetch: studentInfoRefetch,
    error: studentInfoErrorMessage,
  } = useFetchStudentListData(
    `${STUDENT_INFO_URL}?populate=*&sort=id:desc&pagination[page]=1&pagination[pageSize]=10`
  );

  const {
    data: complaintsData,
    isError: comoplaintDataError,
    refetch: complaintDataRefetch,
    error: complaintDataErrorMessage,
  } = useFetchComplaintListData(
    `${COMPLAINTS_URL}?sort=createdAt:desc&filters[status][$eq]=pending&populate=*&pagination[page]=1&pagination[pageSize]=10`
  );

  const {
    data: applicationsData,
    isError: applicationDataError,
    refetch: applicationDataRefetch,
    error: applicationDataErrorMessage,
  } = useFetchApplicationListData(
    `${APPLICATIONS_URL}?sort=createdAt:desc&filters[status][$eq]=pending&populate=*&pagination[page]=1&pagination[pageSize]=10`
  );

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
    data: gymListData,
    isError: gymListError,
    refetch: refetchStaffListData,
    error: gymListDataErrorMessage,
  } = useFetchGymListData(GYM_LIST_URL);

  const errors = [
    {
      error: roomStatusGraphDataError,
      message: roomStatusGraphDataErrorMessage,
    },
    { error: complaintGraphDataError, message: complaintGraphDataErrorMessage },
    { error: noticeDataError, message: noticeDataErrorMessage },
    { error: gymListError, message: gymListDataErrorMessage },
    { error: studentInfoError, message: studentInfoErrorMessage },
    { error: comoplaintDataError, message: complaintDataErrorMessage },
    { error: applicationDataError, message: applicationDataErrorMessage },
  ];

  useEffect(() => {
    errors.forEach(({ error, message }) => {
      if (error)
        handleAlert(
          true,
          catchErrorMessage(message) || DEFAULT_ERROR_MESSAGE,
          ERROR
        );
    });
  }, [
    roomStatusGraphDataError,
    complaintGraphDataError,
    noticeDataError,
    gymListError,
    studentInfoError,
    comoplaintDataError,
    applicationDataError,
  ]);

  useEffect(() => {
    if (noticeData) {
      getNoticesData(noticeData);
    }
  }, [noticeData]);

  useEffect(() => {
    if (gymListData) {
      getGymListData(gymListData);
    }
  }, [gymListData]);

  const dashboardDetailData = {
    complaitsPending: complaintsData
      ? complaintsData.meta.pagination.total
      : undefined,
    applicationPending: applicationsData
      ? applicationsData.meta.pagination.total
      : undefined,
    numberOfStudents: studenInfo ? studenInfo.meta.pagination.total : undefined,
    numberOfStaff: 15,
  };

  const dashboardDataErrorhandling = {
    numberOfStudents: {
      isError: studentInfoError,
      refetch: studentInfoRefetch,
    },
    complaitsPending: {
      isError: comoplaintDataError,
      refetch: complaintDataRefetch,
    },
    applicationPending: {
      isError: applicationDataError,
      refetch: applicationDataRefetch,
    },
    numberOfStaff: {
      isError: false,
      refetch: () => {},
    },
  };

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

  const getGymListData = (gymListData: fetchGymListData) => {
    const data = extractArrayFromApiData<GymMembersType>(gymListData.data);
    setGymList(data);
  };

  return (
    <Box className="p-4 w-full xl:p-8 flex flex-col  min-h-20 flex-grow-0 md:flex-grow md:min-h-1/2 overflow-scroll">
      <Box className="gap-4 flex-wrap flex w-full lg:flex-nowrap justify-center lg:justify-around xl:gap-8">
        {ADMIN_DASHBOARD_DETAIL.map((value) => {
          return (
            <DashboardDetail
              key={value.label}
              dashboardData={dashboardDetailData || null}
              detail={value}
              dashboardDataErrorhandling={dashboardDataErrorhandling}
            />
          );
        })}
      </Box>
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
          error={gymListError}
          ErrorComponent={
            <Paper className="dashboard-paper ">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={refetchStaffListData}
                message="Error in fetching data"
                heading=" Members"
                headingClassName="mx-8 mt-4"
              />
            </Paper>
          }
        >
          <StaffTable
            GymList={gymList}
            getData={refetchStaffListData}
            paginationModel={paginationModel}
            setPaginationModel={setPaginationModel}
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
