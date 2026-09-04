'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import { useOneConnectStore } from '@/lib/store';
import { RoleType } from '@/lib/types';
import {
  Users,
  ShieldCheck,
  Plus,
  Search,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Building2,
  Phone,
  Mail,
  Award,
  Filter,
  UserCheck,
  ArrowLeft,
  Sparkles,
  X,
  Crown,
  Lock,
  Unlock,
  Trash2,
  AlertTriangle,
  Download,
  Upload,
  FileSpreadsheet,
  FileUp,
  FileCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  downloadMemberTemplate,
  parseMembersExcel,
  exportMembersToExcel,
  ParseExcelResult,
} from '@/lib/excel-service';

export default function MemberDirectoryAdminPage() {
  const { state, registerIdentity, changeUserRole, toggleIdentityStatus, deleteIdentity } = useOneConnectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterIndustry, setFilterIndustry] = useState<string>('ALL');
  const [selectedMemberForCard, setSelectedMemberForCard] = useState<any | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Excel Import / Export States
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseExcelResult | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [skipExisting, setSkipExisting] = useState(true);

  // Form states for new member
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('Giám Đốc Điều Hành');
  const [businessName, setBusinessName] = useState('');
  const [association, setAssociation] = useState('Ủy Viên Ban Chấp Hành');
  const [selectedRole, setSelectedRole] = useState<RoleType>('MEMBER');
  const [cardType, setCardType] = useState<'NFC_EXECUTIVE' | 'NFC_BUSINESS_PRO' | 'NFC_STANDARD'>('NFC_EXECUTIVE');
  const [address, setAddress] = useState('TP. Nha Trang, Khánh Hòa');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const filteredMembers = state.identities.filter((m) => {
    const roleMatches = filterRole === 'ALL' || (m.role || 'MEMBER') === filterRole;
    const industryMatches = filterIndustry === 'ALL' || 
      (m.title && m.title.toLowerCase().includes(filterIndustry.toLowerCase())) ||
      (m.bio && m.bio.toLowerCase().includes(filterIndustry.toLowerCase())) ||
      (m.businesses && m.businesses[0]?.businessName.toLowerCase().includes(filterIndustry.toLowerCase()));
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.displayName && m.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.title && m.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.association && m.association.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.businesses && m.businesses[0]?.businessName.toLowerCase().includes(searchTerm.toLowerCase()));

    return roleMatches && industryMatches && matchesSearch;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !businessName || !email) return;

    registerIdentity({
      fullName,
      title: title || 'Giám Đốc Doanh Nghiệp',
      businessName,
      association,
      role: selectedRole,
      cardType,
      address,
      phone: phone || '0903.888.999',
      email,
      taxCode: taxCode || '4201888999',
    });

    setSuccessToast(`Đã thêm thành công đại biểu "${fullName}" với vai trò [${selectedRole}] & tự động kích hoạt Thẻ NFC Số!`);
    setShowAddModal(false);

    // Reset form
    setFullName('');
    setTitle('Giám Đốc Điều Hành');
    setBusinessName('');
    setAssociation('Ủy Viên Ban Chấp Hành');
    setSelectedRole('MEMBER');
    setCardType('NFC_EXECUTIVE');
    setAddress('TP. Nha Trang, Khánh Hòa');
    setPhone('');
    setEmail('');
    setTaxCode('');

    setTimeout(() => {
      setSuccessToast('');
    }, 4000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFile(file);
    setIsParsing(true);
    try {
      const res = await parseMembersExcel(file);
      setParseResult(res);
    } catch (err: any) {
      alert(`Lỗi đọc file Excel: ${err?.message || err}`);
    } finally {
      setIsParsing(false);
    }
  };

  const handleExecuteImport = async () => {
    if (!parseResult || parseResult.validRows.length === 0) return;
    setIsImporting(true);

    try {
      let importedCount = 0;
      let skippedCount = 0;

      for (const row of parseResult.validRows) {
        // Check duplicate email or phone in existing identities
        const existingMember = state.identities.find(
          (i) =>
            (i.email && i.email.toLowerCase() === row.email.toLowerCase()) ||
            (i.phone && i.phone.replace(/[^0-9]/g, '') === row.phone.replace(/[^0-9]/g, ''))
        );

        if (existingMember && skipExisting) {
          skippedCount++;
          continue;
        }

        registerIdentity({
          fullName: row.fullName,
          businessName: row.businessName,
          title: row.title,
          phone: row.phone,
          email: row.email,
          association: row.association,
          taxCode: row.taxCode,
          role: row.role || 'MEMBER',
          cardType: row.cardType || 'NFC_EXECUTIVE',
          address: row.address,
          bio: row.bio,
        });
        importedCount++;
      }

      setSuccessToast(
        `Nạp Excel thành công: Đã tạo mới & cấp thẻ số cho ${importedCount} hội viên!` +
          (skippedCount > 0 ? ` (Bỏ qua ${skippedCount} hội viên đã tồn tại)` : '')
      );
      setShowImportModal(false);
      setImportFile(null);
      setParseResult(null);
      setTimeout(() => setSuccessToast(''), 5000);
    } catch (err: any) {
      alert(`Lỗi trong quá trình nạp dữ liệu: ${err?.message || err}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-16 antialiased">
      
      {/* Success Toast */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-white/80 hover:text-white font-mono text-xs">✕</button>
        </div>
      )}

      {/* 1. STANDARDIZED PAGE HEADER WITH EXCEL ACTIONS */}
      <PageHeader
        supertitle="ONE CONNECT NETWORK • MODULE 3: QUẢN TRỊ HIỆP HỘI"
        title="Quản Lý Danh Bạ Đại Biểu & Hội Viên"
        description="Quản trị hồ sơ doanh nhân, cấp phát thẻ số NFC và quản lý sinh hoạt Hội"
        icon={Users}
        badge="MEMBER DIRECTORY"
        badgeVariant="blue"
        backHref="/admin/org"
        backLabel="Về Tổng quan Hiệp Hội"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => downloadMemberTemplate()}
              className="text-xs font-bold rounded-xl border-slate-200 text-slate-700 bg-white hover:bg-slate-50 py-2 px-3 cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Tải file Excel mẫu chuẩn (.xlsx) để nhập liệu"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Tải File Mẫu</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowImportModal(true)}
              className="text-xs font-bold rounded-xl border-blue-200 text-[#0066FF] bg-blue-50/60 hover:bg-blue-50 py-2 px-3 cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Nạp danh sách hội viên hàng loạt từ file Excel"
            >
              <Upload className="w-3.5 h-3.5 text-[#0066FF]" />
              <span>Import Excel</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => exportMembersToExcel(filteredMembers, state.cards)}
              className="text-xs font-bold rounded-xl border-emerald-200 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-50 py-2 px-3 cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Xuất danh sách hội viên ra file Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xuất Excel ({filteredMembers.length})</span>
            </Button>
            <Button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs py-2 px-3.5 shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Hội Viên</span>
            </Button>
          </div>
        }
      />

      {/* 2. 3 METRIC OVERVIEW CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hội Viên Chính Thức</span>
            <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10.5px]">ACTIVE</Badge>
          </div>
          <div className="text-3xl font-black text-slate-900 font-mono">{state.identities.length}</div>
          <p className="text-[12px] text-emerald-600 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Đã xác thực danh tính
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doanh Nghiệp Trực Thuộc</span>
            <Building2 className="w-4 h-4 text-[#FF6B00]" />
          </div>
          <div className="text-3xl font-black text-[#FF6B00] font-mono">{state.identities.length}</div>
          <p className="text-[12px] text-slate-500">Đại diện pháp nhân kinh doanh</p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thẻ NFC Kích Hoạt</span>
            <CreditCard className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-emerald-600 font-mono">{state.identities.length}</div>
          <p className="text-[12px] text-emerald-600 font-semibold">Tỷ lệ sử dụng 1-Chạm: 96%</p>
        </div>
      </section>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <section className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Tìm kiếm hội viên theo họ tên, chức danh, doanh nghiệp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF] transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 cursor-pointer"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="SUPER_ADMIN">Quản trị Hệ thống (SUPER_ADMIN)</option>
            <option value="ORG_ADMIN">Quản trị Hiệp hội (ORG_ADMIN)</option>
            <option value="EVENT_OPERATOR">Lễ tân Check-in (EVENT_OPERATOR)</option>
            <option value="MEMBER">Hội viên / Doanh nhân (MEMBER)</option>
          </select>

          <Badge className="bg-slate-100 text-slate-700 border-slate-300 font-mono text-xs shrink-0">
            {filteredMembers.length} Đại Biểu
          </Badge>
        </div>

        {/* Industry Filter Pills */}
        <div className="w-full flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
            Ngành Nghề:
          </span>
          {[
            { id: 'ALL', label: 'Tất Cả' },
            { id: 'Công nghệ', label: 'Công Nghệ' },
            { id: 'Vinacoffee', label: 'Nông Sản & F&B' },
            { id: 'TechCorp', label: 'Phần Mềm & Cloud' },
            { id: 'Aplusvn', label: 'Media & Định Danh' },
          ].map((ind) => (
            <button
              key={ind.id}
              onClick={() => setFilterIndustry(ind.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterIndustry === ind.id
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>
      </section>

      {/* 4. MEMBERS LIST GRID */}
      <section className="space-y-3">
        {filteredMembers.map((m) => {
          const companyName = m.businesses && m.businesses[0] ? m.businesses[0].businessName : 'Tập đoàn Công nghệ Số A+ (APLUSVN)';
          const profileLink = `/p/${m.username || m.id}`;
          const memberCard = state.cards.find((c) => c.personIdentityId === m.id && c.status === 'ACTIVE') || state.cards.find((c) => c.personIdentityId === m.id);
          const currentMemberRole: RoleType = m.role || (m.id === 'id-001' || m.id === '11111111-1111-1111-1111-111111111111' ? 'SUPER_ADMIN' : 'MEMBER');
          const isSuperAdmin = m.username === 'johnnylongho' || m.id === 'id-001' || m.id === '11111111-1111-1111-1111-111111111111' || (m.email && m.email.toLowerCase() === 'contact.johnnylongho@gmail.com');
          const isInactive = m.status === 'INACTIVE';

          const roleBadgeConfig: Record<string, { label: string; bg: string }> = {
            SUPER_ADMIN: { label: 'SUPER ADMIN', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
            ORG_ADMIN: { label: 'ORG ADMIN', bg: 'bg-blue-50 text-[#0066FF] border-blue-200' },
            ORGANIZER: { label: 'BAN TỔ CHỨC', bg: 'bg-blue-50 text-[#0066FF] border-blue-200' },
            EVENT_OPERATOR: { label: 'LỄ TÂN CHECK-IN', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
            MEMBER: { label: 'HỘI VIÊN', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            GUEST: { label: 'KHÁCH MỜI', bg: 'bg-slate-50 text-slate-600 border-slate-200' },
          };
          const currentBadge = roleBadgeConfig[currentMemberRole] || { label: currentMemberRole, bg: 'bg-slate-50 text-slate-600 border-slate-200' };

          return (
            <div
              key={m.id}
              className={`p-4 sm:p-5 rounded-2xl border shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group ${
                isInactive ? 'bg-slate-50/70 border-slate-300/80 opacity-85' : 'bg-white border-slate-200/90'
              }`}
            >
              {/* Member Info */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="relative shrink-0">
                  <img
                    src={m.avatarUrl || '/avatar-johnny-long.jpg'}
                    alt={m.fullName}
                    className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl object-cover shadow-2xs border bg-slate-100 group-hover:scale-105 transition-transform ${
                      isInactive ? 'border-rose-300 grayscale-30' : 'border-slate-200'
                    }`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(m.fullName)}&backgroundColor=0066ff,00c2ff`;
                    }}
                  />
                  {isInactive && (
                    <div className="absolute -bottom-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 shadow-xs" title="Tài khoản đã bị vô hiệu hóa">
                      <Lock className="w-3 h-3" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className={`font-bold text-sm sm:text-base tracking-tight ${isInactive ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {m.fullName}
                    </h3>
                    <Badge className={`${currentBadge.bg} text-[10px] font-extrabold uppercase`}>
                      {currentBadge.label}
                    </Badge>
                    {isInactive ? (
                      <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] font-bold">
                        ĐÃ KHÓA
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono">
                        {memberCard?.cardUid || 'NFC-ACTIVE'}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs sm:text-[13px] font-bold text-[#0066FF] leading-snug">
                    {m.title}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                    <Building2 className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                    <span className="truncate">{companyName}</span>
                  </div>
                </div>
              </div>

              {/* Quick Contact & Action Buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-end">
                {/* Inline Role Indicator / Changer */}
                {isSuperAdmin ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black shadow-2xs">
                    <Crown className="w-3.5 h-3.5 text-amber-600" />
                    <span>SUPER_ADMIN</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <select
                      value={currentMemberRole === 'SUPER_ADMIN' ? 'MEMBER' : currentMemberRole}
                      onChange={(e) => {
                        const newR = e.target.value as RoleType;
                        changeUserRole(m.id, newR);
                        setSuccessToast(`Đã đổi phân quyền của "${m.fullName}" thành [${newR}] thành công!`);
                        setTimeout(() => setSuccessToast(''), 3500);
                      }}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 cursor-pointer"
                      title="Phân quyền tài khoản này"
                    >
                      <option value="MEMBER">MEMBER (Hội viên)</option>
                      <option value="EVENT_OPERATOR">EVENT_OPERATOR (Lễ tân)</option>
                      <option value="ORG_ADMIN">ORG_ADMIN (Quản trị Hiệp hội)</option>
                    </select>
                  </div>
                )}

                <Link
                  href={profileLink}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0066FF] hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Profile
                </Link>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedMemberForCard(m)}
                  className="rounded-xl border-blue-200 text-blue-700 bg-blue-50/60 hover:bg-blue-100 text-xs font-bold py-1.5 cursor-pointer shadow-2xs"
                >
                  <Award className="w-3.5 h-3.5 mr-1 text-[#0066FF]" /> Thẻ Hội Viên
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => alert(`Thẻ NFC ${memberCard?.cardUid || 'NFC-EXECUTIVE'} của hội viên ${m.fullName} đang hoạt động bình thường!`)}
                  className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold py-1.5 cursor-pointer shadow-2xs"
                >
                  <CreditCard className="w-3.5 h-3.5 mr-1 text-[#FF6B00]" /> Thẻ NFC
                </Button>

                {/* Deactivate / Activate Button */}
                {!isSuperAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const targetAction = isInactive ? 'ACTIVE' : 'INACTIVE';
                      const res = await toggleIdentityStatus(m.id, targetAction);
                      if (res && res.success === false) {
                        alert(res.error || 'Thao tác không thành công');
                      } else {
                        setSuccessToast(
                          isInactive
                            ? `Đã kích hoạt lại tài khoản hội viên "${m.fullName}".`
                            : `Đã tạm khóa (vô hiệu hóa) tài khoản hội viên "${m.fullName}".`
                        );
                        setTimeout(() => setSuccessToast(''), 4000);
                      }
                    }}
                    className={`rounded-xl text-xs font-bold py-1.5 cursor-pointer shadow-2xs transition-all ${
                      isInactive
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                        : 'border-amber-200 text-amber-700 bg-amber-50/70 hover:bg-amber-100'
                    }`}
                    title={isInactive ? 'Kích hoạt lại tài khoản' : 'Khóa tài khoản này'}
                  >
                    {isInactive ? (
                      <>
                        <Unlock className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Mở khóa
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5 mr-1 text-amber-600" /> Khóa
                      </>
                    )}
                  </Button>
                )}

                {/* Delete Member Button */}
                {!isSuperAdmin && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setMemberToDelete(m)}
                    className="rounded-xl border-rose-200 text-rose-600 bg-rose-50/60 hover:bg-rose-100 hover:text-rose-700 text-xs font-bold py-1.5 cursor-pointer shadow-2xs"
                    title="Xóa vĩnh viễn tài khoản hội viên"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1 text-rose-600" /> Xóa
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* MODAL: THẺ HỘI VIÊN SỐ (E-MEMBERSHIP CARD) */}
      {selectedMemberForCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200 text-center relative">
            <button
              onClick={() => setSelectedMemberForCard(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold cursor-pointer"
            >
              ✕
            </button>

            <div className="pt-2">
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF6B00]" /> THẺ HỘI VIÊN CHÍNH THỨC
              </span>
            </div>

            {/* Association e-Card Visual */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white space-y-4 shadow-lg text-left relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <img src="/one_connect_final_logo_orange.png?v=20260904_tagline" alt="Logo" className="h-6 w-auto object-contain" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">HỘI DOANH NHÂN</span>
                </div>
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-400/30 text-[9.5px]">
                  2026 - 2027
                </Badge>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <img
                  src={selectedMemberForCard.avatarUrl || '/avatar-johnny-long.jpg'}
                  alt={selectedMemberForCard.fullName}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-[#00C2FF] shadow-md bg-white shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-sm text-white truncate">
                    {selectedMemberForCard.fullName}
                  </h4>
                  <p className="text-[11px] text-[#00C2FF] font-semibold truncate">
                    {selectedMemberForCard.title}
                  </p>
                  <p className="text-[10px] text-slate-300 truncate">
                    {selectedMemberForCard.businesses?.[0]?.businessName || 'Doanh Nghiệp Hội Viên'}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>MÃ HỘI VIÊN: <strong>ONEC-{selectedMemberForCard.id.toUpperCase()}</strong></span>
                <span className="text-emerald-400">● ĐÃ ĐÓNG PHÍ</span>
              </div>
            </div>

            <Button
              onClick={() => setSelectedMemberForCard(null)}
              className="w-full bg-[#0066FF] hover:bg-blue-600 text-white font-bold rounded-xl text-xs py-2.5 cursor-pointer shadow-xs"
            >
              Đóng Thẻ Hội Viên
            </Button>
          </div>
        </div>
      )}

      {/* MODAL: THÊM HỘI VIÊN MỚI */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">Thêm & Cấp Phân Quyền Đại Biểu</h2>
                  <p className="text-xs text-slate-500">Khởi tạo tài khoản, gán vai trò & phát hành Thẻ NFC</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMember} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Họ và tên Doanh nhân <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="VD: Trần Văn Minh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Vai Trò / Phân Quyền <span className="text-[#0066FF]">*</span></label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as RoleType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#0066FF]/40 text-sm font-bold text-slate-900 bg-blue-50/50 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20"
                  >
                    <option value="MEMBER">MEMBER (Hội viên / Doanh nhân)</option>
                    <option value="EVENT_OPERATOR">EVENT_OPERATOR (Lễ tân Điểm danh)</option>
                    <option value="ORG_ADMIN">ORG_ADMIN (Quản trị Hiệp hội / CLB)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Hạng Thẻ NFC Cấp Phát</label>
                  <select
                    value={cardType}
                    onChange={(e) => setCardType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  >
                    <option value="NFC_EXECUTIVE">Thẻ Kim Loại Đen VIP (NFC Executive)</option>
                    <option value="NFC_BUSINESS_PRO">Thẻ Doanh Nhân Pro (Business Pro)</option>
                    <option value="NFC_STANDARD">Thẻ Tiêu Chuẩn (Standard Member)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Chức danh</label>
                  <input
                    type="text"
                    placeholder="VD: Giám Đốc Điều Hành"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="VD: 0912.345.678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Tên Doanh nghiệp / Đơn vị <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="VD: Công ty TNHH Du Lịch Biển Xanh Nha Trang"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Vị trí trong Hiệp Hội</label>
                  <select
                    value={association}
                    onChange={(e) => setAssociation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  >
                    <option value="Ủy Viên Ban Chấp Hành">Ủy Viên Ban Chấp Hành</option>
                    <option value="Chủ Tịch Hiệp Hội">Chủ Tịch Hiệp Hội</option>
                    <option value="Phó Chủ Tịch Thường Trực">Phó Chủ Tịch Thường Trực</option>
                    <option value="Trưởng Ban Xúc Tiến Thương Mại">Trưởng Ban Xúc Tiến Thương Mại</option>
                    <option value="Trưởng Ban Công Nghệ & Media">Trưởng Ban Công Nghệ & Media</option>
                    <option value="Hội Viên Doanh Nhân Chính Thức">Hội Viên Doanh Nhân Chính Thức</option>
                    <option value="Hội Viên Danh Dự & Cố Vấn">Hội Viên Danh Dự & Cố Vấn</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mã số thuế</label>
                  <input
                    type="text"
                    placeholder="VD: 4201998877"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Địa chỉ Trụ sở Doanh nghiệp</label>
                <input
                  type="text"
                  placeholder="VD: Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Khánh Hòa"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email làm việc <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  required
                  placeholder="VD: minh.tran@bienxanh.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 cursor-pointer"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs px-5 py-2.5 cursor-pointer shadow-xs"
                >
                  Lưu & Kích Hoạt Thẻ NFC
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORT DANH SÁCH HỘI VIÊN TỪ EXCEL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200 text-left relative max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
                  <FileSpreadsheet className="w-5 h-5 text-[#0066FF]" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 font-heading">
                    Import Danh Sách Hội Viên Bằng Excel
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Hỗ trợ định dạng file .xlsx, .xls theo chuẩn hệ thống One Connect
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setParseResult(null);
                }}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="space-y-4 overflow-y-auto flex-1 pr-1">
              {/* Template Download Prompt */}
              <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between gap-3">
                <div className="text-xs text-blue-900 space-y-0.5">
                  <p className="font-bold flex items-center gap-1.5 text-[#0066FF]">
                    <Download className="w-3.5 h-3.5" /> Chưa có file mẫu chuẩn của One Connect?
                  </p>
                  <p className="text-[11.5px] text-blue-800/80">
                    Tải file mẫu Excel chuẩn (.xlsx) có sẵn tiêu đề tiếng Việt và dữ liệu mẫu để điền thông tin nhanh nhất.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => downloadMemberTemplate()}
                  className="bg-white hover:bg-blue-50 border-blue-200 text-[#0066FF] font-bold text-xs rounded-xl shrink-0 cursor-pointer shadow-2xs"
                >
                  Tải File Mẫu
                </Button>
              </div>

              {/* Upload Dropzone */}
              <div className="relative border-2 border-dashed border-slate-300 hover:border-[#0066FF] rounded-2xl p-6 text-center transition-all bg-slate-50/50 hover:bg-blue-50/20 group">
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                <div className="space-y-2 flex flex-col items-center pointer-events-none">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 group-hover:bg-blue-100 text-[#0066FF] flex items-center justify-center transition-colors shadow-2xs">
                    <FileUp className="w-6 h-6 text-[#0066FF]" />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900">Bấm để chọn file Excel</span> hoặc kéo thả file vào đây
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Định dạng hỗ trợ: Microsoft Excel (.xlsx, .xls)
                  </p>
                </div>
              </div>

              {/* File details & parsing spinner */}
              {isParsing && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center gap-2 text-xs text-slate-600">
                  <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
                  <span>Đang đọc và kiểm tra dữ liệu file Excel...</span>
                </div>
              )}

              {/* Parsing Results */}
              {parseResult && (
                <div className="space-y-3 pt-1">
                  {/* Summary Metric Chips */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-[11px] font-bold text-slate-500">TỔNG SỐ DÒNG</div>
                      <div className="text-lg font-black text-slate-900 font-mono">{parseResult.totalRows}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800">
                      <div className="text-[11px] font-bold">HỢP LỆ ĐỦ ĐIỀU KIỆN</div>
                      <div className="text-lg font-black font-mono text-emerald-600">{parseResult.validRows.length}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
                      <div className="text-[11px] font-bold">LỖI / THIẾU CỘT</div>
                      <div className="text-lg font-black font-mono text-rose-600">{parseResult.invalidRows.length}</div>
                    </div>
                  </div>

                  {/* Duplicate Strategy Checkbox */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      id="skipExisting"
                      checked={skipExisting}
                      onChange={(e) => setSkipExisting(e.target.checked)}
                      className="w-4 h-4 text-[#0066FF] rounded border-slate-300 focus:ring-[#0066FF]"
                    />
                    <label htmlFor="skipExisting" className="font-semibold cursor-pointer select-none">
                      Tự động bỏ qua các hội viên nếu Email hoặc SĐT đã tồn tại trên hệ thống (chống trùng lặp)
                    </label>
                  </div>

                  {/* Invalid Rows Warning Box */}
                  {parseResult.invalidRows.length > 0 && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 space-y-1 max-h-28 overflow-y-auto">
                      <div className="font-bold flex items-center gap-1.5 text-rose-700">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        Danh sách các dòng không hợp lệ ({parseResult.invalidRows.length}):
                      </div>
                      {parseResult.invalidRows.map((inv, idx) => (
                        <div key={idx} className="text-[11.5px] text-rose-700/90 pl-5 list-disc">
                          • Dòng {inv.rowNumber}: {inv.errors.join('; ')}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Preview Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <div className="bg-slate-100/80 px-3 py-2 font-bold text-slate-700 flex justify-between items-center text-[11px] uppercase tracking-wider">
                      <span>Xem trước dữ liệu hợp lệ ({parseResult.validRows.length} hội viên)</span>
                      <span className="text-slate-500 font-normal">Tự sinh thẻ NFC & Danh thiếp số</span>
                    </div>
                    <div className="max-h-40 overflow-y-auto divide-y divide-slate-100">
                      {parseResult.validRows.slice(0, 8).map((row, idx) => (
                        <div key={idx} className="p-2.5 flex items-center justify-between gap-2 hover:bg-slate-50">
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{row.fullName}</p>
                            <p className="text-[11px] text-slate-500 truncate">{row.title} • {row.businessName}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-mono text-[11px] text-slate-700">{row.phone}</p>
                            <p className="font-mono text-[10.5px] text-slate-400">{row.email}</p>
                          </div>
                        </div>
                      ))}
                      {parseResult.validRows.length > 8 && (
                        <div className="p-2 text-center text-[11px] text-slate-400 font-mono bg-slate-50">
                          ... và còn {parseResult.validRows.length - 8} hội viên hợp lệ khác
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                  setParseResult(null);
                }}
                disabled={isImporting}
                className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 cursor-pointer hover:bg-slate-50"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                onClick={handleExecuteImport}
                disabled={!parseResult || parseResult.validRows.length === 0 || isImporting}
                className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs px-5 py-2.5 cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {isImporting
                    ? 'Đang nạp dữ liệu...'
                    : `Xác Nhận Nạp (${parseResult?.validRows.length || 0} Hội Viên)`}
                </span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: XÁC NHẬN XÓA THÀNH VIÊN VĨNH VIỄN */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200 text-left relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">Xác Nhận Xóa Hội Viên Vĩnh Viễn</h3>
                <p className="text-xs text-slate-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <p className="text-slate-700">
                Bạn đang chuẩn bị xóa hội viên: <strong className="text-slate-900 font-bold">{memberToDelete.fullName}</strong>
              </p>
              {memberToDelete.email && (
                <p className="text-slate-500 font-mono">Email: {memberToDelete.email}</p>
              )}
              {memberToDelete.phone && (
                <p className="text-slate-500 font-mono">Điện thoại: {memberToDelete.phone}</p>
              )}
              <p className="text-rose-600 font-semibold pt-1 border-t border-slate-200">
                ⚠️ Toàn bộ dữ liệu hồ sơ cá nhân, thẻ NFC số, lịch sử check-in sự kiện và các liên kết kinh doanh của hội viên này sẽ bị xóa hoàn toàn khỏi hệ thống.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isDeleting}
                onClick={() => setMemberToDelete(null)}
                className="rounded-xl border-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="button"
                disabled={isDeleting}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    const res = await deleteIdentity(memberToDelete.id);
                    if (res && res.success === false) {
                      alert(res.error || 'Xóa tài khoản không thành công');
                    } else {
                      setSuccessToast(`Đã xóa vĩnh viễn tài khoản hội viên "${memberToDelete.fullName}" khỏi hệ thống.`);
                      setMemberToDelete(null);
                      setTimeout(() => setSuccessToast(''), 4000);
                    }
                  } catch (e: any) {
                    alert('Lỗi: ' + e.message);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs px-5 py-2.5 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? 'Đang xử lý xóa...' : 'Xác Nhận Xóa Vĩnh Viễn'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
