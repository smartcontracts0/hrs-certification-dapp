'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  certificationABI,
  certificationAddress,
} from '@/lib/contracts/certification';

export default function UpdateCertificationInfoTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const updateCertification = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask not detected');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(certificationAddress, certificationABI, signer);

      const tx = await contract.updateCertification(
        parseInt(equipmentId),
        ipfsHash
      );

      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Certification update submitted successfully!');
      setEquipmentId('');
      setIpfsHash('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to submit certification update.');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Submit Certification Update</h3>

      <div className="space-y-2">
        <Label htmlFor="equipmentId">Equipment ID</Label>
        <Input
          id="equipmentId"
          type="number"
          value={equipmentId}
          onChange={(e) => setEquipmentId(e.target.value)}
          placeholder="e.g. 4"
        />

        <Label htmlFor="ipfs">Updated IPFS Hash</Label>
        <Input
          id="ipfs"
          value={ipfsHash}
          onChange={(e) => setIpfsHash(e.target.value)}
          placeholder="Qm..."
        />

        <Button onClick={updateCertification}>Submit Update</Button>

        {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
      </div>
    </div>
  );
}
