import { ChangeEvent } from "react";
import { DialogContent, Button, TextField, Typography } from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";

import DialogModal from "@components/DialogModal";
import LoadingButton from "@src/components/LoadingButton";
import { NoticeStateProps, NoticeDataType } from "@ts/types";

type NoticePropsTypes = {
  selectedNotice: NoticeStateProps;
  handleSubmit: (notice: NoticeDataType) => void;
  handleClose: () => void;
  handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};
function getHeading(isEditable: boolean, addNewNotice: boolean): string {
  if (isEditable) return "Edit Notice";
  if (addNewNotice) return "Add New Notice";
  return "Notice";
}

const NoticeModal = ({
  selectedNotice,
  handleSubmit,
  handleClose,
  handleChange,
}: NoticePropsTypes) => {
  const { isNoticeModalOpen, isEditable, addNewNotice } = selectedNotice;
  const { title, content, date } = selectedNotice.notice;
  const heading: string = getHeading(isEditable, addNewNotice);
  const isReadOnly: boolean = !isEditable && !addNewNotice;
  const textfieldSxValues = {
    "& .MuiOutlinedInput-root": { padding: isReadOnly ? 0 : "default" },
    "& fieldset": { border: isReadOnly ? "none" : "default" },
  };

  const actions = (isEditable || addNewNotice) && (
    <>
      <Button variant="outlined" size="large" onClick={handleClose}>
        Cancel
      </Button>
      <LoadingButton
        buttonText="Save"
        onSubmit={() => handleSubmit(selectedNotice.notice)}
        disabled={!title || !content}
      />
    </>
  );

  return (
    <DialogModal
      dialogSize="sm"
      isOpen={isNoticeModalOpen}
      title={heading}
      TitleIcon={AssignmentIcon}
      subtitle={isReadOnly && date}
      handleClose={handleClose}
      actions={actions}
    >
      <DialogContent className="padding-0">
        {!isReadOnly && (
          <Typography variant="h6" className="padding-t-2 ">
            Notice Title
          </Typography>
        )}
        <TextField
          className="width-100"
          sx={textfieldSxValues}
          value={title}
          rows={1}
          name="title"
          placeholder="Add title"
          multiline
          required
          onChange={handleChange}
          inputProps={{
            readOnly: isReadOnly,
            style: {
              fontWeight: 600,
            },
          }}
        />
        {!isReadOnly && (
          <Typography variant="h6" className="padding-t-2">
            Notice Content
          </Typography>
        )}
        <TextField
          className={`width-100 padding-t-2 ${
            isReadOnly ? "margin-top-1-5" : "margin-top-0-5"
          }`}
          sx={textfieldSxValues}
          value={content}
          name="content"
          required
          inputProps={{
            readOnly: isReadOnly,
            className: "min-height-200",
          }}
          autoFocus={!isReadOnly}
          placeholder="Add Content"
          onChange={handleChange}
          multiline
        />
      </DialogContent>
    </DialogModal>
  );
};

export default NoticeModal;
