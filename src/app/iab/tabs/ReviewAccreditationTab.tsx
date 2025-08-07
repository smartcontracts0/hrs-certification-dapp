'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { accreditationAddress, accreditationABI } from '@/lib/contracts/accreditation';

export default function ReviewAccreditationTab() {
  const [entries, setEntries] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(accreditationAddress, accreditationABI, provider);
      const max = 50; // Adjust based on expected range
      const resultList = [];

      for (let i = 1; i <= max; i++) {
        try {
          const [equipmentId, cab, ipfsHash, state] = await contract.getTestResultDetails(i);
          if (state === 0) {
            resultList.push({ equipmentId, cab, ipfsHash });
          }
        } catch {}
      }
      setEntries(resultList);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDecision = async (equipmentId: number, decision: number) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(accreditationAddress, accreditationABI, signer);
      const tx = await contract.makeAccreditationDecision(equipmentId, decision);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Decision submitted');
      fetchEntries();
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to submit decision.');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Pending Accreditation Requests</h3>
      {entries.length === 0 ? <p>No pending entries.</p> : entries.map((e) => (
        <div key={e.equipmentId} className="border p-4 rounded">
          <p><strong>Equipment ID:</strong> {e.equipmentId.toString()}</p>
          <p><strong>CAB Address:</strong> {e.cab}</p>
          <p><strong>Test Results IPFS Hash:</strong> {e.ipfsHash}</p>
          <div className="flex gap-4 mt-2">
            <Button onClick={() => handleDecision(e.equipmentId, 1)}>✅ Approve</Button>
            <Button onClick={() => handleDecision(e.equipmentId, 2)} variant="destructive">❌ Deny</Button>
          </div>
        </div>
      ))}
      {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
    </div>
  );
}
