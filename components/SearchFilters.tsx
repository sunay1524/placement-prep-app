"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";

interface SearchFiltersProps {
  companies?: string[];
}

export default function SearchFilters({ companies = [] }: SearchFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const query = searchParams.get("query") ?? "";
  const company = searchParams.get("company") ?? "";
  const verdict = searchParams.get("verdict") ?? "";
  const difficulty = searchParams.get("difficulty") ?? "";
  const jobType = searchParams.get("jobType") ?? "";

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams]
  );

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = query || company || verdict || difficulty || jobType;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
          🔍
        </span>
        <input
          type="text"
          placeholder="Search by company, role, or keyword…"
          defaultValue={query}
          onChange={(e) => updateParams("query", e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all"
        />
        {isPending && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs animate-pulse">
            Searching…
          </span>
        )}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Company Dropdown (if companies list provided) */}
        {companies.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
              Company
            </label>
            <select
              value={company}
              onChange={(e) => updateParams("company", e.target.value)}
              className="text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all cursor-pointer max-w-[160px] truncate"
            >
              <option value="">All Companies</option>
              {companies.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Verdict */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
            Verdict
          </label>
          <select
            value={verdict}
            onChange={(e) => updateParams("verdict", e.target.value)}
            className="text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all cursor-pointer"
          >
            <option value="">All</option>
            <option value="Selected">✅ Selected</option>
            <option value="Rejected">❌ Rejected</option>
            <option value="Offered">💼 Offered</option>
          </select>
        </div>

        {/* Difficulty */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => updateParams("difficulty", e.target.value)}
            className="text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all cursor-pointer"
          >
            <option value="">All</option>
            <option value="Easy">🟢 Easy</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Hard">🔴 Hard</option>
          </select>
        </div>

        {/* Job Type */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">
            Type
          </label>
          <select
            value={jobType}
            onChange={(e) => updateParams("jobType", e.target.value)}
            className="text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all cursor-pointer"
          >
            <option value="">All</option>
            <option value="Internship">🎓 Internship</option>
            <option value="Full-time">💼 Full-time</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="ml-auto text-xs font-semibold text-rose-600 hover:text-rose-800 border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-all"
          >
            ✕ Clear filters
          </button>
        )}
      </div>

      {/* Active filter pills */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 pt-1">
          {query && (
            <span className="inline-flex items-center gap-1 text-xs bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-1 rounded-full">
              🔍 &ldquo;{query}&rdquo;
              <button onClick={() => updateParams("query", "")} className="hover:text-slate-900 ml-0.5">✕</button>
            </span>
          )}
          {company && (
            <span className="inline-flex items-center gap-1 text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-full font-semibold">
              🏢 {company}
              <button onClick={() => updateParams("company", "")} className="hover:text-purple-900 ml-0.5">✕</button>
            </span>
          )}
          {verdict && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full">
              Verdict: {verdict}
              <button onClick={() => updateParams("verdict", "")} className="hover:text-emerald-900 ml-0.5">✕</button>
            </span>
          )}
          {difficulty && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
              Difficulty: {difficulty}
              <button onClick={() => updateParams("difficulty", "")} className="hover:text-amber-900 ml-0.5">✕</button>
            </span>
          )}
          {jobType && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full">
              {jobType}
              <button onClick={() => updateParams("jobType", "")} className="hover:text-blue-900 ml-0.5">✕</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

