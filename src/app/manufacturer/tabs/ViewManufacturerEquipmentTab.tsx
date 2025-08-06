'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registrationABI, registrationAddress } from '@/lib/contracts/registration';
import { certificationABI, certificationAddress } from '@/lib/contracts/certification';
import { ethers } from 'ethers';

export default function ViewManufacturerEquipmentTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [equipmentData, setEquipmentData] = useState<any | null>(null);
  const [certData, setCertData] = useState<any | null>(null);
  const [error, setError] = useState('');

  const fetchDetails = async () => {
    setError('');
    setEquipmentData(null);
    setCertData(null);

    try {
      if (!window.ethereum) throw new Error('MetaMask not detected');
      const provider = new ethers.BrowserProvider(window.ethereum);

      const regContract = new ethers.Contract(registrationAddress, registrationABI, provider);
      const certContract = new ethers.Contract(certificationAddress, certificationABI, provider);

      // Fetch equipment
      const [type, manufacturer, ipfsHash, date] = await regContract.getEquipmentDetails(equipmentId);
      setEquipmentData({ type, manufacturer, ipfsHash, date });

      try {
        const [id, cab, certHash, status] = await certContract.getCertificationRequestDetails(equipmentId);
        setCertData({ id, cab, certHash, status });
      } catch (err) {
        console.warn('No certification found for this equipment.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch equipment or certification data.');
    }
  };

  return (
    <div className="space-y-4">
      <Label>Equipment ID</Label>
      <Input
        value={equipmentId}
        onChange={(e) => setEquipmentId(e.target.value)}
        placeholder="1"
        className="w-full max-w-sm"
      />
      <Button onClick={fetchDetails}>Fetch Equipment Info</Button>

      {error && <p className="text-red-600">❌ {error}</p>}

      {equipmentData && (
        <div className="mt-4 space-y-2">
          <h3 className="font-bold">Equipment Details</h3>
          <p>Type: {equipmentData.type}</p>
          <p>Manufacturer: {equipmentData.manufacturer}</p>
          <p>IPFS Hash: <a href={`https://ipfs.io/ipfs/${equipmentData.ipfsHash}`} target="_blank" className="text-blue-500 underline">{equipmentData.ipfsHash}</a></p>
          <p>Registered At: {new Date(Number(equipmentData.date) * 1000).toLocaleString()}</p>
        </div>
      )}

      {certData && (
        <div className="mt-4 space-y-2">
          <h3 className="font-bold">Certification Details</h3>
          <p>Status: {['Pending', 'Approved', 'Denied'][certData.status]}</p>
          <p>Certified By (CAB): {certData.cab}</p>
          <p>Certification Report: <a href={`https://ipfs.io/ipfs/${certData.certHash}`} target="_blank" className="text-blue-500 underline">{certData.certHash}</a></p>
        </div>
      )}
    </div>
  );
}
