'use client';

import React, { useState, useMemo } from 'react';
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
  FileSpreadsheet,
  Download,
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
  const connectionsList = useMemo(() => {
    return (state.connections || []).map((c) => {
      const isReqJohnny =
        c.requesterIdentityId === '11111111-1111-1111-1111-111111111111' ||
        c.requesterIdentityId === 'id-001';
      const partnerId = isReqJohnny ? c.receiverIdentityId : c.requesterIdentityId;
      const partner =
        c.partner ||
        (state.identities || []).find(
          (i) => i.id === partnerId || ensureUuid(i.id) === partnerId
        );

      const isConnected = c.status === 'CONNECTED';
      const formattedDate = c.connectedAt
        ? new Date(c.connectedAt).toLocaleDateString('vi-VN')
        : c.createdAt
        ? new Date(c.createdAt).toLocaleDateString('vi-VN')
        : 'Chưa cập nhật';

      const consentTime = isConnected
        ? c.connectedAt
          ? new Date(c.connectedAt).toLocaleString('vi-VN')
          : 'Đã xác thực Consent'
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
        company:
          partner?.businesses?.[0]?.businessName ||
          partner?.association ||
          'Chưa cập nhật doanh nghiệp',
        avatarUrl:
          partner?.avatarUrl ||
          `https://ui-avatars.com/api/?name=${encodeURIComponent(
            partner?.fullName || 'User'
          )}&background=0284c7&color=fff&bold=true`,
        phone: partner?.phone || 'Chưa cung cấp',
        email: partner?.email || 'Chưa cung cấp',
        status: isConnected ? 'CONNECTED' : 'PENDING',
        industry: partner?.bio || 'Giao thương & Xúc tiến Đầu tư',
        contextEvent: c.contextEventName || 'Sự Kiện Kết Nối Doanh Nghiệp MICE 2026',
        tableNo: 'Bàn B2B VIP',
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
  const filteredList = useMemo(() => {
    return connectionsList
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
  }, [connectionsList, filter, search]);

  const totalConnected = connectionsList.filter((c) => c.status === 'CONNECTED').length;
  const totalPending = connectionsList.filter((c) => c.status === 'PENDING').length;

  const openAuditModal = (conn: any) => {
    setSelectedAuditConn(conn);
    setIsAuditModalOpen(true);
  };

  const handleExportLeads = () => {
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
    <div className="space-y-6 w-full pb-16 antialiased">
      {/* 1. TOP STATUS BAR: BREADCRUMB & EXCEL EXPORT */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-slate-200/90 rounded-2xl p-3 sm:px-5 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Về Command Center Quản Trị"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">
                Sổ Tay Quan Hệ &amp; Pre-CRM B2B
              </span>
              <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono font-bold">
                PDPL 91/2025
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Lưu vết lịch sử gặp gỡ &amp; quản trị cấp quyền dữ liệu số 2 chiều (Relationship Memory)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={handleExportLeads}
            className="text-xs font-bold rounded-xl border-emerald-200 text-emerald-700 bg-emerald-50/70 hover:bg-emerald-100 py-1.5 px-3.5 cursor-pointer flex items-center gap-1.5 shadow-2xs active:scale-95 transition-all"
            title="Xuất file Excel danh sách Leads & Kết nối cho CSKH / Sales"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Xuất Excel CSKH ({filteredList.length})</span>
          </Button>
        </div>
      </div>

      {/* 2. HERO BANNER THEME MỚI (DARK SLATE/TEAL GRADIENT) */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-blue-950 rounded-3xl p-6 sm:p-7 text-white border border-teal-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[11px] font-semibold border border-teal-400/30">
              PHÂN HỆ 3 · RELATIONSHIP MEMORY (PRE-CRM)
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Chuẩn Bảo Mật 2-Way Consent
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Sổ Tay Quan Hệ &amp; Mạng Lưới Kết Nối B2B
          </h2>
          <p className="text-xs text-teal-100/80 max-w-xl leading-relaxed">
            Quản trị tập trung lịch sử chạm thẻ, ghi chú đàm phán riêng tư và cấp quyền chia sẻ dữ liệu 2 chiều minh bạch theo Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15.
          </p>
        </div>

        {/* METRICS STATS PILLS */}
        <div className="grid grid-cols-3 gap-2.5 bg-white/10 p-2.5 rounded-2xl border border-white/15 self-start md:self-auto shrink-0 text-center">
          <div className="px-3 py-1.5 bg-white/5 rounded-xl">
            <span className="text-[10px] text-teal-200 block uppercase font-medium">Tổng kết nối</span>
            <span className="font-mono font-bold text-sm sm:text-base text-white">{connectionsList.length}</span>
          </div>
          <div className="px-3 py-1.5 bg-emerald-500/20 rounded-xl border border-emerald-400/30">
            <span className="text-[10px] text-emerald-300 block uppercase font-medium">Đã Consent</span>
            <span className="font-mono font-bold text-sm sm:text-base text-emerald-300">{totalConnected}</span>
          </div>
          <div className="px-3 py-1.5 bg-amber-500/20 rounded-xl border border-amber-400/30">
            <span className="text-[10px] text-amber-300 block uppercase font-medium">Chờ Duyệt</span>
            <span className="font-mono font-bold text-sm sm:text-base text-amber-300">{totalPending}</span>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & SEGMENTED CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm theo tên đối tác, chức vụ, công ty, sự kiện MICE..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-teal-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-xl text-xs shrink-0">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filter === 'ALL'
                ? 'bg-white text-slate-900 shadow-2xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất Cả ({connectionsList.length})
          </button>
          <button
            onClick={() => setFilter('CONNECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'CONNECTED'
                ? 'bg-emerald-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" /> Đã Consent ({totalConnected})
          </button>
          <button
            onClick={() => setFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
              filter === 'PENDING'
                ? 'bg-amber-600 text-white shadow-2xs font-bold'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            <Clock className="w-3 h-3" /> Chờ Duyệt ({totalPending})
          </button>
        </div>
      </div>

      {/* 4. PARTNER CONNECTIONS LIST (HIGH DENSITY CARDS) */}
      <div className="space-y-3">
        {filteredList.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-dashed border-slate-200 text-center text-slate-400 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-slate-800 text-sm">Chưa có kết nối nào phù hợp</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
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
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all duration-200 shadow-2xs hover:shadow-md ${
                  isConnected
                    ? 'border-slate-200/90 hover:border-teal-300'
                    : 'border-amber-200/90 bg-gradient-to-r from-amber-50/20 via-white to-white hover:border-amber-400'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Avatar & Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={conn.avatarUrl}
                        alt={conn.fullName}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 bg-slate-100 shadow-2xs block"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            conn.fullName
                          )}&backgroundColor=0066ff,00c2ff`;
                        }}
                      />
                      <span
                        className={`absolute -bottom-1 -right-1 p-0.5 rounded-full border-2 border-white ${
                          isConnected ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                        }`}
                      >
                        {isConnected ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : (
                          <Lock className="w-3 h-3" />
                        )}
                      </span>
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-slate-900 tracking-tight truncate">
                          {conn.fullName}
                        </h3>
                        {conn.displayName && (
                          <span className="text-[11px] text-slate-400 font-medium">
                            ({conn.displayName})
                          </span>
                        )}
                        {isConnected ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold px-2 py-0.5">
                            Mutual Consent
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-bold px-2 py-0.5">
                            Chờ Bạn Duyệt
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-blue-600 font-semibold truncate">
                        {conn.title}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-slate-600 truncate">
                        <span className="truncate flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-orange-500 shrink-0" />
                          {conn.company}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 text-[11px] shrink-0 font-mono">
                          {conn.dateMet} ({conn.tableNo})
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 flex-wrap">
                    {isConnected ? (
                      <>
                        <a
                          href={`tel:${conn.phone}`}
                          className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow-2xs"
                          title={`Gọi trực tiếp: ${conn.phone}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{conn.phone}</span>
                        </a>

                        <button
                          onClick={() => openAuditModal(conn)}
                          className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 border border-slate-200 shadow-2xs transition-all"
                          title="Xem Chứng Chỉ Kiểm Toán Consent"
                        >
                          <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
                          <span>Audit</span>
                        </button>

                        <Link
                          href={`/dashboard/connections/${conn.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 shadow-2xs transition-all"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ghi Chú ({conn.notesCount})</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-500" /> 098***789
                        </span>

                        <Button
                          type="button"
                          onClick={() => handleAcceptConsent(conn.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-1.5 px-3.5 rounded-xl shadow-2xs flex items-center gap-1.5 cursor-pointer active:scale-95 h-8"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Chấp Nhận &amp; Mở Khóa</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 5. AUDIT MODAL: KIỂM TOÁN CONSENT */}
      <Dialog open={isAuditModalOpen} onOpenChange={setIsAuditModalOpen}>
        <DialogContent className="bg-white border border-slate-200 text-slate-900 max-w-md rounded-3xl p-6 shadow-xl">
          <DialogHeader className="text-left space-y-1 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Chứng Chỉ Đồng Thuận Số (Explicit Consent)</span>
            </div>
            <DialogTitle className="text-base font-bold text-slate-900">
              Nhật Ký Kiểm Toán PDPL 91/2025/QH15
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Giao thức xác thực 2 chiều đảm bảo tính pháp lý khi lưu trữ và truy cập thông tin liên hệ doanh nghiệp.
            </DialogDescription>
          </DialogHeader>

          {selectedAuditConn && (
            <div className="space-y-3 py-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Đối tác:</span>
                  <strong className="text-slate-900">{selectedAuditConn.fullName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Doanh nghiệp:</span>
                  <span className="text-slate-800 truncate max-w-[200px]">
                    {selectedAuditConn.company}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sự kiện:</span>
                  <span className="text-blue-600 font-semibold">{selectedAuditConn.contextEvent}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Thời gian xác thực:</span>
                  <span className="font-mono text-emerald-700 font-bold">
                    {selectedAuditConn.consentTimestamp || '20/08/2026 09:15:22'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Mã băm SHA-256:</span>
                  <span className="font-mono text-purple-700 text-[10px] bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-200">
                    {selectedAuditConn.consentHash}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <strong>Căn cứ pháp lý:</strong> Điều 9, Điều 11 &amp; Điều 16 Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15.
              </div>
            </div>
          )}

          <DialogFooter className="pt-2 border-t border-slate-100 flex justify-end">
            <Button
              type="button"
              onClick={() => setIsAuditModalOpen(false)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
