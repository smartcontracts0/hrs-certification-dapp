'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { certificationAddress, certificationABI } from '@/lib/contracts/certification';

export default function ViewAuditLogTab() {
  const [equipmentId, setEquipmentId] = useState('');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const fetchAuditLog = async () => {
    setStatus(null);
    setAuditLogs([]);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(certificationAddress, certificationABI, provider);

      const logs = await contract.getAuditLog(parseInt(equipmentId));
      setAuditLogs(logs);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setStatus('❌ Failed to fetch audit logs. Check the equipment ID.');
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
        placeholder="e.g. 5"
      />
      <Button onClick={fetchAuditLog}>Fetch Audit Log</Button>

      {status && <p className="text-sm text-red-500">{status}</p>}

      {auditLogs.length > 0 && (
        <div className="mt-4 space-y-4">
          {auditLogs.map((log, index) => (
            <div key={index} className="border p-3 rounded text-sm">
              <p><strong>Auditor:</strong> {log.auditor}</p>
              <p><strong>Audit IPFS Hash:</strong> {log.ipfsHash}</p>
              <p><strong>Timestamp:</strong> {new Date(Number(log.timestamp) * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
