import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useNavigate } from "react-router-dom";
import AuthProviderMock from "@src/test-utils/AuthContextMock";
import PublicRoutes from "../PublicRoutes";

const navigateMock = jest.fn();

describe("PublicRoutes", () => {
  it("snapshot test", async () => {
    const { asFragment } = render(
      <MemoryRouter>
        <AuthProviderMock value={{ isLoading: false }}>
          <PublicRoutes />
        </AuthProviderMock>
      </MemoryRouter>
    );
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });

  it("renders Outlet when user is not authenticated", async () => {
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthProviderMock value={{ user: undefined }}>
          <PublicRoutes />
        </AuthProviderMock>
      </MemoryRouter>
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("redirects to home when user is authenticated", async () => {
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <AuthProviderMock value={{ isLoading: false }}>
          <PublicRoutes />
        </AuthProviderMock>
      </MemoryRouter>
    );
  });
});
