import { AccountBox } from "@mui/icons-material";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardDetail from "../DashboardDetail";
import { act } from "react-dom/test-utils";
import { useNavigate } from "react-router-dom";

const dashboardDataMock = {
  numberOfStudents: 50,
  complaitsPending: 10,
  numberOfRooms: 30,
  numberOfStaff: 15,
};
const detailMock = {
  label: "Students",
  icon: AccountBox,
  field: "numberOfStudents",
  color: "bg-primary-main",
  path: "students",
};

describe("DashboardDetail", () => {
  it("snapshot test", () => {
    const { asFragment } = render(
      <DashboardDetail dashboardData={dashboardDataMock} detail={detailMock} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders without error", () => {
    render(
      <DashboardDetail dashboardData={dashboardDataMock} detail={detailMock} />
    );
    expect(screen.getByText("Students")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("renders skeleton when dashboardData is null", () => {
    render(<DashboardDetail dashboardData={null} detail={detailMock} />);
    const skeleton = document.querySelector(".MuiSkeleton-root");
    expect(skeleton).toBeInTheDocument();
    expect(screen.queryByText("50")).not.toBeInTheDocument();
  });

  it("onclick redirect to detail page", () => {
    const navigateMock = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);
    render(
      <DashboardDetail dashboardData={dashboardDataMock} detail={detailMock} />
    );
    const link = screen.getByText("50");
    act(() => {
      fireEvent.click(link);
    });
    expect(navigateMock).toHaveBeenCalled();
  });
});
