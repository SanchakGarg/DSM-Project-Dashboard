import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const indicators = [
  { label: "Stunting",      value: 33.5, color: "#ef4444" },
  { label: "Wasting",       value: 18.6, color: "#f97316" },
  { label: "Underweight",   value: 29.6, color: "#f59e0b" },
  { label: "Child anaemia", value: 66.0, color: "#dc2626" },
];

const districtTypes = [
  {
    n: 1,
    title: "Low-burden districts",
    color: "#22c55e",
    bg: "#dcfce7",
    description:
      "These districts had lower malnutrition, better sanitation, higher women's education, and stronger water access.",
  },
  {
    n: 2,
    title: "Northeast outlier districts",
    color: "#3b82f6",
    bg: "#dbeafe",
    description:
      "These districts had relatively low malnutrition despite weaker formal healthcare indicators. This may be linked to local diets, culture, or community practices.",
  },
  {
    n: 3,
    title: "High-burden districts",
    color: "#f59e0b",
    bg: "#fef3c7",
    description:
      "These districts had moderate disadvantages and lower water coverage. They formed the largest group.",
  },
  {
    n: 4,
    title: "Very high-burden districts",
    color: "#ef4444",
    bg: "#fee2e2",
    description:
      "These districts faced multiple problems at the same time: high malnutrition, low sanitation, and low women's education. These are the districts that may need the most urgent attention.",
  },
];

const policyPoints = [
  "Sanitation must remain a priority. Toilets, clean surroundings, and safe waste disposal can protect children from infections that damage growth.",
  "Girls' and women's education should be seen as a nutrition policy too.",
  "Nutrition programs need to focus more strongly on anaemia and micronutrients.",
  "District-level planning is essential. India is too diverse for one size fits all solutions. Policies should identify what each district lacks most and respond accordingly.",
];

export default function BlogPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Header */}
      <header className="space-y-4 mb-10">
        <span className="text-xs text-muted-foreground">DSM Spring 2026</span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Why Are So Many Children in India Still Malnourished?
        </h1>
      </header>

      <Separator className="mb-10" />

      {/* Intro */}
      <section className="space-y-5">
        <p className="text-base leading-7 text-foreground/90">
          I want you to imagine two children growing up in two different
          districts of India.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          While both of them may live in a country that is building highways,
          expanding digital services, launching satellites and even becoming
          one of the world&apos;s fastest-growing economies. But their everyday
          lives may look completely different. One child may have access to
          clean drinking water, a toilet at home, good schooling and health
          services. However, the other one may grow up in a place with unsafe
          water, poor sanitation, limited food, and weak healthcare.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          This difference can shape something as basic as whether a child grows
          properly.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          But much difference are we talking about? This is what we set out to
          find through our final project of teh Data Science and Management
          course. Despite major economic progress, many children are still
          stunted, underweight, wasted, or anaemic. This contradiction is often
          called the &ldquo;South Asian Enigma.&rdquo; Instead of just asking
          which states are doing better or worse, we asked a more nuanced
          question: what explains why one district has much higher child
          malnutrition than another?
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
          We also included women&apos;s education as an important background
          factor because educated mothers are often better able to access
          health services, understand nutrition, and make informed household
          decisions.
        </p>
      </section>

      {/* What the Data Showed */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          What the Data Showed
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          The numbers show that child malnutrition is still a major problem in
          many Indian districts.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          Across districts, the average levels were:
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
                  <th className="px-5 py-3 w-2/5" />

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
                      {row.value % 1 === 0
                        ? `${row.value.toFixed(0)}%`
                        : `${row.value.toFixed(1)}%`}
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
        <p className="text-base leading-7 text-foreground/90">
          One especially worrying result was child anaemia. While stunting,
          wasting, and underweight improved slightly between NFHS-4 and NFHS-5,
          anaemia became worse on average. Only about one-third of districts
          showed improvement in anaemia. This suggests that micronutrient
          deficiencies still remain a serious challenge.
        </p>
      </section>

      {/* Malnutrition Is Not Spread Evenly */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          Malnutrition Is Not Spread Evenly
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          One of the strongest takeaways from our project is that malnutrition
          is not evenly distributed across India.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          Some districts have much higher burdens than others. The report found
          that high-burden districts were concentrated in states such as
          Jharkhand, Gujarat, Bihar, Maharashtra, and Uttar Pradesh. Districts
          such as West Singhbhum in Jharkhand, Panch Mahals and Dohad in
          Gujarat, and Nandurbar in Maharashtra appeared among the
          highest-burden areas.
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

      {/* Education and Sanitation Matter Most */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          Education and Sanitation Matter Most
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          The project compared several possible explanations for malnutrition.
          The clearest finding was that women&apos;s education and sanitation
          were the strongest predictors of lower malnutrition.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          Districts where more women had 10 or more years of schooling
          generally had lower child malnutrition. This makes sense. Our
          hypothesis is that education can improve health awareness, nutrition
          knowledge, hygiene practices, and the ability to use government
          services.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          One more thing we noticed is that districts with better sanitation
          coverage tended to have lower malnutrition. This is important because
          malnutrition is not only about how much food a child eats. If a child
          is repeatedly exposed to infections because of poor sanitation, their
          body may not absorb nutrients properly.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          In other words, a child&apos;s growth depends not only on food, but
          also on the environment around them.
        </p>
      </section>

      {/* What About Agriculture & Healthcare? */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          What About Agriculture &amp; Healthcare?
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          At first, agricultural productivity appeared to matter. Districts
          with better crop yields tended to have lower malnutrition in simple
          comparisons. But when agriculture was studied together with
          sanitation, education, and healthcare, its effect became weaker. This
          suggests that simply producing more food may not be enough.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          A district can grow more crops, but children may still be
          malnourished if families lack dietary diversity, sanitation,
          healthcare, or knowledge about nutrition. So the real issue may not
          be just &ldquo;more food,&rdquo; but better access to nutritious
          food.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          We also looked at institutional delivery rates as a healthcare
          indicator. Surprisingly, this did not show a simple relationship with
          lower malnutrition. This does not mean healthcare is unimportant.
          Instead it suggests that the chosen healthcare indicator may not
          fully capture the kind of care that affects nutrition.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          For example, child nutrition depends on things like iron
          supplementation, growth monitoring, immunisation, counselling,
          treatment of infections, and follow-up care. Institutional delivery
          alone may not tell us whether children are receiving these services
          after birth.
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
          This grouping is useful because not every district needs the same
          solution. A district with low sanitation needs a different strategy
          from a district where anaemia is the main concern.
        </p>
      </section>

      {/* What This Means for Policy */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">
          What This Means for Policy
        </h2>
        <p className="text-base leading-7 text-foreground/90">
          The main lesson is simple: child malnutrition cannot be solved by one
          program alone.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          While improving food supply is important, it&apos;s not enough.
          Expanding hospitals is important, but that alone is not enough
          either. The strongest results from this project point toward a more
          integrated approach.
        </p>
        <ul className="space-y-3 mt-4">
          {policyPoints.map((point, i) => (
            <li
              key={i}
              className="flex gap-3 items-start rounded-lg border border-border p-4"
            >
              <span className="mt-2 inline-block w-1.5 h-1.5 rounded-full bg-foreground shrink-0" />
              <p className="text-sm text-foreground/90 leading-relaxed">
                {point}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Conclusion */}
      <section className="mt-12 space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">Conclusion</h2>
        <p className="text-base leading-7 text-foreground/90">
          A child&apos;s nutrition is like a house supported by many pillars.
          Food, sanitation, healthcare, women&apos;s education and clear water
          are among those pillars.
        </p>
        <p className="text-base leading-7 text-foreground/90">
          If one pillar is weak, the house becomes unstable. If many pillars
          are weak at the same time, children face a much higher risk of
          malnutrition. Our analysis shows that among these pillars,
          women&apos;s education and sanitation appear especially important at
          the district level.
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

      <Separator className="my-12" />
    </article>
  );
}
