import { ChangeEvent } from "react";
import { DialogContent, Button, TextField, Typography } from "@mui/material";

import AssignmentIcon from "@mui/icons-material/Assignment";

import DialogModal from "@components/DialogModal";
import LoadingButton from "@src/components/LoadingButton";
import { NoticeStateProps, NoticeDataType } from "@ts/types";
import { READ_ONLY_SX_VALUES } from "@src/constant";

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

  const actions = (
    <>
      <Button variant="outlined" size="large" onClick={handleClose}>
        Cancel
      </Button>
      {(isEditable || add) && (
        <LoadingButton
          buttonText="Save"
          onSubmit={() => handleSubmit(selectedNotice.notice)}
          disabled={!(title?.trim() && content?.trim())}
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
          <Typography variant="h6" className="text-lg md:text-xl padding-t-2 ">
            Title
          </Typography>
        )}
        <TextField
          className={isReadOnly ? "mt-2 md:w-[45%] md:mr-[5%]" : ""}
          value={title}
          rows={1}
          name="title"
          placeholder="Add title"
          label={isReadOnly ? "Title" : null}
          multiline
          fullWidth
          required={!isReadOnly}
          onChange={handleChange}
          InputProps={{
            readOnly: isReadOnly,
            className: isReadOnly
              ? "text-gray-500 text-sm md:text-base"
              : "text-sm md:text-base",
          }}
          sx={isReadOnly ? READ_ONLY_SX_VALUES : null}
        />
        {!isReadOnly && (
          <Typography variant="h6" className="text-lg md:text-xl padding-t-2">
            Content
          </Typography>
        )}
        {isReadOnly && (
          <TextField
            className="ml-auto w-1/2 md:mt-2"
            label="Created On"
            value={date}
            margin="normal"
            InputProps={{
              readOnly: true,
              className: "text-gray-500 text-sm md:text-base",
            }}
            FormHelperTextProps={{
              className: "mx-0",
            }}
            sx={READ_ONLY_SX_VALUES}
          />
        )}
        <TextField
          className={isReadOnly ? "mt-2" : "padding-t-2 margin-top-0-5"}
          value={content}
          name="content"
          required={!isReadOnly}
          label={isReadOnly ? "Content" : null}
          inputProps={{
            className: "min-h-[100px]  md:min-h-[200px]",
          }}
          fullWidth
          placeholder="Add Content"
          onChange={handleChange}
          multiline
          InputProps={{
            readOnly: isReadOnly,
            className: isReadOnly
              ? "text-gray-500 text-sm md:text-base"
              : "text-sm md:text-base",
          }}
          sx={isReadOnly ? READ_ONLY_SX_VALUES : null}
        />
      </DialogContent>
    </DialogModal>
  );
};

export default NoticeModal;
