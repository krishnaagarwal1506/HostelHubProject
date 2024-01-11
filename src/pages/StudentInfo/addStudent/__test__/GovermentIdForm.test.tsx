import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import GovermentIdForm from "../GovermentIdForm";
import {
  mockStudent,
  mockHandleChange,
  mockHandleClick,
  govermentidDetails,
} from "@src/test-utils/studentInfoPage-utils";

const idType = ["Pan Card", "Aadhar Card", "Institute Card"];

describe("GovermentIdForm", () => {
  beforeEach(() => {
    render(
      <GovermentIdForm
        student={{ ...mockStudent() }}
        validateError={jest.fn()}
        getHelperText={jest.fn()}
        handleChange={mockHandleChange}
        handleClick={mockHandleClick}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("snapshot", () => {
    expect(screen).toMatchSnapshot();
  });

  it("renders the form correctly", () => {
    idType.forEach((type) => {
      expect(screen.getByText(type)).toBeInTheDocument();
    });
  });

  it("have no image uploaded image initially", () => {
    expect(screen.getByRole("img")).toHaveAttribute("alt", "No Image Uploaded");
  });

  it("calls handleChange when form fields are changed", () => {
    const textFields = idType.map((id) => screen.getByText(id));
    textFields.forEach((field) => {
      fireEvent.click(field);
    });
    expect(mockHandleClick).toHaveBeenCalledTimes(3);
  });
});

describe("GovermentIdForm with image", () => {
  it("render the uploaded image when present", () => {
    render(
      <GovermentIdForm
        student={{ ...mockStudent(), ...govermentidDetails }}
        validateError={jest.fn()}
        getHelperText={jest.fn()}
        handleChange={mockHandleChange}
        handleClick={mockHandleClick}
      />
    );
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "Id card image");
  });
});
