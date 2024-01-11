import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import NoticeListItem from "../NoticeListItem";

describe("NoticeListItem", () => {
  const mockNoticeData = {
    id: 1,
    title: "Test Notice",
    date: "2022-01-01",
    content: "This is a test notice.",
  };
  const handleOpenNotice = jest.fn();
  const handleOpenConfirmationDialog = jest.fn();
  const setDeleteNoticeId = jest.fn();

  beforeEach(() => {
    render(
      <NoticeListItem
        noticeNumber={0}
        noticeData={mockNoticeData}
        handleOpenNotice={handleOpenNotice}
        handleOpenConfirmationDialog={handleOpenConfirmationDialog}
        setDeleteNoticeId={setDeleteNoticeId}
      />
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("snapshot test", () => {
    const { asFragment } = render(
      <NoticeListItem
        noticeNumber={0}
        noticeData={mockNoticeData}
        handleOpenNotice={handleOpenNotice}
        handleOpenConfirmationDialog={handleOpenConfirmationDialog}
        setDeleteNoticeId={setDeleteNoticeId}
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders notice item correctly", () => {
    expect(screen.getByText("Test Notice")).toBeInTheDocument();
    expect(screen.getByText("This is a test notice.")).toBeInTheDocument();
  });

  it("calls handleOpenNotice when clicked", () => {
    fireEvent.click(screen.getByText("Test Notice"));
    expect(handleOpenNotice).toHaveBeenCalledTimes(1);
    expect(handleOpenNotice).toHaveBeenCalledWith(
      expect.any(Object),
      "read",
      mockNoticeData
    );
  });

  it("calls handleOpenNotice with 'edit' when edit button is clicked", async () => {
    const editButton = screen.getByTestId("EditOutlinedIcon");
    fireEvent.click(editButton);
    expect(handleOpenNotice).toHaveBeenCalled();
    expect(handleOpenNotice).toHaveBeenCalledWith(
      expect.any(Object),
      "edit",
      mockNoticeData
    );
  });

  it("calls handleOpenConfirmationDialog and setDeleteNoticeId when delete button is clicked", () => {
    fireEvent.click(screen.getByTestId("DeleteOutlineOutlinedIcon"));
    expect(handleOpenConfirmationDialog).toHaveBeenCalledTimes(1);
    expect(setDeleteNoticeId).toHaveBeenCalledTimes(1);
  });
});
