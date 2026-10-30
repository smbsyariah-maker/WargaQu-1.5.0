import React, { useState, useEffect } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { WargaDashboard } from './components/warga/WargaDashboard';
import { EmptyModuleView } from './components/warga/EmptyModuleView';
import { UsahaQuView } from './components/usahaqu/UsahaQuView';
import { RtQuView } from './components/rtqu/RtQuView';

import {
  TableItem,
  MenuItem,
  Order,
  Ingredient,
  RestaurantProfile,
  PrinterConfig
} from './types';
import { StorageService } from './services/storage';

type AppScreen = 'warga' | 'rtqu' | 'usahaqu' | 'empty_module';

export default function App() {
  // Screen Navigation State
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('warga');
  const [selectedEmptyModule, setSelectedEmptyModule] = useState<string>('siagaqu');

  // Core POS Data States (Persisted for UsahaQu / Bakso Qu)
  const [tables, setTables] = useState<TableItem[]>([]);
  const [menuList, setMenuList] = useState<MenuItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [history, setHistory] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Record<string, Order>>({});
  const [profile, setProfile] = useState<RestaurantProfile>(StorageService.getProfile());
  const [printerConfig, setPrinterConfig] = useState<PrinterConfig>(StorageService.getPrinterConfig());

  // Global Toast Notification State
  const [notification, setNotification] = useState<string | null>(null);

  // Initial Data Load
  useEffect(() => {
    setTables(StorageService.getTables());
    setMenuList(StorageService.getMenu());
    setIngredients(StorageService.getIngredients());
    setHistory(StorageService.getHistory());
    setActiveOrders(StorageService.getActiveOrders());
    setProfile(StorageService.getProfile());
    setPrinterConfig(StorageService.getPrinterConfig());
  }, []);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const handleOpenRtQu = () => {
    setCurrentScreen('rtqu');
  };

  const handleOpenUsahaQu = () => {
    setCurrentScreen('usahaqu');
    showNotification('Membuka UsahaQu: POS Kasir & Restoran Bakso Qu');
  };

  const handleOpenEmptyModule = (moduleId: string) => {
    setSelectedEmptyModule(moduleId);
    setCurrentScreen('empty_module');
  };

  const handleBackToWarga = () => {
    setCurrentScreen('warga');
  };

  const activeOrderCount = Object.keys(activeOrders).length;

  return (
    <AndroidFrame>
      {/* Pop-up Notification Toast across views */}
      {notification && (
        <div className="absolute top-12 left-4 right-4 z-50 bg-emerald-950/95 text-[#5eead4] px-4 py-2 rounded-2xl shadow-xl border border-emerald-500/40 text-xs font-semibold flex items-center justify-between animate-in fade-in slide-in-from-top duration-200">
          <span>{notification}</span>
        </div>
      )}

      {/* Screen 1: WargaQu Mobile App Dashboard */}
      {currentScreen === 'warga' && (
        <WargaDashboard
          onOpenRtQu={handleOpenRtQu}
          onOpenUsahaQu={handleOpenUsahaQu}
          onOpenEmptyModule={handleOpenEmptyModule}
          activeOrderCount={activeOrderCount}
        />
      )}

      {/* Screen 2: Modul RtQu (Pengurusan RT 03 / RW 05) */}
      {currentScreen === 'rtqu' && (
        <RtQuView
          onBackToMain={handleBackToWarga}
          onOpenUsahaQu={handleOpenUsahaQu}
          showNotification={showNotification}
        />
      )}

      {/* Screen 3: UsahaQu (Bakso Qu 1.0 POS Kasir & Restoran) */}
      {currentScreen === 'usahaqu' && (
        <UsahaQuView
          onBackToWarga={handleBackToWarga}
          tables={tables}
          setTables={setTables}
          menuList={menuList}
          setMenuList={setMenuList}
          ingredients={ingredients}
          setIngredients={setIngredients}
          history={history}
          setHistory={setHistory}
          activeOrders={activeOrders}
          setActiveOrders={setActiveOrders}
          profile={profile}
          setProfile={setProfile}
          printerConfig={printerConfig}
          setPrinterConfig={setPrinterConfig}
          showNotification={showNotification}
        />
      )}

      {/* Screen 4: Empty Modules (SiagaQu, AreaQu, MuamalahQu, ChatQu, Setting, etc.) */}
      {currentScreen === 'empty_module' && (
        <EmptyModuleView
          moduleId={selectedEmptyModule}
          onBack={handleBackToWarga}
          onOpenUsahaQu={handleOpenUsahaQu}
        />
      )}
    </AndroidFrame>
  );
}
