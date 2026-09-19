import React from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  CheckCircle, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  Sparkles 
} from 'lucide-react';
import { DishTrainingProfile } from '../../types';

interface TrainingMetricsCardProps {
  currentModel: DishTrainingProfile;
}

export const TrainingMetricsCard: React.FC<TrainingMetricsCardProps> = ({
  currentModel
}) => {
  const metrics = currentModel.trainingMetrics || {
    mAP50: 98.4,
    mAP50_95: 91.8,
    precision: 98.2,
    recall: 97.5,
    latencyMs: 14.5,
    epochs: 150,
    lossCurve: [0.85, 0.48, 0.31, 0.2, 0.13, 0.08, 0.045]
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 font-serif">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            模型训练收敛与评估指标 (Training & Validation Metrics)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            针对「正常菜品」与「异常菜品」双类别标注集，通过 {metrics.epochs} Epochs 边缘迁移学习收敛
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
            mAP@0.5: {metrics.mAP50}%
          </span>
        </div>
      </div>

      {/* Top 4 Core Metrics Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-stone-50 border border-slate-200">
          <span className="text-[11px] text-slate-500 block">综合准确率 (mAP@50)</span>
          <b className="text-base text-emerald-800 font-mono block mt-0.5">{metrics.mAP50}%</b>
          <span className="text-[10px] text-emerald-700 mt-0.5 block">高重叠 IoU 阈值</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-slate-200">
          <span className="text-[11px] text-slate-500 block">查准率 (Precision)</span>
          <b className="text-base text-slate-900 font-mono block mt-0.5">{metrics.precision}%</b>
          <span className="text-[10px] text-slate-500 mt-0.5 block">极低虚警率 (False Alarm)</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-slate-200">
          <span className="text-[11px] text-slate-500 block">查全率 (Recall)</span>
          <b className="text-base text-slate-900 font-mono block mt-0.5">{metrics.recall}%</b>
          <span className="text-[10px] text-slate-500 mt-0.5 block">漏检率 &lt; 2.5%</span>
        </div>

        <div className="p-3 rounded-xl bg-stone-50 border border-slate-200">
          <span className="text-[11px] text-slate-500 block">端侧推理吞吐延时</span>
          <b className="text-base text-slate-900 font-mono block mt-0.5">{metrics.latencyMs} ms</b>
          <span className="text-[10px] text-slate-500 mt-0.5 block">约 68 FPS 实时处理</span>
        </div>
      </div>

      {/* Two Column: Loss Curve + Confusion Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Loss Curve SVG */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
              Loss 损失函数收敛曲线
            </span>
            <span className="text-[10px] font-mono text-slate-400">Total Loss: 0.038</span>
          </div>

          <div className="h-28 flex items-end justify-between gap-2 px-2 pt-4 bg-white rounded-lg border border-slate-100">
            {metrics.lossCurve.map((val, idx) => {
              const heightPercent = Math.max(12, Math.round((val / 1.0) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    style={{ height: `${heightPercent}%` }} 
                    className="w-full bg-emerald-500/80 rounded-t hover:bg-emerald-600 transition-all cursor-pointer relative group"
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity font-mono pointer-events-none">
                      {val}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">
                    E{Math.round((idx + 1) * (metrics.epochs / metrics.lossCurve.length))}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Confusion Matrix (Normal vs Abnormal) */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-slate-200 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              双类别混淆矩阵 (Confusion Matrix)
            </span>
            <span className="text-[10px] text-slate-400 font-mono">F1-Score: 0.983</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-800 font-semibold block">真正常 (True Normal)</span>
              <b className="text-base text-emerald-900 font-mono">99.2%</b>
              <span className="text-[9px] text-emerald-700 block">标准摆盘精准放行</span>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-center">
              <span className="text-[10px] text-rose-800 font-semibold block">误报异常 (False Alarm)</span>
              <b className="text-base text-rose-900 font-mono">0.8%</b>
              <span className="text-[9px] text-rose-700 block">极低打扰率</span>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50/50 border border-rose-200 text-center">
              <span className="text-[10px] text-rose-800 font-semibold block">漏报异常 (Missed Alert)</span>
              <b className="text-base text-rose-900 font-mono">1.1%</b>
              <span className="text-[9px] text-rose-700 block">极低漏检率</span>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] text-emerald-800 font-semibold block">真异常 (True Abnormal)</span>
              <b className="text-base text-emerald-900 font-mono">98.9%</b>
              <span className="text-[9px] text-emerald-700 block">徒手/掉夹精准截获</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
