'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { accreditationABI, accreditationAddress } from '@/lib/contracts/accreditation';

export default function AccreditEquipmentTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [pendingList, setPendingList] = useState<number[]>([]);

  useEffect(() => {
    const fetchPendingEquipment = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(accreditationAddress, accreditationABI, provider);

        const results: number[] = [];
        const total = 50; // adjust as needed

        for (let i = 1; i <= total; i++) {
          try {
            const result = await contract.getTestResultDetails(i);
            if (result[3] === 0) {
              results.push(i);
            }
          } catch {
            // skip if no result exists
          }
        }

        setPendingList(results);
      } catch (err) {
        console.error('Failed to fetch pending equipment:', err);
      }
    };

    fetchPendingEquipment();
  }, []);

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

  const makeDecision = async (decision: number) => {
    if (!equipmentId) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(accreditationAddress, accreditationABI, signer);
      const tx = await contract.makeAccreditationDecision(parseInt(equipmentId), decision);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus(decision === 1 ? '✅ Accreditation approved successfully!' : '❌ Accreditation denied successfully!');
      setEquipmentId('');
      setTestResult(null);
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to submit decision.');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Make Accreditation Decision</h3>

      <Label htmlFor="equipmentId">Select Pending Equipment</Label>
      <select
        id="equipmentId"
        className="w-full p-2 border rounded"
        value={equipmentId}
        onChange={(e) => setEquipmentId(e.target.value)}
      >
        <option value="">-- Select Equipment --</option>
        {pendingList.map((id) => (
          <option key={id} value={id}>
            Equipment #{id}
          </option>
        ))}
      </select>

      {testResult && (
        <div className="bg-gray-100 p-4 rounded mt-4 text-sm">
          <p><strong>Equipment ID:</strong> {testResult[0].toString()}</p>
          <p><strong>CAB Address:</strong> {testResult[1]}</p>
          <p><strong>Test Result IPFS Hash:</strong> {testResult[2]}</p>
          <p><strong>Status Code:</strong> {testResult[3]}</p>
        </div>
      )}

      <div className="flex space-x-4">
        <Button onClick={() => makeDecision(1)} variant="default">
          ✅ Approve
        </Button>
        <Button onClick={() => makeDecision(2)} variant="destructive">
          ❌ Deny
        </Button>
      </div>

      {status && <p className="text-sm mt-2 text-gray-600">{status}</p>}
    </div>
  );
}
