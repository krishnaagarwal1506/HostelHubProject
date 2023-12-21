import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import StepperForm from "./StepperForm";
import { StepperFormType } from "@ts/types";
import { STUDENT_INFO_INPUTS } from "@src/constant";
import { IconButton } from "@mui/material";

const GuardianInfoForm = ({
  student,
  validateError,
  getHelperText,
  handleChange,
}: StepperFormType) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const { password, confirmPassword } = student;
  const { passwordInput, confirmPasswordInput } = STUDENT_INFO_INPUTS;
  const formDetails = [
    {
      ...passwordInput,
      value: password,
      required: true,
      error: validateError(password, "password"),
      helperText: getHelperText(password, "password"),
      type: showPassword ? "text" : "password",
      endAdorment: (
        <IconButton onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      ),
    },
    {
      ...confirmPasswordInput,
      value: confirmPassword,
      required: true,
      error:
        validateError(confirmPassword, "password") ||
        (!!confirmPassword && password !== confirmPassword),
      helperText: getHelperText(confirmPassword, "confirmPassword", password),
      type: showConfirmPassword ? "text" : "password",
      endAdorment: (
        <IconButton
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
        </IconButton>
      ),
    },
  ];
  return <StepperForm formFields={formDetails} handleChange={handleChange} />;
};

export default GuardianInfoForm;
