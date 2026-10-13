'use client';

import React, { useState, useMemo } from 'react';
import { 
  EntityRecord, 
  TicketTier,
  GlobalPerformanceStats 
} from './types';
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
  MapPin,
  Sparkles
} from 'lucide-react';
import { AttendanceReportModal } from './AttendanceReportModal';

interface EntityHealthWidgetProps {
  entities: EntityRecord[];
  onSelectEntity?: (entity: EntityRecord) => void;
  onQuickCheckIn?: (entityId: string) => void;
  onViewActivityLog?: () => void;
  eventCheckinStats?: GlobalPerformanceStats['event_checkin'];
}

type CheckInStatusFilter = 'ALL' | 'CHECKED_IN' | 'PENDING';
type TierFilter = 'ALL' | 'VIP' | 'DELEGATE' | 'ORGANIZER';
type SortKey = 'DEFAULT' | 'NAME' | 'STATUS' | 'TIER' | 'SCORE';
type SortDirection = 'ASC' | 'DESC';

interface VenueZone {
  id: string;
  code: string;
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

export const EntityHealthWidget: React.FC<EntityHealthWidgetProps> = ({
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

  const totalCheckins = eventCheckinStats?.total_checkins || 0;
  const vipCount = eventCheckinStats?.vip_count || 0;
  const receptionRate = eventCheckinStats?.reception_rate || (entities.length > 0 ? Math.round((totalCheckins / entities.length) * 100) : 0);
  const slaCompliance = eventCheckinStats?.sla_compliance || '< 0.8s';

  // Venue Zones mapped dynamically
  const venueZones: VenueZone[] = useMemo(() => {
    const a1Count = Math.round(totalCheckins * 0.12);
    const a2Count = vipCount;
    const b1Count = Math.round(totalCheckins * 0.35);
    const b2Count = Math.round(totalCheckins * 0.25);
    const c1Count = Math.round(totalCheckins * 0.18);
    const c2Count = Math.round(totalCheckins * 0.10);

    const rawZones = [
      { id: 'zone-a1', code: 'A1', name: 'Sảnh Đón Tiếp & Trạm NFC', subname: 'Cổng tiếp đón MICE 0.42s', capacity: 150, currentCount: a1Count },
      { id: 'zone-a2', code: 'A2', name: 'Sảnh VIP & Tiếp Đón Lãnh Đạo', subname: 'Khu vực đại biểu cấp cao', capacity: 200, currentCount: a2Count },
      { id: 'zone-b1', code: 'B1', name: 'Khán Phòng Chính A (Plenary West)', subname: 'Diễn đàn Kinh tế Biển 2026', capacity: 350, currentCount: b1Count },
      { id: 'zone-b2', code: 'B2', name: 'Khán Phòng Chính B (Plenary East)', subname: 'Tọa đàm Chuyển Đổi Số', capacity: 350, currentCount: b2Count },
      { id: 'zone-c1', code: 'C1', name: 'Sàn Giao Thương B2B Showcase', subname: 'Triển lãm Giải pháp Doanh nghiệp', capacity: 200, currentCount: c1Count },
      { id: 'zone-c2', code: 'C2', name: 'Phòng Đàm Phán 1:1 Deal Suites', subname: 'Ký kết 2-Way Consent Luật PDPL', capacity: 80, currentCount: c2Count },
    ];

    return rawZones.map((z) => {
      const densityPercent = z.capacity > 0 ? Math.min(100, Math.round((z.currentCount / z.capacity) * 100)) : 0;
      let level: 'LOW' | 'MODERATE' | 'HIGH' | 'PEAK' = 'LOW';
      let borderClass = 'border-emerald-200/90';
      let bgLightClass = 'bg-emerald-50/70 hover:bg-emerald-50';
      let textBadgeClass = 'bg-emerald-100/80 text-emerald-800 border-emerald-300';
      let badgeDotColor = 'bg-emerald-500';

      if (densityPercent >= 85) {
        level = 'PEAK';
        borderClass = 'border-rose-300';
        bgLightClass = 'bg-rose-50/70 hover:bg-rose-50';
        textBadgeClass = 'bg-rose-100 text-rose-800 border-rose-300';
        badgeDotColor = 'bg-rose-500';
      } else if (densityPercent >= 65) {
        level = 'HIGH';
        borderClass = 'border-amber-300';
        bgLightClass = 'bg-amber-50/70 hover:bg-amber-50';
        textBadgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
        badgeDotColor = 'bg-amber-500';
      } else if (densityPercent >= 35) {
        level = 'MODERATE';
        borderClass = 'border-blue-200/90';
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

  // Filter and Sort Entities
  const filteredEntities = useMemo(() => {
    let result = [...entities];

    if (filterStatus === 'CHECKED_IN') {
      result = result.filter((e) => e.status === 'STABLE_CHECKED' || e.status === 'VIP_ACCEPTED' || e.status === 'IN_SESSION');
    } else if (filterStatus === 'PENDING') {
      result = result.filter((e) => e.status === 'PENDING_TAP');
    }

    if (filterTier !== 'ALL') {
      result = result.filter((e) => e.tier === filterTier);
    }

    if (tableSearch.trim()) {
      const q = tableSearch.toLowerCase();
      result = result.filter((e) =>
        e.full_name.toLowerCase().includes(q) ||
        e.company_name.toLowerCase().includes(q) ||
        e.tax_id.includes(q) ||
        e.card_uid.toLowerCase().includes(q)
      );
    }

    if (sortKey !== 'DEFAULT') {
      result.sort((a, b) => {
        let comp = 0;
        if (sortKey === 'NAME') comp = a.full_name.localeCompare(b.full_name);
        else if (sortKey === 'STATUS') comp = a.status.localeCompare(b.status);
        else if (sortKey === 'TIER') comp = a.tier.localeCompare(b.tier);
        else if (sortKey === 'SCORE') comp = b.connection_score - a.connection_score;
        return sortDirection === 'ASC' ? comp : -comp;
      });
    }

    return result;
  }, [entities, filterStatus, filterTier, tableSearch, sortKey, sortDirection]);

  const handleToggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'ASC' ? 'DESC' : 'ASC'));
    } else {
      setSortKey(key);
      setSortDirection('ASC');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
      {/* 1. Header Bar with Tabs & Actions */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-900 tracking-tight">
              Giám Sát Hiện Diện & Mật Độ Khách Mời MICE
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold font-mono">
              {entities.length} Đại biểu
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Sơ đồ bố trí hội trường thời gian thực, đo lường trạm chạm thẻ NFC và danh bạ định danh doanh nhân
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowHeatmapOverlay(!showHeatmapOverlay)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showHeatmapOverlay 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Sơ Đồ 6 Phân Khu</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Báo Cáo CSV</span>
          </button>
        </div>
      </div>

      {/* 2. Architectural Grid Overlay (6 Venue Zones) */}
      {showHeatmapOverlay && (
        <div className="p-4 sm:p-5 bg-slate-50/70 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              Sơ Đồ Mật Độ Hội Trường 6 Phân Khu
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;35% Thấp
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> 35-65% Vừa
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> 65-85% Cao
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> &gt;85% Đỉnh
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {venueZones.map((zone) => (
              <div
                key={zone.id}
                onClick={() => setFilterZone(filterZone === zone.code ? 'ALL' : zone.code)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${zone.borderClass} ${zone.bgLightClass} ${
                  filterZone === zone.code ? 'ring-2 ring-blue-500 shadow-sm' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 block">
                      KHU {zone.code}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {zone.name}
                    </h4>
                    <p className="text-[10.5px] text-slate-500">
                      {zone.subname}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border font-mono ${zone.textBadgeClass}`}>
                    {zone.densityPercent}%
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${zone.badgeDotColor}`}
                      style={{ width: `${zone.densityPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10.5px] text-slate-500 pt-0.5">
                    <span>Đại biểu: <strong className="text-slate-800 font-mono">{zone.currentCount}</strong></span>
                    <span>Sức chứa: <strong className="text-slate-600 font-mono">{zone.capacity}</strong></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Filters & Search Bar */}
      <div className="p-3 sm:p-4 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl text-xs font-medium shrink-0">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất Cả ({entities.length})
            </button>
            <button
              onClick={() => setFilterStatus('CHECKED_IN')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'CHECKED_IN' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Đã Vào ({entities.filter((e) => e.status !== 'PENDING_TAP').length})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                filterStatus === 'PENDING' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Chờ Quét ({entities.filter((e) => e.status === 'PENDING_TAP').length})
            </button>
          </div>

          {/* Tier Filter */}
          <select
            value={filterTier}
            onChange={(e) => setFilterTier(e.target.value as TierFilter)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none shrink-0"
          >
            <option value="ALL">Hạng Vé: Tất Cả</option>
            <option value="VIP">Hạng VIP</option>
            <option value="DELEGATE">Đại Biểu (Delegate)</option>
            <option value="ORGANIZER">Ban Tổ Chức (Organizer)</option>
          </select>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            placeholder="Tìm theo tên, công ty, MST, UID..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* 4. Table / Empty State */}
      {filteredEntities.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-800">
              Chưa có dữ liệu đại biểu nào
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {tableSearch || filterStatus !== 'ALL' || filterTier !== 'ALL'
                ? 'Không tìm thấy đại biểu nào khớp với bộ lọc hiện tại. Vui lòng thử lại với từ khóa khác.'
                : 'Cơ sở dữ liệu Supabase hiện chưa ghi nhận hồ sơ đại biểu nào trong sự kiện này.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-semibold text-[11px]">
                <th 
                  onClick={() => handleToggleSort('NAME')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    ĐẠI BIỂU & DOANH NGHIỆP <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th 
                  onClick={() => handleToggleSort('TIER')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    PHÂN HẠNG <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th className="py-3 px-3">MÃ THẺ NFC / UID</th>
                <th 
                  onClick={() => handleToggleSort('STATUS')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    TRẠNG THÁI CHECK-IN <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th className="py-3 px-3">GIỜ CHECK-IN</th>
                <th 
                  onClick={() => handleToggleSort('SCORE')}
                  className="py-3 px-3 cursor-pointer hover:text-slate-900 transition-colors"
                >
                  <span className="flex items-center gap-1">
                    ĐỘ GẮN KẾT <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </span>
                </th>
                <th className="py-3 px-4 text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEntities.map((item) => {
                const isChecked = item.status === 'STABLE_CHECKED' || item.status === 'VIP_ACCEPTED' || item.status === 'IN_SESSION';

                return (
                  <tr 
                    key={item.id} 
                    className="hover:bg-blue-50/40 transition-colors group cursor-pointer"
                    onClick={() => onSelectEntity?.(item)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                          {item.full_name.split(' ').slice(-1)[0]?.[0] || 'U'}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5 truncate">
                            <span>{item.full_name}</span>
                            {item.vneid_verified && (
                              <span title="Xác thực CCCD/VNeID">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 inline shrink-0" />
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {item.title ? `${item.title} · ` : ''}{item.company_name}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.tier === 'VIP'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : item.tier === 'ORGANIZER'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {item.tier}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">
                      {item.card_uid || '--:--:--:--'}
                    </td>

                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        item.status === 'VIP_ACCEPTED'
                          ? 'text-amber-700'
                          : item.status === 'STABLE_CHECKED'
                          ? 'text-emerald-700'
                          : item.status === 'IN_SESSION'
                          ? 'text-blue-700'
                          : 'text-slate-500'
                      }`}>
                        {isChecked ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        )}
                        <span>{item.status_label || (isChecked ? 'ĐÃ CHECK-IN' : 'CHỜ QUÉT THẺ')}</span>
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {item.check_in_time || '--:--'}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full" 
                            style={{ width: `${item.connection_score}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-700 text-[11px]">
                          {item.connection_score}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {!isChecked && onQuickCheckIn && (
                          <button
                            onClick={() => onQuickCheckIn(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-2xs active:scale-95 cursor-pointer"
                          >
                            Quét Thẻ
                          </button>
                        )}
                        <button
                          onClick={() => onSelectEntity?.(item)}
                          className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          Hồ Sơ 3D
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Attendance Report Modal */}
      <AttendanceReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        entities={entities}
      />
    </div>
  );
};
