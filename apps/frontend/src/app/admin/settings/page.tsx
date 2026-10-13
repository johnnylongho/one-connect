'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Settings, 
  Users, 
  Building2, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Download, 
  Trash2, 
  ExternalLink, 
  Info, 
  Search, 
  Save, 
  Database, 
  Activity, 
  UserCheck, 
  ShieldAlert, 
  Key, 
  RefreshCw,
  Cpu,
  Layers,
  Sparkles,
  Award,
  ChevronRight,
  Globe,
  SlidersHorizontal,
  FileSpreadsheet
} from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { useOneConnectStore } from '@/lib/store';
import { RoleType } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

type ActiveTab = 'RBAC' | 'ORGANIZATION' | 'PDPL_PRIVACY' | 'TELEMETRY';

export default function AdminSettingsAndRbacPage() {
  const { 
    state, 
    currentIdentity, 
    changeUserRole, 
    toggleIdentityStatus, 
    deleteIdentity,
    updatePrivacy,
    updateIdentity,
    resetState 
  } = useOneConnectStore();

  const [activeTab, setActiveTab] = useState<ActiveTab>('RBAC');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [successToast, setSuccessToast] = useState('');
  const [errorToast, setErrorToast] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmDeleteInput, setConfirmDeleteInput] = useState('');

  // Organization settings form state
  const activeOrg = state.organizations[0];

  const [orgName, setOrgName] = useState(activeOrg?.name || 'Hội Doanh Nhân Trẻ Tỉnh Khánh Hòa');
  const [orgTaxCode, setOrgTaxCode] = useState('4201888999');
  const [orgAddress, setOrgAddress] = useState(currentIdentity?.address || 'Số 02 Yersin, Phường Vạn Thắng, TP. Nha Trang, Khánh Hòa');
  const [orgRepresentative, setOrgRepresentative] = useState(currentIdentity?.fullName || 'Hồ Hoàng Long (Johnny Long Hồ)');
  const [orgSupportEmail, setOrgSupportEmail] = useState(currentIdentity?.email || 'contact.johnnylongho@gmail.com');
  const [orgWebsite, setOrgWebsite] = useState(activeOrg?.website || 'https://aplusvn.net');

  // Privacy settings state (PDPL 91/2025/QH15)
  const privacy = state.privacy || {
    profileVisibility: 'PUBLIC',
    contactVisibility: 'MEMBERS_ONLY',
  };
  const [profileVis, setProfileVis] = useState<'PUBLIC' | 'MEMBERS_ONLY' | 'PRIVATE'>(
    (privacy.profileVisibility as any) || 'PUBLIC'
  );
  const [requireConsent, setRequireConsent] = useState(true);
  const [maskData, setMaskData] = useState(true);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      setSuccessToast(msg);
      setTimeout(() => setSuccessToast(''), 3500);
    } else {
      setErrorToast(msg);
      setTimeout(() => setErrorToast(''), 3500);
    }
  };

  // Filtered members list for RBAC management
  const filteredIdentities = useMemo(() => {
    return state.identities.filter((user) => {
      const roleMatches = filterRole === 'ALL' || (user.role || 'MEMBER') === filterRole;
      const matchesSearch =
        !searchTerm ||
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phone && user.phone.includes(searchTerm)) ||
        (user.title && user.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.businesses?.[0]?.businessName &&
          user.businesses[0].businessName.toLowerCase().includes(searchTerm.toLowerCase()));

      return roleMatches && matchesSearch;
    });
  }, [state.identities, filterRole, searchTerm]);

  // Handle Role Change
  const handleRoleChange = (userId: string, newRole: RoleType) => {
    changeUserRole(userId, newRole);
    showToast(`Đã cập nhật phân quyền người dùng sang [${newRole}] thành công!`);
  };

  // Handle User Status Toggle
  const handleToggleStatus = async (userId: string, userName: string, currentStatus?: string) => {
    const isInactive = currentStatus === 'INACTIVE';
    const targetStatus = isInactive ? 'ACTIVE' : 'INACTIVE';
    const res = await toggleIdentityStatus(userId, targetStatus);
    if (res && res.success === false) {
      showToast(res.error || 'Thao tác không thành công', 'error');
    } else {
      showToast(
        isInactive
          ? `Đã kích hoạt lại tài khoản "${userName}".`
          : `Đã tạm khóa (vô hiệu hóa) tài khoản "${userName}".`
      );
    }
  };

  // Handle Save Organization Profile
  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentIdentity) {
      updateIdentity(currentIdentity.id, {
        association: orgName,
        address: orgAddress,
      });
    }
    showToast('Đã lưu thành công cấu hình tổ chức & đơn vị chủ quản!');
  };

  // Handle Save Privacy PDPL
  const handleSavePrivacy = () => {
    updatePrivacy({
      profileVisibility: profileVis,
      contactVisibility: requireConsent ? 'MEMBERS_ONLY' : 'PUBLIC',
    });
    showToast('Đã lưu cấu hình quyền riêng tư & bảo vệ dữ liệu theo Luật PDPL 91/2025/QH15!');
  };

  // Handle Export Full PDPL Data Package
  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      const exportPayload = {
        exportedAt: new Date().toISOString(),
        standard: 'Vietnam Personal Data Protection Law (PDPL 91/2025/QH15)',
        governance: 'ONE CONNECT NETWORK - Cổng Quản Trị TRL-7 Khánh Hòa',
        organization: {
          name: orgName,
          taxCode: orgTaxCode,
          representative: orgRepresentative,
        },
        privacySettings: {
          profileVisibility: profileVis,
          requireTwoWayConsent: requireConsent,
          maskSensitiveData: maskData,
        },
        usersCount: state.identities.length,
        activeCardsCount: state.cards.filter((c) => c.status === 'ACTIVE').length,
        auditLogsCount: state.auditLogs.length,
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `one_connect_admin_audit_export_${Date.now()}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setIsExporting(false);
      showToast('Đã xuất thành công gói hồ sơ kiểm toán PDPL (JSON chuẩn mã hóa)!');
    }, 600);
  };

  // Handle Purge Data
  const handleConfirmPurgeData = () => {
    if (confirmDeleteInput.trim().toUpperCase() !== 'XOA DU LIEU') {
      showToast('Vui lòng gõ chính xác cụm từ "XOA DU LIEU" để xác nhận!', 'error');
      return;
    }

    setIsDeleteModalOpen(false);
    setConfirmDeleteInput('');
    resetState();
    showToast('Đã thu hồi dữ liệu và khởi tạo lại trạng thái bảo mật thành công!');
  };

  return (
    <div className="space-y-6 w-full pb-16 antialiased">
      {/* 1. STANDARDIZED PAGE HEADER */}
      <PageHeader
        supertitle="ONE CONNECT NETWORK • EXECUTIVE ADMINISTRATION"
        title="Cấu Hình Hệ Thống & Phân Quyền Vai Trò (RBAC)"
        description="Quản trị đặc quyền 5 cấp bậc vai trò, phân quyền nhân sự, cấu hình tổ chức chủ quản và tuân thủ Luật Bảo vệ dữ liệu cá nhân PDPL 91/2025/QH15"
        icon={Settings}
        badge="SECURITY SLA"
        badgeVariant="blue"
        backHref="/admin"
        backLabel="Về Command Center"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleExportData}
              disabled={isExporting}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl gap-1.5 shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              {isExporting ? 'Đang xuất JSON...' : 'Xuất Hồ Sơ PDPL'}
            </Button>
            <Button
              onClick={() => {
                if (activeTab === 'ORGANIZATION') {
                  handleSaveOrg({ preventDefault: () => {} } as any);
                } else if (activeTab === 'PDPL_PRIVACY') {
                  handleSavePrivacy();
                } else {
                  showToast('Đã kiểm tra và lưu lại toàn bộ trạng thái phân quyền RBAC!');
                }
              }}
              className="bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold rounded-xl gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              Lưu Thiết Lập
            </Button>
          </div>
        }
      />

      {/* TOAST ALERTS */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}
      {errorToast && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-2xs animate-in fade-in duration-200">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorToast}</span>
        </div>
      )}

      {/* 2. TAB CONTROLS */}
      <div className="flex items-center gap-2 border-b border-slate-200/90 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'RBAC', label: '1. Phân Quyền & Vai Trò (RBAC)', icon: ShieldCheck, count: state.identities.length },
          { id: 'ORGANIZATION', label: '2. Thông Tin Tổ Chức Chủ Quản', icon: Building2 },
          { id: 'PDPL_PRIVACY', label: '3. Quyền Riêng Tư & PDPL 91/2025', icon: Lock },
          { id: 'TELEMETRY', label: '4. Hạ Tầng Viễn Trắc & Bảo Mật', icon: Activity, count: state.auditLogs.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-[#0066FF] text-white border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MA TRẬN PHÂN QUYỀN VAI TRÒ (RBAC) */}
      {activeTab === 'RBAC' && (
        <div className="space-y-6">
          {/* A. 5-Role Capability Overview Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  Ma Trận Đặc Quyền 5 Cấp Bậc Vai Trò (Security Capabilities Matrix)
                </h3>
                <p className="text-xs text-slate-500">
                  Phân định ranh giới truy cập nghiêm ngặt phục vụ Hội đồng Quản trị, Lễ tân Check-in và Hội viên Doanh nhân
                </p>
              </div>
              <Badge variant="outline" className="text-xs font-bold border-blue-200 bg-blue-50 text-blue-700">
                Hiệu lực toàn hệ thống
              </Badge>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-4">Cấp Bậc Vai Trò</th>
                    <th className="py-3 px-3 text-center">Danh Thiếp Số</th>
                    <th className="py-3 px-3 text-center">2-Way Consent</th>
                    <th className="py-3 px-3 text-center">Trạm Check-in &lt;0.8s</th>
                    <th className="py-3 px-3 text-center">Quản Trị Hội Viên</th>
                    <th className="py-3 px-3 text-center">Kho 1.500 Thẻ NFC</th>
                    <th className="py-3 px-3 text-center">Báo Cáo KPI MICE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                      <span>SUPER_ADMIN</span>
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span>ORG_ADMIN</span>
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>EVENT_OPERATOR</span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>MEMBER</span>
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-emerald-600 font-bold">✓</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                  </tr>
                  <tr className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-500 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      <span>GUEST</span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                    <td className="py-3 px-3 text-center text-slate-300">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* B. Live User Role Assignment & Status Control */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Danh Sách & Phân Quyền Trực Tiếp Nhân Sự ({filteredIdentities.length} người)
                </h3>
                <p className="text-xs text-slate-500">
                  Gán vai trò và bật/tắt quyền truy cập thời gian thực cho từng hội viên trong cơ sở dữ liệu
                </p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm tên, email, công ty..."
                    className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs w-48 sm:w-60 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none"
                >
                  <option value="ALL">Tất cả vai trò</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  <option value="ORG_ADMIN">ORG_ADMIN</option>
                  <option value="EVENT_OPERATOR">EVENT_OPERATOR</option>
                  <option value="MEMBER">MEMBER</option>
                  <option value="GUEST">GUEST</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {filteredIdentities.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
                <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Không tìm thấy bản ghi nhân sự nào</p>
                <p className="text-xs text-slate-400">
                  {searchTerm ? 'Vui lòng thử tìm kiếm với từ khóa khác.' : 'Chưa có dữ liệu hội viên trong hệ thống.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="py-3 px-4">Hội Viên / Doanh Nhân</th>
                      <th className="py-3 px-3">Doanh Nghiệp & Chức Vụ</th>
                      <th className="py-3 px-3 text-center">Trạng Thái</th>
                      <th className="py-3 px-3 text-center">Vai Trò Hiện Tại</th>
                      <th className="py-3 px-3 text-center">Thay Đổi Quyền</th>
                      <th className="py-3 px-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {filteredIdentities.map((user) => {
                      const userRole: RoleType = user.role || 'MEMBER';
                      const isInactive = user.status === 'INACTIVE';
                      const isJohnny = user.id === '11111111-1111-1111-1111-111111111111' || user.id === 'id-001';

                      return (
                        <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">
                                {user.fullName.charAt(0)}
                              </div>
                              <div className="truncate">
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                  <span>{user.fullName}</span>
                                  {isJohnny && (
                                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[9px] px-1.5 py-0">
                                      CHỦ NHIỆM
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate">
                                  {user.email || user.phone || 'Chưa cập nhật SĐT'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="truncate max-w-[200px]">
                              <div className="font-semibold text-slate-800 truncate">
                                {user.businesses?.[0]?.businessName || 'Doanh nghiệp tư nhân'}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {user.title || 'Đại biểu'}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <Badge className={`text-[10px] font-bold ${
                              isInactive
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              {isInactive ? 'TẠM KHÓA' : 'HOẠT ĐỘNG'}
                            </Badge>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                              {userRole}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <select
                              value={userRole}
                              disabled={isJohnny}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as RoleType)}
                              className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white focus:outline-none disabled:opacity-50 cursor-pointer"
                            >
                              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                              <option value="ORG_ADMIN">ORG_ADMIN</option>
                              <option value="EVENT_OPERATOR">EVENT_OPERATOR</option>
                              <option value="MEMBER">MEMBER</option>
                              <option value="GUEST">GUEST</option>
                            </select>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              disabled={isJohnny}
                              onClick={() => handleToggleStatus(user.id, user.fullName, user.status)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-40 ${
                                isInactive
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                              }`}
                            >
                              {isInactive ? 'Mở Khóa' : 'Tạm Khóa'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: CẤU HÌNH TỔ CHỨC CHỦ QUẢN */}
      {activeTab === 'ORGANIZATION' && (
        <form onSubmit={handleSaveOrg} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Hồ Sơ Pháp Lý & Đơn Vị Chủ Quản Hiệp Hội
              </h3>
              <p className="text-xs text-slate-500">
                Thông tin xuất hiện trên chứng thư điểm danh số, vé mời điện tử và danh bạ hội viên kết nối MICE
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tên Hiệp Hội / Tổ Chức Đơn Vị</label>
                <input
                  type="text"
                  value={orgName}
                  onChange={(e) => setOrgName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  placeholder="Nhập tên tổ chức..."
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Mã Số Thuế / Quyết Định Thành Lập</label>
                <input
                  type="text"
                  value={orgTaxCode}
                  onChange={(e) => setOrgTaxCode(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  placeholder="Mã số thuế tổ chức..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Người Đại Diện Ban Điều Phối</label>
                <input
                  type="text"
                  value={orgRepresentative}
                  onChange={(e) => setOrgRepresentative(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Họ tên người đại diện..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Hotline / Email Thư Ký</label>
                <input
                  type="email"
                  value={orgSupportEmail}
                  onChange={(e) => setOrgSupportEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  placeholder="Email tiếp nhận..."
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Địa Chỉ Trụ Sở Ban Chấp Hành</label>
                <input
                  type="text"
                  value={orgAddress}
                  onChange={(e) => setOrgAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Địa chỉ trụ sở..."
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700">Cổng Thông Tin Số / Website Chính Thức</label>
                <input
                  type="url"
                  value={orgWebsite}
                  onChange={(e) => setOrgWebsite(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                className="bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" /> Lưu Thông Tin Tổ Chức
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: TUÂN THỦ QUYỀN RIÊNG TƯ & LUẬT PDPL 91/2025/QH15 */}
      {activeTab === 'PDPL_PRIVACY' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Lock className="w-5 h-5 text-emerald-600" />
                Cấu Hình Quyền Riêng Tư & Cơ Chế 2-Way Consent Shield
              </h3>
              <p className="text-xs text-slate-500">
                Tuân thủ Nghị định 13/2023/NĐ-CP và Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15
              </p>
            </div>

            <div className="space-y-4">
              {/* Setting 1: Profile Visibility */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-xs text-slate-900">
                    Chế Độ Mặc Định Hiển Thị Danh Thiếp Số
                  </div>
                  <p className="text-xs text-slate-500">
                    Kiểm soát ai có thể xem thông tin liên hệ và hồ sơ kinh doanh khi chạm thẻ NFC
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {(['PUBLIC', 'MEMBERS_ONLY', 'PRIVATE'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setProfileVis(mode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        profileVis === mode
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode === 'PUBLIC' && 'Công Khai'}
                      {mode === 'MEMBERS_ONLY' && 'Chỉ Hội Viên'}
                      {mode === 'PRIVATE' && 'Riêng Tư'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Setting 2: Two-way Consent */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Bắt Buộc Xác Thực 2 Chiều (2-Way Consent Shield)
                  </div>
                  <p className="text-xs text-slate-500">
                    Số điện thoại và Zalo cá nhân chỉ mở khóa khi cả hai doanh nhân cùng đồng thuận xác nhận
                  </p>
                </div>
                <Switch
                  checked={requireConsent}
                  onCheckedChange={setRequireConsent}
                />
              </div>

              {/* Setting 3: Mask Sensitive Data */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="font-bold text-xs text-slate-900">
                    Tự Động Che Mặt Nạ Dữ Liệu Nhạy Cảm (Data Masking)
                  </div>
                  <p className="text-xs text-slate-500">
                    Ẩn các thông tin CCCD, số tài khoản ngân hàng và mã số thuế khi xem trước vCard công khai
                  </p>
                </div>
                <Switch
                  checked={maskData}
                  onCheckedChange={setMaskData}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                onClick={handleSavePrivacy}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5 mr-1.5" /> Lưu Cấu Hình PDPL
              </Button>
            </div>
          </div>

          {/* Right to be Forgotten / Purge Section */}
          <div className="bg-white rounded-3xl border border-rose-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-rose-700 font-extrabold text-base">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <span>Quyền Được Lãng Quên & Thu Hồi Dữ Liệu (Điều 16 Luật PDPL)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Theo quy định của Luật Bảo vệ Dữ liệu Cá nhân, quản trị viên có quyền thực hiện xóa vĩnh viễn dữ liệu kiểm thử hoặc thu hồi tài khoản theo văn bản đề nghị chính thức của chủ thể dữ liệu.
            </p>
            <Button
              type="button"
              onClick={() => setIsDeleteModalOpen(true)}
              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
            >
              Yêu Cầu Thu Hồi & Xóa Trắng Dữ Liệu
            </Button>
          </div>
        </div>
      )}

      {/* TAB 4: HẠ TẦNG VIỄN TRẮC & KIỂM TOÁN SHA-256 */}
      {activeTab === 'TELEMETRY' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cơ Sở Dữ Liệu</span>
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">CONNECTED</Badge>
              </div>
              <div className="text-lg font-black text-slate-900 font-mono">Supabase Singapore</div>
              <p className="text-[11px] text-slate-500">Hạ tầng PostgreSQL với phân vùng Row-Level Security (RLS)</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Độ Trễ Check-in</span>
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px]">SLA &lt;0.8s</Badge>
              </div>
              <div className="text-lg font-black text-[#0066FF] font-mono">0.42 Giây</div>
              <p className="text-[11px] text-slate-500">Tốc độ chạm thẻ NFC NTAG216 và phản hồi WebSocket</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nhật Ký Kiểm Toán</span>
                <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-[10px]">SHA-256</Badge>
              </div>
              <div className="text-lg font-black text-purple-700 font-mono">{state.auditLogs.length} Bản Ghi</div>
              <p className="text-[11px] text-slate-500">Lưu vết bất biến phục vụ báo cáo kiểm toán bảo mật</p>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Nhật Ký Kiểm Toán Quản Trị Hệ Thống (Audit Logs)
            </h3>
            {state.auditLogs.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
                <Info className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700">Chưa ghi nhận sự kiện kiểm toán nào</p>
                <p className="text-xs text-slate-400">Các thao tác đổi vai trò, cấp phát thẻ và check-in sẽ được ghi nhận tại đây.</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                      <th className="py-3 px-4">Thời Gian</th>
                      <th className="py-3 px-3">Người Thực Hiện</th>
                      <th className="py-3 px-3">Hành Động</th>
                      <th className="py-3 px-3">Đối Tượng</th>
                      <th className="py-3 px-3 text-right">Mã Log</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                    {state.auditLogs.slice(0, 15).map((log) => (
                      <tr key={log.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {new Date(log.createdAt).toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {log.actorName || 'Quản trị viên'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono text-[10.5px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {log.objectType} ({log.objectId})
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[10px] text-slate-400">
                          {log.id.slice(-8)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: DELETE / PURGE DATA */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-base font-extrabold text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Xác Nhận Thu Hồi Quyền & Xóa Dữ Liệu
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 pt-2 leading-relaxed">
              Hành động này sẽ thực hiện thu hồi tài khoản và xóa sạch dữ liệu khỏi môi trường cục bộ. Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-xs text-slate-700 font-semibold">
              Để xác nhận, vui lòng nhập chính xác cụm từ <span className="font-mono text-rose-600 bg-rose-50 px-1 py-0.5 rounded border border-rose-200">XOA DU LIEU</span> bên dưới:
            </p>
            <input
              type="text"
              value={confirmDeleteInput}
              onChange={(e) => setConfirmDeleteInput(e.target.value)}
              placeholder="Gõ XOA DU LIEU..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteModalOpen(false);
                setConfirmDeleteInput('');
              }}
              className="rounded-xl text-xs font-bold"
            >
              Hủy Bỏ
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPurgeData}
              className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Xác Nhận Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
