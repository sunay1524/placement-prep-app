import Link from "next/link";

interface CompanyPrepButtonProps {
  companyName: string;
  variant?: "primary" | "secondary" | "chip";
  className?: string;
}

export default function CompanyPrepButton({
  companyName,
  variant = "primary",
  className = "",
}: CompanyPrepButtonProps) {
  const href = `/company/${encodeURIComponent(companyName)}/prep`;

  if (variant === "chip") {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border bg-slate-900 text-white border-slate-900 hover:bg-black transition-all ${className}`}
      >
        <span>📖</span>
        <span>Prep Guide</span>
      </Link>
    );
  }

  if (variant === "secondary") {
    return (
      <Link
        href={href}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-xl border bg-slate-900 text-white border-slate-900 hover:bg-black transition-all shadow-2xs ${className}`}
      >
        <span>🎯</span>
        <span>Prep Guide</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white shadow-xs hover:shadow-sm transition-all ${className}`}
    >
      <span>🎯</span>
      <span>Interview Prep Guide</span>
      <span>→</span>
    </Link>
  );
}
