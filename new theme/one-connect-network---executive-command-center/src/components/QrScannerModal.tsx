import React, { useState, useEffect } from 'react';
import { 
  X, 
  QrCode, 
  ScanLine, 
  Camera, 
  SwitchCamera, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Zap,
  Search,
  UserCheck,
  Building2,
  Volume2,
  VolumeX
} from 'lucide-react';
import { EntityRecord } from '../types/database';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  entities: EntityRecord[];
  onCheckInSuccess: (entityId: string, method?: 'QR_SCAN' | 'NFC_TAP') => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  entities,
  onCheckInSuccess,
}) => {
  const [selectedAttendeeId, setSelectedAttendeeId] = useState<string>(
    entities.find((e) => e.status === 'PENDING_TAP')?.id || entities[0]?.id || ''
  );
  const [isScanning, setIsScanning] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [manualCode, setManualCode] = useState('');
  const [scanResult, setScanResult] = useState<{
    entity: EntityRecord;
    latencyMs: number;
    scannedHash: string;
    timestamp: string;
  } | null>(null);

  // Update default selected attendee when modal opens or entities change
  useEffect(() => {
    if (isOpen) {
      const pending = entities.find((e) => e.status === 'PENDING_TAP') || entities[0];
      if (pending) {
        setSelectedAttendeeId(pending.id);
      }
      setScanResult(null);
      setIsScanning(false);
    }
  }, [isOpen, entities]);

  if (!isOpen) return null;

  const currentAttendee = entities.find((e) => e.id === selectedAttendeeId) || entities[0];

  const handleTriggerScan = (targetAttendee?: EntityRecord) => {
    const attendee = targetAttendee || currentAttendee;
    if (!attendee) return;

    setIsScanning(true);
    const start = performance.now();

    // Mô phỏng giải mã mã QR từ luồng video camera (350ms - 450ms)
    setTimeout(() => {
      setIsScanning(false);
      const latency = Math.round(performance.now() - start);
      const generatedHash = `ONE-CONNECT-QR-${attendee.card_uid.replace(/:/g, '').substring(0, 8)}-${Date.now().toString().slice(-4)}`;

      // Gọi logic check-in hệ thống
      onCheckInSuccess(attendee.id, 'QR_SCAN');

      setScanResult({
        entity: attendee,
        latencyMs: latency + 120,
        scannedHash: generatedHash,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      });
    }, 400);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;

    // Tìm kiếm đại biểu theo mã UID hoặc tên
    const matched = entities.find(
      (e) =>
        e.card_uid.toLowerCase().includes(manualCode.toLowerCase()) ||
        e.tax_id.includes(manualCode) ||
        e.full_name.toLowerCase().includes(manualCode.toLowerCase())
    );

    if (matched) {
      handleTriggerScan(matched);
      setManualCode('');
    } else {
      alert(`Không tìm thấy đại biểu khớp với mã: ${manualCode}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-blue-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-300">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">
                  Camera Quét Mã QR vCard 3.0
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-semibold border border-emerald-400/30">
                  AI Vision 60 FPS
                </span>
              </div>
              <p className="text-[11px] text-blue-200/80">
                Phương thức dự phòng song song với thẻ NFC · SLA tiếp đón &lt; 800ms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title={soundEnabled ? 'Tắt âm thanh bíp' : 'Bật âm thanh bíp'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Đóng cửa sổ quét"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Viewport Máy Quét QR (Camera Simulator) */}
          <div className="relative rounded-2xl bg-slate-950 overflow-hidden border border-slate-800 shadow-inner flex flex-col items-center justify-center min-h-[260px] sm:min-h-[280px]">
            {/* Background Camera Lens Feed / Grid Lines */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]"></div>

            {/* Corner Viewfinder Brackets */}
            <div className="relative w-56 h-56 border-2 border-white/20 rounded-2xl flex items-center justify-center p-3">
              {/* Corner 1 */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-blue-400 rounded-tl-lg"></div>
              {/* Corner 2 */}
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-blue-400 rounded-tr-lg"></div>
              {/* Corner 3 */}
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-blue-400 rounded-bl-lg"></div>
              {/* Corner 4 */}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-blue-400 rounded-br-lg"></div>

              {/* Animated Laser Scanning Beam */}
              <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_12px_#3b82f6] animate-bounce"></div>

              {/* Central QR Mockup graphic */}
              <div className="w-36 h-36 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                <QrCode className="w-16 h-16 text-blue-400/70" />
                <span className="text-[10px] font-mono text-slate-300 mt-1">
                  Đưa mã QR vào khung
                </span>
              </div>
            </div>

            {/* Camera Floating Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>HD Camera</span>
              <button 
                onClick={() => setFacingMode(facingMode === 'environment' ? 'user' : 'environment')}
                className="ml-1 p-1 hover:text-blue-300 transition-colors"
                title="Đổi camera trước / sau"
              >
                <SwitchCamera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Scanning indicator */}
            <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono">Tự động nhận diện vCard 3.0</span>
              <button
                onClick={() => handleTriggerScan()}
                disabled={isScanning}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 shadow-md transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                {isScanning ? 'Đang nhận diện...' : 'Quét Mã Nhanh (Click)'}
              </button>
            </div>
          </div>

          {/* Kết quả sau khi quét mã thành công */}
          {scanResult && (
            <div className="rounded-2xl p-4 bg-emerald-50 border border-emerald-200 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {scanResult.entity.full_name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        scanResult.entity.tier === 'VIP'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-blue-100 text-blue-900 border border-blue-200'
                      }`}>
                        {scanResult.entity.tier}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {scanResult.entity.title} · {scanResult.entity.company_name}
                    </div>
                    <div className="text-[10px] font-mono text-emerald-700 mt-1">
                      Hash: {scanResult.scannedHash}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-emerald-800 font-mono block">
                    Độ trễ: {scanResult.latencyMs}ms
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {scanResult.timestamp}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-800 font-medium text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Đã đồng bộ lên Supabase & gửi tin nhắn ZNS chào đón
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert(`Lệnh in nhãn đeo VIP cho ${scanResult.entity.full_name} đã gửi tới máy in nhiệt!`)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-bold text-[11px] hover:bg-emerald-100 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-emerald-700" />
                    In Thẻ Đeo Ngay
                  </button>
                  <button
                    onClick={onClose}
                    className="px-3 py-1 rounded-lg bg-emerald-700 text-white font-bold text-[11px] hover:bg-emerald-800 transition-colors"
                  >
                    Hoàn tất
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Chọn nhanh đại biểu để quét (Quick attendee selector) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                Chọn đại biểu đứng trước quầy tiếp đón:
              </span>
              <span className="text-[11px] text-slate-400">
                {entities.filter((e) => e.status === 'PENDING_TAP').length} người chưa điểm danh
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto pr-1">
              {entities.map((item) => {
                const isSelected = item.id === currentAttendee?.id;
                const isChecked = item.status === 'STABLE_CHECKED' || item.status === 'VIP_ACCEPTED';

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedAttendeeId(item.id);
                      handleTriggerScan(item);
                    }}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 text-xs ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-500/20'
                        : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-bold text-slate-800 truncate flex items-center gap-1">
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

                    <div className="shrink-0 text-right">
                      {isChecked ? (
                        <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          ✓ Đã vào
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAttendeeId(item.id);
                            handleTriggerScan(item);
                          }}
                          className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold"
                        >
                          Quét
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Nhập mã QR / Mã thẻ thủ công dự phòng */}
          <form onSubmit={handleManualSubmit} className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  placeholder="Hoặc nhập thủ công mã vCard hash, mã UID thẻ hoặc MST..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
              >
                Xác thực
              </button>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mã hóa vCard 3.0 tuân thủ Luật PDPL 91/2025/QH15</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-200/60 font-semibold text-slate-700 transition-colors"
          >
            Đóng Camera
          </button>
        </div>
      </div>
    </div>
  );
};
