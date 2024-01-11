import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AlertComponent from "../Alert";

const handleClose = jest.fn();
const message = "This is an alert message";
const severity = "error";

describe("AlertComponent", () => {
  it("snapshot test", () => {
    const { asFragment } = render(
      <AlertComponent
        severity={severity}
        message={message}
        handleClose={handleClose}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the alert component with the correct message", () => {
    render(
      <AlertComponent
        severity={severity}
        message={message}
        handleClose={handleClose}
      />
    );
    const alertElement = screen.getByText(message);
    expect(alertElement).toBeInTheDocument();
  });

  it("calls the handleClose function when the alert is closed", () => {
    render(
      <AlertComponent
        severity={severity}
        message={message}
        handleClose={handleClose}
      />
    );
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("renders the alert component with the correct severity", () => {
    render(
      <AlertComponent message={message} severity="" handleClose={handleClose} />
    );

    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("automatically closes the alert after 3 seconds", () => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    render(
      <AlertComponent
        severity={severity}
        message={message}
        handleClose={handleClose}
      />
    );
    expect(handleClose).not.toHaveBeenCalled();
    jest.advanceTimersByTime(3000);
    expect(handleClose).toHaveBeenCalled();
  });
});
