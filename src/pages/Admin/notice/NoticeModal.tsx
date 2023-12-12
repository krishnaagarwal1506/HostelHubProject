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
function getHeading(isEditable: boolean, add: boolean): string {
  if (isEditable) return "Edit Notice";
  if (add) return "Add New Notice";
  return "Notice";
}

const NoticeModal = ({
  selectedNotice,
  handleSubmit,
  handleClose,
  handleChange,
}: NoticePropsTypes) => {
  const { isModalOpen, isEditable, add } = selectedNotice;
  const { title, content, date } = selectedNotice.notice;
  const heading: string = getHeading(isEditable, add);
  const isReadOnly: boolean = !isEditable && !add;
  const textfieldSxValues = {
    "& .MuiOutlinedInput-root": { padding: isReadOnly ? 0 : "default" },
    "& fieldset": { border: isReadOnly ? "none" : "default" },
  };
  const minHeight = isReadOnly ? "min-h-[100px]" : "min-h-[200px]";

  const actions = (
    <>
      <Button variant="outlined" size="large" onClick={handleClose}>
        Cancel
      </Button>
      {(isEditable || add) && (
        <LoadingButton
          buttonText="Save"
          onSubmit={() => handleSubmit(selectedNotice.notice)}
          disabled={!title || !content}
        />
      )}
    </>
  );

  return (
    <DialogModal
      dialogSize="sm"
      isOpen={isModalOpen}
      title={heading}
      TitleIcon={AssignmentIcon}
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
        {isReadOnly && (
          <Typography className="text-gray-500 text-xs">{date}</Typography>
        )}
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
            className: minHeight,
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
