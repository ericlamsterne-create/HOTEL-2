import { BuffetStation, StationAnomaly, SilverwareInterceptEvent, FoodWasteESGRecord, GuestProfile, TableItem, SystemStats, DishTrainingProfile } from '../types';

export const INITIAL_STATIONS: BuffetStation[] = [
  {
    id: 'seafood_salad',
    name: '冰镇海鲜与三文鱼刺身台',
    nameEn: 'Chilled Seafood & Salmon Sashimi Station',
    category: 'Cold',
    temperature: 2.8,
    standardTempRange: [0, 4],
    tongsType: '专用海鲜防滑蓝夹 (Blue Grip)',
    tongsColor: '#3b82f6',
    currentTongsInPlace: true,
    tongsMisplaced: false,
    freshnessIndex: 86,
    deltaE: 2.8,
    oxidationStatus: 'fresh',
    trayLastReplaced: '12分钟前',
    activeItems: ['挪威冰鲜三文鱼', '大西洋金枪鱼', '新西兰青口贝', '深海甜虾'],
    cameraImageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=1200&auto=format&fit=crop&q=80',
    domeCameraModel: 'Hikvision 4K 超高清半球摄像机 · 视场角 108° (防冷凝起雾)',
    domeCameraFps: 60,
    lowStockWarning: false
  },
  {
    id: 'halal_deli',
    name: '清真Halal认证冷切肉盘',
    nameEn: 'Halal Certified Cold Cuts Station',
    category: 'Halal',
    temperature: 3.2,
    standardTempRange: [0, 5],
    tongsType: '清真专署绿色标定夹 (Green Halal)',
    tongsColor: '#10b981',
    currentTongsInPlace: true,
    tongsMisplaced: true, // currently triggered alert
    freshnessIndex: 94,
    deltaE: 1.4,
    oxidationStatus: 'fresh',
    trayLastReplaced: '25分钟前',
    activeItems: ['清真风干牛肉片', '土耳其烤火鸡胸', '中东鹰嘴豆泥', '皮塔面包'],
    cameraImageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&auto=format&fit=crop&q=80',
    domeCameraModel: 'Uniview 4K 宽动态半球摄像机 · 本地边缘AI去人脸保护',
    domeCameraFps: 60,
    lowStockWarning: false
  },
  {
    id: 'vegan_bar',
    name: '水耕有机蔬菜与纯素吧',
    nameEn: 'Hydroponic Vegan & Salad Bar',
    category: 'Vegan',
    temperature: 4.1,
    standardTempRange: [2, 6],
    tongsType: '纯素专用原木色洁净夹 (Natural Birch)',
    tongsColor: '#e2e8f0',
    currentTongsInPlace: true,
    tongsMisplaced: false,
    freshnessIndex: 91,
    deltaE: 1.9,
    oxidationStatus: 'fresh',
    trayLastReplaced: '18分钟前',
    activeItems: ['水耕羽衣甘蓝', '三色藜麦沙拉', '野生芝麻菜', '有机圣女果'],
    cameraImageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=80',
    domeCameraModel: 'Dahua 4K 微光全彩半球监控器 · 双目测高定位',
    domeCameraFps: 60,
    lowStockWarning: false
  },
  {
    id: 'hot_carvery',
    name: '慢烤西冷牛排与热菜保温炉',
    nameEn: 'Slow-Roasted Beef Carvery & Hot Chafers',
    category: 'Hot',
    temperature: 68.4,
    standardTempRange: [60, 75],
    tongsType: '耐高温重型黑金防烫夹 (Black Carvery)',
    tongsColor: '#1e293b',
    currentTongsInPlace: true,
    tongsMisplaced: false,
    freshnessIndex: 98,
    deltaE: 0.7,
    oxidationStatus: 'fresh',
    trayLastReplaced: '8分钟前',
    activeItems: ['安格斯谷饲西冷牛排', '迷迭香法式烤羊排', '浓缩黑椒松露肉汁'],
    cameraImageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&auto=format&fit=crop&q=80',
    domeCameraModel: 'Hikvision 4K 耐高温防油烟工业级半球探头',
    domeCameraFps: 60,
    lowStockWarning: true
  },
  {
    id: 'fruit_dessert',
    name: '法式西点欧包与鲜切热带水果',
    nameEn: 'French Bakery Pastry & Tropical Fruits',
    category: 'Fruit',
    temperature: 3.6,
    standardTempRange: [1, 5],
    tongsType: '水果甜品柔和黄夹 (Yellow Silicone)',
    tongsColor: '#eab308',
    currentTongsInPlace: true,
    tongsMisplaced: false,
    freshnessIndex: 78, // oxidation warning
    deltaE: 5.4,
    oxidationStatus: 'slight_oxidation',
    trayLastReplaced: '42分钟前',
    activeItems: ['法式黄油可颂', '欧式黑麦酸包', '鲜切红心火龙果', '网纹蜜瓜'],
    cameraImageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&auto=format&fit=crop&q=80',
    domeCameraModel: 'Uniview 4K 半球网络全景摄像机 · 色彩多光谱标定',
    domeCameraFps: 60,
    lowStockWarning: false
  }
];

export const INITIAL_ANOMALIES: StationAnomaly[] = [
  {
    id: 'ANM-0848',
    stationId: 'seafood_salad',
    stationName: '冰镇海鲜与三文鱼刺身台',
    type: 'contact_finger_pinch',
    title: '⚠️ 3.1 人手破坏：顾客未用夹具直接徒手捏取三文鱼刺身',
    description: '餐台 4K 半球摄像机部署的 YOLO-Pose 目标手势关键点在坐标 [X: 46%, Y: 58%] 实时捕获食指直接接触裸露食材，触发高亮红框告警，请前台服务员礼貌递夹并协助更换表层食材。',
    severity: 'critical',
    timestamp: '08:48:12',
    detectedAt: '08:48:12',
    coordinates: { x: 46, y: 58, width: 14, height: 16 },
    confidence: 98.5,
    allergenRisk: ['皮肤金黄色葡萄球菌交叉接触风险'],
    snapshotUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 'ANM-0846',
    stationId: 'vegan_bar',
    stationName: '水耕有机蔬菜与纯素吧',
    type: 'liquid_cross_drip',
    title: '🚨 1. 异常液体：热菜黑椒牛肉浓汁异源滴入有机羽衣甘蓝',
    description: '半球顶视相机在坐标 [X: 52%, Y: 61%] 捕捉到从热菜走过的顾客盘底滴落的深色油性肉汁液滴（直径约 4.5mm），直接击穿素食/清真合规防线并引入动物过敏原，需撤盘更换。',
    severity: 'critical',
    timestamp: '08:46:15',
    detectedAt: '08:46:15',
    coordinates: { x: 52, y: 61, width: 10, height: 10 },
    confidence: 98.7,
    allergenRisk: ['动物性肉汁', '黑胡椒', '面筋/麦麸蛋白'],
    snapshotUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 'ANM-0845',
    stationId: 'hot_carvery',
    stationName: '慢烤西冷牛排与热菜保温炉',
    type: 'utensil_submersion',
    title: '⚠️ 3.2 工具破坏：取餐夹手柄整根脱手滑落深浸黑椒汤汁',
    description: '餐具位姿追踪模型检测到取餐夹手柄滑落并整体浸入黑椒牛排汁深部，外部多人握持抓握表面浸入高温汤汁，存在整盆汤液细菌污染与烫伤隐患，建议前台立即整盆撤换。',
    severity: 'critical',
    timestamp: '08:45:22',
    detectedAt: '08:45:22',
    coordinates: { x: 68, y: 44, width: 16, height: 18 },
    confidence: 99.2,
    allergenRisk: ['取餐夹手柄外源接触污染'],
    snapshotUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 'ANM-0844',
    stationId: 'hot_carvery',
    stationName: '慢烤西冷牛排与热菜保温炉',
    type: 'foreign_utensil_frag',
    title: '🚨 2. 异物入侵：后厨出餐瓷盘边沿磕碰微碎屑掉入盘中',
    description: '4K 半球反射光谱识别到牛排侧翼出现 3mm 锋利白色反光高锐度异物，判定为出菜碰撞导致的瓷器残片，食道划伤重大风险，必须立即停供全盘撤换！',
    severity: 'critical',
    timestamp: '08:44:05',
    detectedAt: '08:44:05',
    coordinates: { x: 58, y: 38, width: 12, height: 12 },
    confidence: 99.4,
    allergenRisk: ['物理性人身安全伤害 (锐利硬质异物)'],
    snapshotUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 'ANM-0842',
    stationId: 'seafood_salad',
    stationName: '冰镇海鲜与三文鱼刺身台',
    type: 'utensil_personal_cutlery',
    title: '⚠️ 3.2 工具破坏：顾客使用私人餐盘叉子探入公用盛盘试吃',
    description: 'YOLO-Pose 人手工具比率检测捕获顾客持自用私用餐具进入公用海鲜冷盘边缘探取食材，口腔唾液接触风险，建议前台服务员温和介入并更换被接触点位。',
    severity: 'critical',
    timestamp: '08:42:50',
    detectedAt: '08:42:50',
    coordinates: { x: 38, y: 48, width: 15, height: 16 },
    confidence: 97.6,
    allergenRisk: ['幽门螺杆菌/口腔唾液细菌'],
    snapshotUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 'ANM-0831',
    stationId: 'halal_deli',
    stationName: '清真Halal认证冷切肉盘',
    type: 'tongs_misplaced',
    title: '取餐夹跨区错放：海鲜蓝色夹被放置于清真冷切台',
    description: '视觉色标比对确认放置于清真冷切盘内取餐夹为 [蓝色海鲜夹]，违背穆斯林洁食与海鲜过敏原防混规范，触发中控台高亮提醒。',
    severity: 'warning',
    timestamp: '08:31:02',
    detectedAt: '08:31:02',
    coordinates: { x: 74, y: 35, width: 14, height: 10 },
    confidence: 99.1,
    snapshotUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    status: 'active'
  },
  {
    id: 'ANM-0820',
    stationId: 'hot_carvery',
    stationName: '慢烤西冷牛排与热菜保温炉',
    type: 'food_drying_depletion',
    title: '菜品状态变化：慢烤西冷牛排余量 < 18%，表面发干需补餐',
    description: '餐盆深度体积感知显示牛排剩余不足两份，且在保温灯下持续照射超 35 分钟，表面油水分离干涸，已提示后厨加急切配补菜。',
    severity: 'info',
    timestamp: '08:20:05',
    detectedAt: '08:20:05',
    coordinates: { x: 35, y: 50, width: 22, height: 20 },
    confidence: 94.6,
    snapshotUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    status: 'active'
  }
];

export const INITIAL_DISH_MODELS: DishTrainingProfile[] = [
  {
    id: 'dish_01',
    dishName: '挪威冰鲜三文鱼刺身',
    dishNameEn: 'Norwegian Chilled Salmon Sashimi',
    stationId: 'seafood_salad',
    stationName: '冰镇海鲜与三文鱼刺身台',
    imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80',
    sampleCount: 420,
    lastTrained: '今日 06:30 (早市前微调)',
    modelAccuracy: 98.4,
    status: 'trained',
    detectionTargets: {
      handContact: true,
      tongsDropped: true,
      dryingDepletion: true,
      colorShift: true,
      soupSpill: false
    },
    notes: '重点监测顾客徒手抓取刺身、夹具滑落与肌红蛋白氧化变色（ΔE阈值 > 4.0）',
    trainingMetrics: {
      mAP50: 98.6,
      mAP50_95: 92.4,
      precision: 98.8,
      recall: 97.9,
      latencyMs: 14.2,
      epochs: 150,
      lossCurve: [0.82, 0.45, 0.28, 0.19, 0.12, 0.08, 0.05, 0.038]
    },
    normalSamples: [
      {
        id: 'norm_sal_01',
        title: '五星级黄金赏味标准刺身满盘陈列 (出餐质检标定)',
        category: 'normal',
        imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=1000&auto=format&fit=crop&q=80',
        captureSource: 'kitchen_lightbox',
        captureSourceLabel: '后厨品控台定焦采集箱 (5500K CRI>95)',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 860,
        cielabL: 56.2,
        cielabA: 38.4,
        cielabB: 24.1,
        deltaE: 1.2,
        statusDescription: '新鲜切片冰镇，油脂纹理清晰，碎冰底垫完整，专用金色食品夹规范归位。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_norm_01_tray',
            label: '五星黄金摆盘规范区 (Ground Truth Tray)',
            category: 'normal',
            x: 12,
            y: 18,
            width: 76,
            height: 68,
            confidence: 0.99,
            color: '#10b981'
          },
          {
            id: 'box_norm_01_tongs',
            label: '专用银色刺身夹·手柄归位外缘 (Tongs Compliant)',
            category: 'normal',
            x: 72,
            y: 52,
            width: 22,
            height: 38,
            confidence: 0.98,
            color: '#10b981'
          }
        ]
      },
      {
        id: 'norm_sal_02',
        title: '顾客使用专用刺身夹规范取餐 (合规人机互动)',
        category: 'normal',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000&auto=format&fit=crop&q=80',
        captureSource: '4k_dome_camera',
        captureSourceLabel: '餐台 4K 半球顶摄俯拍 (Dome-01)',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 780,
        cielabL: 55.8,
        cielabA: 37.9,
        cielabB: 23.8,
        deltaE: 1.5,
        statusDescription: '人手握持夹柄末端夹取三文鱼片，手部未触碰食材边缘，动作合规。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_norm_02_serving',
            label: '规范夹取行为 (Compliant Tongs Serving)',
            category: 'normal',
            x: 35,
            y: 28,
            width: 38,
            height: 48,
            confidence: 0.97,
            color: '#10b981'
          }
        ]
      }
    ],
    abnormalSamples: [
      {
        id: 'abnorm_sal_01',
        title: '顾客未用夹具直接徒手抓取刺身 (违规交叉污染)',
        category: 'abnormal',
        imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=1000&auto=format&fit=crop&q=80',
        captureSource: '4k_dome_camera',
        captureSourceLabel: '餐台 4K 半球顶摄动态追踪抓拍',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 750,
        cielabL: 52.1,
        cielabA: 35.2,
        cielabB: 21.0,
        deltaE: 4.8,
        statusDescription: '手指指尖直接接触裸露三文鱼片，手掌进入盘内高危卫生区，易导致细菌污染。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_abn_01_hand',
            label: '⚠️ 3.1 人手破坏：直接徒手捏取 (Finger Pinching)',
            category: 'abnormal',
            anomalyType: 'contact_finger_pinch',
            x: 42,
            y: 25,
            width: 32,
            height: 38,
            confidence: 0.985,
            color: '#ef4444'
          }
        ]
      },
      {
        id: 'abnorm_sal_02',
        title: '取餐夹脱手整把掉入刺身冰盘汤汁中 (器具二次污染)',
        category: 'abnormal',
        imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1000&auto=format&fit=crop&q=80',
        captureSource: '4k_dome_camera',
        captureSourceLabel: '餐台 4K 半球顶摄俯拍抓拍',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 760,
        cielabL: 54.0,
        cielabA: 36.1,
        cielabB: 22.4,
        deltaE: 2.1,
        statusDescription: '夹把滑落侵入食品直接接触面，外缘握持部位细菌浸泡于食材之中。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_abn_02_tongs',
            label: '⚠️ 3.2 工具破坏：夹柄滑落深部浸没 (Tongs Submersion)',
            category: 'abnormal',
            anomalyType: 'utensil_submersion',
            x: 28,
            y: 35,
            width: 44,
            height: 30,
            confidence: 0.972,
            color: '#e11d48'
          }
        ]
      },
      {
        id: 'abnorm_sal_03',
        title: '常温放置肌红蛋白氧化变褐变色 (ΔE = 5.2 色差超标)',
        category: 'abnormal',
        imageUrl: 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=1000&auto=format&fit=crop&q=80',
        captureSource: 'kitchen_lightbox',
        captureSourceLabel: '后厨多光谱表面分析仪',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 820,
        cielabL: 44.5,
        cielabA: 26.2,
        cielabB: 16.8,
        deltaE: 5.2,
        statusDescription: '鱼肉表面水分脱失、边缘发暗氧化，超过生鲜安全阈值 ΔE 4.0。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_abn_03_color',
            label: '📉 色差氧化变褐 (Chroma Oxidation ΔE>4.0)',
            category: 'abnormal',
            anomalyType: 'chroma_oxidation',
            x: 20,
            y: 26,
            width: 60,
            height: 52,
            confidence: 0.964,
            color: '#854d0e'
          }
        ]
      }
    ]
  },
  {
    id: 'dish_04',
    dishName: '安格斯慢烤谷饲西冷牛排',
    dishNameEn: 'Angus Slow-Roasted Sirloin Steak',
    stationId: 'hot_carvery',
    stationName: '慢烤西冷牛排与热菜保温炉',
    imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    sampleCount: 340,
    lastTrained: '今日 07:00',
    modelAccuracy: 96.8,
    status: 'trained',
    detectionTargets: {
      handContact: true,
      tongsDropped: true,
      dryingDepletion: true,
      colorShift: true,
      soupSpill: true
    },
    notes: '高温油烟补偿算法激活，监测夹子掉落菜盆与保温灯久烤发干',
    trainingMetrics: {
      mAP50: 97.2,
      mAP50_95: 90.8,
      precision: 96.5,
      recall: 96.1,
      latencyMs: 15.6,
      epochs: 120,
      lossCurve: [0.95, 0.52, 0.33, 0.22, 0.15, 0.09, 0.062]
    },
    normalSamples: [
      {
        id: 'norm_beef_01',
        title: '慢烤牛排刚出炉黄金满盘保温 (标准状态基准)',
        category: 'normal',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&auto=format&fit=crop&q=80',
        captureSource: '4k_dome_camera',
        captureSourceLabel: '保温炉上方 4K 半球顶摄 (Dome-02)',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 920,
        cielabL: 38.2,
        cielabA: 28.4,
        cielabB: 19.5,
        deltaE: 1.1,
        statusDescription: '肉汁饱满微泛高光，保温炉水浴恒温 68°C，红色专用肉类夹放置于侧槽。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_norm_beef_01',
            label: '标准满盘温控陈列 (Normal Carvery Plating)',
            category: 'normal',
            x: 10,
            y: 15,
            width: 80,
            height: 70,
            confidence: 0.99,
            color: '#10b981'
          }
        ]
      }
    ],
    abnormalSamples: [
      {
        id: 'abnorm_beef_01',
        title: '保温红外灯下久烤发干 / 油水分离结壳 (发干预警)',
        category: 'abnormal',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
        captureSource: '4k_dome_camera',
        captureSourceLabel: '保温炉半球顶摄多光谱分析',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 880,
        cielabL: 29.4,
        cielabA: 18.2,
        cielabB: 12.1,
        deltaE: 4.9,
        statusDescription: '肉面超过 45 分钟未翻拌，表面水分低于 18%，形成干燥硬结与暗沉。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_abn_beef_01',
            label: '⚠️ 1. 异常液体：本体脱水与油脂分层 (Syneresis)',
            category: 'abnormal',
            anomalyType: 'liquid_oil_separation',
            x: 18,
            y: 22,
            width: 65,
            height: 56,
            confidence: 0.971,
            color: '#f59e0b'
          }
        ]
      },
      {
        id: 'abnorm_beef_03_foreign',
        title: '后厨备餐出菜瓷盘磕碰边缘微小瓷屑掉入 (异物人身安全高危)',
        category: 'abnormal',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
        captureSource: 'kitchen_lightbox',
        captureSourceLabel: '后厨品控台 4K 高分辨率质检',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 950,
        cielabL: 38.0,
        cielabA: 26.0,
        cielabB: 18.0,
        deltaE: 1.8,
        statusDescription: '盘沿受磕碰崩脱 3mm 锋利白色瓷盘残片，掉落在牛排侧翼，食道划伤重大隐患。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_abn_beef_03_frag',
            label: '🚨 2. 异物入侵：器具破损残片/碎玻璃 (Utensil Frag)',
            category: 'abnormal',
            anomalyType: 'foreign_utensil_frag',
            x: 58,
            y: 38,
            width: 14,
            height: 15,
            confidence: 0.992,
            color: '#8b5cf6'
          }
        ]
      },
      {
        id: 'abnorm_beef_02',
        title: '菜品剩余量少于 15% 见底未补 (后厨补餐脱节)',
        category: 'abnormal',
        imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1000&auto=format&fit=crop&q=80',
        captureSource: '4k_dome_camera',
        captureSourceLabel: '餐台 4K 半球顶摄',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 900,
        cielabL: 34.0,
        cielabA: 22.0,
        cielabB: 15.0,
        deltaE: 2.2,
        statusDescription: '盘底大面积露白，仅余 2 小块肉排，客流高峰期缺菜影响高端体验。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_abn_beef_02',
            label: '📉 低余量缺菜预警 (Depletion < 15%)',
            category: 'abnormal',
            anomalyType: 'food_drying_depletion',
            x: 22,
            y: 28,
            width: 58,
            height: 48,
            confidence: 0.98,
            color: '#ea580c'
          }
        ]
      }
    ]
  },
  {
    id: 'dish_03',
    dishName: '水耕有机蔬菜与甘蓝沙拉',
    dishNameEn: 'Hydroponic Greens & Kale Salad',
    stationId: 'vegan_bar',
    stationName: '水耕有机蔬菜与纯素吧',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    sampleCount: 510,
    lastTrained: '今日 06:15',
    modelAccuracy: 99.1,
    status: 'trained',
    detectionTargets: {
      handContact: true,
      tongsDropped: true,
      dryingDepletion: true,
      colorShift: false,
      soupSpill: true
    },
    notes: '重点检测外来深色肉汁飞溅滴落（直径 > 3mm）及咬过食物放回',
    trainingMetrics: {
      mAP50: 99.3,
      mAP50_95: 94.1,
      precision: 99.2,
      recall: 98.7,
      latencyMs: 12.8,
      epochs: 180,
      lossCurve: [0.75, 0.38, 0.21, 0.14, 0.09, 0.05, 0.031]
    },
    normalSamples: [
      {
        id: 'norm_salad_01',
        title: '水耕绿叶鲜翠无杂质满盘 (纯素认证基准)',
        category: 'normal',
        imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80',
        captureSource: 'kitchen_lightbox',
        captureSourceLabel: '后厨冷盘标准品控台',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 850,
        cielabL: 62.1,
        cielabA: -28.4,
        cielabB: 34.2,
        deltaE: 1.0,
        statusDescription: '绿叶饱满带细微露珠，色泽鲜亮，无外源油脂，绿色专用素食夹归位。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_norm_sal_01',
            label: '标准纯素摆盘 (Ground Truth Vegan Salad)',
            category: 'normal',
            x: 8,
            y: 12,
            width: 84,
            height: 76,
            confidence: 0.995,
            color: '#10b981'
          }
        ]
      }
    ],
    abnormalSamples: [
      {
        id: 'abnorm_salad_01',
        title: '邻近荤菜深色黑椒肉汁滴入素菜冷盘 (交叉污染违规)',
        category: 'abnormal',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1000&auto=format&fit=crop&q=80',
        captureSource: '4k_dome_camera',
        captureSourceLabel: '纯素台 4K 半球顶摄动态追踪',
        resolution: '3840x2160 (4K UHD)',
        lightingLux: 800,
        cielabL: 48.0,
        cielabA: -12.0,
        cielabB: 18.0,
        deltaE: 6.8,
        statusDescription: '顾客盘中带出的深色酱汁滴溅在浅色甘蓝菜叶上，破坏素食与清真防线。',
        isAnnotated: true,
        annotations: [
          {
            id: 'box_abn_salad_01',
            label: '💧 滴汁交叉污染 (Sauce Drip Contamination)',
            category: 'abnormal',
            anomalyType: 'drip_contamination',
            x: 32,
            y: 38,
            width: 28,
            height: 26,
            confidence: 0.988,
            color: '#0d9488'
          }
        ]
      }
    ]
  },
  {
    id: 'dish_02',
    dishName: '清真风干牛肉与冷切香肠',
    dishNameEn: 'Halal Cured Beef & Deli Cuts',
    stationId: 'halal_deli',
    stationName: '清真Halal认证冷切肉盘',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    sampleCount: 380,
    lastTrained: '昨日 21:00',
    modelAccuracy: 97.2,
    status: 'trained',
    detectionTargets: {
      handContact: true,
      tongsDropped: true,
      dryingDepletion: false,
      colorShift: true,
      soupSpill: false
    },
    notes: '核心检测色标取餐夹混入（仅允许绿色标定夹）与跨盘接触',
    trainingMetrics: {
      mAP50: 97.8,
      mAP50_95: 91.5,
      precision: 97.4,
      recall: 96.8,
      latencyMs: 13.5,
      epochs: 130,
      lossCurve: [0.88, 0.46, 0.27, 0.17, 0.11, 0.065]
    }
  },
  {
    id: 'dish_05',
    dishName: '法式黄油羊角可颂与果盘',
    dishNameEn: 'French Butter Croissants & Melons',
    stationId: 'fruit_dessert',
    stationName: '法式西点欧包与鲜切热带水果',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    sampleCount: 290,
    lastTrained: '前日 18:30',
    modelAccuracy: 95.5,
    status: 'trained',
    detectionTargets: {
      handContact: true,
      tongsDropped: false,
      dryingDepletion: true,
      colorShift: true,
      soupSpill: false
    },
    notes: '检测顾客徒手拿取烘焙欧包，以及鲜切哈密瓜多酚氧化变色',
    trainingMetrics: {
      mAP50: 96.2,
      mAP50_95: 89.4,
      precision: 95.8,
      recall: 95.1,
      latencyMs: 14.8,
      epochs: 100,
      lossCurve: [0.92, 0.51, 0.32, 0.21, 0.14, 0.082]
    }
  }
];

export const INITIAL_SILVERWARE_INTERCEPTS: SilverwareInterceptEvent[] = [
  {
    id: 'SILV-1029',
    timestamp: '08:44:02',
    itemName: 'Christofle 昆庭 Jardin d\'Eden 纯银主餐叉',
    brand: 'Christofle (France)',
    material: '925_sterling_silver',
    estimatedValue: 1850,
    baffleStatus: 'locked',
    reflectionIndex: 99.2,
    photoLabel: 'Christofle 925 Hallmark Detected',
    operatorStation: '洗碗间 A-02 号倒台入口',
    interceptSpeedMs: 115,
    retrieved: false
  },
  {
    id: 'SILV-1028',
    timestamp: '08:21:45',
    itemName: 'Robbe & Berking 纯银黄油刮刀',
    brand: 'Robbe & Berking (Germany)',
    material: '925_sterling_silver',
    estimatedValue: 1420,
    baffleStatus: 'unlocked',
    reflectionIndex: 98.5,
    photoLabel: 'Sterling Silver Blade Reflection',
    operatorStation: '洗碗间 A-01 号传送带',
    interceptSpeedMs: 108,
    retrieved: true
  },
  {
    id: 'SILV-1027',
    timestamp: '07:55:12',
    itemName: 'Wedgwood 浮雕玉石骨瓷小酱盅 (2.5寸)',
    brand: 'Wedgwood (UK)',
    material: 'bone_china',
    estimatedValue: 680,
    baffleStatus: 'unlocked',
    reflectionIndex: 94.1,
    photoLabel: 'Translucent Bone China Rim Profile',
    operatorStation: '洗碗间 A-03 号清台斗',
    interceptSpeedMs: 132,
    retrieved: true
  },
  {
    id: 'SILV-1026',
    timestamp: '07:38:09',
    itemName: 'WMF 镀银特浓咖啡勺 (Silver-Plated)',
    brand: 'WMF Hotel Collection',
    material: 'silver_plated',
    estimatedValue: 240,
    baffleStatus: 'unlocked',
    reflectionIndex: 91.0,
    photoLabel: 'High Lustre Silver Plate Curve',
    operatorStation: '洗碗间 A-02 号倒台入口',
    interceptSpeedMs: 120,
    retrieved: true
  }
];

export const INITIAL_ESG_RECORDS: FoodWasteESGRecord[] = [
  {
    id: 'ESG-01',
    dishName: '意式黑椒安格斯炒牛柳',
    category: '热菜热点主菜',
    wastePercentage: 28.5,
    yesterdayPrepKg: 45.0,
    actualConsumedKg: 32.2,
    wastedKg: 12.8,
    recommendedNextDayPrepKg: 33.5,
    reductionPercentage: 25.5,
    estimatedCostSaved: 1920,
    co2eSavedKg: 48.6
  },
  {
    id: 'ESG-02',
    dishName: '挪威冰鲜三文鱼刺身厚切',
    category: '冷盘高客单刺身',
    wastePercentage: 16.8,
    yesterdayPrepKg: 28.0,
    actualConsumedKg: 23.3,
    wastedKg: 4.7,
    recommendedNextDayPrepKg: 24.0,
    reductionPercentage: 14.3,
    estimatedCostSaved: 1410,
    co2eSavedKg: 18.2
  },
  {
    id: 'ESG-03',
    dishName: '地中海迷迭香慢烤春鸡',
    category: '禽肉热菜',
    wastePercentage: 35.2,
    yesterdayPrepKg: 32.0,
    actualConsumedKg: 20.7,
    wastedKg: 11.3,
    recommendedNextDayPrepKg: 22.0,
    reductionPercentage: 31.2,
    estimatedCostSaved: 980,
    co2eSavedKg: 24.5
  },
  {
    id: 'ESG-04',
    dishName: '三色藜麦烤南瓜牛油果温沙拉',
    category: '纯有机素食',
    wastePercentage: 41.0,
    yesterdayPrepKg: 20.0,
    actualConsumedKg: 11.8,
    wastedKg: 8.2,
    recommendedNextDayPrepKg: 13.5,
    reductionPercentage: 32.5,
    estimatedCostSaved: 560,
    co2eSavedKg: 9.8
  },
  {
    id: 'ESG-05',
    dishName: '广式金牌鲜虾流沙包',
    category: '中式蒸点早茶',
    wastePercentage: 14.2,
    yesterdayPrepKg: 24.0,
    actualConsumedKg: 20.6,
    wastedKg: 3.4,
    recommendedNextDayPrepKg: 21.5,
    reductionPercentage: 10.4,
    estimatedCostSaved: 380,
    co2eSavedKg: 6.2
  }
];

export const INITIAL_GUESTS: GuestProfile[] = [
  {
    id: 'GST-8812',
    roomNumber: '8812',
    guestName: 'David Sterling 先生',
    membershipTier: 'Centurion VIP',
    stayDates: '09/08 - 09/14 (总统套房)',
    breakfastEntitled: 2,
    breakfastConsumedToday: 0,
    isFlaggedRepeatEntry: false,
    dietaryRestrictions: ['极重度花生过敏', '甲壳海鲜过敏 (贝类)'],
    allergens: ['Peanut Allergy (EpiPen携带)', 'Shellfish Anaphylaxis'],
    customPreferences: ['常温无气泡柠檬水', '靠窗花园景观静音位', '刺身要求单独砧板厚切', '咖啡配燕麦奶'],
    totalBillRoom: 4580
  },
  {
    id: 'GST-6208',
    roomNumber: '6208',
    guestName: '陆启明 博士',
    membershipTier: 'Titanium',
    stayDates: '09/09 - 09/12 (行政海景大床)',
    breakfastEntitled: 2,
    breakfastConsumedToday: 1, // Already entered once at 07:15
    isFlaggedRepeatEntry: true, // repeat entry flag
    dietaryRestrictions: ['清真饮食 (Halal strictly)'],
    allergens: ['严禁任何猪肉及酒精烹饪制剂'],
    customPreferences: ['需配清真专用取餐夹', '现煮大吉岭红茶加脱脂鲜奶'],
    totalBillRoom: 1820
  },
  {
    id: 'GST-5102',
    roomNumber: '5102',
    guestName: 'Elena Rostova 女士',
    membershipTier: 'Diamond',
    stayDates: '09/07 - 09/11 (豪华套房)',
    breakfastEntitled: 1,
    breakfastConsumedToday: 0,
    isFlaggedRepeatEntry: false,
    dietaryRestrictions: ['严格纯素 (Strict Vegan)', '麸质不耐受 (Gluten-Free)'],
    allergens: ['Dairy/Lactose', 'Gluten Wheat Protein'],
    customPreferences: ['所有沙拉请勿加奶酪蛋黄酱', '备齐无麸质法棍面包'],
    totalBillRoom: 2360
  },
  {
    id: 'GST-3315',
    roomNumber: '3315',
    guestName: '陈立新 先生',
    membershipTier: 'Standard',
    stayDates: '09/10 - 09/11 (高级城景双床)',
    breakfastEntitled: 0, // No breakfast package!
    breakfastConsumedToday: 0,
    isFlaggedRepeatEntry: false,
    dietaryRestrictions: ['无特殊限制'],
    allergens: [],
    customPreferences: ['喜欢辣味调料/自制辣椒油'],
    totalBillRoom: 920
  }
];

export const INITIAL_TABLES: TableItem[] = [
  { id: 'T01', tableNumber: 'T-01', zone: 'Window', capacity: 2, status: 'dining', guestRoom: '8812', guestName: 'David Sterling', guestsCount: 2, occupiedSince: '08:35', orderTotal: 580, pendingAlertsCount: 1 },
  { id: 'T02', tableNumber: 'T-02', zone: 'Window', capacity: 4, status: 'dining', guestRoom: '6208', guestName: '陆启明', guestsCount: 2, occupiedSince: '08:12', orderTotal: 0 },
  { id: 'T03', tableNumber: 'T-03', zone: 'Window', capacity: 2, status: 'empty', guestsCount: 0 },
  { id: 'T04', tableNumber: 'T-04', zone: 'Garden Terrace', capacity: 4, status: 'dining', guestRoom: '5102', guestName: 'Elena Rostova', guestsCount: 1, occupiedSince: '08:25', orderTotal: 320 },
  { id: 'T05', tableNumber: 'T-05', zone: 'Garden Terrace', capacity: 6, status: 'needs_bussing', guestsCount: 0, occupiedSince: '07:45 - 08:30' },
  { id: 'T06', tableNumber: 'T-06', zone: 'Garden Terrace', capacity: 4, status: 'reserved', guestRoom: 'VIP-Pres', guestName: '王董事 (预订 09:00)', guestsCount: 4 },
  { id: 'T07', tableNumber: 'T-07', zone: 'Main Dining', capacity: 4, status: 'dining', guestRoom: '3315', guestName: '陈立新', guestsCount: 2, occupiedSince: '08:40', orderTotal: 596 },
  { id: 'T08', tableNumber: 'T-08', zone: 'Main Dining', capacity: 4, status: 'empty', guestsCount: 0 },
  { id: 'T09', tableNumber: 'T-09', zone: 'Main Dining', capacity: 8, status: 'empty', guestsCount: 0 },
  { id: 'T10', tableNumber: 'T-10', zone: 'Private Alcove', capacity: 6, status: 'dining', guestRoom: '8801', guestName: 'G. Schneider', guestsCount: 5, occupiedSince: '08:05', orderTotal: 1420 }
];

export const INITIAL_SYSTEM_STATS: SystemStats = {
  todayAlertsCount: 18,
  dripsBlockedCount: 7,
  silverwareSavedCount: 42,
  silverwareSavedAmountYuan: 128450,
  organicCompostKg: 68.4,
  co2eReducedKg: 107.3,
  kitchenPrepSavingsYuan: 6250,
  activeWaitersOnShift: 8,
  overheadCamFps: 59.8,
  aiLatencyMs: 14.2
};
