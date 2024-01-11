import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PasswordForm from "../PasswordForm";
import {
  changeMultipleFields,
  mockStudent,
  mockHandleChange,
  mockValidateError,
  mockGetHelperText,
  passwordDetails,
} from "@src/test-utils/studentInfoPage-utils";

const dataTestId = ["password", "confirmPassword"];

describe("PasswordForm", () => {
  beforeEach(() => {
    render(
      <PasswordForm
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
    expect(screen.getByText("Password")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password")).toBeInTheDocument();
  });

  it("calls handleChange when form fields are changed", () => {
    const textFields = dataTestId.map((id) => screen.getByTestId(id));
    changeMultipleFields(textFields, passwordDetails);
    expect(mockHandleChange).toHaveBeenCalledTimes(2);
  });

  it("calls validateError and getHelperText when form fields are changed", () => {
    const textFields = dataTestId.map((id) => screen.getByTestId(id));
    changeMultipleFields(textFields, passwordDetails);
    expect(mockValidateError).toHaveBeenCalledTimes(2);
    expect(mockGetHelperText).toHaveBeenCalledTimes(2);
  });
});

describe("PasswordForm with values", () => {
  it("shows Password when button is clicked", () => {
    render(
      <PasswordForm
        student={{ ...mockStudent(), ...passwordDetails }}
        validateError={mockValidateError}
        getHelperText={mockGetHelperText}
        handleChange={mockHandleChange}
        handleClick={jest.fn()}
      />
    );

    const passwordInput = screen.getByTestId("password");
    const confirmPasswordInput = screen.getByTestId("confirmPassword");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    screen.getAllByTestId("VisibilityOffIcon").forEach((icon) => {
      fireEvent.click(icon);
    });
    expect(passwordInput).toHaveAttribute("type", "text");
    expect(confirmPasswordInput).toHaveAttribute("type", "text");
  });
});
