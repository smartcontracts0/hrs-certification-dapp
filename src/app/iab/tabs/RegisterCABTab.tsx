'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registrationABI, registrationAddress } from '@/lib/contracts/registration';

export default function RegisterCABTab() {
  const [cabName, setCabName] = useState('');
  const [cabAddress, setCabAddress] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const registerCAB = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(registrationAddress, registrationABI, signer);

      const tx = await contract.registerCAB(cabName, cabAddress);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ CAB registered successfully!');
      setCabName('');
      setCabAddress('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Registration failed.');
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="cabName">CAB Name</Label>
      <Input
        id="cabName"
        placeholder="CAB 1"
        value={cabName}
        onChange={(e) => setCabName(e.target.value)}
      />

      <Label htmlFor="cabAddress">CAB Address</Label>
      <Input
        id="cabAddress"
        placeholder="0x..."
        value={cabAddress}
        onChange={(e) => setCabAddress(e.target.value)}
      />

      <Button onClick={registerCAB}>Register CAB</Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
