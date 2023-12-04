import { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import {
  Paper,
  IconButton,
  Box,
  Typography,
  DialogContent,
  Button,
  InputBase,
} from "@mui/material";

import {
  GridColDef,
  GridColumnHeaderParams,
  GridAlignment,
} from "@mui/x-data-grid";
import {
  EditOutlined,
  DeleteOutlineOutlined,
  Search,
  Add,
} from "@mui/icons-material";

import TableComponent from "@src/components/Table";
import AlertComponent from "@components/Alert";
import ConfirmationModal from "@components/ConfirmationModal";
import StudentProfile from "./StudentProfile";
import AddStudent from "./addStudent";

import useDialog from "@src/hooks/useDialog";
import useAlert from "@src/hooks/useAlert";
import { checkEmailExists } from "@utils/index";
import { STUDENT_INFO_URL } from "@src/constant";
import {
  StudentInfoType,
  StudentInfoStateType,
  SeverityType,
  AddStudentStateType,
} from "@ts/types";

const handleDelete = async (
  studentInfo: StudentInfoType,
  handleAlert: (
    isOpen: boolean,
    message: string,
    serverity: SeverityType
  ) => void
) => {
  const { id } = studentInfo;
  try {
    if (!id) {
      throw new Error("Student do not exist");
    }
    const deleteResponse = await fetch(`${STUDENT_INFO_URL}/${id}`, {
      method: "DELETE",
    });
    if (!deleteResponse.ok) {
      throw new Error(`Server error: ${deleteResponse.statusText}`);
    } else {
      handleAlert(true, "Student data deleted", "success");
    }
  } catch (error) {
    if (error instanceof Error) {
      handleAlert(true, error.message, "error");
    } else {
      handleAlert(true, "An error occurred", "error");
    }
  }
};

const saveStudentData = async (
  studentInfo: StudentInfoType,
  handleAlert: (
    isOpen: boolean,
    message: string,
    serverity: SeverityType
  ) => void
) => {
  const { id } = studentInfo;
  const url = `${STUDENT_INFO_URL}/${id}`;
  try {
    const putData = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentInfo),
    });
    if (putData.ok) {
      handleAlert(true, "Data saved Successfully", "success");
    } else {
      throw new Error("Not updated");
    }
  } catch (error) {
    if (error instanceof Error) {
      handleAlert(true, error.message, "error");
    } else {
      handleAlert(true, "An error occurred", "error");
    }
  }
};

const addStudentData = async (
  { confirmPassword, ...studentData }: AddStudentStateType, // eslint-disable-line
  handleAlert: (
    isOpen: boolean,
    message: string,
    serverity: SeverityType
  ) => void
) => {
  try {
    const postData = await fetch(STUDENT_INFO_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    });
    if (postData.ok) {
      handleAlert(true, "Data saved Successfully", "success");
    } else {
      throw new Error("Not updated");
    }
  } catch (error) {
    if (error instanceof Error) {
      handleAlert(true, error.message, "error");
    } else {
      handleAlert(true, "An error occurred", "error");
    }
  }
};

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
  const [loading, setLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>(100);
  const [seletedStudent, setSelectedStudent] =
    useState<StudentInfoStateType | null>(null);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { alert, handleAlert } = useAlert();
  const { open, handleDialogClick, handleDialogSubmit } = useDialog(
    async () => {
      await handleDelete(seletedStudent!.studentInfo, handleAlert);
      getStudentInfoData(true, paginationModel.page);
    }
  );
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] =
    useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const getData = setTimeout(() => {
      getStudentInfoData(true, paginationModel.page, searchText);
    }, 300);
    return () => clearTimeout(getData);
  }, [searchText]);

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
      minWidth: 150,
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
        const room = roomNumber ? roomNumber : "---";
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

      minWidth: 170,
      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      minWidth: 170,

      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "Actions",
      headerName: "Actions",
      minWidth: 170,
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

  async function getStudentInfoData(
    pagination: boolean,
    page?: number,
    searchText?: string
  ) {
    try {
      setLoading(true);
      const response = await fetch(`${STUDENT_INFO_URL}`);
      const data = await response.json();
      setRowCount(data.length);

      const filteredData = searchText
        ? data.filter((student: StudentInfoType) =>
            student.studentName.toLowerCase().includes(searchText.toLowerCase())
          )
        : data;

      if (!pagination) setStudentsData(filteredData);
      else {
        setStudentsData(filteredData.slice(page! * 10, page! * 10 + 10));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleAlert(true, "An error occurred", "error");
    }
  }
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

  const handleAddNewStudent = async (studentInfo: AddStudentStateType) => {
    await addStudentData(studentInfo, handleAlert);
    handleAddStudentModal(false);
    getStudentInfoData(true, paginationModel.page);
  };

  const handleSubmit = async (studentInfo: StudentInfoType) => {
    const { email, id } = studentInfo;
    if (await checkEmailExists(email, id)) {
      handleAlert(true, "Email already exists", "error");
      return;
    }
    await saveStudentData(studentInfo, handleAlert);
    handleModalClose();
    setSelectedStudent(null);
    getStudentInfoData(true, paginationModel.page);
  };

  return (
    <>
      <Box className="flex w-[96%] shrink flex-wrap mx-auto justify-between gap-y-3 ">
        <Paper
          className="px-[2px] py-[4px] flex w-full md:w-[40%] lg:w-1/4 rounded-3xl"
          component="form"
        >
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <Search />
          </IconButton>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Student Name"
            value={searchText}
            onChange={handleSeachTextChange}
          />
        </Paper>
        <Button
          size="large"
          className="w-[6rem]"
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleAddStudentModal(true)}
        >
          Add
        </Button>
      </Box>
      <Box className="w-[96%] h-[85vh] md:h-full my-4 xl:my-8 mx-auto overflow-hidden rounded-xl">
        <TableComponent
          columns={columns}
          isLoading={loading}
          rows={studentsData || []}
          tableClassName="max-h-full bg-white rounded-xl"
          pagination={true}
          getData={getStudentInfoData}
          rowCount={rowCount}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          onRowClick={(event, row) =>
            handleModalOpen(event, row as StudentInfoType, false)
          }
        />
        <ConfirmationModal
          isOpen={open}
          handleClose={() => handleDialogClick(false)}
          handleSubmit={handleDialogSubmit}
          title="Are You Sure ?"
          buttontext="delete"
          buttonType="delete"
        >
          <DialogContent className="padding-0">
            Student Data will be deleted
          </DialogContent>
        </ConfirmationModal>

        {alert.isOpen && (
          <AlertComponent
            severity={alert.severity}
            message={alert.message}
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
      </Box>
    </>
  );
};

export default StudentInfo;
