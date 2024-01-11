import { fireEvent, render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthProviderMock from "@src/test-utils/AuthContextMock";
import Dashboard from "../Dashboard";
import { MemoryRouter, useLocation } from "react-router-dom";
import { ADMIN_SIDEBAR, STUDENT_SIDEBAR } from "@src/constant";

describe("Dashboard", () => {
  it("snapshot testing", () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: `/dashboard` });
    const { asFragment } = render(
      <AuthProviderMock value={{ isLoading: false }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProviderMock>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders loader when isLoading is true", () => {
    render(
      <AuthProviderMock value={{ isLoading: true }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProviderMock>
    );

    const loaderElement = screen.getByTestId("loader");
    const sidebarElement = screen.queryByTestId("sidebar");
    const navbarElement = screen.queryByTestId("navbar");
    expect(loaderElement).toBeInTheDocument();
    expect(sidebarElement).toBeNull();
    expect(navbarElement).toBeNull();
  });

  it("renders sidebar and navbar", () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: `/dashboard` });
    render(
      <AuthProviderMock value={{ isLoading: false }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProviderMock>
    );
    const loaderElement = screen.queryByTestId("loader");
    const sidebarElement = screen.getByTestId("sidebar");
    const navbarElement = screen.getByTestId("navbar");
    expect(loaderElement).toBeNull();
    expect(sidebarElement).toBeInTheDocument();
    expect(navbarElement).toBeInTheDocument();
  });

  it("renders the correct sidebar fields for an admin user", () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: `/dashboard` });
    render(
      <AuthProviderMock value={{ isLoading: false }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProviderMock>
    );
    const sidebar = screen.getByTestId("sidebar");
    ADMIN_SIDEBAR.forEach(({ field }) => {
      const fieldElement = within(sidebar).getByText(field);
      expect(fieldElement).toBeInTheDocument();
    });
  });

  it("renders the correct sidebar fields for a student user", () => {
    (useLocation as jest.Mock).mockReturnValue({ pathname: `/dashboard` });
    render(
      <AuthProviderMock
        value={{
          user: {
            id: 1,
            email: "johnDoe@gmail.com",
            role: "student",
            name: "John Doe",
          },
        }}
      >
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProviderMock>
    );
    const sidebar = screen.getByTestId("sidebar");
    STUDENT_SIDEBAR.forEach(({ field }) => {
      const fieldElement = within(sidebar).getByText(field);
      expect(fieldElement).toBeInTheDocument();
    });
  });

  it("should open and close the sidebar", async () => {
    render(
      <AuthProviderMock value={{ isLoading: false }}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </AuthProviderMock>
    );
    const sidebarToggleButton = screen.getByRole("button", {
      name: "menu",
    });
    fireEvent.click(sidebarToggleButton);
    let sidebar = await screen.findByTestId("sidebar");
    expect(sidebar).not.toHaveClass("hidden");

    fireEvent.click(sidebarToggleButton);
    sidebar = await screen.findByTestId("sidebar");
    expect(sidebar).toHaveClass("hidden");
  });
});
