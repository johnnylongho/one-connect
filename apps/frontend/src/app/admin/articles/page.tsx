'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  FileText,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  Filter,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getArticles,
  deleteArticle,
  Article,
  CATEGORY_LABELS,
} from '@/lib/services/articles';
import { useOneConnectStore } from '@/lib/store';

export default function AdminArticlesListPage() {
  const router = useRouter();
  const { currentIdentity } = useOneConnectStore();

  const [articles, setArticles] = useState<Article[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getArticles({
        status: filterStatus === 'ALL' ? undefined : filterStatus,
        query: searchQuery,
      });
      setArticles(data);
    } catch (e) {
      console.error('Failed to load articles in admin', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filterStatus, searchQuery]);

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}" không?`)) {
      await deleteArticle(id);
      loadData();
    }
  };

  // Metrics
  const totalArticles = articles.length;
  const publishedCount = articles.filter((a) => a.status === 'PUBLISHED').length;
  const draftCount = articles.filter((a) => a.status === 'DRAFT').length;
  const totalViews = articles.reduce((sum, a) => sum + (a.viewsCount || 0), 0);

  return (
    <div className="space-y-6 w-full pb-16 antialiased">
      {/* 1. PAGE HEADER */}
      <PageHeader
        supertitle="ONE CONNECT NETWORK • HỆ THỐNG QUẢN TRỊ NỘI DUNG (CMS)"
        title="Quản Lý Bài Viết &amp; Truyền Thông SEO"
        description="Đăng bài viết mới, quản lý nội dung cẩm nang MICE, chiến lược ESG và tối ưu hóa từ khóa SEO trên Google."
        icon={FileText}
        badge="ADMIN CMS"
        badgeVariant="blue"
        backHref="/admin/org"
        backLabel="Về Quản Trị"
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/posts"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Xem Trang Tin Tức
            </Link>
            <Link
              href="/admin/articles/editor"
              className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs shadow-blue-500/25 active:scale-95"
            >
              <Plus className="w-4 h-4" /> Viết Bài Viết Mới
            </Link>
          </div>
        }
      />

      {/* 2. STATS KPI METRICS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2">
          <span className="text-xs font-bold text-slate-500">Tổng Bài Viết</span>
          <div className="text-2xl font-black text-slate-900 font-mono">{totalArticles}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2">
          <span className="text-xs font-bold text-emerald-600">Đã Xuất Bản</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">{publishedCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2">
          <span className="text-xs font-bold text-amber-600">Bản Nháp (Draft)</span>
          <div className="text-2xl font-black text-amber-600 font-mono">{draftCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col justify-between space-y-2">
          <span className="text-xs font-bold text-blue-600">Tổng Lượt Đọc</span>
          <div className="text-2xl font-black text-blue-600 font-mono">{totalViews.toLocaleString()}</div>
        </div>
      </div>

      {/* 3. SEARCH & STATUS FILTER */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm bài viết..."
            className="w-full pl-10 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất Cả
          </button>
          <button
            onClick={() => setFilterStatus('PUBLISHED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'PUBLISHED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Đã Xuất Bản
          </button>
          <button
            onClick={() => setFilterStatus('DRAFT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              filterStatus === 'DRAFT' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Bản Nháp
          </button>
        </div>
      </div>

      {/* 4. ARTICLES DATA TABLE */}
      <div className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
        {isLoading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span className="text-xs text-slate-500 font-medium">Đang tải danh sách bài viết...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <div className="text-sm font-bold text-slate-700">Chưa có bài viết nào</div>
            <Link href="/admin/articles/editor">
              <Button size="sm" className="bg-[#0066FF] text-white font-bold rounded-xl text-xs">
                Tạo bài viết đầu tiên
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/80 font-bold text-slate-600">
                  <th className="py-3 px-4">Bài Viết</th>
                  <th className="py-3 px-4">Chuyên Mục</th>
                  <th className="py-3 px-4">Trạng Thái</th>
                  <th className="py-3 px-4">Lượt Xem</th>
                  <th className="py-3 px-4">Ngày Đăng</th>
                  <th className="py-3 px-4 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {articles.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3 px-4 max-w-sm">
                      <div className="flex items-center gap-3">
                        {item.coverImage && (
                          <img
                            src={item.coverImage}
                            alt=""
                            className="w-12 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        )}
                        <div>
                          <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                          <div className="text-[11px] text-slate-400 line-clamp-1">{item.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] font-bold bg-slate-50 text-slate-700">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      {item.status === 'PUBLISHED' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Đã Xuất Bản
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Bản Nháp
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">
                      {item.viewsCount || 0}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(item.publishedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/posts/${item.slug}`}
                          target="_blank"
                          title="Xem trước trên website"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/articles/editor?id=${item.id}`}
                          title="Chỉnh sửa bài viết"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          title="Xóa bài viết"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
