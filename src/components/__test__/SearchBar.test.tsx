import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "../SearchBar";

const handleChange = jest.fn();
const placeholder = "Search";

describe("SearchBar", () => {
  it("snapshot test", () => {
    const { asFragment } = render(
      <SearchBar value="" onChange={handleChange} placeHolder={placeholder} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders without errors", () => {
    render(
      <SearchBar value="" onChange={handleChange} placeHolder={placeholder} />
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with the provided placeholder", () => {
    render(
      <SearchBar value="" onChange={handleChange} placeHolder={placeholder} />
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input.placeholder).toBe(placeholder);
  });
});
