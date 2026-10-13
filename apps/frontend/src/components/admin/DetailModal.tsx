'use client';

import React from 'react';
import { EntityRecord } from './types';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Building2, 
  Printer,
  Sparkles
} from 'lucide-react';

interface DetailModalProps {
  entity: EntityRecord | null;
  onClose: () => void;
  onCheckInNow?: (id: string) => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  entity,
  onClose,
  onCheckInNow,
}) => {
  if (!entity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <CreditCard className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Hồ Sơ Doanh Nhân Số 3D & Pre-CRM
              </h3>
              <p className="text-[11px] text-slate-500">
                Định danh giao thương B2B · One Connect Network
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Virtual 3D Smart Card Mockup */}
          <div className="relative rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 p-5 text-white shadow-xl border border-slate-700/60 overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] tracking-widest uppercase font-mono text-blue-400">
                  ONE CONNECT · SMART CARD
                </span>
                <div className="text-xs font-semibold text-slate-300">
                  Obsidian Black Metal · TRL-7
                </div>
              </div>
              <div className="w-7 h-7 rounded-full border border-blue-400/40 flex items-center justify-center bg-blue-500/10 text-blue-300">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1 mb-6">
              <h4 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {entity.full_name}
                {entity.vneid_verified && (
                  <span title="Đã xác thực CCCD/VNeID Đề án 06">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </span>
                )}
              </h4>
              <p className="text-xs text-blue-200/90 font-medium">
                {entity.title || 'Đại biểu Hội viên'}
              </p>
              <p className="text-xs text-slate-400">
                {entity.company_name}
              </p>
            </div>

            <div className="flex justify-between items-end border-t border-slate-800/80 pt-3 text-[11px] font-mono text-slate-400">
              <div>
                <span className="text-[9px] text-slate-400 block uppercase">NFC Hardware UID</span>
                {entity.card_uid || 'Chưa liên kết thẻ'}
              </div>
              <div className="text-right">
                <span className="text-[9px] text-slate-400 block uppercase">Phân Hạng</span>
                <span className="text-amber-400 font-bold">{entity.tier}</span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] font-medium block">MÃ SỐ THUẾ</span>
              <span className="font-bold text-slate-800 font-mono">{entity.tax_id || 'Chưa cập nhật'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] font-medium block">TIẾN ĐỘ CHECK-IN</span>
              <span className="font-bold text-blue-600">{entity.status_label}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] font-medium block">GIÁ TRỊ DEAL DỰ KIẾN</span>
              <span className="font-bold text-rose-600">{entity.deal_pipeline || '0 VNĐ'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 text-[10px] font-medium block">ĐỘ GẮN KẾT MẠNG LƯỚI</span>
              <span className="font-bold text-emerald-600">{entity.connection_score}% / 100%</span>
            </div>
          </div>

          {/* Extended Mind / Pre-CRM Notes */}
          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs">
            <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Bối cảnh kết nối (Pre-CRM Context)
            </div>
            <p className="text-blue-800/80 leading-relaxed text-[11px]">
              Sự kiện tham gia: {entity.event_name || 'Hội nghị MICE Khánh Hòa'}. Giao thức 2-Way Consent bảo mật thông tin liên hệ tuân thủ Luật PDPL 91/2025/QH15.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => alert(`Lệnh in thẻ đeo NFC cho ${entity.full_name} đã sẵn sàng.`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            In Thẻ Đeo VIP
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Đóng
            </button>
            {entity.status === 'PENDING_TAP' && onCheckInNow && (
              <button
                onClick={() => {
                  onCheckInNow(entity.id);
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                Chạm Quét Thẻ Điểm Danh
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
