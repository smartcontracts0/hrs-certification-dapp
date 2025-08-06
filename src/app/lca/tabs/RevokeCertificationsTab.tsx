'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { certificationAddress, certificationABI } from '@/lib/contracts/certification';

export default function RevokeCertificationsTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const revokeCertification = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(certificationAddress, certificationABI, signer);

      const tx = await contract.revokeCertification(parseInt(equipmentId));
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Certification revoked successfully!');
      setEquipmentId('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to revoke certification.');
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
        placeholder="e.g. 3"
      />

      <Button onClick={revokeCertification}>Revoke Certification</Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
