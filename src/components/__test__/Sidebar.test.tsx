import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

describe("Sidebar", () => {
  const sidebarFields = [
    {
      path: "/dashboard",
      field: "Dashboard",
      icon: () => <div>Dashboard Icon</div>,
    },
    {
      path: "/profile",
      field: "Profile",
      icon: () => <div>Profile Icon</div>,
    },
  ];
  it("snapshot test", () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Sidebar
          isSidebarOpen={true}
          sidebarFields={sidebarFields}
          toogleSideBar={() => {}}
        />
      </MemoryRouter>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the sidebar with correct fields", () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/dashboard" });

    render(
      <MemoryRouter>
        <Sidebar
          isSidebarOpen={true}
          sidebarFields={sidebarFields}
          toogleSideBar={() => {}}
        />
      </MemoryRouter>
    );

    const dashboardField = screen.getByText("Dashboard");
    const profileField = screen.getByText("Profile");

    expect(dashboardField).toBeInTheDocument();
    expect(profileField).toBeInTheDocument();
  });

  it("navigates to the correct path when a field is clicked", () => {
    const navigateMock = jest.fn();
    const toogleSideBarMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    render(
      <MemoryRouter>
        <Sidebar
          isSidebarOpen={true}
          sidebarFields={sidebarFields}
          toogleSideBar={toogleSideBarMock}
        />
      </MemoryRouter>
    );

    const dashboardField = screen.getByText("Dashboard");
    const profileField = screen.getByText("Profile");

    fireEvent.click(dashboardField);
    expect(navigateMock).toHaveBeenCalled();

    fireEvent.click(profileField);
    expect(navigateMock).toHaveBeenCalled();
  });
});
