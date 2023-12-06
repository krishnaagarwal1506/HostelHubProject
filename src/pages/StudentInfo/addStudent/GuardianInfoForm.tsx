import StepperForm from "./StepperForm";
import {
  GUARDIAN_NAME_INPUT,
  GUARDIAN_PHONE_INPUT,
  ADDRESS_INPUT,
} from "@src/constant";
import { StepperFormType } from "@ts/types";

const GuardianInfoForm = ({
  student,
  validateError,
  getHelperText,
  handleChange,
}: StepperFormType) => {
  const { guardianName, guardianPhoneNumber, address } = student;
  const formFields = [
    {
      ...GUARDIAN_NAME_INPUT,
      value: guardianName,
      required: true,
      error: validateError(guardianName, "text"),
      helperText: getHelperText(guardianName, "text"),
    },
    {
      ...GUARDIAN_PHONE_INPUT,
      value: guardianPhoneNumber,
      required: true,
      error: validateError(guardianPhoneNumber, "tel"),
      helperText: getHelperText(guardianPhoneNumber, "tel"),
    },
    {
      ...ADDRESS_INPUT,
      value: address,
      required: true,
    },
  ];
  return <StepperForm formFields={formFields} handleChange={handleChange} />;
};

export default GuardianInfoForm;
