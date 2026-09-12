import { createJob } from "./experience-actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import ExperienceAdd from "@/components/experience-add";

export default async function Page() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/sign-in");
    }

    return (
        <div className="min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-4 sm:p-8">
            <div className="w-full max-w-2xl bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-10 text-slate-900">
                <h1 className="text-2xl font-extrabold text-slate-900 text-center mb-1">
                    Share Interview Experience
                </h1>
                <p className="text-xs text-slate-500 text-center mb-8">
                    Help fellow students prepare by sharing your interview process and rounds.
                </p>

                <form action={createJob} className="flex flex-col gap-6">
                    {/* Basic Info Section */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-bold text-slate-900 border-b border-slate-200 pb-2">
                            Basic Job Information
                        </h2>

                        <div>
                            <label className="block text-xs font-semibold text-slate-600 mb-1">
                                Experience Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g. Google SDE-1 Interview Experience"
                                className="w-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    name="company"
                                    required
                                    placeholder="e.g. Google"
                                    className="w-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Role / Designation
                                </label>
                                <input
                                    type="text"
                                    name="role"
                                    required
                                    placeholder="e.g. Software Engineer"
                                    className="w-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    CTC Package (Optional)
                                </label>
                                <input
                                    type="text"
                                    name="ctc"
                                    placeholder="e.g. 25 LPA"
                                    className="w-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Location (comma separated)
                                </label>
                                <input
                                    type="text"
                                    name="locations"
                                    required
                                    placeholder="e.g. Bangalore, Gurgaon"
                                    className="w-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Component */}
                    <ExperienceAdd />

                    <button
                        type="submit"
                        className="mt-2 w-full bg-slate-900 hover:bg-black text-white font-semibold rounded-xl p-3.5 transition-colors text-sm shadow-sm"
                    >
                        Submit Experience
                    </button>
                </form>
            </div>
        </div>
    );
}