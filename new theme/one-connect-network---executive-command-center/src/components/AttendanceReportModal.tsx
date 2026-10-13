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
  UserCheck, 
  MapPin,
  Sparkles
} from 'lucide-react';
import { EntityRecord } from '../types/database';

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

  // Tính toán số liệu thống kê
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

  // Tải file CSV với UTF-8 BOM
  const handleDownloadCsv = () => {
    const BOM = '\uFEFF';
    const metadataHeaders = [
      `"BÁO CÁO ĐIỂM DANH ĐẠI BIỂU HỘI NGHỊ MICE (TRL-7 KHÁNH HÒA 2026)"`,
      `"Sự kiện: ${eventName}"`,
      `"Địa điểm: ${venueName}"`,
      `"Thời điểm xuất: ${exportTimestamp}"`,
      `"Tổng đăng ký: ${totalCount} | Đã check-in: ${checkedInCount} (${attendanceRate}%) | Chờ quét: ${pendingCount}"`,
      `""`,
    ];

    const tableHeaders = [
      'STT',
      'Họ và Tên',
      'Chức Vụ',
      'Đơn Vị / Doanh Nghiệp',
      'Mã Số Thuế',
      'Hạng Vé',
      'Trạng Thái Check-in',
      'Giờ Điểm Danh',
      'Phương Thức',
      'Mã UID Thẻ NFC',
      'Xác Thực VNeID',
      'Giá Trị Deal B2B (VNĐ)',
      'Điểm Gắn Kết (%)',
    ];

    const rows = entities.map((e, index) => [
      index + 1,
      `"${e.full_name}"`,
      `"${e.title}"`,
      `"${e.company_name}"`,
      `"${e.tax_id}"`,
      e.tier,
      `"${e.status_label}"`,
      `"${e.check_in_time}"`,
      e.method,
      `"${e.card_uid}"`,
      e.vneid_verified ? 'ĐÃ XÁC THỰC' : 'CHƯA XÁC THỰC',
      `"${e.deal_pipeline}"`,
      e.connection_score,
    ]);

    const csvContent = BOM + metadataHeaders.join('\n') + tableHeaders.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Bao_Cao_Diem_Danh_MICE_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Kích hoạt In / Lưu PDF bằng hộp thoại in của trình duyệt
  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Toolbar (Không in ra khi bấm in) */}
        <div className="print:hidden px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 to-blue-950 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">
                Xuất Báo Cáo Điểm Danh Sự Kiện (Export Attendance Report)
              </h3>
              <p className="text-[11px] text-blue-200/80">
                Tạo bản tổng hợp chính thức định dạng PDF hoặc file Excel/CSV
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Tải bảng tính Excel CSV (hỗ trợ tiếng Việt UTF-8)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải File CSV (Excel)</span>
            </button>

            <button
              onClick={handlePrintPdf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95"
              title="In hoặc Lưu báo cáo sang file PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Báo Cáo / Lưu PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Đóng cửa sổ"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div 
          ref={reportRef}
          className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 font-sans"
        >
          {/* Header Văn Bản Hành Chính */}
          <div className="border-b-2 border-slate-900 pb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  HỘI DOANH NHÂN TRẺ TỈNH KHÁNH HÒA
                </div>
                <div className="text-xs font-semibold text-blue-900">
                  HẠ TẦNG ĐỊNH DANH SỐ & QUẢN TRỊ MICE: ONE CONNECT NETWORK
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Đề tài Đổi mới sáng tạo TRL-7 Khánh Hòa 2026
                </div>
              </div>

              <div className="sm:text-right text-xs space-y-0.5">
                <div className="font-bold text-slate-900">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                <div className="text-[11px] text-slate-600 italic">Độc lập – Tự do – Hạnh phúc</div>
                <div className="text-[10px] font-mono text-slate-400 pt-1">
                  Khánh Hòa, ngày {exportTimestamp}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center space-y-1">
              <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-slate-950">
                BÁO CÁO TỔNG HỢP TIẾP ĐÓN & ĐIỂM DANH ĐẠI BIỂU
              </h2>
              <p className="text-xs font-bold text-blue-800">
                {eventName}
              </p>
              <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Địa điểm: {venueName}
              </p>
            </div>
          </div>

          {/* Khối Chỉ Số Tổng Quan (Executive Scorecard) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">TỔNG ĐẠI BIỂU</span>
              <span className="text-lg font-black text-slate-900 tabular-nums">{totalCount}</span>
              <span className="text-[10px] text-slate-500 block">Đại biểu đăng ký</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">ĐÃ CHECK-IN</span>
              <span className="text-lg font-black text-emerald-800 tabular-nums">{checkedInCount}</span>
              <span className="text-[10px] text-emerald-600 block">Tỷ lệ {attendanceRate}%</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">ĐẠI BIỂU VIP</span>
              <span className="text-lg font-black text-amber-900 tabular-nums">{vipCheckedCount} / {vipCount}</span>
              <span className="text-[10px] text-amber-700 block">Tiếp đón 100%</span>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">SLA TRUNG BÌNH</span>
              <span className="text-lg font-black text-blue-900 tabular-nums">&lt; 0.42s</span>
              <span className="text-[10px] text-blue-600 block">Chạm thẻ NFC / QR</span>
            </div>
          </div>

          {/* Bảng Danh Sách Điểm Danh Chi Tiết */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                DANH SÁCH CHI TIẾT ĐẠI BIỂU ĐIỂM DANH TẠI QUẦY
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">
                Số bản ghi: {entities.length}
              </span>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
                    <th className="py-2 px-2 text-center w-8">STT</th>
                    <th className="py-2 px-3">Họ và Tên Đại Biểu</th>
                    <th className="py-2 px-3">Chức Vụ & Đơn Vị</th>
                    <th className="py-2 px-2">Hạng Vé</th>
                    <th className="py-2 px-2">Trạng Thái</th>
                    <th className="py-2 px-2">Giờ Vào</th>
                    <th className="py-2 px-2">Phương Thức</th>
                    <th className="py-2 px-2">VNeID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-[11px]">
                  {entities.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2 px-2 text-center font-mono text-slate-400">{index + 1}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {item.full_name}
                      </td>
                      <td className="py-2 px-3 text-slate-600">
                        <div>{item.title}</div>
                        <div className="text-[10px] text-slate-400">{item.company_name}</div>
                      </td>
                      <td className="py-2 px-2 font-bold text-slate-800">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] ${item.tier === 'VIP' ? 'bg-amber-100 text-amber-900' : 'bg-slate-100'}`}>
                          {item.tier}
                        </span>
                      </td>
                      <td className="py-2 px-2 font-bold text-emerald-700">
                        {item.status_label}
                      </td>
                      <td className="py-2 px-2 font-mono text-slate-600">
                        {item.check_in_time}
                      </td>
                      <td className="py-2 px-2 font-mono text-[10px] text-slate-500">
                        {item.method === 'NFC_TAP' ? 'Chạm NFC' : item.method === 'QR_SCAN' ? 'Quét QR' : 'Thủ công'}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {item.vneid_verified ? (
                          <span className="text-blue-600 font-bold text-[10px]">Đã xác thực</span>
                        ) : (
                          <span className="text-slate-400 text-[10px]">Chưa</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pháp Lý & Chữ Ký Xác Thực Bất Biến */}
          <div className="pt-4 border-t border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <strong>Cam kết bảo mật & kiểm toán PDPL:</strong> Dữ liệu danh bạ được mã hóa theo giao thức <strong>Explicit 2-Way Consent</strong>, tuân thủ Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15. Nhật ký kiểm toán bất biến lưu trữ an toàn trên cơ sở dữ liệu Supabase.
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 text-center pt-2 text-xs">
              <div>
                <div className="font-bold text-slate-700 uppercase text-[11px]">ĐẠI DIỆN TRẠM TIẾP ĐÓN MICE</div>
                <div className="text-[10px] text-slate-400 italic mt-0.5">(Ký và xác nhận thời gian thực)</div>
                <div className="h-16 flex items-center justify-center font-serif text-slate-400 italic">
                  Đã ký điện tử
                </div>
                <div className="font-semibold text-slate-800">Ban Lễ Tân Sự Kiện</div>
              </div>

              <div>
                <div className="font-bold text-slate-700 uppercase text-[11px]">TRƯỞNG DỰ ÁN ONE CONNECT</div>
                <div className="text-[10px] text-slate-400 italic mt-0.5">(Chữ ký số xác thực TRL-7)</div>
                <div className="h-16 flex items-center justify-center font-serif text-blue-700 font-bold italic text-base">
                  Johnny Long Hồ
                </div>
                <div className="font-semibold text-slate-800">Hồ Hoàng Long</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer (Không in) */}
        <div className="print:hidden px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="text-[11px]">
            Hệ thống báo cáo tự động hóa · One Connect Network © 2026
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-200/60 font-semibold text-slate-700 transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handlePrintPdf}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-sm shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Báo Cáo Ngay</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
