'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DashboardShell from '@/components/layout/DashboardShell';
import ReviewCertificationTab from './tabs/ReviewCertificationsTab';
import RevokeCertificationTab from './tabs/RevokeCertificationsTab';
import ViewCertificationRequestsTab from './tabs/ViewCertificationRequestsTab';
import ViewAuditLogTab from './tabs/ViewAuditLogTab';

export default function LCADashboard() {
  const [tab, setTab] = useState('review');

  return (
    <DashboardShell>
      <h2 className="text-2xl font-bold mb-4">LCA Dashboard</h2>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="review">Review Certification Requests</TabsTrigger>
          <TabsTrigger value="revoke">Revoke Certification</TabsTrigger>
          <TabsTrigger value="view">View Certification Details</TabsTrigger>
          <TabsTrigger value="audit-log">View Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="review">
          <ReviewCertificationTab />
        </TabsContent>

        <TabsContent value="revoke">
          <RevokeCertificationTab />
        </TabsContent>

        <TabsContent value="view">
          <ViewCertificationRequestsTab />
        </TabsContent>

        
        <TabsContent value="audit-log">
        <ViewAuditLogTab />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
