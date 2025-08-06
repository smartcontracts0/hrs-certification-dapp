'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registrationABI, registrationAddress } from '@/lib/contracts/registration';

export default function RegisterManufacturerTab() {
  const [manufacturerAddress, setManufacturerAddress] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const registerManufacturer = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(registrationAddress, registrationABI, signer);

      const tx = await contract.registerManufacturer(manufacturerAddress);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Manufacturer registered successfully!');
      setManufacturerAddress('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Registration failed.');
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="manufacturer">Manufacturer Address</Label>
      <Input
        id="manufacturer"
        placeholder="0x..."
        value={manufacturerAddress}
        onChange={(e) => setManufacturerAddress(e.target.value)}
      />
      <Button onClick={registerManufacturer}>Register Manufacturer</Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
