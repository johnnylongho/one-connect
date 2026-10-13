import React, { useState, useMemo } from 'react';
import { 
  EntityRecord, 
  TicketTier,
  GlobalPerformanceStats 
} from '../types/database';
import { 
  MoreHorizontal, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Download, 
  CreditCard,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  SlidersHorizontal,
  UserCheck,
  FileSpreadsheet,
  FileText,
  ScanLine,
  Activity,
  LayoutGrid,
  Flame,
  MapPin,
  Sparkles
} from 'lucide-react';
import { AttendanceReportModal } from './AttendanceReportModal';

interface EntityHealthStatusProps {
  entities: EntityRecord[];
  onSelectEntity?: (entity: EntityRecord) => void;
  onQuickCheckIn?: (entityId: string) => void;
  onViewActivityLog?: () => void;
  eventCheckinStats?: GlobalPerformanceStats['event_checkin'];
}

type CheckInStatusFilter = 'ALL' | 'CHECKED_IN' | 'PENDING';
type TierFilter = 'ALL' | 'VIP' | 'DELEGATE' | 'ORGANIZER';
type SortKey = 'DEFAULT' | 'NAME' | 'STATUS' | 'TIER' | 'SCORE' | 'DENSITY';
type SortDirection = 'ASC' | 'DESC';

interface VenueZone {
  id: string;
  code: string; // 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'
  name: string;
  subname: string;
  capacity: number;
  currentCount: number;
  densityPercent: number;
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'PEAK';
  borderClass: string;
  bgLightClass: string;
  textBadgeClass: string;
  badgeDotColor: string;
}

export const EntityHealthStatus: React.FC<EntityHealthStatusProps> = ({
  entities,
  onSelectEntity,
  onQuickCheckIn,
  onViewActivityLog,
  eventCheckinStats,
}) => {
  const [activeTab, setActiveTab] = useState<'checkin' | 'members'>('checkin');
  const [filterStatus, setFilterStatus] = useState<CheckInStatusFilter>('ALL');
  const [filterTier, setFilterTier] = useState<TierFilter>('ALL');
  const [filterZone, setFilterZone] = useState<string>('ALL');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('DEFAULT');
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [showHeatmapOverlay, setShowHeatmapOverlay] = useState<boolean>(true);

  // Dữ liệu trạm check-in MICE ánh xạ vào mật độ phân khu
  const totalCheckins = eventCheckinStats?.total_checkins || 680;
  const vipCount = eventCheckinStats?.vip_count || 185;
  const receptionRate = eventCheckinStats?.reception_rate || 99.2;
  const slaCompliance = eventCheckinStats?.sla_compliance || '< 0.8s';

  // Khởi tạo 6 phân khu thực địa hội trường theo lưới kiến trúc (Architectural Grid Overlay)
  const venueZones: VenueZone[] = useMemo(() => {
    const a1Count = Math.max(15, Math.round(totalCheckins * 0.08));
    const a2Count = vipCount;
    const b1Count = Math.round(totalCheckins * 0.38);
    const b2Count = Math.round(totalCheckins * 0.28);
    const c1Count = Math.round(totalCheckins * 0.16);
    const c2Count = Math.max(10, Math.round(totalCheckins * 0.06));

    const rawZones = [
      {
        id: 'zone-a1',
        code: 'A1',
        name: 'Sảnh Đón Tiếp & Trạm NFC',
        subname: 'Cổng tiếp đón MICE 0.42s',
        capacity: 150,
        currentCount: a1Count,
      },
      {
        id: 'zone-a2',
        code: 'A2',
        name: 'Sảnh VIP & Tiếp Đón Lãnh Đạo',
        subname: 'Khu vực đại biểu cấp cao',
        capacity: 200,
        currentCount: a2Count,
      },
      {
        id: 'zone-b1',
        code: 'B1',
        name: 'Khán Phòng Chính A (Plenary West)',
        subname: 'Diễn đàn Kinh tế Biển 2026',
        capacity: 350,
        currentCount: b1Count,
      },
      {
        id: 'zone-b2',
        code: 'B2',
        name: 'Khán Phòng Chính B (Plenary East)',
        subname: 'Tọa đàm Chuyển Đổi Số',
        capacity: 350,
        currentCount: b2Count,
      },
      {
        id: 'zone-c1',
        code: 'C1',
        name: 'Sàn Giao Thương B2B Showcase',
        subname: 'Triển lãm Giải pháp Doanh nghiệp',
        capacity: 200,
        currentCount: c1Count,
      },
      {
        id: 'zone-c2',
        code: 'C2',
        name: 'Phòng Đàm Phán 1:1 Deal Suites',
        subname: 'Ký kết 2-Way Consent Luật PDPL',
        capacity: 80,
        currentCount: c2Count,
      },
    ];

    return rawZones.map((z) => {
      const densityPercent = Math.min(100, Math.round((z.currentCount / z.capacity) * 100));
      let level: 'LOW' | 'MODERATE' | 'HIGH' | 'PEAK' = 'LOW';
      let borderClass = 'border-emerald-200/90';
      let bgLightClass = 'bg-emerald-50/70 hover:bg-emerald-50';
      let textBadgeClass = 'bg-emerald-100/80 text-emerald-800 border-emerald-300';
      let badgeDotColor = 'bg-emerald-500';

      if (densityPercent > 85) {
        level = 'PEAK';
        borderClass = 'border-rose-300 shadow-rose-100/50';
        bgLightClass = 'bg-rose-50/70 hover:bg-rose-50';
        textBadgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
        badgeDotColor = 'bg-rose-500 animate-pulse';
      } else if (densityPercent > 65) {
        level = 'HIGH';
        borderClass = 'border-amber-300 shadow-amber-100/50';
        bgLightClass = 'bg-amber-50/70 hover:bg-amber-50';
        textBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
        badgeDotColor = 'bg-amber-500';
      } else if (densityPercent > 35) {
        level = 'MODERATE';
        borderClass = 'border-blue-200 shadow-blue-100/50';
        bgLightClass = 'bg-blue-50/70 hover:bg-blue-50';
        textBadgeClass = 'bg-blue-100 text-blue-800 border-blue-300';
        badgeDotColor = 'bg-blue-500';
      }

      return {
        ...z,
        densityPercent,
        level,
        borderClass,
        bgLightClass,
        textBadgeClass,
        badgeDotColor,
      };
    });
  }, [totalCheckins, vipCount]);

  // Mật độ toàn hội trường (Dựa trên 1.000 chỗ ngồi chuẩn MICE)
  const overallVenueDensity = Math.min(100, Math.round((totalCheckins / 1000) * 100));

  // Ánh xạ đại biểu tới phân khu tương ứng
  const getEntityZone = (entity: EntityRecord): VenueZone => {
    if (entity.status === 'PENDING_TAP') return venueZones[0];
    if (entity.tier === 'VIP') return venueZones[1];
    const charCodeSum = entity.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pool = [venueZones[2], venueZones[3], venueZones[4], venueZones[5]];
    return pool[charCodeSum % pool.length];
  };

  // Đếm số lượng theo trạng thái
  const counts = useMemo(() => {
    const checkedIn = entities.filter(
      (e) => e.status === 'STABLE_CHECKED' || e.status === 'VIP_ACCEPTED' || e.status === 'IN_SESSION'
    ).length;
    const pending = entities.filter((e) => e.status === 'PENDING_TAP').length;
    return { all: entities.length, checkedIn, pending };
  }, [entities]);

  // Xử lý click cột để đảo chiều sắp xếp
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortKey(key);
      setSortDirection('ASC');
    }
  };

  // Reset toàn bộ bộ lọc
  const handleResetFilters = () => {
    setFilterStatus('ALL');
    setFilterTier('ALL');
    setFilterZone('ALL');
    setTableSearch('');
    setSortKey('DEFAULT');
    setSortDirection('ASC');
  };

  const isFiltered = filterStatus !== 'ALL' || filterTier !== 'ALL' || filterZone !== 'ALL' || tableSearch !== '' || sortKey !== 'DEFAULT';

  // Lọc và sắp xếp đại biểu
  const processedEntities = useMemo(() => {
    // 1. Lọc theo từ khóa tìm kiếm
    let list = entities.filter((item) => {
      const q = tableSearch.toLowerCase();
      const matchesSearch = 
        item.full_name.toLowerCase().includes(q) ||
        item.company_name.toLowerCase().includes(q) ||
        item.card_uid.toLowerCase().includes(q) ||
        item.tax_id.includes(q);

      // 2. Lọc theo Trạng thái Check-in (Checked-in vs. Pending)
      const isChecked = item.status === 'STABLE_CHECKED' || item.status === 'VIP_ACCEPTED' || item.status === 'IN_SESSION';
      const matchesStatus = 
        filterStatus === 'ALL' ||
        (filterStatus === 'CHECKED_IN' && isChecked) ||
        (filterStatus === 'PENDING' && !isChecked);

      // 3. Lọc theo Hạng VIP
      const matchesTier = filterTier === 'ALL' || item.tier === filterTier;

      // 4. Lọc theo Phân khu Heatmap
      const matchesZone = filterZone === 'ALL' || getEntityZone(item).code === filterZone;

      return matchesSearch && matchesStatus && matchesTier && matchesZone;
    });

    // 5. Sắp xếp dữ liệu (Sorting)
    if (sortKey !== 'DEFAULT') {
      list = [...list].sort((a, b) => {
        let comparison = 0;

        switch (sortKey) {
          case 'STATUS': {
            const isCheckedA = a.status === 'PENDING_TAP' ? 2 : 1;
            const isCheckedB = b.status === 'PENDING_TAP' ? 2 : 1;
            comparison = isCheckedA - isCheckedB;
            break;
          }
          case 'TIER': {
            const tierRank: Record<string, number> = { VIP: 1, ORGANIZER: 2, DELEGATE: 3, GUEST: 4 };
            const rankA = tierRank[a.tier] || 99;
            const rankB = tierRank[b.tier] || 99;
            comparison = rankA - rankB;
            break;
          }
          case 'NAME': {
            comparison = a.full_name.localeCompare(b.full_name, 'vi');
            break;
          }
          case 'SCORE': {
            comparison = b.connection_score - a.connection_score;
            break;
          }
          case 'DENSITY': {
            const densityA = getEntityZone(a).densityPercent;
            const densityB = getEntityZone(b).densityPercent;
            comparison = densityB - densityA;
            break;
          }
          default:
            comparison = 0;
        }

        return sortDirection === 'ASC' ? comparison : -comparison;
      });
    }

    return list;
  }, [entities, tableSearch, filterStatus, filterTier, filterZone, sortKey, sortDirection, venueZones]);

  const getStatusBadge = (status: EntityRecord['status']) => {
    switch (status) {
      case 'VIP_ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            VIP TIẾP ĐÓN
          </span>
        );
      case 'STABLE_CHECKED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            ĐÃ CHECK-IN
          </span>
        );
      case 'IN_SESSION':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            ĐANG ĐÀM PHÁN
          </span>
        );
      case 'PENDING_TAP':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            CHỜ QUÉT THẺ
          </span>
        );
      default:
        return null;
    }
  };

  const renderSortIndicator = (key: SortKey) => {
    if (sortKey !== key) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 ml-1 inline opacity-60 group-hover:opacity-100" />;
    }
    return sortDirection === 'ASC' ? (
      <ArrowUp className="w-3 h-3 text-blue-600 ml-1 inline font-bold" />
    ) : (
      <ArrowDown className="w-3 h-3 text-blue-600 ml-1 inline font-bold" />
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs h-full flex flex-col">
      {/* Top Header & View Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Lịch Sử Điểm Danh & Trạng Thái Hội Viên (Event Attendees)
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
              Không gian mở rộng toàn màn hình
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Trung tâm điều hành danh sách đại biểu, kiểm soát trạng thái check-in MICE, phân hạng VIP và bản đồ nhiệt mật độ hội trường
          </p>
        </div>

        {/* View Switcher Tabs & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Heat-map Grid Overlay Toggle Button */}
          <button
            onClick={() => setShowHeatmapOverlay((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-2xs ${
              showHeatmapOverlay
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-indigo-500/20'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Bật/Tắt Lưới Mật Độ Hội Trường Thực Địa (Heat-Map Overlay)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Lưới Mật Độ (Heatmap)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              showHeatmapOverlay ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
            }`}>
              {overallVenueDensity}%
            </span>
          </button>

          {/* Quick link to Activity Log in Reports */}
          {onViewActivityLog && (
            <button
              onClick={onViewActivityLog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-all hover:border-blue-300 shadow-2xs"
              title="Xem chi tiết dòng sự kiện hoạt động trong mục Báo cáo đo lường"
            >
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>Nhật Ký Hoạt Động</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>
          )}

          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveTab('checkin')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'checkin'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lịch sử Check-in Hội nghị
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeTab === 'members'
                  ? 'bg-white text-slate-900 font-bold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Danh sách Hội viên B2B
            </button>
          </div>

          {/* Export Attendance Report Button (CSV / PDF) */}
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow-blue-500/25 active:scale-95"
            title="Xuất báo cáo điểm danh sự kiện (CSV & PDF)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Báo Cáo Điểm Danh</span>
          </button>
        </div>
      </div>

      {/* Expanded Quick KPI Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-4 p-3 rounded-xl bg-slate-50/80 border border-slate-100">
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Tổng Đại Biểu</span>
          <div className="text-base font-extrabold text-slate-900 font-mono">{entities.length} <span className="text-[11px] font-normal text-slate-400">người</span></div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Đã Check-in</span>
          <div className="text-base font-extrabold text-blue-600 font-mono">
            {counts.checkedIn} <span className="text-[11px] font-normal text-slate-400">({Math.round((counts.checkedIn / (entities.length || 1)) * 100)}%)</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Chờ Quét Thẻ</span>
          <div className="text-base font-extrabold text-amber-600 font-mono">{counts.pending} <span className="text-[11px] font-normal text-slate-400">đại biểu</span></div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Đại Biểu VIP</span>
          <div className="text-base font-extrabold text-purple-600 font-mono">
            {entities.filter(e => e.tier === 'VIP').length} <span className="text-[11px] font-normal text-slate-400">doanh nhân</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Đã Cấp Thẻ NFC</span>
          <div className="text-base font-extrabold text-emerald-600 font-mono">
            {entities.filter(e => e.card_uid).length} <span className="text-[11px] font-normal text-slate-400">thẻ vật lý</span>
          </div>
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Mật Độ Hội Trường</span>
          <div className="text-base font-extrabold text-indigo-600 font-mono">
            {overallVenueDensity}% <span className="text-[11px] font-normal text-slate-400">({totalCheckins}/1.000)</span>
          </div>
        </div>
      </div>

      {/* HEAT-MAP VISUALIZATION: LIGHT GRID OVERLAY */}
      {showHeatmapOverlay && (
        <div className="mb-4 rounded-2xl border border-blue-200/80 bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50/80 p-4 sm:p-5 shadow-2xs relative overflow-hidden transition-all">
          {/* Subtle architectural blueprint grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.04] pointer-events-none" 
            style={{ 
              backgroundImage: `linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }} 
          />

          {/* Heatmap Grid Header */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3.5 pb-3 border-b border-blue-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-2xs">
                <Flame className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                    Lưới Mật Độ Hội Trường Thực Địa (Venue Heat-Map Grid)
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Dữ liệu tiếp đón trực tiếp: {totalCheckins} lượt
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Phân bổ 6 phân khu hội trường MICE theo thời gian thực từ trạm check-in & phân luồng tiếp đón
                </p>
              </div>
            </div>

            {/* Density Scale & Legend */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/90 border border-slate-200 shadow-2xs">
                <span className="text-[11px] text-slate-500 font-medium">Toàn hội trường:</span>
                <span className="font-extrabold text-blue-700 font-mono">{overallVenueDensity}%</span>
                <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden ml-1">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 transition-all duration-500" 
                    style={{ width: `${overallVenueDensity}%` }}
                  />
                </div>
              </div>

              <div className="hidden lg:flex items-center gap-1 text-[10px] text-slate-500 font-medium bg-white/80 px-2 py-1 rounded-lg border border-slate-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block mr-0.5" /> &lt;35% Thấp
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block ml-1.5 mr-0.5" /> 35-65% Vừa
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-1.5 mr-0.5" /> 65-85% Cao
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block ml-1.5 mr-0.5" /> &gt;85% Đỉnh điểm
              </div>
            </div>
          </div>

          {/* 6 Grid Cells (Venue Sectors in Architectural Layout) */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {venueZones.map((z) => {
              const isSelected = filterZone === z.code;
              return (
                <div
                  key={z.id}
                  onClick={() => setFilterZone(isSelected ? 'ALL' : z.code)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden group ${
                    z.borderClass
                  } ${z.bgLightClass} ${
                    isSelected ? 'ring-2 ring-indigo-500 bg-white shadow-sm' : 'shadow-2xs'
                  }`}
                >
                  {/* Top row in cell: Code + Status Badge */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-extrabold text-xs px-2 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs text-slate-800">
                      {z.code}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${z.textBadgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${z.badgeDotColor}`} />
                        {z.level === 'PEAK' ? 'ĐỈNH ĐIỂM' : z.level === 'HIGH' ? 'ĐÔNG ĐÚC' : z.level === 'MODERATE' ? 'VỪA PHẢI' : 'THẤP'}
                      </span>
                      <span className="font-mono font-extrabold text-xs text-slate-900">
                        {z.densityPercent}%
                      </span>
                    </div>
                  </div>

                  {/* Cell Zone Name */}
                  <h5 className="font-bold text-xs text-slate-900 group-hover:text-indigo-700 transition-colors">
                    {z.name}
                  </h5>
                  <p className="text-[10px] text-slate-500 mb-2 truncate">
                    {z.subname}
                  </p>

                  {/* Occupancy Progress Meter */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          z.level === 'PEAK' ? 'bg-rose-500' : z.level === 'HIGH' ? 'bg-amber-500' : z.level === 'MODERATE' ? 'bg-blue-600' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${z.densityPercent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500">
                      <span>Đang có mặt: <strong className="text-slate-800 font-mono">{z.currentCount}</strong>/{z.capacity}</span>
                      <span className={`font-semibold text-[10px] ${isSelected ? 'text-indigo-600 font-bold underline' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                        {isSelected ? 'Đang lọc ✓' : 'Lọc danh sách →'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Zone Filter Indicator */}
          {filterZone !== 'ALL' && (
            <div className="relative z-10 mt-3 pt-2 border-t border-blue-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Đang lọc đại biểu trong phân khu: <strong className="text-indigo-700">{venueZones.find(z => z.code === filterZone)?.name} ({filterZone})</strong>
              </span>
              <button 
                onClick={() => setFilterZone('ALL')}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline"
              >
                Xem tất cả phân khu
              </button>
            </div>
          )}
        </div>
      )}

      {/* FILTERING & SORTING CONTROL BAR */}
      <div className="space-y-3 mb-3 pb-3 border-b border-slate-100">
        {/* Hàng 1: Bộ lọc Trạng thái Check-in & Ô Tìm kiếm */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Nhóm 1: Check-in Status Filter (Checked-in vs. Pending) */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" /> Trạng thái:
            </span>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-lg text-xs font-medium">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterStatus === 'ALL'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({counts.all})
              </button>
              <button
                onClick={() => setFilterStatus('CHECKED_IN')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterStatus === 'CHECKED_IN'
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đã Check-in ({counts.checkedIn})
              </button>
              <button
                onClick={() => setFilterStatus('PENDING')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterStatus === 'PENDING'
                    ? 'bg-amber-600 text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chờ Quét ({counts.pending})
              </button>
            </div>
          </div>

          {/* Ô Tìm kiếm nhanh */}
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Lọc đại biểu, công ty..."
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Hàng 2: Bộ lọc VIP Tier, Phân Khu & Trình Sắp Xếp */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Nhóm 2: VIP Tier Filter & Zone Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 font-semibold mr-1">Phân hạng:</span>
            {(['ALL', 'VIP', 'DELEGATE', 'ORGANIZER'] as TierFilter[]).map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                  filterTier === tier
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {tier === 'ALL' ? 'Tất cả hạng' : tier}
              </button>
            ))}

            {/* Quick Zone Filter Pills */}
            <span className="text-slate-400 font-semibold ml-2 mr-1">Phân khu:</span>
            <button
              onClick={() => setFilterZone('ALL')}
              className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                filterZone === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              Tất cả khu
            </button>
            {venueZones.map((z) => (
              <button
                key={z.id}
                onClick={() => setFilterZone(z.code)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1 ${
                  filterZone === z.code
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
                title={`${z.name} (${z.densityPercent}%)`}
              >
                <span>{z.code}</span>
                <span className={`w-1.5 h-1.5 rounded-full ${z.badgeDotColor}`} />
              </button>
            ))}

            {/* Nút Xóa bộ lọc nếu đang áp dụng */}
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="ml-2 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline"
                title="Xóa toàn bộ bộ lọc và sắp xếp"
              >
                <RotateCcw className="w-3 h-3" />
                Xóa lọc
              </button>
            )}
          </div>

          {/* Trình chọn sắp xếp nhanh */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Sắp xếp:</span>
            <select
              value={`${sortKey}-${sortDirection}`}
              onChange={(e) => {
                const val = e.target.value;
                if (val === 'DEFAULT') {
                  setSortKey('DEFAULT');
                } else {
                  const [k, d] = val.split('-') as [SortKey, SortDirection];
                  setSortKey(k);
                  setSortDirection(d);
                }
              }}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
            >
              <option value="DEFAULT">Mặc định ban đầu</option>
              <option value="DENSITY-DESC">Mật độ cao nhất lên trước</option>
              <option value="STATUS-ASC">Đã Check-in lên trước</option>
              <option value="STATUS-DESC">Chờ Quét Thẻ lên trước</option>
              <option value="TIER-ASC">Ưu tiên Hạng VIP</option>
              <option value="SCORE-ASC">Độ gắn kết cao nhất</option>
              <option value="NAME-ASC">Tên đại biểu (A - Z)</option>
              <option value="NAME-DESC">Tên đại biểu (Z - A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* DATA TABLE VỚI TIÊU ĐỀ CỘT CÓ THỂ NHẤP ĐỂ SORT VÀ LIGHT GRID OVERLAY */}
      <div className="flex-1 overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {/* Cột 1: Sắp xếp theo Tên */}
              <th 
                className="py-3 pr-4 cursor-pointer hover:text-slate-700 transition-colors group select-none"
                onClick={() => handleSort('NAME')}
                title="Bấm để sắp xếp theo Tên đại biểu"
              >
                <span>Đại biểu</span>
                {renderSortIndicator('NAME')}
              </th>

              {/* Cột 2: Đơn vị & MST */}
              <th className="py-3 px-3">
                <span>Đơn vị / MST</span>
              </th>

              {/* Cột 3: Vị Trí & Mật Độ Phân Khu (Heat-Map Column) */}
              <th 
                className="py-3 px-3 cursor-pointer hover:text-slate-700 transition-colors group select-none whitespace-nowrap"
                onClick={() => handleSort('DENSITY')}
                title="Bấm để sắp xếp theo Mật độ phân khu"
              >
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Vị Trí & Mật Độ</span>
                </span>
                {renderSortIndicator('DENSITY')}
              </th>

              {/* Cột 4: Định danh NFC */}
              <th className="py-3 px-3 whitespace-nowrap">
                <span>Mã Thẻ NFC</span>
              </th>

              {/* Cột 5: Trạng thái Check-in */}
              <th 
                className="py-3 px-3 cursor-pointer hover:text-slate-700 transition-colors group select-none whitespace-nowrap"
                onClick={() => handleSort('STATUS')}
                title="Bấm để sắp xếp theo Trạng thái Check-in (Đã check-in / Chờ quét)"
              >
                <span>Trạng thái</span>
                {renderSortIndicator('STATUS')}
              </th>

              {/* Cột 6: Phân hạng VIP */}
              <th 
                className="py-3 px-3 cursor-pointer hover:text-slate-700 transition-colors group select-none whitespace-nowrap"
                onClick={() => handleSort('TIER')}
                title="Bấm để sắp xếp theo Hạng vé VIP / Delegate"
              >
                <span>Hạng vé</span>
                {renderSortIndicator('TIER')}
              </th>

              {/* Cột 7: Giá trị Deal */}
              <th className="py-3 px-3 whitespace-nowrap">
                <span>Deal B2B</span>
              </th>

              {/* Cột 8: Độ gắn kết */}
              <th 
                className="py-3 px-3 cursor-pointer hover:text-slate-700 transition-colors group select-none whitespace-nowrap"
                onClick={() => handleSort('SCORE')}
                title="Bấm để sắp xếp theo Độ gắn kết hồ sơ"
              >
                <span>Gắn kết</span>
                {renderSortIndicator('SCORE')}
              </th>

              {/* Cột 9: Thao tác */}
              <th className="py-3 pl-3 text-right whitespace-nowrap">
                <span>Thao tác</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {processedEntities.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="w-6 h-6 text-slate-300" />
                    <span>Không tìm thấy đại biểu phù hợp với bộ lọc hiện tại.</span>
                    <button
                      onClick={handleResetFilters}
                      className="text-xs font-semibold text-blue-600 hover:underline mt-1"
                    >
                      Xóa toàn bộ bộ lọc
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              processedEntities.map((item) => {
                const zone = getEntityZone(item);
                return (
                  <tr 
                    key={item.id} 
                    onClick={() => onSelectEntity?.(item)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer border-b border-slate-100 ${
                      showHeatmapOverlay ? `border-l-4 ${
                        zone.level === 'PEAK'
                          ? 'border-l-rose-500 bg-rose-50/15'
                          : zone.level === 'HIGH'
                          ? 'border-l-amber-500 bg-amber-50/10'
                          : zone.level === 'MODERATE'
                          ? 'border-l-blue-500 bg-blue-50/10'
                          : 'border-l-emerald-500 bg-emerald-50/10'
                      }` : ''
                    }`}
                  >
                    {/* Cột 1: Đại biểu */}
                    <td className="py-3.5 pr-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                          {item.full_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                            {item.full_name}
                            {item.vneid_verified && (
                              <span title="Đã xác thực CCCD qua VNeID">
                                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 inline" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {item.title}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Cột 2: Đơn vị / MST */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="text-slate-800 font-medium truncate max-w-[180px]" title={item.company_name}>
                        {item.company_name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        MST: {item.tax_id}
                      </div>
                    </td>

                    {/* Cột 3: Vị Trí Phân Khu & Mật Độ (Heatmap Column) */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-white text-slate-800 border border-slate-200 shadow-2xs">
                            {zone.code}
                          </span>
                          <span className="text-xs font-semibold text-slate-800 truncate max-w-[130px]" title={zone.name}>
                            {zone.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${zone.badgeDotColor}`} />
                          <span className="font-semibold text-slate-600 font-mono">
                            {zone.densityPercent}%
                          </span>
                          <span className={`text-[9px] font-bold px-1 rounded border ${zone.textBadgeClass}`}>
                            {zone.level === 'PEAK' ? 'Đỉnh điểm' : zone.level === 'HIGH' ? 'Đông' : zone.level === 'MODERATE' ? 'Vừa' : 'Thấp'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Cột 4: Mã Thẻ NFC */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {item.card_uid ? (
                        <div className="flex items-center gap-1.5 font-mono text-slate-700 text-xs">
                          <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                          <span>{item.card_uid}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Chưa gán thẻ</span>
                      )}
                    </td>

                    {/* Cột 5: Trạng thái Check-in */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        {getStatusBadge(item.status)}
                        <span className="text-[10px] text-slate-400 pl-1">
                          {item.check_in_time}
                        </span>
                      </div>
                    </td>

                    {/* Cột 6: Phân hạng vé */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        item.tier === 'VIP'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : item.tier === 'ORGANIZER'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {item.tier}
                      </span>
                    </td>

                    {/* Cột 7: Giá trị Deal B2B */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-bold text-slate-900 tabular-nums text-xs">
                        {item.deal_pipeline} VNĐ
                      </span>
                    </td>

                    {/* Cột 8: Độ gắn kết (Progress bar) */}
                    <td className="py-3.5 px-3 min-w-[130px]">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-bold text-blue-600 tabular-nums">
                        <span>{item.connection_score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${item.connection_score}%` }}
                        ></div>
                      </div>
                    </td>

                    {/* Cột 9: Thao tác */}
                    <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        {item.status === 'PENDING_TAP' && onQuickCheckIn && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onQuickCheckIn(item.id);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-2xs flex items-center gap-1 active:scale-95"
                            title="Chạm thẻ NFC để điểm danh nhanh"
                          >
                            <ScanLine className="w-3 h-3" />
                            <span>Chạm Thẻ</span>
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEntity?.(item);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-bold transition-colors"
                        >
                          Hồ Sơ 3D
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectEntity?.(item);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                          title="Tùy chọn khác"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination / Footer */}
      <div className="pt-3 mt-auto border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
        <span>Hiển thị {processedEntities.length} / {entities.length} đại biểu hội nghị</span>
        <div className="flex items-center gap-1 font-medium text-blue-600">
          <button className="px-2 py-0.5 rounded hover:bg-slate-100 disabled:opacity-40" disabled>
            Trước
          </button>
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-bold">1</span>
          <button className="px-2 py-0.5 rounded hover:bg-slate-100">2</button>
          <button className="px-2 py-0.5 rounded hover:bg-slate-100">Sau</button>
        </div>
      </div>

      {/* Attendance Report Generator & Print Modal (PDF / CSV) */}
      <AttendanceReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        entities={processedEntities}
      />
    </div>
  );
};
