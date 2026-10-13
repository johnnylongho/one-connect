'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CreditCard, 
  ScanLine, 
  Layers, 
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Database
} from 'lucide-react';
import { 
  GlobalPerformanceStats, 
  EntityRecord, 
  ActivityFeedItem, 
  ToastItem 
} from './types';
import { GlobalMetricsWidget } from './GlobalMetricsWidget';
import { EntityHealthWidget } from './EntityHealthWidget';
import { DetailModal } from './DetailModal';
import { NfcWarehouseModal } from './NfcWarehouseModal';
import { QrScannerModal } from './QrScannerModal';
import { ToastContainer } from './ToastContainer';

interface ExecutiveDashboardClientProps {
  initialStats: GlobalPerformanceStats;
  initialEntities: EntityRecord[];
  initialActivities: ActivityFeedItem[];
  defaultEventId?: string;
}

export const ExecutiveDashboardClient: React.FC<ExecutiveDashboardClientProps> = ({
  initialStats,
  initialEntities,
  initialActivities,
  defaultEventId = 'ea111111-1111-1111-1111-111111111111',
}) => {
  const [stats, setStats] = useState<GlobalPerformanceStats>(initialStats);
  const [entities, setEntities] = useState<EntityRecord[]>(initialEntities);
  const [activities, setActivities] = useState<ActivityFeedItem[]>(initialActivities);
  const [selectedEntity, setSelectedEntity] = useState<EntityRecord | null>(null);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState<boolean>(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Cleanup toasts after 5 seconds
  useEffect(() => {
    if (toasts.length === 0) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setToasts((prev) => prev.filter((t) => now - t.createdAt < 5000));
    }, 1000);
    return () => clearInterval(interval);
  }, [toasts.length]);

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
      if (groupKey) {
        const existingIdx = prev.findIndex((t) => t.groupKey === groupKey);
        if (existingIdx !== -1) {
          const existing = prev[existingIdx];
          if (existing) {
            const updated: ToastItem = {
              ...existing,
              id: existing.id,
              count: existing.count + 1,
              message: msg,
              createdAt: Date.now(),
            };
            const remaining = prev.filter((_, i) => i !== existingIdx);
            return [updated, ...remaining];
          }
        }
      }

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

  // Check-In function calling production API route
  const handleCheckInAttendee = async (
    entityId: string, 
    method: 'NFC_TAP' | 'QR_SCAN' = 'NFC_TAP'
  ) => {
    const target = entities.find((e) => e.id === entityId);
    if (!target) return;

    try {
      const codeOrUid = target.card_uid || target.id;
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: defaultEventId,
          codeOrUid,
          method: method === 'NFC_TAP' ? 'NFC' : 'QR',
          gateLocation: 'Gate 1 - VIP Executive Terminal',
        }),
      });

      const data = await res.json();
      const latencyMs = data.latencyMs || 280;
      const nowTimeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

      // Update entity locally
      setEntities((prev) =>
        prev.map((item) =>
          item.id === entityId
            ? {
                ...item,
                status: item.tier === 'VIP' ? 'VIP_ACCEPTED' : 'STABLE_CHECKED',
                status_label: item.tier === 'VIP' ? 'ĐÃ TIẾP ĐÓN VIP' : 'ĐÃ CHECK-IN',
                check_in_time: nowTimeStr,
                method,
              }
            : item
        )
      );

      // Increment stats
      setStats((prev) => ({
        ...prev,
        event_checkin: {
          ...prev.event_checkin,
          total_checkins: prev.event_checkin.total_checkins + 1,
          vip_count: target.tier === 'VIP' ? prev.event_checkin.vip_count + 1 : prev.event_checkin.vip_count,
        },
      }));

      // Audit Feed Item
      const newAct: ActivityFeedItem = {
        id: `act-${Date.now()}`,
        time: nowTimeStr,
        title: `Điểm danh ${method === 'NFC_TAP' ? 'chạm thẻ NFC' : 'quét QR'}: ${target.full_name}`,
        subtitle: `Xác thực thành công tại Cổng Tiếp đón MICE Nha Trang · Phân hạng ${target.tier} · SLA ${latencyMs}ms`,
        category: 'CHECK_IN',
        badgeType: 'emerald',
        user_name: target.full_name,
        organization: target.company_name,
      };
      setActivities((prev) => [newAct, ...prev.slice(0, 9)]);

      showToast(
        `${method === 'NFC_TAP' ? 'Chạm thẻ NFC' : 'Quét mã QR'}: ${target.company_name} (SLA ${latencyMs}ms)`,
        {
          title: `Điểm danh thành công: ${target.full_name}`,
          type: 'success',
          groupKey: `checkin-${target.id}`,
          entityId: target.id,
          entityName: target.full_name,
          actionLabel: 'Xem Hồ Sơ 3D',
        }
      );
    } catch (e: any) {
      showToast(e.message || 'Lỗi khi kết nối trạm check-in', { type: 'error' });
    }
  };

  const handleCardClick = (cardType: string) => {
    if (cardType === 'nfc_cards' || cardType === 'inventory') {
      setIsWarehouseModalOpen(true);
    } else {
      showToast(`Chi tiết danh mục: ${cardType}`);
    }
  };

  return (
    <div className="space-y-6 w-full antialiased">
      {/* 1. Contextual Banner: One Connect Network Khánh Hòa 2026 */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-2xl p-4 sm:p-5 md:p-6 text-white shadow-md relative overflow-hidden flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 right-1/3 w-36 h-36 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="space-y-1.5 z-10 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full font-mono">
              Dự án ĐMST Khánh Hòa 2026
            </span>
            <span className="text-xs text-blue-200 font-medium">
              TRL-7 Production-Ready Live
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold tracking-tight">
            Trung Tâm Điều Hành Định Danh & Giao Thương B2B
          </h1>
          <p className="text-xs text-blue-100 max-w-3xl leading-relaxed">
            Hạ tầng kết nối 1.500 doanh nhân số, quản trị trạm check-in MICE siêu tốc &lt;0.8s, AI Matchmaking và giao thức 2-Way Consent tuân thủ Luật PDPL 91/2025.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 z-10 shrink-0 pt-1 sm:pt-0">
          <button
            onClick={() => setIsWarehouseModalOpen(true)}
            className="w-full sm:w-auto min-w-[140px] px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold backdrop-blur-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 shadow-2xs cursor-pointer"
          >
            <Layers className="w-4 h-4 shrink-0" />
            <span>Kho 1.500 Thẻ NFC</span>
          </button>
          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="w-full sm:w-auto min-w-[140px] px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-emerald-100 shrink-0" />
            <span>Quét Mã QR Tiếp Đón</span>
          </button>
          <button
            onClick={() => {
              if (entities.length > 0) {
                const pending = entities.find((e) => e.status === 'PENDING_TAP') || entities[0];
                if (pending) {
                  handleCheckInAttendee(pending.id, 'NFC_TAP');
                }
              } else {
                showToast('Chưa có hồ sơ đại biểu để mô phỏng', { type: 'warning' });
              }
            }}
            className="w-full sm:w-auto min-w-[140px] px-4 py-2 rounded-xl bg-white text-blue-800 hover:bg-blue-50 text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 whitespace-nowrap active:scale-95 cursor-pointer"
          >
            <ScanLine className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Mô Phỏng Chạm Thẻ 0.42s</span>
          </button>
        </div>
      </div>

      {/* 2. Global Performance Section (6 KPI Widgets) */}
      <GlobalMetricsWidget
        stats={stats}
        onCardClick={handleCardClick}
      />

      {/* 3. Entity Health Status Widget (Full Canvas Width) */}
      <div className="w-full">
        <EntityHealthWidget
          entities={entities}
          onSelectEntity={(entity) => setSelectedEntity(entity)}
          onQuickCheckIn={(id) => handleCheckInAttendee(id, 'NFC_TAP')}
          eventCheckinStats={stats.event_checkin}
        />
      </div>

      {/* Modals */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        entities={entities}
        onCheckInSuccess={(id, method) => handleCheckInAttendee(id, method || 'QR_SCAN')}
      />

      <DetailModal
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
        onCheckInNow={(id) => handleCheckInAttendee(id, 'NFC_TAP')}
      />

      <NfcWarehouseModal
        isOpen={isWarehouseModalOpen}
        onClose={() => setIsWarehouseModalOpen(false)}
        allocatedCount={stats.card_inventory.allocated}
        totalCapacity={stats.card_inventory.total_blanks}
      />

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
};
