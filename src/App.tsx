import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ExecutiveCockpit } from './components/ExecutiveCockpit';
import { BuffetVisionStation } from './components/BuffetVisionStation';
import { SilverwareBussingGuard } from './components/SilverwareBussingGuard';
import { WaiterPDA } from './components/WaiterPDA';
import { WaiterMobileApp } from './components/WaiterMobileApp';
import { KitchenESGDashboard } from './components/KitchenESGDashboard';
import { DishModelTraining } from './components/DishModelTraining';
import { 
  INITIAL_STATIONS, 
  INITIAL_ANOMALIES, 
  INITIAL_SILVERWARE_INTERCEPTS, 
  INITIAL_ESG_RECORDS, 
  INITIAL_GUESTS, 
  INITIAL_TABLES, 
  INITIAL_SYSTEM_STATS,
  INITIAL_DISH_MODELS
} from './data/initialData';
import { StationAnomaly, SystemStats, BuffetStation, SilverwareInterceptEvent, FoodWasteESGRecord, GuestProfile, TableItem, DishTrainingProfile } from './types';
import { playSuccessChime } from './utils/audio';

export default function App() {
  // Terminal Mode: 'control_center' (中控大屏系统) vs 'mobile_waiter' (服务员手机端入口)
  const [terminalMode, setTerminalMode] = useState<'control_center' | 'mobile_waiter'>('control_center');
  // 程序起点：机器学习菜品状态识别与训练工坊
  const [activeTab, setActiveTab] = useState<'cockpit' | 'buffet' | 'training' | 'silverware' | 'pda' | 'esg'>('training');
  const [pdaFloatingOpen, setPdaFloatingOpen] = useState<boolean>(false);
  const [audioMuted, setAudioMuted] = useState<boolean>(false);

  // Core Data States
  const [stations, setStations] = useState<BuffetStation[]>(INITIAL_STATIONS);
  const [anomalies, setAnomalies] = useState<StationAnomaly[]>(INITIAL_ANOMALIES);
  const [intercepts, setIntercepts] = useState<SilverwareInterceptEvent[]>(INITIAL_SILVERWARE_INTERCEPTS);
  const [esgRecords, setEsgRecords] = useState<FoodWasteESGRecord[]>(INITIAL_ESG_RECORDS);
  const [guests, setGuests] = useState<GuestProfile[]>(INITIAL_GUESTS);
  const [tables, setTables] = useState<TableItem[]>(INITIAL_TABLES);
  const [stats, setStats] = useState<SystemStats>(INITIAL_SYSTEM_STATS);
  const [dishModels, setDishModels] = useState<DishTrainingProfile[]>(INITIAL_DISH_MODELS);
  const [dispatchedAnomalies, setDispatchedAnomalies] = useState<StationAnomaly[]>([INITIAL_ANOMALIES[0]]);

  // Dispatch an anomaly from buffet camera or kitchen to PDA
  const handleDispatchToPda = (anomaly: StationAnomaly) => {
    if (!dispatchedAnomalies.some(a => a.id === anomaly.id)) {
      setDispatchedAnomalies(prev => [anomaly, ...prev]);
    }
    // Open floating PDA if on desktop in control center mode
    if (terminalMode === 'control_center' && window.innerWidth >= 1024) {
      setPdaFloatingOpen(true);
    }
  };

  // Resolve anomaly from PDA
  const handleResolveAnomaly = (id: string) => {
    setAnomalies(prev => prev.map(a => a.id === id ? {
      ...a,
      status: 'resolved',
      resolvedBy: '现场巡台服务员 (PDA #0842)',
      resolvedAt: new Date().toLocaleTimeString(),
      actionTaken: 'PDA工单联动：服务员已到场撤换污染盘与取餐夹，已完成复核销单。'
    } : a));

    setDispatchedAnomalies(prev => prev.filter(a => a.id !== id));
  };

  const activeAlertCount = anomalies.filter(a => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-slate-800 flex flex-col selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* Top Luxury Navigation with Terminal Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        terminalMode={terminalMode}
        setTerminalMode={setTerminalMode}
        pdaFloatingOpen={pdaFloatingOpen}
        setPdaFloatingOpen={setPdaFloatingOpen}
        audioMuted={audioMuted}
        setAudioMuted={setAudioMuted}
        stats={stats}
        activeAlertCount={activeAlertCount}
      />

      {/* Main Body Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* Terminal Mode 1: 服务员手机端入口 (Waiter Mobile Associate App) */}
        {terminalMode === 'mobile_waiter' ? (
          <div className="py-2">
            <WaiterMobileApp
              guests={guests}
              setGuests={setGuests}
              tables={tables}
              setTables={setTables}
              stations={stations}
              setStations={setStations}
              anomalies={anomalies}
              setAnomalies={setAnomalies}
              dispatchedAnomalies={dispatchedAnomalies}
              setDispatchedAnomalies={setDispatchedAnomalies}
              audioMuted={audioMuted}
              onBackToControlCenter={() => {
                setTerminalMode('control_center');
                setActiveTab('cockpit');
              }}
            />
          </div>
        ) : (
          /* Terminal Mode 2: 数字化中控系统 (Executive Central Control System) */
          <>
            {activeTab === 'cockpit' && (
              <ExecutiveCockpit
                stats={stats}
                anomalies={anomalies}
                stations={stations}
                intercepts={intercepts}
                onNavigateTab={setActiveTab}
                onOpenPda={() => {
                  setTerminalMode('mobile_waiter');
                  setActiveTab('pda');
                }}
              />
            )}

            {activeTab === 'buffet' && (
              <BuffetVisionStation
                stations={stations}
                setStations={setStations}
                anomalies={anomalies}
                setAnomalies={setAnomalies}
                audioMuted={audioMuted}
                onDispatchToPda={handleDispatchToPda}
              />
            )}

            {activeTab === 'training' && (
              <DishModelTraining
                stations={stations}
                dishModels={dishModels}
                setDishModels={setDishModels}
                audioMuted={audioMuted}
                onDeployToStation={(stId) => {
                  setActiveTab('buffet');
                }}
              />
            )}

            {activeTab === 'silverware' && (
              <SilverwareBussingGuard
                intercepts={intercepts}
                setIntercepts={setIntercepts}
                stats={stats}
                setStats={setStats}
                audioMuted={audioMuted}
              />
            )}

            {activeTab === 'pda' && (
              <div className="py-2">
                <WaiterMobileApp
                  guests={guests}
                  setGuests={setGuests}
                  tables={tables}
                  setTables={setTables}
                  stations={stations}
                  setStations={setStations}
                  anomalies={anomalies}
                  setAnomalies={setAnomalies}
                  dispatchedAnomalies={dispatchedAnomalies}
                  setDispatchedAnomalies={setDispatchedAnomalies}
                  audioMuted={audioMuted}
                  onBackToControlCenter={() => {
                    setTerminalMode('control_center');
                    setActiveTab('cockpit');
                  }}
                />
              </div>
            )}

            {activeTab === 'esg' && (
              <KitchenESGDashboard
                records={esgRecords}
                setRecords={setEsgRecords}
                stats={stats}
                audioMuted={audioMuted}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Side Phone Simulator (在中控大屏模式下可随时拉出手机查看协同) */}
      {pdaFloatingOpen && terminalMode === 'control_center' && (
        <aside className="fixed bottom-4 right-4 z-50 w-96 shadow-2xl animate-in slide-in-from-right-8 duration-300">
          <WaiterPDA
            guests={guests}
            setGuests={setGuests}
            tables={tables}
            setTables={setTables}
            dispatchedAnomalies={dispatchedAnomalies}
            setDispatchedAnomalies={setDispatchedAnomalies}
            onResolveAnomaly={handleResolveAnomaly}
            audioMuted={audioMuted}
            isFloating={true}
            onCloseFloating={() => setPdaFloatingOpen(false)}
          />
        </aside>
      )}

      {/* Luxury Hotel Footer */}
      <footer className="border-t border-emerald-100 bg-white/90 py-3.5 px-6 text-center text-xs text-slate-500 font-mono">
        BistroGuard AI · 喜来登酒店全日餐厅智能视觉与后厨防线 · 🖥️ 数字化中控系统 + 📱 服务员移动端作业闭环
      </footer>
    </div>
  );
}
