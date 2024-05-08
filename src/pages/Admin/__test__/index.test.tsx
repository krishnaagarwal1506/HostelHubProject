import { fetchData } from "@src/utils";
import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AdminHome from "../index";

jest.mock("@src/utils/index.ts", () => {
  const BASE_URL = "http://localhost:1337";
  const NOTICES_URL: string = BASE_URL + "/api/notices";
  const ROOM_STATUS_DATA_URL: string = BASE_URL + "/api/room-status-graph-data";
  const GYM_LIST_URL = BASE_URL + "/api/Gyms";
  const COMPLAINTS_STATS_URL = BASE_URL + "/api/complaint-stats";

  return {
    ...jest.requireActual("@src/utils/index.ts"),
    fetchData: jest.fn().mockImplementation((url) => {
      switch (url) {
        case ROOM_STATUS_DATA_URL:
          return Promise.resolve({
            data: {
              attributes: {
                graphData: [
                  ["Status", "Number of Rooms"],
                  ["Empty", 11],
                  ["Partial-filled", 5],
                  ["Filled", 5],
                  ["Not-available", 2],
                ],
              },
            },
          });
        case COMPLAINTS_STATS_URL:
          return Promise.resolve({
            data: {
              attributes: {
                graphData: [
                  ["Year", "Pending", "Resolved"],
                  ["2004", 100, 100],
                  ["2005", 170, 60],
                  ["2006", 60, 120],
                  ["2007", 130, 40],
                ],
              },
            },
          });
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
        case GYM_LIST_URL:
          return Promise.resolve({
            data: [
              {
                id: 1,
                attributes: {
                  name: "John Doe",
                  position: "Front Desk Officer",
                  status: "Present",
                  createdAt: "2023-12-11T05:42:25.799Z",
                  updatedAt: "2023-12-11T05:42:25.799Z",
                  publishedAt: "2023-12-11T05:42:25.797Z",
                },
              },
              {
                id: 2,
                attributes: {
                  name: "Jane Smith",
                  position: "Housekeeping Supervisor",
                  status: "Absent",
                  createdAt: "2023-12-11T05:42:42.923Z",
                  updatedAt: "2023-12-11T05:42:42.923Z",
                  publishedAt: "2023-12-11T05:42:42.922Z",
                },
              },
              {
                id: 3,
                attributes: {
                  name: "Robert Johnson",
                  position: "Security Guard",
                  status: "Present",
                  createdAt: "2023-12-11T05:42:53.403Z",
                  updatedAt: "2023-12-11T05:42:53.403Z",
                  publishedAt: "2023-12-11T05:42:53.402Z",
                },
              },
            ],
          });
        default:
          return Promise.reject(new Error("not found"));
      }
    }),
  };
});

describe("AdminHome", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("snapshot test", async () => {
    const { asFragment } = render(<AdminHome />);
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });

  it("renders  Notices", async () => {
    render(<AdminHome />);
    await waitFor(() => {
      expect(screen.getByTestId("notice-component")).toBeInTheDocument();
    });
  });

  it("renders room status chart", async () => {
    render(<AdminHome />);
    await waitFor(() => {
      expect(screen.getByText("Rooms Status")).toBeInTheDocument();
    });
  });

  it("renders complaint chart", async () => {
    render(<AdminHome />);
    await waitFor(() => {
      expect(screen.getByText("Complaints Statistics")).toBeInTheDocument();
    });
  });

  it("renders staff list", async () => {
    render(<AdminHome />);
    await waitFor(() => {
      expect(screen.getByText("Staff Members")).toBeInTheDocument();
    });
  });

  it("renders with error", async () => {
    (fetchData as jest.Mock).mockRejectedValue(
      new Error("something went wrong")
    );
    render(<AdminHome />);
    await waitFor(() => {
      expect(screen.getAllByText("Error in fetching data")).toHaveLength(5);
      expect(screen.getAllByRole("button", { name: "Reload" })).toHaveLength(5);
    });
  });

  it("onclick on reload button calls fetchData", async () => {
    (fetchData as jest.Mock).mockRejectedValue(
      new Error("something went wrong")
    );
    render(<AdminHome />);
    await waitFor(() => {
      expect(screen.getAllByText("Error in fetching data")).toHaveLength(5);
      expect(screen.getAllByRole("button", { name: "Reload" })).toHaveLength(5);
    });
    const reloadButton = screen.getAllByRole("button", { name: "Reload" })[0];
    fireEvent.click(reloadButton);
    expect(fetchData).toHaveBeenCalled();
  });
});
