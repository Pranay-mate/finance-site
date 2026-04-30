"use client";

import {
  LineChart as RLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export type LineChartSeries = {
  key: string;
  label: string;
  color: string;
};

type LineChartProps<T extends Record<string, unknown>> = {
  data: T[];
  xKey: keyof T & string;
  series: LineChartSeries[];
  ariaLabel: string;
  yTickFormatter?: (value: number) => string;
};

export function LineChart<T extends Record<string, unknown>>({
  data,
  xKey,
  series,
  ariaLabel,
  yTickFormatter,
}: LineChartProps<T>) {
  return (
    <div className="h-72 w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <RLineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey={xKey as string}
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickMargin={8}
          />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickFormatter={yTickFormatter}
            tickMargin={8}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              fontSize: 12,
            }}
            formatter={(value) =>
              typeof value === "number" && yTickFormatter
                ? yTickFormatter(value)
                : String(value)
            }
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </RLineChart>
      </ResponsiveContainer>
    </div>
  );
}
