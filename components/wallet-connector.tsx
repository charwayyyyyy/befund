"use client";

import { useEffect, useState } from "react";
import { BrowserProvider, formatEther } from "ethers";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function WalletConnector() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [networkValid, setNetworkValid] = useState<boolean | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (!window.ethereum) return;
    window.ethereum.on("accountsChanged", handleAccountsChanged);
  }, []);

  async function handleAccountsChanged(accounts: string[]) {
    if (!accounts || accounts.length === 0) {
      setAddress(null);
      setBalance(null);
      return;
    }
    const provider = new BrowserProvider(window.ethereum);
    const newAddress = accounts[0];
    setAddress(newAddress);
    const balanceBigInt = await provider.getBalance(newAddress);
    setBalance(formatEther(balanceBigInt));
    const network = await provider.getNetwork();
    setNetworkValid(network.chainId === 11155111n);
  }

  async function connect() {
    if (!window.ethereum) {
      return;
    }
    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      await handleAccountsChanged(accounts);
      const provider = new BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) {
        setNetworkValid(false);
      } else {
        setNetworkValid(true);
      }
    } finally {
      setConnecting(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      {!address ? (
        <button
          onClick={connect}
          disabled={connecting}
          className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white shadow-glow transition hover:bg-accentSecondary disabled:opacity-60"
        >
          {connecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="flex items-center gap-3 rounded-full bg-white/5 px-4 py-2 text-xs">
          <span className="text-slate-300">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          {balance && <span className="text-slate-400">{Number(balance).toFixed(4)} ETH</span>}
          {networkValid === false && (
            <span className="text-amber-400">Switch to Sepolia in MetaMask</span>
          )}
        </div>
      )}
    </div>
  );
}
