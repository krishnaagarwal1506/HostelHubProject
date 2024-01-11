import { fireEvent } from "@testing-library/react";

export const mockStudent = () => {
  return {
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
  };
};

export const mockHandleChange = jest.fn();
export const mockValidateError = jest.fn();
export const mockGetHelperText = jest.fn();
export const mockHandleClick = jest.fn();

export function changeMultipleFields(
  textFields: HTMLElement[],
  details: { [key: string]: string | number | null | undefined }
) {
  textFields.forEach((textField) => {
    const name = textField.getAttribute("name");
    if (name) {
      fireEvent.change(textField, {
        target: { value: details[name] },
      });
    }
  });
}

export const studentDetails: {
  [key: string]: string | number | null | undefined;
} = {
  studentName: "John Doe",
  email: "john@gmail.com",
  mobileNumber: "9994567890",
};

export const guardianDetials: {
  [key: string]: string | number | null | undefined;
} = {
  guardianName: "John Doe",
  guardianPhoneNumber: "9994567890",
  address: "123, Main Street, New York",
};

export const passwordDetails: {
  [key: string]: string | number | null | undefined;
} = {
  password: "12345678",
  confirmPassword: "12345678",
};

export const govermentidDetails: {
  [key: string]: string | number | null | undefined;
} = {
  govId: "Pan Card",
  govIdImage: "Base64 string",
};
