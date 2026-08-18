'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useOneConnectStore } from '@/lib/store';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function MemberDirectoryAdminPage() {
  const { state, registerIdentity } = useOneConnectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new member
  const [fullName, setFullName] = useState('');
  const [title, setTitle] = useState('Giám Đốc Điều Hành');
  const [businessName, setBusinessName] = useState('');
  const [association, setAssociation] = useState('Ủy Viên Ban Chấp Hành');
  const [cardType, setCardType] = useState<'NFC_EXECUTIVE' | 'NFC_BUSINESS_PRO' | 'NFC_STANDARD'>('NFC_EXECUTIVE');
  const [address, setAddress] = useState('TP. Nha Trang, Khánh Hòa');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [taxCode, setTaxCode] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const filteredMembers = state.identities.filter(m => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.displayName && m.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.title && m.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.association && m.association.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.businesses && m.businesses[0]?.businessName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  const handleCreateMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !businessName || !email) return;

    registerIdentity({
      fullName,
      title: title || 'Giám Đốc Doanh Nghiệp',
      businessName,
      association,
      cardType,
      address,
      phone: phone || '0903.888.999',
      email,
      taxCode: taxCode || '4201888999',
    });

    setSuccessToast(`Đã thêm thành công hội viên "${fullName}" (${association}) & tự động kích hoạt Thẻ NFC Số!`);
    setShowAddModal(false);

    // Reset form
    setFullName('');
    setTitle('Giám Đốc Điều Hành');
    setBusinessName('');
    setAssociation('Ủy Viên Ban Chấp Hành');
    setCardType('NFC_EXECUTIVE');
    setAddress('TP. Nha Trang, Khánh Hòa');
    setPhone('');
    setEmail('');
    setTaxCode('');

    setTimeout(() => {
      setSuccessToast('');
    }, 4000);
  };


  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 pb-16 antialiased">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Success Toast */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-sm flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>{successToast}</span>
            </div>
            <button onClick={() => setSuccessToast('')} className="text-white/80 hover:text-white font-mono text-xs">✕</button>
          </div>
        )}

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2.5 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-200">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                  Quản Lý Danh Bạ Hội Viên
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Quản trị hồ sơ doanh nhân, cấp phát thẻ số NFC và quản lý sinh hoạt Hội
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm py-5 px-4 shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Thêm & Cấp Thẻ Hội Viên Mới
            </Button>
          </div>
        </div>

        {/* 3 Metric Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hội Viên Chính Thức</span>
              <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10.5px]">ACTIVE</Badge>
            </div>
            <div className="text-3xl font-black text-slate-900 font-heading">{state.identities.length}</div>
            <p className="text-[12px] text-emerald-600 font-semibold">↑ 100% Đã xác thực danh tính</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Doanh Nghiệp Trực Thuộc</span>
              <Building2 className="w-4 h-4 text-[#FF6B00]" />
            </div>
            <div className="text-3xl font-black text-[#FF6B00] font-heading">{state.identities.length}</div>
            <p className="text-[12px] text-slate-500">Đại diện pháp nhân kinh doanh</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Thẻ NFC Kích Hoạt</span>
              <CreditCard className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-600 font-heading">{state.identities.length}</div>
            <p className="text-[12px] text-emerald-600 font-semibold">Tỷ lệ sử dụng 1-Chạm: 96%</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Tìm kiếm hội viên theo họ tên, chức danh, doanh nghiệp..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Tổng số:</span>
            <Badge className="bg-slate-100 text-slate-700 border-slate-300 font-mono text-xs">
              {filteredMembers.length} Hội Viên
            </Badge>
          </div>
        </div>

        {/* Members List Grid */}
        <div className="space-y-3">
          {filteredMembers.map((m, index) => {
            const companyName = m.businesses && m.businesses[0] ? m.businesses[0].businessName : 'Tập đoàn Công nghệ Số A+ (APLUSVN)';
            const profileLink = m.username === 'johnnylong' ? '/p/hoanglong' : `/p/${m.username || m.id}`;
            const memberCard = state.cards.find(c => c.personIdentityId === m.id && c.status === 'ACTIVE') || state.cards.find(c => c.personIdentityId === m.id);

            return (
              <div
                key={m.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                {/* Member Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={m.avatarUrl || '/avatar-johnny-long.jpg'}
                    alt={m.fullName}
                    className="w-14 h-14 rounded-2xl object-cover shadow-sm bg-slate-100 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-slate-900 font-heading">
                        {m.fullName}
                      </h3>
                      <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10.5px] font-bold">
                        {index === 0 ? 'Ủy Viên BCH' : 'Hội Viên Chính Thức'}
                      </Badge>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-mono">
                        {memberCard?.cardUid || 'NFC-ACTIVE'}
                      </Badge>
                    </div>

                    <p className="text-xs sm:text-sm font-semibold text-[#0066FF] leading-snug">
                      {m.title}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-600 truncate">
                      <Building2 className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                      <span className="truncate">{companyName}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Contact & Action Buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 justify-end">
                  <Link
                    href={profileLink}
                    className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#0066FF] hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all flex items-center gap-1 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Xem Profile Số
                  </Link>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => alert(`Thẻ NFC ${memberCard?.cardUid || 'NFC-EXECUTIVE'} của hội viên ${m.fullName} đang hoạt động bình thường!`)}
                    className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold py-2 cursor-pointer shadow-2xs"
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-1 text-[#FF6B00]" /> Thẻ NFC
                  </Button>
                </div>
              </div>
            );
          })}

        </div>

        {/* Modal: Thêm Hội Viên Mới */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF]">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 font-heading">Thêm & Cấp Thẻ Hội Viên Mới</h2>
                    <p className="text-xs text-slate-500">Khởi tạo định danh số & liên kết chip NFC</p>
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
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Chức danh</label>
                    <input
                      type="text"
                      placeholder="VD: Giám Đốc Điều Hành"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Số điện thoại</label>
                    <input
                      type="tel"
                      placeholder="VD: 0912.345.678"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
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
                    onChange={e => setBusinessName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Vị trí / Vai trò Hiệp Hội</label>
                    <select
                      value={association}
                      onChange={e => setAssociation(e.target.value)}
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
                    <label className="text-xs font-bold text-slate-700 block mb-1">Hạng Thẻ NFC Cấp Phát</label>
                    <select
                      value={cardType}
                      onChange={e => setCardType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    >
                      <option value="NFC_EXECUTIVE">Thẻ Kim Loại Đen VIP (NFC Executive)</option>
                      <option value="NFC_BUSINESS_PRO">Thẻ Doanh Nhân Pro (Business Pro)</option>
                      <option value="NFC_STANDARD">Thẻ Tiêu Chuẩn (Standard Member)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Địa chỉ Trụ sở Doanh nghiệp</label>
                  <input
                    type="text"
                    placeholder="VD: Tầng 8, Tòa nhà ASIA, 25 Lê Lợi, TP. Nha Trang, Khánh Hòa"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email làm việc <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      required
                      placeholder="VD: minh.tran@bienxanh.vn"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mã số thuế</label>
                    <input
                      type="text"
                      placeholder="VD: 4201998877"
                      value={taxCode}
                      onChange={e => setTaxCode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                    />
                  </div>
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
      </main>
    </div>
  );
}

