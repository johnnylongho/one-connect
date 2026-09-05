'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  ArrowRight,
  Sparkles,
  Layers,
  Tag,
  Share2,
  ChevronRight,
  Newspaper,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  getArticles,
  Article,
  CATEGORY_LABELS,
} from '@/lib/services/articles';
import { useOneConnectStore } from '@/lib/store';

export default function PostsPortalPage() {
  const { currentIdentity } = useOneConnectStore();

  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const data = await getArticles({
          category: selectedCategory === 'ALL' ? undefined : selectedCategory,
          query: searchQuery,
        });
        setArticles(data);
      } catch (e) {
        console.error('Failed to load articles', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-slate-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden relative font-sans">
      
      {/* Background Liquid Blurs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-blue-400/15 via-cyan-300/15 to-indigo-400/10 rounded-full blur-3xl" />
        <div className="absolute top-[40%] -right-40 w-[600px] h-[500px] bg-blue-300/10 rounded-full blur-3xl" />
      </div>

      {/* ================================================================= */}
      {/* 2. HERO / TITLE SECTION */}
      {/* ================================================================= */}
      <section className="pt-10 pb-8 sm:pt-16 sm:pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="px-3.5 py-1 bg-blue-50 text-[#0066FF] border-blue-200 text-xs font-black uppercase tracking-wider">
            TRUNG TÂM KIẾN THỨC &amp; TRUYỀN THÔNG
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 font-heading tracking-tight [text-wrap:balance]">
            Thông Tin Thêm &amp; Cẩm Nang Doanh Nghiệp
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-medium">
            Cập nhật xu hướng chuyển đổi số B2B, cẩm nang sự kiện MICE 4.0, chiến lược phát triển bền vững ESG và câu chuyện thành công từ cộng đồng One Connect.
          </p>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="mt-8 max-w-4xl mx-auto space-y-4">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài viết theo từ khóa, chủ đề, tag (ví dụ: NFC, MICE, ESG, Check-in)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm font-medium transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Tất Cả Bài Viết
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                  selectedCategory === key
                    ? 'bg-[#0066FF] text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. ARTICLES GRID */}
      {/* ================================================================= */}
      <section className="py-6 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-slate-500 font-medium">Đang tải danh sách bài viết...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-lg mx-auto">
            <Newspaper className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">Không tìm thấy bài viết phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1">Thử đổi từ khóa hoặc chọn danh mục bài viết khác.</p>
            <Button
              onClick={() => {
                setSelectedCategory('ALL');
                setSearchQuery('');
              }}
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl text-xs font-bold"
            >
              Xem tất cả bài viết
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/posts/${article.slug}`}
                className="group rounded-3xl bg-white border border-slate-200/90 hover:border-blue-400/80 shadow-xs hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Card Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={article.coverImage || '/brand_logo_transparent.png'}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[#0A1124]/80 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold">
                      {CATEGORY_LABELS[article.category] || article.category}
                    </Badge>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {article.readTime} phút đọc
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {article.viewsCount} lượt xem
                      </span>
                    </div>

                    <h2 className="text-base sm:text-lg font-black text-slate-900 font-heading group-hover:text-blue-600 transition-colors line-clamp-2">
                      {article.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Tags & Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                      <span>Đọc bài viết</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {new Date(article.publishedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Global Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
            <Link href="/" title="One Connect Network">
              <img
                src="/brand_logo_transparent.png?v=20260904_tagline"
                alt="One Connect"
                className="h-7 w-auto object-contain"
              />
            </Link>
            <span className="font-medium text-slate-600">
              © 2026 One Connect Network. Cổng thông tin &amp; cẩm nang doanh nghiệp.
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" /> Tuân thủ PDPL 91
            </span>
            <Link href="/" className="hover:text-blue-600">Trang Chủ</Link>
            <Link href="/social-value" className="hover:text-blue-600">Giá Trị Xã Hội</Link>
            <Link href="/login" className="hover:text-blue-600">Đăng Nhập</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
