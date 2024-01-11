import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoadingButton from "../LoadingButton";

const btnText = "Submit";
const mockOnSubmit = jest.fn();

describe("LoadingButton", () => {
  it("snapshot test", () => {
    const { asFragment } = render(
      <LoadingButton buttonText={btnText} onSubmit={mockOnSubmit} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render the button with the provided text", () => {
    render(<LoadingButton buttonText={btnText} onSubmit={mockOnSubmit} />);
    const buttonElement = screen.getByText(btnText);
    expect(buttonElement).toBeInTheDocument();
  });

  it("should call the onSubmit function when clicked", async () => {
    render(<LoadingButton buttonText={btnText} onSubmit={mockOnSubmit} />);
    const buttonElement = screen.getByText(btnText);
    fireEvent.click(buttonElement);
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled();
    });
  });

  it("should disable the button while loading", async () => {
    render(<LoadingButton buttonText={btnText} onSubmit={mockOnSubmit} />);
    const buttonElement = screen.getByText(btnText);
    fireEvent.click(buttonElement);
    expect(buttonElement).toBeDisabled();
    await waitFor(() => {
      expect(buttonElement).not.toBeDisabled();
    });
  });
});
