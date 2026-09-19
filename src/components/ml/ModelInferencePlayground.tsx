import React, { useState } from 'react';
import { 
  Play, 
  Cpu, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Camera, 
  Upload, 
  Eye, 
  Flame, 
  Sliders,
  Send,
  ArrowRight,
  ShieldAlert,
  Droplets,
  AlertOctagon,
  Hand,
  Utensils
} from 'lucide-react';
import { DishTrainingProfile, FoodSampleImage, StationAnomaly } from '../../types';
import { playScanBeep, playSuccessChime, playAlertSiren } from '../../utils/audio';
import { getAnomalyDefinition } from '../../data/anomalyTaxonomy';

interface ModelInferencePlaygroundProps {
  currentModel: DishTrainingProfile;
  audioMuted: boolean;
  onDispatchLiveTest?: () => void;
}

export const ModelInferencePlayground: React.FC<ModelInferencePlaygroundProps> = ({
  currentModel,
  audioMuted,
  onDispatchLiveTest
}) => {
  // Test Image Options (Derived from normal & abnormal samples)
  const allTestSamples: FoodSampleImage[] = [
    ...(currentModel.normalSamples || []),
    ...(currentModel.abnormalSamples || [])
  ];

  const [selectedSampleId, setSelectedSampleId] = useState<string>(
    allTestSamples[0]?.id || ''
  );
  const [isRunningInference, setIsRunningInference] = useState<boolean>(false);
  const [inferenceResult, setInferenceResult] = useState<{
    status: 'normal' | 'abnormal';
    detectedClass: string;
    majorCategoryLabel?: string;
    impact?: string;
    sopAction?: string;
    confidence: number;
    latencyMs: number;
    deltaE: number;
    heatMapActive: boolean;
    recommendation: string;
  } | null>(null);

  const [showHeatMap, setShowHeatMap] = useState<boolean>(false);

  const activeSample = allTestSamples.find(s => s.id === selectedSampleId) || allTestSamples[0];

  // Execute Live Edge AI Inference
  const handleRunInference = () => {
    if (!activeSample) return;
    if (!audioMuted) playScanBeep();

    setIsRunningInference(true);
    setInferenceResult(null);

    setTimeout(() => {
      setIsRunningInference(false);
      const isSampleNormal = activeSample.category === 'normal';

      if (isSampleNormal) {
        if (!audioMuted) playSuccessChime();
        setInferenceResult({
          status: 'normal',
          detectedClass: '✅ 正常状态：五星标准黄金摆盘 (Compliant Presentation)',
          majorCategoryLabel: '0. 正常合规状态',
          confidence: +(0.98 + Math.random() * 0.015).toFixed(3),
          latencyMs: +(12.2 + Math.random() * 3.1).toFixed(1),
          deltaE: activeSample.deltaE,
          heatMapActive: false,
          recommendation: '菜品状态与摆盘规范符合主厨出品基准，无需服务员介入干预。'
        });
      } else {
        if (!audioMuted) playAlertSiren();
        const firstBox = activeSample.annotations[0];
        const anomalyDef = getAnomalyDefinition(firstBox?.anomalyType);

        setInferenceResult({
          status: 'abnormal',
          detectedClass: anomalyDef?.name || firstBox?.label || '🚨 异常食安风险：检出违规行为/污染',
          majorCategoryLabel: anomalyDef?.majorCategoryLabel || '食安违规',
          impact: anomalyDef?.impact || '可能造成交叉污染与食安隐患',
          sopAction: anomalyDef?.sopAction || '下发 PDA 巡台工单进行换盘或清理',
          confidence: +(firstBox?.confidence || 0.984).toFixed(3),
          latencyMs: +(13.8 + Math.random() * 2.5).toFixed(1),
          deltaE: activeSample.deltaE,
          heatMapActive: true,
          recommendation: '系统已准确拦截异常事件，建议联动 PDA 下发服务员换盘或换夹指令！'
        });
      }
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 font-serif">
            <Cpu className="w-4 h-4 text-emerald-600" />
            菜品状态机器学习识别推理沙盒 (Inference Playground)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            在此选择现场抓拍或上传帧，调用微调后的 YOLO-Pose + 色差网络进行实时模型验证
          </p>
        </div>

        <button
          disabled={isRunningInference}
          onClick={handleRunInference}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer ${
            isRunningInference
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-200'
          }`}
        >
          {isRunningInference ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>模型边缘推理中...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>立即执行机器学习模型推理</span>
            </>
          )}
        </button>
      </div>

      {/* Test Sample Selector Row */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-slate-600 block">选择测试输入图像 (正常 / 异常双类别测试集):</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {allTestSamples.map((sample, idx) => {
            const isSelected = sample.id === selectedSampleId;
            const isNorm = sample.category === 'normal';

            return (
              <div
                key={sample.id}
                onClick={() => {
                  setSelectedSampleId(sample.id);
                  setInferenceResult(null);
                }}
                className={`p-2 rounded-xl border transition-all cursor-pointer flex gap-2 items-center ${
                  isSelected 
                    ? 'bg-emerald-50 border-emerald-400 shadow-2xs ring-2 ring-emerald-300' 
                    : 'bg-stone-50 border-slate-200 hover:bg-emerald-50/30'
                }`}
              >
                <img
                  src={sample.imageUrl}
                  alt={sample.title}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200"
                />
                <div className="min-w-0 flex-1">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded block w-max ${
                    isNorm ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {isNorm ? '1. 正常状态' : '2. 异常状态'}
                  </span>
                  <p className="text-[11px] font-medium text-slate-800 truncate mt-1">
                    {sample.title}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inference Canvas & Live Output Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-2">
        {/* Left: Input Frame Viewport with AI Overlays (7 cols) */}
        <div className="lg:col-span-7">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-inner group select-none">
            {activeSample ? (
              <>
                <img
                  src={activeSample.imageUrl}
                  alt={activeSample.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Simulated Grad-CAM Heatmap when Toggled or Abnormal */}
                {showHeatMap && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/30 via-amber-500/35 to-emerald-500/20 mix-blend-overlay pointer-events-none"></div>
                )}

                {/* Bounding Box on Active Sample */}
                {inferenceResult && activeSample.annotations.map(box => {
                  const isBoxNorm = box.category === 'normal';
                  return (
                    <div
                      key={box.id}
                      style={{
                        left: `${box.x}%`,
                        top: `${box.y}%`,
                        width: `${box.width}%`,
                        height: `${box.height}%`
                      }}
                      className={`absolute rounded-lg border-2 z-20 animate-in zoom-in-95 ${
                        isBoxNorm 
                          ? 'border-emerald-400 bg-emerald-500/20 ring-2 ring-emerald-300' 
                          : 'border-rose-500 bg-rose-500/25 ring-2 ring-rose-300'
                      }`}
                    >
                      <div className={`absolute -top-6 left-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap text-white ${
                        isBoxNorm ? 'bg-emerald-600' : 'bg-rose-600'
                      }`}>
                        {box.label} {(inferenceResult.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  );
                })}

                {/* Top Corner Badge */}
                <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded bg-black/60 backdrop-blur-xs text-white text-[10px] font-mono flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>4K 输入流 · TensorRT 加速加速核就绪</span>
                </div>
              </>
            ) : null}
          </div>

          <div className="flex items-center justify-between text-xs mt-2 px-1 text-slate-500">
            <span>分辨率: 3840x2160 UHD</span>
            <button
              onClick={() => setShowHeatMap(!showHeatMap)}
              className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{showHeatMap ? '隐藏 Grad-CAM 特征热力图' : '开启 Grad-CAM 缺陷注意力热力图'}</span>
            </button>
          </div>
        </div>

        {/* Right: Real-Time Inference Output Diagnostics (5 cols) */}
        <div className="lg:col-span-5 bg-stone-50 rounded-xl border border-emerald-100 p-4 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-800 block pb-2 border-b border-slate-200 flex items-center justify-between">
              <span>模型实时推理诊断报告</span>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100/60 px-1.5 py-0.5 rounded">
                YOLOv11-FoodPose
              </span>
            </span>

            {inferenceResult ? (
              <div className="mt-3 space-y-3">
                {/* Result Status Banner */}
                <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  inferenceResult.status === 'normal' 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}>
                  {inferenceResult.status === 'normal' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs block">
                        {inferenceResult.detectedClass}
                      </span>
                      {inferenceResult.majorCategoryLabel && (
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold shrink-0 ${
                          inferenceResult.status === 'normal' ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-200 text-rose-900'
                        }`}>
                          {inferenceResult.majorCategoryLabel}
                        </span>
                      )}
                    </div>

                    {inferenceResult.impact && (
                      <div className="text-[10px] text-rose-800 bg-white/70 p-1.5 rounded border border-rose-200/60 leading-relaxed">
                        <b>食安风险: </b>{inferenceResult.impact}
                      </div>
                    )}

                    {inferenceResult.sopAction && (
                      <div className="text-[10px] text-emerald-800 bg-white/70 p-1.5 rounded border border-emerald-200/60 leading-relaxed">
                        <b>联动 SOP: </b>{inferenceResult.sopAction}
                      </div>
                    )}

                    <p className="text-[11px] opacity-90 leading-relaxed pt-0.5">
                      {inferenceResult.recommendation}
                    </p>
                  </div>
                </div>

                {/* Telemetry Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">模型置信度 (Confidence)</span>
                    <b className="text-emerald-800 text-sm">{(inferenceResult.confidence * 100).toFixed(1)}%</b>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">端侧推理延迟 (Latency)</span>
                    <b className="text-slate-800 text-sm">{inferenceResult.latencyMs} ms</b>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">表面多光谱色差 (ΔE)</span>
                    <b className={`${inferenceResult.deltaE > 4.0 ? 'text-rose-600' : 'text-emerald-700'} text-sm`}>
                      ΔE {inferenceResult.deltaE}
                    </b>
                  </div>

                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">边缘量化格式</span>
                    <b className="text-slate-700 text-sm">INT8 TensorRT</b>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Cpu className="w-8 h-8 mx-auto text-slate-300 stroke-1" />
                <p className="text-xs">点击上方按钮，即可用当前训练权重对选定图片进行端侧毫秒级推理</p>
              </div>
            )}
          </div>

          {/* Quick link to live station */}
          {onDispatchLiveTest && (
            <button
              onClick={onDispatchLiveTest}
              className="w-full py-2 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
            >
              <span>前往「取餐档口双目防线」查看现场半球实拍</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
