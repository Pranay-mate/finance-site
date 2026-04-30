"use client";

import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { formatINR, formatNumber, formatPercent } from "@/lib/format";

type Suffix = "INR" | "%" | "years" | "months" | "none";

type NumberInputProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: Suffix;
  helperText?: string;
};

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function displayValue(value: number, suffix: Suffix): string {
  switch (suffix) {
    case "INR":
      return formatINR(value);
    case "%":
      return formatPercent(value, value % 1 === 0 ? 0 : 1);
    case "years":
      return value === 1 ? "1 year" : `${formatNumber(value)} years`;
    case "months":
      return value === 1 ? "1 month" : `${formatNumber(value)} months`;
    case "none":
    default:
      return formatNumber(value);
  }
}

export function NumberInput({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "none",
  helperText,
}: NumberInputProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className="text-sm font-medium">
          {label}
        </Label>
        <div className="flex items-center gap-2">
          {suffix === "INR" && (
            <span className="text-sm text-muted-foreground" aria-hidden>
              ₹
            </span>
          )}
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(clamp(Number(e.target.value), min, max))}
            className="w-32 rounded-md border border-input bg-background px-3 py-1.5 text-right text-sm font-semibold tabular-nums shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            aria-describedby={helperText ? `${id}-help` : undefined}
          />
          {suffix === "%" && (
            <span className="text-sm text-muted-foreground" aria-hidden>
              %
            </span>
          )}
          {(suffix === "years" || suffix === "months") && (
            <span className="text-sm text-muted-foreground" aria-hidden>
              {suffix === "years" ? "yr" : "mo"}
            </span>
          )}
        </div>
      </div>

      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(next) =>
          onChange(Array.isArray(next) ? next[0] : (next as number))
        }
        aria-label={label}
      />

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{displayValue(min, suffix)}</span>
        {helperText && (
          <span id={`${id}-help`} className="text-center">
            {helperText}
          </span>
        )}
        <span>{displayValue(max, suffix)}</span>
      </div>
    </div>
  );
}
