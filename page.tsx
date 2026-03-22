"use client";

import { FormEvent, useState } from "react";
import { StatusMessage } from "@/components/StatusMessage";
import { TaskFormCard } from "@/components/TaskFormCard";
import { getEscrowContract } from "@/lib/contract";

export default function ApproveReleasePage() {
  const [taskId, setTaskId] = useState("");
  const [status, setStatus] = useState("");
  const [statusTone, setStatusTone] = useState<"success" | "error" | "info">("info");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    setStatusTone("info");

    try {
      const contract = await getEscrowContract();
      const tx = await contract.approveRelease(taskId);
      const receipt = await tx.wait();
      setStatus(`Funds released. Tx hash: ${receipt.hash}`);
      setStatusTone("success");
      setTaskId("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Release failed.");
      setStatusTone("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TaskFormCard
      title="Approve Release"
      description="The client confirms the submitted proof and releases escrowed funds to the assigned worker."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Task ID" value={taskId} onChange={(event) => setTaskId(event.target.value)} required />
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-pine px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Releasing..." : "Approve Release"}
        </button>
        <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-sm text-ink/70">
          Use the client wallet here. Approval fails automatically if the task was already refunded.
        </div>
      </form>
      <div className="mt-4">
        <StatusMessage message={status} tone={statusTone} />
      </div>
    </TaskFormCard>
  );
}
