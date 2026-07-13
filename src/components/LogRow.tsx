import type { LogEntry } from "../types";

interface LogRowProps {
  entry: LogEntry;
}

const statusStyles: Record<LogEntry["status"], { label: string; bg: string; fg: string }> = {
  done: { label: "Completed", bg: "var(--teal-soft)", fg: "var(--teal-ink)" },
  skipped: { label: "Skipped", bg: "var(--danger-soft)", fg: "var(--danger)" },
};

export default function LogRow({ entry }: LogRowProps) {
  const s = statusStyles[entry.status];
  return (
    <li className="flex items-center justify-between gap-3 py-3 border-b border-[var(--line)] last:border-b-0">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-[var(--ink)]">{entry.label}</span>
        <span className="text-xs text-[var(--ink-soft)]">
          {entry.time} · {entry.minutes} min
        </span>
      </div>
      <span
        className="text-xs font-medium rounded-full px-2.5 py-1"
        style={{ background: s.bg, color: s.fg }}
      >
        {s.label}
      </span>
    </li>
  );
}
