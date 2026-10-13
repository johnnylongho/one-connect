'use client';

import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Clock, 
  UserCheck
} from 'lucide-react';
import { EntityRecord } from './types';

interface AttendanceReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entities: EntityRecord[];
  eventName?: string;
  venueName?: string;
}

export const AttendanceReportModal: React.FC<AttendanceReportModalProps> = ({
  isOpen,
  onClose,
  entities,
  eventName = 'Hội Nghị Xúc Tiến Đầu Tư MICE & Giao Thương B2B Khánh Hòa 2026',
  venueName = 'Khách sạn Sheraton Nha Trang (TP. Nha Trang, Khánh Hòa)',
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const totalCount = entities.length;
  const checkedInCount = entities.filter(
    (e) => e.status === 'STABLE_CHECKED' || e.status === 'VIP_ACCEPTED' || e.status === 'IN_SESSION'
  ).length;
  const pendingCount = totalCount - checkedInCount;
  const vipCount = entities.filter((e) => e.tier === 'VIP').length;
  const vipCheckedCount = entities.filter(
    (e) => e.tier === 'VIP' && (e.status === 'VIP_ACCEPTED' || e.status === 'STABLE_CHECKED' || e.status === 'IN_SESSION')
  ).length;
  const attendanceRate = totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0;
  const exportTimestamp = new Date().toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const handleDownloadCsv = () => {
    const BOM = '\uFEFF';
    const metadataHeaders = [
      `"BÁO CÁO ĐIỂM DANH ĐẠI BIỂU HỘI NGHỊ MICE (TRL-7 KHÁNH HÒA 2026)"`,
      `"Sự kiện: ${eventName}"`,
      `"Địa điểm: ${venueName}"`,
      `"Thời gian kết xuất: ${exportTimestamp}"`,
      `"Tổng đại biểu: ${totalCount} | Đã điểm danh: ${checkedInCount} (${attendanceRate}%) | VIP: ${vipCheckedCount}/${vipCount}"`,
      `"Căn cứ pháp lý: Tuân thủ Luật Bảo vệ Dữ liệu Cá nhân PDPL 91/2025/QH15"`,
      `""`,
    ];

    const tableHeaders = [
      'STT',
      'Họ Và Tên',
      'Doanh Nghiệp / Tổ Chức',
      'Chức Vụ',
      'Mã Số Thuế',
      'Phân Hạng Vé',
      'Trạng Thái',
      'Giờ Điểm Danh',
      'Phương Thức',
      'Mã UID Thẻ NFC',
      'Xác Thực VNeID',
    ];

    const tableRows = entities.map((e, idx) => [
      idx + 1,
      `"${e.full_name}"`,
      `"${e.company_name}"`,
      `"${e.title || ''}"`,
      `"${e.tax_id || ''}"`,
      `"${e.tier}"`,
      `"${e.status_label}"`,
      `"${e.check_in_time || '--:--'}"`,
      `"${e.method}"`,
      `"${e.card_uid || ''}"`,
      `"${e.vneid_verified ? 'ĐÃ XÁC THỰC CCCD/VNEID' : 'CHƯA XÁC THỰC'}"`,
    ]);

    const csvContent =
      BOM +
      metadataHeaders.join('\r\n') +
      '\r\n' +
      tableHeaders.join(',') +
      '\r\n' +
      tableRows.map((r) => r.join(',')).join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `OneConnect_BaoCaoDiemDanh_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <FileText className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Báo Cáo Điểm Danh & Đo Lường Khách Mời MICE
              </h3>
              <p className="text-xs text-slate-500">
                Xuất biên bản báo cáo chính thức · Tuân thủ Luật PDPL 91/2025/QH15
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải File CSV (Excel)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Văn Bản</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div ref={reportRef} className="p-6 overflow-y-auto space-y-6">
          <div className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-r from-blue-50/50 via-slate-50/50 to-indigo-50/50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 font-mono">
                  ONE CONNECT NETWORK · TẬP ĐOÀN CÔNG NGHỆ SỐ A+
                </span>
                <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                  {eventName}
                </h4>
              </div>
              <div className="text-xs text-slate-500 font-mono shrink-0">
                Kết xuất: {exportTimestamp}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-slate-400 text-[10px] font-medium block">TỔNG ĐẠI BIỂU</span>
                <span className="text-lg font-extrabold text-slate-900 font-mono">{totalCount}</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-slate-400 text-[10px] font-medium block">ĐÃ ĐIỂM DANH</span>
                <span className="text-lg font-extrabold text-emerald-600 font-mono">
                  {checkedInCount} ({attendanceRate}%)
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-slate-400 text-[10px] font-medium block">ĐÓN TIẾP VIP</span>
                <span className="text-lg font-extrabold text-amber-600 font-mono">
                  {vipCheckedCount} / {vipCount}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80">
                <span className="text-slate-400 text-[10px] font-medium block">CHỜ QUÉT THẺ</span>
                <span className="text-lg font-extrabold text-slate-500 font-mono">{pendingCount}</span>
              </div>
            </div>
          </div>

          {/* Table */}
          {entities.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              Chưa có dữ liệu danh sách đại biểu để kết xuất báo cáo.
            </div>
          ) : (
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
                    <th className="py-2.5 px-3 w-10">STT</th>
                    <th className="py-2.5 px-3">HỌ VÀ TÊN</th>
                    <th className="py-2.5 px-3">DOANH NGHIỆP</th>
                    <th className="py-2.5 px-3">HẠNG VÉ</th>
                    <th className="py-2.5 px-3">TRẠNG THÁI</th>
                    <th className="py-2.5 px-3">GIỜ CHECK-IN</th>
                    <th className="py-2.5 px-3">MÃ THẺ NFC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {entities.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{item.full_name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{item.company_name}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-[10px]">{item.tier}</span>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {item.status_label}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {item.check_in_time || '--:--'}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[10.5px]">
                        {item.card_uid || '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dữ liệu báo cáo trích xuất trực tiếp từ Supabase Cloud Singapore</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-200/60 font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Đóng Cửa Sổ
          </button>
        </div>
      </div>
    </div>
  );
};
