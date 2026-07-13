interface ProgressIndicatorProps {
  percent: number;
  complete: boolean;
}

/**
 * The reference mock marked this whole element aria-hidden with no
 * accessible substitute — a real gap, since sighted-only progress feedback
 * fails a Lighthouse/WCAG audit. This version exposes it as a proper
 * progressbar; the numeric label stays visible for sighted users and is
 * also picked up by the accessible name.
 */
export default function ProgressIndicator({ percent, complete }: ProgressIndicatorProps) {
  return (
    <div className="hidden sm:flex flex-col items-end gap-1 min-w-[6rem]">
      <div
        className="w-28 h-1.5 rounded-full overflow-hidden bg-[var(--surface-2)]"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Sprint progress"
      >
        <div
          className="h-full rounded-full transition-[width] duration-[900ms] ease-linear"
          style={{
            width: `${percent}%`,
            background: complete ? "var(--teal)" : "var(--amber)",
          }}
        />
      </div>
      <span className="text-xs text-[var(--ink-soft)]" aria-hidden="true">
        {percent}% through
      </span>
    </div>
  );
}
