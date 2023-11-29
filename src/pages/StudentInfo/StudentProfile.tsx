import { useEffect, useState, ChangeEvent } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  DialogContent,
} from "@mui/material";
import { Assessment as AssessmentIcon } from "@mui/icons-material";
import DialogModal from "@components/DialogModal";
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
  const {
    studentName,
    mobileNumber,
    email,
    guardianName,
    guardianPhoneNumber,
    address,
  } = studentInfo;
  useEffect(() => {
    setIsError(!validateForm(studentInfo));
  }, [seletetedStudentState, studentInfo]);

  const actions = isEditable && (
    <>
      <Button variant="outlined" size="large" onClick={handleClose}>
        Cancel
      </Button>
      <Button
        variant="contained"
        size="large"
        disabled={isError}
        onClick={() => handleSubmit(studentInfo)}
      >
        Save
      </Button>
    </>
  );

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
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Name"
              name="studentName"
              value={studentName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!validateText(studentName)}
              helperText={!validateText(studentName) && "Invalid Name"}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Mobile Number"
              name="mobileNumber"
              value={mobileNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!validatePhone(mobileNumber)}
              helperText={
                !validatePhone(mobileNumber) && "Invalid Phone Number"
              }
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Email"
              name="email"
              value={email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!validateEmail(email)}
              helperText={!validateEmail(email) && "Invalid Email"}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Guardian Information</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Guardian Name"
              name="guardianName"
              value={guardianName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!validateText(guardianName)}
              helperText={!validateText(guardianName) && "Invalid Name"}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Guardian Number"
              name="guardianPhoneNumber"
              value={guardianPhoneNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={!validatePhone(guardianPhoneNumber)}
              helperText={
                !validatePhone(guardianPhoneNumber) && "Invalid Phone Number"
              }
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              label="Address"
              name="address"
              value={address}
              onChange={handleChange}
              fullWidth
              margin="normal"
              error={address === ""}
              helperText={address === "" && "Invalid Address"}
              InputProps={{
                readOnly: !isEditable,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </DialogModal>
  );
};

export default StudentProfile;
