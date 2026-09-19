import { AnomalyDefinition, AnomalyMajorCategory, AnomalyType } from '../types';

export const MAJOR_CATEGORY_LABELS: Record<AnomalyMajorCategory, { label: string; labelEn: string; color: string; description: string }> = {
  abnormal_liquid: {
    label: '1. 异常液体 (Abnormal Liquids)',
    labelEn: 'Abnormal Liquids',
    color: '#f59e0b', // amber
    description: '异源跨盘互滴、生熟化水流液、外源喷洒及本体油水分离'
  },
  foreign_object: {
    label: '2. 异物入侵 (Foreign Objects)',
    labelEn: 'Foreign Objects',
    color: '#8b5cf6', // purple
    description: '人体毛发指甲、随身纸巾吸管套、厨具玻璃碎片及飞虫'
  },
  destructive_hand: {
    label: '3.1 人手破坏性接触 (Hand Contact)',
    labelEn: 'Destructive Hand Contact',
    color: '#ef4444', // red
    description: '徒手捏取、反复挑拣翻动、试探摸软硬、咬后退回及袖口拖曳'
  },
  destructive_tool: {
    label: '3.2 工具破坏性接触 (Utensil Misuse)',
    labelEn: 'Destructive Tool Misuse',
    color: '#e11d48', // rose
    description: '跨区混夹、夹柄深部浸没、私人私筷探入及暴力捣碎挖取'
  },
  normal_plating: {
    label: '0. 正常合规状态 (Ground Truth)',
    labelEn: 'Normal Plating',
    color: '#10b981', // emerald
    description: '五星级黄金摆盘陈列、餐夹归位就位、多光谱鲜度达标'
  }
};

export const ANOMALY_TAXONOMY: Record<string, AnomalyDefinition> = {
  // 1. 异常液体
  liquid_cross_drip: {
    code: 'liquid_cross_drip',
    majorCategory: 'abnormal_liquid',
    majorCategoryLabel: '1. 异常液体',
    name: '异源跨盘互滴 (Cross Drip)',
    nameEn: 'Cross-Station Liquid Drip',
    severity: 'critical',
    impact: '击穿素食/清真合规防线，或混入海鲜/坚果等致命过敏原',
    sopAction: '立即局部铲除受污染区域，重度污染执行整盘更换与抹盘',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  liquid_raw_leak: {
    code: 'liquid_raw_leak',
    majorCategory: 'abnormal_liquid',
    majorCategoryLabel: '1. 异常液体',
    name: '生熟交叉流液/化水 (Raw Leak)',
    nameEn: 'Raw Juice / Thaw Exudate Leak',
    severity: 'critical',
    impact: '解冻血水或冰盘化水渗漏，副溶血性弧菌及沙门氏菌高危扩散',
    sopAction: '更换冰垫，重置阻水隔水槽，生熟区边缘全面酒精消毒',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  liquid_foreign_splash: {
    code: 'liquid_foreign_splash',
    majorCategory: 'abnormal_liquid',
    majorCategoryLabel: '1. 异常液体',
    name: '外源液体飞溅 (Foreign Splash)',
    nameEn: 'Foreign Beverage/Aerosol Splash',
    severity: 'warning',
    impact: '外带含糖饮料倾洒或保洁消毒喷雾微粒沉降，导致化学/异味污染',
    sopAction: '立即整盘撤回后厨废弃，检查空调冷凝出风口',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  liquid_oil_separation: {
    code: 'liquid_oil_separation',
    majorCategory: 'abnormal_liquid',
    majorCategoryLabel: '1. 异常液体',
    name: '本体油水分离/脱水 (Syneresis)',
    nameEn: 'Food Syneresis & Oil Separation',
    severity: 'warning',
    impact: '保温灯长时间照射导致滑蛋析出水或酱汁分层结硬皮，口感急剧劣变',
    sopAction: '后厨补备现炒新菜品，撤换旧盘',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },

  // 2. 异物
  foreign_biological: {
    code: 'foreign_biological',
    majorCategory: 'foreign_object',
    majorCategoryLabel: '2. 异物入侵',
    name: '人体脱落物 (Biological Debris)',
    nameEn: 'Hair, Nails & Bandage Artifacts',
    severity: 'critical',
    impact: '发丝、皮屑、假指甲脱落或创口贴掉落，引发肉毒杆菌与恶性客诉',
    sopAction: '触发全台紧急撤盘，封存样本，通知厨师长启动追溯',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  foreign_belongings: {
    code: 'foreign_belongings',
    majorCategory: 'foreign_object',
    majorCategoryLabel: '2. 异物入侵',
    name: '随身杂物脱落 (Guest Belongings)',
    nameEn: 'Napkin, Toothpick & Jewelry',
    severity: 'warning',
    impact: '纸巾絮片、吸管塑料套、牙签或戒指掉入，破坏用餐安全',
    sopAction: '使用专用备用夹拾取排查，若浸泡汤汁则整盆报废',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200'
  },
  foreign_utensil_frag: {
    code: 'foreign_utensil_frag',
    majorCategory: 'foreign_object',
    majorCategoryLabel: '2. 异物入侵',
    name: '器具残片/碎玻璃 (Utensil Fragments)',
    nameEn: 'Glass Shards & Porcelain Chips',
    severity: 'critical',
    impact: '玻璃杯碰撞或瓷盘崩边碎片掉落，极易划伤食道造成人身伤害',
    sopAction: '最高优先级警报！立即停供该档口，全盘彻查与更换',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  },
  foreign_pest: {
    code: 'foreign_pest',
    majorCategory: 'foreign_object',
    majorCategoryLabel: '2. 异物入侵',
    name: '生物性飞虫 (Biosecurity Pest)',
    nameEn: 'Flies & Flying Insects',
    severity: 'critical',
    impact: '飞虫扑入菜盘停留，携带大肠杆菌传播，击毁星级口碑',
    sopAction: '立即加盖撤盘，调节档口隐形风幕机与捕虫灯风向',
    badgeColor: 'bg-purple-100 text-purple-900 border-purple-300'
  },

  // 3.1 人手破坏性接触
  contact_finger_pinch: {
    code: 'contact_finger_pinch',
    majorCategory: 'destructive_hand',
    majorCategoryLabel: '3.1 人手破坏性接触',
    name: '直接徒手捏取 (Finger Pinching)',
    nameEn: 'Bare Hand Direct Pinching',
    severity: 'critical',
    impact: '跳过取餐夹直接用手捏取即食食物，皮肤油脂与金黄色葡萄球菌污染',
    sopAction: '服务员微笑礼貌递送新夹并柔和提醒，换取被碰触点位食材',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  },
  contact_hand_sifting: {
    code: 'contact_hand_sifting',
    majorCategory: 'destructive_hand',
    majorCategoryLabel: '3.1 人手破坏性接触',
    name: '挑选翻动式大面积破坏 (Sifting & Flipping)',
    nameEn: 'Hand Sifting & Sorting Destruction',
    severity: 'critical',
    impact: '挑肉翻动并推回，大面积涂抹式污染整盘，破坏五星级黄金品相',
    sopAction: '必须整盘撤下重新出餐，不得保留被翻动残盘',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  },
  contact_hand_probing: {
    code: 'contact_hand_probing',
    majorCategory: 'destructive_hand',
    majorCategoryLabel: '3.1 人手破坏性接触',
    name: '试探触摸软硬/试温 (Texture Probing)',
    nameEn: 'Thermal / Texture Probing Contact',
    severity: 'warning',
    impact: '无意识手背探温或按压面包软硬，留下指纹油脂',
    sopAction: '巡台人员更换被按压受力单体',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  contact_tasted_returned: {
    code: 'contact_tasted_returned',
    majorCategory: 'destructive_hand',
    majorCategoryLabel: '3.1 人手破坏性接触',
    name: '尝后放回/盘内退回 (Tasted & Returned)',
    nameEn: 'Bitten/Tasted Food Returned to Tray',
    severity: 'critical',
    impact: '重大恶性食安违规！唾液直接污染公共盘，幽门螺杆菌及呼吸道病毒高危',
    sopAction: '绝对零容忍！立即隔离全盘撤走并全面紫外线消毒',
    badgeColor: 'bg-red-200 text-red-950 border-red-400'
  },
  contact_sleeve_drag: {
    code: 'contact_sleeve_drag',
    majorCategory: 'destructive_hand',
    majorCategoryLabel: '3.1 人手破坏性接触',
    name: '衣物袖口拖曳接触 (Sleeve Dragging)',
    nameEn: 'Sleeve & Bag Dragging Across Food',
    severity: 'warning',
    impact: '前倾取餐导致大衣袖口或背包带扫过菜品表面，带入外界灰尘纤维',
    sopAction: '整理受碰触边缘摆盘，必要时补换表层',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
  },

  // 3.2 工具破坏性接触
  utensil_cross_tongs: {
    code: 'utensil_cross_tongs',
    majorCategory: 'destructive_tool',
    majorCategoryLabel: '3.2 工具破坏性接触',
    name: '混夹与跨区滥用 (Cross-Tongs Misplacement)',
    nameEn: 'Cross-Contamination Tongs Misuse',
    severity: 'critical',
    impact: '荤菜夹混入素菜/清真档口，或海鲜夹误触坚果盘，引发致命过敏原事故',
    sopAction: '立即取走混用夹并投洗，更换被触碰菜品',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  },
  utensil_submersion: {
    code: 'utensil_submersion',
    majorCategory: 'destructive_tool',
    majorCategoryLabel: '3.2 工具破坏性接触',
    name: '夹柄掉落深部浸没 (Tongs Submersion)',
    nameEn: 'Dropped Tongs Handle Submersion',
    severity: 'critical',
    impact: '餐夹手柄整把滑入热汤或酱汁中，手部抓握细菌污染整盘汤体',
    sopAction: '戴食品级防烫手套取出丢弃，整锅汤汁撤换重煮',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-300'
  },
  utensil_personal_cutlery: {
    code: 'utensil_personal_cutlery',
    majorCategory: 'destructive_tool',
    majorCategoryLabel: '3.2 工具破坏性接触',
    name: '私人餐具探入/私筷试吃 (Personal Cutlery)',
    nameEn: 'Personal Fork/Chopsticks Intrusion',
    severity: 'critical',
    impact: '使用个人嘴唇含过的私筷私叉探入公用大盘挑菜或尝汤，唾液细菌交叠',
    sopAction: '立即更换新盘，为宾客奉上专用公筷公勺',
    badgeColor: 'bg-rose-200 text-rose-950 border-rose-400'
  },
  utensil_violent_digging: {
    code: 'utensil_violent_digging',
    majorCategory: 'destructive_tool',
    majorCategoryLabel: '3.2 工具破坏性接触',
    name: '暴力捣碎与挖取 (Violent Digging & Mashing)',
    nameEn: 'Violent Digging & Mashing Destruction',
    severity: 'warning',
    impact: '粗暴刮擦破坏整块鱼排或蛋糕，甚至刮脱高档骨瓷涂层',
    sopAction: '主厨用备用盘进行重新修整雕花或换新',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
  },
  utensil_overhang_drip: {
    code: 'utensil_overhang_drip',
    majorCategory: 'destructive_tool',
    majorCategoryLabel: '3.2 工具破坏性接触',
    name: '悬空横跨架搭滴挂 (Overhang Bridging)',
    nameEn: 'Tongs Bridging & Overhang Drips',
    severity: 'warning',
    impact: '夹子未归入专用槽而是横搭两盘之间，持续向相邻盘滴漏汁水',
    sopAction: '巡台服务员将夹具归位至清洗沥水槽',
    badgeColor: 'bg-rose-50 text-rose-800 border-rose-200'
  }
};

export const getAnomalyDefinition = (code?: string): AnomalyDefinition | undefined => {
  if (!code) return undefined;
  return ANOMALY_TAXONOMY[code];
};
