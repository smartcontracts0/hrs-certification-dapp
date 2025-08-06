'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DashboardShell from '@/components/layout/DashboardShell';
import UploadCABDetailsTab from './tabs/UploadCABDetailsTab';
import BiddingTab from './tabs/BiddingTab';
import SubmitTestResultsTab from './tabs/SubmitTestResultsTab';
import SubmitAuditTab from './tabs/SubmitAuditTab';
import ViewCABActivityTab from './tabs/ViewCABActivityTab';

export default function CABDashboard() {
  const [tab, setTab] = useState('details');

  return (
    <DashboardShell>
      <h2 className="text-2xl font-bold mb-4">CAB Dashboard</h2>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="details">Update CAB Details</TabsTrigger>
          <TabsTrigger value="bidding">View & Bid on Auctions</TabsTrigger>
          <TabsTrigger value="results">Submit Test Results</TabsTrigger>
          <TabsTrigger value="audit">Submit Audit Record</TabsTrigger>
          <TabsTrigger value="activity">View My Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <UploadCABDetailsTab />
        </TabsContent>

        <TabsContent value="bidding">
          <BiddingTab />
        </TabsContent>

        <TabsContent value="results">
          <SubmitTestResultsTab />
        </TabsContent>

        <TabsContent value="audit">
          <SubmitAuditTab />
        </TabsContent>

        <TabsContent value="activity">
          <ViewCABActivityTab />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
