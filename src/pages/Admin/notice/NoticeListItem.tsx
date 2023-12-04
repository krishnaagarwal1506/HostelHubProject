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
  noticeNumber,
  noticeData,
  handleOpenNotice,
  handleOpenConfirmationDialog,
  setDeleteNoticeId,
}: NoticeListItemProps) => {
  //console.log({ noticeData });
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
              <Typography className="font-semibold">
                <span className="pr-2">{noticeNumber + 1}</span>
                {noticeData.title}
              </Typography>

              <Typography className="text-gray-500 text-xs">
                {noticeData.date}
              </Typography>
            </Box>
            <Box id="notice-icon-btns">
              <IconButton
                className="text-sm"
                color="primary"
                onClick={(event) => handleOpenNotice(event, "edit", noticeData)}
              >
                <EditOutlined fontSize="small" />
              </IconButton>
              <IconButton
                color="error"
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
          </Box>
        }
        secondary={
          <Typography className="line-clamp-3">{noticeData.content}</Typography>
        }
      />
    </ListItem>
  );
};

export default NoticeListItem;
