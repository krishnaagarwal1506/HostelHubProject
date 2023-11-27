import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Skeleton } from "@mui/material";

import DashboardDetail from "./DashboardDetail";
import NoticeList from "@src/pages/Admin/notice/NoticeList";
import StaffTable from "./StaffTable";
import Chart from "@components/Chart";
import {
  ChartWrapperOptions,
  GoogleChartWrapper,
  ReactGoogleChartProps,
} from "react-google-charts";

import {
  getAdminDashboardDetails,
  getNotices,
  getRoomStatusData,
  getComplaintsStats,
} from "@utils/index";
import {
  AdminDashboardDataTypes,
  NoticeDataType,
  graphDataType,
} from "@ts/types";
import { ADMIN_DASHBOARD_DETAIL } from "@constant/index";
import colors from "@src/themes/colors";

const pieChartOption: ChartWrapperOptions["options"] = {
  legend: {
    position: "bottom",
    textStyle: {
      fontName: "Lato",
      fontSize: 14,
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
  fontSize: 14,
  animation: {
    startup: true,
    easing: "out",
    duration: 1500,
  },
};

const lineChartOptions: ChartWrapperOptions["options"] = {
  curveType: "function",
  legend: { position: "bottom" },
  chartArea: { top: 30, width: "75%", height: "75%" },
  fontSize: 14,
  colors: [colors.success.main, colors.error.main],
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
  const [notices, setNotices] = useState<NoticeDataType[] | null>(null);
  const [updateNoticeCheck, setupdateNoticeCheck] = useState<boolean>(false);
  const [roomStatusData, setRoomStatusData] = useState<graphDataType | null>(
    null
  );
  const [complaintsStats, setCompliaintsStats] = useState<graphDataType | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    const getDashboardDetails = async (): Promise<void> => {
      try {
        const data = await getAdminDashboardDetails();
        setDashboardData(data);
      } catch (error) {
        console.log(error);
      }
    };

    const getRoomStatusDataForChart = async (): Promise<void> => {
      try {
        const reponse = await getRoomStatusData();
        setRoomStatusData(reponse);
      } catch (error) {
        console.log(error);
      }
    };
    const getComplaintsData = async (): Promise<void> => {
      try {
        const reponse = await getComplaintsStats();
        setCompliaintsStats(reponse);
      } catch (error) {
        console.log(error);
      }
    };
    getComplaintsData();
    getDashboardDetails();

    getRoomStatusDataForChart();
  }, []);
  useEffect(() => {
    const getNoticesData = async (): Promise<void> => {
      try {
        const reponse = await getNotices();
        setNotices(reponse);
      } catch (error) {
        console.log(error);
      }
    };
    getNoticesData();
  }, [updateNoticeCheck]);

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
      <Box className="gap-4 mt-4  flex-grow flex-wrap h-screen flex justify-around lg:flex-nowrap xl:gap-8 md:min-h-[66%] lg:min-h-[75%]  xl:mt-8">
        <NoticeList
          notices={notices}
          setupdateNoticeCheck={setupdateNoticeCheck}
        />
        <Paper className="dashboard-paper">
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
        </Paper>
      </Box>
      <Box className="gap-4 mt-4 py-4 flex-grow flex-wrap h-screen flex justify-around lg:py-0 lg:flex-nowrap xl:gap-8 md:min-h-[66%] lg:min-h-[75%]  xl:mt-8">
        <StaffTable />
        <Paper className="dashboard-paper">
          <Typography className="mx-8 mt-4 mb-0 text-2xl font-medium self-start">
            Complaints Statistics
          </Typography>
          <Chart
            data={complaintsStats}
            graphType="LineChart"
            options={lineChartOptions}
            className="m-auto ml-8"
            Skeleton={LineChartSkeleton}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminHome;
