import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Errorpage from "../ErrorPage";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedNavigate,
}));

const errorImage = "image.png";

describe("ErrorPage", () => {
  it("snapshot test", () => {
    const { asFragment } = render(<Errorpage image={errorImage} />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("render ErrorPage Component", () => {
    render(<Errorpage image={errorImage} />);
    const image = screen.getByRole("img");
    const backBtn = screen.getByText("Back");
    const HomeBtn = screen.getByText("Home");

    expect(image).toHaveAttribute("src", errorImage);
    expect(backBtn).toBeInTheDocument();
    expect(HomeBtn).toBeInTheDocument();
  });

  it("goes back when back button is clicked", () => {
    render(<Errorpage image={errorImage} />);
    const backBtn = screen.getByText("Back");
    fireEvent.click(backBtn);
    expect(mockedNavigate).toHaveBeenCalledTimes(1);
  });

  it("goes to home when home button is clicked", () => {
    render(<Errorpage image={errorImage} />);
    const HomeBtn = screen.getByText("Home");
    fireEvent.click(HomeBtn);
    expect(mockedNavigate).toHaveBeenCalledTimes(2);
  });
});
