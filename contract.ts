"use client";

import { BrowserProvider, Contract, Interface, JsonRpcSigner, ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on?: (event: string, listener: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
    };
  }
}

export const ESCROW_AGENT_ABI = [
  "function createTask(address worker, uint256 amount, uint256 deadline) returns (uint256)",
  "function fundTask(uint256 taskId) payable",
  "function submitWork(uint256 taskId, string proofUrl, string proofHash)",
  "function approveRelease(uint256 taskId)",
  "function refundAfterDeadline(uint256 taskId)",
  "function nextTaskId() view returns (uint256)",
  "function tasks(uint256) view returns (address client, address worker, uint256 amount, uint256 deadline, bool funded, bool released, bool refunded, string proofUrl, string proofHash)",
  "event TaskCreated(uint256 indexed taskId, address indexed client, address indexed worker, uint256 amount, uint256 deadline)",
  "event TaskFunded(uint256 indexed taskId, uint256 amount)",
  "event WorkSubmitted(uint256 indexed taskId, string proofUrl, string proofHash)",
  "event FundsReleased(uint256 indexed taskId, address indexed worker, uint256 amount)",
  "event TaskRefunded(uint256 indexed taskId, address indexed client, uint256 amount)"
] as const;

const escrowInterface = new Interface(ESCROW_AGENT_ABI);

export type EscrowTask = {
  client: string;
  worker: string;
  amount: bigint;
  deadline: bigint;
  funded: boolean;
  released: boolean;
  refunded: boolean;
  proofUrl: string;
  proofHash: string;
};

export function getEthereum() {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.ethereum;
}

export function getContractAddress() {
  return process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS ?? "";
}

async function getProvider() {
  const ethereum = getEthereum();

  if (!ethereum) {
    throw new Error("MetaMask not detected.");
  }

  return new BrowserProvider(ethereum);
}

async function getSigner(): Promise<JsonRpcSigner> {
  const provider = await getProvider();
  return provider.getSigner();
}

export async function getEscrowContract() {
  const contractAddress = getContractAddress();

  if (!contractAddress) {
    throw new Error("Set NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS in your environment.");
  }

  const signer = await getSigner();
  return new Contract(contractAddress, ESCROW_AGENT_ABI, signer);
}

export async function getEscrowReadContract() {
  const contractAddress = getContractAddress();

  if (!contractAddress) {
    throw new Error("Set NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS in your environment.");
  }

  const provider = await getProvider();
  return new Contract(contractAddress, ESCROW_AGENT_ABI, provider);
}

export function shortenAddress(address: string) {
  if (!address) {
    return "";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function parseEth(amount: string) {
  return ethers.parseEther(amount || "0");
}

export function formatEth(amount: bigint) {
  return ethers.formatEther(amount);
}

export function parseDeadline(dateTimeValue: string) {
  const unixMs = Date.parse(dateTimeValue);
  if (Number.isNaN(unixMs)) {
    throw new Error("Enter a valid deadline.");
  }

  return BigInt(Math.floor(unixMs / 1000));
}

export function formatDeadline(deadline: bigint) {
  if (deadline === 0n) {
    return "Not set";
  }

  return new Date(Number(deadline) * 1000).toLocaleString();
}

export function normalizeTask(task: EscrowTask): EscrowTask {
  return {
    client: task.client,
    worker: task.worker,
    amount: BigInt(task.amount),
    deadline: BigInt(task.deadline),
    funded: task.funded,
    released: task.released,
    refunded: task.refunded,
    proofUrl: task.proofUrl,
    proofHash: task.proofHash
  };
}

export function taskExists(task: EscrowTask) {
  return task.client !== ethers.ZeroAddress;
}

export function getTaskStatusLabel(task: EscrowTask) {
  if (task.refunded) {
    return "Refunded";
  }

  if (task.released) {
    return "Released";
  }

  if (task.proofHash) {
    return "Work Submitted";
  }

  if (task.funded) {
    return "Funded";
  }

  return "Created";
}

export function extractTaskCreated(receipt: { logs?: Array<{ topics: string[]; data: string }> }) {
  if (!receipt.logs) {
    return null;
  }

  for (const log of receipt.logs) {
    try {
      const parsed = escrowInterface.parseLog(log);
      if (parsed?.name === "TaskCreated") {
        return {
          taskId: BigInt(parsed.args.taskId),
          deadline: BigInt(parsed.args.deadline)
        };
      }
    } catch {
      continue;
    }
  }

  return null;
}
