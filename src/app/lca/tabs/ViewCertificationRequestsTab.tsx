'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { certificationAddress, certificationABI } from '@/lib/contracts/certification';
import { accreditationAddress, accreditationABI } from '@/lib/contracts/accreditation';

export default function ViewCertificationRequestsTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [cert, setCert] = useState<any | null>(null);
  const [testResult, setTestResult] = useState<any | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const fetchDetails = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const certification = new ethers.Contract(certificationAddress, certificationABI, provider);
      const accreditation = new ethers.Contract(accreditationAddress, accreditationABI, provider);

      const certData = await certification.getCertificationRequestDetails(parseInt(equipmentId));
      const testData = await accreditation.getTestResultDetails(parseInt(equipmentId));

      setCert(certData);
      setTestResult(testData);
      setStatus(null);
    } catch (err) {
      console.error(err);
      setCert(null);
      setTestResult(null);
      setStatus('❌ Failed to retrieve certification or test data.');
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
      <Button onClick={fetchDetails}>Fetch Details</Button>

      {status && <p className="text-sm text-red-500 mt-2">{status}</p>}

      {cert && (
      <div className="mt-4 space-y-2 text-sm text-gray-700">
          <p><strong>Equipment ID:</strong> {equipmentId}</p> {/* Add this */}
          <p><strong>Manufacturer:</strong> {cert[1]}</p>
          <p><strong>CAB:</strong> {cert[2]}</p>
          <p><strong>Certification Status:</strong> {['Pending', 'Approved', 'Denied'][cert[3]]}</p>
          <p><strong>Certification Request IPFS Hash:</strong> {cert[4]}</p>
      </div>
      )}


      {testResult && (
        <div className="mt-6 space-y-2 text-sm text-gray-700">
          <p><strong>Tested By:</strong> {testResult[1]}</p>
          <p><strong>Test IPFS:</strong> {testResult[2]}</p>
          <p><strong>Accreditation Status:</strong> {['Pending', 'Approved', 'Denied'][testResult[3]]}</p>
        </div>
      )}
    </div>
  );
}
