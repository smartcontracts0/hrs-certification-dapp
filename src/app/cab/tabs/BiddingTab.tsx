'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { biddingABI, biddingAddress } from '@/lib/contracts/bidding';

export default function BiddingTab() {
  const [auctionId, setAuctionId] = useState('');
  const [bidAmount, setBidAmount] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [auctions, setAuctions] = useState<any[]>([]);

  const fetchAuctions = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(biddingAddress, biddingABI, provider);

      const total = await contract.auctionCounter();
      const results = [];

      for (let i = 1; i <= total; i++) {
        const [equipmentId, manufacturer, active, bestBidId] = await contract.getAuctionDetails(i);
        results.push({ id: i, equipmentId, manufacturer, active, bestBidId });
      }

      setAuctions(results);
    } catch (err) {
      console.error('Failed to fetch auctions:', err);
    }
  };

  const submitBid = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(biddingAddress, biddingABI, signer);

      const tx = await contract.submitBid(parseInt(auctionId), ethers.parseEther(bidAmount));
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Bid submitted successfully!');
      setAuctionId('');
      setBidAmount('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to submit bid.');
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Open Auctions</h3>
        <ul className="space-y-2">
          {auctions.map((a) => (
            <li key={a.id} className="border p-2 rounded">
              Auction #{a.id} — Equipment #{a.equipmentId} — Status: {a.active ? 'Active' : 'Closed'}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Submit a Bid</h4>
        <Label htmlFor="auctionId">Auction ID</Label>
        <Input
          id="auctionId"
          placeholder="e.g. 1"
          value={auctionId}
          onChange={(e) => setAuctionId(e.target.value)}
        />

        <Label htmlFor="bidAmount">Bid Amount (ETH)</Label>
        <Input
          id="bidAmount"
          placeholder="e.g. 0.1"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />

        <Button onClick={submitBid}>Submit Bid</Button>
        {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
      </div>
    </div>
  );
}
