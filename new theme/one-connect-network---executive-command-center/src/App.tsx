import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { GlobalPerformance } from './components/GlobalPerformance';
import { EntityHealthStatus } from './components/EntityHealthStatus';
import { DetailModal } from './components/DetailModal';
import { NfcWarehouseModal } from './components/NfcWarehouseModal';
import { QrScannerModal } from './components/QrScannerModal';
import { ToastContainer, ToastItem } from './components/ToastContainer';
import { OperatorCheckInView } from './components/views/OperatorCheckInView';
import { AiMatchmakingView } from './components/views/AiMatchmakingView';
import { MembersManagementView } from './components/views/MembersManagementView';
import { TelemetryPilotView } from './components/views/TelemetryPilotView';
import { 
  INITIAL_GLOBAL_STATS, 
  INITIAL_ACTIVITIES, 
  INITIAL_ENTITIES 
} from './services/dashboardData';
import { OneConnectDataService } from './services/supabaseService';
import { EntityRecord, ActivityFeedItem } from './types/database';
import { 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  ScanLine, 
  Users, 
  CalendarDays, 
  BarChart3,
  Cpu,
  Layers,
  Info,
  CalendarCheck2,
  Building2,
  ShieldCheck,
  QrCode
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isTabletView, setIsTabletView] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [stats, setStats] = useState(INITIAL_GLOBAL_STATS);
  const [activities, setActivities] = useState<ActivityFeedItem[]>(INITIAL_ACTIVITIES);
  const [entities, setEntities] = useState<EntityRecord[]>(INITIAL_ENTITIES);

  const [selectedEntity, setSelectedEntity] = useState<EntityRecord | null>(null);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState<boolean>(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Tự động dọn dẹp các thông báo cũ sau 5 giây
  useEffect(() => {
    if (toasts.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setToasts((prev) => prev.filter((t) => now - t.createdAt < 5000));
    }, 1000);
    return () => clearInterval(interval);
  }, [toasts.length]);

  // Phím tắt '[' để thu gọn/mở rộng Sidebar nhanh
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '[' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hệ thống thêm Toast với cơ chế nhóm (Grouping) các thông báo trùng lặp
  const showToast = (
    msg: string,
    options?: {
      title?: string;
      type?: 'success' | 'info' | 'warning' | 'error';
      groupKey?: string;
      entityId?: string;
      entityName?: string;
      actionLabel?: string;
      onAction?: () => void;
    }
  ) => {
    const title = options?.title || 'Thông báo hệ thống';
    const type = options?.type || 'info';
    const entityId = options?.entityId;
    const groupKey = options?.groupKey || (entityId ? `checkin-${entityId}` : undefined);
    const actionLabel = options?.actionLabel;
    const onAction = options?.onAction;

    setToasts((prev) => {
      // Nếu đã có thông báo cùng groupKey, nhóm lại và tăng số đếm (e.g. x2, x3)
      if (groupKey) {
        const existingIdx = prev.findIndex((t) => t.groupKey === groupKey);
        if (existingIdx !== -1) {
          const existing = prev[existingIdx];
          const updated: ToastItem = {
            ...existing,
            count: existing.count + 1,
            message: msg,
            createdAt: Date.now(),
          };
          const remaining = prev.filter((_, i) => i !== existingIdx);
          return [updated, ...remaining];
        }
      }

      // Tạo toast mới
      const newToast: ToastItem = {
        id: `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        groupKey,
        title,
        message: msg,
        count: 1,
        type,
        entityId,
        entityName: options?.entityName,
        actionLabel,
        onAction,
        createdAt: Date.now(),
      };
      return [newToast, ...prev.slice(0, 4)];
    });
  };

  // Check-In function connected through service with grouped toast and profile action
  const handleCheckInAttendee = async (
    entityId: string, 
    method: 'NFC_TAP' | 'QR_SCAN' = 'NFC_TAP'
  ) => {
    try {
      const res = await OneConnectDataService.getInstance().checkInAttendee(entityId, method);
      if (res.success) {
        // Cập nhật state nội bộ
        setEntities((prev) =>
          prev.map((item) => (item.id === entityId ? res.entity : item))
        );
        setStats((prev) => ({
          ...prev,
          event_checkin: {
            ...prev.event_checkin,
            total_checkins: prev.event_checkin.total_checkins + 1,
          },
        }));
        const acts = await OneConnectDataService.getInstance().getActivities();
        setActivities(acts);

        // Hiển thị toast được nhóm với hành động nhanh "Xem Hồ Sơ 3D"
        showToast(
          `${method === 'NFC_TAP' ? 'Chạm thẻ NFC' : 'Quét mã QR'}: ${res.entity.company_name} (SLA ${res.latencyMs}ms)`,
          {
            title: `Điểm danh thành công: ${res.entity.full_name}`,
            type: 'success',
            groupKey: `checkin-${res.entity.id}`,
            entityId: res.entity.id,
            entityName: res.entity.full_name,
            actionLabel: 'Xem Hồ Sơ 3D',
          }
        );
      }
    } catch (e: any) {
      showToast(e.message || 'Lỗi khi điểm danh', { type: 'error' });
    }
  };

  const handleCardClick = (cardType: string) => {
    if (cardType === 'nfc_cards' || cardType === 'inventory') {
      setIsWarehouseModalOpen(true);
    } else if (cardType === 'checkin') {
      setActiveTab('checkin');
    } else if (cardType === 'ai_matchmaking') {
      setActiveTab('matching');
    } else if (cardType === 'b2b_connections') {
      setActiveTab('telemetry');
    } else {
      showToast(`Chuyển đến màn hình chi tiết: ${cardType}`);
    }
  };

  // Render view theo tab hiện tại
  const renderMainContent = () => {
    switch (activeTab) {
      case 'checkin':
        return (
          <OperatorCheckInView
            entities={entities}
            onCheckInSuccess={handleCheckInAttendee}
            onOpenQrModal={() => setIsQrScannerOpen(true)}
          />
        );
      case 'matching':
        return <AiMatchmakingView />;
      case 'members':
      case 'attendees':
        return (
          <MembersManagementView
            entities={entities}
            onSelectMember={(m) => setSelectedEntity(m)}
          />
        );
      case 'telemetry':
      case 'reports':
        return (
          <TelemetryPilotView
            activities={activities}
            onActivityClick={(item) => showToast(`Chi tiết sự kiện: ${item.title}`)}
          />
        );
      case 'events':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Danh Sách Sự Kiện MICE & Diễn Đàn Doanh Nghiệp (Khánh Hòa 2026)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Diễn đàn Kinh tế Biển & Du lịch Khánh Hòa 2026', venue: 'Sheraton Nha Trang Hotel & Spa', date: 'Ngày mai, 08:00 - 17:30', delegates: '450 Đại biểu VIP', status: 'SẮP DIỄN RA' },
                  { name: 'Hội nghị Kết nối Giao thương Doanh nhân Trẻ Khánh Hòa', venue: 'Vinpearl Convention Centre Nha Trang', date: '24/10/2026, 08:30 - 12:00', delegates: '600 Doanh nhân', status: 'ĐÃ LÊN LỊCH' },
                  { name: 'Diễn đàn Chuyển Đổi Số Doanh Nghiệp Nam Trung Bộ', venue: 'The Anam Cam Ranh Resort', date: '05/11/2026, 13:30 - 18:00', delegates: '350 Doanh nhân', status: 'ĐÃ LÊN LỊCH' },
                  { name: 'Hội nghị Xúc tiến Đầu tư MICE & Bất động sản Nghỉ dưỡng', venue: 'InterContinental Nha Trang', date: 'Hôm qua (Đã hoàn tất)', delegates: '520 Đại biểu', status: 'HOÀN THÀNH' },
                ].map((ev, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-slate-900">{ev.name}</h4>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                        {ev.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {ev.venue}
                    </p>
                    <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                      <span>{ev.date}</span>
                      <span className="font-bold text-blue-600">{ev.delegates}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'nfc-cards':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900">
                  Kho 1.500 Phôi Thẻ NFC Kim Loại (Obsidian / Royal Gold / Platinum)
                </h3>
                <button
                  onClick={() => setIsWarehouseModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold"
                >
                  Mở Trình Quản Lý Kho
                </button>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đợt 1 thí điểm: Cấp phát 1.500 phôi thẻ thông minh tích hợp chip NTAG216 tốc độ cao cho hội viên Hội Doanh Nhân Trẻ Khánh Hòa. Đảm bảo nguyên tắc <strong>Card Continuity</strong> (đổi thẻ vật lý không bao giờ mất dữ liệu).
              </p>
            </div>
          </div>
        );
      case 'dashboard':
      default:
        return (
          <>
            {/* Contextual Banner: One Connect Network Khánh Hòa 2026 */}
            <div 
              className={`bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-md relative overflow-hidden transition-all duration-300 flex flex-col justify-between gap-4 sm:gap-5 ${
                collapsed 
                  ? 'xl:flex-row xl:items-center' 
                  : '2xl:flex-row 2xl:items-center'
              }`}
            >
              {/* Background ambient lighting effects */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-8 right-1/3 w-36 h-36 bg-indigo-500/20 rounded-full blur-xl pointer-events-none"></div>

              {/* Text content area */}
              <div className="space-y-1.5 z-10 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full font-mono">
                    Dự án ĐMST Khánh Hòa 2026
                  </span>
                  <span className="text-xs text-blue-200 font-medium">
                    TRL-7 Production-Ready
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
                  Trung Tâm Điều Hành Định Danh & Giao Thương B2B
                </h1>
                <p className="text-xs text-blue-100 max-w-3xl leading-relaxed">
                  Hạ tầng kết nối 1.500 doanh nhân số, quản trị trạm check-in MICE siêu tốc &lt;0.8s, AI Matchmaking và giao thức 2-Way Consent tuân thủ Luật PDPL 91/2025.
                </p>
              </div>

              {/* Action buttons cluster */}
              <div className="flex flex-col md:flex-row items-center gap-y-2 gap-x-3 z-10 shrink-0 pt-1 sm:pt-0">
                <button
                  onClick={() => setIsWarehouseModalOpen(true)}
                  className="min-w-[140px] shrink-0 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 shadow-2xs"
                >
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Kho 1.500 Thẻ NFC</span>
                </button>
                <button
                  onClick={() => setIsQrScannerOpen(true)}
                  className="min-w-[140px] shrink-0 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95"
                >
                  <QrCode className="w-4 h-4 text-emerald-100 shrink-0" />
                  <span>Quét Mã QR Tiếp Đón</span>
                </button>
                <button
                  onClick={() => {
                    if (entities.length > 0) {
                      handleCheckInAttendee(entities[entities.length - 1].id, 'NFC_TAP');
                    }
                  }}
                  className="min-w-[140px] shrink-0 px-4 py-2 rounded-xl bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95"
                >
                  <ScanLine className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Mô Phỏng Chạm Thẻ 0.42s</span>
                </button>
              </div>
            </div>

            {/* 1. Global Performance Section (6 KPI Widgets matching image) */}
            <GlobalPerformance
              stats={stats}
              onCardClick={handleCardClick}
            />

            {/* 2. Bottom Row: Expanded Entity Health Status (Full 100% Canvas Width) */}
            <div className="w-full">
              <EntityHealthStatus
                entities={entities}
                onSelectEntity={(entity) => setSelectedEntity(entity)}
                onQuickCheckIn={handleCheckInAttendee}
                onViewActivityLog={() => setActiveTab('reports')}
                eventCheckinStats={stats.event_checkin}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0d1627] text-slate-800 p-1 sm:p-2 md:p-3 lg:p-3.5 flex flex-col justify-center font-sans antialiased">
      {/* Outer Dashboard Window Container (Mirroring image.png floating canvas) */}
      <div 
        className={`w-full h-full bg-[#f4f7fb] rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-slate-700/30 flex flex-col transition-all duration-300 mx-auto ${
          isTabletView 
            ? 'max-w-[1024px] shadow-indigo-950/40 ring-4 ring-indigo-500/20' 
            : 'max-w-[1680px]'
        }`}
      >
        {/* Tablet Simulator Notice (if active) */}
        {isTabletView && (
          <div className="bg-indigo-600 text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Đang mô phỏng màn hình Tablet (iPad 1024px) dành cho Tình nguyện viên & Lễ tân MICE</span>
            </div>
            <button 
              onClick={() => setIsTabletView(false)}
              className="underline text-[11px] hover:text-indigo-200"
            >
              Trở về Desktop 1440px
            </button>
          </div>
        )}

        {/* Dashboard Layout: Sidebar + Main Area */}
        <div className="flex flex-1 min-h-0 overflow-hidden relative">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={collapsed || isTabletView}
            setCollapsed={setCollapsed}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 flex flex-col overflow-y-auto bg-[#f8fafc]">
            {/* Top Header */}
            <Header
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isTabletView={isTabletView}
              setIsTabletView={setIsTabletView}
              onOpenNotifications={() => showToast('12 Thông báo: 4 đại biểu VIP vừa check-in, 8 yêu cầu 2-Way Consent')}
              onOpenProfile={() => showToast('Tài khoản: Hồ Hoàng Long (Johnny Long Hồ) - Quản lý Dự án & Media')}
              onOpenQrScanner={() => setIsQrScannerOpen(true)}
            />

            {/* Dashboard Body Content */}
            <main className="flex-1 p-4 sm:p-5 lg:p-6 space-y-5">
              {renderMainContent()}
            </main>

            {/* Quiet Footer */}
            <footer className="px-6 py-3.5 bg-white border-t border-slate-200/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">ONE CONNECT NETWORK © 2026</span>
                <span>·</span>
                <span>Tập đoàn Công nghệ số A+ (Aplusvn Media & Tech)</span>
                <span>·</span>
                <span>Nha Trang, Khánh Hòa</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                <span>Trưởng dự án: Johnny Long Hồ</span>
                <span>·</span>
                <span>Tuân thủ PDPL 91/2025/QH15</span>
              </div>
            </footer>
          </div>
        </div>
      </div>

      {/* Interactive QR Code Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        entities={entities}
        onCheckInSuccess={(id, method) => handleCheckInAttendee(id, method || 'QR_SCAN')}
      />

      {/* Interactive Detail Modal for 3D Smart Card & Profile */}
      <DetailModal
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
        onCheckInNow={(id) => handleCheckInAttendee(id, 'NFC_TAP')}
      />

      {/* Interactive NFC Warehouse Modal */}
      <NfcWarehouseModal
        isOpen={isWarehouseModalOpen}
        onClose={() => setIsWarehouseModalOpen(false)}
      />

      {/* Toast Notification Container with Grouping & Quick View Profile Action */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
        onViewProfile={(entityId) => {
          const found = entities.find((e) => e.id === entityId);
          if (found) setSelectedEntity(found);
        }}
        onClearAll={() => setToasts([])}
      />
    </div>
  );
}
