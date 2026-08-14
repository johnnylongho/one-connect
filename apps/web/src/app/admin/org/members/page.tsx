'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useOneConnectStore } from '@/lib/store';
import { Users, ShieldCheck, Plus, Search, CheckCircle2 } from 'lucide-react';

export default function MemberDirectoryAdminPage() {
  const { state } = useOneConnectStore();

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <Navbar />

      <main className="app-container max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-400" /> Quản Lý Danh Bạ Hội Viên (SCR-C02)
            </h1>
            <p className="text-xs text-gray-400">
              Phân quyền thành viên, cấp lại thẻ NFC và theo dõi trạng thái hoạt động sinh hoạt Hội
            </p>
          </div>

          <button onClick={() => alert('Đã mời thành viên mới tham gia Hội!')} className="btn-primary text-xs">
            <Plus className="w-4 h-4" /> Mời Hội Viên Mới
          </button>
        </div>

        {/* Members Table */}
        <div className="glass-panel overflow-hidden border-cyan-500/30">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-bold text-white text-sm">Danh Sách {state.identities.length} Hội Viên Chính Thức</h3>
            <span className="badge-emerald">ACTIVE MEMBERS</span>
          </div>

          <div className="divide-y divide-white/5">
            {state.identities.map(m => (
              <div key={m.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <img src={m.avatarUrl} alt={m.fullName} className="w-12 h-12 rounded-xl object-cover border border-cyan-400/50" />
                  <div>
                    <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                      {m.fullName}
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    </h4>
                    <p className="text-xs text-cyan-300">{m.title}</p>
                    <p className="text-[11px] text-gray-400">{m.businesses[0]?.businessName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="badge-purple">Ủy Viên BCH</span>
                  <span className="text-gray-400 font-mono">ID: {m.username}</span>
                  <button className="btn-secondary text-[11px] py-1 px-2.5">
                    Phân Quyền
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
