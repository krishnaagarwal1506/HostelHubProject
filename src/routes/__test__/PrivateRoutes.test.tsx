import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import PrivateRoute from "../PrivateRoutes";
import AuthProviderMock from "@src/test-utils/AuthContextMock";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock("axios", () => ({
  ...jest.requireActual("axios"),
  get: jest.fn().mockResolvedValue({
    data: {
      jwt: "mockJwtToken",
    },
  }),
}));

jest.mock("@src/utils/axiosInstance.ts", () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: jest.fn().mockResolvedValue({ data: {} }),
      post: jest.fn().mockResolvedValue({ data: {} }),
      put: jest.fn().mockResolvedValue({ data: {} }),
      delete: jest.fn().mockResolvedValue({ data: {} }),
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    };
  });
});

const navigateMock = jest.fn();

describe("PrivateRoute", () => {
  beforeEach(() => {
    (useLocation as jest.Mock).mockReturnValue({
      pathname: "/dashboard",
      search: "?id_token=mockIdToken",
      // ?id_token=mockIdToken
    });
    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
    jest.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockRestore();
  });

  it("renders Loader when loading is true", async () => {
    render(
      <MemoryRouter>
        <AuthProviderMock value={{ isLoading: true }}>
          <PrivateRoute allowedRoles={[]} />
        </AuthProviderMock>
      </MemoryRouter>
    );
    const loader = screen.getByTestId("loader");
    await waitFor(() => expect(loader).toBeInTheDocument());
  });

  it("redirects to /forbidden when user is authenticated but does not have allowed role", () => {
    render(
      <MemoryRouter>
        <AuthProviderMock value={{ isLoading: false }}>
          <PrivateRoute allowedRoles={["invalidUserRole"]} />
        </AuthProviderMock>
      </MemoryRouter>
    );

    waitFor(() => expect(navigateMock).toHaveBeenCalledTimes(1));
  });

  it("renders Outlet when user is authenticated and has allowed role", () => {
    render(
      <MemoryRouter>
        <AuthProviderMock value={{ isLoading: false }}>
          <PrivateRoute allowedRoles={["admin"]} />
        </AuthProviderMock>
      </MemoryRouter>
    );

    waitFor(() => expect(navigateMock).toHaveBeenCalledTimes(1));
  });
});
