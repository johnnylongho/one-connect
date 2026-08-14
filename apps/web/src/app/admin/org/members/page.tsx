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
  const { state } = useOneConnectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('ALL');

  const filteredMembers = state.identities.filter(m => {
    const matchesSearch =
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.displayName && m.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.title && m.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (m.businesses && m.businesses[0]?.businessName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-900 pb-16 antialiased">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 space-y-6">
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
              onClick={() => alert('Chức năng mời hội viên mới: Đã tạo mã QR liên kết đăng ký!')}
              className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm py-5 px-4 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Mời Hội Viên Mới
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
            const position = m.businesses && m.businesses[0] ? m.businesses[0].position : m.title;
            const profileLink = m.username === 'johnnylong' ? '/p/hoanglong' : `/p/${m.username || m.id}`;

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
                        {index === 0 ? 'Ủy Viên BCH' : 'Hội Viên VIP'}
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
                    onClick={() => alert(`Cấp phát / Cập nhật thẻ NFC cho hội viên: ${m.fullName}`)}
                    className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold py-2 cursor-pointer shadow-2xs"
                  >
                    <CreditCard className="w-3.5 h-3.5 mr-1 text-[#FF6B00]" /> Cấp Thẻ NFC
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
