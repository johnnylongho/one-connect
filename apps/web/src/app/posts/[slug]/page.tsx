'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  Bookmark,
  Check,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Layers,
  BookOpen,
  Tag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getArticleBySlug,
  getArticles,
  Article,
  CATEGORY_LABELS,
  incrementArticleViews,
} from '@/lib/services/articles';
import { useOneConnectStore } from '@/lib/store';

export default function ArticleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { currentIdentity } = useOneConnectStore();

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function loadDetail() {
      if (!slug) return;
      setIsLoading(true);
      try {
        const data = await getArticleBySlug(slug);
        if (data) {
          setArticle(data);
          incrementArticleViews(data.id);
          
          // Load related
          const all = await getArticles({ category: data.category });
          setRelatedArticles(all.filter((a) => a.id !== data.id).slice(0, 3));
        }
      } catch (e) {
        console.error('Failed to load article detail', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadDetail();
  }, [slug]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#F8FAFD] flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md w-full space-y-4">
          <h2 className="text-lg font-black text-slate-900 font-heading">Bài viết không tồn tại</h2>
          <p className="text-xs text-slate-500">Bài viết có thể đã bị xóa hoặc đường dẫn không chính xác.</p>
          <Link href="/posts">
            <Button size="sm" className="bg-[#0066FF] hover:bg-blue-600 text-white font-bold rounded-xl text-xs">
              Về Danh Sách Bài Viết
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFD] text-slate-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden relative font-sans">
      
      {/* Background Blurs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-br from-blue-400/10 via-cyan-300/10 to-indigo-400/10 rounded-full blur-3xl" />
      </div>

      {/* ================================================================= */}
      {/* 2. BREADCRUMBS & ARTICLE HERO */}
      {/* ================================================================= */}
      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
        
        {/* Back and Breadcrumbs */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
          <Link href="/posts" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Tất cả bài viết</span>
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            <span>Trang chủ</span>
            <span>/</span>
            <span>Thông tin thêm</span>
            <span>/</span>
            <span className="text-slate-600 font-semibold truncate max-w-[200px]">{article.title}</span>
          </div>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <Badge className="px-3 py-1 bg-blue-50 text-[#0066FF] border-blue-200 text-xs font-black uppercase tracking-wider">
            {CATEGORY_LABELS[article.category] || article.category}
          </Badge>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 font-heading tracking-tight leading-tight [text-wrap:balance]">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {article.excerpt}
          </p>

          {/* Author & Stats Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-y border-slate-200/80 py-3 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center font-bold text-blue-700 overflow-hidden">
                <img src={article.authorAvatar || '/brand_logo_transparent.png'} alt={article.authorName} className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="font-bold text-slate-900">{article.authorName}</div>
                <div className="text-[11px] text-slate-400">Xuất bản: {new Date(article.publishedAt).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-semibold">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime} phút đọc</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {article.viewsCount} lượt xem</span>
              
              {/* Share Button */}
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-all cursor-pointer"
                title="Sao chép liên kết"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-blue-600" />}
                <span>{copied ? 'Đã sao chép!' : 'Chia sẻ'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {article.coverImage && (
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200/80 aspect-video w-full bg-slate-100">
            <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Article Body Content */}
        <article className="prose prose-slate max-w-none prose-headings:font-heading prose-headings:font-black prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:text-slate-900 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2 prose-h2:mt-8 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-sm sm:prose-p:text-base prose-li:text-slate-700 prose-li:text-sm sm:prose-li:text-base prose-strong:text-slate-900 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="whitespace-pre-line">
            {article.content}
          </div>
        </article>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Thẻ chủ đề:
            </span>
            {article.tags.map((t) => (
              <span key={t} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Action Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="text-lg sm:text-xl font-black font-heading">Trải Nghiệm Giải Pháp One Connect Ngay</div>
            <p className="text-xs sm:text-sm text-blue-100 max-w-md">
              Sở hữu ngay danh thiếp số thông minh NFC hoặc liên hệ triển khai trạm check-in MICE 4.0 cho sự kiện tiếp theo của bạn.
            </p>
          </div>
          <Link href="/login" className="shrink-0 w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-white hover:bg-slate-100 text-blue-600 font-extrabold rounded-xl h-11 px-6 text-xs cursor-pointer shadow-md">
              Bắt Đầu Miễn Phí <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-black text-slate-950 font-heading">Bài Viết Cùng Chuyên Mục</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/posts/${rel.slug}`}
                  className="rounded-2xl bg-white border border-slate-200 p-4 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{CATEGORY_LABELS[rel.category]}</span>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2">{rel.title}</h4>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-3 flex items-center justify-between">
                    <span>{rel.readTime} phút đọc</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Global Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-600 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-2 text-center sm:text-left">
            <Link href="/" title="One Connect Network">
              <img src="/brand_logo_transparent.png?v=20260904_tagline" alt="One Connect" className="h-7 w-auto object-contain" />
            </Link>
            <span className="font-medium text-slate-600">© 2026 One Connect Network. Bảo lưu mọi quyền.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-semibold">
            <Link href="/" className="hover:text-blue-600">Trang Chủ</Link>
            <Link href="/social-value" className="hover:text-blue-600">Giá Trị Xã Hội</Link>
            <Link href="/posts" className="hover:text-blue-600">Bài Viết</Link>
            <Link href="/login" className="hover:text-blue-600">Đăng Nhập</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
