import React from 'react';
import { 
  Lock, 
  Hand, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Snowflake,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { BuffetStation, StationAnomaly } from '../types';

export type BuffetSceneScenario = 
  | 'idle_platter'          // 标准备餐陈列 (星级就绪)
  | 'hand_contact'          // 突发违规：顾客徒手直接抓取
  | 'tongs_serving'         // 规范取餐：顾客使用专用夹
  | 'tongs_dropped'         // 器具失误：取餐夹掉入菜盆
  | 'drip_contamination'    // 滴汁交叉污染
  | 'food_drying_depletion'; // 保温久烤发干/余量见底

interface BuffetSceneViewportProps {
  station: BuffetStation;
  scenario: BuffetSceneScenario;
  onSelectScenario: (sc: BuffetSceneScenario) => void;
  visionMode: 'rgb' | 'spectral' | 'thermal';
  streamMode: 'live_video' | 'snapshot';
  timecode: string;
  liveFps: number;
  anomalies: StationAnomaly[];
  onOpenAttendantReview?: (anomaly: StationAnomaly) => void;
}

export const BuffetSceneViewport: React.FC<BuffetSceneViewportProps> = ({
  station,
  scenario,
  onSelectScenario,
  visionMode,
  streamMode,
  timecode,
  liveFps,
  anomalies,
  onOpenAttendantReview
}) => {
  // Active critical anomaly if scenario is one of the alerts
  const currentAnomaly = anomalies.find(a => a.stationId === station.id && a.status === 'active');

  // Vessel styling per station category
  const isHotStation = station.category === 'Hot';
  const isColdStation = station.category === 'Cold';
  const isHalalStation = station.category === 'Halal';
  const isVeganStation = station.category === 'Vegan';
  const isFruitStation = station.category === 'Fruit';

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-emerald-300/80 bg-slate-950 flex flex-col justify-between shadow-2xl select-none group font-sans">
      {/* 1. Countertop Marble Surface Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 opacity-95">
        {/* Fine Marble Texture Veins */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-400 via-stone-300 to-transparent"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(203,213,225,0.4)_50%,transparent_75%)] bg-[length:24px_24px] opacity-20"></div>
      </div>

      {/* 2. Hotel Sneeze Guard Glass Reflection Rim (防喷溅透明亚克力/钢化玻璃护罩反射层) */}
      <div className="absolute top-0 inset-x-0 h-10 bg-gradient-to-b from-white/40 via-white/10 to-transparent pointer-events-none z-10 border-b border-white/40 backdrop-blur-[0.5px]">
        <div className="flex items-center justify-between px-6 py-1 text-[9px] font-mono text-slate-500 uppercase tracking-widest">
          <span>◆ SNEEZE GUARD TEMPERED SAFETY GLASS (NSF CERTIFIED)</span>
          <span>STATION ID: {station.id.toUpperCase()}</span>
        </div>
      </div>

      {/* 3. The 5-Star Hotel Buffet Vessel Container (大理石台面上的五星级餐盘/保温炉/冰台) */}
      <div className="absolute inset-x-8 top-9 bottom-12 rounded-2xl p-1.5 shadow-2xl transition-all duration-500 flex flex-col z-0">
        
        {/* Vessel Outer Rim */}
        {isHotStation ? (
          /* High-Grade Brushed Stainless Steel Chafing Dish Frame (喜来登豪华滚盖不锈钢保温炉 GN 1/1) */
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-slate-300 via-slate-100 to-slate-400 p-2.5 border-2 border-slate-400 shadow-[0_12px_32px_rgba(0,0,0,0.35)]">
            {/* Roll-top brass hinge details */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-8 py-0.5 rounded-full bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 text-stone-900 text-[9px] font-bold tracking-widest shadow-md border border-amber-300 uppercase">
              ★ SHANGRI-LA / SHERATON HOT CHAFER GN 1/1 ★
            </div>
            {/* Inner Pan Recessed Shadow */}
            <div className="w-full h-full rounded-xl overflow-hidden border-2 border-slate-500/60 shadow-inner relative bg-stone-900">
              {/* Halogen Food Heat Lamp Glow */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(245,158,11,0.35)_0%,transparent_70%)] pointer-events-none z-10"></div>
              {/* Rising Steam Effect */}
              {streamMode === 'live_video' && (
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-transparent via-amber-100/10 to-transparent pointer-events-none animate-pulse z-10"></div>
              )}
            </div>
          </div>
        ) : isColdStation ? (
          /* Chilled Crushed Ice Bed Counter with Black Stoneware Platter (冰镇海鲜刺身碎冰冷藏台) */
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-sky-100 via-white to-sky-200 p-2.5 border-2 border-sky-300 shadow-[0_12px_32px_rgba(14,165,233,0.2)]">
            {/* Crushed ice texture backdrop */}
            <div className="absolute inset-1 rounded-xl bg-[radial-gradient(#bae6fd_1px,transparent_1px)] [background-size:8px_8px] opacity-60"></div>
            {/* Sub-zero cold mist */}
            {streamMode === 'live_video' && (
              <div className="absolute inset-0 bg-gradient-to-t from-sky-200/20 via-white/10 to-transparent pointer-events-none animate-pulse z-10"></div>
            )}
            {/* Center Heavy Japanese Black Lacquer / Ceramic Platter (刺身大黑陶盘) */}
            <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-stone-950">
              <div className="absolute top-2 left-2 text-[9px] font-mono text-sky-300 z-10 bg-black/60 px-2 py-0.5 rounded border border-sky-400/40">
                ❄️ CRUSHED ICE WELL: 0.8°C
              </div>
            </div>
          </div>
        ) : isHalalStation ? (
          /* Certified Halal Italian White Carrara Marble Board with Brass Border (清真认证冷切大理石展台) */
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-stone-100 via-white to-stone-200 p-2.5 border-2 border-emerald-400 shadow-[0_12px_32px_rgba(16,185,129,0.25)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-full bg-emerald-700 text-white text-[9px] font-bold tracking-widest shadow-md border border-emerald-300 uppercase flex items-center gap-1">
              <span>حلال</span>
              <span>HALAL CERTIFIED COLD CUTS DISPLAY</span>
            </div>
            <div className="w-full h-full rounded-xl overflow-hidden border-2 border-emerald-600/40 shadow-inner relative bg-stone-900"></div>
          </div>
        ) : isVeganStation ? (
          /* Hydroponic Salad Recessed Porcelain Basin (水耕沙拉纯白瓷盆) */
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-emerald-50 via-white to-stone-100 p-2.5 border-2 border-teal-300 shadow-[0_12px_32px_rgba(20,184,166,0.2)]">
            <div className="w-full h-full rounded-xl overflow-hidden border-2 border-teal-400/50 shadow-inner relative bg-stone-900"></div>
          </div>
        ) : (
          /* French Pastry Marble & Brass Tiered Display (法式西点大理石黄铜展盘) */
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-amber-100 via-stone-50 to-amber-200 p-2.5 border-2 border-amber-300 shadow-[0_12px_32px_rgba(245,158,11,0.2)]">
            <div className="w-full h-full rounded-xl overflow-hidden border-2 border-amber-400/60 shadow-inner relative bg-stone-900"></div>
          </div>
        )}

        {/* 4. High-Resolution Food Image Placed inside the Vessel */}
        <div className="absolute inset-3 rounded-xl overflow-hidden z-0">
          <img
            src={station.cameraImageUrl}
            alt={station.name}
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover transition-all duration-700 ${
              visionMode === 'spectral' ? 'filter hue-rotate-90 contrast-125 saturate-150' : ''
            } ${visionMode === 'thermal' ? 'filter invert hue-rotate-180 contrast-150 saturate-200' : ''}`}
          />
          {/* Natural Vignette and Platter Border Shadow */}
          <div className="absolute inset-0 shadow-[inset_0_0_36px_rgba(0,0,0,0.65)] pointer-events-none"></div>
          
          {/* Subtle Garnish and Dish Tagging OSD inside pan */}
          <div className="absolute bottom-2.5 left-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white/90 text-[10px] font-medium border border-white/20 pointer-events-none flex items-center gap-1.5 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>星级盛盘: {station.activeItems.slice(0, 2).join(' · ')}</span>
          </div>
        </div>

        {/* 5. INTERACTION SCENARIO OVERLAYS (有人用手抓、用夹子取餐、或夹子掉入菜盆的真实场景视觉) */}
        
        {/* SCENARIO A: 顾客徒手直接抓取 (Bare Hand Contact Violation Scene) */}
        {scenario === 'hand_contact' && (
          <div className="absolute inset-0 pointer-events-none z-20 animate-in fade-in duration-300">
            {/* SVG Visual: Human Arm & Bare Hand reaching into the tray and gripping food directly */}
            <svg className="w-full h-full" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="4" dy="10" stdDeviation="8" floodColor="#000000" floodOpacity="0.75" />
                </filter>
                {/* Arm Skin Tone Gradient */}
                <linearGradient id="skinGradient" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#d4a373" />
                  <stop offset="50%" stopColor="#e0b589" />
                  <stop offset="100%" stopColor="#c5925f" />
                </linearGradient>
                {/* Sleeve Gradient */}
                <linearGradient id="sleeveGradient" x1="1" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#334155" />
                </linearGradient>
              </defs>

              {/* Guest Jacket Sleeve entering from top-right corner over the sneeze guard */}
              <path 
                d="M800 0 L660 0 L580 140 L720 180 Z" 
                fill="url(#sleeveGradient)" 
                filter="url(#handShadow)" 
              />
              <ellipse cx="650" cy="160" rx="72" ry="24" fill="#0f172a" />

              {/* Bare Wrist & Arm */}
              <path 
                d="M620 150 L500 230 C470 250 440 260 410 270 L430 310 C460 295 500 280 540 255 L650 170 Z" 
                fill="url(#skinGradient)" 
                filter="url(#handShadow)" 
              />

              {/* Bare Hand Palm & Fingers gripping the food directly */}
              {/* Palm */}
              <ellipse cx="430" cy="275" rx="42" ry="32" transform="rotate(-25 430 275)" fill="url(#skinGradient)" />

              {/* Thumb reaching around */}
              <path 
                d="M450 255 C430 235 400 235 385 245 C370 255 375 270 395 275 Z" 
                fill="#c5925f" 
              />
              {/* Index Finger pinching food */}
              <path 
                d="M400 260 C370 265 340 280 325 300 C320 308 335 315 348 310 C365 295 390 285 415 280 Z" 
                fill="#d4a373" 
              />
              {/* Middle Finger grabbing food slice */}
              <path 
                d="M395 280 C365 290 340 315 330 335 C325 342 340 350 350 342 C365 325 385 305 410 295 Z" 
                fill="#c5925f" 
              />
              {/* Ring & Pinky curled */}
              <path 
                d="M410 295 C390 310 375 335 370 350 C365 358 380 362 388 355 C398 340 415 320 430 305 Z" 
                fill="#ba8350" 
              />

              {/* Food slice being pinched in bare fingers (Salmon slice / beef piece) */}
              <path 
                d="M315 305 Q300 325 310 340 Q335 330 355 320 Q335 305 315 305 Z" 
                fill="#f87171" 
                stroke="#dc2626" 
                strokeWidth="2" 
                filter="url(#handShadow)" 
              />

              {/* AI YOLO-Pose Hand Keypoint Skeletal Tracking Overlay in safety RED */}
              <g stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
                {/* Wrist to palm joints */}
                <line x1="500" y1="230" x2="430" y2="275" strokeDasharray="3 3" />
                <line x1="430" y1="275" x2="395" y2="245" />
                <line x1="430" y1="275" x2="365" y2="280" />
                <line x1="430" y1="275" x2="350" y2="310" />
                <line x1="430" y1="275" x2="375" y2="335" />

                {/* Finger segments to tips */}
                <line x1="395" y1="245" x2="385" y2="245" />
                <line x1="365" y1="280" x2="335" y2="305" />
                <line x1="350" y1="310" x2="335" y2="338" />

                {/* Tracking Dots at keypoints */}
                <circle cx="500" cy="230" r="4" fill="#ef4444" />
                <circle cx="430" cy="275" r="5" fill="#f87171" stroke="#fff" strokeWidth="1.5" />
                <circle cx="395" cy="245" r="4" fill="#ef4444" />
                <circle cx="365" cy="280" r="4" fill="#ef4444" />
                <circle cx="335" cy="305" r="5" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />
                <circle cx="335" cy="338" r="5" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />
              </g>

              {/* Bounding Box on the violation contact point */}
              <rect 
                x="300" 
                y="225" 
                width="220" 
                height="150" 
                rx="10" 
                fill="rgba(239, 68, 68, 0.15)" 
                stroke="#ef4444" 
                strokeWidth="2.5" 
                strokeDasharray="6 4"
              />
              {/* Crosshair corners */}
              <path d="M295 240 L295 220 L315 220" stroke="#ef4444" strokeWidth="3" />
              <path d="M525 240 L525 220 L505 220" stroke="#ef4444" strokeWidth="3" />
              <path d="M295 360 L295 380 L315 380" stroke="#ef4444" strokeWidth="3" />
              <path d="M525 360 L525 380 L505 380" stroke="#ef4444" strokeWidth="3" />
            </svg>

            {/* Tactical AI Alert HUD Tag */}
            <div className="absolute top-[52%] left-[40%] -translate-x-1/2 -translate-y-1/2 bg-rose-600/95 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-rose-300 shadow-2xl flex items-center gap-2 animate-bounce">
              <Hand className="w-4 h-4 text-white animate-pulse" />
              <div>
                <div className="text-[11px] font-bold font-mono tracking-wide">
                  ⚠️ 拦截到顾客徒手抓菜违规现行 (98.6%)
                </div>
                <div className="text-[9px] text-rose-100 font-mono">
                  YOLO-Pose: 皮肤直接接触食材 · 违背五星级食安准则
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENARIO B: 规范取餐：顾客使用专用夹 (Guest Serving with Tongs Scene) */}
        {scenario === 'tongs_serving' && (
          <div className="absolute inset-0 pointer-events-none z-20 animate-in fade-in duration-300">
            <svg className="w-full h-full" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="tongsShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="3" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.6" />
                </filter>
                <linearGradient id="tongsMetal" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f1f5f9" />
                  <stop offset="40%" stopColor="#cbd5e1" />
                  <stop offset="70%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
              </defs>

              {/* Guest Hand holding tongs */}
              <path 
                d="M800 30 L670 120 C640 140 600 160 560 180 L580 220 C620 200 660 170 700 140 L800 80 Z" 
                fill="#d4a373" 
                filter="url(#tongsShadow)" 
              />
              {/* Fingers wrapped securely around the tong handles */}
              <ellipse cx="550" cy="195" rx="34" ry="24" transform="rotate(-20 550 195)" fill="#c5925f" />
              <path d="M540 180 C520 185 505 200 515 215 C525 225 545 220 555 210 Z" fill="#d4a373" />

              {/* Stainless Steel Serving Tongs Body */}
              {/* Top Arm */}
              <path 
                d="M580 160 C500 200 420 250 360 280 C345 288 335 295 330 305 L345 315 C360 305 430 255 520 215 Z" 
                fill="url(#tongsMetal)" 
                filter="url(#tongsShadow)" 
              />
              {/* Bottom Arm */}
              <path 
                d="M580 180 C510 220 440 270 380 320 C365 332 350 340 340 342 L335 328 C350 320 420 270 510 225 Z" 
                fill="url(#tongsMetal)" 
                filter="url(#tongsShadow)" 
              />

              {/* Scalloped Tongs Head pinching food neatly */}
              <path 
                d="M325 305 C315 310 310 320 315 330 C325 340 338 340 342 332 Z" 
                fill={station.tongsColor || '#3b82f6'} 
                stroke="#fff" 
                strokeWidth="1.5" 
              />

              {/* Food piece cleanly gripped between tong heads */}
              <ellipse cx="330" cy="320" rx="20" ry="12" transform="rotate(-15 330 320)" fill="#f87171" stroke="#b91c1c" strokeWidth="1.5" />

              {/* AI Verification Green Target Box */}
              <rect 
                x="300" 
                y="270" 
                width="280" 
                height="110" 
                rx="8" 
                fill="rgba(16, 185, 129, 0.1)" 
                stroke="#10b981" 
                strokeWidth="2" 
                strokeDasharray="4 4" 
              />
            </svg>

            {/* AI Verified Safe Pill */}
            <div className="absolute top-[68%] left-[45%] -translate-x-1/2 bg-emerald-700/95 backdrop-blur-md text-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xl flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <div>
                <div className="text-[11px] font-bold font-mono">
                  ✓ 规范取餐：顾客正确使用专用夹具 (99.4%)
                </div>
                <div className="text-[9px] text-emerald-100 font-mono">
                  {station.tongsType} · 无手部直接触碰风险
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENARIO C: 器具失误：取餐夹掉入菜盆 (Tongs Dropped into Tray Scene) */}
        {scenario === 'tongs_dropped' && (
          <div className="absolute inset-0 pointer-events-none z-20 animate-in fade-in duration-300">
            <svg className="w-full h-full" viewBox="0 0 800 450" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="droppedShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="2" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.8" />
                </filter>
              </defs>

              {/* Tongs submerged at an awkward angle right in the center of the food platter */}
              <g transform="rotate(35 420 240)" filter="url(#droppedShadow)">
                {/* Tong Body submerged in sauce */}
                <path d="M300 220 L520 220 C540 220 560 235 560 245 C560 255 540 270 520 270 L300 270 Z" fill="#94a3b8" />
                <path d="M310 230 L510 230 C525 230 535 240 535 245 C535 250 525 260 510 260 L310 260 Z" fill="#64748b" />
                {/* Scalloped Heads */}
                <ellipse cx="295" cy="245" rx="20" ry="30" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />

                {/* Dark Gravy / Sauce Splashed over the Tong Handle */}
                <path 
                  d="M440 220 C460 215 480 225 500 220 C520 225 540 230 550 240 C540 255 520 265 500 260 C470 265 450 255 440 250 Z" 
                  fill="#451a03" 
                  opacity="0.85" 
                />
              </g>

              {/* Splash ripples in the sauce */}
              <circle cx="440" cy="260" r="45" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
              <circle cx="440" cy="260" r="70" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

              {/* Tactical Danger Box */}
              <rect 
                x="320" 
                y="160" 
                width="260" 
                height="190" 
                rx="12" 
                fill="rgba(245, 158, 11, 0.15)" 
                stroke="#f59e0b" 
                strokeWidth="2.5" 
              />
            </svg>

            {/* Alert Badge */}
            <div className="absolute top-[48%] left-[50%] -translate-x-1/2 -translate-y-1/2 bg-amber-600/95 backdrop-blur-md text-white px-3.5 py-2 rounded-xl border border-amber-300 shadow-2xl flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-amber-200" />
              <div>
                <div className="text-xs font-bold font-mono">
                  ⚠️ 取餐夹失手整体掉入保温菜盆 (99.2%)
                </div>
                <div className="text-[10px] text-amber-100">
                  手柄浸没造成外源污染 · 需立即执行「整盘撤换」
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SCENARIO D: 滴汁交叉污染 (Drip Contamination Scene) */}
        {scenario === 'drip_contamination' && (
          <div className="absolute inset-0 pointer-events-none z-20 animate-in fade-in duration-300">
            <svg className="w-full h-full" viewBox="0 0 800 450" fill="none">
              {/* Droplets splashing on fresh greens */}
              <circle cx="400" cy="240" r="16" fill="#3f1a04" stroke="#78350f" strokeWidth="2" />
              <circle cx="435" cy="225" r="8" fill="#451a03" />
              <circle cx="375" cy="260" r="10" fill="#451a03" />

              <rect 
                x="350" 
                y="200" 
                width="120" 
                height="90" 
                rx="6" 
                fill="rgba(239, 68, 68, 0.15)" 
                stroke="#ef4444" 
                strokeWidth="2" 
              />
            </svg>

            <div className="absolute top-[52%] left-[50%] -translate-x-1/2 bg-rose-600/90 text-white px-3 py-1.5 rounded-lg text-xs font-mono font-bold shadow-xl border border-white/20">
              💧 黑椒肉汁滴入有机蔬菜 (滴径 4.5mm)
            </div>
          </div>
        )}

        {/* SCENARIO E: 保温久烤发干/余量见底 (Food Drying & Depletion Scene) */}
        {scenario === 'food_drying_depletion' && (
          <div className="absolute inset-0 pointer-events-none z-20 animate-in fade-in duration-300">
            <div className="absolute inset-x-8 bottom-6 bg-amber-950/70 backdrop-blur-xs p-3 rounded-xl border border-amber-400/50 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="text-xs font-mono font-bold">保温射灯照射超 45min · 表面水分流失，余量 &lt; 15%</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500 text-stone-900 font-bold">加急通知后厨出菜</span>
            </div>
          </div>
        )}

        {/* SCENARIO F: 标准五星盛盘就绪 (Pristine Standard Platter Scene) */}
        {scenario === 'idle_platter' && (
          <div className="absolute bottom-3 right-4 z-20 pointer-events-none">
            <div className="bg-emerald-950/75 backdrop-blur-md text-emerald-200 px-3 py-1 rounded-lg border border-emerald-400/40 text-[10px] font-mono flex items-center gap-1.5 shadow-lg">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>五星级星级陈列就绪 · 专用取餐夹规范归位</span>
            </div>
          </div>
        )}
      </div>

      {/* 6. Camera Scanline when Live Video Stream is Active */}
      {streamMode === 'live_video' && (
        <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-laser pointer-events-none z-30 opacity-80 shadow-[0_0_12px_rgba(52,211,153,0.8)]"></div>
      )}

      {/* 7. Top Camera OSD (4K CCTV Live HUD) */}
      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white/95 drop-shadow-md pointer-events-none z-30">
        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/15">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="font-bold tracking-wider">AI CAM // {station.nameEn.toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md border border-white/15">
          <span>{timecode}</span>
          <span className="text-emerald-300 font-bold">{liveFps} FPS</span>
          <span className="text-amber-300">4K 108° DOME</span>
        </div>
      </div>

      {/* 8. Bottom Bar: Privacy Shield & Temperature */}
      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-xs text-slate-200 text-[10px] font-mono px-2.5 py-1 rounded-md border border-white/15">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>边缘去人脸保护 · 追踪手势与器具接触面</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md border border-white/15">
            温控: <b className={station.temperature < 5 ? 'text-sky-300' : 'text-amber-300'}>{station.temperature}°C</b>
          </div>
          <div className="bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-1 rounded-md border border-white/15">
            保鲜: <b className="text-emerald-300">{station.freshnessIndex}%</b>
          </div>
        </div>
      </div>

      {/* 9. Interactive Direct Scenario Switcher (直接在画面下方切换真实取餐场景) */}
      <div className="absolute top-12 right-4 z-30 flex flex-col gap-1.5 pointer-events-auto">
        <div className="text-[10px] font-mono font-bold text-white bg-black/70 px-2 py-0.5 rounded backdrop-blur-xs border border-white/20 self-end">
          现场场景模拟视图:
        </div>

        <button
          onClick={() => onSelectScenario('hand_contact')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-md ${
            scenario === 'hand_contact'
              ? 'bg-rose-600 text-white ring-2 ring-rose-300 scale-105'
              : 'bg-black/60 hover:bg-rose-950/80 text-rose-200 border border-rose-400/40'
          }`}
          title="切换至顾客徒手直接抓取刺身/菜品违规现场"
        >
          <Hand className="w-3.5 h-3.5 text-rose-400" />
          <span>🖐️ 徒手抓菜 (违规现场)</span>
        </button>

        <button
          onClick={() => onSelectScenario('tongs_serving')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-md ${
            scenario === 'tongs_serving'
              ? 'bg-emerald-600 text-white ring-2 ring-emerald-300 scale-105'
              : 'bg-black/60 hover:bg-emerald-950/80 text-emerald-200 border border-emerald-400/40'
          }`}
          title="切换至顾客使用专用夹规范取餐真实场景"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>🥢 用夹自取 (规范互动)</span>
        </button>

        <button
          onClick={() => onSelectScenario('tongs_dropped')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-md ${
            scenario === 'tongs_dropped'
              ? 'bg-amber-600 text-white ring-2 ring-amber-300 scale-105'
              : 'bg-black/60 hover:bg-amber-950/80 text-amber-200 border border-amber-400/40'
          }`}
          title="切换至顾客取餐夹脱手掉入菜盆事故现场"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>⚠️ 夹子掉盆 (器具事故)</span>
        </button>

        <button
          onClick={() => onSelectScenario('idle_platter')}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-sans flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-md ${
            scenario === 'idle_platter'
              ? 'bg-slate-700 text-white ring-2 ring-slate-300 scale-105'
              : 'bg-black/60 hover:bg-slate-800 text-slate-300 border border-white/20'
          }`}
          title="切换至五星级标准摆盘就绪状态"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>🍽️ 标准摆盘 (星级就绪)</span>
        </button>
      </div>
    </div>
  );
};
