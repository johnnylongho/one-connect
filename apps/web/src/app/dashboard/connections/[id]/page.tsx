'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
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
  ArrowLeft
} from 'lucide-react';

export default function RelationshipMemoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const connId = (params?.id as string) || '';
  const { state, addNote } = useOneConnectStore();

  const conn = state.connections.find(c => c.id === connId) || state.connections[0];
  const partnerId = conn?.requesterIdentityId === state.currentIdentityId ? conn?.receiverIdentityId : conn?.requesterIdentityId;
  const partner = state.identities.find(i => i.id === partnerId) || state.identities[1];

  const notes = state.notes.filter(n => n.connectionId === conn?.id && n.ownerIdentityId === state.currentIdentityId);

  const [newNoteContent, setNewNoteContent] = useState('');
  const [leadStatus, setLeadStatus] = useState<'NEW' | 'WARM' | 'HOT'>('WARM');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !conn) return;
    addNote(conn.id, newNoteContent);
    setNewNoteContent('');
  };

  if (!conn || !partner) return null;

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <Navbar />

      <main className="app-container max-w-3xl space-y-6">
        <button onClick={() => router.push('/dashboard/connections')} className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Quay Lại Danh Sách Mạng Lưới
        </button>

        {/* Partner Header Banner */}
        <div className="glass-panel p-6 border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <img
              src={partner.avatarUrl}
              alt={partner.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.3)]"
            />
            <div>
              <h1 className="text-2xl font-bold text-white font-['Outfit'] flex items-center justify-center sm:justify-start gap-2">
                {partner.fullName}
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </h1>
              <p className="text-xs text-cyan-300 font-semibold">{partner.title}</p>
              <p className="text-xs text-gray-400 mt-1">{partner.businesses[0]?.businessName}</p>
            </div>
          </div>

          <div className="text-center sm:text-right space-y-1">
            <span className="badge-emerald">
              <CheckCircle2 className="w-3.5 h-3.5" /> Mutual Consent
            </span>
            <p className="text-[11px] text-gray-400">Gặp lần đầu: {conn.contextEventName}</p>
          </div>
        </div>

        {/* Relationship Memory & Owner-Only Context Notes (SCR-B03) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Notes Column */}
          <div className="md:col-span-8 space-y-6">
            <div className="glass-panel p-6 space-y-4 border-cyan-500/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2 font-['Outfit']">
                  <FileText className="w-5 h-5 text-emerald-400" /> Ghi Chú Ngữ Cảnh Riêng Tư (Relationship Notes)
                </h3>
                <span className="text-[11px] text-amber-400 flex items-center gap-1 font-mono">
                  <Lock className="w-3 h-3" /> chỉ bạn mới thấy
                </span>
              </div>

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  rows={3}
                  placeholder="Viết ghi chú riêng tư về bối cảnh trao đổi, nhu cầu hợp tác, dự án..."
                  value={newNoteContent}
                  onChange={e => setNewNoteContent(e.target.value)}
                  className="input-glass text-xs"
                />
                <button type="submit" className="btn-primary text-xs py-2 px-4 shadow-[0_0_15px_rgba(0,229,255,0.25)]">
                  <Plus className="w-4 h-4" /> Thêm Ghi Chú Riêng Tư
                </button>
              </form>

              {/* Existing Notes List */}
              <div className="space-y-3 pt-2">
                {notes.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Chưa có ghi chú nào cho mối quan hệ này.</p>
                ) : (
                  notes.map(n => (
                    <div key={n.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 text-xs">
                      <p className="text-gray-200 leading-relaxed">{n.content}</p>
                      <p className="text-[10px] text-cyan-400 font-mono flex items-center gap-1 pt-1">
                        <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Lead Status & Context Sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="glass-panel p-5 space-y-4 border-cyan-500/30">
              <h3 className="font-bold text-white text-sm flex items-center gap-2 font-['Outfit']">
                <Star className="w-4 h-4 text-amber-400" /> Trạng Thái Lead (Basic Lead)
              </h3>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-semibold block">Mức Độ Tiềm Năng Lead</label>
                <div className="grid grid-cols-3 gap-1">
                  {(['NEW', 'WARM', 'HOT'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setLeadStatus(st)}
                      className={`py-1.5 rounded text-xs font-bold border transition-all ${
                        leadStatus === st
                          ? st === 'HOT' ? 'bg-rose-500/20 text-rose-300 border-rose-400' : 'bg-amber-500/20 text-amber-300 border-amber-400'
                          : 'bg-white/5 border-white/10 text-gray-400'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-3 space-y-2 text-xs text-gray-300">
                <p className="font-semibold text-white">Bối cảnh gặp mặt đầu tiên:</p>
                <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                  <p className="text-cyan-300 font-medium">{conn.contextEventName}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Đã xác nhận điểm danh check-in bằng NFC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
