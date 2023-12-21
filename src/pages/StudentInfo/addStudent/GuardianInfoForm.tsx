import StepperForm from "./StepperForm";
import { STUDENT_INFO_INPUTS } from "@src/constant";
import { StepperFormType } from "@ts/types";

const GuardianInfoForm = ({
  student,
  validateError,
  getHelperText,
  handleChange,
}: StepperFormType) => {
  const { guardianName, guardianPhoneNumber, address } = student;
  const { guardianNameInput, guardianPhoneNumberInput, addressInput } =
    STUDENT_INFO_INPUTS;
  const formFields = [
    {
      ...guardianNameInput,
      value: guardianName,
      required: true,
      error: validateError(guardianName, "text"),
      helperText: getHelperText(guardianName, "text"),
    },
    {
      ...guardianPhoneNumberInput,
      value: guardianPhoneNumber,
      required: true,
      error: validateError(guardianPhoneNumber, "tel"),
      helperText: getHelperText(guardianPhoneNumber, "tel"),
    },
    {
      ...addressInput,
      value: address,
      required: true,
    },
  ];
  return <StepperForm formFields={formFields} handleChange={handleChange} />;
};

export default GuardianInfoForm;
