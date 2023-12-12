import { ChangeEvent, Fragment, MouseEvent, useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  List,
  Box,
  Button,
  Skeleton,
  DialogContent,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

import NoticeListItem from "./NoticeListItem";
import NoticeModal from "./NoticeModal";
import AlertComponent from "@components/Alert";
import ConfirmationModal from "@components/ConfirmationModal";

import useDialog from "@src/hooks/useDialog.ts";
import useAlert from "@src/hooks/useAlert.ts";
import { sendData, deleteData, catchErrorMessage } from "@utils/index";
import { NoticeDataType, NoticeStateProps, SeverityType } from "@ts/types";
import { NOTICES_URL, METHOD } from "@constant/index";

const saveNotice = async (
  notice: NoticeDataType,
  handleAlert: (
    isOpen: boolean,
    message: string,
    serverity: SeverityType
  ) => void
) => {
  try {
    const { PUT, POST } = METHOD;
    const method = notice.id ? PUT : POST;
    const url = notice.id ? `${NOTICES_URL}/${notice.id}` : NOTICES_URL;
    const isDataSent = await sendData(url, method, notice);
    const message = isDataSent ? "Notice updated" : "Notice added";
    const severity = isDataSent ? "success" : "error";
    handleAlert(true, message, severity);
  } catch (error) {
    handleAlert(true, catchErrorMessage(error), "error");
  }
};

const deleteNotice = async (
  id: number | null,
  handleAlert: (
    isOpen: boolean,
    message: string,
    serverity: SeverityType
  ) => void
) => {
  try {
    if (!id) {
      throw new Error("notice do not exist");
    }
    const url = `${NOTICES_URL}/${id}`;
    const isDataDeleted = await deleteData(url);
    const message = isDataDeleted
      ? "Notice deleted"
      : "Error, Notice not deleted";
    const severity = isDataDeleted ? "success" : "error";
    handleAlert(true, message, severity);
  } catch (error) {
    handleAlert(true, catchErrorMessage(error), "error");
  }
};

type NoticesProps = {
  notices: NoticeDataType[] | null;
  setupdateNoticeCheck: React.Dispatch<React.SetStateAction<boolean>>;
};

const intitalNoticeState: NoticeDataType = {
  title: "",
  date: new Date().toLocaleDateString(),
  content: "",
};

const NoticeList = ({ notices, setupdateNoticeCheck }: NoticesProps) => {
  const [selectedNotice, setSelectedNotice] = useState<NoticeStateProps>({
    notice: intitalNoticeState,
    isModalOpen: false,
    isEditable: false,
    add: false,
  });
  const [deleteNoticeId, setDeleteNoticeId] = useState<number | null>(null);
  const { alert, handleAlert } = useAlert();
  const { isOpen, message, severity } = alert;

  const handleDialog = () => {
    deleteNotice(deleteNoticeId, handleAlert);
    setupdateNoticeCheck((val) => {
      return !val;
    });
  };
  const { open, handleDialogClick, handleDialogSubmit } =
    useDialog(handleDialog);

  const handleOpenNotice = (
    event: MouseEvent<Element>,
    state: string,
    noticeData: NoticeDataType
  ) => {
    event.stopPropagation();
    const isEditable = state === "edit";
    const add = state === "add";
    setSelectedNotice({
      notice: noticeData,
      isEditable,
      add,
      isModalOpen: true,
    });
  };

  const handleClose = (): void => {
    setSelectedNotice((prevState) => {
      return {
        ...prevState,
        isModalOpen: false,
      };
    });
  };

  const handleSubmit = (notice: NoticeDataType): void => {
    saveNotice(notice, handleAlert);
    setupdateNoticeCheck((val) => {
      return !val;
    });
    handleClose();
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    const { name, value }: { name: string; value: string } = event.target;
    setSelectedNotice({
      ...selectedNotice,
      notice: {
        ...selectedNotice.notice,
        [name]: value,
      },
    });
  };

  return (
    <>
      <Paper className="w-full pb-8 md:w-[48%] lg:w-1/2 px-0 h-1/2 md:h-full flex-grow overflow-hidden rounded-xl">
        <Box className="mx-8 my-4 mb-2.5 flex justify-between">
          <Typography className="text-2xl font-medium">Notice</Typography>
          <Button
            className="hover:bg-primary-dark "
            variant="contained"
            endIcon={<AddIcon />}
            onClick={(event) =>
              handleOpenNotice(event, "add", intitalNoticeState)
            }
          >
            Add
          </Button>
        </Box>
        {notices ? (
          <List className="w-full h-[90%] p-0 overflow-y-scroll">
            {notices.reverse().map((notice: NoticeDataType, index: number) => {
              return (
                <Fragment key={notice.id}>
                  <NoticeListItem
                    noticeNumber={index}
                    noticeData={notice}
                    handleOpenNotice={handleOpenNotice}
                    handleOpenConfirmationDialog={() => handleDialogClick(true)}
                    setDeleteNoticeId={setDeleteNoticeId}
                  />
                  {index < notices.length - 1 && <Divider className="mx-8" />}
                </Fragment>
              );
            })}
          </List>
        ) : (
          <>
            {[1, 2, 3].map((index: number) => {
              return (
                <Box key={index.toString()} className="mx-8 h-1/3 pt-4">
                  <Skeleton width="30%" />
                  <Skeleton width="10%" />
                  <Skeleton width="100%" height="80%" />
                </Box>
              );
            })}
          </>
        )}
      </Paper>
      <NoticeModal
        selectedNotice={selectedNotice!}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        handleChange={handleChange}
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
          This notice will be deleted
        </DialogContent>
      </ConfirmationModal>
      {isOpen && (
        <AlertComponent
          severity={severity}
          message={message}
          handleClose={() => handleAlert(false)}
        />
      )}
    </>
  );
};

export default NoticeList;
