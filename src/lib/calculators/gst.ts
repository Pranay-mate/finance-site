export const GST_STANDARD_RATES = [0, 5, 12, 18, 28] as const;
export type GstRate = (typeof GST_STANDARD_RATES)[number] | number;

export type GstMode = "add" | "remove";

export type GstInput = {
  /** Mode — "add" treats `amount` as base, "remove" treats it as GST-inclusive total. */
  mode: GstMode;
  /** Amount in rupees. */
  amount: number;
  /** GST rate as a percentage (e.g. 18 for 18%). */
  ratePercent: number;
};

export type GstResult = {
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  ratePercent: number;
};

/**
 * Add GST (exclusive → inclusive):  total = base × (1 + rate/100)
 * Remove GST (inclusive → exclusive): base = total / (1 + rate/100)
 *
 * For intra-state transactions, GST splits equally as CGST + SGST.
 * For inter-state transactions, the full rate applies as IGST.
 */
export function calculateGst(input: GstInput): GstResult {
  const { mode, amount, ratePercent } = input;

  if (amount <= 0 || ratePercent < 0) {
    return {
      baseAmount: 0,
      gstAmount: 0,
      totalAmount: 0,
      cgst: 0,
      sgst: 0,
      igst: 0,
      ratePercent,
    };
  }

  const r = ratePercent / 100;

  let baseAmount: number;
  let totalAmount: number;
  let gstAmount: number;

  if (mode === "add") {
    baseAmount = amount;
    gstAmount = amount * r;
    totalAmount = baseAmount + gstAmount;
  } else {
    baseAmount = amount / (1 + r);
    gstAmount = amount - baseAmount;
    totalAmount = amount;
  }

  return {
    baseAmount,
    gstAmount,
    totalAmount,
    cgst: gstAmount / 2,
    sgst: gstAmount / 2,
    igst: gstAmount,
    ratePercent,
  };
}
