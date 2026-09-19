import React, { useState } from 'react';
import { 
  Leaf, 
  TrendingDown, 
  DollarSign, 
  Sparkles, 
  ArrowDownRight, 
  CheckCircle, 
  RotateCcw, 
  CloudRain, 
  Sun, 
  Wind, 
  Utensils, 
  BarChart3, 
  Share2,
  FileCheck,
  Sprout,
  TreePine,
  Check
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { FoodWasteESGRecord, SystemStats } from '../types';
import { playSuccessChime } from '../utils/audio';

interface KitchenESGDashboardProps {
  records: FoodWasteESGRecord[];
  setRecords: React.Dispatch<React.SetStateAction<FoodWasteESGRecord[]>>;
  stats: SystemStats;
  audioMuted: boolean;
}

export const KitchenESGDashboard: React.FC<KitchenESGDashboardProps> = ({
  records,
  setRecords,
  stats,
  audioMuted
}) => {
  const [appliedPrepSheet, setAppliedPrepSheet] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleApplyToChefPrepSheet = () => {
    if (!audioMuted) playSuccessChime();
    setAppliedPrepSheet(true);
    showToast('👨‍🍳 成功同步！削峰减量建议已推送至中西厨行政主厨备餐平板 (KDS)！');
  };

  const chartData = records.map(r => ({
    name: r.category,
    original: r.originalPrepKg,
    recommended: r.recommendedPrepKg,
    wasteKg: r.historicalWasteKg,
    savingsYuan: r.costSavingsYuan
  }));

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-emerald-300 text-slate-800 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur animate-in fade-in">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner: ESG & Organic Sky Garden */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                <Leaf className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-serif">
                  后厨备餐削峰反哺 & 空中香草园有机闭环
                  <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold">
                    绿色生态全闭环
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  基于洗碗间 3 桶精准残羹与住客取食率大数据 · 动态削减过剩备餐 · 纯有机厨余 100% 堆肥回馈空中花园
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleApplyToChefPrepSheet}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                appliedPrepSheet
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {appliedPrepSheet ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{appliedPrepSheet ? '备餐削峰表已同步 KDS' : '一键推送主厨备餐平板 (KDS)'}</span>
            </button>
          </div>
        </div>

        {/* 4 ESG Metric Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[11px] text-slate-500 block">今日预计原料减损</span>
            <span className="text-xl font-bold font-mono text-emerald-800 mt-0.5 block">
              ¥{stats.kitchenPrepSavingsYuan.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 mt-1 block">
              对比传统全负荷备餐 -16.4%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[11px] text-slate-500 block">绿桶纯有机堆肥</span>
            <span className="text-xl font-bold font-mono text-emerald-700 mt-0.5 block">
              {stats.organicCompostKg} kg
            </span>
            <span className="text-[10px] text-emerald-600 mt-1 block">
              经双重微塑料筛查，纯度 99.4%
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[11px] text-slate-500 block">减少碳足迹排放</span>
            <span className="text-xl font-bold font-mono text-teal-800 mt-0.5 block">
              128.5 kg CO₂e
            </span>
            <span className="text-[10px] text-teal-600 mt-1 block">
              喜来登全球 ESG 绿色合规
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100">
            <span className="text-[11px] text-slate-500 block">30层空中花园产出</span>
            <span className="text-xl font-bold font-mono text-slate-900 mt-0.5 block">
              14.2 kg
            </span>
            <span className="text-[10px] text-emerald-700 mt-1 block">
              迷迭香 / 罗勒 / 留兰香有机自给
            </span>
          </div>
        </div>
      </div>

      {/* Main Analysis Chart & 30th Floor Sky Garden Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chef Prep Reduction Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  各品类原计划备餐 vs AI 削峰反哺建议量 (kg)
                </h3>
                <span className="text-xs text-slate-500">
                  基于过去 14 天客流量衰减模型与实时取餐速度
                </span>
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-bold">
                备餐准确率 94.8%
              </span>
            </div>

            {/* Recharts Container */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      borderColor: '#10b981', 
                      borderRadius: '12px',
                      color: '#0f172a',
                      fontSize: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="original" name="原常规备餐量 (kg)" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="recommended" name="AI 建议削峰量 (kg)" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>减量集中在烘焙欧包与冷盘三文鱼，保鲜要求极高品类建议实行“多批次小批量备餐”</span>
            <span className="text-emerald-700 font-bold font-mono">节省 ¥{stats.kitchenPrepSavingsYuan}</span>
          </div>
        </div>

        {/* Right: 30th Floor Sky Herb Garden Organic Showcase (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
                  <TreePine className="w-4 h-4 text-emerald-600" />
                  30层空中香草园 (Sky Herb Garden)
                </h3>
                <span className="text-xs text-slate-500">
                  餐桌上的香草 &rarr; 绿桶发酵堆肥 &rarr; 有机土壤自给闭环
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold">
                100% 闭环
              </span>
            </div>

            {/* Garden Live Sensors */}
            <div className="grid grid-cols-3 gap-2 text-xs text-center font-mono">
              <div className="p-2.5 rounded-xl bg-stone-50 border border-slate-200">
                <Sun className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">日照指数</span>
                <span className="font-bold text-slate-800">5.8 hrs</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-slate-200">
                <CloudRain className="w-4 h-4 text-sky-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">土壤湿度</span>
                <span className="font-bold text-emerald-700">62% (理想)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-50 border border-slate-200">
                <Wind className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <span className="text-[10px] text-slate-500 block">堆肥成熟度</span>
                <span className="font-bold text-emerald-700">92%</span>
              </div>
            </div>

            {/* Plants In Cultivation */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800">当前在育五星级料理香草:</span>
              
              <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">意大利甜罗勒 (Sweet Basil)</div>
                  <div className="text-[10px] text-slate-500">专供西餐档手工青酱与玛格丽特披萨</div>
                </div>
                <span className="font-mono text-emerald-700 font-bold">4.8 kg/周</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">直立迷迭香 (Tuscan Rosemary)</div>
                  <div className="text-[10px] text-slate-500">专供战斧牛排与法式烤春鸡烟熏</div>
                </div>
                <span className="font-mono text-emerald-700 font-bold">5.2 kg/周</span>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-800">留兰香薄荷 (Spearmint)</div>
                  <div className="text-[10px] text-slate-500">专供大堂吧鸡尾酒与早餐冷萃柠檬茶</div>
                </div>
                <span className="font-mono text-emerald-700 font-bold">4.2 kg/周</span>
              </div>
            </div>

            {/* ESG Certification badge */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                ESG
              </div>
              <div className="text-[11px] text-slate-700">
                <span className="font-bold text-emerald-900 block">五星级绿色全日餐厅认证金奖</span>
                年均节约清运费 ¥42,000，纯有机闭环获集团可持续发展年度嘉奖。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
