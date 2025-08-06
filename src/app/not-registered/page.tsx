'use client';

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/hooks/useUserRole";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [network, setNetwork] = useState<ethers.Network | null>(null);

  const router = useRouter();
  const role = useUserRole(account, provider);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    }
  }, []);

  const connectWallet = async () => {
    if (!provider) return;
    try {
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAccount(accounts[0]);
      setNetwork(network);
    } catch (err) {
      console.error("Failed to connect wallet:", err);
    }
  };

  useEffect(() => {
    if (!account) return;
    if (role === "manufacturer") router.push("/manufacturer");
    else if (role === "cab") router.push("/cab");
    else if (role === "iab") router.push("/iab");
    else if (role === "unknown") router.push("/not-registered");
  }, [role, account, router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">HRS Certification DApp</h1>
      {!account ? (
        <Button onClick={connectWallet}>Connect Wallet</Button>
      ) : (
        <div className="text-center space-y-2">
          <p className="text-sm">Connected Account:</p>
          <p className="font-mono text-blue-500">{account}</p>
          <p className="text-sm text-gray-500">
            Network: {network?.name} (Chain ID: {network?.chainId})
          </p>
          <p className="text-sm mt-2">Redirecting to your dashboard...</p>
        </div>
      )}
    </main>
  );
}
