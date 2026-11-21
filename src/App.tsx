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
import { StaffAuthModal } from './components/common/StaffAuthModal';

const DineOSApp: React.FC = () => {
  const { mainView, isStaffUnlocked } = useDineOS();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header: Automatically switches between clean Guest Header and Staff Console */}
      <HeaderNav />

      {/* Main View: Strictly locked to guest menu for customers scanning QR codes */}
      <div className="flex-1">
        {(!isStaffUnlocked || mainView === 'guest') && <GuestLayout />}
        {isStaffUnlocked && mainView === 'staff_kds' && <StaffKDS />}
        {isStaffUnlocked && mainView === 'staff_floor' && <StaffFloorMap />}
        {isStaffUnlocked && mainView === 'staff_overview' && <StaffOverview />}
      </div>

      {/* Global Staff Authentication Modal */}
      <StaffAuthModal />

      {/* Staff & Admin Only Modals */}
      {isStaffUnlocked && (
        <>
          <QRScannerModal />
          <AddDishModal />
          <RestaurantSetupModal />
        </>
      )}
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
