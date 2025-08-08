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

export default function ConfirmUpdatedCertificationTab() {
  const [equipmentIdConfirm, setEquipmentIdConfirm] = useState('');
  const [decision, setDecision] = useState('1');
  const [status, setStatus] = useState<string | null>(null);

  const confirmUpdatedCertification = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        certificationAddress,
        certificationABI,
        signer
      );

      const tx = await contract.confirmUpdatedCertification(
        parseInt(equipmentIdConfirm),
        parseInt(decision)
      );
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Certification update confirmed.');
      setEquipmentIdConfirm('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to confirm update.');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Confirm Updated Certification</h3>

      <div className="space-y-2">
        <Label htmlFor="equipmentIdConfirm">Equipment ID</Label>
        <Input
          id="equipmentIdConfirm"
          type="number"
          value={equipmentIdConfirm}
          onChange={(e) => setEquipmentIdConfirm(e.target.value)}
          placeholder="e.g. 4"
        />

        <Label htmlFor="decision">Decision</Label>
        <select
          id="decision"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="1">Approve</option>
          <option value="2">Deny</option>
        </select>

        <Button onClick={confirmUpdatedCertification}>Confirm Update</Button>
      </div>

      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
