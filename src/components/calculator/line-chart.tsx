"use client";

import dynamic from "next/dynamic";

export type { LineChartSeries } from "./line-chart-inner";

const ChartFallback = () => (
  <div
    role="img"
    aria-label="Loading chart"
    className="h-72 w-full animate-pulse rounded-md bg-muted/40"
  />
);

const LineChartInner = dynamic(
  () => import("./line-chart-inner").then((mod) => mod.LineChart),
  {
    ssr: false,
    loading: () => <ChartFallback />,
  },
) as <T extends Record<string, unknown>>(props: {
  data: T[];
  xKey: keyof T & string;
  series: import("./line-chart-inner").LineChartSeries[];
  ariaLabel: string;
  yTickFormatter?: (value: number) => string;
}) => React.ReactElement;

export { LineChartInner as LineChart };
