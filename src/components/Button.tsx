import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { ButtonSize, ButtonVariant } from "../types";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--amber)] text-[var(--board)] outline-[var(--amber)] " +
    "hover:enabled:[filter:brightness(1.08)] hover:enabled:-translate-y-px",
  ghost:
    "bg-transparent text-[var(--ink)] border border-[var(--line)] outline-[var(--teal)] " +
    "hover:enabled:bg-[var(--surface-2)] hover:enabled:-translate-y-px",
  danger:
    "bg-[var(--danger-soft)] text-[var(--danger)] outline-[var(--danger)] " +
    "hover:enabled:[filter:brightness(1.05)] hover:enabled:-translate-y-px",
};

/**
 * Reusable button covering every state the brief asks for:
 * default, hover (CSS, not JS), focus-visible, active (press), disabled, loading.
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={[
        "relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight",
        "transition-all duration-200 ease-out",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-45",
        "active:enabled:scale-[0.97]",
        sizeClasses[size],
        variantClasses[variant],
        className,
      ].join(" ")}
      {...rest}
    >
      {loading && (
        <span
          className="h-3.5 w-3.5 rounded-full border-2 animate-spin"
          style={{ borderColor: "currentColor", borderTopColor: "transparent" }}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  );
}
