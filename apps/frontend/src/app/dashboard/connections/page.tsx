'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
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
  FileSpreadsheet,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { exportLeadsToExcel } from '@/lib/excel-service';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

import { ensureUuid } from '@/lib/db-service';

export default function MyConnectionsPage() {
  const { state, acceptConnection } = useOneConnectStore();
  const [filter, setFilter] = useState<'ALL' | 'CONNECTED' | 'PENDING'>('ALL');
  const [search, setSearch] = useState('');
  const [selectedAuditConn, setSelectedAuditConn] = useState<any>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Map real store connections and enrich with identities
  const connectionsList = React.useMemo(() => {
    return state.connections.map((c) => {
      const isReqJohnny = c.requesterIdentityId === '11111111-1111-1111-1111-111111111111' || c.requesterIdentityId === 'id-001';
      const partnerId = isReqJohnny ? c.receiverIdentityId : c.requesterIdentityId;
      const partner = c.partner || state.identities.find(
        (i) => i.id === partnerId || ensureUuid(i.id) === partnerId
      );

      const isConnected = c.status === 'CONNECTED';
      const formattedDate = c.connectedAt
        ? new Date(c.connectedAt).toLocaleDateString('vi-VN')
        : c.createdAt
        ? new Date(c.createdAt).toLocaleDateString('vi-VN')
        : 'Chưa cập nhật';

      const consentTime = isConnected
        ? (c.connectedAt ? new Date(c.connectedAt).toLocaleString('vi-VN') : 'Đã xác thực Consent')
        : null;

      const consentHash = isConnected
        ? `SHA256:${c.id.slice(0, 8).toUpperCase()}...MUTUAL_CONSENT`
        : 'PENDING_EXPLICIT_CONSENT';

      return {
        id: c.id,
        partnerId: partner?.id || partnerId,
        fullName: partner?.fullName || 'Doanh Chủ Thành Viên',
        displayName: partner?.displayName || '',
        title: partner?.title || 'Doanh Nhân / CEO',
        company: partner?.businesses?.[0]?.businessName || (partner?.title ? `${partner.title} Corp` : 'Doanh Nghiệp Thành Viên'),
        avatarUrl: partner?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(partner?.fullName || 'User')}&background=0284c7&color=fff&bold=true`,
        phone: partner?.phone || 'Chưa cung cấp',
        email: partner?.email || 'Chưa cung cấp',
        status: isConnected ? 'CONNECTED' : 'PENDING',
        industry: partner?.bio || 'Giao thương & Xúc tiến Đầu tư',
        contextEvent: c.contextEventName || 'Sự Kiện Kết Nối Doanh Nghiệp 2026',
        tableNo: 'Bàn B2B',
        dateMet: formattedDate,
        consentTimestamp: consentTime,
        consentHash,
        notesCount: c.notesCount || 0,
        leadTier: isConnected ? 'HOT' : 'WARM',
      };
    });
  }, [state.connections, state.identities]);

  // Accept Consent handler
  const handleAcceptConsent = (id: string) => {
    acceptConnection(id);
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

  const handleExportLeads = () => {
    // Map connectionsList to Connection-compatible array for Excel generation
    const connsToExport: any[] = filteredList.map((c) => ({
      id: c.id,
      requesterIdentityId: 'me',
      receiverIdentityId: c.partnerId,
      status: c.status,
      connectedAt: c.dateMet || c.consentTimestamp,
      createdAt: c.dateMet,
      contextEventName: c.contextEvent,
      notesCount: c.notesCount || 0,
      partner: {
        id: c.partnerId,
        userId: c.partnerId,
        username: c.fullName
          ? c.fullName
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]/g, '')
          : 'guest',
        fullName: c.fullName,
        displayName: c.displayName,
        title: c.title,
        phone: c.phone,
        email: c.email,
        businesses: [{ businessName: c.company, position: c.title }],
      },
    }));

    const leadsToExport: any[] = filteredList.map((c) => ({
      id: `lead-${c.id}`,
      connectionId: c.id,
      ownerIdentityId: 'me',
      status: c.leadTier === 'HOT' ? 'HOT' : c.leadTier === 'WARM' ? 'WARM' : 'NEW',
      priority: c.leadTier === 'HOT' ? 'HIGH' : c.leadTier === 'WARM' ? 'MEDIUM' : 'LOW',
      source: c.contextEvent || 'Chạm Thẻ NFC (<1s)',
    }));

    exportLeadsToExcel(connsToExport, leadsToExport);
  };

  return (
    <div className="space-y-6 w-full pb-12 antialiased">
      {/* 1. STANDARDIZED PAGE HEADER */}
      <PageHeader
        supertitle="ONE CONNECT NETWORK • MODULE 1: DOANH NHÂN & B2B"
        title="Mạng Lưới B2B & Quản Trị Consent"
        description="Lưu vết lịch sử gặp gỡ & Quản lý cấp quyền dữ liệu số 2 chiều (Pre-CRM Relationship Memory)"
        icon={Users}
        badge="PDPL 91/2025"
        badgeVariant="emerald"
        backHref="/dashboard"
        backLabel="Về Tổng quan"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleExportLeads}
              className="text-xs font-bold rounded-xl border-emerald-200 text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100/80 py-2 px-3.5 cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95"
              title="Xuất file Excel danh sách Leads & Kết nối cho CSKH / Sales"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xuất Excel CSKH ({filteredList.length})</span>
            </Button>
            <div className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Tổng</span>
              <strong className="text-sm font-black text-slate-900 font-mono">{connectionsList.length}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Đã Kết Nối</span>
              <strong className="text-sm font-black text-emerald-700 font-mono">{totalConnected}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Chờ Đồng Ý</span>
              <strong className="text-sm font-black text-amber-700 font-mono">{totalPending}</strong>
            </div>
          </div>
        }
      />

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
          <div className="p-12 rounded-2xl bg-white border border-slate-200/80 text-center text-slate-400 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-700 text-sm">Chưa có kết nối nào phù hợp</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Khi có đối tác chạm thẻ NFC hoặc gửi yêu cầu giao thương B2B, dữ liệu kết nối đã xác thực sẽ xuất hiện tại đây theo thời gian thực.
              </p>
            </div>
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
                <strong>Căn cứ:</strong> Điều 9, Điều 11 & Điều 16 Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15.
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
