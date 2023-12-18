import { useState, MouseEvent, useContext, ChangeEvent } from "react";
import {
  Box,
  Typography,
  DialogContent,
  MenuItem,
  Select,
  SelectChangeEvent,
  IconButton,
  Button,
} from "@mui/material";
import {
  GridColDef,
  GridColumnHeaderParams,
  GridAlignment,
} from "@mui/x-data-grid";
import { DeleteOutlineOutlined } from "@mui/icons-material";

import TableComponent from "@components/Table";
import AlertComponent from "@components/Alert";
import ConfirmationModal from "@components/ConfirmationModal";
import ChipComponent from "@src/components/Clip";
import ComplaintModal from "./ComplaintModal";

import useDialog from "@src/hooks/useDialog";
import useAlert from "@src/hooks/useAlert";
import { AuthContext } from "@context/AuthContext";
import {
  getStatusColor,
  dateFormat,
  sendData,
  fetchData,
  catchErrorMessage,
  extractArrayFromApiData,
  todayDate,
  deleteData,
} from "@utils/index";
import {
  COMPLAINTS_URL,
  COMPLAINT_STATUS,
  ERROR,
  STUDENT,
  SUCCESS,
  STATUS_ICONS,
} from "@src/constant";
import {
  ComplaintType,
  SeverityType,
  ComplaintStateType,
  ComplaintStatusType,
} from "@ts/types";

type SearchStatusType = "all" | "pending" | "resolved" | "invalid";

const updateComplaintsStatus = async (
  complaint: ComplaintType,
  handleAlert: (
    isOpen: boolean,
    message: string,
    serverity: SeverityType
  ) => void
) => {
  const { id } = complaint;
  const url = `${COMPLAINTS_URL}/${id}`;
  try {
    const isDataUpdated = await sendData<ComplaintType>(url, "PUT", complaint);
    const message = isDataUpdated
      ? "Status saved Successfully"
      : "Error in updating status";
    const severity = isDataUpdated ? SUCCESS : ERROR;
    handleAlert(true, message, severity);
  } catch (error) {
    handleAlert(true, catchErrorMessage(error), ERROR);
  }
};

const deleteComplaint = async (
  { id }: ComplaintType,
  handleAlert: (
    isOpen: boolean,
    message: string,
    serverity: SeverityType
  ) => void
) => {
  const url = `${COMPLAINTS_URL}/${id}`;
  try {
    const isDataDeleted = await deleteData(url);
    const message = isDataDeleted
      ? "Complaint Deleted Successfully"
      : "Error in deleting complaint";
    const severity = isDataDeleted ? SUCCESS : ERROR;
    handleAlert(true, message, severity);
  } catch (error) {
    handleAlert(true, catchErrorMessage(error), ERROR);
  }
};

const isMenuItemVisible = (optionStatus: string, status: string) => {
  if (optionStatus === "pending") return true;
  if (optionStatus === "resolved" && status !== "pending") return true;
  if (optionStatus === "invalid" && status !== "pending") return true;
  return false;
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

const Complaints = () => {
  const [complaintData, setComplaintData] = useState<ComplaintType[] | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedComplaint, setSelectedComplaint] =
    useState<ComplaintStateType | null>(null);
  const [searchStatus, setSearchStatus] = useState<SearchStatusType>("all");
  const [rowCount, setRowCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [action, setAction] = useState<string>("");
  const {
    user: { role, name },
  } = useContext(AuthContext);
  const isRoleStudent = role === STUDENT;
  const { status: seletedComplaintStatus } = selectedComplaint?.complaint || {};
  const { open, handleDialogClick, handleDialogSubmit } = useDialog(
    async () => {
      action === "delete"
        ? await deleteComplaint(selectedComplaint!.complaint, handleAlert)
        : await updateComplaintsStatus(
            selectedComplaint!.complaint,
            handleAlert
          );
      getComplaintsData(true, paginationModel.page, searchStatus);
    }
  );
  const { alert, handleAlert } = useAlert();
  const selectMenuItems = [
    { status: "pending", text: "Pending", icon: STATUS_ICONS.pending },
    { status: "resolved", text: "Resolved", icon: STATUS_ICONS.resolved },
    { status: "invalid", text: "Invalid", icon: STATUS_ICONS.invalid },
  ];
  const initialComplaint: ComplaintType = {
    date: todayDate(),
    type: "",
    description: "",
    status: "pending",
    studentName: name,
  };
  async function getComplaintsData(
    pagination: boolean,
    page?: number,
    searchStatus?: string
  ) {
    try {
      setLoading(true);
      const response = await fetchData(COMPLAINTS_URL);
      const data = extractArrayFromApiData<ComplaintType>(response.data);
      data.sort(
        (a: ComplaintType, b: ComplaintType) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const filteredData = searchStatus
        ? data.filter(({ status }: ComplaintType) => {
            if (searchStatus === "all") return true;
            return status === searchStatus;
          })
        : data;
      filteredData.forEach((complaint: ComplaintType) => {
        complaint.date = dateFormat(complaint.date);
      });

      if (!pagination) setComplaintData(filteredData);
      else {
        setComplaintData(filteredData.slice(page! * 10, page! * 10 + 10));
      }
      setRowCount(filteredData.length);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleAlert(true, catchErrorMessage(error), "error");
    }
  }

  const addNewComplaint = async (
    complaint: ComplaintType,
    handleAlert: (
      isOpen: boolean,
      message: string,
      serverity: SeverityType
    ) => void
  ) => {
    try {
      const isComplaintAdded = await sendData<ComplaintType>(
        COMPLAINTS_URL,
        "POST",
        complaint
      );
      const message = isComplaintAdded
        ? "Complaint added Successfully"
        : "Error in adding complaint";
      const severity = isComplaintAdded ? SUCCESS : ERROR;
      handleAlert(true, message, severity);
      isComplaintAdded &&
        getComplaintsData(true, paginationModel.page, searchStatus);
      setSelectedComplaint(null);
    } catch (error) {
      handleAlert(true, catchErrorMessage(error), ERROR);
    }
  };

  const handleOpenModal = (
    event: MouseEvent<Element>,
    row: unknown,
    isModalEditable: boolean = false
  ) => {
    event.stopPropagation();
    setSelectedComplaint({
      complaint: row as ComplaintType,
      isModalOpen: true,
      isModalEditable,
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedComplaint({
      ...selectedComplaint!,
      complaint: {
        ...selectedComplaint!.complaint,
        [name]: value,
      },
    });
  };

  const handleAutoCompleteChange = (type: string | null) => {
    setSelectedComplaint({
      ...selectedComplaint!,
      complaint: {
        ...selectedComplaint!.complaint,
        type: type || "",
      },
    });
  };

  const OnStatusChange = (
    event: SelectChangeEvent<"pending" | "resolved" | "invalid">,
    row: ComplaintType
  ) => {
    event.stopPropagation();
    const { value } = event.target;
    setSelectedComplaint({
      complaint: { ...row, status: value as ComplaintStatusType },
      isModalOpen: false,
      isModalEditable: false,
    });
    setAction("status");
    handleDialogClick(true);
  };

  const adminSpecificColumns: GridColDef[] = [
    {
      field: "studentName",
      headerName: "Student",
      minWidth: 170,

      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
  ];

  const studentSpecificColumns: GridColDef[] = [
    {
      field: "status",
      headerName: "Status",
      minWidth: 170,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
      renderCell: ({ row }) => {
        const { status } = row as ComplaintType;
        const { textColor } = getStatusColor(status, true);
        const Icon = STATUS_ICONS[status];
        return (
          <ChipComponent
            className="w-24 capitalize"
            text={status}
            type={status}
            icon={<Icon fontSize="small" className={textColor} />}
          />
        );
      },
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      minWidth: 50,
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
      field: "description",
      headerName: "Description",
      minWidth: 170,

      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
    ...(isRoleStudent ? studentSpecificColumns : adminSpecificColumns),
    {
      field: "Actions",
      headerName:
        isRoleStudent || searchStatus === "pending" || searchStatus === "all"
          ? "Actions"
          : "Status",
      minWidth: 170,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
      renderCell: ({ row }) => {
        const { status } = row as ComplaintType;
        const isPending = status === "pending";
        return (
          <>
            {isRoleStudent ? (
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedComplaint((prev) => {
                    return {
                      ...prev!,
                      complaint: row as ComplaintType,
                      isModalOpen: false,
                      isModalEditable: false,
                    };
                  });
                  setAction("delete");
                  handleDialogClick(true);
                }}
                size="large"
                disabled={!isPending}
                className={`p-2 ${
                  isPending ? "text-error-main" : "text-gray-400"
                }`}
              >
                <DeleteOutlineOutlined />
              </IconButton>
            ) : (
              <Select
                sx={{
                  "& fieldset": { border: "none" },
                }}
                inputProps={{
                  className: "p-0",
                }}
                value={status}
                label="Age"
                IconComponent={() => null}
                onChange={(
                  event: SelectChangeEvent<"pending" | "resolved" | "invalid">
                ) => {
                  OnStatusChange(event, row as ComplaintType);
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      marginTop: "0.5rem",
                    },
                  },
                }}
              >
                {selectMenuItems.map(
                  ({ status: optionStatus, icon: Icon, text }) => {
                    const { textColor } = getStatusColor(status, true);
                    const disabled = isMenuItemVisible(optionStatus, status);
                    return (
                      <MenuItem
                        key={optionStatus}
                        value={optionStatus}
                        disabled={disabled}
                      >
                        <ChipComponent
                          className="w-24"
                          text={text}
                          type={optionStatus}
                          icon={<Icon fontSize="small" className={textColor} />}
                        />
                      </MenuItem>
                    );
                  }
                )}
              </Select>
            )}
          </>
        );
      },
    },
  ];

  return (
    <>
      <Box className="flex w-[96%] justify-center md:justify-start gap-2 shrink flex-wrap mx-auto gap-x-4">
        {COMPLAINT_STATUS.map(({ status, icon: Icon }) => {
          const isActive = searchStatus === status;
          const { textColor } = getStatusColor(status, isActive);
          return (
            <ChipComponent
              key={status}
              text={status.toUpperCase()}
              type={status}
              className="w-28 justify-around"
              isActive={isActive}
              variant={isActive ? "filled" : "outlined"}
              icon={<Icon fontSize="small" className={textColor} />}
              onClick={() => {
                setSearchStatus(status as SearchStatusType);
                setPaginationModel({ page: 0, pageSize: 10 });
                getComplaintsData(true, paginationModel.page, status);
              }}
            />
          );
        })}
        {isRoleStudent && (
          <Box className="flex-1 flex">
            <Button
              variant="contained"
              className="ml-auto"
              size="large"
              onClick={(event) => {
                handleOpenModal(event, initialComplaint, true);
              }}
            >
              raise complaint
            </Button>
          </Box>
        )}
      </Box>
      <Box className="w-[96%] h-[85vh] md:h-full my-4 xl:my-6  mx-auto overflow-hidden rounded-xl">
        <TableComponent
          columns={columns}
          isLoading={loading}
          rows={complaintData || []}
          tableClassName="max-h-full bg-white rounded-xl"
          pagination={true}
          getData={getComplaintsData}
          rowCount={rowCount}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          onRowClick={(event: MouseEvent<Element>, row) => {
            handleOpenModal(event, row);
          }}
          searchText={searchStatus}
        />
        {alert.isOpen && (
          <AlertComponent
            severity={alert.severity}
            message={alert.message}
            handleClose={() => handleAlert(false)}
          />
        )}
        <ConfirmationModal
          isOpen={open}
          handleClose={() => handleDialogClick(false)}
          handleSubmit={handleDialogSubmit}
          title="Are You Sure ?"
          buttontext={action === "delete" ? "delete" : "save"}
          buttonType={action === "delete" ? "delete" : "primary"}
        >
          <DialogContent className="padding-0 ">
            {action === "delete"
              ? "Complaint will be deleted"
              : `Complaint Status will be changed to ${seletedComplaintStatus}`}
          </DialogContent>
        </ConfirmationModal>
        {selectedComplaint?.isModalOpen && (
          <ComplaintModal
            complaintState={selectedComplaint}
            handleClose={() => setSelectedComplaint(null)}
            handleChange={handleInputChange}
            handleAutoCompleteChange={handleAutoCompleteChange}
            handleAdd={() => {
              addNewComplaint(selectedComplaint!.complaint, handleAlert);
            }}
          />
        )}
      </Box>
    </>
  );
};

export default Complaints;
