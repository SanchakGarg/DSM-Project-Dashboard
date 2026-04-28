import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const indicators = [
  { label: "Stunting",        value: 33.5, color: "#ef4444" },
  { label: "Wasting",         value: 18.6, color: "#f97316" },
  { label: "Underweight",     value: 29.6, color: "#f59e0b" },
  { label: "Child Anaemia",   value: 66.0, color: "#dc2626" },
];

const districtTypes = [
  {
    n: 1,
    title: "Low-burden districts",
    color: "#22c55e",
    bg: "#dcfce7",
    description:
      "Lower malnutrition, better sanitation, higher women's education, and stronger water access. Often found in Kerala, Tamil Nadu, Punjab, and parts of the Northeast.",
  },
  {
    n: 2,
    title: "Northeast outlier districts",
    color: "#3b82f6",
    bg: "#dbeafe",
    description:
      "Relatively low malnutrition despite weaker formal healthcare indicators. May be linked to local diets, culture, or community practices.",
  },
  {
    n: 3,
    title: "High-burden districts",
    color: "#f59e0b",
    bg: "#fef3c7",
    description:
      "Moderate disadvantages and lower water coverage. They formed the largest group in our analysis.",
  },
  {
    n: 4,
    title: "Very high-burden districts",
    color: "#ef4444",
    bg: "#fee2e2",
    description:
      "Multiple problems at the same time: high malnutrition, low sanitation, and low women's education. These districts may need the most urgent attention.",
  },
];

export default function BlogPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <header className="space-y-4 mb-10">
        <div className="flex items-center gap-2">
          <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            Research Note
          </Badge>
          <span className="text-xs text-muted-foreground">
            DSM Spring 2026 · 8 min read
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Why Are So Many Children in India Still Malnourished?
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Despite India&apos;s economic rise, one in three children remains
          stunted. We dug into district-level data from NFHS-5, NFHS-4, HMIS,
          and the Jal Jeevan Mission to understand why.
        </p>
      </header>

      <Separator className="mb-10" />

      {/* Intro */}
      <section className="space-y-5 prose-base">
        <p className="text-base leading-7 text-foreground/90">
          Imagine two children growing up in two different districts of India.
          Both of them live in a country that is building highways, expanding
          digital services, launching satellites, and becoming one of the
          world&apos;s fastest-growing economies. But their everyday lives may
          look completely different. One child may have access to clean
          drinking water, a toilet at home, good schooling, and health
          services. The other one may grow up in a place with unsafe water,
          poor sanitation, limited food, and weak healthcare.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          This difference can shape something as basic as whether a child grows
          properly. But how much difference are we talking about? This is what
          we set out to find through our final project for the Data Science and
          Management course. Despite major economic progress, many children are
          still stunted, underweight, wasted, or anaemic. This contradiction is
          often called the <em>South Asian Enigma</em>. Instead of just asking
          which states are doing better or worse, we asked a more nuanced
          question: <strong>what explains why one district has much higher
          child malnutrition than another?</strong>
        </p>
        <p className="text-base leading-7 text-foreground/90">
          To answer this, we studied district-level data from sources such as
          NFHS-5, NFHS-4, HMIS, agriculture statistics, and Jal Jeevan Mission
          data. The goal was to see how food availability, water and
          sanitation, healthcare access, and women&apos;s education are
          connected to child nutrition outcomes.
        </p>
      </section>

      {/* What We Wanted to Understand */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          What We Wanted to Understand
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          Child malnutrition is not caused by just one thing. It can be linked
          to food, health services, sanitation, water access, education,
          income, and many other social conditions. For this project, we
          focused on three main questions:
        </p>
        <ol className="space-y-2 list-decimal list-inside text-base leading-7 text-foreground/90 marker:text-muted-foreground marker:font-semibold">
          <li>How much does food availability matter?</li>
          <li>Does sanitation and water access matter?</li>
          <li>Does healthcare access matter?</li>
        </ol>
        <p className="text-base leading-7 text-foreground/90">
          We also included <strong>women&apos;s education</strong> as an
          important background factor because educated mothers are often better
          able to access health services, understand nutrition, and make
          informed household decisions.
        </p>
      </section>

      {/* What the Data Showed — with the indicator table */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          What the Data Showed
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          The numbers show that child malnutrition is still a major problem in
          many Indian districts. Across districts, the average levels were:
        </p>

        {/* Beautiful table */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40 border-b border-border">
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                    Indicator
                  </th>
                  <th className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                    District Average
                  </th>
                  <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3 w-2/5">
                    Visual
                  </th>
                </tr>
              </thead>
              <tbody>
                {indicators.map((row, i) => (
                  <tr
                    key={row.label}
                    className={
                      i < indicators.length - 1 ? "border-b border-border" : ""
                    }
                  >
                    <td className="px-5 py-4 text-sm font-medium">
                      {row.label}
                    </td>
                    <td className="px-5 py-4 text-right text-sm font-mono font-semibold tabular-nums">
                      {row.value.toFixed(1)}%
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${row.value}%`,
                            background: row.color,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <p className="text-base leading-7 text-foreground/90">
          In simple terms, this means that in many districts a large share of
          children are too short for their age, too thin for their height,
          underweight, or anaemic.
        </p>

        <blockquote className="border-l-4 border-red-500 bg-red-50 dark:bg-red-950/30 px-5 py-4 rounded-r-md my-6">
          <p className="text-sm leading-relaxed text-foreground/90">
            One especially worrying result was{" "}
            <strong>child anaemia</strong>. While stunting, wasting, and
            underweight improved slightly between NFHS-4 and NFHS-5, anaemia
            became <em>worse</em> on average. Only about one-third of districts
            showed improvement. This suggests that micronutrient deficiencies
            still remain a serious challenge.
          </p>
        </blockquote>
      </section>

      {/* Malnutrition Is Not Spread Evenly */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          Malnutrition Is Not Spread Evenly
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          One of the strongest takeaways from our project is that malnutrition
          is not evenly distributed across India. Some districts have much
          higher burdens than others. High-burden districts were concentrated
          in states such as <strong>Jharkhand, Gujarat, Bihar, Maharashtra,
          and Uttar Pradesh</strong>. Districts such as West Singhbhum
          (Jharkhand), Panch Mahals and Dohad (Gujarat), and Nandurbar
          (Maharashtra) appeared among the highest-burden areas.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          On the other hand, districts in states such as Kerala, Punjab,
          Haryana, Tamil Nadu, Himachal Pradesh, and parts of the Northeast
          often showed lower malnutrition levels.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          This matters because state-level averages can hide local problems. A
          state may look moderate overall, but some districts inside it may
          still be facing severe nutritional deprivation.
        </p>
      </section>

      {/* Education and Sanitation */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          Education and Sanitation Matter Most
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          The project compared several possible explanations for malnutrition.
          The clearest finding was that <strong>women&apos;s education and
          sanitation were the strongest predictors</strong> of lower
          malnutrition.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          Districts where more women had 10 or more years of schooling
          generally had lower child malnutrition. Our hypothesis is that
          education improves health awareness, nutrition knowledge, hygiene
          practices, and the ability to use government services.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          We also noticed that districts with better sanitation coverage tended
          to have lower malnutrition. This is important because malnutrition is
          not only about how much food a child eats. If a child is repeatedly
          exposed to infections because of poor sanitation, their body may not
          absorb nutrients properly. <em>A child&apos;s growth depends not
          only on food, but also on the environment around them.</em>
        </p>
      </section>

      {/* Agriculture & Healthcare */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          What About Agriculture &amp; Healthcare?
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          At first, agricultural productivity appeared to matter. Districts
          with better crop yields tended to have lower malnutrition in simple
          comparisons. But when agriculture was studied{" "}
          <em>together with</em> sanitation, education, and healthcare, its
          effect became weaker. This suggests that simply producing more food
          may not be enough.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          A district can grow more crops, but children may still be
          malnourished if families lack dietary diversity, sanitation,
          healthcare, or knowledge about nutrition. So the real issue may not
          be just &ldquo;more food,&rdquo; but better access to nutritious
          food.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          We also looked at <strong>institutional delivery rates</strong> as a
          healthcare indicator. Surprisingly, this did not show a simple
          relationship with lower malnutrition. This does not mean healthcare
          is unimportant. Instead it suggests that the chosen healthcare
          indicator may not fully capture the kind of care that affects
          nutrition. Child nutrition depends on iron supplementation, growth
          monitoring, immunisation, counselling, treatment of infections, and
          follow-up care — institutional delivery alone may not tell us
          whether children are receiving these services after birth.
        </p>
      </section>

      {/* Four Types of Districts */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          Four Types of Districts
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          To better understand district-level patterns, we grouped districts
          into four broad categories:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          {districtTypes.map((d) => (
            <Card
              key={d.n}
              className="overflow-hidden border-l-4"
              style={{ borderLeftColor: d.color }}
            >
              <CardContent className="pt-5 pb-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span
                    className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
                    style={{ background: d.bg, color: d.color }}
                  >
                    {d.n}
                  </span>
                  <h3 className="text-sm font-semibold">{d.title}</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {d.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="text-base leading-7 text-foreground/90 mt-6">
          This grouping is useful because <strong>not every district needs the
          same solution</strong>. A district with low sanitation needs a
          different strategy from a district where anaemia is the main concern.
        </p>
      </section>

      {/* Policy Implications */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          What This Means for Policy
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          The main lesson is simple:{" "}
          <strong>child malnutrition cannot be solved by one program alone</strong>.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          While improving food supply is important, it&apos;s not enough.
          Expanding hospitals is important, but that alone is not enough
          either. The strongest results from this project point toward a more
          integrated approach.
        </p>
        <ul className="space-y-3 mt-4">
          {[
            {
              title: "Sanitation must remain a priority",
              body: "Toilets, clean surroundings, and safe waste disposal can protect children from infections that damage growth.",
            },
            {
              title: "Girls' and women's education is nutrition policy",
              body: "Every additional year of schooling for women translates into measurable gains in child health.",
            },
            {
              title: "Anaemia and micronutrients need focused attention",
              body: "Two-thirds of districts saw worsening anaemia between NFHS-4 and NFHS-5 — this needs targeted iron and dietary interventions.",
            },
            {
              title: "District-level planning is essential",
              body: "India is too diverse for one-size-fits-all solutions. Policies should identify what each district lacks most and respond accordingly.",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="flex gap-3 items-start rounded-lg border border-border p-4"
            >
              <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Conclusion */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">Conclusion</h2>
        <p className="text-base leading-7 text-foreground/90">
          A child&apos;s nutrition is like a house supported by many pillars.
          Food, sanitation, healthcare, women&apos;s education, and clean
          water are among those pillars. If one pillar is weak, the house
          becomes unstable. If many pillars are weak at the same time,
          children face a much higher risk of malnutrition.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          Our analysis shows that among these pillars,{" "}
          <strong>women&apos;s education and sanitation</strong> appear
          especially important at the district level.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          Child malnutrition in India is not just a food problem. It is also a
          sanitation problem, an education problem, a healthcare problem, and
          a local governance problem. The good news is that this also means
          there are many ways to act. Better toilets, safer water, stronger
          nutrition services, improved girls&apos; education, and
          district-specific planning can all make a difference.
        </p>
      </section>

      {/* Footer */}
      <Separator className="my-12" />
      <footer className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Based on district-level analysis of NFHS-4, NFHS-5, HMIS, JJM, and
          Agriculture Statistics
        </p>
        <p className="text-xs text-muted-foreground">
          DSM Spring 2026 · Ashoka University
        </p>
      </footer>
    </article>
  );
}
