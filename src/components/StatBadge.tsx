import type { StatTone } from "../types";

interface StatBadgeProps {
  label: string;
  value: string;
  tone?: StatTone;
}

// "-ink" variants are the AA-safe text color for their matching "-soft" background.
const toneMap: Record<StatTone, { bg: string; fg: string }> = {
  ink: { bg: "var(--surface-2)", fg: "var(--ink)" },
  teal: { bg: "var(--teal-soft)", fg: "var(--teal-ink)" },
  amber: { bg: "var(--amber-soft)", fg: "var(--amber-ink)" },
};

export default function StatBadge({ label, value, tone = "ink" }: StatBadgeProps) {
  const t = toneMap[tone];
  return (
    <div
      className="flex flex-col gap-0.5 rounded-xl px-4 py-3 min-w-[7.5rem]"
      style={{ background: t.bg }}
    >
      <span
        className="text-[0.7rem] uppercase tracking-wider text-[var(--ink-soft)]"
      >
        {label}
      </span>
      <span
        className="text-xl font-semibold font-mono"
        style={{ color: t.fg }}
      >
        {value}
      </span>
    </div>
  );
}
