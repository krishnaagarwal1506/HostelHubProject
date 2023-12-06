import StepperForm from "./StepperForm";
import {
  STUDENT_NAME_INPUT,
  STUDENT_EMAIL_INPUT,
  STUDENT_PHONE_INPUT,
} from "@src/constant";
import { StepperFormType } from "@ts/types";

const PersonalInfoForm = ({
  student,
  validateError,
  getHelperText,
  handleChange,
}: StepperFormType) => {
  const { studentName, email, mobileNumber } = student;
  const formFields = [
    {
      ...STUDENT_NAME_INPUT,
      value: studentName,
      error: validateError(studentName, "text"),
      helperText: getHelperText(studentName, "text"),
    },
    {
      ...STUDENT_EMAIL_INPUT,
      value: email,
      error: validateError(email, "email"),
      helperText: getHelperText(email, "email"),
    },
    {
      ...STUDENT_PHONE_INPUT,
      value: mobileNumber,
      error: validateError(mobileNumber, "tel"),
      helperText: getHelperText(mobileNumber, "tel"),
    },
  ];

  return <StepperForm formFields={formFields} handleChange={handleChange} />;
};

export default PersonalInfoForm;
