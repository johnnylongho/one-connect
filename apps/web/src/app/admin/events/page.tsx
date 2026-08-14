'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { useOneConnectStore } from '@/lib/store';
import { Calendar, Plus, MapPin, Users, CheckCircle2, Clock } from 'lucide-react';

export default function EventManagementAdminPage() {
  const { state } = useOneConnectStore();
  const [showModal, setShowModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('Nha Trang, Khánh Hòa');

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <Navbar />

      <main className="app-container max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
              <Calendar className="w-6 h-6 text-purple-400" /> Quản Lý Sự Kiện Hội/CLB (SCR-C03)
            </h1>
            <p className="text-xs text-gray-400">
              Khởi tạo sự kiện mới, quản lý cổng đăng ký trực tuyến & vé mời
            </p>
          </div>

          <button onClick={() => setShowModal(true)} className="btn-primary text-xs shadow-[0_0_15px_rgba(0,229,255,0.3)]">
            <Plus className="w-4 h-4" /> Khởi Tạo Sự Kiện Mới
          </button>
        </div>

        {/* Existing Events Table */}
        <div className="space-y-4">
          {state.events.map(evt => (
            <div key={evt.id} className="glass-panel p-6 border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="badge-purple">{evt.status}</span>
                  <span className="text-xs text-cyan-300 font-mono">Slug: {evt.slug}</span>
                </div>
                <h3 className="text-lg font-bold text-white font-['Outfit']">{evt.name}</h3>
                <p className="text-xs text-gray-300 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {evt.locationName}
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-right">
                  <p className="text-gray-400">Số lượng Check-in</p>
                  <p className="text-lg font-black text-cyan-400 font-['Outfit']">{evt.checkInCount} / {evt.registrationCount}</p>
                </div>

                <button className="btn-secondary text-xs">
                  Chỉnh Sửa
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Event Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setShowModal(false)}>
            <div className="bg-[#0f172a] border border-cyan-500/40 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h4 className="font-bold text-white text-base flex items-center gap-2 font-['Outfit']">
                  <Calendar className="w-5 h-5 text-cyan-400" /> Khởi Tạo Sự Kiện Mới (SCR-C03)
                </h4>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">✕</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-gray-300 font-semibold mb-1 block">Tên Sự Kiện Giao Thương</label>
                  <input
                    type="text"
                    placeholder="VD: StartUp Deal Day 2026"
                    value={eventName}
                    onChange={e => setEventName(e.target.value)}
                    className="input-glass"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-semibold mb-1 block">Địa Điểm Tổ Chức</label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    className="input-glass"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 text-xs">
                  Hủy
                </button>
                <button
                  onClick={() => {
                    alert(`Đã khởi tạo sự kiện "${eventName || 'Mới'}" thành công!`);
                    setShowModal(false);
                  }}
                  className="btn-primary flex-1 text-xs"
                >
                  Xuất Bản Sự Kiện
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
