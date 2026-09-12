"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const GATE_DELAY_MS = 90_000; // 1 min 30 s

export default function AuthGateTimer({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't set a timer for logged-in users
    if (isLoggedIn) return;

    const id = setTimeout(() => setShow(true), GATE_DELAY_MS);
    return () => clearTimeout(id);
  }, [isLoggedIn]);

  const dismiss = useCallback(() => setShow(false), []);

  if (!show) return null;

  return (
    /* Full-screen backdrop */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backdropFilter: "blur(10px)", backgroundColor: "rgba(15, 23, 42, 0.55)" }}
    >
      {/* Modal card */}
      <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md mx-4 p-8 flex flex-col items-center text-center space-y-6 animate-[fadeSlideUp_0.3s_ease_both]">

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-3xl shadow-lg">
          🔒
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Join the community
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
            Create a free account to read full interview experiences, save bookmarks, and share your own placement story.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col gap-3 w-full">
          <Link
            href="/sign-up"
            className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3 rounded-2xl text-sm transition-all shadow-sm"
          >
            Create free account
          </Link>
          <Link
            href="/sign-in"
            className="w-full bg-slate-50 hover:bg-slate-100 text-slate-800 font-semibold py-3 rounded-2xl text-sm border border-slate-200 transition-all"
          >
            Sign in
          </Link>
        </div>

        {/* Dismiss link */}
        <button
          onClick={dismiss}
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2"
        >
          Continue browsing for now
        </button>
      </div>

      {/* Keyframe animation injected inline (avoids needing tailwind config changes) */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
