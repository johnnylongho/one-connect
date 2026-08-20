'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  Users,
  UserCheck,
  ShieldCheck,
  Clock,
  FileText,
  CheckCircle2,
  Search,
  ArrowLeft,
  Building2,
  Lock,
  Phone,
  Calendar,
  Sparkles,
  Award,
  FileCheck2,
  X,
  ChevronRight,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

// Standard B2B Mock Data with Rich Business Context & PDPL Consent Details
const INITIAL_DEMO_CONNECTIONS = [
  {
    id: 'conn-demo-01',
    partnerId: 'id-demo-01',
    fullName: 'Nguyễn Văn Hùng',
    displayName: 'Hùng Nguyễn VIP',
    title: 'Chủ Tịch HĐQT & Tổng Giám Đốc',
    company: 'Tập đoàn Khách sạn & Du lịch MICE Nha Trang Pearl',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '0905.123.456',
    email: 'hung.nguyen@nhatrangpearl.vn',
    status: 'CONNECTED',
    industry: 'Du Lịch & Khách Sạn MICE',
    contextEvent: 'Diễn Đàn Doanh Nhân Trẻ Khánh Hòa 2026',
    tableNo: 'Bàn VIP A12',
    dateMet: '20/08/2026',
    consentTimestamp: '20/08/2026 09:15:22',
    consentHash: 'SHA256:8F92...B41E',
    notesCount: 3,
    leadTier: 'HOT',
  },
  {
    id: 'conn-demo-02',
    partnerId: 'id-demo-02',
    fullName: 'Trần Thị Mai Anh',
    displayName: 'Mai Anh CEO',
    title: 'Giám Đốc Điều Hành (CEO)',
    company: 'Công ty CP Công Nghệ Xanh & Năng Lượng Biển Nam Trung Bộ',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    phone: '0918.777.888',
    email: 'maianh.tran@greentech-ntb.com',
    status: 'CONNECTED',
    industry: 'Năng Lượng Tái Tạo & IoT',
    contextEvent: 'TECHFEST Khánh Hòa — Diễn Đàn ĐMST',
    tableNo: 'Bàn Đàm Phán B04',
    dateMet: '19/08/2026',
    consentTimestamp: '19/08/2026 14:40:10',
    consentHash: 'SHA256:3A71...C92D',
    notesCount: 2,
    leadTier: 'HOT',
  },
  {
    id: 'conn-demo-03',
    partnerId: 'id-demo-03',
    fullName: 'Lê Hoàng Nam',
    displayName: 'Nam Cam Ranh Port',
    title: 'Phó Tổng Giám Đốc Phụ Trách Chuỗi Cung Ứng',
    company: 'Tổng Công ty Cảng Biển & Logistics Quốc Tế Cam Ranh',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '0988.333.222',
    email: 'nam.le@camranhport.com.vn',
    status: 'PENDING',
    industry: 'Logistics & Cảng Biển',
    contextEvent: 'Hội Nghị Xúc Tiến Thương Mại Biển 2026',
    tableNo: 'Bàn A02',
    dateMet: '20/08/2026',
    consentTimestamp: null,
    consentHash: 'PENDING_EXPLICIT_CONSENT',
    notesCount: 1,
    leadTier: 'WARM',
  },
  {
    id: 'conn-demo-04',
    partnerId: 'id-demo-04',
    fullName: 'Đặng Quốc Huy',
    displayName: 'Huy Finance',
    title: 'Giám Đốc Quỹ Đầu Tư (Venture Partner)',
    company: 'Quỹ Đổi Mới Sáng Tạo Nam Trung Bộ Capital',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '0977.654.321',
    email: 'huy.dang@ntbcapital.vn',
    status: 'PENDING',
    industry: 'Đầu Tư Mạo Hiểm & Tài Chính',
    contextEvent: 'Diễn Đàn Gọi Vốn Khởi Nghiệp Khánh Hòa 2026',
    tableNo: 'Bàn VIP 01',
    dateMet: '20/08/2026',
    consentTimestamp: null,
    consentHash: 'PENDING_EXPLICIT_CONSENT',
    notesCount: 0,
    leadTier: 'HOT',
  },
  {
    id: 'conn-demo-05',
    partnerId: 'id-demo-05',
    fullName: 'Phạm Minh Tuấn',
    displayName: 'Tuấn Bất Động Sản',
    title: 'Tổng Giám Đốc',
    company: 'Công ty CP Đầu Tư & Phát Triển Đô Thị Biển Khánh Hòa',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    phone: '0903.999.888',
    email: 'tuan.pm@khanhhoaurban.vn',
    status: 'CONNECTED',
    industry: 'Bất Động Sản Nghỉ Dưỡng',
    contextEvent: 'Đại Hội Hiệp Hội Doanh Nghiệp Tỉnh Khánh Hòa',
    tableNo: 'Bàn VIP C01',
    dateMet: '15/08/2026',
    consentTimestamp: '15/08/2026 10:11:45',
    consentHash: 'SHA256:1C88...F73A',
    notesCount: 4,
    leadTier: 'WARM',
  },
];

export default function MyConnectionsPage() {
  const [filter, setFilter] = useState<'ALL' | 'CONNECTED' | 'PENDING'>('ALL');
  const [search, setSearch] = useState('');
  const [connectionsList, setConnectionsList] = useState(INITIAL_DEMO_CONNECTIONS);
  const [selectedAuditConn, setSelectedAuditConn] = useState<any>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Accept Consent handler
  const handleAcceptConsent = (id: string) => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString('vi-VN')} ${now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    setConnectionsList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: 'CONNECTED',
              consentTimestamp: formatted,
              consentHash: 'SHA256:' + Math.random().toString(16).substring(2, 6).toUpperCase() + '...MUTUAL_CONSENT',
            }
          : c
      )
    );
  };

  // Filter connections by status and search query
  const filteredList = connectionsList
    .filter((c) => {
      if (filter === 'CONNECTED') return c.status === 'CONNECTED';
      if (filter === 'PENDING') return c.status === 'PENDING';
      return true;
    })
    .filter((c) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        c.fullName.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.contextEvent.toLowerCase().includes(q)
      );
    });

  const totalConnected = connectionsList.filter((c) => c.status === 'CONNECTED').length;
  const totalPending = connectionsList.filter((c) => c.status === 'PENDING').length;

  const openAuditModal = (conn: any) => {
    setSelectedAuditConn(conn);
    setIsAuditModalOpen(true);
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto pb-12 antialiased">
      
      {/* 1. COMPACT EXECUTIVE HERO BANNER */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-blue-50/20 to-slate-50 border border-slate-200/90 p-4 sm:p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left Title & Breadcrumb */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 transition-all"
                title="Quay lại Dashboard"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </Link>
              <div className="p-1.5 rounded-lg bg-blue-50 text-[#0066FF] border border-blue-100">
                <Users className="w-4 h-4" />
              </div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight font-heading">
                Mạng Lưới B2B & Quản Trị Consent
              </h1>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-300 text-[10px] font-bold px-2 py-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-600 mr-1" /> PDPL 91/2025
              </Badge>
            </div>
            <p className="text-xs text-slate-500 pl-8">
              Lưu vết lịch sử gặp gỡ & Quản lý cấp quyền dữ liệu số 2 chiều (Pre-CRM Engine)
            </p>
          </div>

          {/* Right Metrics Cluster (Compact) */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Tổng</span>
              <strong className="text-sm font-black text-slate-900 font-mono">{connectionsList.length}</strong>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-200 shadow-2xs text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Mutual</span>
              <strong className="text-sm font-black text-emerald-700 font-mono">{totalConnected}</strong>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200 shadow-2xs text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Chờ Duyệt</span>
              <strong className="text-sm font-black text-amber-700 font-mono">{totalPending}</strong>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SEARCH & SEGMENTED CONTROLS */}
      <section className="p-2.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo tên đối tác, chức danh, công ty, sự kiện MICE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0066FF] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-white text-[#0066FF] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất Cả ({connectionsList.length})
          </button>
          <button
            onClick={() => setFilter('CONNECTED')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'CONNECTED'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" /> Đã Consent ({totalConnected})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'PENDING'
                ? 'bg-[#FF6B00] text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3 h-3" /> Chờ Duyệt ({totalPending})
          </button>
        </div>
      </section>

      {/* 3. PARTNER CONNECTIONS LIST (COMPACT HIGH DENSITY) */}
      <section className="space-y-2.5">
        {filteredList.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-400 space-y-2 shadow-2xs">
            <Users className="w-8 h-8 mx-auto text-slate-300" />
            <div className="font-bold text-slate-700 text-xs">Không tìm thấy kết nối phù hợp</div>
          </div>
        ) : (
          filteredList.map((conn) => {
            const isConnected = conn.status === 'CONNECTED';

            return (
              <div
                key={conn.id}
                className={`p-3.5 sm:p-4 rounded-xl bg-white border transition-all duration-150 shadow-2xs hover:shadow-xs ${
                  isConnected
                    ? 'border-slate-200/90 hover:border-blue-300'
                    : 'border-amber-200 bg-gradient-to-r from-amber-50/15 via-white to-white hover:border-amber-400'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={conn.avatarUrl}
                        alt={conn.fullName}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-slate-100 block"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(conn.fullName)}&backgroundColor=0066ff,00c2ff`;
                        }}
                      />
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 p-0.5 rounded-full border border-white ${
                          isConnected ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                        }`}
                      >
                        {isConnected ? <ShieldCheck className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                      </span>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-xs sm:text-sm text-slate-900 tracking-tight truncate">
                          {conn.fullName}
                        </h3>
                        {conn.displayName && (
                          <span className="text-[10.5px] text-slate-500">
                            ({conn.displayName})
                          </span>
                        )}
                        {isConnected ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-bold px-1.5 py-0.2">
                            Mutual Consent
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[9px] font-bold px-1.5 py-0.2">
                            Chờ Bạn Duyệt
                          </Badge>
                        )}
                      </div>

                      <p className="text-[11.5px] text-[#0066FF] font-semibold truncate">
                        {conn.title}
                      </p>

                      <div className="flex items-center gap-2 text-[11px] text-slate-600 truncate">
                        <span className="truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-[#FF6B00] shrink-0" />
                          {conn.company}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 shrink-0">
                          {conn.dateMet} ({conn.tableNo})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {isConnected ? (
                      <>
                        <a
                          href={`tel:${conn.phone}`}
                          className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0066FF] text-[11px] font-bold flex items-center gap-1 active:scale-95"
                          title={`Gọi: ${conn.phone}`}
                        >
                          <Phone className="w-3 h-3" />
                          <span>{conn.phone}</span>
                        </a>

                        <button
                          onClick={() => openAuditModal(conn)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 border border-slate-200"
                          title="Xem Chứng Chỉ Consent"
                        >
                          <FileCheck2 className="w-3 h-3 text-purple-600" />
                          <span>Audit</span>
                        </button>

                        <Link
                          href={`/dashboard/connections/${conn.id}`}
                          className="px-2.5 py-1.5 rounded-lg bg-[#0066FF] hover:bg-blue-700 text-white text-[11px] font-bold flex items-center gap-1 active:scale-95 shadow-2xs"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Ghi Chú ({conn.notesCount})</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5 text-amber-500" /> 098***789
                        </span>

                        <Button
                          type="button"
                          onClick={() => handleAcceptConsent(conn.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1 px-3 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer active:scale-95 h-7"
                        >
                          <UserCheck className="w-3 h-3" />
                          <span>Chấp Nhận & Mở Khóa</span>
                        </Button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            );
          })
        )}
      </section>

      {/* 4. AUDIT MODAL */}
      <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
        <DialogContent className="bg-white border border-slate-200 text-slate-900 max-w-md rounded-2xl p-5 shadow-xl">
          <DialogHeader className="text-left space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Chứng Chỉ Đồng Thuận Số (Explicit Consent)</span>
            </div>
            <DialogTitle className="text-base font-black text-slate-900">
              Nhật Ký Kiểm Toán PDPL 91/2025/QH15
            </DialogTitle>
          </DialogHeader>

          {selectedAuditConn && (
            <div className="space-y-2 py-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Đối tác:</span>
                  <strong className="text-slate-900">{selectedAuditConn.fullName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Doanh nghiệp:</span>
                  <span className="text-slate-800 truncate max-w-[200px]">{selectedAuditConn.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sự kiện:</span>
                  <span className="text-[#0066FF]">{selectedAuditConn.contextEvent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thời gian:</span>
                  <span className="font-mono text-emerald-700 font-bold">{selectedAuditConn.consentTimestamp || '20/08/2026 09:15:22'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mã băm:</span>
                  <span className="font-mono text-purple-700 text-[9px] bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200">
                    {selectedAuditConn.consentHash}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-200 text-[10.5px] text-blue-900 leading-snug">
                ⚖️ <strong>Căn cứ:</strong> Điều 9, Điều 11 & Điều 16 Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15.
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-slate-100 flex justify-end">
            <Button
              type="button"
              onClick={() => setIsAuditModalOpen(false)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg cursor-pointer h-8"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
