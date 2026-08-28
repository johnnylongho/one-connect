'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import {
  FileText,
  Lock,
  Plus,
  Calendar,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Tag,
  Star,
  Clock,
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Share2,
  Download,
  Trash2,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RelationshipMemoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const connId = (params?.id as string) || '';
  const { state, addNote } = useOneConnectStore();

  const conn = state.connections.find(c => c.id === connId) || state.connections[0];
  const partnerId = conn?.requesterIdentityId === state.currentIdentityId ? conn?.receiverIdentityId : conn?.requesterIdentityId;
  const partner = state.identities.find(i => i.id === partnerId) || state.identities[1] || state.identities[0];

  const notes = state.notes.filter(n => n.connectionId === conn?.id && n.ownerIdentityId === state.currentIdentityId);

  const [newNoteContent, setNewNoteContent] = useState('');
  const [leadStatus, setLeadStatus] = useState<'NEW' | 'WARM' | 'HOT'>('HOT');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !conn) return;
    addNote(conn.id, newNoteContent);
    setNewNoteContent('');
  };

  if (!conn || !partner) return null;

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 pb-20 antialiased selection:bg-[#0066FF] selection:text-white">
      
      {/* 1. TOP APP HEADER */}
      <header className="bg-white/95 border-b border-slate-200/80 px-4 sm:px-8 py-3.5 sticky top-0 z-30 backdrop-blur-md shadow-xs">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/connections"
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-all active:scale-95 shadow-2xs"
              title="Quay lại Danh Sách Mạng Lưới"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF] border border-blue-100 shrink-0">
              <FileText className="w-5 h-5" />
            </div>

            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Bộ Nhớ Quan Hệ (Relationship Memory)</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-[#0066FF] border border-blue-200">
                  SCR-B03
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Ghi chú ngữ cảnh riêng tư & Quản lý bối cảnh hợp tác
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className="text-[10px] sm:text-[11px] bg-emerald-50 text-emerald-700 border-emerald-300 font-bold px-2.5 py-1 flex items-center gap-1 shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mutual Consent</span>
          </Badge>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        {/* 2. PARTNER EXECUTIVE HERO BANNER */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-slate-50 border border-slate-200/90 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <img
                  src={partner.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                  alt={partner.fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200 block"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(partner.fullName)}&backgroundColor=0066ff,00c2ff`;
                  }}
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-white border-2 border-white shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {partner.fullName}
                  </h2>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] font-bold gap-1 px-2 py-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Đã Mở Khóa 2 Chiều
                  </Badge>
                </div>

                <p className="text-xs sm:text-sm text-[#0066FF] font-bold">
                  {partner.title || 'Chủ Tịch HĐQT & Tổng Giám Đốc'}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-600 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-[#FF6B00] shrink-0" />
                  <span>{partner.businesses?.[0]?.businessName || 'Tập đoàn Khách sạn & Du lịch MICE Nha Trang Pearl'}</span>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1 text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-md font-mono">
                    <Calendar className="w-3 h-3 text-slate-500" /> Ngày gặp: 20/08/2026
                  </span>
                  <span className="text-slate-600">
                    {conn.contextEventName || 'Diễn Đàn Doanh Nhân Trẻ Khánh Hòa 2026'}
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${partner.phone || '0905123456'}`}
                className="px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0066FF] font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow-2xs"
              >
                <Phone className="w-4 h-4" />
                <span>Gọi Điện</span>
              </a>
              <a
                href={partner.website || 'https://one-connect-network.vercel.app'}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 active:scale-95 shadow-2xs"
              >
                <ExternalLink className="w-4 h-4 text-[#FF6B00]" />
                <span>Xem Profile</span>
              </a>
            </div>
          </div>
        </section>

        {/* 3. RELATIONSHIP MEMORY & OWNER-ONLY NOTES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Notes Column */}
          <div className="md:col-span-8 space-y-6">
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#0066FF]" />
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Ghi Chú Ngữ Cảnh Riêng Tư (Pre-CRM Memory)
                  </h3>
                </div>
                <span className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-mono font-bold">
                  <Lock className="w-3 h-3 text-amber-600" /> Chỉ Bạn Thấy
                </span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  rows={3}
                  placeholder="Ghi chú về nhu cầu của đối tác (VD: Cần tìm nhà cung ứng phần mềm check-in, hẹn cafe sáng thứ 3 tại Nha Trang...)"
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0066FF] focus:ring-2 focus:ring-[#0066FF]/10 transition-all shadow-inner"
                />
                <Button
                  type="submit"
                  className="bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Thêm Ghi Chú Ngữ Cảnh
                </Button>
              </form>

              {/* Notes List */}
              <div className="space-y-2.5 pt-2">
                {notes.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center text-slate-400 text-xs">
                    Chưa có ghi chú nào cho mối quan hệ này. Hãy thêm ghi chú đầu tiên ở trên!
                  </div>
                ) : (
                  notes.map(n => (
                    <div key={n.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1.5 text-xs sm:text-sm">
                      <p className="text-slate-800 leading-relaxed font-medium">{n.content}</p>
                      <p className="text-[10.5px] text-slate-400 font-mono flex items-center gap-1 pt-1">
                        <Clock className="w-3 h-3 text-cyan-600" /> {new Date(n.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>

          {/* Lead Status & Context Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500" /> Phân Loại Tiềm Năng (Lead Tier)
              </h3>

              <div className="space-y-2">
                <label className="text-xs text-slate-500 font-semibold block">Mức Độ Tương Tác</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['NEW', 'WARM', 'HOT'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setLeadStatus(st)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        leadStatus === st
                          ? st === 'HOT'
                            ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                            : 'bg-amber-50 text-amber-700 border-amber-300 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st === 'HOT' ? 'HOT' : st === 'WARM' ? 'WARM' : 'NEW'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                <p className="font-bold text-slate-900">Bối cảnh điểm danh sự kiện:</p>
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 space-y-1">
                  <p className="text-[#0066FF] font-bold text-xs">{conn.contextEventName || 'Diễn Đàn Doanh Nhân Trẻ Khánh Hòa 2026'}</p>
                  <p className="text-[11px] text-slate-500">Đã xác nhận điểm danh check-in bằng trạm NFC siêu tốc</p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </main>

    </div>
  );
}
