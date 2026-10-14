'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Target,
  Download,
  Phone,
  Mail,
  Building,
  CheckCircle2,
  Clock,
  Filter,
  RefreshCw,
  ExternalLink,
  Flame,
  Award,
  FileSpreadsheet,
  Sparkles,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  MarketDemandSummary,
  MarketLead,
  PackageType,
  PACKAGE_INFO,
} from '@/lib/services/market-demand-service';
import { exportMarketLeadsToExcel } from '@/lib/excel-service';

export function MarketDemandReport() {
  const [data, setData] = useState<MarketDemandSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('ALL');
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/market-demand/stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Fetch stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatsSilently = async () => {
    try {
      const res = await fetch('/api/market-demand/stats');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.warn('Silent stats update error:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStatsSilently, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (leadId: string, newStatus: MarketLead['status']) => {
    try {
      setUpdatingLeadId(leadId);
      const res = await fetch('/api/market-demand/lead', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status: newStatus }),
      });
      if (res.ok) {
        if (data) {
          setData({
            ...data,
            leads: data.leads.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l)),
          });
        }
      }
    } catch (err) {
      console.error('Update status error:', err);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleExportExcel = () => {
    if (!data || !data.leads || data.leads.length === 0) {
      alert('Không có dữ liệu leads để xuất báo cáo.');
      return;
    }
    exportMarketLeadsToExcel(data.leads);
  };

  if (loading && !data) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-2xs space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Đang tải dữ liệu đo lường thị trường từ Supabase Cloud...</p>
      </div>
    );
  }

  if (!data) return null;

  const filteredLeads =
    selectedFilter === 'ALL'
      ? data.leads
      : data.leads.filter((l) => l.packageType === selectedFilter);

  return (
    <div className="space-y-6">
      {/* 1. METRICS CARDS (COMMAND CENTER STATS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Clicks & Surveys */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase text-[10px]">Lượt Quan Tâm Thị Trường</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {data.totalClicks + (data.totalVotes || 0)}{' '}
            <span className="text-xs font-normal text-slate-400">lượt</span>
          </div>
          <p className="text-[11px] text-blue-600 font-medium">
            {data.totalVotes || 0} phiếu survey • {data.totalClicks} clicks
          </p>
        </div>

        {/* Metric 2: Total Leads */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase text-[10px]">Hồ Sơ Leads Thu Thập</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {data.totalLeads}{' '}
            <span className="text-xs font-normal text-slate-400">hồ sơ</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Xác thực số điện thoại thực tế
          </p>
        </div>

        {/* Metric 3: Conversion Rate */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-semibold uppercase text-[10px]">Tỷ Lệ Chuyển Đổi Lead</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">
            {data.conversionRate}%
          </div>
          <p className="text-[11px] text-purple-600 font-medium">
            Tỷ lệ gửi form / lượt tương tác
          </p>
        </div>

        {/* Metric 4: Top Leading Solution */}
        <div className="bg-white rounded-2xl p-5 border border-blue-200/90 shadow-2xs space-y-2 bg-gradient-to-br from-blue-50/40 to-white">
          <div className="flex items-center justify-between text-xs text-blue-600">
            <span className="font-semibold uppercase text-[10px]">Gói Dẫn Đầu Nhu Cầu</span>
            <div className="p-2 rounded-xl bg-blue-100 text-orange-500">
              <Flame className="w-4 h-4 fill-orange-500" />
            </div>
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 truncate" title={data.topPackage.name}>
            {data.topPackage.name}
          </div>
          <p className="text-[11px] text-blue-700 font-bold">
            {data.topPackage.percentage}% thị phần quan tâm
          </p>
        </div>
      </div>

      {/* 2. VISUAL MARKET DEMAND SHARE PROGRESS BARS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Tỷ Lệ Quan Tâm Của Thị Trường Theo Từng Gói Giải Pháp
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dữ liệu tổng hợp từ các lượt khảo sát quan tâm và lượt click tư vấn giải pháp thực tế
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchStats}
              className="gap-1.5 text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl h-8 cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Làm Mới
            </Button>
            <Button
              size="sm"
              onClick={handleExportExcel}
              className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-8 px-3.5 shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Xuất Excel
            </Button>
          </div>
        </div>

        <div className="space-y-5 pt-1">
          {data.packageStats.map((pkg) => {
            const isTop = pkg.type === data.topPackage.type;
            const barColor =
              pkg.type === 'MICE_ENTERPRISE'
                ? 'bg-blue-600'
                : pkg.type === 'ENTREPRENEUR'
                ? 'bg-cyan-500'
                : 'bg-emerald-500';

            return (
              <div key={pkg.type} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{pkg.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-[9.5px] font-bold ${
                        isTop ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {pkg.badge}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
                    <span>
                      <strong className="text-blue-600">{pkg.votes || 0}</strong>/100 khảo sát
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-slate-900">{pkg.clicks}</strong> clicks
                    </span>
                    <span>•</span>
                    <span>
                      <strong className="text-emerald-600">{pkg.leadsCount}</strong> Leads
                    </span>
                    <span>•</span>
                    <span className="font-extrabold text-blue-600 text-xs">{pkg.percentage}%</span>
                  </div>
                </div>

                {/* Custom Progress Bar */}
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${Math.max(5, pkg.percentage)}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-400">
                  Khách hàng mục tiêu: {pkg.targetAudience}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. MARKET LEADS MANAGEMENT TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              Danh Sách Khách Hàng Tiềm Năng (Market Leads)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hồ sơ liên hệ từ khách hàng để lại thông tin quan tâm và đăng ký tư vấn giải pháp (Supabase Realtime)
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'ALL', label: 'Tất cả' },
              { key: 'MICE_ENTERPRISE', label: 'Sự kiện MICE' },
              { key: 'ENTREPRENEUR', label: 'Cá nhân' },
              { key: 'ASSOCIATION', label: 'Hiệp hội' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFilter(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === f.key
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredLeads.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="font-bold text-slate-900 text-sm">
                  Chưa có Lead nào trong hệ thống (100% Dữ liệu thực tế)
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hệ thống đang hoạt động và tự động cập nhật thời gian thực từ Supabase. Khi khách hàng để lại thông tin hoặc đăng ký tại trang Gói Dịch Vụ (/services), danh sách sẽ xuất hiện ngay lập tức.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2.5 pt-2 flex-wrap">
                <a href="/services" target="_blank">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs font-bold rounded-xl border-slate-300 text-slate-700 bg-white hover:bg-slate-50 shadow-2xs cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Mở Trang Gói Dịch Vụ
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => {
                const isMice = lead.packageType === 'MICE_ENTERPRISE';
                const isAssoc = lead.packageType === 'ASSOCIATION';

                return (
                  <div
                    key={lead.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    {/* Left: Contact Info */}
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{lead.fullName}</span>
                        <Badge
                          className={`text-[9.5px] font-bold ${
                            isMice
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : isAssoc
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-800 border-slate-200'
                          }`}
                        >
                          {lead.packageName}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-slate-600">
                        {lead.companyName && (
                          <span className="flex items-center gap-1 font-medium">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            {lead.companyName}
                          </span>
                        )}
                        <a
                          href={`tel:${lead.phone}`}
                          className="flex items-center gap-1 font-bold text-blue-600 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {lead.phone}
                        </a>
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            className="flex items-center gap-1 text-slate-500 hover:text-blue-600"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            {lead.email}
                          </a>
                        )}
                      </div>

                      {lead.notes && (
                        <p className="text-slate-500 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                          <strong>Nhu cầu:</strong> {lead.notes}
                        </p>
                      )}

                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        Đăng ký lúc: {new Date(lead.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>

                    {/* Right: Status Dropdown & Fast Actions */}
                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                      <select
                        value={lead.status}
                        disabled={updatingLeadId === lead.id}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value as MarketLead['status'])}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer focus:outline-none ${
                          lead.status === 'NEW'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : lead.status === 'CONSULTING'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : lead.status === 'WON'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="NEW">Mới nhận</option>
                        <option value="CONTACTED">Đã liên hệ</option>
                        <option value="CONSULTING">Đang tư vấn &amp; Báo giá</option>
                        <option value="WON">Đã chốt hợp đồng</option>
                        <option value="LOST">Hủy / Không nhu cầu</option>
                      </select>

                      <a href={`tel:${lead.phone}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 px-2.5 text-xs font-bold border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl"
                        >
                          <Phone className="w-3.5 h-3.5" /> Gọi điện
                        </Button>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
