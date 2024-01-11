import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorBoundary from "../ErrorBoundry";

const ErrorComponent = <div>Error occurred</div>;
const ChildComponent = <div>Child component</div>;

describe("ErrorBoundary", () => {
  it("should render the ErrorComponent when there is an error", () => {
    render(
      <ErrorBoundary error={true} ErrorComponent={ErrorComponent}>
        {ChildComponent}
      </ErrorBoundary>
    );

    const errorComponent = screen.getByText("Error occurred");
    expect(errorComponent).toBeInTheDocument();
  });

  it("should render the children when there is no error", () => {
    render(
      <ErrorBoundary error={false} ErrorComponent={ErrorComponent}>
        {ChildComponent}
      </ErrorBoundary>
    );

    const childComponent = screen.getByText("Child component");
    expect(childComponent).toBeInTheDocument();
  });

  it("should display errorInfo when an error is thrown", () => {
    const ThrowErrorComponent = () => {
      throw new Error("Test error");
    };
    jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary error={false} ErrorComponent={ErrorComponent}>
        <ThrowErrorComponent />
      </ErrorBoundary>
    );

    const errorInfo = screen.getByText("Error occurred");
    expect(errorInfo).toBeInTheDocument();

    jest.spyOn(console, "error").mockRestore();
  });
});
