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
import { Progress } from '@/components/ui/progress';
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
    // Realtime polling every 6 seconds
    const interval = setInterval(fetchStatsSilently, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateTestLead = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/market-demand/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageType: 'MICE_ENTERPRISE',
          fullName: 'Đoàn Khách MICE Khánh Hòa (Test Lead)',
          phone: '0905123456',
          email: 'mice.khanhhoa@example.vn',
          companyName: 'Công ty Lữ hành & Sự kiện MICE',
          organizationType: 'Doanh nghiệp Sự kiện',
          notes: 'Yêu cầu tư vấn trạm Check-in NFC & thẻ kim loại cho diễn đàn 300 khách.',
          source: 'DASHBOARD_LIVE_TEST',
        }),
      });
      if (res.ok) {
        await fetchStats();
      }
    } catch (err) {
      console.error('Test lead creation error:', err);
    } finally {
      setLoading(false);
    }
  };

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
      <Card className="border-slate-200 bg-white p-8 text-center shadow-sm">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
        <p className="text-xs text-slate-500 font-medium">Đang tải dữ liệu đo lường thị trường...</p>
      </Card>
    );
  }

  if (!data) return null;

  const filteredLeads =
    selectedFilter === 'ALL'
      ? data.leads
      : data.leads.filter((l) => l.packageType === selectedFilter);

  return (
    <div className="space-y-6">
      {/* Top Banner & Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/60 via-blue-50/40 to-white p-5 rounded-2xl border border-emerald-100 shadow-xs">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> 100% DỮ LIỆU THỰC TẾ (SUPABASE CLOUD)
            </Badge>
            <span className="text-[11px] text-emerald-700 font-bold font-mono">REAL-TIME SYNC</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-heading mt-1">
            Đo Lường Mối Quan Tâm Thị Trường &amp; Danh Sách Leads
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Dữ liệu được ghi nhận thời gian thực từ hành vi truy cập và đăng ký của người dùng thực tế trên website.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchStats}
            className="gap-1.5 text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl h-9 cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Làm Mới
          </Button>
          <Button
            size="sm"
            onClick={handleExportExcel}
            className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 px-3.5 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" /> Xuất Excel
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCreateTestLead}
            className="gap-1.5 text-xs font-bold border-blue-300 text-blue-700 bg-blue-50/80 hover:bg-blue-100 rounded-xl h-9 px-3 cursor-pointer shadow-2xs"
            title="Tạo thử 1 lead thực tế vào Supabase để kiểm tra"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" /> + Thử Tạo Lead Realtime
          </Button>
        </div>
      </div>

      {/* 1. Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="border-slate-200 bg-white shadow-xs hover:border-blue-300 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Lượt Quan Tâm Thị Trường
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {data.totalClicks} <span className="text-xs font-normal text-slate-500">lượt</span>
            </div>
            <p className="text-[11px] text-blue-600 font-medium flex items-center gap-1 pt-0.5">
              <span>Clicks CTA &amp; Xem chi tiết</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-slate-200 bg-white shadow-xs hover:border-blue-300 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Số Leads Thu Thập
            </CardTitle>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {data.totalLeads} <span className="text-xs font-normal text-slate-500">hồ sơ</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 pt-0.5">
              <CheckCircle2 className="w-3 h-3" /> Đã xác thực SĐT &amp; Nhu cầu
            </p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-slate-200 bg-white shadow-xs hover:border-blue-300 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tỷ Lệ Chuyển Đổi Lead
            </CardTitle>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Target className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {data.conversionRate}%
            </div>
            <p className="text-[11px] text-purple-600 font-medium flex items-center gap-1 pt-0.5">
              <span>Tỷ lệ điền form / lượt click</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50/50 to-white shadow-xs hover:border-blue-400 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold text-[#0066FF] uppercase tracking-wider">
              Gói Dẫn Đầu Nhu Cầu
            </CardTitle>
            <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-base sm:text-lg font-black text-slate-900 font-heading truncate" title={data.topPackage.name}>
              {data.topPackage.name}
            </div>
            <p className="text-[11px] text-blue-700 font-bold flex items-center gap-1 pt-0.5">
              <span>{data.topPackage.percentage}% thị phần quan tâm</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Visual Market Demand Share Progress Bars */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-4 h-4 text-[#0066FF]" />
            Tỷ Lệ Quan Tâm Của Thị Trường Đối Với Từng Gói Sản Phẩm (Market Interest Share)
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Dữ liệu tổng hợp từ các lượt tương tác của khách hàng trên trang dịch vụ và các nút đăng ký tư vấn.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-5">
          {data.packageStats.map((pkg) => {
            const isTop = pkg.type === data.topPackage.type;
            const barColor =
              pkg.type === 'MICE_ENTERPRISE'
                ? 'bg-[#0066FF]'
                : pkg.type === 'ENTREPRENEUR'
                ? 'bg-cyan-500'
                : 'bg-emerald-500';

            return (
              <div key={pkg.type} className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
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
                      <strong className="text-slate-900">{pkg.clicks}</strong> lượt quan tâm
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
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${barColor}`}
                    style={{ width: `${Math.max(5, pkg.percentage)}%` }}
                  />
                </div>
                <div className="text-[11px] text-slate-500">
                  Khách hàng mục tiêu: {pkg.targetAudience}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 3. Market Leads Management Table */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <CardTitle className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0066FF]" />
              Danh Sách Khách Hàng Tiềm Năng (Market Leads)
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Hồ sơ liên hệ từ khách hàng để lại thông tin quan tâm và đăng ký tư vấn giải pháp.
            </CardDescription>
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
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedFilter === f.key
                    ? 'bg-[#0066FF] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="pt-4 p-0 sm:p-6 overflow-x-auto">
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
                    <ExternalLink className="w-3.5 h-3.5 text-[#0066FF]" /> Mở Trang Dịch Vụ
                  </Button>
                </a>
                <Button
                  size="sm"
                  onClick={handleCreateTestLead}
                  className="gap-1.5 text-xs font-bold rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Gửi Thử 1 Lead Thật Vào Supabase
                </Button>
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
                    className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
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
                        <p className="text-slate-500 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200/60 leading-relaxed">
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
        </CardContent>
      </Card>
    </div>
  );
}
