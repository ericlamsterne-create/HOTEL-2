import React from 'react';
import { 
  ShieldCheck, 
  Camera, 
  UtensilsCrossed, 
  Smartphone, 
  Leaf, 
  AlertOctagon, 
  CheckCircle2, 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  Activity, 
  Eye, 
  RotateCcw, 
  Sliders, 
  Check, 
  ArrowUpRight,
  Sprout,
  Sun,
  BrainCircuit
} from 'lucide-react';
import { SystemStats, StationAnomaly, SilverwareInterceptEvent, BuffetStation } from '../types';

interface ExecutiveCockpitProps {
  stats: SystemStats;
  anomalies: StationAnomaly[];
  stations: BuffetStation[];
  intercepts: SilverwareInterceptEvent[];
  onNavigateTab: (tab: 'buffet' | 'silverware' | 'pda' | 'esg') => void;
  onOpenPda: () => void;
}

export const ExecutiveCockpit: React.FC<ExecutiveCockpitProps> = ({
  stats,
  anomalies,
  stations,
  intercepts,
  onNavigateTab,
  onOpenPda
}) => {
  const activeAnomalies = anomalies.filter(a => a.status === 'active');
  const criticalCount = activeAnomalies.filter(a => a.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Hotel F&B Executive Status in Fresh Botanical Theme */}
      <div className="bg-gradient-to-br from-white via-emerald-50/60 to-teal-50/50 border border-emerald-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        {/* Subtle decorative leafy aura */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-300/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold flex items-center gap-1">
                <Sprout className="w-3 h-3 text-emerald-600" />
                Grand All-Day Dining Buffet & Eco Kitchen
              </span>
              <span className="text-xs text-slate-500 font-medium">喜来登全日餐厅 · 早餐高峰智能巡检中</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif tracking-wide">
              BistroGuard AI 全日餐厅绿色运营中控台
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              全方位联通取餐档口双目俯拍食安防线、洗碗间纯银拦截与 3 桶精准分流、后厨备餐削峰反哺以及服务员随身移动手机端闭环。
            </p>
          </div>

          {/* Quick CTA to PDA & Station Views */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => onNavigateTab('training')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4 text-emerald-600" />
              <span>🔬 机器学习识别与训练 (系统起点)</span>
            </button>
            <button
              onClick={() => onNavigateTab('buffet')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>取餐档口双目</span>
            </button>
            <button
              onClick={() => onNavigateTab('silverware')}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <UtensilsCrossed className="w-4 h-4 text-teal-600" />
              <span>洗碗间银器拦截</span>
            </button>
            <button
              onClick={onOpenPda}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>唤起服务员手机端</span>
            </button>
          </div>
        </div>

        {/* 4 Core Pillars Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-5 border-t border-emerald-100">
          {/* Metric 1 */}
          <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>档口食安拦截</span>
              <span className={`w-2 h-2 rounded-full ${criticalCount > 0 ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
              {stats.dripsBlockedCount} <span className="text-xs font-normal text-slate-500">起滴汁/异物</span>
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-medium">
              <span>{activeAnomalies.length} 起待闭环</span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-600">平均处置 45s</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>挽回银器餐具</span>
              <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700">
              ¥{stats.silverwareSavedAmountYuan.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              已拦截 {stats.silverwareSavedCount} 件高昂刀叉骨瓷
            </div>
          </div>

          {/* Metric 3 */}
          <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>后厨削峰减损</span>
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-800">
              ¥{stats.kitchenPrepSavingsYuan.toLocaleString()}
            </div>
            <div className="text-[11px] text-emerald-700 mt-1 font-medium">
              基于洗碗间残羹算法反哺
            </div>
          </div>

          {/* Metric 4 */}
          <div className="p-3.5 rounded-xl bg-white border border-emerald-100 shadow-2xs">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>香草园堆肥闭环</span>
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-700">
              {stats.organicCompostKg} kg
            </div>
            <div className="text-[11px] text-emerald-600 mt-1 font-medium">
              纯有机湿厨余 100% 堆肥
            </div>
          </div>
        </div>
      </div>

      {/* Two Hardware Points Side-by-Side Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Point 1: 取餐档口 AI 双目视觉防线 */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                  <Camera className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif">
                    硬件点位一：取餐档口 AI 双目视觉防线（顶视俯拍）
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    5 大餐台全天候巡检 · 4K 60FPS · 延迟 14.2ms
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('buffet')}
                className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-semibold"
              >
                进入全屏 &rarr;
              </button>
            </div>

            {/* Stations Quick Status Grid */}
            <div className="space-y-2 mb-4">
              {stations.map(st => {
                const hasAlert = activeAnomalies.some(a => a.stationId === st.id);
                return (
                  <div
                    key={st.id}
                    className="p-3 rounded-xl bg-stone-50/70 border border-emerald-100/80 flex items-center justify-between text-xs hover:bg-emerald-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${hasAlert ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                      <span className="font-bold text-slate-800">{st.name}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({st.temperature}°C)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-slate-500">保鲜: <b className="text-emerald-700">{st.freshnessIndex}%</b></span>
                      {hasAlert ? (
                        <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold">
                          检测到异常
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium">
                          洁净安全
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>支持滴汁交叉污染秒级识别、外带纸屑脱落物检测、取餐夹防混标定</span>
            <button
              onClick={() => onNavigateTab('buffet')}
              className="text-emerald-700 underline font-semibold hover:text-emerald-800 cursor-pointer"
            >
              一键处置与模拟测试
            </button>
          </div>
        </div>

        {/* Point 2: 后台清台、银器保护与精准垃圾分类 */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-600">
                  <UtensilsCrossed className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif">
                    硬件点位二：后台清台、银器保护与精准垃圾分类增效
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    洗碗间倒台 A-02 号智能流槽 · 0.12s 气动挡板瞬时锁死
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('silverware')}
                className="text-xs text-teal-700 hover:text-teal-800 flex items-center gap-1 font-semibold"
              >
                进入全屏 &rarr;
              </button>
            </div>

            {/* Silverware Guard Summary */}
            <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 space-y-2 text-xs mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">最近拦截纯银餐具:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {intercepts[0]?.itemName || 'Christofle 925 纯银餐叉'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">气动锁死时延:</span>
                <span className="text-emerald-700 font-mono font-bold">115 ms (极速防滑入粉碎机)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">单件估值:</span>
                <span className="text-amber-700 font-mono font-bold">¥{intercepts[0]?.estimatedValue || 1850}</span>
              </div>
            </div>

            {/* 3-Bin Realtime Flow Status */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                <span className="font-bold block text-sm">绿桶 (纯有机)</span>
                <span className="text-[10px] text-emerald-600">直通香草园堆肥</span>
              </div>
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                <span className="font-bold block text-sm">红桶 (硬骨硬壳)</span>
                <span className="text-[10px] text-rose-600">防止损伤粉碎机</span>
              </div>
              <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-800">
                <span className="font-bold block text-sm">蓝桶 (塑料纸巾)</span>
                <span className="text-[10px] text-sky-600">防止微塑料进土</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>残羹大数据反哺后厨次日备餐削峰减量</span>
            <button
              onClick={() => onNavigateTab('esg')}
              className="text-emerald-700 underline font-semibold hover:text-emerald-800 cursor-pointer"
            >
              查看 ESG 削峰明细
            </button>
          </div>
        </div>
      </div>

      {/* Waitstaff Mobile Entry Highlight Banner */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <Smartphone className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-serif">
                服务员随身移动端 (Sheraton Associate App) 协同
              </h3>
              <span className="text-xs text-slate-500">现场巡台迎宾、过敏原浮现、点餐房账结算与一键换盘销单</span>
            </div>
          </div>
          <button
            onClick={onOpenPda}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <span>进入服务员手机端入口</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-stone-50/70 border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">早餐迎宾核销功能</div>
              <div className="font-bold text-slate-800 mt-0.5">查包早 / 防蹭早预警 / 记入房账</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50/70 border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">住客饮食禁忌自动浮现</div>
              <div className="font-bold text-slate-800 mt-0.5">过敏原红线 / 现场新增口味偏好</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-stone-50/70 border border-emerald-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-500 text-[11px]">散点台位看板与房账</div>
              <div className="font-bold text-slate-800 mt-0.5">台态实时更新 / 电子签名挂房账</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
