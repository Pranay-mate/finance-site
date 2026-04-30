import { cn } from "@/lib/utils";

export type BreakdownColumn<T> = {
  key: string;
  label: string;
  align?: "left" | "right";
  render: (row: T) => React.ReactNode;
};

type BreakdownTableProps<T> = {
  caption?: string;
  columns: BreakdownColumn<T>[];
  rows: T[];
  className?: string;
};

export function BreakdownTable<T>({
  caption,
  columns,
  rows,
  className,
}: BreakdownTableProps<T>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {caption && (
            <caption className="border-b border-border bg-muted/30 px-4 py-3 text-left text-sm font-semibold">
              {caption}
            </caption>
          )}
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    "px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
                    col.align === "right" ? "text-right" : "text-left",
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border/60 last:border-b-0 even:bg-muted/10"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-4 py-2.5 tabular-nums",
                      col.align === "right" ? "text-right" : "text-left",
                    )}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
