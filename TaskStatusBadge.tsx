import { EscrowTask, getTaskStatusLabel } from "@/lib/contract";

const badgeStyles: Record<string, string> = {
  Created: "bg-sand text-ink",
  Funded: "bg-amber-100 text-amber-900",
  "Work Submitted": "bg-blue-100 text-blue-900",
  Released: "bg-pine/15 text-pine",
  Refunded: "bg-red-50 text-red-700"
};

export function TaskStatusBadge({ task }: { task: EscrowTask }) {
  const label = getTaskStatusLabel(task);

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] ${badgeStyles[label]}`}>
      {label}
    </span>
  );
}
