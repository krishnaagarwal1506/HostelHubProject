import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorComponent from "../ErrorComponent";

const onSubmitMock = jest.fn();
const errorMessage = "Something went wrong";
const heading = "Error";

describe("ErrorComponent", () => {
  it("snapshot test", () => {
    const { asFragment } = render(
      <ErrorComponent
        onSubmit={onSubmitMock}
        message={errorMessage}
        heading={heading}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the error message and reload button", () => {
    render(
      <ErrorComponent
        onSubmit={onSubmitMock}
        message={errorMessage}
        heading={heading}
      />
    );

    const errorHeading = screen.getByText(heading);
    const errorMessageText = screen.getByText(errorMessage);
    const reloadButton = screen.getByRole("button", { name: "Reload" });

    expect(errorHeading).toBeInTheDocument();
    expect(errorMessageText).toBeInTheDocument();
    expect(reloadButton).toBeInTheDocument();
  });

  it("calls the onSubmit function when the reload button is clicked", async () => {
    render(
      <ErrorComponent
        onSubmit={onSubmitMock}
        message={errorMessage}
        heading={heading}
      />
    );

    const reloadButton = screen.getByRole("button", { name: "Reload" });
    fireEvent.click(reloadButton);
    await waitFor(() => expect(onSubmitMock).toHaveBeenCalledTimes(1));
  });
});
