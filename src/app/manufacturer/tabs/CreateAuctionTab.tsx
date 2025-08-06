'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registrationAddress, registrationABI } from '@/lib/contracts/registration';
import { biddingAddress, biddingABI } from '@/lib/contracts/bidding';

export default function CreateAuctionTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [ownedEquipment, setOwnedEquipment] = useState<number[]>([]);

  const fetchOwnedEquipment = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(registrationAddress, registrationABI, provider);

      const total = await contract.equipmentCounter();
      const owned: number[] = [];

      for (let i = 1; i <= total; i++) {
        const [, manufacturer] = await contract.getEquipmentDetails(i);
        if (manufacturer.toLowerCase() === userAddress.toLowerCase()) {
          owned.push(i);
        }
      }

      setOwnedEquipment(owned);
    } catch (err) {
      console.error('Failed to fetch owned equipment:', err);
    }
  };

  const createAuction = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(biddingAddress, biddingABI, signer);

      const tx = await contract.createAuction(parseInt(equipmentId));
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Auction created successfully!');
      setEquipmentId('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to create auction.');
    }
  };

  useEffect(() => {
    fetchOwnedEquipment();
  }, []);

  return (
    <div className="space-y-4">
      <Label htmlFor="equipmentId">Your Equipment ID</Label>
      <select
        id="equipmentId"
        value={equipmentId}
        onChange={(e) => setEquipmentId(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Equipment</option>
        {ownedEquipment.map((id) => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>

      <Button onClick={createAuction}>Create Auction</Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
