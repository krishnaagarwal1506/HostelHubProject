import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentHome from "..";
import { fetchData } from "@src/utils";

jest.mock("@src/utils/index.ts", () => {
  const BASE_URL = "http://localhost:1337";
  const NOTICES_URL: string = BASE_URL + "/api/notices";
  const COMPLAINTS_URL = BASE_URL + "/api/complaints";
  const TODAY_MENU_URL = BASE_URL + "/api/todaymenu";
  const ROOM_INFO_URL = BASE_URL + "/api/room-info";

  return {
    ...jest.requireActual("@src/utils/index.ts"),
    fetchData: jest.fn().mockImplementation((url) => {
      switch (url) {
        case NOTICES_URL:
          return Promise.resolve({
            data: [
              {
                id: 68,
                attributes: {
                  title: "holiday",
                  date: "2023-12-22",
                  content: "ezxfyguhijk",
                  createdAt: "2023-12-22T13:34:14.434Z",
                  updatedAt: "2023-12-22T13:34:14.434Z",
                  publishedAt: "2023-12-22T13:34:14.433Z",
                },
              },
              {
                id: 69,
                attributes: {
                  title: "jnfwoehfouwehf",
                  date: "2023-12-22",
                  content: "wfpijwerifjwirojfwrf",
                  createdAt: "2023-12-22T13:34:20.929Z",
                  updatedAt: "2023-12-22T13:34:20.929Z",
                  publishedAt: "2023-12-22T13:34:20.928Z",
                },
              },
            ],
          });
        case ROOM_INFO_URL:
          return Promise.resolve({
            data: {
              id: 1,
              attributes: {
                data: {
                  Wing: "A",
                  Floor: 1,
                  Room: 101,
                },
              },
            },
          });
        case COMPLAINTS_URL:
          return Promise.resolve({
            data: [
              {
                id: 1,
                attributes: {
                  type: "Complaint 1",
                  date: "2022-01-01",
                  description: "This is complaint 1",
                  status: "pending",
                  studentName: "Test Name 1",
                },
              },
              {
                id: 2,
                attributes: {
                  type: "Complaint 2",
                  date: "2022-01-02",
                  description: "This is complaint 2",
                  status: "resolved",
                  studentName: "Test Name 2",
                },
              },
              {
                id: 3,
                attributes: {
                  type: "Complaint 3",
                  date: "2022-01-03",
                  description: "This is complaint 3",
                  status: "invalid",
                  studentName: "Test Name 3",
                },
              },
            ],
          });
        case TODAY_MENU_URL:
          return Promise.resolve({
            data: {
              id: 1,
              attributes: {
                data: [
                  {
                    name: "Breakfast",
                    value: "Idli, Vada, Sambar, Chutney",
                  },
                  {
                    name: "Lunch",
                    value: "Rice, Sambar, Rasam, Poriyal, Appalam",
                  },
                  {
                    name: "Dinner",
                    value: "Chapathi, Dal, Poriyal, Curd, Pickle",
                  },
                ],
              },
            },
          });

        default:
          return Promise.reject(new Error("not found"));
      }
    }),
  };
});

describe("StudentHome", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("snapshot test", async () => {
    const { asFragment } = render(<StudentHome />);
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });

  it("renders  Notices", async () => {
    render(<StudentHome />);
    await waitFor(() => {
      expect(screen.getByTestId("notice-component")).toBeInTheDocument();
    });
  });

  it("renders  Complaints", async () => {
    render(<StudentHome />);
    await waitFor(() => {
      expect(screen.getByText("Complaint 1")).toBeInTheDocument();
      expect(screen.getByText("Complaint 2")).toBeInTheDocument();
      expect(screen.getByText("Complaint 3")).toBeInTheDocument();
    });
  });

  it("renders  Today's Menu", async () => {
    render(<StudentHome />);
    await waitFor(() => {
      expect(screen.getByText("Breakfast")).toBeInTheDocument();
      expect(screen.getByText("Lunch")).toBeInTheDocument();
      expect(screen.getByText("Dinner")).toBeInTheDocument();
      expect(screen.getByText("Idli")).toBeInTheDocument();
      expect(screen.getByText("Rice")).toBeInTheDocument();
      expect(screen.getByText("Chapathi")).toBeInTheDocument();
    });
  });

  it("renders  Room Info", async () => {
    render(<StudentHome />);
    await waitFor(() => {
      expect(screen.getByText("A")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("101")).toBeInTheDocument();
    });
  });

  it("renders with error", async () => {
    (fetchData as jest.Mock).mockRejectedValue(
      new Error("something went wrong")
    );
    render(<StudentHome />);
    await waitFor(() => {
      expect(screen.getAllByText("Error in fetching data")).toHaveLength(4);
      expect(screen.getAllByRole("button", { name: "Reload" })).toHaveLength(4);
    });
  });

  it("onclick on reload button calls fetchData", async () => {
    (fetchData as jest.Mock).mockRejectedValue(
      new Error("something went wrong")
    );
    render(<StudentHome />);
    await waitFor(() => {
      expect(screen.getAllByText("Error in fetching data")).toHaveLength(4);
      expect(screen.getAllByRole("button", { name: "Reload" })).toHaveLength(4);
    });
    const reloadButton = screen.getAllByRole("button", { name: "Reload" })[0];
    fireEvent.click(reloadButton);
    expect(fetchData).toHaveBeenCalled();
  });
});
