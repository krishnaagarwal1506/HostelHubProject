import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ComplaintModal from "../ComplaintModal";
import { ComplaintStateType } from "@src/ts/types";

const mockHandleClose = jest.fn();
const mockHandleChange = jest.fn();
const mockHandleAutoCompleteChange = jest.fn();
const mockHandleAdd = jest.fn();
const mockComplaintEditState: ComplaintStateType = {
  complaint: {
    date: "2022-01-01",
    type: "Noise",
    description: "Loud music playing late at night",
    status: "pending",
    studentName: "John Doe",
  },
  isModalOpen: true,
  isModalEditable: true,
};

const mockComplaintViewState: ComplaintStateType = {
  complaint: {
    date: "2022-01-01",
    type: "Noise",
    description: "Loud music playing late at night",
    status: "pending",
    studentName: "John Doe",
  },
  isModalOpen: true,
  isModalEditable: false,
};

describe("ComplaintModal", () => {
  beforeEach(() => {
    render(
      <ComplaintModal
        complaintState={mockComplaintEditState}
        handleClose={mockHandleClose}
        handleChange={mockHandleChange}
        handleAutoCompleteChange={mockHandleAutoCompleteChange}
        handleAdd={mockHandleAdd}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the complaint modal with correct fields", () => {
    expect(screen.getByText("Complaint")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("renderd fields are editable", () => {
    const descriptionField = screen.getByText("Description");
    const typeField = screen.getByText("Type");
    expect(descriptionField).not.toHaveAttribute("readonly");
    expect(typeField).not.toHaveAttribute("readonly");
  });

  it("calls the handleClose function when the close button is clicked", () => {
    fireEvent.click(screen.getByText("Close"));
    expect(mockHandleClose).toHaveBeenCalled();
  });

  it("calls the handleAdd function when the save button is clicked", async () => {
    fireEvent.click(screen.getByText("Save"));
    await waitFor(() => expect(mockHandleAdd).toHaveBeenCalled());
  });
});

describe("ComplaintModal in view mode", () => {
  beforeEach(() => {
    render(
      <ComplaintModal
        complaintState={mockComplaintViewState}
        handleClose={mockHandleClose}
        handleChange={mockHandleChange}
        handleAutoCompleteChange={mockHandleAutoCompleteChange}
        handleAdd={mockHandleAdd}
      />
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the complaint modal with correct fields", () => {
    expect(screen.getByText("Complaint")).toBeInTheDocument();
    expect(screen.getByText("pending")).toBeInTheDocument();
    const descriptionField = screen.getByLabelText("Description");
    const typeField = screen.getByLabelText("Type");
    const studentNameField = screen.getByLabelText("Raised By");
    const createdOnField = screen.getByLabelText("Created On");
    expect(studentNameField).toBeInTheDocument();
    expect(descriptionField).toBeInTheDocument();
    expect(typeField).toBeInTheDocument();
    expect(createdOnField).toBeInTheDocument();
  });

  it("renderd fields are not editable", () => {
    const descriptionField = screen.getByLabelText("Description");
    const typeField = screen.getByLabelText("Type");
    const studentNameField = screen.getByLabelText("Raised By");
    const createdOnField = screen.getByLabelText("Created On");
    expect(descriptionField).toHaveAttribute("readonly");
    expect(typeField).toHaveAttribute("readonly");
    expect(studentNameField).toHaveAttribute("readonly");
    expect(createdOnField).toHaveAttribute("readonly");
  });
});
