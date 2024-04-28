import {
  DialogContent,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import { Assessment } from "@mui/icons-material";

import DialogModal from "@components/DialogModal";
import ChipComponent from "@src/components/Chip";
import LoadingButton from "@components/LoadingButton";
import { ApplicationStateType } from "@ts/types";
import { READ_ONLY_SX_VALUES } from "@constant/index";
import { ChangeEvent } from "react";
import { dateFormat } from "@src/utils";

type ApplicationModalPropsType = {
  applicationState: ApplicationStateType;
  handleClose: () => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAdd: () => void;
};

const ApplicationModal = ({
  applicationState,
  handleClose,
  handleChange,
  handleAdd,
}: ApplicationModalPropsType) => {
  const { application, isModalOpen, isModalEditable } = applicationState;
  const { createdAt, subject, description, status, student } = application;
  const isSaveDisabled = !(subject?.trim() && description?.trim());
  const actions = (
    <>
      <Button variant="outlined" size="large" onClick={handleClose}>
        Close
      </Button>
      {isModalEditable && (
        <LoadingButton
          buttonText="Save"
          onSubmit={handleAdd}
          disabled={isSaveDisabled}
        />
      )}
    </>
  );

  return (
    <DialogModal
      dialogSize="sm"
      isOpen={isModalOpen}
      title="Complaint"
      TitleIcon={Assessment}
      handleClose={handleClose}
      actions={actions}
    >
      <DialogContent className="padding-0 w-full">
        {isModalEditable ? (
          <>
            <Typography variant="h6" className="py-2">
              Type
            </Typography>
            <TextField
              className="width-100"
              id="complaint-type"
              value={subject}
              name="subject"
              required
              placeholder="Add Subject"
              onChange={handleChange}
            />
            <Typography variant="h6" className="py-2">
              Description
            </Typography>
            <TextField
              className="width-100 padding-t-2"
              value={description}
              name="description"
              required
              inputProps={{
                className: "min-h-[100px]",
              }}
              placeholder="Add Description"
              onChange={handleChange}
              multiline
            />
          </>
        ) : (
          <>
            <Box className="md:flex md:items-center md:gap-4">
              <TextField
                className="pr-4 md:w-1/2"
                label="Type"
                value={subject}
                margin="normal"
                InputProps={{
                  readOnly: true,
                  className: "text-gray-500 text-sm md:text-base",
                }}
                fullWidth
                FormHelperTextProps={{
                  className: "mx-0",
                }}
                inputProps={{
                  className: "py-2 px-2 md:py-[0.85rem] md:px-[0.85rem]",
                }}
                sx={READ_ONLY_SX_VALUES}
              />
              <ChipComponent
                className="w-24 capitalize mb-2 md:mb-0"
                text={status}
                type={status}
              />
            </Box>
            <Box className="md:flex md:gap-8">
              <TextField
                className="mt-2 md:mt-4"
                label="Raised By"
                value={student.data.attributes.studentName}
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true,
                  className: "text-gray-500 text-sm md:text-base",
                }}
                inputProps={{
                  className: "py-2 px-2 md:py-[0.85rem] md:px-[0.85rem]",
                }}
                FormHelperTextProps={{
                  className: "mx-0",
                }}
                sx={READ_ONLY_SX_VALUES}
              />
              <TextField
                className="mt-2 md:mt-4"
                label="Created On"
                value={dateFormat(createdAt || "")}
                margin="normal"
                fullWidth
                InputProps={{
                  readOnly: true,
                  className: "text-gray-500 text-sm md:text-base",
                }}
                inputProps={{
                  className: "py-2 px-2 md:py-[0.85rem] md:px-[0.85rem]",
                }}
                FormHelperTextProps={{
                  className: "mx-0",
                }}
                sx={READ_ONLY_SX_VALUES}
              />
            </Box>
            <TextField
              className="mt-2 md:mt-4"
              label="Description"
              value={description}
              name="description"
              margin="normal"
              fullWidth
              InputProps={{
                readOnly: true,
                className: "text-gray-500 text-sm md:text-base",
              }}
              FormHelperTextProps={{
                className: "mx-0",
              }}
              inputProps={{
                className: "min-h-[100px]",
              }}
              sx={READ_ONLY_SX_VALUES}
              multiline
            />
          </>
        )}
      </DialogContent>
    </DialogModal>
  );
};

export default ApplicationModal;
