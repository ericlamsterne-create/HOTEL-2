import React, { useState } from 'react';
import { 
  Smartphone, 
  Search, 
  CreditCard, 
  AlertOctagon, 
  CheckCircle2, 
  Plus, 
  Utensils, 
  ShieldAlert, 
  UserCheck, 
  Receipt, 
  X, 
  Wifi, 
  Battery, 
  Sparkles, 
  Tag, 
  Send, 
  RotateCcw,
  Check,
  FileText,
  Clock,
  Camera,
  Bell,
  RefreshCw,
  QrCode,
  Sliders,
  ChevronRight,
  Maximize2,
  Minimize2,
  Layers,
  Flame,
  Droplet,
  Sprout
} from 'lucide-react';
import { GuestProfile, TableItem, StationAnomaly, BuffetStation } from '../types';
import { playScanBeep, playSuccessChime, playAlertSiren } from '../utils/audio';

interface WaiterMobileAppProps {
  guests: GuestProfile[];
  setGuests: React.Dispatch<React.SetStateAction<GuestProfile[]>>;
  tables: TableItem[];
  setTables: React.Dispatch<React.SetStateAction<TableItem[]>>;
  stations: BuffetStation[];
  setStations: React.Dispatch<React.SetStateAction<BuffetStation[]>>;
  anomalies: StationAnomaly[];
  setAnomalies: React.Dispatch<React.SetStateAction<StationAnomaly[]>>;
  dispatchedAnomalies: StationAnomaly[];
  setDispatchedAnomalies: React.Dispatch<React.SetStateAction<StationAnomaly[]>>;
  audioMuted: boolean;
  onBackToControlCenter?: () => void;
}

export const WaiterMobileApp: React.FC<WaiterMobileAppProps> = ({
  guests,
  setGuests,
  tables,
  setTables,
  stations,
  setStations,
  anomalies,
  setAnomalies,
  dispatchedAnomalies,
  setDispatchedAnomalies,
  audioMuted,
  onBackToControlCenter
}) => {
  // Mobile device frame styling: 'iphone' | 'industrial_pda' | 'fullscreen'
  const [deviceSkin, setDeviceSkin] = useState<'iphone' | 'industrial_pda' | 'fullscreen'>('iphone');
  // Bottom tabs: 'reception' | 'safety' | 'tables' | 'guests'
  const [activeTab, setActiveTab] = useState<'reception' | 'safety' | 'tables' | 'guests'>('reception');
  
  // Selected guest & search
  const [selectedRoom, setSelectedRoom] = useState<string>('8812');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [customTagInput, setCustomTagInput] = useState<string>('');
  
  // Modals & States
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [activeChargeTable, setActiveChargeTable] = useState<TableItem | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3200);
  };

  const currentGuest = guests.find(g => g.roomNumber === selectedRoom) || guests[0];
  const activeAnomalies = anomalies.filter(a => a.status === 'active');
  const topCriticalAlert = activeAnomalies[0];

  // 1. Breakfast Check-in
  const handleCheckIn = (count: number = 1) => {
    if (!audioMuted) playScanBeep();
    setGuests(prev => prev.map(g => g.roomNumber === currentGuest.roomNumber ? {
      ...g,
      breakfastConsumedToday: g.breakfastConsumedToday + count
    } : g));
    showToast(`✅ [${currentGuest.roomNumber}] 成功核销早餐 ${count} 位`);
  };

  // 2. Extra Charge to Room
  const handleChargeRoomBreakfast = () => {
    if (!audioMuted) playSuccessChime();
    setGuests(prev => prev.map(g => g.roomNumber === currentGuest.roomNumber ? {
      ...g,
      totalBillRoom: g.totalBillRoom + 298,
      breakfastConsumedToday: g.breakfastConsumedToday + 1
    } : g));
    showToast(`💳 早餐挂房账 ¥298 成功 (客房 #${currentGuest.roomNumber})`);
  };

  // 3. Add Dietary Tag
  const handleAddTag = (text?: string) => {
    const tag = text || customTagInput.trim();
    if (!tag) return;
    if (!audioMuted) playSuccessChime();

    setGuests(prev => prev.map(g => {
      if (g.roomNumber === currentGuest.roomNumber) {
        if (g.customPreferences.includes(tag)) return g;
        return { ...g, customPreferences: [...g.customPreferences, tag] };
      }
      return g;
    }));
    setCustomTagInput('');
    showToast(`🏷️ 已为 ${currentGuest.guestName} 新增口味标签: "${tag}"`);
  };

  // 4. One-click Replace Tray from mobile
  const handleMobileReplaceTray = (stationId: string) => {
    if (!audioMuted) playSuccessChime();
    setStations(prev => prev.map(s => s.id === stationId ? {
      ...s,
      freshnessIndex: 99,
      deltaE: 0.5,
      oxidationStatus: 'fresh',
      trayLastReplaced: '服务员手机端刚刚换盘'
    } : s));

    setAnomalies(prev => prev.map(a => a.stationId === stationId ? {
      ...a,
      status: 'resolved',
      resolvedBy: '移动服务员 (0842号)',
      resolvedAt: new Date().toLocaleTimeString(),
      actionTaken: '移动端一键换盘与无菌扫描通过。'
    } : a));

    setDispatchedAnomalies(prev => prev.filter(a => a.stationId !== stationId));
    showToast(`✅ 档口换盘指令完成！新备盘已上架。`);
  };

  // 5. Settle Table Charge
  const handleSettleTable = () => {
    if (!activeChargeTable) return;
    if (!audioMuted) playSuccessChime();
    const amt = activeChargeTable.orderTotal || 0;
    const rm = activeChargeTable.guestRoom || currentGuest.roomNumber;

    setGuests(prev => prev.map(g => g.roomNumber === rm ? {
      ...g,
      totalBillRoom: g.totalBillRoom + amt
    } : g));

    setTables(prev => prev.map(t => t.id === activeChargeTable.id ? {
      ...t,
      status: 'needs_bussing',
      orderTotal: 0
    } : t));

    showToast(`💳 台位 ${activeChargeTable.tableNumber} 账单 ¥${amt} 已挂入房账 #${rm}`);
    setActiveChargeTable(null);
  };

  // Scanner Simulation Trigger
  const triggerScanSimulation = () => {
    setIsScannerOpen(true);
    setTimeout(() => {
      if (!audioMuted) playScanBeep();
      setIsScannerOpen(false);
      showToast('📡 模拟扫描住客房卡成功：自动识别房号 #8812');
      setSelectedRoom('8812');
    }, 1600);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-2">
      {/* Top Mobile Viewport Control & Switching Bar (Fresh theme) */}
      <div className="w-full max-w-xl flex items-center justify-between gap-2 mb-4 px-2">
        <div className="flex items-center gap-2">
          {onBackToControlCenter && (
            <button
              onClick={onBackToControlCenter}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <span>&larr; 返回中控大屏</span>
            </button>
          )}
          <span className="text-xs font-bold text-slate-800 font-serif hidden sm:inline">
            服务员随身手机端 (Sheraton Associate App)
          </span>
        </div>

        {/* Skin Selector */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-emerald-200 text-xs shadow-2xs">
          <button
            onClick={() => setDeviceSkin('iphone')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              deviceSkin === 'iphone' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            iPhone 旗舰版
          </button>
          <button
            onClick={() => setDeviceSkin('industrial_pda')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              deviceSkin === 'industrial_pda' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            防摔手持 PDA
          </button>
          <button
            onClick={() => setDeviceSkin('fullscreen')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
              deviceSkin === 'fullscreen' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            全屏移动视图
          </button>
        </div>
      </div>

      {/* Outer Device Container (Light / Fresh Botanical Elegance) */}
      <div className={`relative transition-all duration-300 ${
        deviceSkin === 'fullscreen' 
          ? 'w-full max-w-xl' 
          : deviceSkin === 'industrial_pda'
            ? 'w-[390px] border-[10px] border-emerald-950 rounded-[34px] p-2 bg-emerald-900 shadow-2xl ring-4 ring-emerald-600/30'
            : 'w-[390px] border-[10px] border-slate-300 rounded-[50px] p-2.5 bg-slate-200 shadow-2xl ring-4 ring-emerald-200/50'
      }`}>
        {/* Device Speaker / Dynamic Island on iPhone Skin */}
        {deviceSkin === 'iphone' && (
          <div className="absolute top-4 inset-x-0 mx-auto w-24 h-4 bg-slate-800 rounded-full z-40 flex items-center justify-center">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></span>
          </div>
        )}

        {/* Industrial PDA Laser Scanner Head */}
        {deviceSkin === 'industrial_pda' && (
          <div className="mb-2 bg-emerald-950 border border-emerald-700 py-1 px-3 rounded-lg text-center flex items-center justify-between text-[10px] font-mono text-emerald-300">
            <span>ZEBRA 2D LASER SCANNER</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
        )}

        {/* Phone Screen Canvas (Fresh Light Theme) */}
        <div className="w-full bg-[#f7faf7] text-slate-800 rounded-[36px] overflow-hidden flex flex-col h-[740px] relative shadow-inner border border-emerald-100">
          
          {/* 1. Phone Top Status Bar */}
          <div className="px-5 pt-3 pb-1 flex items-center justify-between text-[11px] font-medium text-slate-600 select-none z-30">
            <span className="font-bold">08:45</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono bg-emerald-100/80 text-emerald-800 px-1.5 py-0.2 rounded font-bold">5G HOTEL-NET</span>
              <Wifi className="w-3.5 h-3.5 text-slate-700" />
              <Battery className="w-4 h-4 text-emerald-700" />
            </div>
          </div>

          {/* 2. Top Hotel Associate Identification Header */}
          <div className="px-4 py-2.5 bg-white border-b border-emerald-100 flex items-center justify-between shadow-2xs z-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                晓丽
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-slate-900">陈晓丽</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                    0842 · 迎宾巡台
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 block">喜来登全日餐厅 · 早餐高峰档</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={triggerScanSimulation}
                className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="刷卡扫码"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3. Floating Food Safety Alert Push Banner (If any active) */}
          {topCriticalAlert && (
            <div 
              onClick={() => setActiveTab('safety')}
              className="mx-3 my-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-2 shadow-sm cursor-pointer hover:bg-rose-100/70 transition-colors animate-in fade-in"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0"></span>
                <div className="truncate text-xs">
                  <span className="font-bold">档口警报: </span>
                  <span className="text-slate-700">{topCriticalAlert.title}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-rose-700 underline shrink-0">
                立即前往 &rarr;
              </span>
            </div>
          )}

          {/* 4. Tab Content Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            
            {/* TAB 1: 迎宾核销 (Breakfast Check-In & Bill to Room) */}
            {activeTab === 'reception' && (
              <div className="space-y-3">
                {/* Search / Scan Bar */}
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="搜索房号 / 姓名 (例: 8812)..."
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
                    />
                  </div>
                  <button
                    onClick={triggerScanSimulation}
                    className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Camera className="w-3 h-3" />
                    <span>扫房卡</span>
                  </button>
                </div>

                {/* Current Selected Guest Card */}
                <div className="bg-white border-2 border-emerald-200/80 rounded-2xl p-3.5 shadow-xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-lg font-bold font-mono text-slate-900">
                          #{currentGuest.roomNumber}
                        </span>
                        <span className="text-sm font-bold text-slate-800 font-serif">
                          {currentGuest.guestName}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {currentGuest.membershipTier} · {currentGuest.roomType}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        房账已记: ¥{currentGuest.totalBillRoom}
                      </span>
                    </div>
                  </div>

                  {/* Breakfast Quota & Anti-Creep Status */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block text-[10px]">房型包早额度</span>
                      <span className="font-bold text-slate-800">
                        {currentGuest.breakfastIncludedCount} 位 / 日
                      </span>
                    </div>

                    <div className="text-center">
                      <span className="text-slate-500 block text-[10px]">今日已入场核销</span>
                      <span className="font-bold text-emerald-800 font-mono">
                        {currentGuest.breakfastConsumedToday} 人次
                      </span>
                    </div>

                    <div className="text-right">
                      {currentGuest.breakfastConsumedToday >= currentGuest.breakfastIncludedCount ? (
                        <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] block">
                          ⚠️ 已超额包早
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] block">
                          额度充足
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dietary Redline & Allergies Warning Box */}
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-rose-800 font-bold text-[11px]">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>住客禁忌红线 (请服务员提前指引):</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentGuest.dietaryRestrictions.map((d, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200 font-bold text-[10px]">
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Custom Preferences & Tags */}
                  <div className="text-xs space-y-1.5">
                    <span className="text-[11px] text-slate-500 font-medium">现场个性化口味备注:</span>
                    <div className="flex flex-wrap gap-1">
                      {currentGuest.customPreferences.map((pref, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium flex items-center gap-1">
                          <span>{pref}</span>
                        </span>
                      ))}
                    </div>

                    {/* Quick Add Tag Suggestions */}
                    <div className="flex items-center gap-1 pt-1 overflow-x-auto">
                      <span className="text-[10px] text-slate-400 shrink-0">快捷:</span>
                      {['常温柠檬水', '靠窗位', '美式配燕麦奶', '孕妇需全熟'].map((t, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddTag(t)}
                          className="px-2 py-0.5 rounded bg-white hover:bg-emerald-50 text-slate-600 border border-emerald-100 text-[10px] whitespace-nowrap cursor-pointer"
                        >
                          + {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Operational Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleCheckIn(1)}
                      className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>正常包早核销 (1位)</span>
                    </button>

                    <button
                      onClick={handleChargeRoomBreakfast}
                      className="py-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>超额挂房账 (¥298)</span>
                    </button>
                  </div>
                </div>

                {/* Quick Switch to other resident rooms */}
                <div className="space-y-1.5">
                  <span className="text-[11px] text-slate-500 font-medium">快速切换其他在住住客:</span>
                  <div className="space-y-1.5">
                    {guests.filter(g => g.roomNumber !== currentGuest.roomNumber).map(g => (
                      <div
                        key={g.roomNumber}
                        onClick={() => setSelectedRoom(g.roomNumber)}
                        className="p-2.5 rounded-xl bg-white hover:bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs cursor-pointer transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-slate-800">#{g.roomNumber}</span>
                          <span className="font-medium text-slate-700">{g.guestName}</span>
                          <span className="text-[10px] text-slate-400">({g.membershipTier})</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 font-bold">
                          {g.breakfastConsumedToday}/{g.breakfastIncludedCount} 位
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 食安巡检 (Food Safety & One-Click Tray Replace) */}
            {activeTab === 'safety' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 font-serif">
                    餐台实时保鲜巡检 (5 大档口)
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                    双目 4K 实时联动
                  </span>
                </div>

                <div className="space-y-2.5">
                  {stations.map(st => {
                    const relatedAnomalies = activeAnomalies.filter(a => a.stationId === st.id);
                    const hasAnom = relatedAnomalies.length > 0;

                    return (
                      <div
                        key={st.id}
                        className={`p-3 rounded-xl border transition-all ${
                          hasAnom 
                            ? 'bg-rose-50/70 border-rose-300 shadow-sm' 
                            : 'bg-white border-emerald-100 shadow-2xs'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`w-2 h-2 rounded-full ${hasAnom ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                              <span className="font-bold text-xs text-slate-900 font-serif">{st.name}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              温控 {st.temperature}°C · 保鲜 {st.freshnessIndex}% · 色差 ΔE={st.deltaE}
                            </div>
                          </div>

                          <button
                            onClick={() => handleMobileReplaceTray(st.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>一键换盘</span>
                          </button>
                        </div>

                        {/* Anomaly Callout if any */}
                        {hasAnom && (
                          <div className="mt-2 pt-2 border-t border-rose-200/80 space-y-1.5">
                            {relatedAnomalies.map(anm => (
                              <div key={anm.id} className="text-[11px] text-rose-800">
                                <div className="font-bold">{anm.title}</div>
                                <div className="text-slate-600 text-[10px] mt-0.5">{anm.description}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: 散点台位 (Table Status & Charge to Room) */}
            {activeTab === 'tables' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 font-serif">
                    餐厅散点台位网格看板
                  </span>
                  <span className="text-[10px] text-slate-500">
                    空闲 {tables.filter(t => t.status === 'available').length} / 总 {tables.length}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {tables.map(tb => (
                    <div
                      key={tb.id}
                      onClick={() => tb.status === 'occupied' && setActiveChargeTable(tb)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        tb.status === 'occupied'
                          ? 'bg-white border-emerald-300 shadow-xs cursor-pointer hover:border-emerald-400'
                          : tb.status === 'needs_bussing'
                            ? 'bg-amber-50/60 border-amber-200 text-amber-900'
                            : 'bg-stone-50 border-slate-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 font-mono">
                          {tb.tableNumber}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                          tb.status === 'occupied' ? 'bg-emerald-100 text-emerald-800' :
                          tb.status === 'needs_bussing' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {tb.status === 'occupied' ? '用餐中' : tb.status === 'needs_bussing' ? '待清台' : '空闲'}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-500 mt-1">
                        容纳: {tb.seats}人 · 区域: {tb.zone}
                      </div>

                      {tb.status === 'occupied' && (
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                          <span className="text-slate-600 font-mono">#{tb.guestRoom}</span>
                          <span className="font-bold text-emerald-700 font-mono">¥{tb.orderTotal} &rarr;</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Settle Active Table Modal */}
                {activeChargeTable && (
                  <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-300 shadow-md space-y-2.5 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 font-serif">
                        台位账单结账: {activeChargeTable.tableNumber}
                      </span>
                      <button 
                        onClick={() => setActiveChargeTable(null)}
                        className="p-1 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-50 text-xs flex items-center justify-between font-mono">
                      <span>单点消费总额:</span>
                      <span className="text-base font-bold text-emerald-800">¥{activeChargeTable.orderTotal}</span>
                    </div>

                    <button
                      onClick={handleSettleTable}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>直接挂入客房账单 (#{activeChargeTable.guestRoom})</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: 住客档案 (Guest Directory & Preferences) */}
            {activeTab === 'guests' && (
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-900 font-serif block">
                  今日在住 VIP 住客饮食档案
                </span>

                {guests.map(g => (
                  <div 
                    key={g.roomNumber}
                    onClick={() => {
                      setSelectedRoom(g.roomNumber);
                      setActiveTab('reception');
                    }}
                    className="p-3 rounded-xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all cursor-pointer shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs font-mono text-slate-900">#{g.roomNumber}</span>
                        <span className="font-bold text-xs text-slate-800">{g.guestName}</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                        {g.membershipTier}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {g.dietaryRestrictions.map((d, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold">
                          {d}
                        </span>
                      ))}
                      {g.customPreferences.map((p, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Mobile Bottom Tab Navigation Bar (Fresh Clean Botanical) */}
          <div className="bg-white border-t border-emerald-100 px-3 py-2 flex items-center justify-around z-30 shadow-xs">
            <button
              onClick={() => setActiveTab('reception')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reception' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span className="text-[10px]">迎宾核销</span>
            </button>

            <button
              onClick={() => setActiveTab('safety')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'safety' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="text-[10px]">食安巡检</span>
              {activeAnomalies.length > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500"></span>
              )}
            </button>

            {/* Central Floating Scanner Quick-Action Button */}
            <button
              onClick={triggerScanSimulation}
              className="w-10 h-10 -mt-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 transition-transform active:scale-95 cursor-pointer"
              title="模拟激光扫码"
            >
              <Camera className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('tables')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'tables' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              <Utensils className="w-4 h-4" />
              <span className="text-[10px]">散点台位</span>
            </button>

            <button
              onClick={() => setActiveTab('guests')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'guests' ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-emerald-600'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span className="text-[10px]">住客档案</span>
            </button>
          </div>

          {/* Laser Scanner Viewfinder Modal Simulation */}
          {isScannerOpen && (
            <div className="absolute inset-0 bg-slate-900/90 z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in">
              <div className="relative w-56 h-56 rounded-2xl border-2 border-emerald-400 overflow-hidden flex items-center justify-center bg-emerald-950/20">
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-laser"></div>
                <QrCode className="w-24 h-24 text-emerald-400/40" />
                <span className="absolute bottom-3 text-[10px] font-mono text-emerald-300">
                  请对准房卡条码 / RFID 芯片
                </span>
              </div>
              <p className="text-white text-xs font-medium mt-4">
                激光扫描器解码中...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
