export type Theme = "light" | "dark";

export interface Duration {
  label: string;
  minutes: number;
}

export type LogStatus = "done" | "skipped";

export interface LogEntry {
  label: string;
  time: string;
  minutes: number;
  status: LogStatus;
}

export type ButtonVariant = "primary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export type StatTone = "ink" | "teal" | "amber";
