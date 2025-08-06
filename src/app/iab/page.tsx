'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DashboardShell from '@/components/layout/DashboardShell';
import RegisterManufacturerTab from './tabs/RegisterManufacturerTab';
import RegisterCABTab from './tabs/RegisterCABTab';
import AccreditCABTab from './tabs/AccreditCABTab';
import ViewIABDataTab from './tabs/ViewIABDataTab';
import AccreditEquipmentTab from './tabs/AccreditEquipmentTab';

export default function IABDashboard() {
  const [tab, setTab] = useState('register-manufacturer');

  return (
    <DashboardShell>
      <h2 className="text-2xl font-bold mb-4">IAB Dashboard</h2>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList>
          <TabsTrigger value="register-manufacturer">Register Manufacturer</TabsTrigger>
          <TabsTrigger value="register-cab">Register CAB</TabsTrigger>
          <TabsTrigger value="accredit-cab">Accredit CAB</TabsTrigger>
          <TabsTrigger value="accredit-equipment">Accredit Equipment</TabsTrigger>
          <TabsTrigger value="view">View Registration Data</TabsTrigger>
        </TabsList>

        <TabsContent value="register-manufacturer">
          <RegisterManufacturerTab />
        </TabsContent>

        <TabsContent value="register-cab">
          <RegisterCABTab />
        </TabsContent>

        <TabsContent value="accredit-cab">
          <AccreditCABTab />
        </TabsContent>

        <TabsContent value="accredit-equipment">
          <AccreditEquipmentTab />
        </TabsContent>

        <TabsContent value="view">
          <ViewIABDataTab />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
