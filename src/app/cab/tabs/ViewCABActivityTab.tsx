'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { accreditationAddress, accreditationABI } from '@/lib/contracts/accreditation';
import { certificationAddress, certificationABI } from '@/lib/contracts/certification';
import { biddingAddress, biddingABI } from '@/lib/contracts/bidding';

export default function ViewCABActivityTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [testResult, setTestResult] = useState<any | null>(null);
  const [certification, setCertification] = useState<any | null>(null);
  const [winningCAB, setWinningCAB] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const fetchActivity = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const acc = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const user = await signer.getAddress();

      const accreditation = new ethers.Contract(accreditationAddress, accreditationABI, provider);
      const certificationContract = new ethers.Contract(certificationAddress, certificationABI, provider);
      const bidding = new ethers.Contract(biddingAddress, biddingABI, provider);

      const testResult = await accreditation.getTestResultDetails(parseInt(equipmentId));
      const certification = await certificationContract.getCertificationRequestDetails(parseInt(equipmentId));
      const winning = await bidding.getWinningCAB(parseInt(equipmentId));

      setTestResult(testResult);
      setCertification(certification);
      setWinningCAB(winning);

      if (user.toLowerCase() !== testResult[1].toLowerCase()) {
        setStatus('⚠️ You are not the CAB that submitted the test result for this equipment.');
      } else {
        setStatus(null);
      }
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to fetch data. Ensure the equipment ID exists.');
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
        placeholder="e.g. 2"
      />
      <Button onClick={fetchActivity}>Fetch My Activity</Button>

      {status && <p className="text-sm text-red-500 mt-2">{status}</p>}

      {testResult && certification && (
        <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p><strong>Test Submitted By:</strong> {testResult[1]}</p>
          <p><strong>Test IPFS:</strong> {testResult[2]}</p>
          <p><strong>Accreditation Status:</strong> {['Pending', 'Approved', 'Denied'][testResult[3]]}</p>

          <p><strong>Certification Requested By:</strong> {certification[1]}</p>
          <p><strong>CAB Assigned:</strong> {certification[2]}</p>
          <p><strong>Certification Status:</strong> {['Pending', 'Approved', 'Denied'][certification[3]]}</p>

          <p><strong>Winning CAB:</strong> {winningCAB}</p>
        </div>
      )}
    </div>
  );
}
