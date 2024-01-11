import { MouseEvent } from "react";
import {
  Typography,
  ListItemText,
  ListItem,
  Box,
  IconButton,
} from "@mui/material";
import { EditOutlined, DeleteOutlineOutlined } from "@mui/icons-material";

import { NoticeDataType } from "@ts/types";

type NoticeListItemProps = {
  isAutherized?: boolean;
  noticeNumber: number;
  noticeData: NoticeDataType;
  handleOpenNotice: (
    event: MouseEvent<Element>,
    state: string,
    noticeData: NoticeDataType
  ) => void;
  handleOpenConfirmationDialog: () => void;
  setDeleteNoticeId: React.Dispatch<React.SetStateAction<number | null>>;
};

const NoticeListItem = ({
  isAutherized = true,
  noticeNumber,
  noticeData,
  handleOpenNotice,
  handleOpenConfirmationDialog,
  setDeleteNoticeId,
}: NoticeListItemProps) => {
  return (
    <ListItem
      className="px-8 cursor-pointer py-1hover:bg-gray-100"
      alignItems="flex-start"
      onClick={(event) => handleOpenNotice(event, "read", noticeData)}
    >
      <ListItemText
        primary={
          <Box className="flex justify-between">
            <Box>
              <Typography className="font-semibold text-sm md:text-base">
                <span className="pr-1">{noticeNumber + 1}.</span>
                {noticeData.title}
              </Typography>

              <Typography className="text-gray-500 text-[0.7rem] md:text-xs ml-[15px]">
                {noticeData.date}
              </Typography>
            </Box>
            {isAutherized && (
              <Box id="notice-icon-btns">
                <IconButton
                  className="text-sm"
                  color="primary"
                  size="small"
                  onClick={(event) =>
                    handleOpenNotice(event, "edit", noticeData)
                  }
                >
                  <EditOutlined fontSize="small" />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={(event) => {
                    event.stopPropagation();
                    setDeleteNoticeId(() => {
                      if (!noticeData.id) return null;
                      else {
                        return noticeData.id;
                      }
                    });
                    handleOpenConfirmationDialog();
                  }}
                >
                  <DeleteOutlineOutlined fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        }
        secondary={
          <Typography className="line-clamp-3 text-sm md:text-base ml-[15px] mr-2.5 mt-1">
            {noticeData.content}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default NoticeListItem;
