import { useState } from "react";
import {
  Paper,
  IconButton,
  Box,
  Typography,
  DialogContent,
} from "@mui/material";
import { GridColDef, GridColumnHeaderParams } from "@mui/x-data-grid";
import { EditOutlined, DeleteOutlineOutlined } from "@mui/icons-material";

import TableComponent from "@src/components/Table";
import AlertComponent from "@components/Alert";
import ConfirmationModal from "@components/ConfirmationModal";

import useDialog from "@src/hooks/useDialog";
import useAlert from "@src/hooks/useAlert";

import { STUDENT_INFO_URL } from "@src/constant";
import { StudentInfoType, StudentInfoStateType, SeverityType } from "@ts/types";

const handleDelete = async (
  studentInfo: StudentInfoType,
  handleAlertOpen: (message: string, serverity: SeverityType) => void
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
      handleAlertOpen("Student data deleted", "success");
    }
  } catch (error) {
    if (error instanceof Error) {
      handleAlertOpen(error.message, "error");
    } else {
      handleAlertOpen("An error occurred", "error");
    }
  }
};

const commonOptions = {
  sortable: false,
  renderHeader(params: GridColumnHeaderParams) {
    const headerName = params.colDef.headerName;
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
  const { alert, handleAlertOpen, handleAlertClose } = useAlert();
  const { open, handleDialogOpen, handleDialogClose, handleDialogSubmit } =
    useDialog(async () => {
      await handleDelete(seletedStudent!.studentInfo, handleAlertOpen);
      getStudentInfoData(true, paginationModel.page);
    });

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      minWidth: 150,
      headerClassName: "pl-8",
      cellClassName: "pl-8",
      ...commonOptions,
    },
    {
      field: "roomNumber",
      headerName: "Room number",
      minWidth: 150,
      ...commonOptions,
    },
    {
      field: "studentName",
      headerName: "Name",
      align: "center",
      headerAlign: "center",
      minWidth: 170,
      flex: 1,
      ...commonOptions,
    },
    {
      field: "mobileNumber",
      headerName: "Mobile Number",
      minWidth: 170,
      headerAlign: "center",
      align: "center",
      flex: 1,
      ...commonOptions,
    },
    {
      field: "Actions",
      headerName: "Actions",
      minWidth: 170,
      headerAlign: "center",
      align: "center",
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
                handleDialogOpen();
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

  async function getStudentInfoData(pagination: boolean, page?: number) {
    try {
      setLoading(true);
      const response = await fetch(STUDENT_INFO_URL);
      const data = await response.json();
      setRowCount(data.length);
      if (!pagination) setStudentsData(data);
      else {
        setStudentsData(data.slice(page! * 10, page! * 10 + 10));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <Paper className="w-[95%] h-[85vh] md:h-full my-4 xl:my-8 mx-auto overflow-hidden rounded-xl">
      <TableComponent
        columns={columns}
        isLoading={loading}
        rows={studentsData || []}
        tableClassName="max-h-full"
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
        handleClose={handleDialogClose}
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
          handleClose={handleAlertClose}
        />
      )}
    </Paper>
  );
};

export default StudentInfo;
