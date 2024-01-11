import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Complaints from "../index";
import AuthProviderMock from "@src/test-utils/AuthContextMock";
import { fetchData } from "@src/utils";

jest.mock("@src/utils/index.ts", () => ({
  ...jest.requireActual("@src/utils/index.ts"),
  fetchData: jest.fn().mockResolvedValue({
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
  }),
  sendData: jest.fn(),
  deleteData: jest.fn(),
}));

describe("Complaints Page", () => {
  beforeEach(() => {
    render(
      <AuthProviderMock value={{ isLoading: false }}>
        <Complaints />
      </AuthProviderMock>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("snapshot test", async () => {
    const { asFragment } = render(
      <AuthProviderMock value={{ isLoading: false }}>
        <Complaints />
      </AuthProviderMock>
    );
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });

  it("renders the complaints page correctly", () => {
    const complaintTable = screen.getByRole("grid");
    expect(fetchData).toHaveBeenCalledTimes(1);
    expect(complaintTable).toBeInTheDocument();
  });

  it("renders the complaints table with correct Headers", async () => {
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Created at")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Complaint 1")).toBeInTheDocument();
      expect(screen.getByText("Complaint 2")).toBeInTheDocument();
      expect(screen.getByText("Complaint 3")).toBeInTheDocument();
    });
  });
});

describe("Complaints Page with no complaints", () => {
  it("renders the complaints table with correct Headers", async () => {
    (fetchData as jest.Mock).mockResolvedValue({
      data: [],
    });
    render(
      <AuthProviderMock value={{ isLoading: false }}>
        <Complaints />
      </AuthProviderMock>
    );

    await waitFor(() => {
      expect(screen.getByText("No rows")).toBeInTheDocument();
    });
  });
});
