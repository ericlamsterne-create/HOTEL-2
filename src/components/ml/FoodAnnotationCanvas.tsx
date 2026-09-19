import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Tag, 
  Crosshair, 
  Eye, 
  Sliders, 
  Layers, 
  Camera, 
  Maximize2,
  Lock,
  Plus,
  Trash2,
  HelpCircle,
  Activity,
  ShieldAlert,
  Droplets,
  AlertOctagon,
  Hand,
  Utensils
} from 'lucide-react';
import { FoodSampleImage, FoodAnnotationBox, FoodSampleCategory, AnomalyType } from '../../types';
import { ANOMALY_TAXONOMY, MAJOR_CATEGORY_LABELS, getAnomalyDefinition } from '../../data/anomalyTaxonomy';

interface FoodAnnotationCanvasProps {
  sample: FoodSampleImage;
  onUpdateSample?: (updated: FoodSampleImage) => void;
  audioMuted: boolean;
}

export const FoodAnnotationCanvas: React.FC<FoodAnnotationCanvasProps> = ({
  sample,
  onUpdateSample,
  audioMuted
}) => {
  const [selectedBoxId, setSelectedBoxId] = useState<string | null>(
    sample.annotations[0]?.id || null
  );
  const [showKeypoints, setShowKeypoints] = useState<boolean>(true);
  const [showMasks, setShowMasks] = useState<boolean>(true);
  const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null);

  const selectedBox = sample.annotations.find(b => b.id === selectedBoxId);
  const isNormal = sample.category === 'normal';

  // Toggle or add sample annotation
  const handleSelectBox = (id: string) => {
    setSelectedBoxId(id);
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-4 shadow-xs space-y-4">
      {/* Canvas Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 shadow-2xs ${
            isNormal 
              ? 'bg-emerald-600 text-white' 
              : 'bg-rose-600 text-white'
          }`}>
            {isNormal ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>类别 1: 正常状态标定 (Normal Ground Truth)</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>类别 2: 异常违规标定 (Abnormal Violation)</span>
              </>
            )}
          </span>

          <span className="text-xs font-bold text-slate-800">
            {sample.title}
          </span>
        </div>

        {/* Display Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setShowKeypoints(!showKeypoints)}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all text-[11px] font-medium cursor-pointer ${
              showKeypoints 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold' 
                : 'bg-stone-50 border-slate-200 text-slate-500'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>YOLO-Pose 骨骼点</span>
          </button>

          <button
            onClick={() => setShowMasks(!showMasks)}
            className={`px-2.5 py-1 rounded-lg border flex items-center gap-1 transition-all text-[11px] font-medium cursor-pointer ${
              showMasks 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold' 
                : 'bg-stone-50 border-slate-200 text-slate-500'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>语义掩码/检测框</span>
          </button>
        </div>
      </div>

      {/* Anomaly Taxonomy Navigation Ribbon */}
      <div className="p-2.5 bg-stone-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>核心异常识别分类体系 (Taxonomy):</span>
        </span>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-lg bg-amber-100/80 border border-amber-300 text-amber-900 font-medium text-[10px] flex items-center gap-1">
            <Droplets className="w-3 h-3 text-amber-600" />
            <span>1. 异常液体 (跨盘互滴/生熟化水/外源喷洒)</span>
          </span>

          <span className="px-2 py-0.5 rounded-lg bg-purple-100/80 border border-purple-300 text-purple-900 font-medium text-[10px] flex items-center gap-1">
            <AlertOctagon className="w-3 h-3 text-purple-600" />
            <span>2. 异物入侵 (毛发指甲/纸屑/碎玻璃/飞虫)</span>
          </span>

          <span className="px-2 py-0.5 rounded-lg bg-rose-100/80 border border-rose-300 text-rose-900 font-medium text-[10px] flex items-center gap-1">
            <Hand className="w-3 h-3 text-rose-600" />
            <span>3.1 人手破坏 (徒手捏取/挑拣翻动/尝后退回)</span>
          </span>

          <span className="px-2 py-0.5 rounded-lg bg-rose-100/80 border border-rose-300 text-rose-900 font-medium text-[10px] flex items-center gap-1">
            <Utensils className="w-3 h-3 text-rose-600" />
            <span>3.2 工具破坏 (混夹滥用/夹柄浸没/私筷探入)</span>
          </span>
        </div>
      </div>

      {/* Main Annotation Viewport & Right Attributes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Visual Canvas (8 cols) */}
        <div className="lg:col-span-8 space-y-2">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-inner group select-none">
            {/* Real Photographic Background */}
            <img
              src={sample.imageUrl}
              alt={sample.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Dome Camera Top OSD Info */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono text-white/90 drop-shadow pointer-events-none z-10">
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{sample.captureSourceLabel}</span>
              </div>
              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded border border-white/10">
                <span>{sample.resolution}</span>
                <span>{sample.lightingLux} LUX</span>
                <span className="text-amber-300">ΔE: {sample.deltaE}</span>
              </div>
            </div>

            {/* Bounding Box Overlays */}
            {showMasks && sample.annotations.map(box => {
              const isSelected = selectedBoxId === box.id;
              const isHovered = hoveredBoxId === box.id;
              const isBoxNormal = box.category === 'normal';

              return (
                <div
                  key={box.id}
                  onClick={() => handleSelectBox(box.id)}
                  onMouseEnter={() => setHoveredBoxId(box.id)}
                  onMouseLeave={() => setHoveredBoxId(null)}
                  style={{
                    left: `${box.x}%`,
                    top: `${box.y}%`,
                    width: `${box.width}%`,
                    height: `${box.height}%`,
                    borderColor: isBoxNormal ? '#10b981' : '#e11d48',
                    backgroundColor: isBoxNormal ? 'rgba(16, 185, 129, 0.18)' : 'rgba(225, 29, 72, 0.22)'
                  }}
                  className={`absolute border-2 rounded-lg cursor-pointer transition-all z-20 ${
                    isSelected 
                      ? 'ring-4 ring-white/90 shadow-2xl scale-[1.01]' 
                      : isHovered 
                        ? 'ring-2 ring-emerald-300' 
                        : ''
                  }`}
                >
                  {/* Four Corner Calibration Marks */}
                  <span className="absolute -top-1.5 -left-1.5 w-2 h-2 border-t-2 border-l-2 border-white"></span>
                  <span className="absolute -top-1.5 -right-1.5 w-2 h-2 border-t-2 border-r-2 border-white"></span>
                  <span className="absolute -bottom-1.5 -left-1.5 w-2 h-2 border-b-2 border-l-2 border-white"></span>
                  <span className="absolute -bottom-1.5 -right-1.5 w-2 h-2 border-b-2 border-r-2 border-white"></span>

                  {/* Label Pill */}
                  <div className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap shadow-md flex items-center gap-1 ${
                    isBoxNormal ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                  }`}>
                    <Tag className="w-2.5 h-2.5" />
                    <span>{box.label}</span>
                    <span className="opacity-90 font-mono">{(box.confidence * 100).toFixed(1)}%</span>
                  </div>

                  {/* Center Target Indicator */}
                  <div className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-white animate-ping pointer-events-none"></div>
                </div>
              );
            })}

            {/* YOLO-Pose Keypoints Simulation */}
            {showKeypoints && !isNormal && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-15">
                {/* Simulated Hand-Wrist-Fingertip Skeleton lines */}
                <line x1="58%" y1="28%" x2="52%" y2="34%" stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
                <line x1="52%" y1="34%" x2="48%" y2="42%" stroke="#f43f5e" strokeWidth="2" />
                <circle cx="58%" cy="28%" r="4" fill="#fb7185" />
                <circle cx="52%" cy="34%" r="4" fill="#fb7185" />
                <circle cx="48%" cy="42%" r="5" fill="#e11d48" />
              </svg>
            )}

            {/* Privacy Strip Overlay */}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-slate-300 text-[10px] font-mono flex items-center gap-1 z-10">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>隐私合规保护：边缘脱敏已过滤人脸</span>
            </div>
          </div>

          {/* Description Below Viewport */}
          <div className="p-2.5 bg-stone-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">样本描述与标定依据：</span>
              <p className="mt-0.5 text-slate-600 leading-relaxed">{sample.statusDescription}</p>
            </div>
          </div>
        </div>

        {/* Right Details: Annotation Inspector & Ground Truth Metadata (4 cols) */}
        <div className="lg:col-span-4 bg-stone-50/80 border border-emerald-100 rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-emerald-600" />
              标注元数据与色差指标
            </span>
            <span className="text-[10px] font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500">
              {sample.annotations.length} 个标注区域
            </span>
          </div>

          {/* Active Box Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-slate-600 block">当前标注项列表:</span>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              {sample.annotations.map(b => {
                const isSelected = selectedBoxId === b.id;
                const isBBoxNormal = b.category === 'normal';

                return (
                  <div
                    key={b.id}
                    onClick={() => handleSelectBox(b.id)}
                    className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-all ${
                      isSelected 
                        ? 'bg-white border-emerald-400 shadow-2xs ring-1 ring-emerald-300 font-semibold text-slate-900' 
                        : 'bg-white/60 border-slate-200 text-slate-600 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isBBoxNormal ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      <span className="truncate text-[11px]">{b.label}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {(b.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Box Telemetry */}
          {selectedBox ? (
            <div className="p-2.5 rounded-xl bg-white border border-emerald-200 space-y-2 text-[11px]">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>选框拓扑尺寸 (BBox)</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                  selectedBox.category === 'normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}>
                  {selectedBox.category === 'normal' ? '正常状态' : '异常状态'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] text-slate-600 bg-stone-50 p-2 rounded-lg">
                <div>X: {selectedBox.x}%</div>
                <div>Y: {selectedBox.y}%</div>
                <div>W: {selectedBox.width}%</div>
                <div>H: {selectedBox.height}%</div>
              </div>

              {/* Anomaly Taxonomy Inspector */}
              {selectedBox.category === 'abnormal' && (() => {
                const anomalyDef = getAnomalyDefinition(selectedBox.anomalyType);
                return (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-medium">细分异常体系归属:</span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold ${
                        anomalyDef?.badgeColor || 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}>
                        {anomalyDef?.majorCategoryLabel || '食安异常'}
                      </span>
                    </div>

                    {anomalyDef && (
                      <div className="p-2 rounded-lg bg-rose-50/60 border border-rose-200 space-y-1 text-[10px]">
                        <div className="font-bold text-rose-900 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-rose-600" />
                          <span>{anomalyDef.name}</span>
                        </div>
                        <div className="text-slate-700">
                          <b className="text-rose-800">食安危害: </b>
                          <span>{anomalyDef.impact}</span>
                        </div>
                        <div className="text-slate-700 pt-0.5 border-t border-rose-200/60">
                          <b className="text-emerald-800">标准 SOP: </b>
                          <span>{anomalyDef.sopAction}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100">
                <span className="text-slate-500">模型建议权重:</span>
                <span className="font-bold text-emerald-700">1.0 (关键特征锚点)</span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              点击左侧画框可查看详细特征
            </div>
          )}

          {/* Spectrophotometric CIELAB Color Quality */}
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1.5 text-xs">
            <span className="font-bold text-slate-800 block text-[11px] flex items-center justify-between">
              <span>多光谱反射率 (CIELAB 色空间)</span>
              <span className={`font-mono text-[10px] px-1 rounded ${
                sample.deltaE > 4.0 ? 'bg-rose-100 text-rose-800 font-bold' : 'bg-emerald-100 text-emerald-800 font-bold'
              }`}>
                ΔE: {sample.deltaE}
              </span>
            </span>

            <div className="grid grid-cols-3 gap-1 font-mono text-[10px] text-center">
              <div className="bg-stone-50 p-1 rounded border border-slate-100">
                <span className="text-slate-400 block">明度 L*</span>
                <b className="text-slate-700">{sample.cielabL}</b>
              </div>
              <div className="bg-stone-50 p-1 rounded border border-slate-100">
                <span className="text-slate-400 block">红绿 a*</span>
                <b className="text-slate-700">{sample.cielabA}</b>
              </div>
              <div className="bg-stone-50 p-1 rounded border border-slate-100">
                <span className="text-slate-400 block">黄蓝 b*</span>
                <b className="text-slate-700">{sample.cielabB}</b>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 mt-1">
              {sample.deltaE > 4.0 
                ? '⚠️ 表面色差偏离标准样超过 4.0，模型将判定为轻度/重度氧化变色。' 
                : '✅ 表面色差处于 0~2.0 黄金新鲜度区间，符合五星级出品标准。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
