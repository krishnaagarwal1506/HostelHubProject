import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PersonalInfoForm from "../PersonalInfoForm";
import {
  changeMultipleFields,
  mockStudent,
  mockHandleChange,
  mockValidateError,
  mockGetHelperText,
  studentDetails,
} from "@src/test-utils/studentInfoPage-utils";

describe("PersonalInfoForm", () => {
  beforeEach(() => {
    render(
      <PersonalInfoForm
        student={{ ...mockStudent() }}
        validateError={mockValidateError}
        getHelperText={mockGetHelperText}
        handleChange={mockHandleChange}
        handleClick={jest.fn()}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("snapshot", () => {
    expect(screen).toMatchSnapshot();
  });

  it("renders form fields correctly", () => {
    expect(screen.getByText("Student Name")).toBeInTheDocument();
    expect(screen.getByText("Student Email")).toBeInTheDocument();
    expect(screen.getByText("Mobile Number")).toBeInTheDocument();
  });

  it("calls handleChange when form fields are changed", () => {
    const textFields = screen.getAllByRole("textbox");
    changeMultipleFields(textFields, studentDetails);
    expect(mockHandleChange).toHaveBeenCalledTimes(3);
  });

  it("calls validateError and getHelperText when form fields are changed", () => {
    const textFields = screen.getAllByRole("textbox");
    changeMultipleFields(textFields, studentDetails);
    expect(mockValidateError).toHaveBeenCalledTimes(3);
    expect(mockGetHelperText).toHaveBeenCalledTimes(3);
  });
});
