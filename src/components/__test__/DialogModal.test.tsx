import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DialogModal from "../DialogModal";

const handleClose = jest.fn();
const handleSubmit = jest.fn();

const action = (
  <>
    <button onClick={handleClose}>Cancel</button>
    <button onClick={handleSubmit}>Submit</button>
  </>
);
const title = "Test Dialog";
const subtitle = "Test Subtitle";
const content = "Test Content";

describe("DialogModal", () => {
  it("snapshot test", () => {
    const { asFragment } = render(
      <DialogModal isOpen={true} title="Test Title" handleClose={handleClose}>
        <div>{content}</div>
      </DialogModal>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders dialog with correct title and subtitle", () => {
    render(
      <DialogModal
        isOpen={true}
        title={title}
        subtitle={subtitle}
        handleClose={handleClose}
      >
        <div>{content}</div>
      </DialogModal>
    );

    const dialogTitle = screen.getByText(title);
    const dialogSubtitle = screen.getByText(subtitle);
    const dialogContent = screen.getByText(content);

    expect(dialogTitle).toBeInTheDocument();
    expect(dialogSubtitle).toBeInTheDocument();
    expect(dialogContent).toBeInTheDocument();
  });

  it("calls handleClose when cancel button or close icon is clicked", () => {
    render(
      <DialogModal
        isOpen={true}
        title={title}
        handleClose={handleClose}
        actions={action}
      >
        <div>{content}</div>
      </DialogModal>
    );

    fireEvent.click(screen.getByText("Cancel"));
    fireEvent.click(screen.getByTestId("close-icon"));

    expect(handleClose).toHaveBeenCalledTimes(2);
  });

  it("calls handleSubmit when submit button is clicked", () => {
    render(
      <DialogModal
        isOpen={true}
        title={title}
        handleClose={handleClose}
        actions={action}
      >
        <div>{content}</div>
      </DialogModal>
    );

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });
});
