import React from 'react';
import { EventKpiReportView } from '@/components/reports/event-kpi-report';
import { ToastProvider } from '@/components/ui/toast';

export const metadata = {
  title: 'Báo Cáo & Đo Lường KPI Sự Kiện | One Connect',
  description: 'Báo cáo chỉ số KPIs sự kiện, thống kê check-in, kết nối B2B và đánh giá tự động từ AI.',
};

export default function ReportsPage() {
  return (
    <ToastProvider>
      <EventKpiReportView />
    </ToastProvider>
  );
}
