import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20 space-y-10">
      <div className="text-center space-y-4">
        <Badge className="bg-amber-100 text-amber-700 text-sm px-3 py-1">
          Coming Soon
        </Badge>
        <h1 className="text-4xl font-bold">The Blog</h1>
        <p className="text-zinc-500 max-w-lg mx-auto leading-relaxed">
          We are working on a longer-form writeup of this research — contextualising
          the findings within India's nutrition policy landscape, explaining the
          methodological choices, and discussing what the data can and cannot tell us.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Why districts, not states?",
            teaser:
              "State-level means mask enormous within-state heterogeneity. West Singhbhum (Jharkhand) sits 3 SD above the national mean while Ranchi sits at average — lumping them distorts every regression coefficient.",
          },
          {
            title: "The institutional deliveries paradox",
            teaser:
              "Our regression finds institutional deliveries have a positive coefficient (+0.17) on malnutrition. This is not evidence that hospitals cause malnutrition — it is a story of targeting, confounding, and endogeneity that requires careful handling.",
          },
          {
            title: "What the North-East cluster is telling us",
            teaser:
              "Cluster 2 has high sanitation and good malnutrition outcomes, but virtually no institutional deliveries (z ≈ −2.74). Traditional birth practices, community health infrastructure, and dietary diversity create a pathway invisible in the national model.",
          },
          {
            title: "Can JJM improve child outcomes?",
            teaser:
              "The Jal Jeevan Mission household-water-access variable entered our clustering as a fifth feature. Its cluster-level variation hints at a pathway from water security to nutrition, but untangling it from sanitation requires better instrumentation.",
          },
        ].map(({ title, teaser }) => (
          <Card
            key={title}
            className="opacity-70 border-dashed cursor-default select-none"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-zinc-600">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 leading-relaxed">{teaser}</p>
              <p className="mt-3 text-xs font-medium text-zinc-300">
                Draft in progress…
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
