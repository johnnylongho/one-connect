'use client';

import React from 'react';
import { 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  AlertCircle, 
  X, 
  CreditCard 
} from 'lucide-react';
import { ToastItem } from './types';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
  onViewProfile?: (entityId: string) => void;
  onClearAll?: () => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
  onViewProfile,
  onClearAll,
}) => {
  if (toasts.length === 0) return null;

  const getIcon = (type: ToastItem['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none select-none"
      aria-live="polite"
    >
      {toasts.length > 2 && (
        <div className="flex justify-end pointer-events-auto">
          <button
            onClick={onClearAll}
            className="text-[11px] font-semibold text-slate-400 hover:text-white bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-slate-700/80 transition-colors shadow-sm cursor-pointer"
          >
            Đóng tất cả ({toasts.length})
          </button>
        </div>
      )}

      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-slate-700/80 flex items-start gap-3 transition-all duration-300 animate-in slide-in-from-bottom-3 fade-in"
        >
          <div className="mt-0.5">
            {getIcon(toast.type)}
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white tracking-tight truncate">
                {toast.title || 'Thông báo hệ thống'}
              </span>

              {toast.count > 1 && (
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-black bg-blue-500/30 text-blue-300 border border-blue-400/40 rounded-full">
                  ×{toast.count}
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed break-words">
              {toast.message}
            </p>

            {(toast.entityId || toast.onAction) && (
              <div className="pt-1.5 flex items-center gap-2">
                {toast.entityId && onViewProfile && (
                  <button
                    onClick={() => onViewProfile(toast.entityId!)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/90 hover:bg-blue-600 text-white text-[11px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <CreditCard className="w-3 h-3 text-blue-200" />
                    <span>Xem Hồ Sơ 3D</span>
                  </button>
                )}

                {toast.onAction && toast.actionLabel && (
                  <button
                    onClick={toast.onAction}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    <span>{toast.actionLabel}</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            title="Đóng thông báo"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
