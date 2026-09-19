import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UtensilsCrossed, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Zap, 
  Trash2, 
  Lock, 
  Unlock, 
  Leaf, 
  Flame, 
  Recycle, 
  Check, 
  DollarSign, 
  BarChart2, 
  Volume2,
  Radio,
  Camera,
  Eye
} from 'lucide-react';
import { SilverwareInterceptEvent, WasteBinType, SystemStats } from '../types';
import { playAlertSiren, playBaffleLockSound, playSuccessChime } from '../utils/audio';

interface SilverwareBussingGuardProps {
  intercepts: SilverwareInterceptEvent[];
  setIntercepts: React.Dispatch<React.SetStateAction<SilverwareInterceptEvent[]>>;
  stats: SystemStats;
  setStats: React.Dispatch<React.SetStateAction<SystemStats>>;
  audioMuted: boolean;
}

export const SilverwareBussingGuard: React.FC<SilverwareBussingGuardProps> = ({
  intercepts,
  setIntercepts,
  stats,
  setStats,
  audioMuted
}) => {
  const [baffleLocked, setBaffleLocked] = useState<boolean>(true);
  const [activeBinStream, setActiveBinStream] = useState<WasteBinType>('green_organic');
  const [streamMode, setStreamMode] = useState<'live_video' | 'snapshot'>('live_video');
  const [timecode, setTimecode] = useState<string>('');
  const [liveFps, setLiveFps] = useState<number>(119.8);
  const [activeItemOnBelt, setActiveItemOnBelt] = useState<{
    name: string;
    type: 'silver' | 'bone_china' | 'organic' | 'bone_shell' | 'plastic';
    value?: number;
    intercepted?: boolean;
  } | null>({
    name: 'Christofle 925 纯银主餐叉 (法国皇室御用)',
    type: 'silver',
    value: 1850,
    intercepted: true
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setTimecode(`${h}:${m}:${s}.${ms}`);
      setLiveFps(+(119.4 + Math.random() * 0.9).toFixed(1));
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Retrieve intercepted silverware and reset baffle
  const handleRetrieveAndUnlock = (id?: string) => {
    if (!audioMuted) playSuccessChime();
    setBaffleLocked(false);
    setActiveItemOnBelt(null);

    setIntercepts(prev => prev.map(item => {
      if (!id || item.id === id) {
        return {
          ...item,
          status: 'retrieved',
          recoveredBy: '洗碗房领班 (工号0912)',
          actionNote: '银器已通过磁致+视觉安全取回，投入纯银超声波抛光槽。'
        };
      }
      return item;
    }));

    showToast('✨ 纯银刀叉已成功取回归库！0.12s 气动挡板已复位就绪。');
  };

  // Simulation 1: Accidentally drop luxury silverware (Christofle / Robbe & Berking)
  const simulateSilverwareDrop = () => {
    if (!audioMuted) {
      playAlertSiren();
      setTimeout(() => playBaffleLockSound(), 115);
    }
    setBaffleLocked(true);

    const newItem = {
      name: 'Robbe & Berking 纯银黄油刀 (德国匠造)',
      type: 'silver' as const,
      value: 1680,
      intercepted: true
    };
    setActiveItemOnBelt(newItem);

    const newIntercept: SilverwareInterceptEvent = {
      id: `int_${Date.now()}`,
      stationChute: '洗碗间 A-02 号倒台流槽',
      itemName: newItem.name,
      material: 'silver',
      estimatedValue: newItem.value,
      timestamp: new Date().toLocaleTimeString(),
      responseLatencyMs: 112,
      baffleStatus: 'locked',
      status: 'intercepted',
      photoUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80'
    };

    setIntercepts(prev => [newIntercept, ...prev]);
    setStats(prev => ({
      ...prev,
      silverwareSavedCount: prev.silverwareSavedCount + 1,
      silverwareSavedAmountYuan: prev.silverwareSavedAmountYuan + newItem.value
    }));

    showToast('🛡️ 0.12s 极限拦截！高频电感+高反光纯银视觉识别锁定，气动挡板瞬间关闭。');
  };

  // Simulation 2: Accidentally drop Wedgwood Bone China Coffee Cup (骨瓷杯)
  const simulateBoneChinaDrop = () => {
    if (!audioMuted) {
      playAlertSiren();
      setTimeout(() => playBaffleLockSound(), 115);
    }
    setBaffleLocked(true);

    const newItem = {
      name: 'Wedgwood 野草莓系列高级骨瓷咖啡杯',
      type: 'bone_china' as const,
      value: 920,
      intercepted: true
    };
    setActiveItemOnBelt(newItem);

    const newIntercept: SilverwareInterceptEvent = {
      id: `int_${Date.now()}`,
      stationChute: '洗碗间 A-02 号倒台流槽',
      itemName: newItem.name,
      material: 'bone_china',
      estimatedValue: newItem.value,
      timestamp: new Date().toLocaleTimeString(),
      responseLatencyMs: 118,
      baffleStatus: 'locked',
      status: 'intercepted',
      photoUrl: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=600&auto=format&fit=crop&q=80'
    };

    setIntercepts(prev => [newIntercept, ...prev]);
    setStats(prev => ({
      ...prev,
      silverwareSavedCount: prev.silverwareSavedCount + 1,
      silverwareSavedAmountYuan: prev.silverwareSavedAmountYuan + newItem.value
    }));

    showToast('🛡️ 0.12s 极限拦截！骨瓷半透光特征识别，气动挡板拦截成功。');
  };

  // Simulation 3: Drop Green Organic Waste (Peels / Salad)
  const simulateOrganicStream = () => {
    if (!audioMuted) playSuccessChime();
    setBaffleLocked(false);
    setActiveBinStream('green_organic');
    setActiveItemOnBelt({
      name: '清炒芦笋残羹与果皮 (纯有机)',
      type: 'organic'
    });

    setStats(prev => ({
      ...prev,
      organicCompostKg: Number((prev.organicCompostKg + 0.8).toFixed(1))
    }));

    showToast('🌱 精准分流至【绿桶】：直通 30 层空中香草园厌氧发酵堆肥！');
  };

  // Simulation 4: Drop Red Hard Bones (Crab / Lamb Bones)
  const simulateHardBoneStream = () => {
    if (!audioMuted) playSuccessChime();
    setBaffleLocked(false);
    setActiveBinStream('red_bone_shell');
    setActiveItemOnBelt({
      name: '烤羊排骨头与澳洲红龙虾硬壳',
      type: 'bone_shell'
    });

    showToast('🔴 精准分流至【红桶】：硬骨硬壳自动排除，防止卡死厨余粉碎机！');
  };

  // Simulation 5: Drop Blue Plastic / Straw
  const simulatePlasticStream = () => {
    if (!audioMuted) playSuccessChime();
    setBaffleLocked(false);
    setActiveBinStream('blue_inorganic');
    setActiveItemOnBelt({
      name: '湿纸巾包装膜与吸管',
      type: 'plastic'
    });

    showToast('🔵 精准分流至【蓝桶】：微塑料拦截隔离，杜绝进入有机土壤肥料！');
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-emerald-300 text-slate-800 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur animate-in fade-in duration-300">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner: Hotel Silverware Protection & 3-Bin Segregation */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-600">
                <UtensilsCrossed className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-serif">
                  后台清台、银器保护与精准垃圾分类增效
                  <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                    0.12s 气动锁死防线
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  解决高级酒店纯银刀叉/骨瓷随残羹误丢痛点 · 3桶精准分类守护粉碎机寿命与空中香草园堆肥纯度
                </p>
              </div>
            </div>
          </div>

          {/* Value Stats */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50/70 px-4 py-2 rounded-xl border border-emerald-200 text-right">
              <span className="text-[11px] text-slate-500 block">累计挽回餐具价值</span>
              <span className="text-lg font-bold font-mono text-emerald-700">
                ¥{stats.silverwareSavedAmountYuan.toLocaleString()}
              </span>
            </div>
            <div className="bg-emerald-50/70 px-4 py-2 rounded-xl border border-emerald-200 text-right">
              <span className="text-[11px] text-slate-500 block">拦截件数</span>
              <span className="text-lg font-bold font-mono text-slate-800">
                {stats.silverwareSavedCount} 件
              </span>
            </div>
          </div>
        </div>

        {/* Chute Simulation Interactive Triggers */}
        <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">洗碗房倒台事件模拟注入:</span>
          
          <button
            onClick={simulateSilverwareDrop}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>误丢纯银刀叉 (触发0.12s挡板)</span>
          </button>

          <button
            onClick={simulateBoneChinaDrop}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>误丢骨瓷杯 (微观半透光拦截)</span>
          </button>

          <button
            onClick={simulateOrganicStream}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            <span>纯有机残羹 (绿桶分流)</span>
          </button>

          <button
            onClick={simulateHardBoneStream}
            className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5 text-rose-600" />
            <span>硬骨/贝壳 (红桶分流)</span>
          </button>

          <button
            onClick={simulatePlasticStream}
            className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Recycle className="w-3.5 h-3.5 text-sky-600" />
            <span>纸巾微塑料 (蓝桶分流)</span>
          </button>
        </div>
      </div>

      {/* Main Hardware Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Stainless Steel Chute with 0.12s Pneumatic Baffle Animation (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800 font-mono">
                  CHUTE #A-02 [洗碗间倒台流槽 4K 120FPS 工业高速相机]
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-slate-200 text-xs font-mono">
                  <button
                    onClick={() => setStreamMode('live_video')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      streamMode === 'live_video'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-emerald-700'
                    }`}
                  >
                    <Radio className="w-3 h-3" />
                    <span>高速流 (120FPS)</span>
                  </button>
                  <button
                    onClick={() => setStreamMode('snapshot')}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                      streamMode === 'snapshot'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-emerald-700'
                    }`}
                  >
                    <Camera className="w-3 h-3" />
                    <span>工业定格</span>
                  </button>
                </div>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                  时延: 115ms &lt; 120ms
                </span>
              </div>
            </div>

            {/* Stainless Steel Chute Real Camera Viewport (With Real Kitchen Background & HUD) */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-emerald-300 bg-slate-950 flex flex-col justify-between shadow-inner select-none group">
              {/* Real Photographic Background Image of High-Grade Kitchen Wash Chute */}
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1000&auto=format&fit=crop&q=80"
                alt="Kitchen Bussing Chute"
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-85"
              />

              {/* Lens Contrast Gradient & Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 pointer-events-none"></div>

              {/* Dynamic Laser Scanning Line across the Chute */}
              {streamMode === 'live_video' && (
                <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-emerald-400 to-transparent animate-laser pointer-events-none z-10 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></div>
              )}

              {/* Top Sensor Gantry OSD */}
              <div className="flex items-center justify-between z-20 p-3">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/15 text-[11px] font-mono text-white shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-bold tracking-wider">OPTICAL+EDDY REC // CHUTE A-02</span>
                </div>

                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/15 text-[11px] font-mono text-white shadow-md">
                  <span>{timecode}</span>
                  <span className="text-emerald-300 font-bold">{liveFps} FPS</span>
                  <span className="text-amber-300">0.85 MPa (气阀就绪)</span>
                </div>
              </div>

              {/* Chute Physical Conveyor / Flow Path Center Zone */}
              <div className="relative mx-4 h-36 bg-black/40 backdrop-blur-xs rounded-xl border border-white/20 flex items-center justify-center overflow-hidden z-20 shadow-xl">
                {/* Visual scan grids on chute */}
                <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>

                {/* Current Item on Belt / Chute */}
                {activeItemOnBelt ? (
                  <div className={`relative z-10 p-3.5 rounded-xl border-2 flex items-center gap-3 backdrop-blur-md transition-all shadow-xl max-w-lg ${
                    activeItemOnBelt.intercepted 
                      ? 'bg-rose-950/85 border-rose-400 text-rose-100 animate-pulse' 
                      : 'bg-emerald-950/85 border-emerald-400 text-emerald-100'
                  }`}>
                    {activeItemOnBelt.type === 'silver' && (
                      <div className="w-10 h-10 rounded-lg bg-amber-400/20 border border-amber-300 text-amber-300 flex items-center justify-center font-bold text-lg">
                        Ag
                      </div>
                    )}
                    {activeItemOnBelt.type === 'bone_china' && (
                      <div className="w-10 h-10 rounded-lg bg-emerald-400/20 border border-emerald-300 text-emerald-300 flex items-center justify-center font-bold text-sm">
                        瓷
                      </div>
                    )}
                    {activeItemOnBelt.type === 'organic' && (
                      <div className="w-10 h-10 rounded-lg bg-emerald-400/20 border border-emerald-300 text-emerald-300 flex items-center justify-center font-bold text-sm">
                        🌱
                      </div>
                    )}
                    {activeItemOnBelt.type === 'bone_shell' && (
                      <div className="w-10 h-10 rounded-lg bg-rose-400/20 border border-rose-300 text-rose-300 flex items-center justify-center font-bold text-sm">
                        🦴
                      </div>
                    )}
                    {activeItemOnBelt.type === 'plastic' && (
                      <div className="w-10 h-10 rounded-lg bg-sky-400/20 border border-sky-300 text-sky-300 flex items-center justify-center font-bold text-sm">
                        🥤
                      </div>
                    )}

                    <div>
                      <div className="font-bold text-sm text-white font-serif flex items-center gap-2">
                        {activeItemOnBelt.name}
                        {activeItemOnBelt.value && (
                          <span className="text-amber-300 text-xs font-mono font-bold">
                            ¥{activeItemOnBelt.value}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-200 mt-0.5">
                        {activeItemOnBelt.intercepted ? (
                          <span className="text-rose-300 font-bold">
                            ⚠️ 0.12s 气动挡板已毫秒级闭合，成功拦截纯银餐具！
                          </span>
                        ) : (
                          <span className="text-emerald-300 font-bold">
                            分流顺畅 · 目标流向: {activeBinStream === 'green_organic' ? '绿桶(有机堆肥)' : activeBinStream === 'red_bone_shell' ? '红桶(重骨贝壳)' : '蓝桶(微塑料)'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-300 text-xs font-mono flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    倒台流槽持续巡检中 · 输送带洁净就绪
                  </div>
                )}

                {/* Pneumatic Baffle Visual Flap at the Exit of Chute */}
                <div 
                  className={`absolute right-4 top-2 bottom-2 w-4 rounded-md transition-all duration-150 flex items-center justify-center z-30 ${
                    baffleLocked 
                      ? 'bg-rose-600 shadow-lg shadow-rose-600/80 border-2 border-white animate-pulse' 
                      : 'bg-emerald-500/30 border border-emerald-400 opacity-30 translate-y-12'
                  }`}
                  title={baffleLocked ? '气动挡板已锁死闭合' : '气动挡板打开放行'}
                >
                  {baffleLocked ? <Lock className="w-3 h-3 text-white" /> : <Unlock className="w-3 h-3 text-emerald-800" />}
                </div>
              </div>

              {/* Bottom Chute Telemetry */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 z-20 p-3 bg-black/60 backdrop-blur-xs border-t border-white/10">
                <span>PNEUMATIC ACTUATOR: SMC 0.12s ULTRA-FAST HIGH-SPEED</span>
                <span className="text-emerald-300 font-bold">FAIL-SAFE: POWER-OFF AUTO LOCK ENFORCED</span>
              </div>
            </div>
          </div>

          {/* Bottom Action bar */}
          <div className="bg-stone-50 border-t border-slate-100 px-4 py-2.5 flex items-center justify-between mt-3 rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${baffleLocked ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
              <span className="font-bold text-slate-800">
                挡板状态: {baffleLocked ? '已锁定 (拦截至取回槽)' : '打开 (正常分流通行)'}
              </span>
            </div>

            {baffleLocked ? (
              <button
                onClick={() => handleRetrieveAndUnlock()}
                className="py-1.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>取回银器并复位挡板</span>
              </button>
            ) : (
              <button
                onClick={() => setBaffleLocked(true)}
                className="py-1.5 px-4 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>手动紧急闭锁测试</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: 3-Bin Smart Segregation System (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                  3 桶精准分流增效机制
                </h3>
                <span className="text-xs text-slate-500">
                  视觉即时分类，解决硬物毁机与微塑料污染
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                纯度 99.4%
              </span>
            </div>

            {/* 3 Bin Cards */}
            <div className="space-y-2.5">
              {/* Bin 1: Green Organic */}
              <div 
                onClick={() => simulateOrganicStream()}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                  activeBinStream === 'green_organic'
                    ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-200'
                    : 'bg-emerald-50/30 border-emerald-200 hover:bg-emerald-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                      绿桶
                    </span>
                    <div>
                      <div className="font-bold text-xs text-emerald-950">
                        纯有机湿厨余 (果皮 / 菜叶 / 咖啡渣 / 面包)
                      </div>
                      <div className="text-[11px] text-emerald-700 mt-0.5">
                        直通 30 层空中香草园 100% 厌氧发酵制肥
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-800">
                    {stats.organicCompostKg} kg
                  </span>
                </div>
              </div>

              {/* Bin 2: Red Hard Bones / Shells */}
              <div 
                onClick={() => simulateHardBoneStream()}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                  activeBinStream === 'red_bone_shell'
                    ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200'
                    : 'bg-rose-50/30 border-rose-200 hover:bg-rose-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs">
                      红桶
                    </span>
                    <div>
                      <div className="font-bold text-xs text-rose-950">
                        硬骨硬壳 (生蚝壳 / 龙虾壳 / 羊排大骨)
                      </div>
                      <div className="text-[11px] text-rose-700 mt-0.5">
                        独立收集，防止卡坏数十万粉碎机滚刀刀头
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-rose-800">
                    18.4 kg
                  </span>
                </div>
              </div>

              {/* Bin 3: Blue Inorganics / Microplastics */}
              <div 
                onClick={() => simulatePlasticStream()}
                className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                  activeBinStream === 'blue_inorganic'
                    ? 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-200'
                    : 'bg-sky-50/30 border-sky-200 hover:bg-sky-50/60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-sky-600 text-white font-bold text-xs">
                      蓝桶
                    </span>
                    <div>
                      <div className="font-bold text-xs text-sky-950">
                        无机杂物 (擦手纸 / 牙签纸袋 / 塑料吸管)
                      </div>
                      <div className="text-[11px] text-sky-700 mt-0.5">
                        严防微塑料进入堆肥土壤，保护绿色有机认证
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-sky-800">
                    4.2 kg
                  </span>
                </div>
              </div>
            </div>

            {/* Backlog of Intercepted Luxury Cutlery */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 font-serif">
                  今日拦截取回记录 (前 3 笔):
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  高精度磁致+微观反光
                </span>
              </div>

              <div className="space-y-2">
                {intercepts.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-stone-50 border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800 truncate max-w-[200px]">
                        {item.itemName}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        时延: {item.responseLatencyMs}ms · 估值 ¥{item.estimatedValue}
                      </div>
                    </div>

                    {item.status === 'retrieved' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        已安全入库
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRetrieveAndUnlock(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                      >
                        立即取回
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
