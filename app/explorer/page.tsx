"use client";

import { useState, useMemo } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import districtsRaw from "@/lib/data/districts.json";

// ── Types ────────────────────────────────────────────────────────────────────

type DistrictRow = {
  district_id: number;
  state_name: string;
  district_name: string;
  cluster: number;
  z_malnutrition_index_pc1: number;
  z_improved_sanitation_pct: number;
  z_women_10plus_schooling_pct: number;
  z_institutional_deliveries_pct: number;
  z_hjg_villages_reported_ratio: number;
};

const districts: DistrictRow[] = districtsRaw as DistrictRow[];

// ── Model constants ───────────────────────────────────────────────────────────

const INTERCEPT = -0.028;
const COEF = {
  sanitation: -0.3775,
  education: -0.4055,
  deliveries: 0.1744,
  yield: -0.043,
};

const SLIDER_MIN = -3;
const SLIDER_MAX = 3;

const RAW_PARAMS = {
  sanitation:  { mean: 62.5, sd: 22.0, unit: "%", label: "HH with improved sanitation" },
  education:   { mean: 36.8, sd: 14.2, unit: "%", label: "women with 10+ yrs schooling" },
  deliveries:  { mean: 78.4, sd: 16.3, unit: "%", label: "births in health facility" },
  yield:       { mean: 2.1,  sd: 1.4,  unit: " t/ha", label: "weighted crop yield" },
};

const predictors = [
  { key: "sanitation" as const, label: "Improved Sanitation",         beta: COEF.sanitation },
  { key: "education"  as const, label: "Women's Education (10+ yrs)", beta: COEF.education  },
  { key: "deliveries" as const, label: "Institutional Deliveries",    beta: COEF.deliveries },
  { key: "yield"      as const, label: "Weighted Crop Yield",         beta: COEF.yield      },
];

// ── Static derived data ───────────────────────────────────────────────────────

const sortedZValues = [...districts]
  .map((d) => d.z_malnutrition_index_pc1)
  .sort((a, b) => a - b);

const stateList = [...new Set(districts.map((d) => d.state_name))].sort();

const CLUSTER_LABELS: Record<number, string> = {
  0: "Low Burden Type 2",
  1: "Low Burden Type 1",
  2: "High Burden Type 1",
  3: "High Burden Type 2",
};

const CLUSTER_COLORS: Record<number, string> = {
  0: "#22c55e",
  1: "#3b82f6",
  2: "#f59e0b",
  3: "#ef4444",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function zToRaw(z: number, key: keyof typeof RAW_PARAMS) {
  const { mean, sd } = RAW_PARAMS[key];
  return mean + z * sd;
}

function clampSlider(v: number) {
  return Math.max(SLIDER_MIN, Math.min(SLIDER_MAX, v));
}

function percentileRank(predicted: number): number {
  const below = sortedZValues.filter((z) => z < predicted).length;
  return below / sortedZValues.length;
}

function tierInfo(z: number): { tier: string; desc: string; color: string; bg: string } {
  if (z < -1)   return { tier: "LOW BURDEN",       desc: "Well below the national average — among India's best performing districts.",         color: "#16a34a", bg: "#dcfce7" };
  if (z < -0.3) return { tier: "BELOW AVERAGE",    desc: "Better than most districts — moderate structural advantages present.",               color: "#65a30d", bg: "#ecfccb" };
  if (z < 0.3)  return { tier: "NEAR AVERAGE",     desc: "Close to the national district average — mixed structural conditions.",              color: "#d97706", bg: "#fef3c7" };
  if (z < 1)    return { tier: "HIGH BURDEN",       desc: "Above the national average — significant gaps in sanitation or education likely.", color: "#ea580c", bg: "#ffedd5" };
  return           { tier: "VERY HIGH BURDEN",      desc: "Among the most burdened districts in India — multiple deprivations co-present.",    color: "#dc2626", bg: "#fee2e2" };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ExplorerPage() {
  const [values, setValues] = useState({ sanitation: 0, education: 0, deliveries: 0, yield: 0 });
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>("");
  const [loadedLabel, setLoadedLabel] = useState<string>("");

  const predicted =
    INTERCEPT +
    COEF.sanitation * values.sanitation +
    COEF.education  * values.education  +
    COEF.deliveries * values.deliveries +
    COEF.yield      * values.yield;

  const pct       = percentileRank(predicted);
  const tier      = tierInfo(predicted);

  const nearestDistrict = useMemo(() => {
    return districts.reduce((best, d) => {
      const dist     = Math.abs(d.z_malnutrition_index_pc1 - predicted);
      const bestDist = Math.abs(best.z_malnutrition_index_pc1 - predicted);
      return dist < bestDist ? d : best;
    });
  }, [predicted]);

  const districtsInState = useMemo(
    () =>
      selectedState
        ? districts
            .filter((d) => d.state_name === selectedState)
            .sort((a, b) => a.district_name.localeCompare(b.district_name))
        : [],
    [selectedState]
  );

  function loadDistrict(distId: string) {
    const d = districts.find((d) => d.district_id.toString() === distId);
    if (!d) return;
    setValues({
      sanitation: clampSlider(d.z_improved_sanitation_pct),
      education:  clampSlider(d.z_women_10plus_schooling_pct),
      deliveries: clampSlider(d.z_institutional_deliveries_pct),
      yield:      0, // not in district data; reset to national mean
    });
    setSelectedDistrictId(distId);
    setLoadedLabel(`${d.district_name}, ${d.state_name}`);
  }

  function clearPreset() {
    setValues({ sanitation: 0, education: 0, deliveries: 0, yield: 0 });
    setSelectedState("");
    setSelectedDistrictId("");
    setLoadedLabel("");
  }

  const contributionData = predictors.map((p) => ({
    name: p.label,
    contribution: parseFloat((p.beta * values[p.key]).toFixed(3)),
  }));

  const betterThan   = Math.round(pct * 100);
  const worseThan    = 100 - betterThan;
  const gaugePercent = Math.min(100, Math.max(0, pct * 100));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Interactive Predictor</h1>
        <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
          Adjust the sliders or load values from a real state / district. The
          model instantly estimates the expected malnutrition burden based on
          four structural factors.
        </p>
      </div>

      {/* ── State / District preset ─────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Load from a Real District
          </CardTitle>
          <CardDescription className="text-xs">
            Select a state then a district to pre-fill the sliders with that
            district&apos;s actual values.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-end">
            {/* State */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">State</p>
              <Select
                value={selectedState}
                onValueChange={(v) => {
                  setSelectedState(v ?? "");
                  setSelectedDistrictId("");
                  setLoadedLabel("");
                }}
              >
                <SelectTrigger className="w-56">
                  <SelectValue>Select a state…</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {stateList.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* District */}
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">
                District{selectedState ? ` (${selectedState})` : ""}
              </p>
              <Select
                value={selectedDistrictId}
                onValueChange={(v) => v && loadDistrict(v)}
              >
                <SelectTrigger className="w-56" disabled={!selectedState}>
                  <SelectValue>
                    {selectedState ? "Select a district…" : "Select a state first"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {districtsInState.map((d) => (
                    <SelectItem key={d.district_id} value={d.district_id.toString()}>
                      {d.district_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear */}
            {loadedLabel && (
              <button
                onClick={clearPreset}
                className="text-xs text-muted-foreground hover:text-foreground underline pb-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {loadedLabel && (
            <p className="text-xs text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
              Loaded from{" "}
              <span className="font-semibold text-foreground">{loadedLabel}</span>
              {" "}— crop yield reset to national mean (not in dataset).
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* ── Sliders ───────────────────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-5">
          {predictors.map((p) => {
            const rawVal = zToRaw(values[p.key], p.key);
            const zVal   = values[p.key];
            const { unit, label: rawLabel } = RAW_PARAMS[p.key];
            return (
              <Card key={p.key}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold">{p.label}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        {rawLabel}
                      </CardDescription>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-xl font-bold font-mono">
                        {rawVal.toFixed(1)}{unit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {zVal >= 0 ? "+" : ""}{zVal.toFixed(2)} SD from mean
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
                      setLoadedLabel("");
                    }}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      {zToRaw(SLIDER_MIN, p.key).toFixed(0)}{unit} (low)
                    </span>
                    <span>
                      {zToRaw(0, p.key).toFixed(0)}{unit} (avg)
                    </span>
                    <span>
                      {zToRaw(SLIDER_MAX, p.key).toFixed(0)}{unit} (high)
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Effect on malnutrition:{" "}
                    <span
                      className="font-semibold"
                      style={{ color: p.beta < 0 ? "#16a34a" : "#ea580c" }}
                    >
                      {p.beta < 0 ? "reduces" : "increases"} by{" "}
                      {Math.abs(p.beta * values[p.key]).toFixed(3)} SD
                    </span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── Result panel ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Burden Assessment</CardTitle>
              <CardDescription>
                Based on the OLS regression model (R² = 0.523)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">

              {/* Tier badge */}
              <div
                className="rounded-xl px-4 py-4 text-center space-y-1"
                style={{ background: tier.bg }}
              >
                <p
                  className="text-lg font-black tracking-widest"
                  style={{ color: tier.color }}
                >
                  {tier.tier}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: tier.color }}>
                  {tier.desc}
                </p>
              </div>

              {/* Gauge */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low burden</span>
                  <span>High burden</span>
                </div>
                <div
                  className="relative h-4 rounded-full overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(to right, #22c55e, #a3e635, #fbbf24, #f97316, #dc2626)",
                  }}
                >
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md border-2 border-zinc-700 transition-all duration-200"
                    style={{ left: `${gaugePercent}%`, transform: "translate(-50%, -50%)" }}
                  />
                </div>
              </div>

              {/* Percentile plain-language */}
              <div className="rounded-lg bg-muted/50 px-4 py-3 space-y-1">
                <p className="text-sm font-semibold">
                  {predicted <= 0
                    ? `Better than ${betterThan}% of India's districts`
                    : `More burdened than ${worseThan}% of India's districts`}
                </p>
                <p className="text-xs text-muted-foreground">
                  Out of {districts.length} districts analysed
                </p>
                {/* Percentile bar */}
                <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${gaugePercent}%`,
                      background: tier.color,
                    }}
                  />
                </div>
              </div>

              {/* Nearest real district */}
              <div className="rounded-lg border border-border px-4 py-3 space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Most similar real district
                </p>
                <p className="text-sm font-semibold">
                  {nearestDistrict.district_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {nearestDistrict.state_name}
                </p>
                <span
                  className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1"
                  style={{
                    background: CLUSTER_COLORS[nearestDistrict.cluster] + "22",
                    color: CLUSTER_COLORS[nearestDistrict.cluster],
                  }}
                >
                  {CLUSTER_LABELS[nearestDistrict.cluster]}
                </span>
              </div>

              <Separator />

              {/* Contribution chart */}
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Which factors are driving this result?
                </p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart
                    data={contributionData}
                    layout="vertical"
                    margin={{ left: 5, right: 30, top: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10 }}
                      domain={[-1.5, 1.5]}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 9 }}
                      width={100}
                    />
                    <Tooltip
                      formatter={(v) =>
                        typeof v === "number"
                          ? `${v >= 0 ? "↑ increases" : "↓ reduces"} burden by ${Math.abs(v).toFixed(3)} SD`
                          : v
                      }
                    />
                    <ReferenceLine x={0} stroke="#71717a" strokeWidth={1} />
                    <Bar dataKey="contribution" radius={[0, 3, 3, 0]}>
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
      <Card className="bg-muted/40 border-border">
        <CardContent className="pt-5 pb-5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Model</strong>: Malnutrition Index
            (z) = −0.028 − 0.378·Sanitation(z) − 0.406·Education(z) +
            0.174·Deliveries(z) − 0.043·Yield(z). All predictors z-scored. OLS
            via numpy lstsq; R² = 0.523, n = 681. Crop yield is not significant
            (p = 0.32). Institutional deliveries have a positive coefficient
            because high-malnutrition areas receive targeted health
            infrastructure — not because hospitals cause malnutrition.{" "}
            <strong className="text-foreground">Crop yield</strong> is set to the
            national mean when loading from a real district as it is not in the
            district dataset.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
