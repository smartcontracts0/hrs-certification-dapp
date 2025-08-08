'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import DashboardShell from '@/components/layout/DashboardShell';
import UploadCABDetailsTab from './tabs/UploadCABDetailsTab';
import BiddingTab from './tabs/BiddingTab';
import SubmitTestResultsTab from './tabs/SubmitTestResultsTab';
import SubmitAuditTab from './tabs/SubmitAuditTab';
import ViewEquipmentTestingStatusTab from './tabs/ViewEquipmentTestingStatusTab';

export default function CABDashboard() {
  const [tab, setTab] = useState('details');

  return (
    <DashboardShell>
      <h2 className="text-2xl font-bold mb-4">CAB Dashboard</h2>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        {/* Row 1 */}
        <TabsList className="flex gap-2 p-2 bg-white border border-gray-300 rounded-md mb-2">
          <TabsTrigger
            value="details"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Update CAB Details
          </TabsTrigger>
          <TabsTrigger
            value="bidding"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            View & Bid on Auctions
          </TabsTrigger>
          <TabsTrigger
            value="results"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Submit Test Results
          </TabsTrigger>
        </TabsList>

        {/* Row 2 */}
        <TabsList className="flex gap-2 p-2 bg-white border border-gray-300 rounded-md mb-6">
          <TabsTrigger
            value="audit"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Submit Audit Record
          </TabsTrigger>
          <TabsTrigger
            value="activity"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            View My Activity
          </TabsTrigger>
          <div className="flex-1" /> {/* Empty spacer to balance row layout */}
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
          <ViewEquipmentTestingStatusTab />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
