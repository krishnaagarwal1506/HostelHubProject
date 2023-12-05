import { useEffect, useState, ChangeEvent } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  DialogContent,
  TextFieldProps,
} from "@mui/material";
import { Assessment as AssessmentIcon } from "@mui/icons-material";
import DialogModal from "@components/DialogModal";
import LoadingButton from "@components/LoadingButton";
import {
  STUDENT_NAME_INPUT,
  STUDENT_EMAIL_INPUT,
  STUDENT_PHONE_INPUT,
  GUARDIAN_NAME_INPUT,
  GUARDIAN_PHONE_INPUT,
  ADDRESS_INPUT,
  READ_ONLY_SX_VALUES,
} from "@src/constant";
import { StudentInfoStateType, StudentInfoType } from "@src/ts/types";
import { validateEmail, validatePhone, validateText } from "@utils/validation";

type StudentProfileProps = {
  open: boolean;
  seletetedStudentState: StudentInfoStateType;
  handleChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  handleClose: () => void;
  handleSubmit: (studentInfo: StudentInfoType) => void;
};
const validateForm = (studentInfo: StudentInfoType) => {
  const {
    studentName,
    mobileNumber,
    email,
    guardianName,
    guardianPhoneNumber,
    address,
  } = studentInfo;
  const errors = {
    studentName: !validateText(studentName),
    mobileNumber: !validatePhone(mobileNumber),
    email: !validateEmail(email),
    guardianName: !validateText(guardianName),
    guardianPhoneNumber: !validatePhone(guardianPhoneNumber),
    address: address === "",
  };
  return !Object.values(errors).some((error) => error);
};

const StudentProfile = ({
  open = false,
  seletetedStudentState,
  handleClose,
  handleChange,
  handleSubmit,
}: StudentProfileProps) => {
  const [isError, setIsError] = useState(false);
  const { studentInfo, isEditable } = seletetedStudentState;

  useEffect(() => {
    setIsError(!validateForm(studentInfo));
  }, [seletetedStudentState, studentInfo]);

  const actions = isEditable && (
    <>
      <Button variant="outlined" size="large" onClick={handleClose}>
        Cancel
      </Button>
      <LoadingButton
        disabled={isError}
        onSubmit={() => handleSubmit(studentInfo)}
        buttonText="Save"
      />
    </>
  );

  const textfieldSxValues = !isEditable ? READ_ONLY_SX_VALUES : null;
  const {
    studentName,
    mobileNumber,
    email,
    guardianName,
    guardianPhoneNumber,
    address,
    roomNumber,
    govId,
    govIdImage,
  } = studentInfo;
  const textColor = isEditable ? "inherit" : "text-gray-500";
  const commonProps: {
    sx: TextFieldProps["sx"];
    required: TextFieldProps["required"];
    fullWidth: TextFieldProps["fullWidth"];
    margin: TextFieldProps["margin"];
    InputProps: TextFieldProps["InputProps"];
  } = {
    sx: { ...textfieldSxValues },
    required: isEditable,
    fullWidth: true,
    margin: "normal",
    InputProps: {
      readOnly: !isEditable,
      className: textColor,
    },
  };
  return (
    <DialogModal
      title="Student Profile"
      isOpen={open}
      TitleIcon={AssessmentIcon}
      handleClose={handleClose}
      actions={actions}
    >
      <DialogContent className="padding-0">
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12}>
            <Typography variant="h6">Student Information</Typography>
          </Grid>
          <Grid item xs={12} sm={6} className="pt-0">
            <TextField
              {...STUDENT_NAME_INPUT}
              value={studentName}
              onChange={handleChange}
              error={!validateText(studentName)}
              helperText={!validateText(studentName) && "Invalid Name"}
              {...commonProps}
            />
          </Grid>
          <Grid item xs={12} sm={6} className="pt-0">
            <TextField
              {...STUDENT_PHONE_INPUT}
              value={mobileNumber}
              onChange={handleChange}
              error={!validatePhone(mobileNumber)}
              helperText={
                !validatePhone(mobileNumber) && "Invalid Phone Number"
              }
              {...commonProps}
            />
          </Grid>
          <Grid item xs={12} sm={6} className="pt-0">
            <TextField
              {...STUDENT_EMAIL_INPUT}
              value={email}
              onChange={handleChange}
              error={!validateEmail(email)}
              helperText={!validateEmail(email) && "Invalid Email"}
              {...commonProps}
            />
          </Grid>
          <Grid item xs={12} sm={6} className="pt-0">
            <TextField
              label="Room Number"
              value={roomNumber || "---"}
              margin="normal"
              fullWidth
              InputProps={{
                readOnly: true,
                className: "text-gray-500",
              }}
              sx={READ_ONLY_SX_VALUES}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Guardian Information</Typography>
          </Grid>
          <Grid item xs={12} sm={6} className="pt-0">
            <TextField
              {...GUARDIAN_NAME_INPUT}
              value={guardianName}
              onChange={handleChange}
              error={!validateText(guardianName)}
              helperText={!validateText(guardianName) && "Invalid Name"}
              {...commonProps}
            />
          </Grid>
          <Grid item xs={12} sm={6} className="pt-0">
            <TextField
              {...GUARDIAN_PHONE_INPUT}
              value={guardianPhoneNumber}
              onChange={handleChange}
              error={!validatePhone(guardianPhoneNumber)}
              helperText={
                !validatePhone(guardianPhoneNumber) && "Invalid Phone Number"
              }
              {...commonProps}
            />
          </Grid>
          <Grid item xs={12} className="pt-0">
            <TextField
              {...ADDRESS_INPUT}
              value={address}
              onChange={handleChange}
              error={address === ""}
              helperText={address === "" && "Invalid Address"}
              {...commonProps}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">{govId}</Typography>
          </Grid>

          <Grid item xs={12}>
            <img
              className={"w-auto h-44 m-auto"}
              src={govIdImage}
              alt="gov-id-img"
            />
          </Grid>
        </Grid>
      </DialogContent>
    </DialogModal>
  );
};

export default StudentProfile;
