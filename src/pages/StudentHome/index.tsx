import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Paper, Skeleton } from "@mui/material";
import {
  GridColDef,
  GridColumnHeaderParams,
  GridAlignment,
} from "@mui/x-data-grid";
import NoticeList from "@pages/Admin/notice/NoticeList";
import ErrorBoundary from "@components/ErrorBoundry";
import ErrorComponent from "@components/ErrorComponent";
import TableComponent from "@components/Table";
import ChipComponent from "@components/Chip";

import { AuthContext } from "@src/context/AuthContext";

import { NoticeDataType, ApplicationsType } from "@ts/types";
import {
  fetchData,
  extractArrayFromApiData,
  dateFormat,
  catchErrorMessage,
} from "@utils/index";
import {
  NOTICES_URL,
  COMPLAINTS_URL,
  ROOM_INFO_URL,
  STUDENT_ROOM_DETAILS,
  ERROR,
  APPLICATIONS_URL,
} from "@constant/index";
import { ComplaintType } from "@ts/types";
import {
  useFetchApplicationListData,
  useFetchComplaintListData,
  useFetchNoticeData,
} from "@src/queryHooks/query";
import useAlert from "@src/hooks/useAlert";
import AlertComponent from "@src/components/Alert";

const StudentHome = () => {
  const [notices, setNotices] = useState<NoticeDataType[] | null>(null);

  const [complaintData, setComplaintData] = useState<ComplaintType[] | null>(
    null
  );
  const [applicationData, setApplicationData] = useState<
    ApplicationsType[] | null
  >(null);
  const [roomDetails, setRoomDetails] = useState<{
    wing: string;
    floor: string;
    room: string;
  } | null>(null);
  const [roomDetailsError, setRoomDetailsError] = useState<boolean>(false);
  const {
    user: { studentInfo },
  } = useContext(AuthContext);
  const { alert, handleAlert } = useAlert();
  const { isOpen, message, severity } = alert;

  const navigate = useNavigate();

  const {
    data: complaintApiData,
    isLoading: isLoadingComplaintData,
    isError: compaintDataError,
    error: complaintDataErrorMessage,
    refetch: complaintDataRefetch,
  } = useFetchComplaintListData(
    `${COMPLAINTS_URL}?populate=*&filters[student][id][$eq]=${studentInfo?.id}&sort=createdAt:desc`
  );

  const {
    data: applicationApiData,
    isLoading: isLoadingApplicationData,
    isError: applicationDataError,
    error: applicationDataErrorMessage,
    refetch: applicationDataRefetch,
  } = useFetchApplicationListData(
    `${APPLICATIONS_URL}?populate=*&filters[student][id][$eq]=${studentInfo?.id}&sort=createdAt:desc`
  );

  const {
    data: noticeData,
    isError: noticeDataError,
    error: noticeDataErrorMessage,
    refetch: noticeDataRefetch,
  } = useFetchNoticeData(NOTICES_URL);

  useEffect(() => {
    getRoomDetails();
  }, []);

  useEffect(() => {
    if (complaintApiData) {
      const data = extractArrayFromApiData<ComplaintType>(
        complaintApiData.data
      );
      setComplaintData(data);
    }
  }, [complaintApiData]);

  useEffect(() => {
    if (applicationApiData) {
      const data = extractArrayFromApiData<ApplicationsType>(
        applicationApiData.data
      );
      setApplicationData(data);
    }
  }, [applicationApiData]);

  useEffect(() => {
    if (noticeData) {
      const data = extractArrayFromApiData<NoticeDataType>(noticeData.data);
      setNotices(data);
    }
  }, [noticeData]);

  const errors = [
    { error: compaintDataError, errorMessage: complaintDataErrorMessage },
    { error: applicationDataError, errorMessage: applicationDataErrorMessage },
    { error: noticeDataError, errorMessage: noticeDataErrorMessage },
  ];

  useEffect(() => {
    errors.forEach(({ error, errorMessage }) => {
      if (error) {
        handleAlert(true, catchErrorMessage(errorMessage), ERROR);
      }
    });
  }, [compaintDataError, applicationDataError]);

  async function getRoomDetails(): Promise<void> {
    try {
      const response = await fetchData(ROOM_INFO_URL);
      setRoomDetails(response.data.attributes.data);
      setRoomDetailsError(false);
    } catch (error) {
      console.error(error);
      setRoomDetailsError(true);
    }
  }

  const commonOptions: {
    sortable: boolean;
    align: GridAlignment;
    headerAlign: GridAlignment;
    renderHeader: (params: GridColumnHeaderParams) => JSX.Element;
  } = {
    sortable: false,
    align: "center",
    headerAlign: "center",
    renderHeader({ colDef: { headerName } }: GridColumnHeaderParams) {
      return <Typography className="font-semibold">{headerName}</Typography>;
    },
  };

  const complaintTablecolumns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      minWidth: 100,
      headerClassName: "pl-8",
      cellClassName: "pl-8 hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 150,
      headerClassName: "pl-8",
      cellClassName: "pl-8 hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "type",
      headerName: "Type",
      minWidth: 170,
      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 170,
      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
      renderCell({ row }) {
        const { status } = row as ComplaintType;
        return (
          <ChipComponent
            className="w-20 capitalize"
            text={status}
            type={status}
          />
        );
      },
    },
  ];

  const applicationTableColumn: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      minWidth: 100,
      headerClassName: "pl-8",
      cellClassName: "pl-8 hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "createdAt",
      headerName: "Created at",
      minWidth: 150,
      headerClassName: "pl-8",
      cellClassName: "pl-8 hover:cursor-pointer",
      renderCell: ({ row }) => dateFormat(row.createdAt || ""),
      ...commonOptions,
    },
    {
      field: "subject",
      headerName: "Subject",
      minWidth: 170,
      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 170,
      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
      renderCell({ row }) {
        const { status } = row as ComplaintType;
        return (
          <ChipComponent
            className="w-20 capitalize"
            text={status}
            type={status}
          />
        );
      },
    },
  ];

  return (
    <Box className="p-4 w-full xl:p-8 flex flex-col min-h-20 flex-grow-0 md:flex-grow md:min-h-1/2 overflow-scroll">
      <Box className="flex-col gap-y-4 flex md:flex-row justify-around gap-x-6 md:gap-y-0 h-1/2 pb-4 md:pb-6">
        <ErrorBoundary
          error={roomDetailsError}
          ErrorComponent={
            <Paper className="dashboard-paper ">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={getRoomDetails}
                message="Error in fetching data"
                heading="Room information"
                headingClassName="text-xl md:text-2xl font-medium mx-8 my-4 mb-4"
              />
            </Paper>
          }
        >
          <Paper className="w-full pb-8 md:w-[48%] lg:w-1/2 px-0 h-1/2 md:h-full flex-grow overflow-hidden rounded-xl">
            <Typography className="mx-8 my-4 mb-2.5 text-xl md:text-2xl font-medium ">
              Room Information
            </Typography>
            <Box className="flex justify-evenly px-4 gap-2 md:gap-4 h-32 md:h-40 mt-12">
              {roomDetails ? (
                <>
                  {STUDENT_ROOM_DETAILS.map(({ name, Icon }) => {
                    return (
                      <Box
                        key={name}
                        className="flex-1 h-full flex flex-col gap-3 justify-center items-center rounded-xl bg-primary-light bg-opacity-10"
                      >
                        <Typography className="text-3xl md:text:4xl lg:text-5xl font-semibold">
                          {roomDetails[name as keyof typeof roomDetails]}
                        </Typography>
                        <Box className="flex gap-2 items-center">
                          <Icon
                            color="primary"
                            className="text-base md:text-2xl"
                          />
                          <Typography className="text-sm md:text-lg">
                            {name}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </>
              ) : (
                <Skeleton variant="rectangular" width="100%" height="100%" />
              )}
            </Box>
          </Paper>
        </ErrorBoundary>

        <ErrorBoundary
          error={applicationDataError}
          ErrorComponent={
            <Paper className="dashboard-paper ">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={applicationDataRefetch}
                message="Error in fetching data"
                heading="Today's Menu"
                headingClassName="text-xl md:text-2xl font-medium mx-8 my-4 mb-4"
              />
            </Paper>
          }
        >
          <Paper className="w-full pb-8 md:w-[48%] lg:w-1/2 px-0 h-1/2 md:h-full flex-grow overflow-hidden rounded-xl">
            <Typography className="mx-8 my-4 mb-2.5 text-xl md:text-2xl font-medium ">
              My Application
            </Typography>
            <TableComponent
              columns={applicationTableColumn}
              isLoading={isLoadingApplicationData}
              rows={applicationData || []}
              tableClassName="px-4 pb-4 h-full border-0"
              onRowClick={() => {
                navigate("applications");
              }}
            />
          </Paper>
        </ErrorBoundary>
      </Box>
      <Box className="flex-col gap-y-4 flex md:flex-row justify-around gap-x-6 md:gap-y-0 h-1/2 pb-3">
        <ErrorBoundary
          error={noticeDataError}
          ErrorComponent={
            <Paper className="dashboard-paper">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={noticeDataRefetch}
                message="Error in fetching data"
                heading="Notices"
                headingClassName="text-xl md:text-2xl font-medium mx-8 my-4 mb-4"
              />
            </Paper>
          }
        >
          <NoticeList notices={notices} />
        </ErrorBoundary>

        <ErrorBoundary
          error={compaintDataError}
          ErrorComponent={
            <Paper className="dashboard-paper ">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={complaintDataRefetch}
                message="Error in fetching data"
                heading="My Compaints"
                headingClassName="text-xl md:text-2xl font-medium mx-8 my-4 mb-4"
              />
            </Paper>
          }
        >
          <Paper className="w-full pb-8 h-[50vh] md:w-[48%] lg:w-1/2 px-0  md:h-full flex-grow overflow-hidden rounded-xl">
            <Typography className="mx-8 my-4 mb-2.5 text-xl md:text-2xl font-medium ">
              My Complaints
            </Typography>
            <TableComponent
              columns={complaintTablecolumns}
              isLoading={isLoadingComplaintData}
              rows={complaintData || []}
              tableClassName="px-4 pb-4 h-full border-0"
              onRowClick={() => {
                navigate("complaints");
              }}
            />
          </Paper>
        </ErrorBoundary>
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

export default StudentHome;
