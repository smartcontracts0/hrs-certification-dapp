'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registrationAddress, registrationABI } from '@/lib/contracts/registration';

export default function ViewIABDataTab() {
  const [addressInput, setAddressInput] = useState('');
  const [equipmentId, setEquipmentId] = useState('');
  const [cabDetails, setCabDetails] = useState<any | null>(null);
  const [equipmentDetails, setEquipmentDetails] = useState<any | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const fetchCABDetails = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const registration = new ethers.Contract(registrationAddress, registrationABI, provider);
      const details = await registration.getCABDetails(addressInput);
      setCabDetails(details);
      setStatus(null);
    } catch (err) {
      console.error(err);
      setCabDetails(null);
      setStatus('❌ Could not retrieve CAB details.');
    }
  };

  const fetchEquipmentDetails = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const registration = new ethers.Contract(registrationAddress, registrationABI, provider);
      const details = await registration.getEquipmentDetails(parseInt(equipmentId));
      setEquipmentDetails(details);
      setStatus(null);
    } catch (err) {
      console.error(err);
      setEquipmentDetails(null);
      setStatus('❌ Could not retrieve equipment details.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label htmlFor="cab-address">CAB Address</Label>
        <Input
          id="cab-address"
          value={addressInput}
          onChange={(e) => setAddressInput(e.target.value)}
          placeholder="0x..."
        />
        <Button onClick={fetchCABDetails}>Fetch CAB Details</Button>

        {cabDetails && (
          <div className="text-sm text-gray-700 mt-2 space-y-1">
            <p><strong>Name:</strong> {cabDetails[0]}</p>
            <p><strong>IPFS Hash:</strong> {cabDetails[2]}</p>
            <p><strong>Date:</strong> {new Date(Number(cabDetails[3]) * 1000).toLocaleString()}</p>
            <p><strong>Accredited:</strong> {cabDetails[4] ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Label htmlFor="equipmentId">Equipment ID</Label>
        <Input
          id="equipmentId"
          type="number"
          value={equipmentId}
          onChange={(e) => setEquipmentId(e.target.value)}
          placeholder="e.g. 1"
        />
        <Button onClick={fetchEquipmentDetails}>Fetch Equipment Details</Button>

        {equipmentDetails && (
          <div className="text-sm text-gray-700 mt-2 space-y-1">
            <p><strong>Equipment Type:</strong> {['MicroChannelHeatExchanger', 'ReciprocatingCompressor'][equipmentDetails[0]]}</p>
            <p><strong>Manufacturer:</strong> {equipmentDetails[1]}</p>
            <p><strong>IPFS Hash:</strong> {equipmentDetails[2]}</p>
            <p><strong>Registered On:</strong> {new Date(Number(equipmentDetails[3]) * 1000).toLocaleString()}</p>
          </div>
        )}
      </div>

      {status && <p className="text-sm text-red-500 mt-4">{status}</p>}
    </div>
  );
}
