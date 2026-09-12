import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { logout } from "@/lib/auth-actions";

export default async function Navbar() {
  const session = await auth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="PlacePrep Logo"
            width={120}
            height={20}
            className="object-contain"
          />
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Feed
          </Link>
          <Link
            href="/experience"
            className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            Share Experience
          </Link>

          {!session || !session.user ? (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="bg-slate-900 hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-xs font-semibold text-red-600 hover:text-red-800 transition-colors"
                >
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
