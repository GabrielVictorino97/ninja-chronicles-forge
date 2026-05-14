type LogLevel = "error" | "warn" | "info";

interface LogEntry {
  ts: string;
  level: LogLevel;
  message: string;
  error?: string;
  source: "frontend";
  [key: string]: unknown;
}

function emit(level: LogLevel, message: string, error?: Error, extra?: Record<string, unknown>) {
  const entry: LogEntry = {
    ts: new Date().toISOString(),
    level,
    message,
    source: "frontend",
  };
  if (error) {
    entry.error = error.stack ?? error.message;
    entry.errorMessage = error.message;
  }
  if (extra) Object.assign(entry, extra);

  const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  fn(`[${level.toUpperCase()}] ${message}`, error ?? "", extra ?? "");
}

export const logger = {
  error(message: string, error?: Error, extra?: Record<string, unknown>) {
    emit("error", message, error, extra);
  },
  warn(message: string, extra?: Record<string, unknown>) {
    emit("warn", message, undefined, extra);
  },
  info(message: string, extra?: Record<string, unknown>) {
    emit("info", message, undefined, extra);
  },
};

export function captureUnhandledErrors() {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (e) => {
    logger.error(`Unhandled: ${e.message}`, e.error, {
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    const err = e.reason instanceof Error ? e.reason : new Error(String(e.reason));
    logger.error("Unhandled Promise", err);
  });
}
