import StepperForm from "./StepperForm";
import { STUDENT_INFO_INPUTS } from "@src/constant";
import { StepperFormType } from "@ts/types";

const PersonalInfoForm = ({
  student,
  validateError,
  getHelperText,
  handleChange,
}: StepperFormType) => {
  const { studentName, email, mobileNumber } = student;
  const { studentNameInput, emailInput, mobileNumberInput } =
    STUDENT_INFO_INPUTS;
  const formFields = [
    {
      ...studentNameInput,
      value: studentName,
      error: validateError(studentName, "text"),
      helperText: getHelperText(studentName, "text"),
    },
    {
      ...emailInput,
      value: email,
      error: validateError(email, "email"),
      helperText: getHelperText(email, "email"),
    },
    {
      ...mobileNumberInput,
      value: mobileNumber,
      error: validateError(mobileNumber, "tel"),
      helperText: getHelperText(mobileNumber, "tel"),
    },
  ];

  return <StepperForm formFields={formFields} handleChange={handleChange} />;
};

export default PersonalInfoForm;
