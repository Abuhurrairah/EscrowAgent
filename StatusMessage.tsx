"use client";

type Tone = "success" | "error" | "info";

const tones: Record<Tone, string> = {
  success: "border-pine/20 bg-pine/10 text-pine",
  error: "border-red-300 bg-red-50 text-red-700",
  info: "border-ink/15 bg-sand text-ink/80"
};

export function StatusMessage({ message, tone = "info" }: { message: string; tone?: Tone }) {
  if (!message) {
    return null;
  }

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${tones[tone]}`}>{message}</div>;
}
