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
  const [cabDetails, setCabDetails] = useState<any | null>(null);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);

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
      setCabDetails(null);
    } catch (err) {
      console.error(err);
      setStatus('❌ Accreditation failed.');
    }
  };

  const fetchCABDetails = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(registrationAddress, registrationABI, provider);

      const details = await contract.getCABDetails(cabAddress);
      setCabDetails({
        name: details[0],
        address: details[1],
        ipfsHash: details[2],
        date: new Date(Number(details[3]) * 1000).toLocaleString(),
        accredited: details[4],
      });
      setSearchStatus(null);
    } catch (err) {
      console.error(err);
      setCabDetails(null);
      setSearchStatus('❌ No CAB found or address is not registered.');
    }
  };

  return (
    <div className="space-y-6">
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

        <Button onClick={accreditCAB}>
          {isAccredited ? 'Accredit' : 'Revoke'} CAB
        </Button>

        {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}
      </div>

      <div className="mt-6 space-y-2">
        <Button variant="outline" onClick={fetchCABDetails}>🔍 View CAB Details</Button>
        {searchStatus && <p className="text-sm text-red-500">{searchStatus}</p>}

        {cabDetails && (
          <div className="border p-4 rounded bg-gray-50 text-sm">
            <p><strong>Name:</strong> {cabDetails.name}</p>
            <p><strong>Address:</strong> {cabDetails.address}</p>
            <p><strong>IPFS Hash:</strong> {cabDetails.ipfsHash}</p>
            <p><strong>Registration Date:</strong> {cabDetails.date}</p>
            <p><strong>Accredited:</strong> {cabDetails.accredited ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
