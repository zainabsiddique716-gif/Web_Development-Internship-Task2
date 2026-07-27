import { useCallback, useEffect, useRef, useState } from "react";
import type { Duration, LogEntry, Theme } from "./types";
import Button from "./components/Button";
import TimerBoard from "./components/TimerBoard";
import ProgressIndicator from "./components/ProgressIndicator";
import DurationPicker from "./components/DurationPicker";
import StatBadge from "./components/StatBadge";
import LogRow from "./components/LogRow";
import ThemeToggle from "./components/ThemeToggle";
import ErrorAlert from "./components/ErrorAlert";
const DURATIONS: Duration[] = [
  { label: "Sprint", minutes: 25 },
  { label: "Deep", minutes: 50 },
  { label: "Short break", minutes: 5 },
];

const INITIAL_LOG: LogEntry[] = [
  { label: "Deep work — Bison grammar", time: "9:10 AM", minutes: 50, status: "done" },
  { label: "Sprint — SHAP write-up", time: "8:20 AM", minutes: 25, status: "skipped" },
];
export default function App() {
  const [theme, setTheme] = useState<Theme>("light");
  const [durationIdx, setDurationIdx] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [log, setLog] = useState<LogEntry[]>(INITIAL_LOG);
  const [taskName, setTaskName] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasCompleteRef = useRef(false);

  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [880, 1046.5];
      notes.forEach((freq, i) => {
        const start = ctx.currentTime + i * 0.22;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.42);
      });
    } catch {
      // Audio not supported or blocked — fail silently, timer still works
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (running && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            setRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const total = DURATIONS[durationIdx].minutes * 60;
  const pct = Math.round(((total - secondsLeft) / total) * 100);
  const complete = secondsLeft === 0;

  useEffect(() => {
    if (complete && !wasCompleteRef.current) {
      playChime();
    }
    wasCompleteRef.current = complete;
  }, [complete, playChime]);

  const handleDurationChange = useCallback(
    (idx: number) => {
      if (running) return;
      setDurationIdx(idx);
      setSecondsLeft(DURATIONS[idx].minutes * 60);
    },
    [running]
  );

  const handleReset = () => {
    setRunning(false);
    setSecondsLeft(DURATIONS[durationIdx].minutes * 60);
  };

  const handleFinishSync = () => {
    setSyncing(true);
    setSyncError(false);
    setTimeout(() => {
      setSyncing(false);
      const failed = Math.random() < 0.3;
      if (failed) {
        setSyncError(true);
        return;
      }
      setLog((l) => [
        {
          label: taskName.trim()
            ? taskName.trim()
            : `${DURATIONS[durationIdx].label} — untitled task`,
          time: new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
          minutes: DURATIONS[durationIdx].minutes,
          status: "done",
        },
        ...l,
      ]);
      setTaskName("");
      handleReset();
    }, 1100);
  };

  return (
    <div data-theme={theme} style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-10 sm:mb-14">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--amber)]"
            />
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-soft)]">
              Study Sprint
            </span>
          </div>
          <ThemeToggle theme={theme} onToggle={() => setTheme((t) => (t === "light" ? "dark" : "light"))} />
        </header>

        <main>
        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6 sm:gap-8 mb-10">
          <div
            className="rounded-2xl p-6 sm:p-9 bg-[var(--surface)]"
            style={{ boxShadow: "var(--shadow)" }}
          >
            <h1
              className="mb-1 font-display text-[var(--ink)]"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.1rem)",
                fontWeight: 600,
                letterSpacing: "-0.01em",
              }}
            >
              {complete ? "Sprint complete" : running ? "In progress" : "Ready when you are"}
            </h1>
            <p className="text-sm mb-6 sm:mb-8 text-[var(--ink-soft)]">
              {DURATIONS[durationIdx].label} · {DURATIONS[durationIdx].minutes} minutes, heads down.
            </p>

            <div className="flex flex-wrap items-end justify-between gap-6">
              <TimerBoard seconds={secondsLeft} />
              <ProgressIndicator percent={pct} complete={complete} />
            </div>

            <DurationPicker
              durations={DURATIONS}
              activeIdx={durationIdx}
              disabled={running}
              onChange={handleDurationChange}
            />

            {complete && (
              <div className="mb-4">
                <label htmlFor="task-name" className="sr-only">
                  Task name
                </label>
                <input
                  id="task-name"
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="Name this sprint (optional)"
                  disabled={syncing}
                  className={[
                    "w-full sm:w-72 rounded-full px-4 py-2 text-sm",
                    "bg-[var(--surface-2)] text-[var(--ink)] border border-[var(--line)]",
                    "placeholder:text-[var(--ink-soft)]",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-none outline-[var(--teal)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                  ].join(" ")}
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {!complete ? (
                <>
                  <Button variant="primary" size="lg" onClick={() => setRunning((r) => !r)}>
                    {running ? "Pause" : secondsLeft === total ? "Start sprint" : "Resume"}
                  </Button>
                  <Button variant="ghost" onClick={handleReset} disabled={secondsLeft === total && !running}>
                    Reset
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="primary" size="lg" loading={syncing} onClick={handleFinishSync}>
                    {syncing ? "Saving to log…" : "Save to log"}
                  </Button>
                  <Button variant="ghost" onClick={() => { setTaskName(""); handleReset(); }}>
                    Discard
                  </Button>
                </>
              )}
            </div>

            {syncError && <ErrorAlert />}
          </div>

          {/* Stats rail */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl p-5 sm:p-6 flex flex-wrap gap-3 bg-[var(--surface)]"
              style={{ boxShadow: "var(--shadow)" }}
            >
              <StatBadge label="Today" value="2h 15m" tone="amber" />
              <StatBadge label="Streak" value="6 days" tone="teal" />
              <StatBadge label="Sprints" value="3" tone="ink" />
            </div>
            <div
              className="rounded-2xl p-5 sm:p-6 text-sm leading-relaxed bg-[var(--surface)] text-[var(--ink-soft)]"
              style={{ boxShadow: "var(--shadow)" }}
            >
              <p className="font-medium mb-1.5 text-[var(--ink)]">Board tip</p>
              Sprints save to today's log as soon as you hit Save — name them when you finish, or leave it blank and it'll say "untitled task".
            </div>
          </div>
        </section>

        {/* Log */}
        <section
          className="rounded-2xl p-6 sm:p-8 bg-[var(--surface)]"
          style={{ boxShadow: "var(--shadow)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-[1.15rem] font-semibold text-[var(--ink)]">Today's log</h2>
            <span className="text-xs text-[var(--ink-soft)]">{log.length} entries</span>
          </div>
          <ul>
            {log.map((entry, i) => (
              <LogRow key={i} entry={entry} />
            ))}
          </ul>
        </section>
        </main>
      </div>
    </div>
  );
}
