import React, { useState } from 'react';
import { 
  ScanLine, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Printer, 
  BellRing, 
  RotateCcw,
  Wifi,
  Search,
  UserCheck
} from 'lucide-react';
import { EntityRecord } from '../../types/database';

interface OperatorCheckInViewProps {
  entities: EntityRecord[];
  onCheckInSuccess: (id: string, method?: 'NFC_TAP' | 'QR_SCAN') => void;
  onOpenQrModal?: () => void;
}

export const OperatorCheckInView: React.FC<OperatorCheckInViewProps> = ({
  entities,
  onCheckInSuccess,
  onOpenQrModal,
}) => {
  const [selectedAttendeeId, setSelectedAttendeeId] = useState<string>(entities[0]?.id || '');
  const [lastCheckInResult, setLastCheckInResult] = useState<{
    entity: EntityRecord;
    latencyMs: number;
    timestamp: string;
  } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannerMode, setScannerMode] = useState<'NFC' | 'QR'>('NFC');
  const [quickSearch, setQuickSearch] = useState('');

  const currentAttendee = entities.find((e) => e.id === selectedAttendeeId) || entities[0];

  const handleSimulateTap = () => {
    if (!currentAttendee) return;
    setIsScanning(true);
    const start = performance.now();

    setTimeout(() => {
      setIsScanning(false);
      const latency = Math.round(performance.now() - start + 250);
      onCheckInSuccess(currentAttendee.id, scannerMode === 'QR' ? 'QR_SCAN' : 'NFC_TAP');
      setLastCheckInResult({
        entity: currentAttendee,
        latencyMs: latency,
        timestamp: new Date().toLocaleTimeString('vi-VN'),
      });
    }, 420); // 0.42s Web PWA standard
  };

  const filteredList = entities.filter(
    (e) =>
      e.full_name.toLowerCase().includes(quickSearch.toLowerCase()) ||
      e.card_uid.toLowerCase().includes(quickSearch.toLowerCase()) ||
      e.company_name.toLowerCase().includes(quickSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner Trạm Check-in */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-2xl p-6 text-white border border-blue-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[11px] font-semibold border border-blue-400/30">
              TRẠM TIẾP ĐÓN MICE · CỔNG SỐ 1
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <Wifi className="w-3.5 h-3.5" /> Offline-First (Đồng bộ tức thì)
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Trạm Check-in Siêu Tốc 1-Chạm NFC & Mã QR
          </h2>
          <p className="text-xs text-blue-200/80 max-w-xl">
            Tối ưu hóa cho máy tính bảng iPad tại quầy lễ tân hội nghị 5 sao (Sheraton, Vinpearl, The Anam). Thời gian điểm danh trung bình: &lt; 0.8 giây / lượt.
          </p>
        </div>

        {/* Chế độ Quét: NFC vs QR */}
        <div className="flex items-center bg-white/10 p-1 rounded-xl border border-white/15 self-start md:self-auto">
          <button
            onClick={() => setScannerMode('NFC')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              scannerMode === 'NFC'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Đầu Đọc Thẻ NFC (0.42s)
          </button>
          <button
            onClick={() => setScannerMode('QR')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              scannerMode === 'QR'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-blue-200 hover:text-white'
            }`}
          >
            <ScanLine className="w-4 h-4" />
            Camera Mã QR vCard
          </button>
        </div>
      </div>

      {/* Grid 2 Cột: Bàn Quét Trực Tiếp vs Danh Sách Đại Biểu Đang Chờ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI (7 cols): Giao diện Máy Quét Trực Quan */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-blue-600" />
                Vùng Tiếp Xúc Cảm Ứng (Sensor Target Zone)
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                SLA Chuẩn: &lt; 800ms
              </span>
            </div>

            {/* Khung tương tác quét thẻ */}
            <div 
              onClick={handleSimulateTap}
              className={`relative rounded-2xl p-8 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isScanning
                  ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
              }`}
              style={{ minHeight: '220px' }}
            >
              {isScanning ? (
                <div className="space-y-3 animate-pulse">
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-blue-500/30">
                    <CreditCard className="w-8 h-8 animate-spin" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-blue-900 block">
                      Đang đọc chip NFC NTAG216...
                    </span>
                    <span className="text-xs text-blue-600 font-mono">
                      Giải mã UID & xác thực chữ ký vCard 3.0
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition-transform">
                    {scannerMode === 'NFC' ? (
                      <CreditCard className="w-8 h-8" />
                    ) : (
                      <ScanLine className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">
                      {scannerMode === 'NFC' ? 'Chạm Thẻ NFC Lên Vùng Này' : 'Đưa Mã QR Đại Biểu Vào Khung Quét'}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mt-1">
                      Nhấp vào đây để mô phỏng sự kiện chạm thẻ của đại biểu: <strong className="text-slate-700">{currentAttendee?.full_name}</strong>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-[11px] font-bold rounded-full">
                      {scannerMode === 'NFC' ? 'Bấm để Chạm Thẻ Ngay (0.42s)' : 'Bấm để Quét Mã Ngay'}
                    </span>
                    {scannerMode === 'QR' && onOpenQrModal && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenQrModal();
                        }}
                        className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-full shadow-xs transition-colors"
                      >
                        Mở Camera Quét Fullscreen
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Kết Quả Điểm Danh Vừa Thực Hiện */}
            {lastCheckInResult && (
              <div className="rounded-xl p-4 bg-emerald-50 border border-emerald-200 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-base shrink-0">
                      ✓
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {lastCheckInResult.entity.full_name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          {lastCheckInResult.entity.tier}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600">
                        {lastCheckInResult.entity.title} · {lastCheckInResult.entity.company_name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 block font-mono">
                      Thời gian: {lastCheckInResult.latencyMs}ms
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Lúc {lastCheckInResult.timestamp}
                    </span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-emerald-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Đã gửi thông báo tiếp đón qua Zalo ZNS & phân bàn VIP
                  </div>
                  <button 
                    onClick={() => alert(`Lệnh in nhãn đeo VIP cho ${lastCheckInResult.entity.full_name} đã gửi tới máy in nhiệt!`)}
                    className="flex items-center gap-1 font-bold text-blue-700 hover:underline"
                  >
                    <Printer className="w-3.5 h-3.5" /> In Thẻ Đeo Ngay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CỘT PHẢI (5 cols): Danh Sách Đại Biểu Chờ Tiếp Đón (Tablet Friendly) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Danh Bạ Tra Cứu Nhanh (Fast Lookup)
              </h3>
              <p className="text-[11px] text-slate-400">
                Chọn đại biểu để nạp vào đầu đọc thẻ tiếp đón
              </p>
            </div>
            <span className="text-xs font-bold text-blue-600 tabular-nums">
              {filteredList.length} Đại biểu
            </span>
          </div>

          {/* Ô tìm kiếm nhanh */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Nhập tên, công ty hoặc mã UID thẻ..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Danh sách đại biểu */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredList.map((item) => {
              const isSelected = item.id === currentAttendee?.id;
              const isCheckedIn = item.status === 'STABLE_CHECKED' || item.status === 'VIP_ACCEPTED';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedAttendeeId(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-500/20'
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shrink-0">
                      {item.full_name.charAt(0)}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs text-slate-900 truncate flex items-center gap-1">
                        {item.full_name}
                        {item.tier === 'VIP' && (
                          <span className="text-[9px] px-1 py-0.2 bg-amber-100 text-amber-800 rounded font-bold">
                            VIP
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {item.company_name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {isCheckedIn ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        ✓ {item.check_in_time}
                      </span>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAttendeeId(item.id);
                          handleSimulateTap();
                        }}
                        className="text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md border border-blue-200 transition-colors"
                      >
                        Quét ngay
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
