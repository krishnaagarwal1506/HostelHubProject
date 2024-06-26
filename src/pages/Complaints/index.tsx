import {
  useState,
  MouseEvent,
  useContext,
  ChangeEvent,
  useEffect,
} from "react";
import {
  Box,
  Typography,
  DialogContent,
  MenuItem,
  Select,
  SelectChangeEvent,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  GridColDef,
  GridColumnHeaderParams,
  GridAlignment,
} from "@mui/x-data-grid";
import { DeleteOutlineOutlined, ArrowDropDown, Add } from "@mui/icons-material";

import TableComponent from "@components/Table";
import AlertComponent from "@components/Alert";
import ConfirmationModal from "@components/ConfirmationModal";
import ChipComponent from "@src/components/Chip";
import ComplaintModal from "./ComplaintModal";

import useDialog from "@src/hooks/useDialog";
import useAlert from "@src/hooks/useAlert";
import { AuthContext } from "@context/AuthContext";
import {
  catchErrorMessage,
  extractArrayFromApiData,
  todayDate,
  capitalize,
} from "@utils/index";
import {
  COMPLAINTS_URL,
  COMPLAINT_STATUS,
  ERROR,
  STUDENT,
  SUCCESS,
  STATUS_ICONS,
  PENDING,
  RESOLVED,
  INVALID,
  ALL,
  METHOD,
  DELETE,
} from "@src/constant";
import {
  ComplaintType,
  ComplaintStateType,
  ComplaintStatusType,
} from "@ts/types";
import {
  useDeleteComplaintData,
  useFetchComplaintListData,
  useSaveComplaintData,
} from "@src/queryHooks/query";

type SearchStatusType = ComplaintStatusType | "all";
const { PUT, POST } = METHOD;

const isMenuItemVisible = (optionStatus: string, status: string) => {
  if (optionStatus === PENDING) return true;
  if (optionStatus === RESOLVED && status !== PENDING) return true;
  if (optionStatus === INVALID && status !== PENDING) return true;
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
    user: { role, name, studentInfo },
  } = useContext(AuthContext);
  const isRoleStudent = role === STUDENT;
  const [commplaintUrl, setComplaintUrl] = useState<string>(
    isRoleStudent
      ? `${COMPLAINTS_URL}?populate=*&filters[student][id][$eq]=${studentInfo?.id}&sort=createdAt:desc`
      : `${COMPLAINTS_URL}?sort=createdAt:desc`
  );
  const theme = useTheme();
  const isScreenSizeMdOrLarger = useMediaQuery(theme.breakpoints.up("md"));
  const { status: seletedComplaintStatus } = selectedComplaint?.complaint || {};

  const { alert, handleAlert } = useAlert();

  const {
    data: complaintsData,
    isLoading: isLoadingComplaintData,
    isError: complaintDataError,
    error: complaintDataErrorMessage,
  } = useFetchComplaintListData(commplaintUrl);
  const { mutate: saveOrUpdateComplaint } = useSaveComplaintData();
  const { mutate: deleteComplaint } = useDeleteComplaintData();

  const updateComplaintsStatus = () => {
    const { id } = selectedComplaint!.complaint;
    const url = `${COMPLAINTS_URL}/${id}`;
    saveOrUpdateComplaint(
      {
        url,
        method: PUT,
        content: selectedComplaint!.complaint,
      },
      {
        onSuccess: () => {
          handleAlert(true, "Status saved Successfully", SUCCESS);
        },
        onError: (error) => {
          handleAlert(true, catchErrorMessage(error), ERROR);
        },
      }
    );
  };

  const handleDeleteComplaint = () => {
    const url = `${COMPLAINTS_URL}/${selectedComplaint!.complaint.id}`;
    deleteComplaint(url, {
      onSuccess: () => {
        handleAlert(true, "Complaint Deleted Successfully", SUCCESS);
      },
      onError: (error) => {
        handleAlert(true, catchErrorMessage(error), ERROR);
      },
    });
  };

  const { open, handleDialogClick, handleDialogSubmit } = useDialog(
    async () => {
      action === DELETE ? handleDeleteComplaint() : updateComplaintsStatus();
    }
  );

  useEffect(() => {
    if (complaintsData) {
      const data = extractArrayFromApiData<ComplaintType>(complaintsData.data);
      setComplaintData(data);
      setRowCount(complaintsData.meta.pagination.total);
    }
  }, [complaintsData]);

  useEffect(() => {
    const url = isRoleStudent
      ? `${COMPLAINTS_URL}?populate=*&filters[student][id][$eq]=${studentInfo?.id}&sort=createdAt:desc`
      : `${COMPLAINTS_URL}?sort=createdAt:desc`;
    const searchUrl =
      searchStatus === "all"
        ? url
        : `${url}&filters[status][$eq]=${searchStatus}`;
    setComplaintUrl(
      `${searchUrl}&pagination[page]=${
        paginationModel.page + 1
      }&pagination[pageSize]=10`
    );
  }, [paginationModel, searchStatus]);

  useEffect(() => {
    if (complaintDataError) {
      handleAlert(true, catchErrorMessage(complaintDataErrorMessage), ERROR);
    }
  }, [complaintDataError]);

  const selectMenuItems = [
    { status: PENDING, text: capitalize(PENDING), icon: STATUS_ICONS.pending },
    {
      status: RESOLVED,
      text: capitalize(RESOLVED),
      icon: STATUS_ICONS.resolved,
    },
    { status: INVALID, text: capitalize(INVALID), icon: STATUS_ICONS.invalid },
  ];
  const initialComplaint: ComplaintType = {
    date: todayDate(),
    type: "",
    description: "",
    status: PENDING,
    studentName: name,
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
    event: SelectChangeEvent<ComplaintStatusType>,
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
      headerName: "Raised By",
      minWidth: 150,

      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
  ];

  const studentSpecificColumns: GridColDef[] = [
    {
      field: "status",
      headerName: "Status",
      minWidth: 100,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
      renderCell: ({ row }) => {
        const { status } = row as ComplaintType;
        return (
          <ChipComponent
            className="w-24 capitalize cursor-default"
            text={status}
            type={status}
            onClick={(event) => event.stopPropagation()}
          />
        );
      },
    },
  ];

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "Id",
      minWidth: 30,
      headerClassName: "pl-8",
      cellClassName: "pl-8 hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "date",
      headerName: "Created at",
      minWidth: 150,
      headerClassName: "pl-8",
      cellClassName: "pl-8 hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "type",
      headerName: "Type",

      minWidth: 150,
      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 150,

      flex: 1,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
    },
    ...(isRoleStudent ? studentSpecificColumns : adminSpecificColumns),
    {
      field: "Actions",
      headerName:
        isRoleStudent || searchStatus === PENDING || searchStatus === ALL
          ? "Actions"
          : "Status",
      minWidth: 120,
      cellClassName: "hover:cursor-pointer",
      ...commonOptions,
      renderCell: ({ row }) => {
        const { status } = row as ComplaintType;
        const isPending = status === PENDING;
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
                  setAction(DELETE);
                  handleDialogClick(true);
                }}
                size="large"
                disabled={!isPending}
                className={`p-2 ${isPending ? "text-error-main" : "hidden"}`}
              >
                <DeleteOutlineOutlined fontSize="small" />
              </IconButton>
            ) : (
              <Select
                sx={{
                  "& fieldset": { border: "none" },
                }}
                inputProps={{
                  className: "pr-4",
                }}
                value={status}
                label="Age"
                IconComponent={() => null}
                onChange={(event: SelectChangeEvent<ComplaintStatusType>) => {
                  OnStatusChange(event, row as ComplaintType);
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      marginTop: "-0.8rem",
                      display: isPending ? "block" : "none",
                    },
                  },
                }}
                renderValue={(selectedValue) => {
                  return (
                    <ChipComponent
                      className={`w-24 capitalize ${
                        !isPending && "cursor-default"
                      }`}
                      text={selectedValue}
                      type={selectedValue}
                      icon={
                        isPending ? <ArrowDropDown color="error" /> : undefined
                      }
                    />
                  );
                }}
              >
                {selectMenuItems.map(({ status: optionStatus, text }) => {
                  const disabled = isMenuItemVisible(optionStatus, status);
                  return (
                    <MenuItem
                      sx={{
                        fontSize: "0.8rem",
                      }}
                      key={optionStatus}
                      value={optionStatus}
                      disabled={disabled}
                    >
                      {text}
                    </MenuItem>
                  );
                })}
              </Select>
            )}
          </>
        );
      },
    },
  ];
  return (
    <>
      <Box className="flex w-[96%] justify-start items-center gap-2 shrink flex-wrap mx-auto gap-x-2 md:gap-x-4">
        {COMPLAINT_STATUS.map(({ status }) => {
          const isActive = searchStatus === status;
          return (
            <ChipComponent
              key={status}
              text={status}
              type={status}
              className="w-24 justify-around capitalize animate-slidein"
              isActive={isActive}
              variant={isActive ? "filled" : "outlined"}
              onClick={() => {
                setSearchStatus(status as SearchStatusType);
                setPaginationModel({ page: 0, pageSize: 10 });
              }}
            />
          );
        })}
        {isRoleStudent && (
          <Box className="flex-1 flex animate-slideinRight">
            <Button
              variant="contained"
              className="rounded-full md:rounded-[3px] md:ml-auto"
              size="large"
              onClick={(event) => {
                handleOpenModal(event, initialComplaint, true);
              }}
            >
              {isScreenSizeMdOrLarger ? (
                "raise complaint"
              ) : (
                <Add fontSize="small" />
              )}
            </Button>
          </Box>
        )}
      </Box>
      <Box className="w-[96%] h-[85vh] md:h-full my-4 xl:my-6  mx-auto overflow-hidden rounded-xl">
        <TableComponent
          columns={columns}
          isLoading={isLoadingComplaintData}
          rows={complaintData || []}
          tableClassName="max-h-full bg-white rounded-xl"
          pagination={true}
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
          buttontext={action === DELETE ? DELETE : "save"}
          buttonType={action === DELETE ? DELETE : "primary"}
        >
          <DialogContent className="padding-0 ">
            {action === DELETE
              ? "Complaint will be deleted"
              : `Complaint status will be changed to ${
                  selectedComplaint &&
                  seletedComplaintStatus!.charAt(0).toUpperCase() +
                    seletedComplaintStatus!.slice(1)
                }`}
          </DialogContent>
        </ConfirmationModal>
        {selectedComplaint?.isModalOpen && (
          <ComplaintModal
            complaintState={selectedComplaint}
            handleClose={() => setSelectedComplaint(null)}
            handleChange={handleInputChange}
            handleAutoCompleteChange={handleAutoCompleteChange}
            handleAdd={() => {
              saveOrUpdateComplaint(
                {
                  url: COMPLAINTS_URL,
                  method: POST,
                  content: {
                    ...selectedComplaint!.complaint,
                    student: studentInfo?.id,
                  },
                },
                {
                  onSuccess: () => {
                    handleAlert(true, "Complaint added Successfully", SUCCESS);
                    setSelectedComplaint(null);
                  },
                  onError: (error) => {
                    handleAlert(true, catchErrorMessage(error), ERROR);
                    setSelectedComplaint(null);
                  },
                }
              );
            }}
          />
        )}
      </Box>
    </>
  );
};

export default Complaints;
