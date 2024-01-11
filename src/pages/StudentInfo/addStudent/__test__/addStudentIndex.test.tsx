import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import AddStudent from "../index";
import {
  changeMultipleFields,
  studentDetails,
  guardianDetials,
  passwordDetails,
} from "@src/test-utils/studentInfoPage-utils";
import { checkEmailExists, getLocalStorage, setLocalStorage } from "@src/utils";

const mockHandleClose = jest.fn();
const mockHandleSubmit = jest.fn();
export const mockStepperFormLabels = [
  "Personal Info",
  "Guardian Info",
  "Password",
  "Goverment Id.",
];
const passwordDataTestId = ["password", "confirmPassword"];
const invalidPasswordDetails = {
  password: "123",
  confirmPassword: "123",
};

const unequalPasswordDetails = {
  password: "12345678",
  confirmPassword: "123456789",
};

jest.mock("@utils/index.ts", () => ({
  ...jest.requireActual("@utils/index.ts"),
  checkEmailExists: jest.fn(),
  getLocalStorage: jest.fn(),
  setLocalStorage: jest.fn(),
}));

async function fillFormFields(details: {
  [key: string]: string | number | undefined | null;
}) {
  const textFields = screen.getAllByRole("textbox");
  changeMultipleFields(textFields, details);
}

async function clickNextButtonAndCheckState(isDisabled: boolean) {
  const nextButton = screen.getByRole("button", { name: /Next/i });
  fireEvent.click(nextButton);
  await waitFor(() => {
    const nextButton = screen.getByRole("button", { name: /Next/i });
    if (isDisabled) expect(nextButton).toBeDisabled();
    else expect(nextButton).toBeEnabled();
  });
}

describe("snapshot test", () => {
  it("snapshot", async () => {
    const { asFragment } = render(
      <ThemeProvider theme={createTheme()}>
        <AddStudent
          handleClose={mockHandleClose}
          handleSubmit={mockHandleSubmit}
        />
      </ThemeProvider>
    );
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });
});

describe("AddStudent", () => {
  beforeEach(() => {
    render(
      <ThemeProvider theme={createTheme()}>
        <AddStudent
          handleClose={mockHandleClose}
          handleSubmit={mockHandleSubmit}
        />
      </ThemeProvider>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields correctly", () => {
    expect(screen.getByText("Student Name")).toBeInTheDocument();
    expect(screen.getByText("Student Email")).toBeInTheDocument();
    expect(screen.getByText("Mobile Number")).toBeInTheDocument();
    expect(screen.getByText(/Next/i)).toBeInTheDocument();
    mockStepperFormLabels.forEach((step) => {
      const stepLabel = screen.getAllByText(step)[0];
      expect(stepLabel).toBeInTheDocument();
    });
  });

  it("next button is disabled when form is not filled", () => {
    const nextButton = screen.getByRole("button", { name: /Next/i });
    expect(nextButton).toBeDisabled();
  });
  it("back button is not visible on first step", () => {
    const backButton = screen.queryByRole("button", { name: /Back/i });
    expect(backButton).not.toBeInTheDocument();
  });

  it("next button is enabled when form is filled", async () => {
    await fillFormFields(studentDetails);
    const nextButton = screen.getByRole("button", { name: /Next/i });
    expect(nextButton).toBeEnabled();
  });

  it("back button is visible on second step", async () => {
    (checkEmailExists as jest.Mock).mockResolvedValueOnce(false);
    await fillFormFields(studentDetails);
    await clickNextButtonAndCheckState(false);
    const backButton = screen.getByRole("button", { name: /Back/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toBeEnabled();
  });

  it("next page is not visible when email already exists", async () => {
    (checkEmailExists as jest.Mock).mockResolvedValueOnce(true);
    await fillFormFields(studentDetails);
    await clickNextButtonAndCheckState(false);
    expect(checkEmailExists).toHaveBeenCalledTimes(1);
  });

  it("next button is disabled when guardian values are not valid", async () => {
    (checkEmailExists as jest.Mock).mockResolvedValueOnce(false);
    await fillFormFields(studentDetails);
    await clickNextButtonAndCheckState(true);
    await fillFormFields(guardianDetials);
    const nextButton = screen.getByRole("button", { name: /Next/i });
    expect(nextButton).toBeEnabled();
  });

  it("next button is disabled when password is not valid", async () => {
    (checkEmailExists as jest.Mock).mockResolvedValueOnce(false);
    await fillFormFields(studentDetails);
    await clickNextButtonAndCheckState(true);
    await fillFormFields(guardianDetials);
    await clickNextButtonAndCheckState(true);
    const passwordInput = passwordDataTestId.map((id) =>
      screen.getByTestId(id)
    );
    changeMultipleFields(passwordInput, invalidPasswordDetails);
    await clickNextButtonAndCheckState(true);
    changeMultipleFields(passwordInput, unequalPasswordDetails);
    await clickNextButtonAndCheckState(true);
    changeMultipleFields(passwordInput, passwordDetails);
    const nextButton = screen.getByRole("button", { name: /Next/i });
    expect(nextButton).toBeEnabled();
  });

  it("calls getLocalStorage when rendered", async () => {
    expect(getLocalStorage).toHaveBeenCalledTimes(1);
  });

  it("calls handleClose when cancel button is clicked", async () => {
    const cancelButton = screen.getByTestId("CloseIcon");
    fireEvent.click(cancelButton);
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
    expect(setLocalStorage).toHaveBeenCalledTimes(1);
  });

  it("back button is properly working", async () => {
    (checkEmailExists as jest.Mock).mockResolvedValueOnce(false);
    await fillFormFields(studentDetails);
    await clickNextButtonAndCheckState(true);
    await fillFormFields(guardianDetials);
    const backButton = screen.getByRole("button", { name: /Back/i });
    fireEvent.click(backButton);
    await waitFor(() => {
      expect(screen.getByText("Student Name")).toBeInTheDocument();
    });
  });
});
