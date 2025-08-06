'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { registrationABI, registrationAddress } from '@/lib/contracts/registration';

export default function AccreditCABTab() {
  const [cabAddress, setCabAddress] = useState('');
  const [isAccredited, setIsAccredited] = useState(true);
  const [status, setStatus] = useState<string | null>(null);

  const accreditCAB = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(registrationAddress, registrationABI, signer);

      const tx = await contract.accreditCAB(cabAddress, isAccredited);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus(`✅ CAB ${isAccredited ? 'accredited' : 'revoked'} successfully!`);
      setCabAddress('');
    } catch (err) {
      console.error(err);
      setStatus('❌ Accreditation failed.');
    }
  };

  return (
    <div className="space-y-4">
      <Label htmlFor="cabAddress">CAB Address</Label>
      <Input
        id="cabAddress"
        placeholder="0x..."
        value={cabAddress}
        onChange={(e) => setCabAddress(e.target.value)}
      />

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isAccredited}
          onChange={() => setIsAccredited(!isAccredited)}
          id="accredit"
        />
        <Label htmlFor="accredit">
          {isAccredited ? 'Accredit CAB' : 'Revoke Accreditation'}
        </Label>
      </div>

      <Button onClick={accreditCAB}>{isAccredited ? 'Accredit' : 'Revoke'} CAB</Button>
      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
    </div>
  );
}
