import { getCompanyPrepGuide } from "@/lib/ai-prep";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ name: string }>;
}

const companyMeta: Record<string, { icon: string; bg: string }> = {
  Amazon: { icon: "📦", bg: "from-orange-500/10 to-amber-500/5" },
  Google: { icon: "🔍", bg: "from-blue-500/10 to-indigo-500/5" },
  Microsoft: { icon: "💻", bg: "from-cyan-500/10 to-blue-500/5" },
  Flipkart: { icon: "🛍️", bg: "from-yellow-500/10 to-amber-500/5" },
  "Goldman Sachs": { icon: "🏦", bg: "from-sky-500/10 to-blue-500/5" },
  "D. E. Shaw": { icon: "📈", bg: "from-indigo-500/10 to-purple-500/5" },
  "Morgan Stanley": { icon: "🏛️", bg: "from-slate-500/10 to-slate-700/5" },
  Uber: { icon: "🚗", bg: "from-emerald-500/10 to-teal-500/5" },
  Atlassian: { icon: "📘", bg: "from-blue-500/10 to-sky-500/5" },
  Mastercard: { icon: "💳", bg: "from-rose-500/10 to-red-500/5" },
  Swiggy: { icon: "🛵", bg: "from-orange-500/10 to-red-500/5" },
  Adobe: { icon: "🎨", bg: "from-red-500/10 to-rose-500/5" },
  Salesforce: { icon: "☁️", bg: "from-sky-500/10 to-cyan-500/5" },
};

export default async function CompanyPrepPage({ params }: PageProps) {
  const { name } = await params;
  const decodedName = decodeURIComponent(name);

  const prepGuide = await getCompanyPrepGuide(decodedName);

  if (!prepGuide) {
    notFound();
  }

  const meta = companyMeta[prepGuide.companyName] || {
    icon: "🏢",
    bg: "from-slate-500/10 to-slate-700/5",
  };

  const totalExps = prepGuide.totalExperiencesAnalyzed;
  const stats = prepGuide.stats;

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/?company=${encodeURIComponent(prepGuide.companyName)}`}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-all shadow-2xs"
          >
            ← Back to {prepGuide.companyName} Experiences
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Community Verified Guide</span>
          </div>
        </div>

        {/* Hero Section - Clean Light Theme matching the rest of the app */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-3xl shrink-0 shadow-2xs">
                {meta.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {prepGuide.companyName}
                  </h1>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold px-3 py-0.5 rounded-full">
                    Placement Guide
                  </span>
                </div>
                <p className="text-slate-600 text-xs sm:text-sm max-w-xl leading-relaxed">
                  Preparation roadmap and topic breakdown synthesized from {totalExps} authentic candidate interview experiences.
                </p>
              </div>
            </div>

            {/* Quick Metrics Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-6 shrink-0 w-full md:w-auto justify-around">
              <div className="text-center">
                <span className="text-2xl font-black text-emerald-600 block">
                  {stats.selectedPercentage}%
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Select Rate
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <span className="text-2xl font-black text-slate-900 block">{totalExps}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Submissions
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="text-center">
                <span className="text-2xl font-black text-amber-600 block">
                  {stats.mediumCount + stats.hardCount}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Med/Hard Rounds
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">SELECTED CANDIDATES</span>
              <span className="font-bold text-emerald-700 mt-0.5 block">{stats.selectedCount} Selected</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">OFFERED CANDIDATES</span>
              <span className="font-bold text-blue-700 mt-0.5 block">{stats.offeredCount} Offered</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">REJECTED CANDIDATES</span>
              <span className="font-bold text-rose-700 mt-0.5 block">{stats.rejectedCount} Rejected</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block text-[11px]">DIFFICULTY RATIO</span>
              <span className="font-bold text-slate-800 mt-0.5 block">
                {stats.easyCount} Easy • {stats.mediumCount} Med • {stats.hardCount} Hard
              </span>
            </div>
          </div>
        </div>

        {/* Overview Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Process Summary & Insights</h2>
          <p className="text-slate-700 text-sm leading-relaxed bg-slate-50/80 p-5 rounded-2xl border border-slate-100">
            {prepGuide.overview}
          </p>
        </div>

        {/* High-Yield Technical Topics */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Topic Frequency & Focus Areas</h2>
              <p className="text-xs text-slate-500 mt-0.5">Based on questions reported in technical rounds</p>
            </div>
          </div>

          <div className="space-y-4">
            {prepGuide.keyTopics.map((item, idx) => (
              <div key={idx} className="bg-slate-50/80 border border-slate-200/80 p-4.5 rounded-2xl space-y-2.5">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>{item.topic}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700">
                    {item.weightPercent}% Focus Weight
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(10, item.weightPercent))}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Round-by-Round Breakdown */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Interview Process Timeline</h2>
            <p className="text-xs text-slate-500 mt-0.5">Expected format and key tips for each round</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prepGuide.roundBreakdown.map((round, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">{round.roundName}</h3>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      EXPECTED EVALUATION
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">{round.expectedFocus}</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-900 block mb-0.5">
                    Tip from candidates:
                  </span>
                  <p className="text-xs text-slate-600">{round.preparationTip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Tested Problem Patterns */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Common Problem Patterns</h2>
            <p className="text-xs text-slate-500 mt-0.5">Algorithmic concepts & design patterns tested by {prepGuide.companyName}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prepGuide.frequentlyAskedPatterns.map((pat, idx) => (
              <div
                key={idx}
                className="bg-slate-50/70 border border-slate-200 rounded-2xl p-5 space-y-3"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{pat.patternName}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      pat.difficulty === "Hard"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : pat.difficulty === "Easy"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {pat.difficulty}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
                  {pat.sampleQuestionOrConcept}
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    APPROACH & STRATEGY
                  </span>
                  <p className="text-xs text-slate-600">{pat.approachHint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 14-Day Preparation Roadmap */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recommended Preparation Timeline</h2>
            <p className="text-xs text-slate-500 mt-0.5">14-day study sprint structured for {prepGuide.companyName}</p>
          </div>

          <div className="space-y-4">
            {prepGuide.studyPlan14Days.map((phase, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-2xs"
              >
                <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-3">
                  <span className="bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-lg">
                    {phase.dayRange}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{phase.focusTitle}</h3>
                </div>

                <ul className="space-y-2 pt-1">
                  {phase.tasks.map((task, tidx) => (
                    <li key={tidx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <span className="text-slate-900 font-bold mt-0.5">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Best Practices */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Key Recommendations
            </h3>
            <ul className="space-y-2.5">
              {prepGuide.doAndDonts.dos.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Common Pitfalls to Avoid
            </h3>
            <ul className="space-y-2.5">
              {prepGuide.doAndDonts.donts.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
