'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
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
        <TabsList>
          <TabsTrigger value="register">Register Equipment</TabsTrigger>
          <TabsTrigger value="auction">Create Auction</TabsTrigger>
          <TabsTrigger value="certify">Request Certification</TabsTrigger>
          <TabsTrigger value="view">View My Equipment</TabsTrigger>
          <TabsTrigger value="select">Active Auctions</TabsTrigger>
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
