import { useRef, useState } from "react";
import {
  DialogContent,
  Typography,
  Box,
  Button,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Assessment } from "@mui/icons-material";

import DialogModal from "@components/DialogModal";
import ChipComponent from "@src/components/Chip";
import LoadingButton from "@components/LoadingButton";
import { ApplicationStateType } from "@ts/types";
import { READ_ONLY_SX_VALUES } from "@constant/index";
import { ChangeEvent } from "react";
import { dateFormat } from "@src/utils";
import noImageUploaded from "@assets/noImageUploaded.jpeg";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { application, isModalOpen, isModalEditable } = applicationState;
  const { createdAt, subject, description, status, student, document } =
    application;
  const initalImage = document ? document : "";
  const [selectedImage, setSelectedImage] = useState<string>(initalImage);
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

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    file
      ? setSelectedImage(URL.createObjectURL(file))
      : setSelectedImage(noImageUploaded);
    handleChange(event);
  };

  const handleCardClick = () => {
    const { current } = fileInputRef;
    if (!current) return;
    current.click();
  };

  return (
    <DialogModal
      dialogSize="sm"
      isOpen={isModalOpen}
      title="Application"
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
              id="application-type"
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
            <Typography variant="h6" className="py-2">
              Document (if Any)
            </Typography>
            <TextField
              className="hidden"
              type="file"
              inputRef={fileInputRef}
              inputProps={{
                accept: "image/png, image/jpeg",
                "data-testid": "fileupload",
              }}
              fullWidth
              name="document"
              onChange={handleImageChange}
              required
            />

            <Box
              className={`h-16 w-full cursor-pointer rounded-xl border-2 flex justify-center items-center text-center`}
              onClick={handleCardClick}
            >
              <Box className="m-auto flex">
                <AddIcon className="w-8 h-8 text-primary-main" />
                <Typography className="text-md md:text-lg ">Upload</Typography>
              </Box>
            </Box>
            <Box className="h-full mt-4 w-full mb-4 md:mb:0 flex justify-center items-center rounded-xl border-2 border-dashed border-primary-main">
              <img
                className={"w-full h-auto  m-auto rounded-xl"}
                src={selectedImage || noImageUploaded}
                alt={selectedImage ? "document" : "No Image Uploaded"}
                loading="lazy"
              />
            </Box>
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
            {initalImage && (
              <>
                <Typography variant="body1" className="py-2">
                  Attached Document
                </Typography>
                <Box className="h-full w-full mb-4 md:mb:0 flex justify-center items-center rounded-xl border-2 border-dashed border-primary-main">
                  <img
                    className={"w-auto h-full m-auto rounded-xl"}
                    src={initalImage}
                    alt="document"
                  />
                </Box>
              </>
            )}
          </>
        )}
      </DialogContent>
    </DialogModal>
  );
};

export default ApplicationModal;
