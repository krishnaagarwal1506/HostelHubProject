import { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import {
  IconButton,
  Box,
  Typography,
  DialogContent,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  GridColDef,
  GridColumnHeaderParams,
  GridAlignment,
} from "@mui/x-data-grid";
import { EditOutlined, DeleteOutlineOutlined, Add } from "@mui/icons-material";

import TableComponent from "@components/Table";
import AlertComponent from "@components/Alert";
import ConfirmationModal from "@components/ConfirmationModal";
import SearchBar from "@components/SearchBar";
import DialogModal from "@components/DialogModal";
import StudentProfile from "./StudentProfile";
import AddStudent from "./addStudent";

import useDialog from "@src/hooks/useDialog";
import useAlert from "@src/hooks/useAlert";
import {
  catchErrorMessage,
  deleteLocalStorage,
  extractArrayFromApiData,
  getLocalStorage,
} from "@utils/index";
import { checkEmailExists } from "@utils/index";
import {
  STUDENT_INFO_URL,
  METHOD,
  SUCCESS,
  ERROR,
  STRAPI_USER_URL,
  DELETE,
} from "@src/constant";
import {
  StudentInfoType,
  StudentInfoStateType,
  AddStudentStateType,
} from "@ts/types";
import {
  useDeleteStudentData,
  useDeleteUserData,
  useFetchStudentListData,
  useSaveStudentData,
  useSaveUser,
} from "@src/queryHooks/query";

const { POST, PUT } = METHOD;

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

const StudentInfo = () => {
  const [studentsData, setStudentsData] = useState<StudentInfoType[] | null>(
    null
  );
  const [rowCount, setRowCount] = useState<number>(100);
  const [seletedStudent, setSelectedStudent] =
    useState<StudentInfoStateType | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const { alert, handleAlert } = useAlert();
  const { isOpen, message, severity } = alert;
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] =
    useState<boolean>(false);
  const [searchText, setSearchText] = useState<string | null>(null);
  const [confirmAddStudent, setConfirmAddStudent] = useState<boolean>(false);
  const theme = useTheme();
  const isScreenSizeMdOrLarger = useMediaQuery(theme.breakpoints.up("md"));
  const [studentInfoUrl, setStudentInfoUrl] = useState(
    `${STUDENT_INFO_URL}?populate=*&sort=id:desc&pagination[page]=1&pagination[pageSize]=10`
  );
  const {
    data: studentInfoData,
    isLoading: studentInfoLoading,
    isError: studentInfoError,
    error: studentInfoErrorMessage,
  } = useFetchStudentListData(studentInfoUrl);

  const { mutate: saveOrUpdateStudentData } = useSaveStudentData();
  const { mutate: deleteStudentData } = useDeleteStudentData();
  const { mutate: deleteUserData } = useDeleteUserData();
  const { mutate: saveOrUpdateuser } = useSaveUser();

  const { open, handleDialogClick, handleDialogSubmit } = useDialog(
    async () => {
      const { id } = seletedStudent!.studentInfo;
      const studentUrl = `${STUDENT_INFO_URL}/${id}`;

      const studentUserId = seletedStudent!.studentInfo.user?.data.id;
      const userUrl = `${STRAPI_USER_URL}/${studentUserId}`;
      deleteUserData(userUrl, {
        onSuccess: () => {
          deleteStudentData(studentUrl, {
            onSuccess: () => {
              const message = "Student deleted successfully";
              handleAlert(true, message, SUCCESS);
            },
            onError: () => handleAlert(true, "Error, data not deleted", ERROR),
          });
        },
        onError: () => handleAlert(true, "Error, user data not deleted", ERROR),
      });
    }
  );

  useEffect(() => {
    if (studentInfoData) {
      const data = extractArrayFromApiData<StudentInfoType>(
        studentInfoData.data
      );
      setStudentsData(data);
      setRowCount(studentInfoData.meta.pagination.total);
    }
  }, [studentInfoData]);

  useEffect(() => {
    if (searchText !== null) {
      const getData = setTimeout(() => {
        setPaginationModel({ ...paginationModel, page: 0 });
        setStudentInfoUrl(
          `${STUDENT_INFO_URL}?populate=*&sort=id:desc&pagination[page]=1&pagination[pageSize]=10&filters[studentName][$containsi]=${searchText}`
        );
      }, 300);
      return () => clearTimeout(getData);
    }
  }, [searchText]);

  useEffect(() => {
    const paginatedUrl = `${STUDENT_INFO_URL}?populate=*&sort=id:desc&pagination[page]=${
      paginationModel.page + 1
    }&pagination[pageSize]=10&filters[studentName][$containsi]=${
      searchText || ""
    }`;
    setStudentInfoUrl(paginatedUrl);
  }, [paginationModel]);

  useEffect(() => {
    if (studentInfoError) {
      handleAlert(true, catchErrorMessage(studentInfoErrorMessage), ERROR);
    }
  }, [studentInfoError]);

  const actions = (
    <>
      <Button
        variant="outlined"
        size="large"
        onClick={() => {
          deleteLocalStorage("studentInfo");
          handleAddStudentModal(true);
          setConfirmAddStudent(false);
        }}
      >
        No
      </Button>
      <Button
        variant="contained"
        size="large"
        onClick={() => {
          handleAddStudentModal(true);
          setConfirmAddStudent(false);
        }}
      >
        Yes
      </Button>
    </>
  );
  const handleSeachTextChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setSearchText(value);
  };

  const handleAddStudentModal = (state: boolean) =>
    setIsAddStudentModalOpen(state);

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
      field: "roomNumber",
      headerName: "Room number",
      minWidth: 150,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
      renderCell: ({ row: { roomNumber } }) => {
        const room = roomNumber ? roomNumber : "-";
        return (
          <Box>
            <Typography>{room}</Typography>
          </Box>
        );
      },
    },
    {
      field: "studentName",
      headerName: "Name",
      minWidth: 150,
      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      minWidth: 150,
      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "guardianName",
      headerName: "Guardian Name",
      minWidth: 150,
      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "Actions",
      headerName: "Actions",
      minWidth: 50,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
      renderCell: ({ row }) => {
        return (
          <Box>
            <IconButton
              size="large"
              className="p-2 text-primary-main"
              onClick={(event) => {
                handleModalOpen(event, row as StudentInfoType, true);
              }}
            >
              <EditOutlined />
            </IconButton>
            <IconButton
              onClick={(event) => {
                event.stopPropagation();
                setSelectedStudent({
                  studentInfo: row as StudentInfoType,
                  isEditable: false,
                  isStudentInfoModalOpen: false,
                });
                handleDialogClick(true);
              }}
              size="large"
              className="p-2 text-error-main"
            >
              <DeleteOutlineOutlined />
            </IconButton>
          </Box>
        );
      },
    },
  ];

  const handleModalOpen = (
    event: MouseEvent<Element>,
    studentInfo: StudentInfoType,
    isEditable: boolean
  ) => {
    event.stopPropagation();
    setSelectedStudent({
      studentInfo,
      isEditable,
      isStudentInfoModalOpen: true,
    });
  };

  const handleModalClose = () => setSelectedStudent(null);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = event.target;
    setSelectedStudent({
      ...seletedStudent!,
      studentInfo: {
        ...seletedStudent!.studentInfo,
        [name]: value,
      },
    });
  };

  const handleAddNewStudent = async ({
    confirmPassword, //eslint-disable-line
    ...studentData
  }: AddStudentStateType) => {
    const { email, password } = studentData;
    const userData = {
      username: email,
      email,
      password,
      role: 4,
    };
    saveOrUpdateuser(
      {
        url: `${STRAPI_USER_URL}`,
        method: POST,
        content: userData,
        wrapper: false,
      },
      {
        onSuccess: (data) => {
          const user = data.data.id;
          const params = {
            url: STUDENT_INFO_URL,
            method: POST,
            content: { ...studentData, user },
          };
          saveOrUpdateStudentData(params, {
            onSuccess: () => {
              const message = "Student Added successfully";
              handleAlert(true, message, SUCCESS);
              deleteLocalStorage("studentInfo");
              handleAddStudentModal(false);
            },
            onError: (error) => {
              handleAlert(true, error.message, ERROR);
            },
          });
        },
        onError: (error) => {
          handleAlert(true, error.message, ERROR);
        },
      }
    );
  };

  const handleSubmit = async (studentInfo: StudentInfoType) => {
    const { email, id } = studentInfo;
    if (await checkEmailExists(email, id)) {
      handleAlert(true, "Email already exists", ERROR);
      return;
    }
    const url = `${STUDENT_INFO_URL}/${id}`;
    const userUrl = `${STRAPI_USER_URL}/${studentInfo.user?.data.id}`;
    const user = {
      username: studentInfo.email,
      email: studentInfo.email,
    };
    saveOrUpdateuser(
      {
        url: userUrl,
        method: PUT,
        content: user,
        wrapper: false,
      },
      {
        onSuccess: () => {
          const params = {
            url,
            method: PUT,
            content: studentInfo,
          };
          saveOrUpdateStudentData(params, {
            onSuccess: () => {
              const message = "Student data updated successfully";
              handleAlert(true, message, SUCCESS);
            },
            onError(error) {
              handleAlert(true, error.message, ERROR);
            },
          });
          handleAlert(true, message, severity);
        },
        onError(error) {
          handleAlert(true, error.message, ERROR);
        },
      }
    );
    handleModalClose();
    setSelectedStudent(null);
  };

  const checkStudentInfoAndExecute = () => {
    const studentInfo = getLocalStorage("studentInfo");
    studentInfo && !Object.values(JSON.parse(studentInfo)).every((val) => !val)
      ? setConfirmAddStudent(true)
      : handleAddStudentModal(true);
  };

  return (
    <>
      <Box className="flex w-[96%] shrink flex-wrap mx-auto justify-between gap-y-3 ">
        <SearchBar
          value={searchText || ""}
          onChange={handleSeachTextChange}
          placeHolder="Search student name"
          className="px-[2px] py-[4px] flex w-[80%] md:w-[40%] lg:w-1/4 rounded-3xl bg-primary-main bg-opacity-10 focus-within:ring-1 focus-within:ring-primary-main animate-slidein"
        />
        <Button
          size="large"
          className="rounded-full md:rounded-[3px] w-[0.5rem] p-0 md:w-[6rem] animate-slideinRight"
          variant="contained"
          startIcon={isScreenSizeMdOrLarger && <Add />}
          onClick={checkStudentInfoAndExecute}
        >
          {isScreenSizeMdOrLarger ? "Add" : <Add />}
        </Button>
      </Box>
      <Box className="w-[96%] h-[85vh] md:h-full my-4 xl:my-6 mx-auto overflow-hidden rounded-xl">
        <TableComponent
          columns={columns}
          isLoading={studentInfoLoading}
          rows={studentsData || []}
          tableClassName="max-h-full bg-white rounded-xl"
          pagination={true}
          rowCount={rowCount}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          onRowClick={(event, row) =>
            handleModalOpen(event, row as StudentInfoType, false)
          }
          searchText={searchText || ""}
        />
        <ConfirmationModal
          isOpen={open}
          handleClose={() => handleDialogClick(false)}
          handleSubmit={handleDialogSubmit}
          title="Are You Sure ?"
          buttontext={DELETE}
          buttonType={DELETE}
        >
          <DialogContent className="padding-0">
            <span className="font-semibold">
              {`${seletedStudent?.studentInfo.studentName} (id = ${seletedStudent?.studentInfo.id}) `}
            </span>
            will be deleted
          </DialogContent>
        </ConfirmationModal>

        {isOpen && (
          <AlertComponent
            severity={severity}
            message={message}
            handleClose={() => handleAlert(false)}
          />
        )}
        {isAddStudentModalOpen && (
          <AddStudent
            handleClose={() => {
              handleAddStudentModal(false);
            }}
            handleSubmit={handleAddNewStudent}
          />
        )}
        {seletedStudent && (
          <StudentProfile
            open={seletedStudent.isStudentInfoModalOpen}
            seletetedStudentState={seletedStudent!}
            handleClose={handleModalClose}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
          />
        )}
        {confirmAddStudent && (
          <DialogModal
            isOpen={confirmAddStudent}
            title="Are You Sure"
            handleClose={() => setConfirmAddStudent(false)}
            dialogSize="xs"
            actions={actions}
            iconButtonClasses="text-white"
            dialogTitleClassName="bg-primary-main text-white"
          >
            <Typography className="pt-4">
              Continue where you left off?
            </Typography>
          </DialogModal>
        )}
      </Box>
    </>
  );
};

export default StudentInfo;
