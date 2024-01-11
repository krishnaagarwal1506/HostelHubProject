import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ChartComponent from "../Chart";

const data: [string, string | number][] = [
  ["Category", "Value"],
  ["A", 10],
  ["B", 20],
];

describe("ChartComponent", () => {
  it("snapshot test", async () => {
    const { asFragment } = render(
      <ChartComponent
        graphType={"PieChart"}
        data={data}
        Skeleton={() => <div>Skeleton</div>}
      />
    );
    await waitFor(() => expect(asFragment()).toMatchSnapshot());
  });

  it("renders Skeleton when data is null", () => {
    render(
      <ChartComponent
        graphType={undefined}
        data={null}
        Skeleton={() => <div>Skeleton</div>}
      />
    );
    const skeletonElement = screen.getByText("Skeleton");
    expect(skeletonElement).toBeInTheDocument();
  });

  it("renders Chart when data is provided", async () => {
    render(
      <ChartComponent
        graphType="PieChart"
        data={data}
        Skeleton={() => <div>Skeleton</div>}
      />
    );
    const chartElement = await screen.findByRole("img");
    await waitFor(() => expect(chartElement).toBeInTheDocument());
  });
});
