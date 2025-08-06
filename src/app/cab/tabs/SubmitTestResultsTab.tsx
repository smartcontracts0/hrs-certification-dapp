'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { accreditationABI, accreditationAddress } from '@/lib/contracts/accreditation';

export default function SubmitTestResultsTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [status, setStatus] = useState<string | null>(null);

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
      <Label htmlFor="equipmentId">Equipment ID</Label>
      <Input
        id="equipmentId"
        placeholder="e.g. 3"
        value={equipmentId}
        onChange={(e) => setEquipmentId(e.target.value)}
      />

      <Label htmlFor="ipfs">Test Results IPFS Hash</Label>
      <Input
        id="ipfs"
        placeholder="Qm..."
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
      />

      <Button onClick={submitResults}>Submit Test Results</Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
