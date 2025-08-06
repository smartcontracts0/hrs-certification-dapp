'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { biddingABI, biddingAddress } from '@/lib/contracts/bidding';

export default function SelectBestBidTab() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const fetchActiveAuctions = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(biddingAddress, biddingABI, provider);
      const address = await signer.getAddress();

      const total = await contract.auctionCounter();
      const results = [];

      for (let i = 1; i <= total; i++) {
        const [equipmentId, manufacturer, active, bestBidId] = await contract.getAuctionDetails(i);
        if (active && manufacturer.toLowerCase() === address.toLowerCase()) {
          results.push({ id: i, equipmentId, active, bestBidId });
        }
      }

      setAuctions(results);
    } catch (err) {
      console.error('Failed to fetch active auctions:', err);
    }
  };

  const selectBestBid = async (auctionId: number) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(biddingAddress, biddingABI, signer);

      const bestBid = await contract.getBidDetails(auctionId, (await contract.getAuctionDetails(auctionId))[3]);
      const tx = await contract.selectBestBid(auctionId, { value: bestBid[1] });
      setStatus(`Transaction for auction #${auctionId} sent...`);
      await tx.wait();
      setStatus(`✅ Best bid selected for auction #${auctionId}`);
      fetchActiveAuctions();
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to select best bid.');
    }
  };

  useEffect(() => {
    fetchActiveAuctions();
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">My Active Auctions</h3>
      <ul className="space-y-3">
        {auctions.map((auction) => (
          <li key={auction.id} className="border p-4 rounded">
            <p>Auction #{auction.id} — Equipment #{auction.equipmentId}</p>
            <Button className="mt-2" onClick={() => selectBestBid(auction.id)}>
              Select Best Bid
            </Button>
          </li>
        ))}
      </ul>
      {status && <p className="text-sm text-gray-600 mt-4">{status}</p>}
    </div>
  );
}
