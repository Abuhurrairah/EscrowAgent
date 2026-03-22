import { EscrowTask, formatDeadline, formatEth, shortenAddress } from "@/lib/contract";
import { TaskStatusBadge } from "@/components/TaskStatusBadge";

const rows = (task: EscrowTask) => [
  ["Client", shortenAddress(task.client)],
  ["Worker", shortenAddress(task.worker)],
  ["Amount", `${formatEth(task.amount)} ETH`],
  ["Deadline", formatDeadline(task.deadline)],
  ["Funded", task.funded ? "Yes" : "No"],
  ["Released", task.released ? "Yes" : "No"],
  ["Refunded", task.refunded ? "Yes" : "No"],
  ["Proof URL", task.proofUrl || "None yet"],
  ["Proof Hash", task.proofHash || "None yet"]
];

export function TaskSnapshot({ task }: { task: EscrowTask }) {
  return (
    <div className="space-y-4 rounded-[2rem] border border-ink/10 bg-white/80 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-black">Task Snapshot</h2>
        <TaskStatusBadge task={task} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {rows(task).map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-sand px-4 py-3">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink/50">{label}</p>
            <p className="mt-1 break-all text-sm text-ink">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
