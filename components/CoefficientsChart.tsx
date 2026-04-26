"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Women's Education", beta: -0.406 },
  { name: "Sanitation", beta: -0.378 },
  { name: "Institutional Deliveries", beta: 0.174 },
  { name: "Crop Yield", beta: -0.043 },
];

export default function CoefficientsChart() {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ left: 140, right: 40, top: 4, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis
          type="number"
          domain={[-0.5, 0.25]}
          tick={{ fontSize: 11 }}
          tickFormatter={(v) => v.toFixed(2)}
          label={{
            value: "Standardised coefficient (β)",
            position: "insideBottom",
            offset: -2,
            fontSize: 11,
            fill: "currentColor",
          }}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11 }}
          width={135}
        />
        <Tooltip
          formatter={(v) =>
            typeof v === "number"
              ? `β = ${v >= 0 ? "+" : ""}${v.toFixed(3)}`
              : v
          }
        />
        <ReferenceLine x={0} stroke="#71717a" strokeWidth={1} />
        <Bar dataKey="beta" radius={[0, 3, 3, 0]}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.beta < 0 ? "#22c55e" : "#f97316"}
              fillOpacity={Math.abs(d.beta) < 0.05 ? 0.4 : 0.85}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
