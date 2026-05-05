export type CalculatorComplexity = "low" | "medium" | "high";

export type CalculatorCategory =
  | "investment"
  | "savings-scheme"
  | "loan"
  | "tax"
  | "deposit"
  | "advanced";

export type Calculator = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  category: CalculatorCategory;
  complexity: CalculatorComplexity;
  related: string[];
  status: "planned" | "in-progress" | "live";
};

export const CALCULATORS: Calculator[] = [
  {
    slug: "emi-calculator",
    title: "EMI Calculator",
    shortTitle: "EMI",
    description: "Calculate monthly EMI on home, car, or personal loans.",
    metaTitle: "EMI Calculator — Home, Car & Personal Loan EMI",
    metaDescription:
      "Free EMI calculator for home, car and personal loans. Get monthly EMI, total interest, and amortization schedule instantly.",
    keywords: ["emi calculator", "home loan emi", "car loan emi", "personal loan emi"],
    category: "loan",
    complexity: "low",
    related: [
      "home-loan-eligibility-calculator",
      "lumpsum-calculator",
      "income-tax-calculator",
    ],
    status: "live",
  },
  {
    slug: "home-loan-eligibility-calculator",
    title: "Home Loan Eligibility Calculator",
    shortTitle: "Loan Eligibility",
    description:
      "Find the maximum home loan you can get on your salary using India's standard FOIR model.",
    metaTitle: "Home Loan Eligibility Calculator — Max Loan on Your Salary",
    metaDescription:
      "Calculate the maximum home loan you qualify for based on your monthly income, existing EMIs, interest rate and tenure. Uses the FOIR model used by HDFC, SBI and ICICI.",
    keywords: [
      "home loan eligibility calculator",
      "loan eligibility calculator india",
      "how much home loan can i get",
      "max loan on salary",
      "foir calculator",
    ],
    category: "loan",
    complexity: "medium",
    related: ["emi-calculator", "income-tax-calculator", "salary-calculator"],
    status: "live",
  },
  {
    slug: "fd-calculator",
    title: "FD Calculator",
    shortTitle: "FD",
    description: "Calculate fixed deposit maturity value with quarterly compounding.",
    metaTitle: "FD Calculator — Fixed Deposit Maturity & Interest",
    metaDescription:
      "Calculate fixed deposit maturity, interest earned, and effective yield with our free FD calculator. Supports quarterly and annual compounding.",
    keywords: ["fd calculator", "fixed deposit calculator", "fd maturity calculator"],
    category: "deposit",
    complexity: "low",
    related: ["post-tax-fd-calculator", "rd-calculator", "ppf-calculator"],
    status: "live",
  },
  {
    slug: "post-tax-fd-calculator",
    title: "Post-tax FD Calculator",
    shortTitle: "Post-tax FD",
    description:
      "See your real FD return after slab-rate tax — what most calculators don't show.",
    metaTitle: "Post-tax FD Calculator — Real Returns After Income Tax",
    metaDescription:
      "Calculate your fixed deposit's actual post-tax return based on your income tax slab. Includes 4% cess, senior-citizen 80TTB exemption, and pre vs post-tax CAGR.",
    keywords: [
      "post tax fd calculator",
      "fd tax calculator",
      "fd interest taxation calculator",
      "fd return after tax",
      "tds on fd calculator",
      "fd vs ppf post tax",
    ],
    category: "deposit",
    complexity: "medium",
    related: ["fd-calculator", "income-tax-calculator", "real-return-calculator"],
    status: "live",
  },
  {
    slug: "rd-calculator",
    title: "RD Calculator",
    shortTitle: "RD",
    description: "Calculate recurring deposit maturity value and interest earned.",
    metaTitle: "RD Calculator — Recurring Deposit Maturity & Returns",
    metaDescription:
      "Free recurring deposit calculator. Find maturity amount, total interest, and effective return for your monthly RD investment.",
    keywords: ["rd calculator", "recurring deposit calculator"],
    category: "deposit",
    complexity: "low",
    related: ["fd-calculator", "ppf-calculator", "mutual-fund-returns-calculator"],
    status: "live",
  },
  {
    slug: "lumpsum-calculator",
    title: "Lumpsum Calculator",
    shortTitle: "Lumpsum",
    description: "Calculate future value of a one-time investment with compounding.",
    metaTitle: "Lumpsum Calculator — One-time Investment Returns",
    metaDescription:
      "Calculate the future value of a one-time investment. Compare expected returns over different time horizons with our free lumpsum calculator.",
    keywords: ["lumpsum calculator", "lumpsum investment calculator"],
    category: "investment",
    complexity: "low",
    related: ["mutual-fund-returns-calculator", "swp-calculator", "xirr-calculator"],
    status: "live",
  },
  {
    slug: "mutual-fund-returns-calculator",
    title: "Mutual Fund Returns Calculator",
    shortTitle: "MF Returns",
    description: "Calculate returns on SIP and lumpsum mutual fund investments.",
    metaTitle: "Mutual Fund Returns Calculator — SIP & Lumpsum",
    metaDescription:
      "Calculate expected returns on mutual fund SIP and lumpsum investments. See growth, total invested, and gains over your investment horizon.",
    keywords: [
      "mutual fund calculator",
      "sip calculator",
      "mutual fund returns calculator",
    ],
    category: "investment",
    complexity: "low",
    related: ["lumpsum-calculator", "swp-calculator", "xirr-calculator"],
    status: "live",
  },
  {
    slug: "ppf-calculator",
    title: "PPF Calculator",
    shortTitle: "PPF",
    description: "Calculate Public Provident Fund maturity with current rates.",
    metaTitle: "PPF Calculator — Public Provident Fund Maturity",
    metaDescription:
      "Free PPF calculator. Calculate maturity amount, total interest, and year-by-year balance for your Public Provident Fund investment.",
    keywords: ["ppf calculator", "public provident fund calculator", "ppf maturity"],
    category: "savings-scheme",
    complexity: "medium",
    related: ["epf-calculator", "sukanya-samriddhi-yojana-calculator", "fd-calculator"],
    status: "live",
  },
  {
    slug: "epf-calculator",
    title: "EPF Calculator",
    shortTitle: "EPF",
    description: "Calculate Employee Provident Fund corpus at retirement.",
    metaTitle: "EPF Calculator — Employee Provident Fund Corpus",
    metaDescription:
      "Calculate your EPF maturity corpus at retirement based on salary, contribution, and current EPFO rates. Includes employer share and pension component.",
    keywords: ["epf calculator", "employee provident fund calculator", "epfo calculator"],
    category: "savings-scheme",
    complexity: "medium",
    related: ["ppf-calculator", "income-tax-calculator", "lumpsum-calculator"],
    status: "live",
  },
  {
    slug: "sukanya-samriddhi-yojana-calculator",
    title: "Sukanya Samriddhi Yojana Calculator",
    shortTitle: "SSY",
    description:
      "Calculate maturity amount of Sukanya Samriddhi Yojana for your daughter.",
    metaTitle: "Sukanya Samriddhi Yojana Calculator — SSY Maturity",
    metaDescription:
      "Plan your daughter's future with our SSY calculator. Calculate maturity amount, total interest, and year-by-year balance under Sukanya Samriddhi Yojana.",
    keywords: [
      "sukanya samriddhi calculator",
      "ssy calculator",
      "sukanya samriddhi yojana calculator",
    ],
    category: "savings-scheme",
    complexity: "medium",
    related: ["ppf-calculator", "epf-calculator", "fd-calculator"],
    status: "live",
  },
  {
    slug: "swp-calculator",
    title: "SWP Calculator",
    shortTitle: "SWP",
    description: "Calculate Systematic Withdrawal Plan returns and corpus depletion.",
    metaTitle: "SWP Calculator — Systematic Withdrawal Plan Returns",
    metaDescription:
      "Plan your retirement income with our SWP calculator. See how long your corpus lasts with regular withdrawals and assumed returns.",
    keywords: ["swp calculator", "systematic withdrawal plan calculator"],
    category: "investment",
    complexity: "medium",
    related: [
      "mutual-fund-returns-calculator",
      "lumpsum-calculator",
      "xirr-calculator",
    ],
    status: "live",
  },
  {
    slug: "gst-calculator",
    title: "GST Calculator",
    shortTitle: "GST",
    description: "Calculate GST inclusive and exclusive amounts at any rate.",
    metaTitle: "GST Calculator — Inclusive & Exclusive GST",
    metaDescription:
      "Free GST calculator for India. Calculate inclusive and exclusive GST at 5%, 12%, 18%, 28% — split into CGST, SGST, IGST.",
    keywords: ["gst calculator", "gst india calculator", "gst tax calculator"],
    category: "tax",
    complexity: "low",
    related: ["income-tax-calculator", "emi-calculator", "fd-calculator"],
    status: "live",
  },
  {
    slug: "income-tax-calculator",
    title: "Income Tax Calculator",
    shortTitle: "Income Tax",
    description: "Calculate income tax under new and old regime for FY 2025-26.",
    metaTitle: "Income Tax Calculator — New vs Old Regime FY 2025-26",
    metaDescription:
      "Calculate your income tax liability under new and old regime. Compare regimes, see slab-wise tax, deductions, and net take-home for FY 2025-26.",
    keywords: [
      "income tax calculator",
      "tax calculator india",
      "new regime calculator",
      "old regime calculator",
    ],
    category: "tax",
    complexity: "high",
    related: ["post-tax-fd-calculator", "epf-calculator", "ppf-calculator"],
    status: "live",
  },
  {
    slug: "xirr-calculator",
    title: "XIRR Calculator",
    shortTitle: "XIRR",
    description: "Calculate XIRR for irregular cashflows like SIP, top-ups, redemptions.",
    metaTitle: "XIRR Calculator — Returns on Irregular Cashflows",
    metaDescription:
      "Calculate XIRR (extended internal rate of return) for SIP, top-ups, partial redemptions, and any irregular investment cashflows.",
    keywords: ["xirr calculator", "xirr return calculator"],
    category: "advanced",
    complexity: "high",
    related: [
      "mutual-fund-returns-calculator",
      "swp-calculator",
      "lumpsum-calculator",
    ],
    status: "live",
  },
  {
    slug: "fire-calculator",
    title: "FIRE Calculator",
    shortTitle: "FIRE",
    description:
      "Plan early retirement with inflation-adjusted accumulation and drawdown phases.",
    metaTitle: "FIRE Calculator India — Inflation-adjusted Early Retirement",
    metaDescription:
      "Plan FIRE (Financial Independence, Retire Early) in India. Models accumulation + drawdown phases with inflation, step-up SIPs, and corpus survival check.",
    keywords: [
      "fire calculator india",
      "early retirement calculator",
      "financial independence calculator",
      "retirement corpus calculator",
    ],
    category: "advanced",
    complexity: "high",
    related: [
      "swp-calculator",
      "mutual-fund-returns-calculator",
      "real-return-calculator",
    ],
    status: "live",
  },
  {
    slug: "real-return-calculator",
    title: "Real Return Calculator",
    shortTitle: "Real Return",
    description:
      "Adjust nominal investment returns for inflation. See what your money is really earning.",
    metaTitle: "Real Return Calculator — Inflation-Adjusted Returns",
    metaDescription:
      "Convert nominal investment returns to real (inflation-adjusted) returns. See what ₹1 today buys after years of inflation, and the true growth of your portfolio.",
    keywords: [
      "real return calculator",
      "inflation adjusted return",
      "real rate of return",
      "nominal vs real return",
    ],
    category: "advanced",
    complexity: "low",
    related: [
      "fire-calculator",
      "lumpsum-calculator",
      "mutual-fund-returns-calculator",
    ],
    status: "live",
  },
  {
    slug: "tax-optimal-withdrawal-calculator",
    title: "Tax-Optimal Withdrawal Planner",
    shortTitle: "Tax-Optimal SWP",
    description:
      "Find the tax-minimising way to fund retirement expenses across equity, debt, and tax-free buckets.",
    metaTitle: "Tax-Optimal Withdrawal Planner — Minimise Retirement Tax",
    metaDescription:
      "Plan retirement withdrawals to minimise tax. Optimal split across PPF/EPF, equity MFs, and debt MFs using ₹1.25L LTCG exemption + slab-aware ordering.",
    keywords: [
      "tax optimal withdrawal",
      "retirement tax planner",
      "tax efficient swp",
      "ltcg exemption planning",
    ],
    category: "advanced",
    complexity: "high",
    related: [
      "swp-calculator",
      "fire-calculator",
      "income-tax-calculator",
    ],
    status: "live",
  },
  {
    slug: "salary-calculator",
    title: "Salary Calculator (CTC to Take-home)",
    shortTitle: "Salary",
    description:
      "Convert annual CTC into monthly take-home — basic, HRA, EPF, professional tax, income tax, and net pay.",
    metaTitle: "Salary Calculator India — CTC to Take-home (FY 2025-26)",
    metaDescription:
      "Free CTC to take-home salary calculator for India. Breaks down basic, HRA, EPF, professional tax, and income tax under New vs Old regime to show monthly net pay.",
    keywords: [
      "salary calculator india",
      "ctc to take home",
      "in hand salary calculator",
      "ctc calculator",
      "take home pay calculator",
    ],
    category: "tax",
    complexity: "medium",
    related: [
      "income-tax-calculator",
      "epf-calculator",
      "ppf-calculator",
    ],
    status: "live",
  },
  {
    slug: "nps-calculator",
    title: "NPS Calculator",
    shortTitle: "NPS",
    description:
      "Project your National Pension System corpus, lump sum, and monthly pension at retirement.",
    metaTitle: "NPS Calculator — National Pension Scheme Corpus & Pension",
    metaDescription:
      "Calculate NPS retirement corpus, 60% tax-free lump sum, and 40% annuity-based monthly pension. Includes employer 80CCD(2) contribution support.",
    keywords: [
      "nps calculator",
      "national pension scheme calculator",
      "nps maturity calculator",
      "pension calculator india",
    ],
    category: "savings-scheme",
    complexity: "medium",
    related: [
      "ppf-calculator",
      "epf-calculator",
      "fire-calculator",
    ],
    status: "live",
  },
];

export function getCalculator(slug: string): Calculator | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

export function getRelatedCalculators(slug: string): Calculator[] {
  const cal = getCalculator(slug);
  if (!cal) return [];
  return cal.related
    .map((s) => getCalculator(s))
    .filter((c): c is Calculator => Boolean(c));
}

export function calculatorsByCategory(): Record<CalculatorCategory, Calculator[]> {
  const groups = {} as Record<CalculatorCategory, Calculator[]>;
  for (const cal of CALCULATORS) {
    (groups[cal.category] ??= []).push(cal);
  }
  return groups;
}
