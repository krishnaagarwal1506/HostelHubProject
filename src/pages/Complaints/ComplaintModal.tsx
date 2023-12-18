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
import ChipComponent from "@components/Clip";
import LoadingButton from "@components/LoadingButton";
import { ComplaintStateType } from "@ts/types";
import { getStatusColor } from "@utils/index";
import { STATUS_ICONS, COMPLAINT_TYPES_OPTIONS } from "@constant/index";
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
  const { textColor } = getStatusColor(status, true);
  const Icon = STATUS_ICONS[status];
  const isSaveDisabled = !type || !description;
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
            <Typography variant="h6" className="padding-t-2 ">
              Type
            </Typography>
            <Autocomplete
              className="width-100"
              id="complaint-type"
              options={COMPLAINT_TYPES_OPTIONS.map((option) => option)}
              renderInput={(params) => (
                <TextField {...params} label="Add Type" />
              )}
              onChange={(event, newValue) => {
                event.preventDefault();
                handleAutoCompleteChange(newValue);
              }}
            />
            <Typography variant="h6" className="padding-t-2">
              Description
            </Typography>
            <TextField
              className="width-100 padding-t-2"
              value={description}
              name="description"
              required
              inputProps={{
                className: "min-h-[200px]",
              }}
              placeholder="Add Description"
              onChange={handleChange}
              multiline
            />
          </>
        ) : (
          <>
            <Box className="flex justify-between items-center">
              <Box>
                <Typography className="font-semibold">{type}</Typography>
                <Typography className="text-gray-500 text-xs">
                  {date}
                </Typography>
              </Box>
              <ChipComponent
                className="w-24 capitalize"
                text={status}
                type={status}
                icon={<Icon fontSize="small" className={textColor} />}
              />
            </Box>
            <Typography className="mt-2 min-h-[4rem]">{description}</Typography>
            <Typography className="ml-auto italic text-primary-light">
              {studentName}
            </Typography>
          </>
        )}
      </DialogContent>
    </DialogModal>
  );
};

export default ComplaintModal;
