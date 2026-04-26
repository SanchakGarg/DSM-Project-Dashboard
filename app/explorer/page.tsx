"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// OLS coefficients (z-scored): intercept + 4 predictors
const INTERCEPT = -0.028;
const COEF = {
  sanitation: -0.3775,
  education: -0.4055,
  deliveries: 0.1744,
  yield: -0.043,
};

// z-score range: ±2.5 SD feels natural for sliders
const SLIDER_MIN = -2.5;
const SLIDER_MAX = 2.5;

// Convert z-score to approximate raw percentage for display
// These are rough population means ± SD from the dataset
const RAW_PARAMS = {
  sanitation: { mean: 62.5, sd: 22.0 },
  education: { mean: 36.8, sd: 14.2 },
  deliveries: { mean: 78.4, sd: 16.3 },
  yield: { mean: 2.1, sd: 1.4 },
};

function zToRaw(z: number, key: keyof typeof RAW_PARAMS) {
  const { mean, sd } = RAW_PARAMS[key];
  return mean + z * sd;
}

function predictedLabel(z: number): { label: string; color: string } {
  if (z < -1) return { label: "Low burden", color: "text-emerald-600" };
  if (z < 0) return { label: "Below average", color: "text-lime-600" };
  if (z < 0.5) return { label: "Near average", color: "text-amber-500" };
  if (z < 1.5) return { label: "High burden", color: "text-orange-500" };
  return { label: "Very high burden", color: "text-red-600" };
}

const predictors = [
  {
    key: "sanitation" as const,
    label: "Improved Sanitation",
    description: "% of HH with improved sanitation facility",
    beta: COEF.sanitation,
    unit: "%",
  },
  {
    key: "education" as const,
    label: "Women's Education (10+ yrs)",
    description: "% of women with 10+ years of schooling",
    beta: COEF.education,
    unit: "%",
  },
  {
    key: "deliveries" as const,
    label: "Institutional Deliveries",
    description: "% of births in a health facility",
    beta: COEF.deliveries,
    unit: "%",
  },
  {
    key: "yield" as const,
    label: "Weighted Crop Yield",
    description: "Tonnes per hectare (district-level)",
    beta: COEF.yield,
    unit: " t/ha",
  },
];

export default function ExplorerPage() {
  const [values, setValues] = useState<Record<string, number>>({
    sanitation: 0,
    education: 0,
    deliveries: 0,
    yield: 0,
  });

  const predicted =
    INTERCEPT +
    COEF.sanitation * values.sanitation +
    COEF.education * values.education +
    COEF.deliveries * values.deliveries +
    COEF.yield * values.yield;

  const { label: burdenLabel, color: burdenColor } = predictedLabel(predicted);

  const contributionData = predictors.map((p) => ({
    name: p.label,
    contribution: parseFloat((p.beta * values[p.key]).toFixed(3)),
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
      <div>
        <h1 className="text-3xl font-bold">Interactive Predictor</h1>
        <p className="mt-2 text-sm text-zinc-500 max-w-2xl">
          Adjust the four structural predictors and see how the predicted
          composite malnutrition index changes in real time. All inputs are in
          standard deviations (z-scores) relative to the national district mean.
          The model uses OLS regression (R² = 0.523) on 704 districts.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Sliders — 3/5 width */}
        <div className="lg:col-span-3 space-y-8">
          {predictors.map((p) => {
            const rawVal = zToRaw(values[p.key], p.key);
            const zVal = values[p.key];
            return (
              <Card key={p.key}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        {p.label}
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {p.description}
                      </CardDescription>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-lg font-bold font-mono">
                        {zVal >= 0 ? "+" : ""}
                        {zVal.toFixed(2)}
                        <span className="text-xs font-normal text-zinc-400">
                          {" "}
                          SD
                        </span>
                      </p>
                      <p className="text-xs text-zinc-500">
                        ≈ {rawVal.toFixed(1)}
                        {p.unit}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 pb-4 space-y-2">
                  <Slider
                    min={SLIDER_MIN * 10}
                    max={SLIDER_MAX * 10}
                    step={1}
                    value={[values[p.key] * 10]}
                    onValueChange={(newVal) => {
                      const v = Array.isArray(newVal) ? newVal[0] : newVal;
                      setValues((prev) => ({ ...prev, [p.key]: v / 10 }));
                    }}
                  />
                  <div className="flex justify-between text-xs text-zinc-400">
                    <span>−2.5 SD (worse)</span>
                    <span>0 (mean)</span>
                    <span>+2.5 SD (better)</span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Coefficient: β ={" "}
                    <span
                      className={
                        p.beta < 0 ? "text-emerald-600" : "text-orange-500"
                      }
                    >
                      {p.beta}
                    </span>{" "}
                    · Contribution:{" "}
                    <span className="font-mono font-semibold">
                      {(p.beta * values[p.key]) >= 0 ? "+" : ""}
                      {(p.beta * values[p.key]).toFixed(3)} SD
                    </span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Result — 2/5 width */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-base">Predicted Index</CardTitle>
              <CardDescription>
                Composite malnutrition z-score (PC1)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center py-6">
                <p
                  className={`text-5xl font-bold font-mono ${burdenColor}`}
                >
                  {predicted >= 0 ? "+" : ""}
                  {predicted.toFixed(3)}
                </p>
                <p className={`mt-2 text-sm font-medium ${burdenColor}`}>
                  {burdenLabel}
                </p>
                <p className="mt-1 text-xs text-zinc-400">standard deviations</p>
              </div>

              <Separator />

              <div className="space-y-2 text-xs">
                <p className="font-medium text-zinc-700">Interpretation:</p>
                <ul className="space-y-1 text-zinc-500">
                  <li>
                    <span className="font-mono text-emerald-600">&lt; −1 SD</span>{" "}
                    — Low burden district
                  </li>
                  <li>
                    <span className="font-mono text-amber-500">0 ± 0.5</span>{" "}
                    — Average district
                  </li>
                  <li>
                    <span className="font-mono text-orange-500">+1 to +1.5</span>{" "}
                    — High burden
                  </li>
                  <li>
                    <span className="font-mono text-red-600">&gt; +1.5</span>{" "}
                    — Very high burden (top ~15%)
                  </li>
                </ul>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-medium text-zinc-700 mb-3">
                  Contribution by Predictor
                </p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={contributionData}
                    layout="vertical"
                    margin={{ left: 5, right: 30, top: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10 }} domain={[-1.5, 1.5]} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 9 }}
                      width={100}
                    />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number"
                          ? `${v >= 0 ? "+" : ""}${v.toFixed(3)} SD`
                          : v
                      }
                    />
                    <ReferenceLine x={0} stroke="#71717a" strokeWidth={1} />
                    <Bar
                      dataKey="contribution"
                      radius={[0, 3, 3, 0]}
                    >
                      {contributionData.map((d, i) => (
                        <Cell
                          key={i}
                          fill={d.contribution <= 0 ? "#22c55e" : "#ef4444"}
                          fillOpacity={0.8}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Model note */}
      <Card className="bg-zinc-50 border-zinc-200">
        <CardContent className="pt-5 pb-5">
          <p className="text-xs text-zinc-500 leading-relaxed">
            <strong>Model equation</strong>: Malnutrition Index (z) = −0.028 −
            0.378·Sanitation(z) − 0.406·Education(z) + 0.174·Deliveries(z) −
            0.043·Yield(z). All predictors z-scored. OLS estimated via numpy
            lstsq. R² = 0.523, n = 681 districts. Agricultural yield (p = 0.316)
            is not statistically significant at the 5% level and contributes
            minimally. Institutional deliveries have a positive coefficient,
            consistent with causality running from high-malnutrition areas
            receiving prioritised health infrastructure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
