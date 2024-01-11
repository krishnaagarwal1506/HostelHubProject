import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import NoticeModal from "../NoticeModal";

const mockEditSelectedNotice = {
  isModalOpen: true,
  isEditable: true,
  add: false,
  notice: {
    title: "Test Title",
    content: "Test Content",
    date: "2022-01-01",
  },
};
const mockAddSelectedNotice = {
  isModalOpen: true,
  isEditable: false,
  add: true,
  notice: {
    title: "",
    content: "",
    date: "",
  },
};

const mockViewSelectedNotice = {
  isModalOpen: true,
  isEditable: false,
  add: false,
  notice: {
    title: "Test Title",
    content: "Test Content",
    date: "2022-01-01",
  },
};

const mockHandleSubmit = jest.fn();
const mockHandleClose = jest.fn();
const mockHandleChange = jest.fn();

describe("Edit NoticeModal", () => {
  beforeEach(() => {
    render(
      <NoticeModal
        selectedNotice={mockEditSelectedNotice}
        handleSubmit={mockHandleSubmit}
        handleClose={mockHandleClose}
        handleChange={mockHandleChange}
      />
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title correctly", () => {
    const titleElement = screen.getByText("Edit Notice");
    expect(titleElement).toBeInTheDocument();
  });

  it("renders the  button correctly", () => {
    const saveButton = screen.getByRole("button", { name: "Save" });
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    const crossIcon = screen.getByTestId("close-icon");
    expect(saveButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
    expect(crossIcon).toBeInTheDocument();
  });

  it("calls handleSubmit when save button is clicked", async () => {
    const saveButton = screen.getByRole("button", { name: "Save" });
    fireEvent.click(saveButton);
    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
      expect(mockHandleSubmit).toHaveBeenCalledWith(
        mockEditSelectedNotice.notice
      );
    });
  });

  it("calls handleClose when cancel button is clicked", () => {
    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    fireEvent.click(cancelButton);
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it("calls handleChange when title input is changed", () => {
    const textarea = screen.getByPlaceholderText("Add title");
    fireEvent.change(textarea, { target: { value: "New Title" } });
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it("calls handleChange when content input is changed", () => {
    const contentInput = screen.getByPlaceholderText("Add Content");
    fireEvent.change(contentInput, { target: { value: "New Content" } });
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
    expect(mockHandleChange).toHaveBeenCalledWith(expect.any(Object));
  });
});

describe("Add NoticeModal", () => {
  beforeEach(() => {
    render(
      <NoticeModal
        selectedNotice={mockAddSelectedNotice}
        handleSubmit={mockHandleSubmit}
        handleClose={mockHandleClose}
        handleChange={mockHandleChange}
      />
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("renders the title correctly", () => {
    const titleElement = screen.getByText("Add New Notice");
    expect(titleElement).toBeInTheDocument();
  });

  it("save button is disabled when fields are empty", () => {
    const saveButton = screen.getByRole("button", { name: "Save" });
    expect(saveButton).toBeDisabled();
  });

  it("title placeholder is 'Add title'", () => {
    const titleInput = screen.getByPlaceholderText("Add title");
    expect(titleInput).toBeInTheDocument();
  });

  it("content placeholder is 'Add Content'", () => {
    const contentInput = screen.getByPlaceholderText("Add Content");
    expect(contentInput).toBeInTheDocument();
  });
});

describe("View NoticeModal", () => {
  beforeEach(() => {
    render(
      <NoticeModal
        selectedNotice={mockViewSelectedNotice}
        handleSubmit={mockHandleSubmit}
        handleClose={mockHandleClose}
        handleChange={mockHandleChange}
      />
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the title correctly", () => {
    const titleElement = screen.getByText("Notice");
    expect(titleElement).toBeInTheDocument();
  });

  it("text in read only mode", () => {
    const titleInput = screen.getByText("Test Title");
    const contentInput = screen.getByText("Test Content");
    expect(titleInput).toBeInTheDocument();
    expect(contentInput).toBeInTheDocument();
    expect(titleInput).toHaveAttribute("readonly");
    expect(contentInput).toHaveAttribute("readonly");
  });
});
