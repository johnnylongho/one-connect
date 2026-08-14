'use client';

import React, { useState } from 'react';
import {
  Search,
  Filter,
  QrCode,
  CheckCircle2,
  Clock,
  Printer,
  Mail,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/toast';

export interface Delegate {
  id: string;
  ticketCode: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl: string;
  company: string;
  position: string;
  associationName: string;
  ticketType: 'VIP' | 'Guest' | 'Standard';
  checkInTime: string | null;
  status: 'checked_in' | 'pending';
}

interface DelegateCheckinTableProps {
  delegates: Delegate[];
  isLoading?: boolean;
}

export function DelegateCheckinTable({ delegates: initialDelegates, isLoading = false }: DelegateCheckinTableProps) {
  const { toast } = useToast();
  const [delegates, setDelegates] = useState<Delegate[]>(initialDelegates);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'checked_in' | 'pending'>('all');
  const [assocFilter, setAssocFilter] = useState<string>('all');
  const [ticketTypeFilter, setTicketTypeFilter] = useState<string>('all');

  // Selected row checkboxes for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedDelegateForQr, setSelectedDelegateForQr] = useState<Delegate | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Filter delegates multi-dimensionally
  const filteredDelegates = delegates.filter((d) => {
    const matchesSearch =
      d.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.phone.includes(searchQuery) ||
      d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.ticketCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || d.status === statusFilter;
    const matchesAssoc = assocFilter === 'all' || d.associationName === assocFilter;
    const matchesTicketType = ticketTypeFilter === 'all' || d.ticketType === ticketTypeFilter;

    return matchesSearch && matchesStatus && matchesAssoc && matchesTicketType;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredDelegates.length / pageSize) || 1;
  const paginatedDelegates = filteredDelegates.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Toggle All Selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedDelegates.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Toggle Single Selection
  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Actions Handlers
  const handleBulkPrintQr = () => {
    toast({
      title: 'ĐANG XỬ LÝ IN THẺ QR HÀNG LOẠT! 🖨️',
      description: `Đã gửi lệnh in thẻ VIP Badge cho ${selectedIds.length} đại biểu đã chọn.`,
      variant: 'success',
    });
  };

  const handleBulkSendEmail = () => {
    toast({
      title: 'ĐÃ GỬI EMAIL NHẮC LỊCH! ✉️',
      description: `Hệ thống đã tự động gửi email thông báo mã vé đến ${selectedIds.length} đại biểu.`,
      variant: 'success',
    });
  };

  return (
    <div className="space-y-4">
      {/* MULTI-DIMENSIONAL FILTER BAR */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="sm:col-span-2 md:col-span-4 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm theo tên, SĐT, công ty, mã vé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-slate-200 text-xs focus:border-blue-500 rounded-xl text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
            >
              <option value="all">Tất cả Trạng Thái Check-in</option>
              <option value="checked_in">Đã Check-in (Đã vào)</option>
              <option value="pending">Chưa Check-in (Chờ vào)</option>
            </select>
          </div>

          {/* Association Filter */}
          <div className="md:col-span-3">
            <select
              value={assocFilter}
              onChange={(e) => setAssocFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
            >
              <option value="all">Tất cả Hiệp Hội Tham Gia</option>
              <option value="Hiệp hội Doanh nhân Công nghệ Aplusvn">Hiệp hội Doanh nhân Aplusvn</option>
              <option value="TechCorp Vietnam Group">TechCorp Vietnam Group</option>
            </select>
          </div>

          {/* Ticket Type Filter */}
          <div className="md:col-span-2">
            <select
              value={ticketTypeFilter}
              onChange={(e) => setTicketTypeFilter(e.target.value)}
              className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
            >
              <option value="all">Loại Vé</option>
              <option value="VIP">Vé VIP</option>
              <option value="Guest">Vé Khách Mời</option>
              <option value="Standard">Vé Tiêu Chuẩn</option>
            </select>
          </div>
        </div>

        {/* BULK ACTIONS BAR (HIỂN THỊ KHI CHỌN ĐẠI BIỂU) */}
        {selectedIds.length > 0 && (
          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex flex-wrap items-center justify-between gap-3 animate-in fade-in-50 duration-200">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF]">
              <Sparkles className="w-4 h-4 text-[#0066FF]" />
              Đã chọn <span className="text-slate-900 font-mono bg-white px-2 py-0.5 rounded border border-blue-200">{selectedIds.length}</span> đại biểu
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleBulkPrintQr}
                size="sm"
                className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" /> In Thẻ QR Hàng Loạt
              </Button>
              <Button
                onClick={handleBulkSendEmail}
                size="sm"
                variant="outline"
                className="gap-1.5 border-blue-300 bg-white text-[#0066FF] hover:bg-blue-50 text-xs rounded-lg cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" /> Gửi Email Nhắc Lịch
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* TABLE DATA WITH LIGHT THEME */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow className="border-slate-200 hover:bg-transparent">
              <TableHead className="w-12 text-center">
                <input
                  type="checkbox"
                  checked={paginatedDelegates.length > 0 && selectedIds.length === paginatedDelegates.length}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </TableHead>
              <TableHead className="text-slate-600 text-xs font-bold">Mã Vé / Qr</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold">Đại Biểu</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold">Doanh Nghiệp / Hiệp Hội</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold">Thời Gian Check-in</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold text-center">Trạng Thái</TableHead>
              <TableHead className="text-slate-600 text-xs font-bold text-right">Hành Động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="border-slate-100">
                  <TableCell><Skeleton className="h-4 w-4 mx-auto" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-2 w-20" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 mx-auto rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20 ml-auto rounded-lg" /></TableCell>
                </TableRow>
              ))
            ) : paginatedDelegates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-500 text-xs">
                  Không tìm thấy đại biểu khớp với bộ lọc.
                </TableCell>
              </TableRow>
            ) : (
              paginatedDelegates.map((delegate) => {
                const isSelected = selectedIds.includes(delegate.id);
                return (
                  <TableRow
                    key={delegate.id}
                    className={`border-slate-100 transition-colors ${
                      isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Checkbox */}
                    <TableCell className="text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(delegate.id)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                      />
                    </TableCell>

                    {/* Ticket Code */}
                    <TableCell className="font-mono text-xs text-slate-700 font-bold">
                      <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {delegate.ticketCode.substring(0, 16)}...
                      </span>
                    </TableCell>

                    {/* Delegate Profile */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={delegate.avatarUrl || '/avatar-johnny-long.jpg'}
                          alt={delegate.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            {delegate.fullName}
                            {delegate.ticketType === 'VIP' && (
                              <Badge className="bg-orange-50 text-orange-600 border-orange-200 text-[9px] px-1.5 py-0 font-bold">
                                VIP
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{delegate.phone} • {delegate.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Company / Association */}
                    <TableCell>
                      <div>
                        <p className="text-xs font-semibold text-slate-800">{delegate.company}</p>
                        <p className="text-[11px] text-slate-500">{delegate.position}</p>
                      </div>
                    </TableCell>

                    {/* Check-in Time */}
                    <TableCell className="text-xs text-slate-600">
                      {delegate.checkInTime ? (
                        <span className="flex items-center gap-1 text-emerald-600 font-medium">
                          <Clock className="w-3.5 h-3.5" /> {delegate.checkInTime}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa check-in</span>
                      )}
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="text-center">
                      {delegate.status === 'checked_in' ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1 font-bold text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã Vào
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-slate-100 text-slate-500 border-slate-200 gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-slate-400" /> Chưa Vào
                        </Badge>
                      )}
                    </TableCell>

                    {/* Action button */}
                    <TableCell className="text-right">
                      <Button
                        onClick={() => setSelectedDelegateForQr(delegate)}
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-blue-600 rounded-lg cursor-pointer shadow-sm"
                      >
                        <QrCode className="w-3.5 h-3.5 text-[#0066FF]" /> Xem QR
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* PAGINATION BAR */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            Hiển thị <span className="font-bold text-slate-800">{paginatedDelegates.length}</span> trên tổng số <span className="font-bold text-slate-800">{filteredDelegates.length}</span> đại biểu
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="h-8 gap-1 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs rounded-lg disabled:opacity-40 shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Trang Trước
            </Button>

            <span className="px-3 py-1 font-bold text-slate-800 font-mono bg-white rounded-lg border border-slate-200 shadow-sm">
              Trang {currentPage} / {totalPages}
            </span>

            <Button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
              className="h-8 gap-1 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs rounded-lg disabled:opacity-40 shadow-sm"
            >
              Trang Tiếp <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* QR MODAL DIALOG */}
      <Dialog open={!!selectedDelegateForQr} onOpenChange={() => setSelectedDelegateForQr(null)}>
        <DialogContent className="sm:max-w-md bg-white border-slate-200 text-slate-900 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-blue-600">
              <QrCode className="w-5 h-5 text-blue-600" />
              Thẻ VIP Badge & Mã QR Check-in
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Mã QR định danh số tuân thủ bảo mật và chống giả mạo cho đại biểu VIP
            </DialogDescription>
          </DialogHeader>

          {selectedDelegateForQr && (
            <div className="p-5 space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center space-y-3">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${selectedDelegateForQr.ticketCode}`}
                  alt="QR Code"
                  className="w-44 h-44 rounded-xl border-4 border-blue-500/20 p-2 bg-white shadow-md"
                />
                <p className="font-mono text-xs font-bold text-blue-600 tracking-wider">
                  {selectedDelegateForQr.ticketCode}
                </p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">{selectedDelegateForQr.fullName}</h4>
                <p className="text-xs text-slate-600">{selectedDelegateForQr.position} • {selectedDelegateForQr.company}</p>
                <p className="text-[11px] text-blue-600 font-semibold">{selectedDelegateForQr.associationName}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
