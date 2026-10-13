'use client';

import React from 'react';
import { X, CreditCard, ShieldCheck } from 'lucide-react';

interface NfcWarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  allocatedCount?: number;
  totalCapacity?: number;
}

export const NfcWarehouseModal: React.FC<NfcWarehouseModalProps> = ({ 
  isOpen, 
  onClose,
  allocatedCount = 0,
  totalCapacity = 1500,
}) => {
  if (!isOpen) return null;

  const materials = [
    { 
      name: 'Obsidian Black Metal', 
      count: 480, 
      allocated: Math.min(480, Math.round(allocatedCount * 0.35)), 
      chip: 'NTAG216 (888 bytes)', 
      color: 'from-zinc-900 to-black', 
      border: 'border-zinc-700' 
    },
    { 
      name: 'Royal Gold Brass', 
      count: 320, 
      allocated: Math.min(320, Math.round(allocatedCount * 0.25)), 
      chip: 'NTAG216 (888 bytes)', 
      color: 'from-amber-900/80 to-amber-950', 
      border: 'border-amber-600' 
    },
    { 
      name: 'Matte Platinum Silver', 
      count: 400, 
      allocated: Math.min(400, Math.round(allocatedCount * 0.25)), 
      chip: 'NTAG215 (504 bytes)', 
      color: 'from-slate-700 to-slate-900', 
      border: 'border-slate-500' 
    },
    { 
      name: 'Eco Polymer Card', 
      count: 300, 
      allocated: Math.min(300, Math.round(allocatedCount * 0.15)), 
      chip: 'NTAG213 (144 bytes)', 
      color: 'from-emerald-950 to-slate-900', 
      border: 'border-emerald-600' 
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <CreditCard className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Quản Trị Kho 1.500 Phôi Thẻ NFC Vật Lý (TRL-7)
              </h3>
              <p className="text-[11px] text-slate-500">
                Đợt 1 Thí điểm Hội nghị Doanh nhân Trẻ Khánh Hòa 2026
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

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {materials.map((m) => {
              const remaining = Math.max(0, m.count - m.allocated);
              return (
                <div 
                  key={m.name}
                  className={`rounded-xl p-4 bg-gradient-to-br ${m.color} text-white border ${m.border} shadow-sm relative overflow-hidden`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-bold text-slate-100">{m.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 font-mono">
                      {m.chip}
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Dung lượng kho:</span>
                      <span className="font-bold text-white tabular-nums">{m.count} phôi</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Đã cấp phát:</span>
                      <span className="font-bold text-blue-300 tabular-nums">{m.allocated} phôi</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Còn lại:</span>
                      <span className="font-bold text-amber-300 tabular-nums">{remaining} phôi</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200/60 rounded-xl text-xs text-blue-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Tính năng Card Continuity:</span> Khi thay đổi thẻ vật lý hoặc đổi chức danh/công ty, 100% dữ liệu quan hệ B2B và đồ thị kết nối (Relationship Graph) được bảo toàn nguyên vẹn trên Supabase.
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
          >
            Đóng Kho Thẻ
          </button>
        </div>
      </div>
    </div>
  );
};
