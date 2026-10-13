import React from 'react';
import { 
  CreditCard, 
  ArrowUpRight, 
  ScanLine, 
  ShieldCheck, 
  Boxes, 
  Sparkles, 
  CalendarCheck2, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { GlobalPerformanceStats } from '../types/database';

interface GlobalPerformanceProps {
  stats: GlobalPerformanceStats;
  onCardClick?: (cardType: string) => void;
}

// Sparkline component generating smooth SVG trend paths
const Sparkline: React.FC<{
  data: number[];
  color: string;
  gradientId: string;
  className?: string;
}> = ({ data, color, gradientId, className = "w-full h-7" }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const height = 28;
  const width = 100;
  const paddingY = 4;
  const usableHeight = height - paddingY * 2;

  // Generate points
  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  // Create smooth bezier curve path
  let pathD = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const controlX = ((current.x + next.x) / 2).toFixed(1);
    pathD += ` C ${controlX} ${current.y.toFixed(1)}, ${controlX} ${next.y.toFixed(1)}, ${next.x.toFixed(1)} ${next.y.toFixed(1)}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;
  const lastPoint = points[points.length - 1];

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className={className} 
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradientId})`} />
      <path 
        d={pathD} 
        fill="none" 
        stroke={color} 
        strokeWidth="1.75" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <circle 
        cx={lastPoint.x.toFixed(1)} 
        cy={lastPoint.y.toFixed(1)} 
        r="2.2" 
        fill={color} 
      />
    </svg>
  );
};

export const GlobalPerformance: React.FC<GlobalPerformanceProps> = ({
  stats,
  onCardClick,
}) => {
  return (
    <section className="space-y-3">
      {/* Section Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Hạ tầng Điều hành Thực địa (TRL-7)
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Chỉ số Vận hành Toàn hệ thống (Global Performance)
          </h2>
        </div>

        {/* Filter Bar / Quick Scope */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto p-1 bg-slate-100 rounded-xl text-xs font-medium text-slate-600">
          <button className="px-3 py-1 bg-white rounded-lg text-slate-900 font-semibold shadow-2xs">
            Hôm nay
          </button>
          <button className="px-3 py-1 hover:text-slate-900 transition-colors">
            Khánh Hòa 2026
          </button>
          <button className="px-3 py-1 hover:text-slate-900 transition-colors hidden md:inline-block">
            Toàn bộ MICE
          </button>
        </div>
      </div>

      {/* 6 Grid Cards (3 Cols x 2 Rows) matching reference design layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CARD 1: THẺ DOANH NHÂN SỐ 3D & NFC (Kích hoạt NFC 7 ngày) */}
        <div 
          onClick={() => onCardClick?.('nfc_cards')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  Thẻ Doanh Nhân Số & NFC
                </span>
              </div>
              <button 
                className="text-blue-500 hover:text-blue-700 p-1 rounded-md hover:bg-blue-50 transition-colors"
                title="Xem chi tiết kho thẻ"
              >
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Thẻ NFC đã kích hoạt</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {stats.nfc_cards.total_assigned.toLocaleString()} / {stats.nfc_cards.inventory_cap.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Tốc độ mở Web PWA</span>
                <span className="font-bold text-blue-600 tabular-nums">
                  {stats.nfc_cards.pwa_tap_speed} (SLA &lt; 0.8s)
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day NFC Activation Sparkline */}
          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <TrendingUp className="w-3 h-3 shrink-0" />
                <span>+28.4%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">NFC kích hoạt 7 ngày</span>
            </div>
            <div className="w-28 sm:w-32 h-7 shrink-0">
              <Sparkline 
                data={[165, 210, 275, 330, 390, 440, 485]} 
                color="#2563eb" 
                gradientId="sparkline-nfc-growth" 
              />
            </div>
          </div>
        </div>

        {/* CARD 2: TRẠM CHECK-IN SỰ KIỆN MICE */}
        <div 
          onClick={() => onCardClick?.('checkin')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
                <ScanLine className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                Trạm Check-in Hội Nghị MICE
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Tổng lượt Check-in</span>
                <span className="font-bold text-blue-600 text-sm tabular-nums">
                  {stats.event_checkin.total_checkins.toLocaleString()} lượt
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Đón tiếp Đại biểu VIP</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {stats.event_checkin.vip_count} VIPs ({stats.event_checkin.reception_rate}%)
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day Check-in Flow Sparkline */}
          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <TrendingUp className="w-3 h-3 shrink-0" />
                <span>+34.2%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Lượt check-in 7 ngày</span>
            </div>
            <div className="w-28 sm:w-32 h-7 shrink-0">
              <Sparkline 
                data={[120, 190, 290, 380, 490, 580, 680]} 
                color="#4f46e5" 
                gradientId="sparkline-checkin-flow" 
              />
            </div>
          </div>
        </div>

        {/* CARD 3: KẾT NỐI B2B 2-WAY CONSENT (Tăng trưởng kết nối B2B 7 ngày) */}
        <div 
          onClick={() => onCardClick?.('b2b_connections')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                Kết Nối B2B 2-Way Consent
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Lượt bắt tay mở danh bạ</span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {stats.b2b_connections.total_connections.toLocaleString()} kết nối
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Tuân thủ Luật PDPL 91/2025</span>
                <span className="font-bold text-emerald-600 tabular-nums">
                  100% Bảo mật 2 chiều
                </span>
              </div>
            </div>
          </div>

          {/* 7-Day B2B Connections Sparkline */}
          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                <TrendingUp className="w-3 h-3 shrink-0" />
                <span>+46.8%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">B2B kết nối 7 ngày</span>
            </div>
            <div className="w-28 sm:w-32 h-7 shrink-0">
              <Sparkline 
                data={[45, 78, 115, 160, 205, 245, 298]} 
                color="#059669" 
                gradientId="sparkline-b2b-connections" 
              />
            </div>
          </div>
        </div>

        {/* CARD 4: KHO PHÔI THẺ & CẤP PHÁT */}
        <div 
          onClick={() => onCardClick?.('inventory')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600">
                  <Boxes className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  Kho Phôi Thẻ & Cấp Phát
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-600 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Tồn kho phôi VIP báo động
                </span>
                <span className="font-bold text-rose-600 tabular-nums">
                  {stats.card_inventory.remaining_critical} thẻ
                </span>
              </div>

              {/* Progress bar matching the reference image */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${(stats.card_inventory.allocated / stats.card_inventory.total_blanks) * 100}%` }}
                  ></div>
                </div>
                <div className="text-[11px] text-slate-400 text-center">
                  Tỷ lệ cấp phát phôi thẻ: {Math.round((stats.card_inventory.allocated / stats.card_inventory.total_blanks) * 100)}% dung lượng kho
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Card Allocation Sparkline */}
          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600">
                <TrendingUp className="w-3 h-3 shrink-0" />
                <span>+19.5%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Cấp phát phôi 7 ngày</span>
            </div>
            <div className="w-28 sm:w-32 h-7 shrink-0">
              <Sparkline 
                data={[380, 440, 510, 570, 620, 680, 740]} 
                color="#d97706" 
                gradientId="sparkline-inventory-allocation" 
              />
            </div>
          </div>
        </div>

        {/* CARD 5: AI B2B MATCHMAKING & DEAL PIPELINE */}
        <div 
          onClick={() => onCardClick?.('ai_matchmaking')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                AI Matchmaking & Pre-CRM
              </span>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Cặp ghép bàn 1:1 đàm phán</span>
                <span className="font-bold text-slate-900 tabular-nums">{stats.ai_matchmaking.matched_pairs} phiên</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Độ chuẩn khớp Cung - Cầu</span>
                <span className="font-bold text-blue-600 tabular-nums">{stats.ai_matchmaking.accuracy_rate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Tổng giá trị Deal dự kiến</span>
                <span className="font-bold text-rose-600 tabular-nums">{stats.ai_matchmaking.total_deal_pipeline_vnd}</span>
              </div>
            </div>
          </div>

          {/* 7-Day Matchmaking Growth Sparkline */}
          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600">
                <TrendingUp className="w-3 h-3 shrink-0" />
                <span>+51.0%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Phiên AI ghép cặp 7 ngày</span>
            </div>
            <div className="w-28 sm:w-32 h-7 shrink-0">
              <Sparkline 
                data={[18, 26, 39, 52, 68, 81, 96]} 
                color="#9333ea" 
                gradientId="sparkline-ai-matchmaking" 
              />
            </div>
          </div>
        </div>

        {/* CARD 6: TIẾN ĐỘ TRIỂN KHAI THỰC ĐỊA */}
        <div 
          onClick={() => onCardClick?.('pilot_milestones')}
          className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600">
                  <CalendarCheck2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  Tiến Độ Triển Khai Thực Địa
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-100 flex-1 text-center truncate">
                  {stats.pilot_milestones.completed_events} Sự kiện MICE đạt
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-100 flex-1 text-center truncate">
                  {stats.pilot_milestones.active_events} Đang triển khai
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Sự kiện kế tiếp:</span>
                  <span className="text-blue-600 font-semibold truncate max-w-[150px] text-right" title={stats.pilot_milestones.next_event_name}>
                    {stats.pilot_milestones.next_event_name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Đối tác 5 sao:</span>
                  <span className="font-bold text-rose-600 tabular-nums">
                    {stats.pilot_milestones.hotel_partners}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 7-Day Pilot Milestones Sparkline */}
          <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1 text-[11px] font-bold text-teal-600">
                <TrendingUp className="w-3 h-3 shrink-0" />
                <span>+12.6%</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">Tiến độ thực địa 7 ngày</span>
            </div>
            <div className="w-28 sm:w-32 h-7 shrink-0">
              <Sparkline 
                data={[72, 76, 80, 85, 89, 93, 98]} 
                color="#0d9488" 
                gradientId="sparkline-pilot-milestones" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
