import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import AuthProviderMock from "@src/test-utils/AuthContextMock";
import { NAVBAR_TITLE_ADMIN, NAVBAR_TITLE_STUDENT } from "@src/constant";
import { act } from "react-dom/test-utils";

const toogleSideBarMock = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

const contextValues = (role: string) => {
  return {
    user: {
      id: 1,
      email: "johnDoe@gmail.com",
      role: role,
      name: "John Doe",
    },
  };
};

function setupMocks(pathname: string) {
  (useLocation as jest.Mock).mockReturnValue({ pathname: `/${pathname}` });
  (useNavigate as jest.Mock).mockReturnValue(jest.fn());
}

describe("Navbar", () => {
  it("Snapshot testing", () => {
    setupMocks("dashboard");
    const { asFragment } = render(
      <AuthProviderMock value={contextValues("admin")}>
        <Navbar toogleSideBar={toogleSideBarMock} />
      </AuthProviderMock>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the correct title for an admin user", () => {
    setupMocks("dashboard");
    render(
      <AuthProviderMock value={contextValues("admin")}>
        <Navbar toogleSideBar={toogleSideBarMock} />
      </AuthProviderMock>
    );
    expect(
      screen.getByText(NAVBAR_TITLE_ADMIN["dashboard"])
    ).toBeInTheDocument();
  });

  it("renders the correct title for a student user", () => {
    setupMocks("dashboard");
    render(
      <AuthProviderMock value={contextValues("student")}>
        <Navbar toogleSideBar={toogleSideBarMock} />
      </AuthProviderMock>
    );
    expect(
      screen.getByText(NAVBAR_TITLE_STUDENT["dashboard"])
    ).toBeInTheDocument();
  });

  it("open the user menu when the user avatar is clicked", () => {
    setupMocks("dashboard");
    render(
      <AuthProviderMock value={contextValues("student")}>
        <Navbar toogleSideBar={toogleSideBarMock} />
      </AuthProviderMock>
    );
    const userAvatar = screen.getByRole("button", { name: "Open settings" });
    act(() => {
      userAvatar.click();
    });
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
});
