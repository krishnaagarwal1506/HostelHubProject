import { useState, useEffect, Fragment, useContext } from "react";
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

import { NoticeDataType, ErrorType } from "@ts/types";
import { fetchData, extractArrayFromApiData, dateFormat } from "@utils/index";
import {
  NOTICES_URL,
  COMPLAINTS_URL,
  TODAY_MENU_URL,
  ROOM_INFO_URL,
  STUDENT_ROOM_DETAILS,
} from "@constant/index";
import { ComplaintType } from "@ts/types";

const StudentHome = () => {
  const [notices, setNotices] = useState<NoticeDataType[]>([]);
  const [noticeError, setNoticeError] = useState<ErrorType>({
    isError: false,
    message: "",
  });
  const [complaintData, setComplaintData] = useState<ComplaintType[] | null>(
    null
  );
  const [complaintDataError, setcomplaintDataError] = useState<ErrorType>({
    isError: false,
    message: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [todaysMenu, setTodaysMenu] = useState<
    | {
        name: string;
        value: string;
      }[]
    | null
  >(null);
  const [todaysMenuError, setTodaysMenuError] = useState<boolean>(false);
  const [roomDetails, setRoomDetails] = useState<{
    wing: string;
    floor: string;
    room: string;
  } | null>(null);
  const [roomDetailsError, setRoomDetailsError] = useState<boolean>(false);
  const {
    user: { studentInfo },
  } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    getNoticesData();
    getTodayMenu();
    getRoomDetails();
    getComplaintsData();
  }, []);

  async function getNoticesData(): Promise<void> {
    try {
      const response = await fetchData(NOTICES_URL);
      const data = extractArrayFromApiData<NoticeDataType>(response.data);
      const formatedData = data.map((value: NoticeDataType) => {
        return {
          ...value,
          date: dateFormat(value.date),
        };
      });
      setNotices(formatedData);
      setNoticeError({ isError: false, message: "" });
    } catch (error) {
      setNoticeError({ isError: true, message: error as string });
    }
  }
  async function getTodayMenu(): Promise<void> {
    try {
      const response = await fetchData(TODAY_MENU_URL);
      setTodaysMenu(response.data.attributes.data);
      setTodaysMenuError(false);
    } catch (error) {
      setTodaysMenuError(true);
    }
  }
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

  async function getComplaintsData() {
    try {
      setLoading(true);
      const response = await fetchData(
        `${COMPLAINTS_URL}?populate=*&filters[student][id][$eq]=${studentInfo?.id}`
      );
      const data = extractArrayFromApiData<ComplaintType>(response.data);
      const filteredData = data
        .sort(
          (a: ComplaintType, b: ComplaintType) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .map((complaint: ComplaintType) => {
          return { ...complaint, date: dateFormat(complaint.date) };
        });

      setComplaintData(filteredData);
      setcomplaintDataError({ isError: false, message: "" });
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setcomplaintDataError({ isError: true, message: error as string });
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

  const columns: GridColDef[] = [
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

  return (
    <Box className="p-4 w-full xl:p-8 flex flex-col min-h-20 flex-grow-0 md:flex-grow md:min-h-1/2 overflow-scroll">
      <Box className="flex-col gap-y-4 flex md:flex-row justify-around gap-x-6 md:gap-y-0 h-1/2 pb-6">
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
          error={noticeError.isError}
          ErrorComponent={
            <Paper className="dashboard-paper">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={getNoticesData}
                message="Error in fetching data"
                heading="Notices"
                headingClassName="text-xl md:text-2xl font-medium mx-8 my-4 mb-4"
              />
            </Paper>
          }
        >
          <NoticeList notices={notices} />
        </ErrorBoundary>
      </Box>
      <Box className="flex-col gap-y-4 flex md:flex-row justify-around gap-x-6 md:gap-y-0 h-1/2 pb-3">
        <ErrorBoundary
          error={todaysMenuError}
          ErrorComponent={
            <Paper className="dashboard-paper ">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={getTodayMenu}
                message="Error in fetching data"
                heading="Today's Menu"
                headingClassName="text-xl md:text-2xl font-medium mx-8 my-4 mb-4"
              />
            </Paper>
          }
        >
          <Paper className="w-full md:w-1/2 h-full  rounded-xl">
            <Typography className="mx-8 my-4 mb-2.5 text-xl md:text-2xl font-medium ">
              Today's Menu
            </Typography>
            <Box className="flex justify-evenly mx-4 py-4 gap-4 max-h-fit mt-8 mb-6 border rounded-xl">
              {todaysMenu ? (
                <>
                  {todaysMenu!.map(({ name, value }) => {
                    const dishItems = value.split(",");
                    return (
                      <Fragment key={name}>
                        <Box className="flex-1 h-full flex flex-col gap-3 items-center border-l">
                          <Typography className="font-semibold text-base md:text-xl">
                            {name}
                          </Typography>
                          <Box>
                            {dishItems.map((dish: string) => {
                              return (
                                <Typography
                                  key={dish}
                                  className="text-center text-sm md:text-base py-0.5"
                                >
                                  {dish}
                                </Typography>
                              );
                            })}
                          </Box>
                        </Box>
                      </Fragment>
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
          error={complaintDataError.isError}
          ErrorComponent={
            <Paper className="dashboard-paper ">
              <ErrorComponent
                className="w-full h-full"
                onSubmit={getComplaintsData}
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
              columns={columns}
              isLoading={loading}
              rows={complaintData || []}
              tableClassName="px-4 pb-4 h-full border-0"
              getData={getComplaintsData}
              paginationModel={paginationModel}
              setPaginationModel={setPaginationModel}
              onRowClick={() => {
                navigate("complaints");
              }}
            />
          </Paper>
        </ErrorBoundary>
      </Box>
    </Box>
  );
};

export default StudentHome;
