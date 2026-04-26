"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import statesRaw from "@/lib/data/states.json";
import districtsRaw from "@/lib/data/districts.json";
import clusterProfilesRaw from "@/lib/data/cluster_profiles.json";

type StateRow = {
  state_name: string;
  stunting: number;
  wasting: number;
  underweight: number;
  anaemia: number;
  sanitation: number;
  education: number;
  n_districts: number;
};

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
  pca1: number;
  pca2: number;
};

const states: StateRow[] = statesRaw as StateRow[];
const districts: DistrictRow[] = districtsRaw as DistrictRow[];

const CLUSTER_COLORS: Record<number, string> = {
  0: "#22c55e",
  1: "#3b82f6",
  2: "#f59e0b",
  3: "#ef4444",
};

const CLUSTER_LABELS: Record<number, string> = {
  0: "Low Burden",
  1: "NE Outlier",
  2: "High Burden",
  3: "Very High Burden",
};

const outcomeOptions = [
  { value: "stunting", label: "Stunting %" },
  { value: "wasting", label: "Wasting %" },
  { value: "underweight", label: "Underweight %" },
  { value: "anaemia", label: "Anaemia %" },
];

const xAxisOptions = [
  { value: "sanitation", label: "Sanitation %" },
  { value: "education", label: "Women's Education %" },
  { value: "stunting", label: "Stunting %" },
  { value: "wasting", label: "Wasting %" },
];

const clusterFeatureLabels: Record<string, string> = {
  z_malnutrition_index_pc1: "Malnutrition Index",
  z_improved_sanitation_pct: "Sanitation",
  z_women_10plus_schooling_pct: "Women's Education",
  z_institutional_deliveries_pct: "Institutional Deliveries",
  z_hjg_villages_reported_ratio: "JJM Water Access",
};

const clusterRadarData = (() => {
  const features = [
    "z_malnutrition_index_pc1",
    "z_improved_sanitation_pct",
    "z_women_10plus_schooling_pct",
    "z_institutional_deliveries_pct",
    "z_hjg_villages_reported_ratio",
  ] as const;
  return features.map((f) => {
    const row: Record<string, string | number> = {
      feature: clusterFeatureLabels[f],
    };
    clusterProfilesRaw.forEach((cp, i) => {
      row[`Cluster ${i + 1}`] = cp[f as keyof typeof cp] as number;
    });
    return row;
  });
})();

const topDistrictsWorst = [...districts]
  .sort((a, b) => b.z_malnutrition_index_pc1 - a.z_malnutrition_index_pc1)
  .slice(0, 10);

export default function DashboardPage() {
  const [outcome, setOutcome] = useState<keyof StateRow>("stunting");
  const [xAxis, setXAxis] = useState<keyof StateRow>("sanitation");

  const stateBarData = [...states]
    .sort((a, b) => (b[outcome] as number) - (a[outcome] as number))
    .slice(0, 20)
    .map((s) => ({ name: s.state_name, value: s[outcome] as number }));

  const scatterData = states.map((s) => ({
    x: s[xAxis] as number,
    y: s[outcome] as number,
    name: s.state_name,
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            State-level outcomes, scatter relationships, cluster profiles, and
            district PCA — all in one view.
          </p>
        </div>
        {/* Shared controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Outcome:</span>
            <Select
              value={outcome as string}
              onValueChange={(v) => setOutcome(v as keyof StateRow)}
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {outcomeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">X-axis:</span>
            <Select
              value={xAxis as string}
              onValueChange={(v) => setXAxis(v as keyof StateRow)}
            >
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {xAxisOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Row 1: State bar chart + Scatter side by side */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              State Rankings —{" "}
              {outcomeOptions.find((o) => o.value === outcome)?.label}
            </CardTitle>
            <CardDescription>Top 20 states, sorted descending</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={480}>
              <BarChart
                data={stateBarData}
                layout="vertical"
                margin={{ left: 120, right: 16, top: 4, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  width={115}
                />
                <Tooltip
                  formatter={(v) =>
                    typeof v === "number" ? `${v.toFixed(1)}%` : v
                  }
                />
                <Bar dataKey="value" fill="#ef4444" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {xAxisOptions.find((o) => o.value === xAxis)?.label} vs{" "}
              {outcomeOptions.find((o) => o.value === outcome)?.label}
            </CardTitle>
            <CardDescription>Each point is one state (n = 34)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={480}>
              <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="x"
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: xAxisOptions.find((o) => o.value === xAxis)?.label,
                    position: "insideBottom",
                    offset: -14,
                    fontSize: 12,
                  }}
                />
                <YAxis
                  dataKey="y"
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  label={{
                    value: outcomeOptions.find((o) => o.value === outcome)?.label,
                    angle: -90,
                    position: "insideLeft",
                    fontSize: 12,
                  }}
                />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.length) return null;
                    const d = payload[0].payload as {
                      name: string;
                      x: number;
                      y: number;
                    };
                    return (
                      <div className="rounded border border-border bg-background px-3 py-2 text-xs shadow">
                        <p className="font-semibold">{d.name}</p>
                        <p>
                          {xAxisOptions.find((o) => o.value === xAxis)?.label}:{" "}
                          {d.x.toFixed(1)}%
                        </p>
                        <p>
                          {outcomeOptions.find((o) => o.value === outcome)?.label}:{" "}
                          {d.y.toFixed(1)}%
                        </p>
                      </div>
                    );
                  }}
                />
                <Scatter data={scatterData} fill="#3b82f6" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Cluster radar + cluster summary cards */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              Cluster Profiles — Mean Z-Scores
            </CardTitle>
            <CardDescription>
              Radar over 5 z-scored features; K=4 clustering on 681 districts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={360}>
              <RadarChart data={clusterRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="feature" tick={{ fontSize: 11 }} />
                {[0, 1, 2, 3].map((i) => (
                  <Radar
                    key={i}
                    name={CLUSTER_LABELS[i]}
                    dataKey={`Cluster ${i + 1}`}
                    stroke={CLUSTER_COLORS[i]}
                    fill={CLUSTER_COLORS[i]}
                    fillOpacity={0.15}
                  />
                ))}
                <Legend />
                <Tooltip
                  formatter={(v) =>
                    typeof v === "number"
                      ? `${v >= 0 ? "+" : ""}${v.toFixed(2)} SD`
                      : v
                  }
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 gap-4 content-start">
          {clusterProfilesRaw.map((cp, i) => (
            <div
              key={i}
              className="rounded-xl border p-4 space-y-2"
              style={{ borderColor: CLUSTER_COLORS[i] + "66" }}
            >
              <p
                className="text-sm font-semibold"
                style={{ color: CLUSTER_COLORS[i] }}
              >
                {CLUSTER_LABELS[i]}
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>Malnutrition:</span>
                <span className="font-mono text-right">
                  {cp.z_malnutrition_index_pc1 >= 0 ? "+" : ""}
                  {cp.z_malnutrition_index_pc1.toFixed(2)} SD
                </span>
                <span>Sanitation:</span>
                <span className="font-mono text-right">
                  {cp.z_improved_sanitation_pct >= 0 ? "+" : ""}
                  {cp.z_improved_sanitation_pct.toFixed(2)} SD
                </span>
                <span>Women&apos;s Ed.:</span>
                <span className="font-mono text-right">
                  {cp.z_women_10plus_schooling_pct >= 0 ? "+" : ""}
                  {cp.z_women_10plus_schooling_pct.toFixed(2)} SD
                </span>
                <span>Deliveries:</span>
                <span className="font-mono text-right">
                  {cp.z_institutional_deliveries_pct >= 0 ? "+" : ""}
                  {cp.z_institutional_deliveries_pct.toFixed(2)} SD
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: District PCA scatter — full width */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">
            District PCA Space (PC1 vs PC2)
          </CardTitle>
          <CardDescription>
            681 districts coloured by cluster — hover for district name
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={460}>
            <ScatterChart margin={{ top: 10, right: 20, bottom: 30, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="pca1"
                type="number"
                tick={{ fontSize: 11 }}
                label={{
                  value: "PC1 — Malnutrition Burden →",
                  position: "insideBottom",
                  offset: -14,
                  fontSize: 12,
                }}
              />
              <YAxis
                dataKey="pca2"
                type="number"
                tick={{ fontSize: 11 }}
                label={{
                  value: "PC2",
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 12,
                }}
              />
              <ReferenceLine x={0} stroke="#71717a" strokeDasharray="4 4" strokeWidth={1} />
              <ReferenceLine y={0} stroke="#71717a" strokeDasharray="4 4" strokeWidth={1} />
              <Tooltip
                content={({ payload }) => {
                  if (!payload?.length) return null;
                  const d = payload[0].payload as DistrictRow;
                  return (
                    <div className="rounded border border-border bg-background px-3 py-2 text-xs shadow">
                      <p className="font-semibold">
                        {d.district_name}, {d.state_name}
                      </p>
                      <p style={{ color: CLUSTER_COLORS[d.cluster] }}>
                        {CLUSTER_LABELS[d.cluster]}
                      </p>
                      <p>
                        Index:{" "}
                        {d.z_malnutrition_index_pc1 >= 0 ? "+" : ""}
                        {d.z_malnutrition_index_pc1.toFixed(2)} SD
                      </p>
                    </div>
                  );
                }}
              />
              {[0, 1, 2, 3].map((cluster) => (
                <Scatter
                  key={cluster}
                  name={CLUSTER_LABELS[cluster]}
                  data={districts.filter((d) => d.cluster === cluster)}
                  fill={CLUSTER_COLORS[cluster]}
                  fillOpacity={0.55}
                />
              ))}
              <Legend />
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Row 4: Worst districts table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Highest Malnutrition Districts</h2>
        <Card>
          <CardContent className="pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="pb-2 pr-4">District</th>
                  <th className="pb-2 pr-4">State</th>
                  <th className="pb-2 pr-4">Cluster</th>
                  <th className="pb-2 text-right">Malnutrition Index (z)</th>
                </tr>
              </thead>
              <tbody>
                {topDistrictsWorst.map((d) => (
                  <tr key={d.district_id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-medium">{d.district_name}</td>
                    <td className="py-2 pr-4 text-muted-foreground">
                      {d.state_name}
                    </td>
                    <td className="py-2 pr-4">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          background: CLUSTER_COLORS[d.cluster] + "22",
                          color: CLUSTER_COLORS[d.cluster],
                        }}
                      >
                        {CLUSTER_LABELS[d.cluster]}
                      </span>
                    </td>
                    <td className="py-2 text-right font-mono text-red-500">
                      +{d.z_malnutrition_index_pc1.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
