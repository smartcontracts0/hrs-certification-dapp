'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { certificationAddress, certificationABI } from '@/lib/contracts/certification';

export default function ReviewCertificationsTab() {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const fetchPendingRequests = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(certificationAddress, certificationABI, provider);

      const results = [];
      const maxCheck = 50;

      for (let i = 1; i <= maxCheck; i++) {
        try {
          const request = await contract.getCertificationRequestDetails(i);
          const certificationStatus = Number(request[3]); // ensure numeric comparison

          if (certificationStatus === 0) {
            results.push({
              id: Number(request[0]),
              manufacturer: request[1],
              cab: request[2],
              ipfsHash: request[4]
            });
          }
        } catch (err) {
          // silently ignore non-existent requests
          continue;
        }
      }

      setPendingRequests(results);
    } catch (err) {
      console.error('Error fetching certification requests:', err);
    }
  };

  const makeDecision = async (id: number, decision: number) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(certificationAddress, certificationABI, signer);

      const tx = await contract.makeCertificationDecision(id, decision);
      setStatus('Transaction sent...');
      await tx.wait();
      setStatus('✅ Certification decision made.');
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
      setStatus('❌ Failed to make decision.');
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="space-y-6">
      {pendingRequests.length === 0 ? (
        <p>No pending certification requests found.</p>
      ) : (
        pendingRequests.map((req) => (
          <div key={req.id} className="border p-4 rounded text-sm space-y-1">
            <p><strong>Equipment ID:</strong> {req.id}</p>
            <p><strong>Manufacturer:</strong> {req.manufacturer}</p>
            <p><strong>CAB:</strong> {req.cab}</p>
            <p><strong>Certification Request IPFS Hash:</strong> <a href={`https://ipfs.io/ipfs/${req.ipfsHash}`} className="text-blue-600 underline" target="_blank">{req.ipfsHash}</a></p>
            <div className="flex gap-4 mt-2">
              <Button onClick={() => makeDecision(req.id, 1)}>✅ Approve</Button>
              <Button onClick={() => makeDecision(req.id, 2)} variant="destructive">❌ Deny</Button>
            </div>
          </div>
        ))
      )}

      {status && <p className="text-sm mt-4 text-gray-600">{status}</p>}
    </div>
  );
}
