"use client";

import { useEffect, useState } from "react";
import { getEthereum, shortenAddress } from "@/lib/contract";
import { StatusMessage } from "@/components/StatusMessage";

export function WalletButton() {
  const [account, setAccount] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    const ethereum = getEthereum();
    if (!ethereum) {
      return;
    }

    ethereum
      .request({ method: "eth_accounts" })
      .then((accounts) => {
        const [first] = accounts as string[];
        if (first) {
          setAccount(first);
        }
      })
      .catch(() => undefined);

    ethereum
      .request({ method: "eth_chainId" })
      .then((value) => setChainId(String(value)))
      .catch(() => undefined);

    const handleAccountsChanged = (accounts: unknown) => {
      const nextAccounts = Array.isArray(accounts) ? (accounts as string[]) : [];
      setAccount(nextAccounts[0] ?? "");
    };

    const handleChainChanged = (value: unknown) => {
      setChainId(typeof value === "string" ? value : "");
    };

    ethereum.on?.("accountsChanged", handleAccountsChanged);
    ethereum.on?.("chainChanged", handleChainChanged);
    return () => {
      ethereum.removeListener?.("accountsChanged", handleAccountsChanged);
      ethereum.removeListener?.("chainChanged", handleChainChanged);
    };
  }, []);

  const connect = async () => {
    const ethereum = getEthereum();
    if (!ethereum) {
      setError("MetaMask not detected.");
      return;
    }

    try {
      setError("");
      const accounts = (await ethereum.request({ method: "eth_requestAccounts" })) as string[];
      const nextChainId = (await ethereum.request({ method: "eth_chainId" })) as string;
      setAccount(accounts[0] ?? "");
      setChainId(nextChainId);
    } catch (connectError) {
      setError(connectError instanceof Error ? connectError.message : "Wallet connection failed.");
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={connect}
        className="rounded-2xl bg-ink px-5 py-3 text-sm font-semibold text-white hover:bg-pine"
      >
        {account ? `Wallet: ${shortenAddress(account)}` : "Connect MetaMask"}
      </button>
      {account ? (
        <div className="rounded-2xl border border-ink/10 bg-sand px-4 py-3 text-xs font-medium text-ink/75">
          Connected on chain {chainId || "unknown"}. For Hardhat localhost, use chain ID `31337`.
        </div>
      ) : null}
      <StatusMessage message={error} tone="error" />
    </div>
  );
}
