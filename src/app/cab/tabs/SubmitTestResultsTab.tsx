'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { accreditationABI, accreditationAddress } from '@/lib/contracts/accreditation';
import { biddingABI, biddingAddress } from '@/lib/contracts/bidding';

export default function SubmitTestResultsTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [ownedEquipment, setOwnedEquipment] = useState<number[]>([]);

  useEffect(() => {
    const fetchOwnedEquipment = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();

        const biddingContract = new ethers.Contract(biddingAddress, biddingABI, provider);
        const total = await biddingContract.auctionCounter();

        const matches: number[] = [];

        for (let i = 1; i <= total; i++) {
          try {
            const winningCAB = await biddingContract.getWinningCAB(i);
            if (winningCAB.toLowerCase() === userAddress.toLowerCase()) {
              matches.push(i);
            }
          } catch {
            // Skip if auction doesn't exist or has no winner
          }
        }

        setOwnedEquipment(matches);
      } catch (err) {
        console.error('Error fetching winning equipment:', err);
      }
    };

    fetchOwnedEquipment();
  }, []);

  const submitResults = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(accreditationAddress, accreditationABI, signer);

      const tx = await contract.submitTestResults(parseInt(equipmentId), ipfsHash);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Test results submitted successfully!');
      setEquipmentId('');
      setIpfsHash('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to submit test results.');
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="equipmentId">Select Equipment You Won</Label>
      <select
        id="equipmentId"
        className="w-full p-2 border rounded"
        value={equipmentId}
        onChange={(e) => setEquipmentId(e.target.value)}
      >
        <option value="">-- Select Equipment --</option>
        {ownedEquipment.map((id) => (
          <option key={id} value={id}>
            Equipment #{id}
          </option>
        ))}
      </select>

      <Label htmlFor="ipfs">Test Results IPFS Hash</Label>
      <Input
        id="ipfs"
        placeholder="Qm..."
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
      />

      <Button onClick={submitResults} disabled={!equipmentId || !ipfsHash}>
        Submit Test Results
      </Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
