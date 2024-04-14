import { ChangeEvent, Fragment, MouseEvent, useState, useContext } from "react";
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
import { Add as AddIcon, SmsFailedOutlined } from "@mui/icons-material";

import NoticeListItem from "./NoticeListItem";
import NoticeModal from "./NoticeModal";
import AlertComponent from "@components/Alert";
import ConfirmationModal from "@components/ConfirmationModal";

import { AuthContext } from "@context/AuthContext";
import useDialog from "@src/hooks/useDialog.ts";
import useAlert from "@src/hooks/useAlert.ts";
import { catchErrorMessage, todayDate } from "@utils/index";
import { NoticeDataType, NoticeStateProps } from "@ts/types";
import {
  NOTICES_URL,
  METHOD,
  SUCCESS,
  ERROR,
  ADMIN,
  DELETE,
} from "@constant/index";
import {
  useSaveNotice,
  SendDataParams,
  useDeleteNotice,
} from "@src/queryHooks/query";

type NoticesProps = {
  notices: NoticeDataType[] | null;
};

const intitalNoticeState: NoticeDataType = {
  title: "",
  date: todayDate(),
  content: "",
};

const NoticeList = ({ notices }: NoticesProps) => {
  const [selectedNotice, setSelectedNotice] = useState<NoticeStateProps>({
    notice: intitalNoticeState,
    isModalOpen: false,
    isEditable: false,
    add: false,
  });
  const [deleteNoticeId, setDeleteNoticeId] = useState<number | null>(null);
  const {
    user: { role },
  } = useContext(AuthContext);
  const isUserAdmin = role === ADMIN;
  const { alert, handleAlert } = useAlert();
  const { isOpen, message, severity } = alert;
  const { mutate: saveOrUpdateNotice } = useSaveNotice();
  const { mutate: deleteNotice } = useDeleteNotice();

  const handleDialog = () => {
    try {
      if (!deleteNoticeId) {
        throw new Error("notice do not exist");
      }
      const url = `${NOTICES_URL}/${deleteNoticeId}`;
      deleteNotice(url, {
        onSuccess: () => {
          handleAlert(true, "Notice deleted", SUCCESS);
        },
        onError: () => handleAlert(true, "Error, Notice not deleted", ERROR),
      });
    } catch (error) {
      handleAlert(true, catchErrorMessage(error), ERROR);
    }
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
    const { PUT, POST } = METHOD;
    const method = notice.id ? PUT : POST;
    const url = notice.id ? `${NOTICES_URL}/${notice.id}` : NOTICES_URL;
    const params: SendDataParams = {
      url,
      method,
      content: notice,
    };
    saveOrUpdateNotice(params, {
      onSuccess: () => {
        const message = method === PUT ? "Notice updated" : "Notice added";
        handleAlert(true, message, SUCCESS);
      },
      onError(error) {
        handleAlert(true, error.message, ERROR);
      },
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
      <Paper
        className="w-full pb-8 md:w-[48%] lg:w-1/2 px-0 h-[50vh] md:h-full flex-grow overflow-hidden rounded-xl"
        data-testid="notice-component"
      >
        <Box className="mx-8 my-4 mb-2.5 flex justify-between">
          <Typography className="text-xl md:text-2xl font-medium">
            Notice
          </Typography>
          {isUserAdmin && (
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
          )}
        </Box>
        {notices ? (
          notices.length > 0 ? (
            <List className="w-full h-[90%] p-0 overflow-y-scroll">
              {notices.map((notice: NoticeDataType, index: number) => {
                return (
                  <Fragment key={notice.id}>
                    <NoticeListItem
                      isAutherized={isUserAdmin}
                      noticeNumber={index}
                      noticeData={notice}
                      handleOpenNotice={handleOpenNotice}
                      handleOpenConfirmationDialog={() =>
                        handleDialogClick(true)
                      }
                      setDeleteNoticeId={setDeleteNoticeId}
                    />
                    {index < notices.length - 1 && <Divider className="mx-8" />}
                  </Fragment>
                );
              })}
            </List>
          ) : (
            <Box className="h-[90%] flex flex-col gap-y-4 justify-center items-center">
              <SmsFailedOutlined color="primary" className="w-20 h-20" />
              <p>No notices</p>
            </Box>
          )
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
        buttontext={DELETE}
        buttonType={DELETE}
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
