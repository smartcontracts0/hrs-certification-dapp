'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { accreditationAddress, accreditationABI } from '@/lib/contracts/accreditation';

export default function UpdateAccreditationTab() {
  const [updateEquipmentId, setUpdateEquipmentId] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [confirmEquipmentId, setConfirmEquipmentId] = useState('');
  const [decision, setDecision] = useState<'1' | '2'>('1');
  const [status, setStatus] = useState<string | null>(null);

  const updateAccreditation = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(accreditationAddress, accreditationABI, signer);

      const tx = await contract.updateAccreditation(parseInt(updateEquipmentId), ipfsHash);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Accreditation record updated successfully!');
    } catch (err: any) {
      console.error(err);
      setStatus('❌ Failed to update accreditation.');
    }
  };

  const confirmUpdate = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(accreditationAddress, accreditationABI, signer);

      const tx = await contract.confirmUpdatedAccreditation(parseInt(confirmEquipmentId), parseInt(decision));
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Accreditation update confirmed successfully!');
    } catch (err: any) {
      console.error(err);
      setStatus('❌ Failed to confirm update.');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Update Accreditation</h3>

      <Label htmlFor="updateEquipmentId">Equipment ID</Label>
      <Input
        id="updateEquipmentId"
        type="number"
        value={updateEquipmentId}
        onChange={(e) => setUpdateEquipmentId(e.target.value)}
        placeholder="e.g. 4"
      />

      <Label htmlFor="ipfs">New IPFS Hash</Label>
      <Input
        id="ipfs"
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
        placeholder="Qm..."
      />

      <Button onClick={updateAccreditation}>Update Accreditation</Button>

      <hr className="my-6" />

      <h3 className="text-lg font-semibold">Confirm Update Decision</h3>

      <Label htmlFor="confirmEquipmentId">Equipment ID</Label>
      <Input
        id="confirmEquipmentId"
        type="number"
        value={confirmEquipmentId}
        onChange={(e) => setConfirmEquipmentId(e.target.value)}
        placeholder="e.g. 4"
      />

      <Label htmlFor="decision">Decision</Label>
      <select
        id="decision"
        value={decision}
        onChange={(e) => setDecision(e.target.value as '1' | '2')}
        className="border rounded px-2 py-1 text-sm"
      >
        <option value="1">Approve Update</option>
        <option value="2">Deny Update</option>
      </select>

      <Button onClick={confirmUpdate} variant="secondary">Confirm Update</Button>

      {status && <p className="text-sm mt-4 text-gray-600">{status}</p>}
    </div>
  );
}
