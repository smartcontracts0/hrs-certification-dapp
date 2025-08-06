'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registrationAddress, registrationABI } from '@/lib/contracts/registration';

export default function RegisterEquipmentTab() {
  const [equipmentType, setEquipmentType] = useState('0');
  const [ipfsHash, setIpfsHash] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const registerEquipment = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(registrationAddress, registrationABI, signer);

      const tx = await contract.registerEquipment(parseInt(equipmentType), ipfsHash);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Equipment registered successfully!');
      setIpfsHash('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to register equipment.');
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="equipmentType">Equipment Type</Label>
      <select
        id="equipmentType"
        value={equipmentType}
        onChange={(e) => setEquipmentType(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="0">MicroChannelHeatExchanger</option>
        <option value="1">ReciprocatingCompressor</option>
      </select>

      <Label htmlFor="ipfs">Equipment Document IPFS Hash</Label>
      <Input
        id="ipfs"
        placeholder="Qm..."
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
      />

      <Button onClick={registerEquipment}>Register Equipment</Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
