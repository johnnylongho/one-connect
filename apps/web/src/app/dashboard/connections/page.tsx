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
  ArrowRight,
  CheckCircle2,
  Search,
  Filter,
  ArrowLeft,
  Building2,
  Lock,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MyConnectionsPage() {
  const { state, currentIdentity, acceptConnection } = useOneConnectStore();
  const [filter, setFilter] = useState<'ALL' | 'CONNECTED' | 'PENDING'>('ALL');
  const [search, setSearch] = useState('');

  // Find connections related to current user
  const userConns = state.connections.filter(
    (c) => c.requesterIdentityId === state.currentIdentityId || c.receiverIdentityId === state.currentIdentityId
  );

  const filteredConns = userConns.filter((c) => {
    if (filter === 'CONNECTED') return c.status === 'CONNECTED';
    if (filter === 'PENDING') return c.status === 'PENDING';
    return true;
  }).filter((c) => {
    if (!search.trim()) return true;
    const partnerId = c.requesterIdentityId === state.currentIdentityId ? c.receiverIdentityId : c.requesterIdentityId;
    const partner = state.identities.find((i) => i.id === partnerId);
    if (!partner) return false;
    const q = search.toLowerCase();
    return (
      partner.fullName.toLowerCase().includes(q) ||
      (partner.title ? partner.title.toLowerCase().includes(q) : false) ||
      (partner.businesses[0]?.businessName ? partner.businesses[0].businessName.toLowerCase().includes(q) : false)
    );
  });

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-16">
      {/* TOP BRAND HEADER */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-4 sticky top-0 z-30 backdrop-blur-md bg-slate-950/90 shadow-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors text-slate-300">
              <ArrowLeft className="w-4 h-4" />
            </Link>

            {/* Logo One Connect */}
            <div className="relative p-[1.5px] rounded-xl bg-gradient-to-r from-[#0066FF] to-[#FF6B00] shadow-md shadow-orange-500/20 shrink-0">
              <div className="bg-slate-950 px-2.5 py-1 rounded-[10px] flex items-center justify-center">
                <img
                  src="/one_connect_final_logo_orange.png"
                  alt="One Connect Logo"
                  className="h-7 sm:h-8 w-auto object-contain"
                />
              </div>
            </div>

            <div>
              <h1 className="text-base sm:text-lg font-black text-white tracking-tight font-['Outfit']">
                Mạng Lưới Kết Nối B2B
              </h1>
              <p className="text-[11px] text-[#00C2FF] font-medium italic">
                One Identity, Connect Everywhere.
              </p>
            </div>
          </div>

          <Badge variant="outline" className="text-[10px] bg-[#0066FF]/10 text-[#00C2FF] border-[#0066FF]/30 font-bold">
            PDPL 91/2025 COMPLIANT
          </Badge>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Title & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#00C2FF]" /> Quản Lý Danh Bạ & Consent (SCR-B02)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Danh bạ kết nối 2 chiều gắn bối cảnh sự kiện thực tế
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md shadow-blue-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Tất Cả ({userConns.length})
            </button>
            <button
              onClick={() => setFilter('CONNECTED')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filter === 'CONNECTED'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Đã Consent ({userConns.filter((c) => c.status === 'CONNECTED').length})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                filter === 'PENDING'
                  ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Chờ Duyệt ({userConns.filter((c) => c.status === 'PENDING').length})
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Tìm kiếm đối tác theo tên, chức danh, doanh nghiệp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00C2FF]"
          />
        </div>

        {/* Connections List */}
        <div className="space-y-3">
          {filteredConns.length === 0 ? (
            <div className="p-10 rounded-2xl bg-slate-900/80 border border-slate-800 text-center text-slate-400 space-y-3">
              <Users className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-xs font-medium">Chưa có kết nối nào tương ứng với bộ lọc.</p>
            </div>
          ) : (
            filteredConns.map((conn) => {
              const partnerId =
                conn.requesterIdentityId === state.currentIdentityId
                  ? conn.receiverIdentityId
                  : conn.requesterIdentityId;
              const partner = state.identities.find((i) => i.id === partnerId);
              if (!partner) return null;

              const isIncomingPending =
                conn.status === 'PENDING' && conn.receiverIdentityId === state.currentIdentityId;

              return (
                <div
                  key={conn.id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-[#00C2FF]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={partner.avatarUrl}
                      alt={partner.fullName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#00C2FF]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{partner.fullName}</h3>
                        {conn.status === 'CONNECTED' ? (
                          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Mutual Consent
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] bg-[#FF6B00]/10 text-[#FF6B00] border-[#FF6B00]/30 font-bold gap-1">
                            <Clock className="w-3 h-3" /> Consent Pending
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-[#00C2FF] font-medium">{partner.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                        {partner.businesses[0]?.businessName || 'Doanh nghiệp Hội viên'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Ngữ cảnh: {conn.contextEventName || 'Diễn Đàn Kết Nối Doanh Nghiệp 2026'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    {isIncomingPending ? (
                      <button
                        onClick={() => acceptConnection(conn.id)}
                        className="bg-gradient-to-r from-[#0066FF] to-[#00C2FF] text-white font-bold text-xs py-2 px-3 rounded-xl shadow-lg shadow-blue-500/20 flex items-center gap-1.5 cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Chấp Nhận Consent
                      </button>
                    ) : (
                      <Link
                        href={`/dashboard/connections/${conn.id}`}
                        className="bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#00C2FF]" /> Ghi Chú & Context ({conn.notesCount || 0}) <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
