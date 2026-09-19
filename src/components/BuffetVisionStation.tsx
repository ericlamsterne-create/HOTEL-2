import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  AlertOctagon, 
  RotateCcw, 
  Droplet, 
  Sparkles, 
  RefreshCw, 
  CheckCircle, 
  Scan, 
  Eye, 
  ShieldAlert, 
  Sliders, 
  Maximize2, 
  Thermometer, 
  Send,
  HelpCircle,
  Sprout,
  Check,
  Video,
  Radio,
  UserCheck,
  Hand,
  Clock,
  BellRing,
  X,
  Volume2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { BuffetStation, StationAnomaly, StationId } from '../types';
import { playAlertSiren, playSuccessChime, playScanBeep } from '../utils/audio';
import { BuffetSceneViewport, BuffetSceneScenario } from './BuffetSceneViewport';
import { getAnomalyDefinition } from '../data/anomalyTaxonomy';

interface BuffetVisionStationProps {
  stations: BuffetStation[];
  setStations: React.Dispatch<React.SetStateAction<BuffetStation[]>>;
  anomalies: StationAnomaly[];
  setAnomalies: React.Dispatch<React.SetStateAction<StationAnomaly[]>>;
  audioMuted: boolean;
  onDispatchToPda: (anomaly: StationAnomaly) => void;
}

export const BuffetVisionStation: React.FC<BuffetVisionStationProps> = ({
  stations,
  setStations,
  anomalies,
  setAnomalies,
  audioMuted,
  onDispatchToPda
}) => {
  const [selectedStationId, setSelectedStationId] = useState<StationId>('seafood_salad');
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(anomalies[0]?.id || null);
  const [visionMode, setVisionMode] = useState<'rgb' | 'spectral' | 'thermal'>('rgb');
  const [streamMode, setStreamMode] = useState<'live_video' | 'snapshot'>('live_video');
  const [simulatingType, setSimulatingType] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Real-time dynamic timecode and FPS ticker
  const [timecode, setTimecode] = useState<string>('');
  const [liveFps, setLiveFps] = useState<number>(59.9);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [modalAnomaly, setModalAnomaly] = useState<StationAnomaly | null>(null);

  // Real-world scenario state for each station (showing actual hands/tongs in hotel platters)
  const [stationScenarios, setStationScenarios] = useState<Record<StationId, BuffetSceneScenario>>({
    seafood_salad: 'hand_contact',
    hot_carvery: 'tongs_serving',
    halal_deli: 'idle_platter',
    vegan_bar: 'idle_platter',
    fruit_dessert: 'tongs_serving'
  });

  const currentScenario = stationScenarios[selectedStationId] || 'idle_platter';

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setTimecode(`${h}:${m}:${s}.${ms}`);
      setLiveFps(+(59.6 + Math.random() * 0.7).toFixed(1));
    }, 80);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const currentStation = stations.find(s => s.id === selectedStationId) || stations[0];
  const activeAnomalies = anomalies.filter(a => a.status === 'active');
  const selectedAnomaly = anomalies.find(a => a.id === selectedAnomalyId);

  // Trigger alert modal for attendant review
  const openAttendantReview = (anomaly: StationAnomaly) => {
    setModalAnomaly(anomaly);
    setShowAlertModal(true);
    if (!audioMuted) playAlertSiren();
  };

  // Resolution 1: One-Click Replace Dish / Tray (换盘)
  const handleReplaceTray = (stationId: StationId, anomalyId?: string) => {
    if (!audioMuted) playSuccessChime();
    
    setStationScenarios(prev => ({
      ...prev,
      [stationId]: 'idle_platter'
    }));

    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        return {
          ...s,
          freshnessIndex: 98,
          deltaE: 0.8,
          oxidationStatus: 'fresh',
          trayLastReplaced: '刚刚由中控服务员复核换新',
          lowStockWarning: false
        };
      }
      return s;
    }));

    setAnomalies(prev => prev.map(a => {
      if ((anomalyId && a.id === anomalyId) || (!anomalyId && a.stationId === stationId && a.status === 'active')) {
        return {
          ...a,
          status: 'resolved',
          resolvedBy: '总台中控服务员 (现场复核整盘换新)',
          resolvedAt: new Date().toLocaleTimeString(),
          actionTaken: '完成现场复核与整盘撤换，旧盘移交洗碗间，已重新恢复卫生监控'
        };
      }
      return a;
    }));

    setShowAlertModal(false);
    showToast('🍽️ 成功下发换盘指令！新备餐盘已上架，双目半球相机重新校准。');
  };

  // Resolution 2: One-Click Replace Tongs (换夹)
  const handleReplaceTongs = (stationId: StationId, anomalyId?: string) => {
    if (!audioMuted) playSuccessChime();

    setStationScenarios(prev => ({
      ...prev,
      [stationId]: 'idle_platter'
    }));

    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        return {
          ...s,
          tongsMisplaced: false
        };
      }
      return s;
    }));

    setAnomalies(prev => prev.map(a => {
      if (a.stationId === stationId && a.type === 'tongs_misplaced' && a.status === 'active') {
        return {
          ...a,
          status: 'resolved',
          resolvedBy: '总台中控服务员 (换置色标夹具)',
          resolvedAt: new Date().toLocaleTimeString(),
          actionTaken: '现场更换合规专用标定夹，防范过敏原交叉使用'
        };
      }
      return a;
    }));

    setShowAlertModal(false);
    showToast('🔀 取餐夹已由服务员更换并归位！色标追踪恢复正常。');
  };

  // Resolution 3: Replenish Food / Call Kitchen (通知后厨补餐)
  const handleCallKitchenReplenish = (stationId: StationId, anomalyId?: string) => {
    if (!audioMuted) playSuccessChime();

    setStationScenarios(prev => ({
      ...prev,
      [stationId]: 'idle_platter'
    }));

    setStations(prev => prev.map(s => {
      if (s.id === stationId) {
        return {
          ...s,
          freshnessIndex: 96,
          lowStockWarning: false,
          trayLastReplaced: '热厨加急补菜 (已盛满)'
        };
      }
      return s;
    }));

    setAnomalies(prev => prev.map(a => {
      if ((anomalyId && a.id === anomalyId) || (!anomalyId && a.stationId === stationId && a.type === 'food_drying_depletion')) {
        return {
          ...a,
          status: 'resolved',
          resolvedBy: '总台中控服务员 (联络热厨补餐)',
          resolvedAt: new Date().toLocaleTimeString(),
          actionTaken: '已通知后厨切配出餐，新菜品已加满保温炉'
        };
      }
      return a;
    }));

    setShowAlertModal(false);
    showToast('👨‍🍳 已联络热厨加急补餐！新菜品已上台，低余量警告解除。');
  };

  // Simulation 1: 模拟人违规行为 - 顾客徒手直接抓取菜品 (Hand Contact)
  const injectHandContact = () => {
    setSimulatingType('hand');
    if (!audioMuted) playAlertSiren();

    setStationScenarios(prev => ({
      ...prev,
      seafood_salad: 'hand_contact'
    }));

    const newAnomaly: StationAnomaly = {
      id: `anm_${Date.now()}`,
      stationId: 'seafood_salad',
      stationName: '冰镇海鲜与三文鱼刺身台',
      type: 'hand_contact',
      severity: 'critical',
      title: '⚠️ 违规行为拦截：顾客未用取餐夹，徒手抓取刺身',
      description: 'YOLO-Pose 人手姿态估计模型在三文鱼盘面坐标 [X: 48%, Y: 56%] 捕获顾客徒手直接接触食材，触碰五星级食安红线，请中控服务员立即上前劝导并协助撤换表层食材。',
      confidence: 98.4,
      coordinates: { x: 44.0, y: 52.0, width: 18, height: 18 },
      timestamp: new Date().toLocaleTimeString(),
      detectedAt: new Date().toLocaleTimeString(),
      status: 'active',
      snapshotUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80',
      dietaryImpact: '徒手直接接触细菌污染隐患，极易导致群体食安投诉'
    };

    setAnomalies(prev => [newAnomaly, ...prev]);
    setSelectedStationId('seafood_salad');
    setSelectedAnomalyId(newAnomaly.id);
    openAttendantReview(newAnomaly);
    showToast('⚠️ 突发模拟：顾客徒手抓取三文鱼刺身！中控弹窗已激活。');
    setTimeout(() => setSimulatingType(null), 1200);
  };

  // Simulation 2: 模拟器具掉入菜盆 (Tongs Dropped into Tray)
  const injectTongsDropped = () => {
    setSimulatingType('dropped');
    if (!audioMuted) playAlertSiren();

    setStationScenarios(prev => ({
      ...prev,
      hot_carvery: 'tongs_dropped'
    }));

    const newAnomaly: StationAnomaly = {
      id: `anm_${Date.now()}`,
      stationId: 'hot_carvery',
      stationName: '慢烤西冷牛排与热菜保温炉',
      type: 'tongs_dropped',
      severity: 'critical',
      title: '⚠️ 器具跌落告警：顾客取餐夹脱手掉入热菜保温盘',
      description: '餐具位姿追踪在坐标 [X: 62%, Y: 46%] 监测到取餐夹手柄整根沉入黑椒牛排盘，手柄外源接触污染整盆食材，建议前台立即整盘撤换。',
      confidence: 99.1,
      coordinates: { x: 58.0, y: 42.0, width: 20, height: 22 },
      timestamp: new Date().toLocaleTimeString(),
      detectedAt: new Date().toLocaleTimeString(),
      status: 'active',
      snapshotUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
      dietaryImpact: '手柄外源细菌浸润与烫伤隐患'
    };

    setAnomalies(prev => [newAnomaly, ...prev]);
    setSelectedStationId('hot_carvery');
    setSelectedAnomalyId(newAnomaly.id);
    openAttendantReview(newAnomaly);
    showToast('⚠️ 突发模拟：取餐夹掉入热菜保温盆！中控弹窗已激活。');
    setTimeout(() => setSimulatingType(null), 1200);
  };

  // Simulation 3: 模拟滴汁污染 (Drip Contamination)
  const injectDripContamination = () => {
    setSimulatingType('drip');
    if (!audioMuted) playAlertSiren();

    setStationScenarios(prev => ({
      ...prev,
      vegan_bar: 'drip_contamination'
    }));

    const newAnomaly: StationAnomaly = {
      id: `anm_${Date.now()}`,
      stationId: 'vegan_bar',
      stationName: '水耕有机蔬菜与纯素吧',
      type: 'drip_contamination',
      severity: 'critical',
      title: '菜品滴汁污染：热菜黑椒肉汁滴入有机羽衣甘蓝',
      description: '半球顶视相机在坐标 [X: 52%, Y: 61%] 捕捉到深色肉汁液滴（直径约 4.5mm），存在动物油脂与过敏原交叉污染，需立即撤盘。',
      confidence: 98.7,
      coordinates: { x: 50.0, y: 58.0, width: 14, height: 14 },
      timestamp: new Date().toLocaleTimeString(),
      detectedAt: new Date().toLocaleTimeString(),
      status: 'active',
      snapshotUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      dietaryImpact: '素食/清真顾客重大违禁风险'
    };

    setAnomalies(prev => [newAnomaly, ...prev]);
    setSelectedStationId('vegan_bar');
    setSelectedAnomalyId(newAnomaly.id);
    openAttendantReview(newAnomaly);
    showToast('💧 突发模拟：热菜肉汁滴入有机纯素台！');
    setTimeout(() => setSimulatingType(null), 1200);
  };

  // Simulation 4: 模拟菜品发干/余量不足20%需补餐 (Food Drying & Depletion)
  const injectLowStockDrying = () => {
    setSimulatingType('depletion');
    if (!audioMuted) playScanBeep();

    setStationScenarios(prev => ({
      ...prev,
      hot_carvery: 'food_drying_depletion'
    }));

    setStations(prev => prev.map(s => {
      if (s.id === 'hot_carvery') {
        return { ...s, lowStockWarning: true, freshnessIndex: 72 };
      }
      return s;
    }));

    const newAnomaly: StationAnomaly = {
      id: `anm_${Date.now()}`,
      stationId: 'hot_carvery',
      stationName: '慢烤西冷牛排与热菜保温炉',
      type: 'food_drying_depletion',
      severity: 'info',
      title: '菜品状态变化：慢烤西冷牛排余量 < 15%，表面发干需补餐',
      description: '半球深度感知模型识别到保温炉内牛排剩余不足两份，且保温灯照射超 40 分钟表面油水分离，请中控服务员通知后厨加急出菜。',
      confidence: 95.2,
      coordinates: { x: 30.0, y: 48.0, width: 26, height: 24 },
      timestamp: new Date().toLocaleTimeString(),
      detectedAt: new Date().toLocaleTimeString(),
      status: 'active',
      snapshotUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
      dietaryImpact: '影响口感赏味，菜品见底影响五星级奢华餐饮形象'
    };

    setAnomalies(prev => [newAnomaly, ...prev]);
    setSelectedStationId('hot_carvery');
    setSelectedAnomalyId(newAnomaly.id);
    showToast('🍲 菜品状态识别：保温炉牛排表面发干且余量见底，建议补餐。');
    setTimeout(() => setSimulatingType(null), 1200);
  };

  // Simulation 5: 异物入侵模拟 (2. Foreign Object Intrusion)
  const injectForeignFrag = () => {
    setSimulatingType('foreign');
    if (!audioMuted) playAlertSiren();

    const newAnomaly: StationAnomaly = {
      id: `anm_${Date.now()}`,
      stationId: 'hot_carvery',
      stationName: '慢烤西冷牛排与热菜保温炉',
      type: 'foreign_utensil_frag',
      severity: 'critical',
      title: '🚨 2. 异物入侵：后厨出餐瓷盘边沿微碎屑掉入盘中',
      description: '4K 半球反射光谱识别到牛排侧翼出现 3mm 锋利白色反光高锐度异物，判定为出菜碰撞导致的瓷器残片，食道划伤重大风险，必须立即停供全盘撤换！',
      confidence: 99.4,
      coordinates: { x: 58.0, y: 38.0, width: 14, height: 14 },
      timestamp: new Date().toLocaleTimeString(),
      detectedAt: new Date().toLocaleTimeString(),
      status: 'active',
      snapshotUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
      dietaryImpact: '物理性人身安全伤害 (锐利硬质异物)，需立即撤盘封存'
    };

    setAnomalies(prev => [newAnomaly, ...prev]);
    setSelectedStationId('hot_carvery');
    setSelectedAnomalyId(newAnomaly.id);
    openAttendantReview(newAnomaly);
    showToast('🚨 突发异物入侵：检出出餐瓷盘微碎屑，请立即处置！');
    setTimeout(() => setSimulatingType(null), 1200);
  };

  // Simulation 6: 私用餐具探入 (3.2 Destructive Tool Intrusion)
  const injectPersonalCutlery = () => {
    setSimulatingType('cutlery');
    if (!audioMuted) playAlertSiren();

    const newAnomaly: StationAnomaly = {
      id: `anm_${Date.now()}`,
      stationId: 'seafood_salad',
      stationName: '冰镇海鲜与三文鱼刺身台',
      type: 'utensil_personal_cutlery',
      severity: 'critical',
      title: '⚠️ 3.2 工具破坏：顾客使用私人餐盘叉子探入公用大盘试吃',
      description: 'YOLO-Pose 人手工具比率检测捕获顾客持自用私用餐具进入公用海鲜冷盘边缘探取食材，口腔唾液接触风险，建议前台服务员温和介入并更换被接触点位。',
      confidence: 97.6,
      coordinates: { x: 38.0, y: 48.0, width: 16, height: 18 },
      timestamp: new Date().toLocaleTimeString(),
      detectedAt: new Date().toLocaleTimeString(),
      status: 'active',
      snapshotUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
      dietaryImpact: '幽门螺杆菌/口腔唾液细菌交叉污染风险'
    };

    setAnomalies(prev => [newAnomaly, ...prev]);
    setSelectedStationId('seafood_salad');
    setSelectedAnomalyId(newAnomaly.id);
    openAttendantReview(newAnomaly);
    showToast('⚠️ 突发违规：顾客持私人餐叉探入刺身公盘！');
    setTimeout(() => setSimulatingType(null), 1200);
  };

  // Simulation 7: 规范用夹取餐 (Guest Serving with Tongs)
  const injectTongsServing = () => {
    setStationScenarios(prev => ({
      ...prev,
      [selectedStationId]: 'tongs_serving'
    }));
    showToast('🥢 规范互动：顾客正在使用专用取餐夹自取菜品。');
  };

  // Simulation 6: 标准五星摆盘复位 (Pristine Standard Platter)
  const resetToPristine = () => {
    setStationScenarios(prev => ({
      ...prev,
      [selectedStationId]: 'idle_platter'
    }));
    showToast('✨ 盛盘标定：当前餐台已复位至五星级标准备餐陈列。');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white border border-emerald-300 text-slate-800 px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 backdrop-blur animate-in fade-in duration-300">
          <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Attendant Active Alert Floating Bell Banner */}
      {activeAnomalies.length > 0 && (
        <div className="bg-gradient-to-r from-rose-50 via-white to-amber-50 border-2 border-rose-300 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-rose-500 text-white animate-bounce shrink-0">
              <BellRing className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-serif text-rose-900">
                  中控服务员实时盯视频道 · 当前有 {activeAnomalies.length} 起待复核事件
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-mono font-bold">
                  AI 实时拦截
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                最新事件：<b className="text-slate-900">{activeAnomalies[0].title}</b> ({activeAnomalies[0].stationName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => openAttendantReview(activeAnomalies[0])}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>打开中控复核弹窗</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Banner & Simulation Control Bar */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <Camera className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-serif">
                  取餐档口 AI 半球视觉防线（顶视全景）
                  <span className="text-xs font-sans px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    实时摄录 4K 60FPS
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  餐台上置广角半球 · 实时真实画面回传 · 深度学习识别「人的违规行为」与「菜品外观变质」· 中控服务员现场复核闭环
                </p>
              </div>
            </div>
          </div>

          {/* Quick Simulation Testing Triggers for Realistic Hotel Cases */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">现场违规/互动实况模拟:</span>
            <button
              onClick={injectDripContamination}
              className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="模拟热菜深色黑椒肉汁滴入素食沙拉冷盘"
            >
              <Droplet className="w-3.5 h-3.5 text-teal-600" />
              <span>💧 1. 异源液体互滴</span>
            </button>
            <button
              onClick={injectForeignFrag}
              className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="模拟后厨出餐瓷盘边沿磕碰微碎屑掉入 (异物入侵)"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-purple-600" />
              <span>🔍 2. 瓷屑异物入侵</span>
            </button>
            <button
              onClick={injectHandContact}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="模拟顾客徒手直接抓取刺身/菜品违规抓拍"
            >
              <Hand className="w-3.5 h-3.5 text-rose-600" />
              <span>🖐️ 3.1 徒手捏取破坏</span>
            </button>
            <button
              onClick={injectPersonalCutlery}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="模拟顾客使用自用私筷/私勺探入公盘试吃"
            >
              <Sliders className="w-3.5 h-3.5 text-rose-600" />
              <span>🥢 3.2 私用餐具探入</span>
            </button>
            <button
              onClick={injectTongsDropped}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="模拟顾客取餐夹脱手掉入热菜保温盘器具污染"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>⚠️ 3.2 夹柄深浸没</span>
            </button>
            <button
              onClick={injectLowStockDrying}
              className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="模拟热菜保温灯久烤发干表面油水分离"
            >
              <Clock className="w-3.5 h-3.5 text-stone-600" />
              <span>🍲 久烤发干/未补菜</span>
            </button>
            <button
              onClick={resetToPristine}
              className="px-3 py-1.5 rounded-xl bg-stone-50 hover:bg-emerald-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              title="复位至五星级标准摆盘就绪状态"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>✨ 标准五星摆盘</span>
            </button>
          </div>
        </div>

        {/* Station Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 pt-4 border-t border-slate-100">
          {stations.map(st => {
            const hasAlert = activeAnomalies.some(a => a.stationId === st.id);
            const isSelected = selectedStationId === st.id;

            return (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedStationId(st.id);
                  const relatedAnm = anomalies.find(a => a.stationId === st.id && a.status === 'active');
                  if (relatedAnm) setSelectedAnomalyId(relatedAnm.id);
                }}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-1 ring-emerald-300'
                    : 'bg-stone-50/60 border-slate-200 hover:border-emerald-200 hover:bg-emerald-50/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-900 font-serif' : 'text-slate-700'}`}>
                    {st.name}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${hasAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`}></span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                  <span>温控: <b className="text-slate-700">{st.temperature}°C</b></span>
                  <span>保鲜: <b className="text-emerald-700">{st.freshnessIndex}%</b></span>
                </div>
                {hasAlert && (
                  <span className="inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold border border-rose-200">
                    待复核报警
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Workspace: Real Camera Feed Viewport (Left) + Anomaly Inspection & Action (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: REAL Overhead Camera Live Simulated Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-emerald-100 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between mb-3 px-1 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {currentStation.domeCameraModel || '4K 半球全景网络摄像机'}
              </span>
            </div>

            {/* Stream Mode & Vision Filter Switching */}
            <div className="flex items-center gap-2">
              {/* Live vs Snapshot */}
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
                  <span>实时视频流</span>
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
                  <span>高清截帧</span>
                </button>
              </div>

              {/* Spectral Filters */}
              <div className="flex items-center gap-1 bg-emerald-50 p-0.5 rounded-lg border border-emerald-200 text-xs">
                <button
                  onClick={() => setVisionMode('rgb')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                    visionMode === 'rgb' ? 'bg-white text-emerald-800 font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  RGB 全彩真实
                </button>
                <button
                  onClick={() => setVisionMode('spectral')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                    visionMode === 'spectral' ? 'bg-white text-emerald-800 font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  多光谱 (ΔE)
                </button>
                <button
                  onClick={() => setVisionMode('thermal')}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                    visionMode === 'thermal' ? 'bg-white text-emerald-800 font-bold shadow-2xs' : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  红外热场
                </button>
              </div>
            </div>
          </div>

          {/* 5-Star Hotel Buffet Camera Viewport with Real Hand/Tongs Interaction Scenes */}
          <BuffetSceneViewport
            station={currentStation}
            scenario={currentScenario}
            onSelectScenario={(sc) => {
              setStationScenarios(prev => ({ ...prev, [currentStation.id]: sc }));
              if (sc === 'hand_contact') {
                injectHandContact();
              } else if (sc === 'tongs_dropped') {
                injectTongsDropped();
              } else if (sc === 'drip_contamination') {
                injectDripContamination();
              } else if (sc === 'food_drying_depletion') {
                injectLowStockDrying();
              } else if (sc === 'tongs_serving') {
                injectTongsServing();
              } else if (sc === 'idle_platter') {
                resetToPristine();
              }
            }}
            visionMode={visionMode}
            streamMode={streamMode}
            timecode={timecode}
            liveFps={liveFps}
            anomalies={anomalies}
            onOpenAttendantReview={openAttendantReview}
          />

          {/* Camera Bottom Toolbar */}
          <div className="bg-stone-50 border-t border-slate-100 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 mt-2 rounded-b-xl">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-slate-800 font-medium">
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                当前巡检: {currentStation.name}
              </span>
              <span className="text-slate-300">|</span>
              <span>待处理异常: <b className="text-rose-600">{activeAnomalies.length} 起</b></span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleReplaceTray(currentStation.id)}
                className="px-3 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 font-medium flex items-center gap-1 text-xs border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                <RefreshCw className="w-3 h-3 text-emerald-600" />
                <span>例行换盘标定</span>
              </button>
              <button
                onClick={() => handleReplaceTongs(currentStation.id)}
                className="px-3 py-1 rounded-lg bg-white hover:bg-emerald-50 text-slate-700 font-medium flex items-center gap-1 text-xs border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-teal-600" />
                <span>夹具复位</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Anomaly Inspector & Attendant Human-in-the-Loop Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {selectedAnomaly ? (
            <div className="bg-white border-2 border-emerald-200 rounded-2xl p-5 shadow-xs space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      selectedAnomaly.severity === 'critical'
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {selectedAnomaly.severity === 'critical' ? '严重违规/食安告警' : '品控与补餐提示'}
                    </span>

                    {/* Dynamic Taxonomy Badge */}
                    {(() => {
                      const def = getAnomalyDefinition(selectedAnomaly.type);
                      if (!def) return null;
                      return (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${def.badgeColor}`}>
                          {def.majorCategoryLabel}
                        </span>
                      );
                    })()}

                    <span className="text-xs text-slate-400 font-mono">
                      置信度: <b className="text-slate-800">{selectedAnomaly.confidence}%</b>
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1 font-serif">
                    {selectedAnomaly.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {selectedAnomaly.detectedAt || selectedAnomaly.timestamp}
                </span>
              </div>

              {/* Real Snapshot Thumbnail */}
              {selectedAnomaly.snapshotUrl && (
                <div className="relative rounded-xl overflow-hidden border border-emerald-200 h-32">
                  <img
                    src={selectedAnomaly.snapshotUrl}
                    alt="Snapshot"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                    半球抓拍证据链 · {selectedAnomaly.detectedAt || selectedAnomaly.timestamp}
                  </div>
                </div>
              )}

              {/* Description & Impact & Standard SOP */}
              <div className="p-3.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs space-y-2">
                <p className="text-slate-700 leading-relaxed font-medium">
                  {selectedAnomaly.description}
                </p>

                {(() => {
                  const def = getAnomalyDefinition(selectedAnomaly.type);
                  return (
                    <>
                      <div className="pt-2 border-t border-emerald-200/60 text-slate-600">
                        <span className="text-rose-700 font-bold block mb-0.5">危害分析:</span>
                        {def?.impact || selectedAnomaly.dietaryImpact || '避免过敏原交叉接触，保障五星级餐厅声誉'}
                      </div>
                      {def?.sopAction && (
                        <div className="pt-1.5 border-t border-emerald-200/60 text-emerald-800">
                          <span className="font-bold block mb-0.5">标准处置 SOP:</span>
                          {def.sopAction}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>

              {/* Action Buttons for Waiter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-800 mb-1 flex items-center gap-1 font-serif">
                  <Sprout className="w-4 h-4 text-emerald-600" />
                  中控服务员即时处置指令:
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => handleReplaceTray(selectedAnomaly.stationId, selectedAnomaly.id)}
                    className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>现场复核：撤盘换新</span>
                  </button>

                  <button
                    onClick={() => handleReplaceTongs(selectedAnomaly.stationId, selectedAnomaly.id)}
                    className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>更换洁净夹具</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => onDispatchToPda(selectedAnomaly)}
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-emerald-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    <span>派工单至巡台服务员</span>
                  </button>

                  <button
                    onClick={() => handleCallKitchenReplenish(selectedAnomaly.stationId, selectedAnomaly.id)}
                    className="p-2.5 rounded-xl bg-stone-100 hover:bg-emerald-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>呼叫后厨加急补菜</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-emerald-100 rounded-2xl p-10 text-center text-slate-400 space-y-2">
              <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="text-sm font-medium text-slate-700">当前餐台一切正常</p>
              <p className="text-xs text-slate-400">半球 AI 巡检持续运行，无未处置异常</p>
            </div>
          )}
        </div>
      </div>

      {/* Central Attendant Live Review Modal (中控服务员实时弹窗提醒与现场复核) */}
      {showAlertModal && modalAnomaly && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border-2 border-rose-300 shadow-2xl max-w-lg w-full p-5 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-rose-100 text-rose-700 animate-pulse">
                  <ShieldAlert className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 font-serif">
                    【中控盯视】AI 视觉异常突发告警
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    餐台半球摄像机秒级抓拍 · 待中控专员复核处置
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Real Snapshot */}
            {modalAnomaly.snapshotUrl && (
              <div className="relative w-full h-44 rounded-xl overflow-hidden border border-rose-200">
                <img
                  src={modalAnomaly.snapshotUrl}
                  alt="Snapshot"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-mono font-bold">
                  {modalAnomaly.type === 'hand_contact' ? '违规行为：徒手抓取' : '异常事件拦截'}
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono">
                  置信度: {modalAnomaly.confidence}%
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {modalAnomaly.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {modalAnomaly.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold block">🛎️ 中控服务员现场作业指南：</span>
              <p className="text-[11px] text-amber-800">
                1. 优先轻声上前劝导顾客（保持五星级礼貌体验）；<br />
                2. 对被接触或污染的菜品立即执行撤盘换新；<br />
                3. 若人手不足，可一键将工单推送给巡台服务员 PDA。
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => handleReplaceTray(modalAnomaly.stationId, modalAnomaly.id)}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>我已现场复核：立即撤换</span>
              </button>

              <button
                onClick={() => {
                  onDispatchToPda(modalAnomaly);
                  setShowAlertModal(false);
                }}
                className="py-2.5 rounded-xl bg-stone-100 hover:bg-emerald-50 border border-slate-200 text-slate-800 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span>派单至巡台 PDA</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
