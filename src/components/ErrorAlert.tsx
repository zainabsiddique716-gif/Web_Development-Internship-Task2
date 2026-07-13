export default function ErrorAlert() {
  return (
    <div
      role="alert"
      className="mt-4 flex items-start gap-2.5 rounded-xl px-4 py-3 text-sm bg-[var(--danger-soft)] text-[var(--danger)]"
    >
      <span aria-hidden="true" className="mt-0.5">
        ⚠
      </span>
      <span>Couldn't save your sprint — the connection dropped. Your time isn't lost; try saving again.</span>
    </div>
  );
}
