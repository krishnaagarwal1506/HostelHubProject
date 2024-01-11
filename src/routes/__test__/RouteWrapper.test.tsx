import { render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthProviderMock from "@src/test-utils/AuthContextMock";
import RouteWrapper from "../RouteWrapper";

const adminChildComponentmock = (
  <div data-testid="admin-component">Admin Child Component</div>
);
const studentChildComponentmock = (
  <div data-testid="student-component">Student Child Component</div>
);
const userContextValues = (role: string) => {
  return {
    user: {
      id: 1,
      email: "johnDoe@gmail.com",
      role: role,
      name: "John Doe",
    },
  };
};

describe("RouteWrapper", () => {
  it("snapshot test", () => {
    const { asFragment } = render(
      <AuthProviderMock value={{ isLoading: false }}>
        <RouteWrapper
          components={{
            admin: adminChildComponentmock,
            student: studentChildComponentmock,
          }}
        />
      </AuthProviderMock>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the component based on the admin's role", () => {
    const { getByTestId } = render(
      <AuthProviderMock value={{ ...userContextValues("admin") }}>
        <RouteWrapper
          components={{
            admin: adminChildComponentmock,
            student: studentChildComponentmock,
          }}
        />
      </AuthProviderMock>
    );

    expect(getByTestId("admin-component")).toBeInTheDocument();
  });

  it("renders the component based on the student's role", () => {
    const { getByTestId } = render(
      <AuthProviderMock value={{ ...userContextValues("student") }}>
        <RouteWrapper
          components={{
            admin: adminChildComponentmock,
            student: studentChildComponentmock,
          }}
        />
      </AuthProviderMock>
    );

    expect(getByTestId("student-component")).toBeInTheDocument();
  });

  it("renders the login page if the user's role is not correct", () => {
    const { getByTestId } = render(
      <AuthProviderMock value={{ ...userContextValues("invalidRole") }}>
        <RouteWrapper
          components={{
            admin: adminChildComponentmock,
            student: studentChildComponentmock,
          }}
        />
      </AuthProviderMock>
    );

    waitFor(() => expect(getByTestId("login-page")).toBeInTheDocument());
  });
});
