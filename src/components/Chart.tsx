import { FC } from "react";
import {
  Chart,
  GoogleChartWrapperChartType,
  ChartWrapperOptions,
  ReactGoogleChartProps,
} from "react-google-charts";

import { graphDataType } from "@ts/types";

type PieChartProps = {
  data: graphDataType | null;
  options?: ChartWrapperOptions["options"];
  graphType: GoogleChartWrapperChartType | undefined;
  Skeleton: FC;
  className?: string;
  chartEvents?: ReactGoogleChartProps["chartEvents"];
};

const PieChart = ({
  graphType,
  data,
  options,
  Skeleton,
  className,
  chartEvents,
}: PieChartProps) => {
  if (!data) {
    return <Skeleton />;
  }
  return (
    <Chart
      className={className}
      chartType={graphType}
      data={data}
      options={options}
      chartEvents={chartEvents}
      width={"95%"}
      height={"95%"}
    />
  );
};

export default PieChart;
