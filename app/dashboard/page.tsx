import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteExperienceButton from "@/components/DeleteExperienceButton";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/sign-in");
  }

  // Look up DB user via id or email
  let dbUser = null;
  if (session.user.id) {
    dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  } else if (session.user.email) {
    dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
  }

  if (!dbUser) {
    redirect("/sign-in");
  }

  const userId = dbUser.id;

  // 1. Fetch user's submitted experiences
  const myExperiences = await prisma.experience.findMany({
    where: { userId },
    include: {
      company: true,
      role: true,
      upvotes: true,
      bookmarks: true,
      rounds: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Fetch user's bookmarked experiences
  const myBookmarks = await prisma.bookMark.findMany({
    where: { userId },
    include: {
      experience: {
        include: {
          company: true,
          role: true,
          user: { select: { name: true } },
          upvotes: true,
          bookmarks: true,
          rounds: { select: { id: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // 3. Calculate total upvotes received on user's posts
  const totalUpvotesEarned = myExperiences.reduce(
    (sum, exp) => sum + exp.upvotes.length,
    0
  );

  const verdictStyles: Record<string, string> = {
    Selected: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Offered: "bg-blue-50 text-blue-700 border-blue-200",
    Rejected: "bg-rose-50 text-rose-700 border-rose-200",
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* User Header */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl uppercase shadow-sm">
              {dbUser.name ? dbUser.name[0] : dbUser.email[0]}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Welcome back, {dbUser.name || "Student"}! 👋
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {dbUser.email} • Track your interview submissions and saved resources.
              </p>
            </div>
          </div>

          <Link
            href="/experience"
            className="bg-slate-900 hover:bg-black text-white text-xs font-semibold px-5 py-3 rounded-2xl transition-all shadow-sm shrink-0"
          >
            + Share Experience
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl font-bold">
              📝
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 block">
                {myExperiences.length}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Experiences Shared
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl font-bold">
              🔖
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 block">
                {myBookmarks.length}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Saved Bookmarks
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-bold">
              👍
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-900 block">
                {totalUpvotesEarned}
              </span>
              <span className="text-xs font-medium text-slate-500">
                Upvotes Earned
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: My Submissions */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900 px-1">
            My Shared Experiences ({myExperiences.length})
          </h2>

          {myExperiences.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
              <span className="text-3xl block">🚀</span>
              <h3 className="font-bold text-slate-900">You haven't shared any experiences yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Sharing your interview process helps fellow candidates prepare effectively!
              </p>
              <Link
                href="/experience"
                className="inline-block bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-black transition-colors"
              >
                Share Experience
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myExperiences.map((exp) => (
                <Link
                  key={exp.id}
                  href={`/experience/${exp.id}`}
                  className="group bg-white border border-slate-200 hover:border-slate-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {exp.company.company}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          verdictStyles[exp.verdict] || "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {exp.verdict}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                      {exp.title || `${exp.company.company} ${exp.role.title}`}
                    </h3>

                    <p className="text-xs text-slate-500">
                      {exp.role.title} • {exp.rounds.length} Rounds
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs text-slate-500">
                    <span>{new Date(exp.createdAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-3 font-medium">
                      <span>👍 {exp.upvotes.length}</span>
                      <span>🔖 {exp.bookmarks.length}</span>
                      <DeleteExperienceButton experienceId={exp.id} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Bookmarked Experiences */}
        {myBookmarks.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-slate-900 px-1">
              Bookmarked for Revision ({myBookmarks.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myBookmarks.map(({ experience: exp }) => (
                <Link
                  key={exp.id}
                  href={`/experience/${exp.id}`}
                  className="group bg-white border border-slate-200 hover:border-slate-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {exp.company.company}
                      </span>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                          verdictStyles[exp.verdict] || "bg-slate-100 text-slate-700 border-slate-200"
                        }`}
                      >
                        {exp.verdict}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-2">
                      {exp.title || `${exp.company.company} ${exp.role.title}`}
                    </h3>

                    <p className="text-xs text-slate-500">
                      By {exp.user.name || "Candidate"} • {exp.rounds.length} Rounds
                    </p>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-xs text-slate-500">
                    <span>Saved Post</span>
                    <span>👍 {exp.upvotes.length}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}