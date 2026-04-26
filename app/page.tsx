import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import stats from "@/lib/data/stats.json";

const statCards = [
  {
    label: "Districts Analysed",
    value: stats.n_districts.toLocaleString(),
    sub: "across 28 states & 8 UTs",
  },
  {
    label: "Mean Stunting Rate",
    value: `${stats.mean_stunting}%`,
    sub: "children under 5, NFHS-5",
  },
  {
    label: "Mean Anaemia Rate",
    value: `${stats.mean_anaemia}%`,
    sub: "children 6–59 months",
  },
  {
    label: "Model R²",
    value: stats.r_squared.toFixed(3),
    sub: "4-predictor OLS on composite index",
  },
];

const findings = [
  {
    title: "Women's education is the strongest lever",
    description:
      "A one-standard-deviation increase in female schooling predicts a 0.41 SD reduction in the composite malnutrition index — larger than sanitation or delivery care.",
    badge: "β = −0.406",
    color: "bg-violet-100 text-violet-700",
  },
  {
    title: "Four structurally distinct clusters emerge",
    description:
      "K-means on 5 policy-relevant features separates a Low-Burden group (southern & western districts) from a Very High Burden group concentrated in tribal belts of Gujarat, Jharkhand, and Maharashtra.",
    badge: "K = 4",
    color: "bg-amber-100 text-amber-700",
  },
  {
    title: "Sanitation and education are co-linear pathways",
    description:
      "The PC1 composite index captures 59.8 % of shared variance across stunting, wasting, underweight, and anaemia — collapsing four correlated outcomes into one policy-legible signal.",
    badge: "PC1 = 59.8%",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "North-East India is a structural outlier",
    description:
      "High sanitation coverage but very low institutional deliveries (z ≈ −2.74) isolates NE districts into their own cluster despite moderate malnutrition — a pattern invisible in state-level aggregates.",
    badge: "Cluster 2",
    color: "bg-sky-100 text-sky-700",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-20">
      {/* Hero */}
      <section className="space-y-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight leading-tight">
          Child Malnutrition in India
          <br />
          <span className="text-zinc-400 font-normal text-2xl">
            A district-level analysis using NFHS-4 &amp; NFHS-5
          </span>
        </h1>
        <p className="mx-auto max-w-2xl text-zinc-600 leading-relaxed">
          Despite rapid economic growth, India accounts for one-third of the
          world's stunted children. This project uses panel data from 704
          districts, principal-component analysis, OLS regression, and K-means
          clustering to identify which structural factors drive malnutrition and
          where policy must act first.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link
            href="/dashboard"
            className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Explore the Dashboard
          </Link>
          <Link
            href="/explorer"
            className="inline-flex items-center rounded-full border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            Try the Predictor
          </Link>
        </div>
      </section>

      {/* Stat Cards */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map(({ label, value, sub }) => (
          <Card key={label} className="text-center">
            <CardHeader className="pb-1">
              <CardDescription className="text-xs uppercase tracking-wider">
                {label}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-3xl font-bold text-zinc-900">{value}</p>
              <p className="mt-1 text-xs text-zinc-500">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Key Findings */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Key Findings</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {findings.map(({ title, description, badge, color }) => (
            <Card key={title}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">
                    {title}
                  </CardTitle>
                  <Badge className={`shrink-0 text-xs ${color}`}>{badge}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Methodology callout */}
      <section className="rounded-xl border border-zinc-200 bg-white p-8 space-y-3">
        <h2 className="text-lg font-semibold">Methodology in Brief</h2>
        <ul className="text-sm text-zinc-600 space-y-2 list-disc list-inside">
          <li>
            <strong>Data</strong>: NFHS-4 (2015-16) and NFHS-5 (2019-21) at
            district level; supplemented by HMIS, JJM, and Agriculture
            Statistics.
          </li>
          <li>
            <strong>Composite index</strong>: PCA on stunting, wasting,
            underweight, and anaemia — PC1 treated as the malnutrition index
            (59.8 % variance).
          </li>
          <li>
            <strong>Regression</strong>: Hand-coded OLS with z-scored predictors
            (sanitation, female education, institutional deliveries, crop yield).
            R² = 0.523.
          </li>
          <li>
            <strong>Clustering</strong>: K-means (K=4) on 5 z-scored features
            including the JJM water-access proxy; silhouette score 0.31.
          </li>
        </ul>
      </section>
    </div>
  );
}
