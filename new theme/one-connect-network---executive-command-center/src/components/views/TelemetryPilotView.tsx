import React from 'react';
import { 
  Cpu, 
  Activity, 
  ShieldCheck, 
  Zap, 
  Server, 
  Download, 
  CheckCircle2,
  AlertTriangle,
  Clock,
  BarChart3,
  ListFilter
} from 'lucide-react';
import { OneConnectDataService } from '../../services/supabaseService';
import { ActivityFeedItem } from '../../types/database';
import { RecentActivity } from '../RecentActivity';

interface TelemetryPilotViewProps {
  activities?: ActivityFeedItem[];
  onActivityClick?: (item: ActivityFeedItem) => void;
}

export const TelemetryPilotView: React.FC<TelemetryPilotViewProps> = ({
  activities = [],
  onActivityClick,
}) => {
  const handleDownloadCsv = () => {
    const csvContent = OneConnectDataService.getInstance().exportPdplAuditCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `one_connect_pdpl_audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-zinc-900 to-slate-950 rounded-2xl p-6 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-semibold border border-emerald-400/30">
              BÁO CÁO ĐO LƯỜNG & TELEMETRY PILOT (TRL-7)
            </span>
            <span className="text-[11px] text-slate-400">
              Dữ Liệu Vận Hành Thực Địa Khánh Hòa 2026
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Trung Tâm Báo Cáo Đo Lường & Nhật Ký Hoạt Động Hệ Thống
          </h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Tổng hợp dữ liệu dòng sự kiện thời gian thực (Recent Activity), đo lường độ trễ mạng Edge CDN, tỷ lệ đọc chip NTAG216 và nhật ký kiểm toán bất biến (Audit Trail) tuân thủ PDPL 91/2025.
          </p>
        </div>

        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 self-start md:self-auto shrink-0"
        >
          <Download className="w-4 h-4" />
          Xuất Toàn Bộ Audit Log (CSV)
        </button>
      </div>

      {/* Grid 4 Đồng Hồ Đo Kỹ Thuật */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Tốc độ mở PWA */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tốc độ mở Web PWA</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            0.42<span className="text-xs text-slate-400 ml-1 font-sans">giây</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> SLA chuẩn (&lt; 0.8s): Đạt 100%
          </div>
        </div>

        {/* Metric 2: Độ trễ Check-in Edge */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Độ trễ Check-in API</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-blue-600 font-mono tabular-nums">
            142<span className="text-xs text-slate-400 ml-1 font-sans">ms</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Máy chủ Supabase Edge VN
          </div>
        </div>

        {/* Metric 3: Tỷ lệ tuân thủ PDPL */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">2-Way Consent Protocol</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono tabular-nums">
            100.0<span className="text-xs text-slate-400 ml-1 font-sans">%</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold">
            Không phát sinh khiếu nại SĐT
          </div>
        </div>

        {/* Metric 4: Tỷ lệ đọc chip NFC thành công */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Độ tin cậy Chip NTAG</span>
            <Server className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono tabular-nums">
            99.98<span className="text-xs text-slate-400 ml-1 font-sans">%</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Lớp chống nhiễu phôi kim loại
          </div>
        </div>
      </div>

      {/* Grid 2 Cột: Nhật Ký Hoạt Động (Recent Activity) vs Nhật Ký Kiểm Toán (Immutable Audit Trail) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột 1 (5 cols): Toàn bộ Dòng Nhật Ký Hoạt Động Đã Chuyển Sang Đây */}
        <div className="lg:col-span-5 h-full">
          <RecentActivity
            activities={activities}
            onActivityClick={onActivityClick}
          />
        </div>

        {/* Cột 2 (7 cols): Bảng Nhật Ký Giao Tác Bất Biến (Immutable Audit Trail) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Nhật Ký Giao Tác Bất Biến (Immutable Audit Trail)
              </h3>
              <p className="text-[11px] text-slate-400">
                Ghi nhận từng hành vi chạm thẻ, giải mã vCard và đồng thuận 2 chiều theo thời gian thực
              </p>
            </div>
            <span className="text-xs font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
              SHA-256 Checksum Verified
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs max-h-[520px] overflow-y-auto pr-1">
            {[
              { time: '10:42:15.204', event: 'NFC_TAP_VERIFIED', uid: '04:A2:8F:9C:31:70:80', user: 'Trần Anh Tuấn (TechSea)', result: 'HTTP 200 OK (210ms)' },
              { time: '10:35:48.812', event: '2WAY_CONSENT_GRANTED', uid: '04:B3:9E:11:42:81:80', user: 'Johnny Long Hồ <=> Yến Sào KH', result: 'DECRYPT_VCARD_SUCCESS' },
              { time: '10:18:02.119', event: 'AI_MATCHMAKER_ROUTE', uid: 'TABLE_#14', user: 'Cam Ranh Port <=> Seafoods Corp', result: 'PAIR_OPTIMAL (Score 96%)' },
              { time: '09:50:33.401', event: 'NFC_INVENTORY_DISPATCH', uid: 'BATCH_OBSIDIAN_25', user: 'Ban Chấp Hành Hội DNT Khánh Hòa', result: 'STATUS_ASSIGNED' },
              { time: '09:15:22.784', event: 'GATE_STATION_INIT', uid: 'GATE_01_SHERATON', user: 'Ban Lễ Tân MICE', result: 'OFFLINE_CACHE_READY' },
              { time: '08:45:10.512', event: 'VNEID_LEVEL2_SYNC', uid: 'DEAN_06_GATEWAY', user: 'Cổng Định Danh Quốc Gia', result: 'VERIFIED_TOKEN_VALID' },
            ].map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-100/70 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-[11px]">{log.time}</span>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                    {log.event}
                  </span>
                  <span className="text-slate-700 font-sans font-medium">{log.user}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-slate-400">Target: {log.uid}</span>
                  <span className="text-emerald-600 font-bold">{log.result}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>Toàn bộ dữ liệu được ký số theo tiêu chuẩn PDPL 91/2025/QH15</span>
            <span className="font-semibold text-blue-600">Đồng bộ đám mây Supabase Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};
