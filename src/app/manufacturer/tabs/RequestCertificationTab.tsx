'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registrationAddress, registrationABI } from '@/lib/contracts/registration';
import { accreditationAddress, accreditationABI } from '@/lib/contracts/accreditation';
import { certificationAddress, certificationABI } from '@/lib/contracts/certification';

export default function RequestCertificationTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [cabAddress, setCabAddress] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [ownedEquipment, setOwnedEquipment] = useState<number[]>([]);

  const fetchOwnedEquipment = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const contract = new ethers.Contract(registrationAddress, registrationABI, provider);

      const total = await contract.equipmentCounter();
      const owned: number[] = [];

      for (let i = 1; i <= total; i++) {
        const [, manufacturer] = await contract.getEquipmentDetails(i);
        if (manufacturer.toLowerCase() === userAddress.toLowerCase()) {
          owned.push(i);
        }
      }

      setOwnedEquipment(owned);
    } catch (err) {
      console.error('Failed to fetch owned equipment:', err);
    }
  };

  const fetchWinningCAB = async (selectedId: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(accreditationAddress, accreditationABI, provider);

      const [, cab] = await contract.getTestResultDetails(parseInt(selectedId));
      setCabAddress(cab);
    } catch (err) {
      console.warn('Failed to fetch CAB address for selected equipment:', err);
      setCabAddress('');
    }
  };

  const requestCert = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(certificationAddress, certificationABI, signer);

      const tx = await contract.requestCertification(
        parseInt(equipmentId),
        cabAddress,
        ipfsHash
      );

      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Certification requested successfully!');
      setEquipmentId('');
      setCabAddress('');
      setIpfsHash('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to request certification.');
    }
  };

  useEffect(() => {
    fetchOwnedEquipment();
  }, []);

  useEffect(() => {
    if (equipmentId) {
      fetchWinningCAB(equipmentId);
    }
  }, [equipmentId]);

  return (
    <div className="space-y-4">
      <Label htmlFor="equipmentId">Your Equipment ID</Label>
      <select
        id="equipmentId"
        value={equipmentId}
        onChange={(e) => setEquipmentId(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Equipment</option>
        {ownedEquipment.map((id) => (
          <option key={id} value={id}>{id}</option>
        ))}
      </select>

      <Label htmlFor="cab">CAB Address (Auto-filled)</Label>
      <Input
        id="cab"
        value={cabAddress}
        readOnly
        placeholder="0xCAB..."
      />

      <Label htmlFor="ipfs">Certification IPFS Hash</Label>
      <Input
        id="ipfs"
        value={ipfsHash}
        onChange={(e) => setIpfsHash(e.target.value)}
        placeholder="Qm..."
      />

      <Button onClick={requestCert}>Submit Certification Request</Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
