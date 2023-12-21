import {
  DialogContent,
  Typography,
  Box,
  Button,
  TextField,
  Autocomplete,
} from "@mui/material";
import { Assessment } from "@mui/icons-material";

import DialogModal from "@components/DialogModal";
import ChipComponent from "@src/components/Chip";
import LoadingButton from "@components/LoadingButton";
import { ComplaintStateType } from "@ts/types";
import { COMPLAINT_TYPES_OPTIONS, READ_ONLY_SX_VALUES } from "@constant/index";
import { ChangeEvent } from "react";

type ComplaintModalPropsType = {
  complaintState: ComplaintStateType;
  handleClose: () => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleAutoCompleteChange: (type: string | null) => void;
  handleAdd: () => void;
};

const ComplaintModal = ({
  complaintState,
  handleClose,
  handleChange,
  handleAutoCompleteChange,
  handleAdd,
}: ComplaintModalPropsType) => {
  const { complaint, isModalOpen, isModalEditable } = complaintState;
  const { date, type, description, status, studentName } = complaint;
  const isSaveDisabled = !(type?.trim() && description?.trim());
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
            <Autocomplete
              className="width-100"
              id="complaint-type"
              options={COMPLAINT_TYPES_OPTIONS.map((option) => option)}
              renderInput={(params) => <TextField {...params} />}
              onChange={(event, newValue) => {
                event.preventDefault();
                handleAutoCompleteChange(newValue);
              }}
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
                value={type}
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
                value={studentName}
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
                value={date}
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

export default ComplaintModal;
