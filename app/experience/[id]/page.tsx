import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import CompanyPrepButton from "@/components/CompanyPrepButton";

interface ExperiencePageProps {
  params: Promise<{ id: string }>;
}

export default async function ExperienceDetailPage({ params }: ExperiencePageProps) {
  const { id } = await params;
  const session = await auth();

  const experience = await prisma.experience.findUnique({
    where: { id },
    include: {
      company: true,
      role: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      rounds: {
        orderBy: {
          roundNumber: "asc",
        },
      },
      upvotes: true,
      bookmarks: true,
    },
  });

  if (!experience) {
    notFound();
  }

  const isUpvoted = session?.user?.id
    ? experience.upvotes.some((u) => u.userId === session.user?.id)
    : false;

  const isBookmarked = session?.user?.id
    ? experience.bookmarks.some((b) => b.userId === session.user?.id)
    : false;

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

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          ← Back to Dashboard
        </Link>

        {/* Hero Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${verdictStyles[experience.verdict] || "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
              >
                Verdict: {experience.verdict}
              </span>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${difficultyStyles[experience.difficulty] || "bg-slate-100 text-slate-700 border-slate-200"
                  }`}
              >
                Difficulty: {experience.difficulty}
              </span>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {experience.jobType}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {experience.title || `${experience.company.company} ${experience.role.title} Experience`}
            </h1>

            {/* Company & Role Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600 border-t border-b border-slate-100 py-4">
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">COMPANY</span>
                  <span className="font-semibold text-slate-900">{experience.company.company}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 block font-medium">ROLE</span>
                  <span className="font-semibold text-slate-900">{experience.role.title}</span>
                </div>
                {experience.role.ctc && (
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">CTC</span>
                    <span className="font-semibold text-slate-900">{experience.role.ctc}</span>
                  </div>
                )}
                {experience.role.locations.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">LOCATIONS</span>
                    <span className="font-semibold text-slate-900">
                      {experience.role.locations.join(", ")}
                    </span>
                  </div>
                )}
              </div>

              <CompanyPrepButton companyName={experience.company.company} variant="secondary" />
            </div>

            {/* Author Meta */}
            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase">
                  {experience.user.name ? experience.user.name[0] : "U"}
                </div>
                <div>
                  <span className="font-semibold text-slate-800 block">
                    {experience.user.name || "Anonymous Candidate"}
                  </span>
                  <span className="text-slate-400">
                    Shared on {new Date(experience.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-600">
                <span>👍 {experience.upvotes.length} Upvotes</span>
                <span>🔖 {experience.bookmarks.length} Bookmarks</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          {experience.description && (
            <div className="space-y-2 border-t border-slate-100 pt-6">
              <h2 className="text-md font-bold text-slate-900">Overall Experience & Tips</h2>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
                {experience.description}
              </p>
            </div>
          )}
        </div>

        {/* Interview Rounds Timeline Section */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900">
              Interview Rounds Timeline ({experience.rounds.length})
            </h2>
          </div>

          {experience.rounds.length === 0 ? (
            <p className="text-sm text-slate-500 italic py-4">No specific rounds recorded for this experience.</p>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-slate-200">
              {experience.rounds.map((round) => (
                <div key={round.id} className="relative pl-10 space-y-2">
                  {/* Timeline Badge Dot */}
                  <div className="absolute left-2 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow-sm" />

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="flex flex-wrap justify-between items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Round {round.roundNumber}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800">
                        {round.roundType}
                      </span>
                    </div>

                    {round.questions && (
                      <div>
                        <span className="text-xs font-semibold text-slate-500 block mb-1">
                          QUESTIONS ASKED
                        </span>
                        <p className="text-sm text-slate-800 whitespace-pre-line font-mono bg-white p-3 rounded-xl border border-slate-200/80">
                          {round.questions}
                        </p>
                      </div>
                    )}

                    {round.details && (
                      <div>
                        <span className="text-xs font-semibold text-slate-500 block mb-1">
                          ADDITIONAL DETAILS
                        </span>
                        <p className="text-xs text-slate-600 bg-white/60 p-2.5 rounded-lg border border-slate-200/60">
                          {round.details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
