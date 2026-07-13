import type { Duration } from "../types";

interface DurationPickerProps {
  durations: Duration[];
  activeIdx: number;
  disabled: boolean;
  onChange: (idx: number) => void;
}

export default function DurationPicker({
  durations,
  activeIdx,
  disabled,
  onChange,
}: DurationPickerProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-7 sm:mt-8 mb-6" role="group" aria-label="Sprint duration">
      {durations.map((d, idx) => {
        const active = idx === activeIdx;
        return (
          <button
            key={d.label}
            type="button"
            disabled={disabled}
            onClick={() => onChange(idx)}
            aria-pressed={active}
            className={[
              "text-xs font-medium rounded-full px-3.5 py-1.5 border transition-colors duration-150",
              "disabled:cursor-not-allowed disabled:opacity-40",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-none",
              "outline-[var(--teal)]",
              active
                ? "bg-[var(--amber-soft)] text-[var(--amber-ink)] border-[var(--amber)]"
                : "bg-transparent text-[var(--ink-soft)] border-[var(--line)] hover:enabled:bg-[var(--surface-2)]",
            ].join(" ")}
          >
            {d.label} · {d.minutes}m
          </button>
        );
      })}
    </div>
  );
}
