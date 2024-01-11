import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmationModal from "../ConfirmationModal";

const handleClose = jest.fn();
const handleSubmit = jest.fn();

describe("ConfirmationModal", () => {
  it("snapshot test", () => {
    const { asFragment } = render(
      <ConfirmationModal
        isOpen={true}
        title="Test Title"
        buttontext="Confirm"
        buttonType="default"
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      >
        <p>Test content</p>
      </ConfirmationModal>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders without crashing", () => {
    render(
      <ConfirmationModal
        isOpen={true}
        title="Test Title"
        buttontext="Confirm"
        buttonType="default"
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      >
        <p>Test content</p>
      </ConfirmationModal>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("calls handleClose on cancel button or cross icon click clicks", async () => {
    render(
      <ConfirmationModal
        isOpen={true}
        title="Test Title"
        buttontext="Confirm"
        buttonType="default"
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      >
        <p>Test content</p>
      </ConfirmationModal>
    );

    fireEvent.click(screen.getByText("Cancel"));
    fireEvent.click(screen.getByTestId("close-icon"));

    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it("calls handleSubmit on submit button clicks", async () => {
    render(
      <ConfirmationModal
        isOpen={true}
        title="Test Title"
        buttontext="Confirm"
        buttonType="default"
        handleClose={handleClose}
        handleSubmit={handleSubmit}
      >
        <p>Test content</p>
      </ConfirmationModal>
    );

    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() => expect(handleSubmit).toHaveBeenCalledTimes(1));
  });
});
