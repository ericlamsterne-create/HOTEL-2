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
  Clock
} from 'lucide-react';
import { GuestProfile, TableItem, StationAnomaly } from '../types';
import { playScanBeep, playSuccessChime, playAlertSiren } from '../utils/audio';

interface WaiterPDAProps {
  guests: GuestProfile[];
  setGuests: React.Dispatch<React.SetStateAction<GuestProfile[]>>;
  tables: TableItem[];
  setTables: React.Dispatch<React.SetStateAction<TableItem[]>>;
  dispatchedAnomalies: StationAnomaly[];
  setDispatchedAnomalies: React.Dispatch<React.SetStateAction<StationAnomaly[]>>;
  onResolveAnomaly: (id: string) => void;
  audioMuted: boolean;
  isFloating?: boolean;
  onCloseFloating?: () => void;
}

export const WaiterPDA: React.FC<WaiterPDAProps> = ({
  guests,
  setGuests,
  tables,
  setTables,
  dispatchedAnomalies,
  setDispatchedAnomalies,
  onResolveAnomaly,
  audioMuted,
  isFloating = false,
  onCloseFloating
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'breakfast' | 'dietary' | 'tables' | 'alerts'>('breakfast');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('8812');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newTagInput, setNewTagInput] = useState<string>('');
  const [chargeModalTable, setChargeModalTable] = useState<TableItem | null>(null);
  const [signedName, setSignedName] = useState<string>('');
  const [pdaToast, setPdaToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setPdaToast(msg);
    setTimeout(() => setPdaToast(null), 3000);
  };

  const currentGuest = guests.find(g => g.roomNumber === selectedRoomNumber) || guests[0];

  // Quick Breakfast Verification & Check-in
  const handleCheckInGuest = (count: number = 1) => {
    if (!audioMuted) playScanBeep();

    setGuests(prev => prev.map(g => {
      if (g.roomNumber === currentGuest.roomNumber) {
        return {
          ...g,
          breakfastConsumedToday: g.breakfastConsumedToday + count
        };
      }
      return g;
    }));

    showToast(`✅ [${currentGuest.roomNumber} ${currentGuest.guestName}] 已核销入场 ${count} 位早餐`);
  };

  // Charge extra breakfast to room folio
  const handleChargeExtraBreakfast = () => {
    if (!audioMuted) playSuccessChime();

    setGuests(prev => prev.map(g => {
      if (g.roomNumber === currentGuest.roomNumber) {
        return {
          ...g,
          breakfastConsumedToday: g.breakfastConsumedToday + 1,
          totalBillRoom: g.totalBillRoom + 298
        };
      }
      return g;
    }));

    showToast(`💳 额外早餐 ¥298 已成功记入客房 #${currentGuest.roomNumber} 账单`);
  };

  // Add custom guest preference tag
  const handleAddCustomTag = () => {
    if (!newTagInput.trim()) return;
    if (!audioMuted) playSuccessChime();

    setGuests(prev => prev.map(g => {
      if (g.roomNumber === currentGuest.roomNumber) {
        if (g.customPreferences.includes(newTagInput.trim())) return g;
        return {
          ...g,
          customPreferences: [...g.customPreferences, newTagInput.trim()]
        };
      }
      return g;
    }));

    setNewTagInput('');
    showToast(`🏷️ 已为客房 #${currentGuest.roomNumber} 建立个性化服务标签`);
  };

  // Confirm charging table bill to guest room
  const handleConfirmRoomCharge = () => {
    if (!chargeModalTable) return;
    if (!audioMuted) playSuccessChime();

    const amount = chargeModalTable.orderTotal || 0;
    const roomNum = chargeModalTable.guestRoom || currentGuest.roomNumber;

    setGuests(prev => prev.map(g => {
      if (g.roomNumber === roomNum) {
        return {
          ...g,
          totalBillRoom: g.totalBillRoom + amount
        };
      }
      return g;
    }));

    setTables(prev => prev.map(t => {
      if (t.id === chargeModalTable.id) {
        return {
          ...t,
          status: 'needs_bussing',
          orderTotal: 0
        };
      }
      return t;
    }));

    showToast(`✨ 台位 ${chargeModalTable.tableNumber} 散点账单 ¥${amount} 已挂入房账 #${roomNum}`);
    setChargeModalTable(null);
    setSignedName('');
  };

  return (
    <div className={`w-full ${isFloating ? 'h-[620px] flex flex-col' : 'max-w-md mx-auto'} bg-white text-slate-800 rounded-3xl border-2 border-emerald-300/80 shadow-xl overflow-hidden`}>
      {/* Toast Feedback */}
      {pdaToast && (
        <div className="absolute top-12 left-4 right-4 z-50 bg-white border border-emerald-300 text-slate-800 px-3 py-2 rounded-xl text-xs shadow-lg flex items-center gap-2 backdrop-blur animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{pdaToast}</span>
        </div>
      )}

      {/* Top Associate Bar */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            0842
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900 font-serif">陈晓丽 · 移动画中画</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <span className="text-[10px] text-slate-500">喜来登全日餐厅 · 协同工作站</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isFloating && onCloseFloating && (
            <button
              onClick={onCloseFloating}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-emerald-50 cursor-pointer"
              title="关闭画中画"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-4 gap-1 p-2 bg-stone-50 border-b border-emerald-100 text-xs">
        <button
          onClick={() => setActiveSubTab('breakfast')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
            activeSubTab === 'breakfast' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
          }`}
        >
          包早核销
        </button>
        <button
          onClick={() => setActiveSubTab('dietary')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
            activeSubTab === 'dietary' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
          }`}
        >
          住客禁忌
        </button>
        <button
          onClick={() => setActiveSubTab('tables')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center ${
            activeSubTab === 'tables' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
          }`}
        >
          散点台位
        </button>
        <button
          onClick={() => setActiveSubTab('alerts')}
          className={`py-1.5 px-2 rounded-lg font-medium transition-all text-center relative ${
            activeSubTab === 'alerts' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
          }`}
        >
          食安工单
          {dispatchedAnomalies.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1 right-1"></span>
          )}
        </button>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* SUBTAB 1: 包早核销与防蹭早 */}
        {activeSubTab === 'breakfast' && (
          <div className="space-y-3">
            {/* Search room */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="搜索房号 / 姓名..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
            </div>

            {/* Selected Guest Details */}
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono text-slate-900">
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
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold block">
                    房账已挂: ¥{currentGuest.totalBillRoom}
                  </span>
                </div>
              </div>

              {/* Breakfast Quotas */}
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">每日包早额度</span>
                  <span className="font-bold text-slate-900">
                    {currentGuest.breakfastIncludedCount} 位
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">今日已入场核销</span>
                  <span className="font-bold text-emerald-800 font-mono">
                    {currentGuest.breakfastConsumedToday} 人次
                  </span>
                </div>

                <div>
                  {currentGuest.breakfastConsumedToday >= currentGuest.breakfastIncludedCount ? (
                    <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] block">
                      ⚠️ 已超额
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] block">
                      未超额
                    </span>
                  )}
                </div>
              </div>

              {/* Verification Actions */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleCheckInGuest(1)}
                  className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>正常核销 (1位)</span>
                </button>

                <button
                  onClick={handleChargeExtraBreakfast}
                  className="py-2.5 rounded-xl bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>超额挂房账 (¥298)</span>
                </button>
              </div>
            </div>

            {/* Room list quick select */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 font-medium">快速切换其他在住客房:</span>
              <div className="space-y-1">
                {guests.map(g => (
                  <button
                    key={g.roomNumber}
                    onClick={() => setSelectedRoomNumber(g.roomNumber)}
                    className={`w-full p-2 rounded-xl border text-left flex items-center justify-between text-xs transition-colors cursor-pointer ${
                      g.roomNumber === currentGuest.roomNumber
                        ? 'bg-emerald-50 border-emerald-300 font-bold'
                        : 'bg-white border-slate-200 hover:bg-emerald-50/30'
                    }`}
                  >
                    <span className="font-mono">#{g.roomNumber} {g.guestName}</span>
                    <span className="text-[10px] text-slate-500">
                      {g.breakfastConsumedToday}/{g.breakfastIncludedCount} 位
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: 住客禁忌与偏好标签 */}
        {activeSubTab === 'dietary' && (
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
              <div className="font-bold text-rose-900 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>#{currentGuest.roomNumber} {currentGuest.guestName} 饮食红线</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {currentGuest.dietaryRestrictions.map((d, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200 font-bold text-[10px]">
                    {d}
                  </span>
                ))}
              </div>
            </div>

            {/* Existing custom preferences */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800">个性化口味标签:</span>
              <div className="flex flex-wrap gap-1.5">
                {currentGuest.customPreferences.map((p, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Add tag form */}
            <div className="flex items-center gap-1.5 pt-2">
              <input
                type="text"
                placeholder="新增偏好 (例: 咖啡配燕麦奶)..."
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                className="flex-1 px-3 py-1.5 bg-white border border-emerald-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-emerald-500 shadow-2xs"
              />
              <button
                onClick={handleAddCustomTag}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                添加
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 3: 散点台位挂房账 */}
        {activeSubTab === 'tables' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 block">
              散点台位列表 (点击可即时挂房账)
            </span>

            <div className="space-y-2">
              {tables.map(t => (
                <div
                  key={t.id}
                  onClick={() => t.status === 'occupied' && setChargeModalTable(t)}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors cursor-pointer ${
                    t.status === 'occupied'
                      ? 'bg-white border-emerald-300 hover:border-emerald-400 shadow-2xs'
                      : 'bg-stone-50 border-slate-200 opacity-70'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono">{t.tableNumber}</span>
                      <span className="text-[10px] text-slate-500">({t.seats}人位 · {t.zone})</span>
                    </div>
                    {t.guestRoom && (
                      <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">
                        住客客房: #{t.guestRoom}
                      </span>
                    )}
                  </div>

                  <div className="text-right">
                    {t.status === 'occupied' ? (
                      <div>
                        <span className="font-bold font-mono text-emerald-800 text-sm block">
                          ¥{t.orderTotal}
                        </span>
                        <span className="text-[10px] text-emerald-700 underline font-semibold">
                          挂入房账 &rarr;
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">
                        {t.status === 'needs_bussing' ? '待清台' : '空闲'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Charge Modal */}
            {chargeModalTable && (
              <div className="p-3.5 rounded-2xl bg-white border-2 border-emerald-300 shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    挂房账确认: 台位 {chargeModalTable.tableNumber}
                  </span>
                  <button onClick={() => setChargeModalTable(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-50 text-xs flex items-center justify-between font-mono">
                  <span>挂账金额:</span>
                  <span className="text-base font-bold text-emerald-800">¥{chargeModalTable.orderTotal}</span>
                </div>
                <button
                  onClick={handleConfirmRoomCharge}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>确认挂入客房账单 (#{chargeModalTable.guestRoom})</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 4: 食安派工单 */}
        {activeSubTab === 'alerts' && (
          <div className="space-y-3">
            {dispatchedAnomalies.length > 0 ? (
              dispatchedAnomalies.map(item => (
                <div key={item.id} className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-rose-900">{item.title}</span>
                    <span className="text-[10px] text-rose-700 font-mono">{item.detectedAt}</span>
                  </div>
                  <p className="text-slate-600 text-[11px]">{item.description}</p>
                  <button
                    onClick={() => onResolveAnomaly(item.id)}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>现场已换盘/换夹 (回传销单)</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-700">暂无待处理的现场派工单</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
