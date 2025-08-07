'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import DashboardShell from '@/components/layout/DashboardShell';
import RegisterEquipmentTab from './tabs/RegisterEquipmentTab';
import CreateAuctionTab from './tabs/CreateAuctionTab';
import RequestCertificationTab from './tabs/RequestCertificationTab';
import ViewManufacturerEquipmentTab from './tabs/ViewManufacturerEquipmentTab';
import SelectBestBidTab from './tabs/SelectBestBidTab';

export default function ManufacturerDashboard() {
  const [tab, setTab] = useState('register');

  return (
    <DashboardShell>
      <h2 className="text-2xl font-bold mb-4">Manufacturer Dashboard</h2>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        {/* Row 1 */}
        <TabsList className="flex gap-2 p-2 bg-white border border-gray-300 rounded-md mb-2">
          <TabsTrigger
            value="register"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Register Equipment
          </TabsTrigger>
          <TabsTrigger
            value="auction"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Create Auction
          </TabsTrigger>
          <TabsTrigger
            value="certify"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Request Certification
          </TabsTrigger>
        </TabsList>

        {/* Row 2 */}
        <TabsList className="flex gap-2 p-2 bg-white border border-gray-300 rounded-md mb-6">
          <TabsTrigger
            value="view"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            View My Equipment
          </TabsTrigger>
          <TabsTrigger
            value="select"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Active Auctions
          </TabsTrigger>
          <div className="flex-1" /> {/* spacer for symmetry */}
        </TabsList>

        <TabsContent value="register">
          <RegisterEquipmentTab />
        </TabsContent>
        <TabsContent value="auction">
          <CreateAuctionTab />
        </TabsContent>
        <TabsContent value="certify">
          <RequestCertificationTab />
        </TabsContent>
        <TabsContent value="view">
          <ViewManufacturerEquipmentTab />
        </TabsContent>
        <TabsContent value="select">
          <SelectBestBidTab />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
