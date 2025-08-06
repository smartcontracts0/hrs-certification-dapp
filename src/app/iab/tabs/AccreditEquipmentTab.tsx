'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { accreditationABI, accreditationAddress } from '@/lib/contracts/accreditation';

export default function AccreditEquipmentTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);

  useEffect(() => {
    const fetchTestResult = async () => {
      if (!equipmentId) return;
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(accreditationAddress, accreditationABI, provider);
        const result = await contract.getTestResultDetails(parseInt(equipmentId));
        setTestResult(result);
      } catch (err) {
        console.error('Failed to fetch test result:', err);
        setTestResult(null);
      }
    };
    fetchTestResult();
  }, [equipmentId]);

  const approveAccreditation = async () => {
    if (!equipmentId) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(accreditationAddress, accreditationABI, signer);
      const tx = await contract.makeAccreditationDecision(parseInt(equipmentId), 1);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Accreditation approved successfully!');
      setEquipmentId('');
      setTestResult(null);
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to approve accreditation.');
    }
  };

  const rejectAccreditation = async () => {
    if (!equipmentId) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(accreditationAddress, accreditationABI, signer);
      const tx = await contract.makeAccreditationDecision(parseInt(equipmentId), 2);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('❌ Accreditation denied successfully!');
      setEquipmentId('');
      setTestResult(null);
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to deny accreditation.');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Make Accreditation Decision</h3>

      <Label htmlFor="equipmentId">Equipment ID</Label>
      <Input
        id="equipmentId"
        placeholder="e.g. 1"
        value={equipmentId}
        onChange={(e) => setEquipmentId(e.target.value)}
      />

      {testResult && (
        <div className="bg-gray-100 p-4 rounded mt-4 text-sm">
          <p><strong>Equipment ID:</strong> {testResult[0].toString()}</p>
          <p><strong>CAB Address:</strong> {testResult[1]}</p>
          <p><strong>Test Result IPFS Hash:</strong> {testResult[2]}</p>
          <p><strong>Status Code:</strong> {testResult[3]}</p>
        </div>
      )}

      <div className="flex space-x-4">
        <Button onClick={approveAccreditation} variant="default">
          ✅ Approve
        </Button>
        <Button onClick={rejectAccreditation} variant="destructive">
          ❌ Deny
        </Button>
      </div>

      {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
    </div>
  );
}
