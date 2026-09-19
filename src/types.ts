export type StationId = 'seafood_salad' | 'halal_deli' | 'vegan_bar' | 'hot_carvery' | 'fruit_dessert';

export interface BuffetStation {
  id: StationId;
  name: string;
  nameEn: string;
  category: 'Cold' | 'Hot' | 'Halal' | 'Vegan' | 'Fruit';
  temperature: number; // in °C
  standardTempRange: [number, number];
  tongsType: string;
  tongsColor: string;
  currentTongsInPlace: boolean;
  tongsMisplaced: boolean;
  freshnessIndex: number; // 0 - 100
  deltaE: number; // Spectrophotometric Chroma color difference (0 - 15)
  oxidationStatus: 'fresh' | 'slight_oxidation' | 'high_oxidation';
  trayLastReplaced: string;
  activeItems: string[];
  cameraImageUrl: string;
  cameraVideoUrl?: string;
  domeCameraModel?: string;
  domeCameraFps?: number;
  lowStockWarning?: boolean;
}

export type AnomalyType = 
  | 'hand_contact'           // 顾客徒手直接抓取菜品
  | 'tongs_dropped'          // 餐夹脱手掉入菜盆
  | 'drip_contamination'     // 滴汁交叉污染 / 汤汁泼洒
  | 'food_drying_depletion'  // 菜品发干/氧化变色/低余量未补菜
  | 'foreign_object'         // 外部带入异物/脱落物 (发丝/纸巾/饰品/飞虫)
  | 'tongs_misplaced'        // 取餐夹混用
  | 'chroma_oxidation'       // 多光谱色差超标
  // 细化异常类型
  | 'liquid_cross_drip'      // 异源跨盘互滴
  | 'liquid_raw_leak'        // 生熟交叉流液/化水
  | 'liquid_foreign_splash'  // 外源异物液体倾洒
  | 'liquid_oil_separation'  // 菜品本体油水分离
  | 'foreign_biological'     // 人体脱落物(发丝/假指甲/创口贴)
  | 'foreign_belongings'     // 宾客随身杂物(纸巾/牙签/吸管套)
  | 'foreign_utensil_frag'   // 厨房器具破损(碎玻璃/瓷片/钢丝丝)
  | 'foreign_pest'           // 生物性异物(飞虫/果蝇)
  | 'contact_finger_pinch'   // 徒手直接捏取/抓取
  | 'contact_hand_sifting'   // 挑拣/翻动式大面积破坏
  | 'contact_hand_probing'   // 触摸探试温软硬
  | 'contact_tasted_returned'// 尝后放回/盘内退回 (高危)
  | 'contact_sleeve_drag'    // 衣物袖口拖曳接触
  | 'utensil_cross_tongs'    // 混夹/跨区滥用(过敏原/清真)
  | 'utensil_submersion'     // 餐夹手柄掉落汤汁深部浸没
  | 'utensil_personal_cutlery' // 私人餐具探入/私筷试吃
  | 'utensil_violent_digging'// 暴力捣碎与挖取破坏
  | 'utensil_overhang_drip'; // 取餐夹横跨悬空滴挂

export type AnomalyMajorCategory = 
  | 'abnormal_liquid'        // 1. 异常液体
  | 'foreign_object'         // 2. 异物
  | 'destructive_hand'       // 3.1 人为破坏性接触 - 人手维度
  | 'destructive_tool'       // 3.2 人为破坏性接触 - 工具维度
  | 'normal_plating';        // 0. 正常合规状态

export interface AnomalyDefinition {
  code: AnomalyType;
  majorCategory: AnomalyMajorCategory;
  majorCategoryLabel: string;
  name: string;
  nameEn: string;
  severity: 'critical' | 'warning' | 'info' | 'medium';
  impact: string;       // 食安危害与客诉风险
  sopAction: string;    // 标准处置流程 SOP
  badgeColor: string;
}

export type FoodSampleCategory = 'normal' | 'abnormal';

export interface FoodAnnotationBox {
  id: string;
  label: string;
  category: FoodSampleCategory;
  majorCategory?: AnomalyMajorCategory;
  anomalyType?: AnomalyType;
  severity?: 'critical' | 'warning' | 'info' | 'medium';
  impact?: string;
  sopAction?: string;
  x: number; // % 0-100
  y: number; // % 0-100
  width: number; // % 0-100
  height: number; // % 0-100
  confidence: number; // 0.0 - 1.0
  color?: string;
  keypoints?: { x: number; y: number; name: string }[]; // YOLO-Pose keypoints
}

export interface FoodSampleImage {
  id: string;
  title: string;
  category: FoodSampleCategory; // 1. 正常情况下的菜品 vs 2. 异常情况下的菜品
  imageUrl: string;
  captureSource: '4k_dome_camera' | 'kitchen_lightbox' | 'mobile_upload';
  captureSourceLabel: string;
  resolution: string; // '3840x2160 (4K UHD)'
  lightingLux: number; // e.g. 850
  cielabL: number; // 亮度
  cielabA: number; // 红绿
  cielabB: number; // 黄蓝
  deltaE: number; // CIELAB 色差
  statusDescription: string;
  isAnnotated: boolean;
  annotations: FoodAnnotationBox[];
}

export interface DishTrainingProfile {
  id: string;
  dishName: string;
  dishNameEn: string;
  stationId: StationId;
  stationName: string;
  imageUrl: string;
  sampleCount: number;
  lastTrained: string;
  modelAccuracy: number; // e.g. 96.8%
  status: 'trained' | 'training' | 'pending';
  detectionTargets: {
    handContact: boolean;     // 徒手抓取
    tongsDropped: boolean;    // 餐夹掉落
    dryingDepletion: boolean; // 发干/少于20%未补菜
    colorShift: boolean;      // 变色氧化
    soupSpill: boolean;       // 汤汁洒漏
  };
  notes: string;
  normalSamples?: FoodSampleImage[];   // 1. 正常情况下的菜品标注样本集
  abnormalSamples?: FoodSampleImage[]; // 2. 异常情况下的菜品标注样本集
  trainingMetrics?: {
    mAP50: number;
    mAP50_95: number;
    precision: number;
    recall: number;
    latencyMs: number;
    epochs: number;
    lossCurve: number[];
  };
}

export interface StationAnomaly {
  id: string;
  stationId: StationId;
  stationName?: string;
  type: AnomalyType;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info' | 'medium';
  timestamp?: string;
  detectedAt?: string;
  coordinates: { x: number; y: number; width?: number; height?: number }; // % relative to overhead view
  confidence: number; // 0 - 100%
  allergenRisk?: string[];
  evidenceSnapshot?: string;
  snapshotUrl?: string;
  dietaryImpact?: string;
  status: 'active' | 'resolved' | 'acknowledged';
  resolvedBy?: string;
  resolvedAt?: string;
  actionTaken?: string;
}

export type WasteBinType = 'green_organic' | 'red_bone_shell' | 'blue_plastic_dry' | 'blue_inorganic';

export interface SilverwareInterceptEvent {
  id: string;
  timestamp: string;
  itemName: string;
  brand?: string;
  material: '925_sterling_silver' | 'bone_china' | 'silver_plated' | 'standard_steel' | 'silver';
  estimatedValue: number; // in CNY
  baffleStatus: 'locked' | 'unlocked';
  reflectionIndex?: number; // high-speed optical reflection index 0-100
  photoLabel?: string;
  operatorStation?: string;
  stationChute?: string;
  interceptSpeedMs?: number; // e.g. 120ms
  responseLatencyMs?: number;
  retrieved?: boolean;
  status?: string;
  recoveredBy?: string;
  actionNote?: string;
  photoUrl?: string;
}

export interface FoodWasteESGRecord {
  id: string;
  dishName?: string;
  category: string;
  wastePercentage?: number; // e.g. 28%
  yesterdayPrepKg?: number;
  actualConsumedKg?: number;
  wastedKg?: number;
  recommendedNextDayPrepKg?: number;
  reductionPercentage?: number;
  estimatedCostSaved?: number; // CNY
  co2eSavedKg?: number;
  originalPrepKg?: number;
  recommendedPrepKg?: number;
  historicalWasteKg?: number;
  costSavingsYuan?: number;
}

export interface GuestProfile {
  id: string;
  roomNumber: string;
  guestName: string;
  membershipTier: 'Globalist' | 'Titanium' | 'Diamond' | 'Centurion VIP' | 'Standard' | string;
  stayDates?: string;
  roomType?: string;
  breakfastEntitled?: number; // e.g. 2 pax included
  breakfastIncludedCount?: number;
  breakfastConsumedToday: number;
  isFlaggedRepeatEntry?: boolean;
  dietaryRestrictions: string[];
  allergens?: string[];
  customPreferences: string[];
  totalBillRoom: number;
}

export interface TableItem {
  id: string;
  tableNumber: string;
  zone: 'Window' | 'Garden Terrace' | 'Main Dining' | 'Private Alcove' | string;
  capacity?: number;
  seats?: number;
  status: 'empty' | 'dining' | 'needs_bussing' | 'reserved' | 'occupied' | 'available';
  guestRoom?: string;
  guestName?: string;
  guestsCount?: number;
  occupiedSince?: string;
  orderTotal?: number;
  pendingAlertsCount?: number;
}

export interface SystemStats {
  todayAlertsCount: number;
  dripsBlockedCount: number;
  silverwareSavedCount: number;
  silverwareSavedAmountYuan: number;
  organicCompostKg: number;
  co2eReducedKg: number;
  kitchenPrepSavingsYuan: number;
  activeWaitersOnShift: number;
  overheadCamFps: number;
  aiLatencyMs: number;
}
