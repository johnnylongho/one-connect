import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vận Hành Trạm Check-in Event | One Connect Network',
  description: 'Trạm điều phối tiếp đón, điểm danh đại biểu 1-chạm NFC và QR Code với SLA dưới 0.8 giây.',
};

export default function OperatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      {children}
    </div>
  );
}
