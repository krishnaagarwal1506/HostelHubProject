import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AuthContext } from "./AuthContext";
import { fetchData } from "@src/utils";

jest.mock("@utils/index", () => ({
  fetchData: jest.fn().mockResolvedValue({
    user: {
      id: 1,
      username: "john@example.com",
      email: "john@example.com",
      role: { type: "admin" },
    },
  }),
  getLocalStorage: jest.fn().mockReturnValue("jwtToken"),
}));

describe("AuthContext", () => {
  test("SnapShot Test", () => {
    const { asFragment } = render(
      <AuthContext.Provider
        value={{
          user: {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "admin",
          },
          updateUserDetails: jest.fn(),
          getUser: jest.fn(),
          isLoading: false,
          handleLogout: jest.fn(),
          handleLogin: jest.fn(),
          handleGoogleLogin: jest.fn(),
        }}
      >
        <div>Test Component</div>
      </AuthContext.Provider>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  test("should render the AuthProvider component", () => {
    render(
      <AuthContext.Provider
        value={{
          user: {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "admin",
          },
          updateUserDetails: jest.fn(),
          getUser: jest.fn(),
          isLoading: false,
          handleLogout: jest.fn(),
          handleLogin: jest.fn(),
          handleGoogleLogin: jest.fn(),
        }}
      >
        <div>Test Component</div>
      </AuthContext.Provider>
    );

    const testComponent = screen.getByText("Test Component");
    expect(testComponent).toBeInTheDocument();
  });

  test("should call getUser function on mount", async () => {
    const getUserMock = jest.fn();

    render(
      <AuthContext.Provider
        value={{
          user: {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "admin",
          },
          updateUserDetails: jest.fn(),
          getUser: getUserMock,
          isLoading: false,
          handleLogout: jest.fn(),
          handleLogin: jest.fn(),
          handleGoogleLogin: jest.fn(),
        }}
      >
        <div>Test Component</div>
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(fetchData).toHaveBeenCalled();
    });
  });
});
