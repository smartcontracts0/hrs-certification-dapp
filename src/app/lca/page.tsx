'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
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
        {/* Row 1 */}
        <TabsList className="flex gap-2 p-2 bg-white border border-gray-300 rounded-md mb-2">
          <TabsTrigger
            value="review"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Review Certification Requests
          </TabsTrigger>
          <TabsTrigger
            value="revoke"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Revoke Certification
          </TabsTrigger>
        </TabsList>

        {/* Row 2 */}
        <TabsList className="flex gap-2 p-2 bg-white border border-gray-300 rounded-md mb-6">
          <TabsTrigger
            value="view"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            View Certification Details
          </TabsTrigger>
          <TabsTrigger
            value="audit-log"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            View Audit Logs
          </TabsTrigger>
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
