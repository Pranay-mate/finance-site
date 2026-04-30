const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrCompact = new Intl.NumberFormat("en-IN", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberInIndianGrouping = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatINR(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return inrFormatter.format(Math.round(value));
}

export function formatINRCompact(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return `₹${inrCompact.format(value)}`;
}

export function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  return numberInIndianGrouping.format(Math.round(value));
}

export function formatPercent(value: number, fractionDigits = 2): string {
  if (!Number.isFinite(value)) return "—";
  return `${value.toFixed(fractionDigits)}%`;
}

export function formatYears(value: number): string {
  if (value === 1) return "1 year";
  const fixed = value % 1 === 0 ? value.toString() : value.toFixed(1);
  return `${fixed} years`;
}
