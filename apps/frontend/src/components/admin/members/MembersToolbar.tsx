'use client';

import React from 'react';
import { Search, Filter, Plus, FileSpreadsheet, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface MembersToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  cardStatusFilter: 'ALL' | 'HAS_CARD' | 'NO_CARD';
  onCardStatusFilterChange: (status: 'ALL' | 'HAS_CARD' | 'NO_CARD') => void;
  totalCount: number;
  filteredCount: number;
  onAddMember?: () => void;
  onExportExcel?: () => void;
}

export function MembersToolbar({
  searchTerm,
  onSearchChange,
  cardStatusFilter,
  onCardStatusFilterChange,
  totalCount,
  filteredCount,
  onAddMember,
  onExportExcel,
}: MembersToolbarProps) {
  return (
    <div className="sticky top-0 z-10 w-full bg-white/90 backdrop-blur-md border border-slate-200/90 rounded-2xl p-3 sm:p-4 shadow-sm space-y-3 transition-all">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input: chiếm không gian lớn, chuẩn chạm iPad min h-11 */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            type="text"
            placeholder="Tìm theo họ tên, số điện thoại, doanh nghiệp..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-10 h-11 sm:h-12 text-sm rounded-xl bg-slate-50 border-slate-200 focus:bg-white focus:border-[#0066FF] text-slate-900 placeholder:text-slate-400 font-sans shadow-2xs"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown & Badge Counter */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-44 sm:w-52">
            <Select
              value={cardStatusFilter}
              onChange={(e) =>
                onCardStatusFilterChange(
                  e.target.value as 'ALL' | 'HAS_CARD' | 'NO_CARD'
                )
              }
              className="h-11 sm:h-12 text-xs sm:text-sm font-bold bg-slate-50 border-slate-200 hover:bg-white"
            >
              <option value="ALL">Tất Cả Thẻ</option>
              <option value="HAS_CARD">🟢 Đã Nhận Thẻ NFC</option>
              <option value="NO_CARD">🟡 Chưa Nhận Thẻ</option>
            </Select>
          </div>

          <Badge className="h-11 sm:h-12 px-3.5 bg-slate-100 text-slate-800 border-slate-300/80 font-mono text-xs sm:text-sm font-bold rounded-xl flex items-center shrink-0">
            {filteredCount} / {totalCount}
          </Badge>
        </div>

        {/* Action Buttons for Volunteers / Admins */}
        <div className="flex items-center gap-2 shrink-0">
          {onExportExcel && (
            <Button
              type="button"
              variant="outline"
              onClick={onExportExcel}
              className="h-11 px-3.5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs gap-1.5 shrink-0"
              title="Xuất file Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline">Xuất Excel</span>
            </Button>
          )}

          {onAddMember && (
            <Button
              type="button"
              onClick={onAddMember}
              className="h-11 px-4 bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm rounded-xl gap-2 shadow-xs active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Thêm Hội Viên</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
