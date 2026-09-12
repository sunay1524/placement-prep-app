"use client";

import { useState } from "react";

export default function ExperienceAdd() {
    const [num, setNum] = useState(1);

    return (
        <div className="flex flex-col gap-5 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">Experience Details & Verdict</h2>

            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Overall Summary / Description
                </label>
                <textarea
                    name="description"
                    required
                    placeholder="Share preparation advice, key takeaways, or overall interview vibe..."
                    rows={3}
                    className="w-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl p-3 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Verdict</label>
                    <select
                        name="verdict"
                        required
                        className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                    >
                        <option value="Selected">Selected ✅</option>
                        <option value="Rejected">Rejected ❌</option>
                        <option value="Offered">Offered 🎓</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Difficulty</label>
                    <select
                        name="difficulty"
                        required
                        className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                    >
                        <option value="Easy">Easy 🟢</option>
                        <option value="Medium">Medium 🟡</option>
                        <option value="Hard">Hard 🔴</option>
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Job Type</label>
                    <select
                        name="jobType"
                        required
                        className="w-full border border-slate-300 bg-white text-slate-900 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                    >
                        <option value="Full-time">Full-time</option>
                        <option value="Internship">Internship</option>
                    </select>
                </div>
            </div>

            {/* Dynamic Interview Rounds */}
            <div className="flex flex-col gap-4 border-t border-slate-200 pt-5">
                <div className="flex justify-between items-center">
                    <h3 className="text-md font-bold text-slate-800">
                        Interview Rounds ({num})
                    </h3>
                </div>

                {Array.from({ length: num }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-3 p-4 border border-slate-200 rounded-2xl bg-slate-50/70">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                            Round {i + 1}
                        </span>
                        <input
                            name="roundType"
                            placeholder="Round Type (e.g. OA, Technical Round 1, HR)"
                            required
                            className="w-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                        />
                        <textarea
                            name="questions"
                            placeholder="Questions asked during this round..."
                            required
                            rows={2}
                            className="w-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                        />
                        <textarea
                            name="details"
                            placeholder="Additional details (Optional, e.g. Duration, Platform)"
                            rows={1}
                            className="w-full border border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-slate-900 text-sm"
                        />
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => setNum(num + 1)}
                    className="w-full border border-dashed border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl font-medium text-sm transition-colors"
                >
                    + Add Another Round
                </button>
            </div>
        </div>
    );
}