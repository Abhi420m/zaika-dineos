import React from 'react';
import { DineOSProvider, useDineOS } from './context/DineOSContext';
import { HeaderNav } from './components/layout/HeaderNav';
import { GuestLayout } from './components/guest/GuestLayout';
import { StaffKDS } from './components/staff/StaffKDS';
import { StaffFloorMap } from './components/staff/StaffFloorMap';
import { StaffOverview } from './components/staff/StaffOverview';
import { QRScannerModal } from './components/common/QRScannerModal';
import { AddDishModal } from './components/common/AddDishModal';
import { RestaurantSetupModal } from './components/common/RestaurantSetupModal';

const DineOSApp: React.FC = () => {
  const { mainView } = useDineOS();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Universal App Header / Role Switcher */}
      <HeaderNav />

      {/* Main View Router */}
      <div className="flex-1">
        {mainView === 'guest' && <GuestLayout />}
        {mainView === 'staff_kds' && <StaffKDS />}
        {mainView === 'staff_floor' && <StaffFloorMap />}
        {mainView === 'staff_overview' && <StaffOverview />}
      </div>

      {/* Global Modals */}
      <QRScannerModal />
      <AddDishModal />
      <RestaurantSetupModal />
    </div>
  );
};

export default function App() {
  return (
    <DineOSProvider>
      <DineOSApp />
    </DineOSProvider>
  );
}
