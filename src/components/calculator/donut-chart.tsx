"use client";

import dynamic from "next/dynamic";

export type { DonutDatum } from "./donut-chart-inner";

const ChartFallback = ({ height = 256 }: { height?: number }) => (
  <div
    role="img"
    aria-label="Loading chart"
    className="w-full animate-pulse rounded-md bg-muted/40"
    style={{ height }}
  />
);

export const DonutChart = dynamic(
  () => import("./donut-chart-inner").then((mod) => mod.DonutChart),
  {
    ssr: false,
    loading: () => <ChartFallback />,
  },
);

export const DonutLegend = dynamic(
  () => import("./donut-chart-inner").then((mod) => mod.DonutLegend),
  { ssr: false },
);
