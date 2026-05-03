"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  Legend,
} from "recharts";

const CLUSTER_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"];
const CLUSTER_LABELS = ["High Burden Type 2", "Low Burden Type 1", "High Burden Type 1", "Low Burden Type 2"];

const distributionData = [
  { name: "High Burden Type 2", n: 196, color: CLUSTER_COLORS[0] },
  { name: "Low Burden Type 1", n: 50, color: CLUSTER_COLORS[1] },
  { name: "High Burden Type 1", n: 253, color: CLUSTER_COLORS[2] },
  { name: "Low Burden Type 2", n: 182, color: CLUSTER_COLORS[3] },
];

const profileData = [
  {
    cluster: "High Burden Type 2",
    "Malnutrition Index": -0.742,
    Sanitation: 0.875,
    "Women's Ed.": 0.945,
  },
  {
    cluster: "Low Burden Type 1",
    "Malnutrition Index": -0.693,
    Sanitation: 0.713,
    "Women's Ed.": -0.333,
  },
  {
    cluster: "High Burden Type 1",
    "Malnutrition Index": -0.047,
    Sanitation: -0.056,
    "Women's Ed.": -0.148,
  },
  {
    cluster: "Low Burden Type 2",
    "Malnutrition Index": 1.096,
    Sanitation: -1.111,
    "Women's Ed.": -0.836,
  },
];

const RADIAN = Math.PI / 180;

function CustomLabel({
  cx, cy, midAngle, innerRadius, outerRadius, percent,
}: {
  cx: number; cy: number; midAngle: number;
  innerRadius: number; outerRadius: number;
  percent: number;
}) {
  if (percent < 0.07) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function ClusterViz() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Donut — district count per cluster */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Districts per Cluster
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={distributionData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={100}
              dataKey="n"
              nameKey="name"
              labelLine={false}
              label={CustomLabel as never}
            >
              {distributionData.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, name) => [`${v} districts`, name]}
            />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-zinc-600 dark:text-zinc-400">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Grouped bar — cluster mean z-scores */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Cluster Mean Z-Scores (3 key features)
        </p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={profileData}
            margin={{ left: 0, right: 10, top: 4, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="cluster"
              tick={{ fontSize: 10 }}
              tickFormatter={(v: string) => v.split(" ")[0]}
            />
            <YAxis tick={{ fontSize: 10 }} domain={[-1.5, 1.5]} />
            <ReferenceLine y={0} stroke="#71717a" strokeWidth={1} />
            <Tooltip
              formatter={(v) =>
                typeof v === "number"
                  ? `${v >= 0 ? "+" : ""}${v.toFixed(2)} SD`
                  : v
              }
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Malnutrition Index" fill="#ef4444" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Sanitation" fill="#3b82f6" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
            <Bar dataKey="Women's Ed." fill="#a855f7" fillOpacity={0.8} radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cluster label chips */}
      <div className="lg:col-span-2 flex flex-wrap gap-2">
        {CLUSTER_LABELS.map((label, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium"
            style={{ background: CLUSTER_COLORS[i] + "22", color: CLUSTER_COLORS[i] }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: CLUSTER_COLORS[i] }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
