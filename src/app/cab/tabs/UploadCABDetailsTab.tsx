'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registrationABI, registrationAddress } from '@/lib/contracts/registration';

export default function UploadCABDetailsTab() {
  const [ipfsHash, setIpfsHash] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const updateDetails = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(registrationAddress, registrationABI, signer);

      const tx = await contract.updateCABDetails(ipfsHash);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ CAB details updated successfully!');
      setIpfsHash('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to update details.');
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="ipfs">IPFS Hash</Label>
      <Input
        id="ipfs"
        placeholder="Qm..."
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
      />
      <Button onClick={updateDetails}>Upload Details</Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
