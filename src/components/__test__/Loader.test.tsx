import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Loader from "../Loader";

describe("Loader", () => {
  it("snapshot test", () => {
    const { asFragment } = render(<Loader />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders without crashing", () => {
    render(<Loader />);
    const loader = screen.getByTestId("loader");
    expect(loader).toBeInTheDocument();
  });
});
