import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthProviderMock from "@src/test-utils/AuthContextMock";
import NoticeList from "../NoticeList";
import { sendData, deleteData } from "@src/utils";
import { setTimeOutMock } from "@src/test-utils/common";

const mockHandleAlert = jest.fn();
const mockSetUpdateNoticeCheck = jest.fn();

const mockNotices = [
  {
    id: 1,
    title: "Notice 1",
    date: "2022-01-01",
    content: "This is notice 1",
  },
  {
    id: 2,
    title: "Notice 2",
    date: "2022-01-02",
    content: "This is notice 2",
  },
];

jest.mock("@src/utils/index.ts", () => ({
  ...jest.requireActual("@src/utils/index.ts"),
  sendData: jest.fn(),
  deleteData: jest.fn(),
  // todayDate: () => "2022-01-01",
}));

jest.mock("@src/hooks/useAlert.ts", () => {
  return jest.fn().mockImplementation(() => {
    return {
      alert: {
        isOpen: false,
        message: "",
        severity: "",
      },
      handleAlert: mockHandleAlert,
    };
  });
});

const clickButton = (buttonTestId: string, buttonName: string) => {
  const button = screen.getAllByTestId(buttonTestId);
  fireEvent.click(button[1]);
  const openedNoticeModal = screen.getByRole("dialog");
  expect(openedNoticeModal).toBeInTheDocument();
  const confirmButton = screen.getByRole("button", { name: buttonName });
  act(() => {
    fireEvent.click(confirmButton);
  });
};

const checkModalBeforeClick = () => {
  const noticeModal = screen.queryByRole("dialog");
  expect(noticeModal).not.toBeInTheDocument();
};

describe("NoticeList", () => {
  beforeEach(() => {
    render(
      <AuthProviderMock value={{ isLoading: false }}>
        <NoticeList notices={mockNotices} />
      </AuthProviderMock>
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("snapshot test", () => {
    const { asFragment } = render(
      <AuthProviderMock value={{ isLoading: false }}>
        <NoticeList notices={mockNotices} />
      </AuthProviderMock>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the component with notices", () => {
    const notice1 = screen.getByText("Notice 1");
    const notice2 = screen.getByText("Notice 2");
    expect(notice1).toBeInTheDocument();
    expect(notice2).toBeInTheDocument();
  });

  it("renders the component without notices", () => {
    render(
      <AuthProviderMock value={{ isLoading: false }}>
        <NoticeList notices={[]} />
      </AuthProviderMock>
    );
    const noNoticesMessage = screen.getByText("No notices");
    expect(noNoticesMessage).toBeInTheDocument();
  });

  it("opens the notice modal when 'Add' button is clicked", () => {
    const noticeModal = screen.queryByRole("dialog");
    expect(noticeModal).not.toBeInTheDocument();
    const addButton = screen.getByText("Add");
    fireEvent.click(addButton);
    const openedNoticeModal = screen.getByRole("dialog");
    expect(openedNoticeModal).toBeInTheDocument();
  });

  it("saveNotice works when Save button is Clicked and response is ok", async () => {
    (sendData as jest.Mock).mockResolvedValue({
      status: 201,
      message: "Notice added",
    });
    checkModalBeforeClick();
    clickButton("EditOutlinedIcon", "Save");
    await act(async () => {
      await setTimeOutMock(1000);
    });
    await waitFor(() => {
      expect(sendData).toHaveBeenCalledTimes(1);
      expect(mockHandleAlert).toHaveBeenCalledWith(
        true,
        "Notice updated",
        "success"
      );
    });
  });

  it("saveNotice works when Save button is Clicked and response is not ok", async () => {
    (sendData as jest.Mock).mockRejectedValue({
      status: 400,
      message: "Notice not added",
    });
    checkModalBeforeClick();
    clickButton("EditOutlinedIcon", "Save");
    await act(async () => {
      await setTimeOutMock(1000);
    });
    await waitFor(() => {
      expect(sendData).toHaveBeenCalledTimes(1);
      expect(mockHandleAlert).toHaveBeenCalledWith(
        true,
        "An error occurred",
        "error"
      );
    });
  });

  it("deleteNotice works when Delete button is Clicked and response is ok", async () => {
    (deleteData as jest.Mock).mockResolvedValue({
      status: 202,
      message: "Notice deleted",
    });
    checkModalBeforeClick();
    clickButton("DeleteOutlineOutlinedIcon", "delete");
    await act(async () => {
      await setTimeOutMock(1000);
    });
    await waitFor(() => {
      expect(deleteData).toHaveBeenCalledTimes(1);
      expect(mockSetUpdateNoticeCheck).toHaveBeenCalledTimes(1);
      expect(mockHandleAlert).toHaveBeenCalledWith(
        true,
        "Notice deleted",
        "success"
      );
    });
  });

  it("deleteNotice works when Delete button is Clicked and response is not ok", async () => {
    (deleteData as jest.Mock).mockRejectedValue({
      status: 400,
      message: "Notice not deleted",
    });
    checkModalBeforeClick();
    clickButton("DeleteOutlineOutlinedIcon", "delete");

    await act(async () => {
      await setTimeOutMock(1000);
    });

    await waitFor(() => {
      expect(deleteData).toHaveBeenCalledTimes(1);
      expect(mockSetUpdateNoticeCheck).toHaveBeenCalledTimes(1);
      expect(mockHandleAlert).toHaveBeenCalledWith(
        true,
        "An error occurred",
        "error"
      );
    });
  });
});

describe("NoticeList for Students", () => {
  it("does not render Add Button when user is Student", async () => {
    render(
      <AuthProviderMock
        value={{
          user: {
            id: 1,
            email: "johnDoe@gmail.com",
            role: "",
            name: "John Doe",
          },
        }}
      >
        <NoticeList notices={mockNotices} />
      </AuthProviderMock>
    );
    await waitFor(() => {
      const addButton = screen.queryByText("Add");
      expect(addButton).not.toBeInTheDocument();
    });
  });
});
