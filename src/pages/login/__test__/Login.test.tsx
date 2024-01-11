import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../index";
import AuthProviderMock from "@src/test-utils/AuthContextMock";
import { setTimeOutMock } from "@src/test-utils/common";

const mockHandleLogin = jest.fn();
const mockHandleGoogleLogin = jest.fn();

describe("Login", () => {
  beforeEach(() => {
    render(
      <AuthProviderMock
        value={{
          user: undefined,
          handleGoogleLogin: mockHandleGoogleLogin,
          handleLogin: mockHandleLogin,
        }}
      >
        <Login />
      </AuthProviderMock>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("snapshot test", () => {
    const { asFragment } = render(
      <AuthProviderMock value={{ user: undefined }}>
        <Login />
      </AuthProviderMock>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders login form", () => {
    const emailInput = screen.getByText("Email");
    const passwordInput = screen.getByText("Password");
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it("handles form submission", () => {
    const emailInput = screen.getByRole("textbox", { name: "Email" });
    const passwordInput = screen.getByTestId("password");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "password" },
    });
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password");
  });

  it("renders error message when email is invalid", () => {
    const emailInput = screen.getByRole("textbox", { name: "Email" });
    fireEvent.change(emailInput, { target: { value: "test" } });
    expect(emailInput).toHaveValue("test");
    expect(screen.getByText("Enter a valid email")).toBeInTheDocument();
  });

  it("renders error message when password length is less then 8", () => {
    const passwordInput = screen.getByTestId("password");
    fireEvent.change(passwordInput, {
      target: { value: "pass" },
    });
    expect(passwordInput).toHaveValue("pass");
    expect(
      screen.getByText("Password must contain atleast 8 characters")
    ).toBeInTheDocument();
  });

  it("login button is disabled when input fields are empty invalid", () => {
    const emailInput = screen.getByRole("textbox", { name: "Email" });
    const passwordInput = screen.getByTestId("password");
    const loginButton = screen.getByRole("button", { name: "Login" });
    expect(loginButton).toBeDisabled();
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "password" },
    });
    expect(loginButton).not.toBeDisabled();
  });

  it("handleLogin runs when login button is clicked", async () => {
    const emailInput = screen.getByRole("textbox", { name: "Email" });
    const passwordInput = screen.getByTestId("password");
    const loginButton = screen.getByRole("button", { name: "Login" });
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "password" },
    });
    await act(async () => {
      fireEvent.click(loginButton);
      await setTimeOutMock(1000);
    });
    expect(mockHandleLogin).toHaveBeenCalledTimes(1);
  });

  it("handleGoogleLogin runs when google sign in with google button is clicked", async () => {
    const googleButton = screen.getByRole("button", {
      name: "Sign in with Google",
    });
    fireEvent.click(googleButton);
    await setTimeOutMock(1000);
    expect(mockHandleGoogleLogin).toHaveBeenCalledTimes(1);
  });

  it("show password when show password button is clicked", async () => {
    const showPasswordButton = screen.getByTestId("VisibilityOffIcon");
    const passwordInput = screen.getByTestId("password");
    expect(passwordInput).toHaveAttribute("type", "password");
    await act(async () => {
      fireEvent.click(showPasswordButton);
    });
    expect(passwordInput).toHaveAttribute("type", "text");
  });
});
