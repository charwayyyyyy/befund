"use client";

import { useState } from "react";
import { BrowserProvider, Contract, parseEther } from "ethers";
import { BEFUND_ABI } from "../lib/befund-abi";

type DonateButtonProps = {
  campaignId: number;
};

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_BEFUND_ADDRESS as string | undefined;

export function DonateButton({ campaignId }: DonateButtonProps) {
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleDonate() {
    if (!window.ethereum || !CONTRACT_ADDRESS) {
      return;
    }
    setPending(true);
    setError(null);
    setTxHash(null);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, BEFUND_ABI, signer);
      const tx = await contract.donate(campaignId, {
        value: parseEther(amount)
      });
      setTxHash(tx.hash);
      await tx.wait();
    } catch (e: any) {
      setError(e.message ?? "Transaction failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2 text-xs">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.05"
          className="w-20 rounded-full bg-black/40 px-3 py-1 text-xs outline-none ring-1 ring-white/10"
        />
        <button
          onClick={handleDonate}
          disabled={pending || !amount}
          className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-white shadow-glow transition hover:bg-accentSecondary disabled:opacity-60"
        >
          {pending ? "Pending..." : "Donate"}
        </button>
      </div>
      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] text-emerald-400 underline"
        >
          View on Etherscan
        </a>
      )}
      {error && <span className="text-[10px] text-rose-400">{error}</span>}
    </div>
  );
}
