import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GuardianInfoForm from "../GuardianInfoForm";
import {
  changeMultipleFields,
  mockStudent,
  mockHandleChange,
  mockValidateError,
  mockGetHelperText,
  guardianDetials,
} from "@src/test-utils/studentInfoPage-utils";

describe("GuardianInfoForm", () => {
  beforeEach(() => {
    render(
      <GuardianInfoForm
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
    expect(screen.getByText("Guardian Name")).toBeInTheDocument();
    expect(screen.getByText("Guardian Phone no.")).toBeInTheDocument();
    expect(screen.getByText("Address")).toBeInTheDocument();
  });

  it("calls handleChange when form fields are changed", () => {
    const textFields = screen.getAllByRole("textbox");
    changeMultipleFields(textFields, guardianDetials);
    expect(mockHandleChange).toHaveBeenCalledTimes(3);
  });

  it("calls validateError and getHelperText when form fields are changed", () => {
    const textFields = screen.getAllByRole("textbox");
    changeMultipleFields(textFields, guardianDetials);
    expect(mockValidateError).toHaveBeenCalled();
    expect(mockGetHelperText).toHaveBeenCalled();
  });
});
