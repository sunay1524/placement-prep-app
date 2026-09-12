import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { auth } from "@/auth";
import { Suspense } from "react";
import SearchFilters from "@/components/SearchFilters";
import CompanyPrepButton from "@/components/CompanyPrepButton";

interface HomePageProps {
  searchParams: Promise<{
    query?: string;
    company?: string;
    verdict?: string;
    difficulty?: string;
    jobType?: string;
  }>;
}

const companyMeta: Record<string, { icon: string; badge: string }> = {
  Amazon: { icon: "📦", badge: "bg-orange-100 text-orange-800 border-orange-200" },
  Google: { icon: "🔍", badge: "bg-blue-100 text-blue-800 border-blue-200" },
  Microsoft: { icon: "💻", badge: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  Flipkart: { icon: "🛍️", badge: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  "Goldman Sachs": { icon: "🏦", badge: "bg-sky-100 text-sky-800 border-sky-200" },
  "D. E. Shaw": { icon: "📈", badge: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  "Morgan Stanley": { icon: "🏛️", badge: "bg-slate-100 text-slate-800 border-slate-200" },
  Uber: { icon: "🚗", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  Atlassian: { icon: "📘", badge: "bg-blue-100 text-blue-800 border-blue-200" },
  Mastercard: { icon: "💳", badge: "bg-rose-100 text-rose-800 border-rose-200" },
  Swiggy: { icon: "🛵", badge: "bg-orange-100 text-orange-800 border-orange-200" },
  Adobe: { icon: "🎨", badge: "bg-red-100 text-red-800 border-red-200" },
  Salesforce: { icon: "☁️", badge: "bg-sky-100 text-sky-800 border-sky-200" },
};

const verdictStyles: Record<string, string> = {
  Selected: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Offered: "bg-blue-50 text-blue-700 border-blue-200",
  Rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

const difficultyStyles: Record<string, string> = {
  Easy: "bg-green-50 text-green-700 border-green-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Hard: "bg-red-50 text-red-700 border-red-200",
};

export default async function Home({ searchParams }: HomePageProps) {
  const { query, company, verdict, difficulty, jobType } = await searchParams;
  const session = await auth();

  // Fetch all company names for dropdown & chip navigation
  const dbCompanies = await prisma.company.findMany({
    where: { experiences: { some: {} } },
    select: { company: true, _count: { select: { experiences: true } } },
    orderBy: { company: "asc" },
  });

  const allCompanyNames = dbCompanies.map((c) => c.company);
  const isFiltered = Boolean(query || company || verdict || difficulty || jobType);

  // Filtered mode query (when user searches or clicks a specific company/filter)
  const filteredExperiences = isFiltered
    ? await prisma.experience.findMany({
        where: {
          AND: [
            company ? { company: { company: { equals: company, mode: "insensitive" } } } : {},
            query
              ? {
                  OR: [
                    { title: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { company: { company: { contains: query, mode: "insensitive" } } },
                    { role: { title: { contains: query, mode: "insensitive" } } },
                  ],
                }
              : {},
            verdict ? { verdict: { equals: verdict } } : {},
            difficulty ? { difficulty: { equals: difficulty } } : {},
            jobType ? { jobType: { equals: jobType } } : {},
          ],
        },
        include: {
          company: true,
          role: true,
          user: {
            select: { id: true, name: true, image: true },
          },
          rounds: { select: { id: true } },
          upvotes: true,
          bookmarks: true,
        },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Grouped mode query (default view when no filters active)
  const groupedCompanies = !isFiltered
    ? await prisma.company.findMany({
        where: { experiences: { some: {} } },
        include: {
          experiences: {
            include: {
              company: true,
              role: true,
              user: { select: { id: true, name: true, image: true } },
              rounds: { select: { id: true } },
              upvotes: true,
              bookmarks: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { company: "asc" },
      })
    : [];

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Community Placement Hub
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              Real Placement &amp; Interview Experiences
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Explore authentic interview questions, round-by-round timelines, and preparation
              strategies sourced from LeetCode Discuss, Reddit, GeeksforGeeks &amp; the community.
            </p>
          </div>

          {session ? (
            <Link
              href="/experience"
              className="bg-slate-900 hover:bg-black text-white font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-sm shrink-0"
            >
              + Share Your Experience
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="bg-slate-900 hover:bg-black text-white font-semibold px-6 py-3.5 rounded-2xl text-sm transition-all shadow-sm shrink-0"
            >
              Sign in to Share
            </Link>
          )}
        </div>

        {/* Company Quick-Select Chips */}
        <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Browse Top Companies
            </h2>
            {company && (
              <Link
                href="/"
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                ← View All Sections
              </Link>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                !company
                  ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              🏢 All Companies ({dbCompanies.reduce((acc, c) => acc + c._count.experiences, 0)})
            </Link>
            {dbCompanies.map((c) => {
              const meta = companyMeta[c.company] || { icon: "🏢", badge: "bg-slate-100 text-slate-800" };
              const isSelected = company?.toLowerCase() === c.company.toLowerCase();
              return (
                <Link
                  key={c.company}
                  href={`/?company=${encodeURIComponent(c.company)}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{c.company}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? "bg-slate-700 text-white" : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {c._count.experiences}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search + Filters */}
        <Suspense fallback={null}>
          <SearchFilters companies={allCompanyNames} />
        </Suspense>

        {/* ==================================================================== */}
        {/* MODE 1: FILTERED RESULTS (Specific company OR active search/filters)  */}
        {/* ==================================================================== */}
        {isFiltered ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {company && (
                    <span className="text-2xl">
                      {companyMeta[company]?.icon ?? "🏢"}
                    </span>
                  )}
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {company ? `${company} Experiences` : "Filtered Results"}
                  </h2>
                </div>
                <p className="text-xs text-slate-500">
                  Showing {filteredExperiences.length} interview{" "}
                  {filteredExperiences.length === 1 ? "story" : "stories"}
                  {company ? ` for ${company}` : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {company && (
                  <CompanyPrepButton companyName={company} variant="primary" />
                )}
                <Link
                  href="/"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  ← Back to All Company Sections
                </Link>
              </div>
            </div>

            {filteredExperiences.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
                <span className="text-4xl block">📭</span>
                <h3 className="text-lg font-bold text-slate-900">No experiences found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Try adjusting your filters or search term, or share the first experience for this company!
                </p>
                <Link
                  href="/"
                  className="inline-block bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-black transition-colors"
                >
                  Clear All Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExperiences.map((exp) => (
                  <ExperienceCard key={exp.id} exp={exp} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ==================================================================== */
          /* MODE 2: COMPANY-WISE SECTIONS FEED (Default view)                    */
          /* ==================================================================== */
          <div className="space-y-10">
            {groupedCompanies.map((compGroup) => {
              const meta = companyMeta[compGroup.company] || { icon: "🏢", badge: "bg-slate-100 text-slate-800 border-slate-200" };
              const previewExps = compGroup.experiences.slice(0, 3);
              const totalCount = compGroup.experiences.length;

              return (
                <section
                  key={compGroup.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
                >
                  {/* Company Section Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl shadow-xs">
                        {meta.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                            {compGroup.company}
                          </h2>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${meta.badge}`}
                          >
                            {totalCount} {totalCount === 1 ? "Experience" : "Experiences"}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Authentic placement process and interview questions for {compGroup.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      <CompanyPrepButton companyName={compGroup.company} variant="secondary" />
                      <Link
                        href={`/?company=${encodeURIComponent(compGroup.company)}`}
                        className="group bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold px-5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                      >
                        <span>See All Results</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                      </Link>
                    </div>
                  </div>

                  {/* Preview Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {previewExps.map((exp) => (
                      <ExperienceCard key={exp.id} exp={exp} />
                    ))}
                  </div>

                  {/* Show View All Footer if more than 3 */}
                  {totalCount > 3 && (
                    <div className="pt-2 text-center">
                      <Link
                        href={`/?company=${encodeURIComponent(compGroup.company)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-4 py-2 rounded-xl transition-all"
                      >
                        View remaining {totalCount - 3} experiences for {compGroup.company} →
                      </Link>
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

{/* Reusable Experience Card Component */}
function ExperienceCard({ exp }: { exp: any }) {
  return (
    <Link
      href={`/experience/${exp.id}`}
      className="group bg-white border border-slate-200 hover:border-slate-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5"
    >
      <div className="space-y-4">
        {/* Top Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            {exp.company.company}
          </span>
          <div className="flex gap-1.5">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                verdictStyles[exp.verdict] ?? "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {exp.verdict}
            </span>
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                difficultyStyles[exp.difficulty] ?? "bg-slate-100 text-slate-700 border-slate-200"
              }`}
            >
              {exp.difficulty}
            </span>
          </div>
        </div>

        {/* Title & Role */}
        <div>
          <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
            {exp.title ?? `${exp.company.company} ${exp.role.title} Experience`}
          </h3>
          <p className="text-xs font-medium text-slate-500 mt-1">
            {exp.role.title}
            {exp.role.ctc ? ` • ${exp.role.ctc}` : ""}
          </p>
        </div>

        {/* Meta chips */}
        <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600">
          <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            📍 {exp.role.locations.join(", ") || "N/A"}
          </span>
          <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            🔁 {exp.rounds.length} Round{exp.rounds.length !== 1 ? "s" : ""}
          </span>
          <span className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
            💼 {exp.jobType}
          </span>
        </div>
      </div>

      {/* Footer / Engagement */}
      <div className="border-t border-slate-100 pt-4 flex justify-between items-center text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] uppercase">
            {exp.user.name ? exp.user.name[0] : "U"}
          </div>
          <span className="font-medium text-slate-700 truncate max-w-[120px]">
            {exp.user.name ?? "Anonymous"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <span>👍 {exp.upvotes.length}</span>
          <span>🔖 {exp.bookmarks.length}</span>
        </div>
      </div>
    </Link>
  );
}