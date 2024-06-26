import { ChangeEvent, useState, useEffect, MouseEvent } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Typography,
  useMediaQuery,
  Theme,
  Dialog,
  IconButton,
} from "@mui/material";
import { Close, ArrowBack, ArrowForward } from "@mui/icons-material";

import PersonalInfoForm from "./PersonalInfoForm";
import GuardianInfoForm from "./GuardianInfoForm";
import PasswordForm from "./PasswordForm";
import GovermentIdForm from "./GovermentIdForm";
import AlertComponent from "@components/Alert";
import LoadingButton from "@src/components/LoadingButton";

import useAlert from "@src/hooks/useAlert";
import {
  validateText,
  validateEmail,
  validatePhone,
  validatePassword,
  getHelperText,
  validateError,
} from "@src/utils/validation";
import { AddStudentStateType } from "@ts/types";
import {
  checkEmailExists,
  getLocalStorage,
  setLocalStorage,
  handleFileInputChange,
} from "@utils/index";
import {
  STEPPER_FORM_STEPS_NAME,
  STEPPER_FORM_STEPS_DESCRIPTION,
  ERROR,
} from "@constant/index.ts";
import bgImage from "@assets/bg-sidebar-desktop.svg";

type AddStudentPropsType = {
  handleClose: () => void;
  handleSubmit: (studentInfo: AddStudentStateType) => void;
};

const stepComponents = [
  PersonalInfoForm,
  GuardianInfoForm,
  PasswordForm,
  GovermentIdForm,
];

const isNextButtonDisabled = (
  activeStep: number,
  student: AddStudentStateType
): boolean => {
  switch (activeStep) {
    case 0:
      return (
        validateText(student.studentName) &&
        validateEmail(student.email) &&
        validatePhone(student.mobileNumber)
      );
    case 1:
      return (
        validateText(student.guardianName) &&
        validatePhone(student.guardianPhoneNumber) &&
        student.address.trim() !== ""
      );
    case 2:
      return (
        validatePassword(student.password) &&
        validatePassword(student.confirmPassword) &&
        student.password === student.confirmPassword
      );
    case 3:
      return student.govId !== "" && student.govIdImage !== "";

    default:
      return false;
  }
};

const AddStudent = ({ handleClose, handleSubmit }: AddStudentPropsType) => {
  const [student, setStudent] = useState<AddStudentStateType>({
    studentName: "",
    roomNumber: null,
    mobileNumber: "",
    guardianName: "",
    guardianPhoneNumber: "",
    address: "",
    email: "",
    password: "",
    confirmPassword: "",
    govId: "",
    govIdImage: "",
  });
  const [activeStep, setActiveStep] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  const { alert, handleAlert } = useAlert();
  const ActiveComponent = stepComponents[activeStep];
  const { email } = student;
  const isSmallScreen = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  useEffect(() => {
    const storedStudentInfo = getLocalStorage("studentInfo");
    if (storedStudentInfo) {
      setStudent(JSON.parse(storedStudentInfo));
    }
  }, []);
  useEffect(() => {
    const isDisabled = !isNextButtonDisabled(activeStep, student);
    setIsDisabled(isDisabled);
  }, [student, activeStep]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = event.target;

    if (type === "file") {
      handleFileInputChange(event, (base64String) => {
        setStudent((student) => {
          return {
            ...student,
            ...(base64String ? { govIdImage: base64String || "" } : {}),
          };
        });
      });
    } else {
      setStudent((student) => {
        return {
          ...student,
          [name]: value,
        };
      });
    }
  };

  const handleClick = ({
    currentTarget: { innerText },
  }: MouseEvent<HTMLDivElement>) => {
    setStudent((student) => {
      return {
        ...student,
        govId: innerText,
      };
    });
  };

  const handleNext = async () => {
    if (activeStep === 0) {
      try {
        const emailExists = await checkEmailExists(email);
        if (emailExists) {
          handleAlert(true, "Email already exists", ERROR);
          return;
        }
      } catch (err) {
        handleAlert(true, "Something went wrong", ERROR);
        return;
      }
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleSaveAndClose = () => {
    setLocalStorage("studentInfo", JSON.stringify(student));
    handleClose();
  };

  return (
    <Dialog
      open={true}
      title="Add Student"
      onClose={handleSaveAndClose}
      maxWidth="lg"
      PaperProps={{
        className: "rounded-xl w-[50rem] h-[75vh] md:h-[65vh] p-3 pr-1",
      }}
    >
      <Box className="h-full w-full">
        <Grid
          container
          className="h-full w-[98%] !ml-0"
          columnSpacing={{ xs: 0, md: 2 }}
        >
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              backgroundImage: `url(${bgImage})`,
            }}
            className="bg-cover bg-no-repeat bg-center rounded-xl h-16 md:h-full"
          >
            <Box className="h-full rounded-xl pt-4 md:pl-8">
              <Stepper
                activeStep={activeStep}
                orientation={isSmallScreen ? "horizontal" : "vertical"}
                className="flex-row mb-2 md:mt-4 md:mb-0 md:flex-col"
                sx={{
                  "& .MuiStepLabel-root": {
                    height: "32px",
                  },
                  "& .MuiStepConnector-line": {
                    xs: {
                      marginLeft: "3px",
                    },
                    md: { minHeight: "3.5rem" },
                    borderColor: ({
                      palette: {
                        primary: { main },
                      },
                    }) => main,
                  },
                  "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line, .MuiStepConnector-root.Mui-active .MuiStepConnector-line":
                    {
                      borderLeftWidth: 2,
                      borderColor: "white",
                    },
                  "& .MuiStepIcon-root.Mui-completed": {
                    fill: "white",
                  },
                }}
              >
                {STEPPER_FORM_STEPS_NAME.map((label, index) => {
                  return (
                    <Step key={label}>
                      <StepLabel
                        sx={{
                          "& .MuiStepLabel-label": {
                            display: { xs: "none", md: "block" },
                          },
                          "& .MuiStepIcon-root": {
                            border: "1px solid white",
                            borderRadius: "50%",
                            width: "2rem",
                            height: "2rem",
                            fill: "white",
                            marginLeft: { xs: "6px", md: "0px" },
                          },
                          "& .MuiStepIcon-text": {
                            fill: "black",
                          },
                        }}
                      >
                        <Typography className="text-sm text-white">{`Step ${
                          index + 1
                        }`}</Typography>
                        <Typography className="text-white text-lg">
                          {label}
                        </Typography>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </Box>
          </Grid>
          <Grid item xs={12} md={8} className="flex flex-col md:h-full pt-4">
            <Box className="flex justify-between">
              <Box>
                <Typography variant="h6" className="font-semibold">
                  {STEPPER_FORM_STEPS_NAME[activeStep]}
                </Typography>
                <Typography className="text-gray-400 ">
                  {STEPPER_FORM_STEPS_DESCRIPTION[activeStep]}
                </Typography>
              </Box>
              <IconButton
                onClick={handleSaveAndClose}
                className="hidden md:block  bottom-6 left-4 hover:bg-inherit"
              >
                <Close className="hover:bg-slate-100 rounded-full  w-10 h-10 p-2 " />
              </IconButton>
            </Box>
            <ActiveComponent
              student={student}
              validateError={validateError}
              getHelperText={getHelperText}
              handleChange={handleChange}
              handleClick={handleClick}
            />
            <Box className="flex gap-x-6 justify-end ">
              {activeStep !== 0 && (
                <Button
                  onClick={handleBack}
                  variant="outlined"
                  size="medium"
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
              )}
              {activeStep === STEPPER_FORM_STEPS_NAME.length - 1 ? (
                <LoadingButton
                  buttonText="Submit"
                  onSubmit={() => handleSubmit(student)}
                  disabled={isDisabled}
                  size="medium"
                />
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={isDisabled}
                  variant="contained"
                  size="medium"
                  endIcon={<ArrowForward />}
                >
                  Next
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
      {alert.isOpen && (
        <AlertComponent
          severity={alert.severity}
          message={alert.message}
          handleClose={() => handleAlert(false)}
        />
      )}
    </Dialog>
  );
};

export default AddStudent;
