'use client';

import { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import DashboardShell from '@/components/layout/DashboardShell';
import RegisterManufacturerTab from './tabs/RegisterManufacturerTab';
import RegisterCABTab from './tabs/RegisterCABTab';
import AccreditCABTab from './tabs/AccreditCABTab';
import ViewIABDataTab from './tabs/ViewIABDataTab';
import AccreditEquipmentTab from './tabs/AccreditEquipmentTab';
import ReviewAccreditationTab from './tabs/ReviewAccreditationTab';
import RevokeAccreditationTab from './tabs/RevokeAccreditationTab';
import UpdateAccreditationTab from './tabs/UpdateAccreditationTab';

export default function IABDashboard() {
  const [tab, setTab] = useState('register-manufacturer');

  return (
    <DashboardShell>
      <h2 className="text-2xl font-bold mb-4">IAB Dashboard</h2>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        {/* Row 1 */}
        <TabsList className="flex gap-2 p-2 bg-white border border-gray-300 rounded-md mb-2">
          <TabsTrigger
            value="register-manufacturer"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Register Manufacturer
          </TabsTrigger>
          <TabsTrigger
            value="register-cab"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Register CAB
          </TabsTrigger>
          <TabsTrigger
            value="accredit-cab"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Accredit CAB
          </TabsTrigger>
          <TabsTrigger
            value="accredit-equipment"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Accredit Equipment
          </TabsTrigger>
        </TabsList>

        {/* Row 2 */}
        <TabsList className="flex gap-2 p-2 bg-white border border-gray-300 rounded-md mb-6">
          <TabsTrigger
            value="update-accreditation"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Update Accreditation
          </TabsTrigger>
          <TabsTrigger
            value="revoke-accreditation"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Revoke Accreditation
          </TabsTrigger>
          <TabsTrigger
            value="view"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            View Registration Data
          </TabsTrigger>
          <TabsTrigger
            value="review-accreditation"
            className="flex-1 text-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 data-[state=active]:bg-black data-[state=active]:text-white transition"
          >
            Review Equipment Accreditation
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
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
        <TabsContent value="update-accreditation">
          <UpdateAccreditationTab />
        </TabsContent>
        <TabsContent value="revoke-accreditation">
          <RevokeAccreditationTab />
        </TabsContent>
        <TabsContent value="review-accreditation">
          <ReviewAccreditationTab />
        </TabsContent>
        <TabsContent value="view">
          <ViewIABDataTab />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
