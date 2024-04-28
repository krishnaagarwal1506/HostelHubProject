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
import ApplicationModal from "./ApplicationModal";

import useDialog from "@src/hooks/useDialog";
import useAlert from "@src/hooks/useAlert";
import { AuthContext } from "@context/AuthContext";
import {
  dateFormat,
  sendData,
  fetchData,
  catchErrorMessage,
  extractArrayFromApiData,
  deleteData,
  capitalize,
} from "@utils/index";
import {
  APPLICATIONS_URL,
  APPLICATION_STATUS,
  ERROR,
  STUDENT,
  SUCCESS,
  STATUS_ICONS,
  PENDING,
  APPROVED,
  REJECTED,
  ALL,
  METHOD,
  DELETE,
} from "@src/constant";
import {
  ApplicationsType,
  SeverityType,
  ApplicationStateType,
  ApplicationStatusType,
} from "@ts/types";

type SearchStatusType = ApplicationStatusType | "all";
const { PUT, POST } = METHOD;

const updateApplicationsStatus = async (
  application: ApplicationsType,
  handleAlert: (
    isOpen: boolean,
    message: string,
    serverity: SeverityType
  ) => void
) => {
  const { id } = application;
  const url = `${APPLICATIONS_URL}/${id}`;

  try {
    const isDataUpdated = await sendData({
      url,
      method: PUT,
      content: application,
    });
    const message = isDataUpdated
      ? "Status saved Successfully"
      : "Error in updating status";
    const severity = isDataUpdated ? SUCCESS : ERROR;
    handleAlert(true, message, severity);
  } catch (error) {
    handleAlert(true, catchErrorMessage(error), ERROR);
  }
};

const deleteApplication = async (
  { id }: ApplicationsType,
  handleAlert: (
    isOpen: boolean,
    message: string,
    serverity: SeverityType
  ) => void
) => {
  const url = `${APPLICATIONS_URL}/${id}`;
  try {
    const isDataDeleted = await deleteData(url);
    const message = isDataDeleted
      ? "Application Deleted Successfully"
      : "Error in deleting application";
    const severity = isDataDeleted ? SUCCESS : ERROR;
    handleAlert(true, message, severity);
  } catch (error) {
    handleAlert(true, catchErrorMessage(error), ERROR);
  }
};

const isMenuItemVisible = (optionStatus: string, status: string) => {
  if (optionStatus === PENDING) return true;
  if (optionStatus === APPROVED && status !== PENDING) return true;
  if (optionStatus === REJECTED && status !== PENDING) return true;
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

const Applications = () => {
  const [applicationData, setApplicationData] = useState<
    ApplicationsType[] | null
  >(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedApplication, setSelectedApplication] =
    useState<ApplicationStateType | null>(null);
  const [searchStatus, setSearchStatus] = useState<SearchStatusType>("all");
  const [rowCount, setRowCount] = useState<number>(0);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [action, setAction] = useState<string>("");
  const {
    user: { role, studentInfo },
  } = useContext(AuthContext);
  const theme = useTheme();
  const isScreenSizeMdOrLarger = useMediaQuery(theme.breakpoints.up("md"));
  const isRoleStudent = role === STUDENT;
  const { status: seletedApplicationStatus } =
    selectedApplication?.application || {};
  const { open, handleDialogClick, handleDialogSubmit } = useDialog(
    async () => {
      action === DELETE
        ? await deleteApplication(selectedApplication!.application, handleAlert)
        : await updateApplicationsStatus(
            selectedApplication!.application,
            handleAlert
          );
      getApplicationsData(true, paginationModel.page, searchStatus);
    }
  );
  const { alert, handleAlert } = useAlert();
  const selectMenuItems = [
    { status: PENDING, text: capitalize(PENDING), icon: STATUS_ICONS.pending },
    {
      status: APPROVED,
      text: capitalize(APPROVED),
    },
    {
      status: REJECTED,
      text: capitalize(REJECTED),
      icon: STATUS_ICONS.invalid,
    },
  ];
  const initialAApplication = {
    subject: "",
    description: "",
    status: PENDING,
    student: studentInfo?.id,
  };
  async function getApplicationsData(
    pagination: boolean,
    page = 0,
    searchStatus?: string
  ) {
    try {
      setLoading(true);
      const url = isRoleStudent
        ? `${APPLICATIONS_URL}?populate=*&filters[student][id][$eq]=${studentInfo?.id}&sort=createdAt:desc`
        : `${APPLICATIONS_URL}?populate=*&sort=createdAt:desc`;
      const searchUrl =
        searchStatus === "all"
          ? url
          : `${url}&filters[status][$eq]=${searchStatus}`;
      const response = await fetchData(
        pagination
          ? `${searchUrl}&pagination[page]=${page + 1}&pagination[pageSize]=10`
          : searchUrl
      );
      const data = extractArrayFromApiData<ApplicationsType>(response.data);
      setApplicationData(data);
      setRowCount(data.length);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      handleAlert(true, catchErrorMessage(error), "error");
    }
  }

  const addNewApplication = async (
    application: ApplicationsType,
    handleAlert: (
      isOpen: boolean,
      message: string,
      serverity: SeverityType
    ) => void
  ) => {
    try {
      const isApplicationAdded = await sendData({
        url: APPLICATIONS_URL,
        method: POST,
        content: { ...application, student: studentInfo?.id },
      });
      const message = isApplicationAdded
        ? "Application added Successfully"
        : "Error in adding application";
      const severity = isApplicationAdded ? SUCCESS : ERROR;
      handleAlert(true, message, severity);
      isApplicationAdded &&
        getApplicationsData(true, paginationModel.page, searchStatus);
      setSelectedApplication(null);
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
    setSelectedApplication({
      application: row as ApplicationsType,
      isModalOpen: true,
      isModalEditable,
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSelectedApplication({
      ...selectedApplication!,
      application: {
        ...selectedApplication!.application,
        [name]: value,
      },
    });
  };

  const OnStatusChange = (
    event: SelectChangeEvent<ApplicationStatusType>,
    row: ApplicationsType
  ) => {
    event.stopPropagation();
    const { value } = event.target;
    setSelectedApplication({
      application: { ...row, status: value as ApplicationStatusType },
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
      renderCell: ({ row }) => row.student.data.attributes.studentName,
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
        const { status } = row as ApplicationsType;
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
      headerName: "subject",

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
        const { status } = row as ApplicationsType;
        const isPending = status === PENDING;
        return (
          <>
            {isRoleStudent ? (
              <IconButton
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedApplication((prev) => {
                    return {
                      ...prev!,
                      application: row as ApplicationsType,
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
                onChange={(event: SelectChangeEvent<ApplicationStatusType>) => {
                  OnStatusChange(event, row as ApplicationsType);
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
        {["all", ...APPLICATION_STATUS].map((status) => {
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
                getApplicationsData(true, paginationModel.page, status);
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
                handleOpenModal(event, initialAApplication, true);
              }}
            >
              {isScreenSizeMdOrLarger ? (
                "raise application"
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
          isLoading={loading}
          rows={applicationData || []}
          tableClassName="max-h-full bg-white rounded-xl"
          pagination={true}
          getData={getApplicationsData}
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
              ? "Application will be deleted"
              : `Application status will be changed to ${
                  selectedApplication &&
                  seletedApplicationStatus!.charAt(0).toUpperCase() +
                    seletedApplicationStatus!.slice(1)
                }`}
          </DialogContent>
        </ConfirmationModal>
        {selectedApplication?.isModalOpen && (
          <ApplicationModal
            applicationState={selectedApplication}
            handleClose={() => setSelectedApplication(null)}
            handleChange={handleInputChange}
            handleAdd={() => {
              addNewApplication(selectedApplication!.application, handleAlert);
            }}
          />
        )}
      </Box>
    </>
  );
};

export default Applications;
