"use client";

import { useMemo, useState } from "react";
import {
  calculateGst,
  GST_STANDARD_RATES,
  type GstMode,
} from "@/lib/calculators/gst";
import { formatINR } from "@/lib/format";
import { NumberInput } from "@/components/calculator/number-input";
import { ResultCard } from "@/components/calculator/result-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Locality = "intra" | "inter";

export function GstForm() {
  const [mode, setMode] = useState<GstMode>("add");
  const [amount, setAmount] = useState(10_000);
  const [rate, setRate] = useState<number>(18);
  const [locality, setLocality] = useState<Locality>("intra");

  const result = useMemo(
    () => calculateGst({ mode, amount, ratePercent: rate }),
    [mode, amount, rate],
  );

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as GstMode)}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="add">Add GST (excl → incl)</TabsTrigger>
          <TabsTrigger value="remove">Remove GST (incl → excl)</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-7 rounded-2xl border border-border bg-card p-6">
          <NumberInput
            id="gst-amount"
            label={mode === "add" ? "Amount before GST" : "Total amount (including GST)"}
            value={amount}
            min={1}
            max={1_00_00_000}
            step={100}
            suffix="INR"
            onChange={setAmount}
          />

          <div className="space-y-3">
            <Label className="text-sm font-medium">GST rate</Label>
            <div className="grid grid-cols-5 gap-2">
              {GST_STANDARD_RATES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRate(r)}
                  className={cn(
                    "rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold transition",
                    rate === r
                      ? "border-foreground bg-foreground text-background"
                      : "hover:bg-muted",
                  )}
                >
                  {r}%
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Standard GST Council slabs. 5% (essentials), 12% (standard), 18% (most services & goods), 28% (luxury).
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Transaction type</Label>
            <Tabs value={locality} onValueChange={(v) => setLocality(v as Locality)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="intra">Intra-state (CGST + SGST)</TabsTrigger>
                <TabsTrigger value="inter">Inter-state (IGST)</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="space-y-6">
          <ResultCard
            headline={{
              label: mode === "add" ? "Total amount (incl. GST)" : "Amount before GST",
              value: formatINR(mode === "add" ? result.totalAmount : result.baseAmount),
              helpText: `${rate}% GST on ${formatINR(mode === "add" ? amount : result.baseAmount)}`,
            }}
            metrics={
              locality === "intra"
                ? [
                    { label: "Base amount", value: formatINR(result.baseAmount), emphasis: "primary" },
                    { label: "GST total", value: formatINR(result.gstAmount), emphasis: "primary" },
                    { label: "CGST (½)", value: formatINR(result.cgst) },
                    { label: "SGST (½)", value: formatINR(result.sgst) },
                  ]
                : [
                    { label: "Base amount", value: formatINR(result.baseAmount), emphasis: "primary" },
                    { label: "IGST (full rate)", value: formatINR(result.igst), emphasis: "primary" },
                    { label: "Total payable", value: formatINR(result.totalAmount) },
                  ]
            }
          />

          <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
            <strong className="text-foreground">Why CGST + SGST = IGST?</strong>{" "}
            For intra-state transactions, the central and state government each get half of the GST. For inter-state, the centre collects the full amount as IGST (and later distributes to the destination state). The total tax you pay is identical either way — the split only affects how it&apos;s deposited.
          </div>
        </div>
      </div>
    </div>
  );
}
