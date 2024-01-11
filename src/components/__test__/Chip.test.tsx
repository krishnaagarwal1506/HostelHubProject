import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChipComponent from "../Chip";

const onClickMock = jest.fn();

describe("ChipComponent", () => {
  it("snapshot test", () => {
    const { asFragment } = render(
      <ChipComponent text="Test Chip" type="default" />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders chip with text", () => {
    render(<ChipComponent text="Test Chip" type="default" />);
    const chipElement = screen.getByText("Test Chip");
    expect(chipElement).toBeInTheDocument();
  });

  it("calls onClick when chip is clicked", () => {
    render(
      <ChipComponent text="Test Chip" type="default" onClick={onClickMock} />
    );
    const chipElement = screen.getByText("Test Chip");
    fireEvent.click(chipElement);
    expect(onClickMock).toHaveBeenCalled();
  });

  it("renders chip with icon", () => {
    render(
      <ChipComponent
        text="Test Chip"
        type="default"
        icon={<span data-testid="icon" />}
      />
    );
    const iconElement = screen.getByTestId("icon");
    expect(iconElement).toBeInTheDocument();
  });
});
