'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { certificationAddress, certificationABI } from '@/lib/contracts/certification';

export default function SubmitAuditTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const submitAudit = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(certificationAddress, certificationABI, signer);

      const tx = await contract.submitAuditReport(parseInt(equipmentId), ipfsHash);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Audit record submitted successfully!');
      setEquipmentId('');
      setIpfsHash('');
    } catch (err: any) {
      console.error(err);
      setStatus('❌ Failed to submit audit. Ensure you are the winning CAB and certification is approved.');
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="equipmentId">Equipment ID</Label>
      <Input
        id="equipmentId"
        type="number"
        value={equipmentId}
        onChange={(e) => setEquipmentId(e.target.value)}
        placeholder="e.g. 4"
      />

      <Label htmlFor="ipfs">Audit Document IPFS Hash</Label>
      <Input
        id="ipfs"
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
        placeholder="Qm..."
      />

      <Button onClick={submitAudit}>Submit Audit</Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
