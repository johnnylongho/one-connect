'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useOneConnectStore } from '@/lib/store';
import { Zap, Play, CheckCircle2, Users, MapPin, ArrowRight } from 'lucide-react';

export default function EventOperationsHome() {
  const { state } = useOneConnectStore();

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      <Navbar />

      <main className="app-container max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-heading flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" /> Vận Hành Trạm Check-in Event (SCR-D01)
            </h1>
            <p className="text-xs text-gray-400">
              Chọn sự kiện để mở giao diện trạm điểm danh NFC/QR tốc độ cao (&lt; 1s)
            </p>
          </div>
        </div>

        {/* Operational Events List */}
        <div className="space-y-4">
          {state.events.map(evt => (
            <div key={evt.id} className="glass-panel p-6 border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <span className="badge-amber">ĐANG VẬN HÀNH TRẠM CỬA</span>
                <h3 className="text-xl font-bold text-white font-heading">{evt.name}</h3>
                <p className="text-xs text-gray-300 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {evt.locationName}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/operator/checkin"
                  className="btn-primary w-full sm:w-auto text-xs shadow-[0_0_20px_rgba(245,158,11,0.3)] bg-gradient-to-r from-amber-500 to-orange-600 border-none text-black font-extrabold"
                >
                  <Play className="w-4 h-4 fill-black" /> Mở Trạm Check-in NFC/QR &lt; 1s
                </Link>

                <Link href="/operator/attendees" className="btn-secondary w-full sm:w-auto text-xs">
                  <Users className="w-4 h-4 text-cyan-400" /> Tra Cứu Attendee Directory
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
