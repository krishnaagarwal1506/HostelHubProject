import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageNotFound from "../PageNotFound";

describe("Forbidden component", () => {
  it("snapshot test", () => {
    const { asFragment } = render(<PageNotFound />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders without crashing", () => {
    render(<PageNotFound />);
    const image = screen.getByRole("img");
    const backLink = screen.getByText("Back");
    const HomeBtn = screen.getByText("Home");

    expect(image).toBeInTheDocument();
    expect(backLink).toBeInTheDocument();
    expect(HomeBtn).toBeInTheDocument();
  });
});
