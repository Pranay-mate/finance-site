"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export type DonutDatum = { name: string; value: number; color: string };

type DonutChartProps = {
  data: DonutDatum[];
  centerLabel?: string;
  centerValue?: string;
  ariaLabel: string;
};

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  ariaLabel,
}: DonutChartProps) {
  return (
    <div className="relative h-64 w-full" role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="62%"
            outerRadius="92%"
            paddingAngle={2}
            stroke="none"
            isAnimationActive={false}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--card)",
              color: "var(--foreground)",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerLabel && (
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              {centerLabel}
            </span>
          )}
          {centerValue && (
            <span className="mt-1 text-xl font-semibold tabular-nums">
              {centerValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

type LegendProps = { items: DonutDatum[] };

export function DonutLegend({ items }: LegendProps) {
  return (
    <ul className="grid gap-2">
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-2 text-sm">
          <span
            aria-hidden
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground">{item.name}</span>
        </li>
      ))}
    </ul>
  );
}
