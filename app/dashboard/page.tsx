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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const sortedStates = [...states].sort((a, b) => b.stunting - a.stunting);

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
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-sm text-zinc-500">
          State-level aggregates and district cluster profiles. Use the
          dropdowns to explore different outcomes.
        </p>
      </div>

      <Tabs defaultValue="states">
        <TabsList>
          <TabsTrigger value="states">State Rankings</TabsTrigger>
          <TabsTrigger value="scatter">Scatter Explorer</TabsTrigger>
          <TabsTrigger value="clusters">Cluster Profiles</TabsTrigger>
          <TabsTrigger value="districts">District Map (PCA)</TabsTrigger>
        </TabsList>

        {/* State Bar Chart */}
        <TabsContent value="states" className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-zinc-700">Outcome:</span>
            <Select
              value={outcome as string}
              onValueChange={(v) => setOutcome(v as keyof StateRow)}
            >
              <SelectTrigger className="w-48">
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
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Top 20 States by{" "}
                {outcomeOptions.find((o) => o.value === outcome)?.label}
              </CardTitle>
              <CardDescription>Sorted descending; state averages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={420}>
                <BarChart
                  data={stateBarData}
                  layout="vertical"
                  margin={{ left: 130, right: 20, top: 4, bottom: 4 }}
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
                    tick={{ fontSize: 11 }}
                    width={125}
                  />
                  <Tooltip formatter={(v) => typeof v === "number" ? `${v.toFixed(1)}%` : v} />
                  <Bar dataKey="value" fill="#ef4444" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scatter Explorer */}
        <TabsContent value="scatter" className="mt-6 space-y-4">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-700">X-axis:</span>
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
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-700">Y-axis:</span>
              <Select
                value={outcome as string}
                onValueChange={(v) => setOutcome(v as keyof StateRow)}
              >
                <SelectTrigger className="w-48">
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
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {xAxisOptions.find((o) => o.value === xAxis)?.label} vs{" "}
                {outcomeOptions.find((o) => o.value === outcome)?.label}
              </CardTitle>
              <CardDescription>Each point is one state</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={380}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="x"
                    type="number"
                    name={xAxisOptions.find((o) => o.value === xAxis)?.label}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: xAxisOptions.find((o) => o.value === xAxis)?.label,
                      position: "insideBottom",
                      offset: -12,
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    dataKey="y"
                    type="number"
                    name={outcomeOptions.find((o) => o.value === outcome)?.label}
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`}
                    label={{
                      value: outcomeOptions.find((o) => o.value === outcome)
                        ?.label,
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      const d = payload[0].payload as {
                        name: string;
                        x: number;
                        y: number;
                      };
                      return (
                        <div className="rounded bg-white border border-zinc-200 px-3 py-2 text-xs shadow">
                          <p className="font-semibold">{d.name}</p>
                          <p>
                            {xAxisOptions.find((o) => o.value === xAxis)?.label}:{" "}
                            {d.x.toFixed(1)}%
                          </p>
                          <p>
                            {
                              outcomeOptions.find((o) => o.value === outcome)
                                ?.label
                            }
                            : {d.y.toFixed(1)}%
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
        </TabsContent>

        {/* Cluster Profiles Radar */}
        <TabsContent value="clusters" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Cluster Mean Z-Scores (5 features)
              </CardTitle>
              <CardDescription>
                Radar chart — each axis is a z-scored feature; K=4 clustering on 704 districts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={420}>
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
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {clusterProfilesRaw.map((cp, i) => (
                  <div
                    key={i}
                    className="rounded-lg border p-3 space-y-1"
                    style={{ borderColor: CLUSTER_COLORS[i] }}
                  >
                    <p
                      className="text-xs font-semibold"
                      style={{ color: CLUSTER_COLORS[i] }}
                    >
                      {CLUSTER_LABELS[i]}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Malnutrition index: {cp.z_malnutrition_index_pc1 > 0 ? "+" : ""}
                      {cp.z_malnutrition_index_pc1.toFixed(2)} SD
                    </p>
                    <p className="text-xs text-zinc-500">
                      Sanitation: {cp.z_improved_sanitation_pct > 0 ? "+" : ""}
                      {cp.z_improved_sanitation_pct.toFixed(2)} SD
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* District PCA Scatter */}
        <TabsContent value="districts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                District-Level PCA Space (PC1 vs PC2)
              </CardTitle>
              <CardDescription>
                Coloured by K-means cluster assignment — 704 districts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={460}>
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="pca1"
                    type="number"
                    name="PC1"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "PC1 (Malnutrition Burden)",
                      position: "insideBottom",
                      offset: -12,
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    dataKey="pca2"
                    type="number"
                    name="PC2"
                    tick={{ fontSize: 11 }}
                    label={{
                      value: "PC2",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      const d = payload[0].payload as DistrictRow;
                      return (
                        <div className="rounded bg-white border border-zinc-200 px-3 py-2 text-xs shadow">
                          <p className="font-semibold">
                            {d.district_name}, {d.state_name}
                          </p>
                          <p style={{ color: CLUSTER_COLORS[d.cluster] }}>
                            {CLUSTER_LABELS[d.cluster]}
                          </p>
                          <p>
                            Malnutrition index:{" "}
                            {d.z_malnutrition_index_pc1 > 0 ? "+" : ""}
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
                      fillOpacity={0.6}
                    />
                  ))}
                  <Legend />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Worst districts table */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Highest Malnutrition Districts</h2>
        <Card>
          <CardContent className="pt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-zinc-500 uppercase tracking-wider">
                  <th className="pb-2 pr-4">District</th>
                  <th className="pb-2 pr-4">State</th>
                  <th className="pb-2 pr-4">Cluster</th>
                  <th className="pb-2 text-right">Malnutrition Index (z)</th>
                </tr>
              </thead>
              <tbody>
                {[...districts]
                  .sort(
                    (a, b) =>
                      b.z_malnutrition_index_pc1 - a.z_malnutrition_index_pc1
                  )
                  .slice(0, 10)
                  .map((d) => (
                    <tr key={d.district_id} className="border-b last:border-0">
                      <td className="py-2 pr-4 font-medium">
                        {d.district_name}
                      </td>
                      <td className="py-2 pr-4 text-zinc-600">{d.state_name}</td>
                      <td className="py-2 pr-4">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background:
                              CLUSTER_COLORS[d.cluster] + "22",
                            color: CLUSTER_COLORS[d.cluster],
                          }}
                        >
                          {CLUSTER_LABELS[d.cluster]}
                        </span>
                      </td>
                      <td className="py-2 text-right font-mono text-red-600">
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
