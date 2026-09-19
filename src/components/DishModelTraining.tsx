import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Sparkles, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  Cpu, 
  RefreshCw, 
  Play, 
  Eye, 
  AlertTriangle, 
  Plus, 
  Tag, 
  Check, 
  X,
  Lock,
  ChevronRight,
  Database,
  BarChart3,
  ArrowRight,
  Crosshair,
  Maximize2
} from 'lucide-react';
import { DishTrainingProfile, StationId, BuffetStation, FoodSampleImage } from '../types';
import { playSuccessChime, playScanBeep } from '../utils/audio';
import { FoodAnnotationCanvas } from './ml/FoodAnnotationCanvas';
import { ModelInferencePlayground } from './ml/ModelInferencePlayground';
import { TrainingMetricsCard } from './ml/TrainingMetricsCard';

interface DishModelTrainingProps {
  stations: BuffetStation[];
  dishModels: DishTrainingProfile[];
  setDishModels: React.Dispatch<React.SetStateAction<DishTrainingProfile[]>>;
  audioMuted: boolean;
  onDeployToStation?: (stationId: StationId) => void;
}

export const DishModelTraining: React.FC<DishModelTrainingProps> = ({
  stations,
  dishModels,
  setDishModels,
  audioMuted,
  onDeployToStation
}) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(dishModels[0]?.id || '');
  
  // Active Studio Mode: 'annotation' (数据标注) | 'inference' (实时推理) | 'metrics' (训练指标) | 'capture' (拍摄录入)
  const [studioMode, setStudioMode] = useState<'annotation' | 'inference' | 'metrics' | 'capture'>('annotation');

  // Annotation Tab: Filter by 'normal' vs 'abnormal'
  const [sampleCategoryFilter, setSampleCategoryFilter] = useState<'all' | 'normal' | 'abnormal'>('all');
  const [selectedSampleIndex, setSelectedSampleIndex] = useState<number>(0);

  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [trainingProgress, setTrainingProgress] = useState<number>(0);
  const [trainingStepText, setTrainingStepText] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Dish Form State
  const [newDishName, setNewDishName] = useState<string>('');
  const [newDishNameEn, setNewDishNameEn] = useState<string>('');
  const [newStationId, setNewStationId] = useState<StationId>('hot_carvery');
  const [newImageUrl, setNewImageUrl] = useState<string>('https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80');
  const [newNotes, setNewNotes] = useState<string>('重点监控顾客直接徒手拿取与保温灯下发干氧化');
  const [newTargets, setNewTargets] = useState({
    handContact: true,
    tongsDropped: true,
    dryingDepletion: true,
    colorShift: true,
    soupSpill: false
  });

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const currentModel = dishModels.find(m => m.id === selectedModelId) || dishModels[0];

  // Derive normal and abnormal samples from current model
  const normalSamples = currentModel?.normalSamples || [];
  const abnormalSamples = currentModel?.abnormalSamples || [];

  const displaySamples: FoodSampleImage[] = sampleCategoryFilter === 'normal'
    ? normalSamples
    : sampleCategoryFilter === 'abnormal'
      ? abnormalSamples
      : [...normalSamples, ...abnormalSamples];

  const currentActiveSample = displaySamples[selectedSampleIndex] || displaySamples[0];

  // Presets for quick adding realistic luxury hotel dishes
  const SAMPLE_PRESETS = [
    {
      name: '法式黑松露滑蛋与烟熏三文鱼',
      nameEn: 'Truffle Scrambled Eggs & Smoked Salmon',
      stationId: 'hot_carvery' as StationId,
      url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600&auto=format&fit=crop&q=80',
      notes: '重点监测蛋液久放凝固干涸与餐夹滑落'
    },
    {
      name: '炭烤伊比利亚黑猪梅肉',
      nameEn: 'Grilled Iberico Pork Pluma',
      stationId: 'hot_carvery' as StationId,
      url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      notes: '重点监测肉汁滴落飞溅与徒手抓取'
    },
    {
      name: '时令无花果与布拉塔水牛芝士',
      nameEn: 'Seasonal Figs & Burrata Salad',
      stationId: 'vegan_bar' as StationId,
      url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      notes: '监测果肉氧化变黑与飞虫接触'
    },
    {
      name: '杨枝甘露与手工马卡龙',
      nameEn: 'Mango Pomelo Sago & Macarons',
      stationId: 'fruit_dessert' as StationId,
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      notes: '监测徒手抓甜品与果盘剩余低于20%'
    }
  ];

  // Trigger Edge Model Re-Training
  const handleStartTraining = (modelId: string) => {
    if (!audioMuted) playScanBeep();
    setIsTraining(true);
    setTrainingProgress(10);
    setTrainingStepText('正在加载 [1. 正常状态] 与 [2. 异常状态] 双类别标注样本集 (400+ 帧)...');

    setTimeout(() => {
      setTrainingProgress(35);
      setTrainingStepText('YOLOv11-Pose 人手骨架姿态拓扑与夹具几何特征微调 (Fine-tuning)...');
    }, 700);

    setTimeout(() => {
      setTrainingProgress(70);
      setTrainingStepText('多光谱表面反射率 (CIELAB ΔE) 氧化褐变感知网络梯度优化...');
    }, 1500);

    setTimeout(() => {
      setTrainingProgress(92);
      setTrainingStepText('端侧去人脸隐私脱敏 & 模型 INT8 TensorRT 量化编译...');
    }, 2200);

    setTimeout(() => {
      setTrainingProgress(100);
      setTrainingStepText('训练完成！已成功下发至餐台边缘智能相机加速卡！');
      setIsTraining(false);
      if (!audioMuted) playSuccessChime();

      setDishModels(prev => prev.map(m => {
        if (m.id === modelId) {
          return {
            ...m,
            sampleCount: m.sampleCount + 30,
            lastTrained: '刚刚 (本地双类别微调完成)',
            modelAccuracy: Math.min(99.6, +(m.modelAccuracy + 0.3).toFixed(1)),
            status: 'trained'
          };
        }
        return m;
      }));

      showToast('🧠 机器学习微调完成！菜品模型已同步至餐台半球摄像机，实时识别中！');
    }, 2900);
  };

  // Submit New Dish
  const handleSaveNewDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishName.trim()) return;

    const st = stations.find(s => s.id === newStationId);
    const newProfile: DishTrainingProfile = {
      id: `dish_${Date.now()}`,
      dishName: newDishName.trim(),
      dishNameEn: newDishNameEn.trim() || 'Custom Hotel Dish',
      stationId: newStationId,
      stationName: st?.name || '自助餐台',
      imageUrl: newImageUrl,
      sampleCount: 150,
      lastTrained: '等待首次双类别标定训练',
      modelAccuracy: 95.0,
      status: 'pending',
      detectionTargets: { ...newTargets },
      notes: newNotes,
      normalSamples: [
        {
          id: `norm_${Date.now()}`,
          title: '刚出餐标准黄金摆盘 (初版基准帧)',
          category: 'normal',
          imageUrl: newImageUrl,
          captureSource: 'kitchen_lightbox',
          captureSourceLabel: '后厨出餐拍摄台 (5500K)',
          resolution: '3840x2160 (4K UHD)',
          lightingLux: 850,
          cielabL: 50.0,
          cielabA: 20.0,
          cielabB: 15.0,
          deltaE: 1.0,
          statusDescription: '五星级酒店标准备餐陈列，专用取餐夹归位就绪。',
          isAnnotated: true,
          annotations: [
            {
              id: `b_norm_${Date.now()}`,
              label: '标准满盘陈列',
              category: 'normal',
              x: 15,
              y: 20,
              width: 70,
              height: 60,
              confidence: 0.99,
              color: '#10b981'
            }
          ]
        }
      ],
      abnormalSamples: [
        {
          id: `abn_${Date.now()}`,
          title: '模拟徒手抓取/餐夹滑落异常帧',
          category: 'abnormal',
          imageUrl: newImageUrl,
          captureSource: '4k_dome_camera',
          captureSourceLabel: '4K 半球顶摄模拟异常',
          resolution: '3840x2160 (4K UHD)',
          lightingLux: 820,
          cielabL: 46.0,
          cielabA: 18.0,
          cielabB: 12.0,
          deltaE: 4.5,
          statusDescription: '手指直接伸入盘内或器具滑落汤汁。',
          isAnnotated: true,
          annotations: [
            {
              id: `b_abn_${Date.now()}`,
              label: '⚠️ 异常食安行为',
              category: 'abnormal',
              anomalyType: 'hand_contact',
              x: 35,
              y: 30,
              width: 35,
              height: 40,
              confidence: 0.97,
              color: '#e11d48'
            }
          ]
        }
      ]
    };

    setDishModels(prev => [newProfile, ...prev]);
    setSelectedModelId(newProfile.id);
    setShowAddModal(false);
    setNewDishName('');
    setNewDishNameEn('');
    showToast(`✅ 新菜品 [${newProfile.dishName}] 样本库录入成功！可进行数据标注与模型训练。`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-emerald-300 text-slate-800 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur animate-in fade-in">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      {/* Top Banner: Core Architecture Narrative (Starting Point of the AI System) */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
                <BrainCircuit className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-serif">
                  菜品状态机器学习识别与训练工坊 (ML Food State Studio)
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-800 font-bold">
                    算法系统核心起点
                  </span>
                </h2>
                <p className="text-xs text-slate-600 mt-0.5 max-w-3xl leading-relaxed">
                  现场半球摄像机之所以能够精准拦截违规与变质，源于在此对菜品进行大量拍摄采集，并严格区分为<b>「1. 正常状态下的菜品 (Ground Truth)」</b>与<b>「2. 异常状态下的菜品 (Violations & Edge Cases)」</b>进行多模态数据标注与轻量化边缘模型微调训练。
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>拍摄/录入新菜品</span>
            </button>

            {onDeployToStation && (
              <button
                onClick={() => {
                  if (!audioMuted) playSuccessChime();
                  showToast(`🚀 菜品模型权重已成功同步至 [${currentModel.stationName}]，即将进入现场双目防线！`);
                  setTimeout(() => {
                    onDeployToStation(currentModel.stationId);
                  }, 800);
                }}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                title="将当前模型权重一键下发到对应餐台"
              >
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>下发模型至取餐档口</span>
              </button>
            )}
          </div>
        </div>

        {/* 4-Step Life-Cycle Workflow Stepper */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div 
            onClick={() => setStudioMode('capture')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              studioMode === 'capture' 
                ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300' 
                : 'bg-stone-50/60 border-slate-200 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">步骤 1: 拍摄与样本采集</span>
              <Camera className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="font-bold text-slate-900 mt-1 block">4K顶摄 / 后厨打光台</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">定焦拍摄采集真实盘面</span>
          </div>

          <div 
            onClick={() => setStudioMode('annotation')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              studioMode === 'annotation' 
                ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300' 
                : 'bg-stone-50/60 border-slate-200 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-800">步骤 2: 双类别数据标注</span>
              <Tag className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="font-bold text-emerald-950 mt-1 block">1.正常 vs 2.异常状态</span>
            <span className="text-[10px] text-emerald-700 mt-0.5 block">标定徒手/掉夹/变质区域</span>
          </div>

          <div 
            onClick={() => setStudioMode('metrics')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              studioMode === 'metrics' 
                ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300' 
                : 'bg-stone-50/60 border-slate-200 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">步骤 3: 机器学习模型微调</span>
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="font-bold text-slate-900 mt-1 block">YOLOv11-Pose 拓扑学习</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">Loss收敛与混淆矩阵评估</span>
          </div>

          <div 
            onClick={() => setStudioMode('inference')}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              studioMode === 'inference' 
                ? 'bg-emerald-50 border-emerald-400 ring-1 ring-emerald-300' 
                : 'bg-stone-50/60 border-slate-200 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">步骤 4: 实时推理验证沙盒</span>
              <Play className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <span className="font-bold text-slate-900 mt-1 block">毫秒级识别 Playground</span>
            <span className="text-[10px] text-slate-500 mt-0.5 block">验证正常放行与异常警报</span>
          </div>
        </div>
      </div>

      {/* Main Studio Layout: Left Dish Selector + Right Workspace Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Dish Profiles & Dataset Overview (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-emerald-100 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              已录入菜品模型样本库
            </span>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              {dishModels.length} 个招牌菜
            </span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {dishModels.map(m => {
              const isSelected = m.id === selectedModelId;
              const normCount = m.normalSamples?.length || 0;
              const abnCount = m.abnormalSamples?.length || 0;

              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedModelId(m.id);
                    setSelectedSampleIndex(0);
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 items-center ${
                    isSelected 
                      ? 'bg-emerald-50/90 border-emerald-400 shadow-xs ring-1 ring-emerald-300' 
                      : 'bg-stone-50/60 border-slate-200 hover:bg-emerald-50/30'
                  }`}
                >
                  <img
                    src={m.imageUrl}
                    alt={m.dishName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-lg object-cover border border-emerald-200 shrink-0 shadow-2xs"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {m.dishName}
                      </h4>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded border border-emerald-200">
                        {m.modelAccuracy}%
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-500 truncate mt-0.5">
                      {m.stationName}
                    </p>

                    {/* Dual Category Sample Badges */}
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100/80 text-emerald-800 font-medium">
                        正常: {normCount}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100/80 text-rose-800 font-medium">
                        异常: {abnCount}
                      </span>
                      <span className="text-[9px] text-slate-400 ml-auto font-mono">
                        {m.lastTrained}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Trigger Fine-tune */}
          <div className="pt-2 border-t border-slate-100">
            <button
              disabled={isTraining}
              onClick={() => handleStartTraining(currentModel.id)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                isTraining
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{isTraining ? '模型双类别微调中...' : '对选中菜品执行机器学习微调'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Studio Work Area (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Studio Sub-Navigation Bar */}
          <div className="bg-white border border-emerald-100 rounded-2xl p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setStudioMode('annotation')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  studioMode === 'annotation'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>🏷️ 菜品状态标注工坊 (双类别标注)</span>
              </button>

              <button
                onClick={() => setStudioMode('inference')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  studioMode === 'inference'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>⚡ 实时推理验证沙盒 (Playground)</span>
              </button>

              <button
                onClick={() => setStudioMode('metrics')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  studioMode === 'metrics'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>📊 模型训练评估指标</span>
              </button>
            </div>

            {/* Current Active Model Indicator */}
            <div className="text-right text-xs">
              <span className="text-slate-400 font-mono text-[11px] block">当前工坊菜品</span>
              <span className="font-bold text-slate-800">{currentModel.dishName}</span>
            </div>
          </div>

          {/* Training Progress Bar when Triggered */}
          {isTraining && (
            <div className="p-4 rounded-2xl bg-white border-2 border-emerald-300 shadow-sm space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>{trainingStepText}</span>
                </span>
                <span className="font-mono text-sm">{trainingProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-emerald-100 overflow-hidden">
                <div 
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${trainingProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* VIEW 1: DATASET & ANNOTATION STUDIO (The user's core request: 1. Normal vs 2. Abnormal) */}
          {studioMode === 'annotation' && (
            <div className="space-y-4">
              {/* Category Filter Pills (Normal vs Abnormal) */}
              <div className="bg-white border border-emerald-100 rounded-2xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">筛选标注类别：</span>
                  
                  <button
                    onClick={() => {
                      setSampleCategoryFilter('all');
                      setSelectedSampleIndex(0);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      sampleCategoryFilter === 'all'
                        ? 'bg-slate-800 text-white font-bold shadow-2xs'
                        : 'bg-stone-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    全部样本 ({normalSamples.length + abnormalSamples.length})
                  </button>

                  <button
                    onClick={() => {
                      setSampleCategoryFilter('normal');
                      setSelectedSampleIndex(0);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      sampleCategoryFilter === 'normal'
                        ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                        : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1. 正常情况下的菜品 ({normalSamples.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setSampleCategoryFilter('abnormal');
                      setSelectedSampleIndex(0);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                      sampleCategoryFilter === 'abnormal'
                        ? 'bg-rose-600 text-white font-bold shadow-2xs'
                        : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>2. 异常情况下的菜品 ({abnormalSamples.length})</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400">
                  共 {displaySamples.length} 张标定帧 · 当前查看第 {selectedSampleIndex + 1} 张
                </div>
              </div>

              {/* Sample Thumbnails Carousel */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {displaySamples.map((sample, idx) => {
                  const isCur = idx === selectedSampleIndex;
                  const isNorm = sample.category === 'normal';

                  return (
                    <div
                      key={sample.id}
                      onClick={() => setSelectedSampleIndex(idx)}
                      className={`shrink-0 p-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-2 max-w-xs ${
                        isCur 
                          ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 shadow-2xs' 
                          : 'bg-white border-slate-200 hover:bg-emerald-50/40'
                      }`}
                    >
                      <img
                        src={sample.imageUrl}
                        alt={sample.title}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                      <div className="truncate min-w-0 pr-1">
                        <span className={`text-[9px] px-1 rounded block w-max ${
                          isNorm ? 'bg-emerald-100 text-emerald-800 font-semibold' : 'bg-rose-100 text-rose-800 font-semibold'
                        }`}>
                          {isNorm ? '1. 正常样本' : '2. 异常样本'}
                        </span>
                        <p className="text-[11px] font-medium text-slate-800 truncate mt-0.5">
                          {sample.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Annotation Canvas */}
              {currentActiveSample ? (
                <FoodAnnotationCanvas
                  sample={currentActiveSample}
                  audioMuted={audioMuted}
                />
              ) : (
                <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                  当前类别暂无样本，请点击上方“拍摄/录入新菜品”
                </div>
              )}
            </div>
          )}

          {/* VIEW 2: REAL-TIME INFERENCE PLAYGROUND */}
          {studioMode === 'inference' && (
            <ModelInferencePlayground
              currentModel={currentModel}
              audioMuted={audioMuted}
              onDispatchLiveTest={() => {
                if (onDeployToStation) {
                  onDeployToStation(currentModel.stationId);
                }
              }}
            />
          )}

          {/* VIEW 3: TRAINING & METRICS DASHBOARD */}
          {studioMode === 'metrics' && (
            <TrainingMetricsCard
              currentModel={currentModel}
            />
          )}

          {/* VIEW 4: CAPTURE & INGESTION GUIDANCE */}
          {studioMode === 'capture' && (
            <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <Camera className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-serif">
                    高清拍摄采集标准与环境校准 (Capture & Ingestion Standard)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    为保证机器学习模型在现场 4K 半球相机下达到 98%+ 准确率，需遵循以下拍摄规程
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-stone-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">① 光照与色温基准</span>
                  <p className="text-slate-600 leading-relaxed">
                    使用无频闪 LED 灯光，照度 800~1000 LUX，色温标定 5500K (CRI &gt; 95)，确保三文鱼与生鲜肉类的 CIELAB 色空间基准稳定。
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">② 视角与镜头防油烟</span>
                  <p className="text-slate-600 leading-relaxed">
                    取餐台采用 90° 垂直俯拍顶摄，镜头加装纳米疏水防油烟镀膜，避免水汽与油脂凝结导致特征边缘模糊。
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-stone-50 border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800 block">③ 样本双类别配比</span>
                  <p className="text-slate-600 leading-relaxed">
                    每道菜品需采集 100+ 正常标准摆盘与 50+ 异常负样本（徒手接触、夹子滑落、汤汁泼洒、久烤发干），保证鲁棒性。
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="text-xs text-emerald-900">
                  <span className="font-bold block">准备好采集新的菜品实况？</span>
                  <span className="text-[11px] opacity-90">可直接录入或从预设中选择豪华菜品直接标定</span>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  立即录入新菜品
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Quick Add New Dish */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-emerald-200 shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 font-serif">
                  拍摄采集与录入新菜品模型
                </h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div>
              <span className="text-xs font-medium text-slate-600 block mb-1.5">
                快速套用五星级招牌菜模板:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNewDishName(p.name);
                      setNewDishNameEn(p.nameEn);
                      setNewStationId(p.stationId);
                      setNewImageUrl(p.url);
                      setNewNotes(p.notes);
                    }}
                    className="p-2 rounded-xl border border-slate-200 text-left hover:border-emerald-400 hover:bg-emerald-50/50 text-xs transition-all cursor-pointer flex items-center gap-2"
                  >
                    <img src={p.url} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                    <span className="truncate font-medium text-slate-800">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveNewDish} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">菜品中文名称 *</label>
                  <input
                    type="text"
                    required
                    value={newDishName}
                    onChange={(e) => setNewDishName(e.target.value)}
                    placeholder="如：深海银鳕鱼香煎"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">英文名称 (OSD 显示)</label>
                  <input
                    type="text"
                    value={newDishNameEn}
                    onChange={(e) => setNewDishNameEn(e.target.value)}
                    placeholder="Pan-Seared Silver Cod"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">归属餐台档口 *</label>
                  <select
                    value={newStationId}
                    onChange={(e) => setNewStationId(e.target.value as StationId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    {stations.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">基准实拍图 URL</label>
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 truncate"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">主厨食安品控重点</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs cursor-pointer"
                >
                  确认录入并生成基准数据集
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
