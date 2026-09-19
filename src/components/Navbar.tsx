import React from 'react';
import { 
  ShieldCheck, 
  Camera, 
  Sparkles, 
  Smartphone, 
  Volume2, 
  VolumeX, 
  LayoutDashboard, 
  Leaf, 
  UtensilsCrossed, 
  Monitor,
  Activity,
  TreePine,
  BrainCircuit
} from 'lucide-react';
import { SystemStats } from '../types';

interface NavbarProps {
  activeTab: 'cockpit' | 'buffet' | 'training' | 'silverware' | 'pda' | 'esg';
  setActiveTab: (tab: 'cockpit' | 'buffet' | 'training' | 'silverware' | 'pda' | 'esg') => void;
  terminalMode: 'control_center' | 'mobile_waiter';
  setTerminalMode: (mode: 'control_center' | 'mobile_waiter') => void;
  pdaFloatingOpen: boolean;
  setPdaFloatingOpen: (open: boolean) => void;
  audioMuted: boolean;
  setAudioMuted: (muted: boolean) => void;
  stats: SystemStats;
  activeAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  terminalMode,
  setTerminalMode,
  pdaFloatingOpen,
  setPdaFloatingOpen,
  audioMuted,
  setAudioMuted,
  stats,
  activeAlertCount
}) => {
  return (
    <header className="border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 py-2.5 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand & Luxury Green Hotel Subtitle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shadow-xs text-emerald-600">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-wider text-slate-800 font-serif">
                  BistroGuard <span className="text-emerald-700 font-sans font-semibold text-xs px-1.5 py-0.5 rounded bg-emerald-100/70 border border-emerald-300/60">AI</span>
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  五星全日餐厅 · 绿色智能防线
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                数字化中控大屏 · 双目食安视觉 / 银器拦截 / 3桶精准分流 / 服务员手机端
              </p>
            </div>
          </div>

          {/* Primary Terminal Mode Switcher on Mobile Screens */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={() => {
                setTerminalMode(terminalMode === 'control_center' ? 'mobile_waiter' : 'control_center');
                if (terminalMode === 'control_center') setActiveTab('pda');
                else setActiveTab('cockpit');
              }}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
            >
              {terminalMode === 'control_center' ? (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>手机端</span>
                </>
              ) : (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span>中控屏</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Central Terminal Dual-Mode Switcher (Desktop / Tablet) */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-center">
          <div className="bg-emerald-50/80 p-1 rounded-xl border border-emerald-200/80 flex items-center gap-1 text-xs shadow-inner">
            <button
              onClick={() => {
                setTerminalMode('control_center');
                if (activeTab === 'pda') setActiveTab('cockpit');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                terminalMode === 'control_center'
                  ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200 font-bold'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-100/50'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-emerald-600" />
              <span>🖥️ 数字化中控大屏</span>
            </button>

            <button
              onClick={() => {
                setTerminalMode('mobile_waiter');
                setActiveTab('pda');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                terminalMode === 'mobile_waiter'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-100/50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 服务员手机端入口</span>
              <span className={`w-2 h-2 rounded-full ${terminalMode === 'mobile_waiter' ? 'bg-white' : 'bg-emerald-500'}`}></span>
            </button>
          </div>
        </div>

        {/* Action Controls & Hardware Telemetry */}
        <div className="hidden md:flex items-center gap-3">
          {/* Audio toggle */}
          <button
            onClick={() => setAudioMuted(!audioMuted)}
            className={`p-2 rounded-xl border text-xs transition-colors cursor-pointer ${
              audioMuted 
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100' 
                : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
            }`}
            title={audioMuted ? "警报音已静音" : "警报音效开启中"}
          >
            {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Quick Hardware Health Pills */}
          <div className="flex items-center gap-2 pl-2 border-l border-emerald-100 text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              {stats.overheadCamFps} FPS 4K
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600 font-medium">
              延迟: {stats.aiLatencyMs}ms
            </span>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs for Central Control Mode */}
      {terminalMode === 'control_center' && (
        <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-emerald-100/80 flex items-center justify-between overflow-x-auto">
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('training')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'training'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5 text-emerald-400" />
              <span>🔬 菜品状态机器学习识别与训练 (系统起点)</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono hidden sm:inline">
                算法源头
              </span>
            </button>

            <button
              onClick={() => setActiveTab('cockpit')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'cockpit'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>总台中控看板</span>
            </button>

            <button
              onClick={() => setActiveTab('buffet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap relative ${
                activeTab === 'buffet'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>取餐档口双目防线</span>
              {activeAlertCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-[10px] text-white font-bold flex items-center justify-center animate-bounce">
                  {activeAlertCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('silverware')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'silverware'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <UtensilsCrossed className="w-3.5 h-3.5" />
              <span>洗碗间银器拦截与分流</span>
            </button>

            <button
              onClick={() => setActiveTab('esg')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'esg'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              <span>后厨备餐削峰与香草园 ESG</span>
            </button>
          </nav>

          {/* Prompt to open mobile side-by-side */}
          <button
            onClick={() => setPdaFloatingOpen(!pdaFloatingOpen)}
            className={`hidden lg:flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-lg border transition-all ${
              pdaFloatingOpen 
                ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-semibold'
                : 'bg-white border-emerald-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{pdaFloatingOpen ? '关闭侧栏手机画中画' : '开启侧栏手机协同测试'}</span>
          </button>
        </div>
      )}
    </header>
  );
};
