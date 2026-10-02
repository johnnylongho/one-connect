'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/PageHeader';
import {
  FileText,
  Save,
  ArrowLeft,
  Sparkles,
  Eye,
  CheckCircle2,
  Globe,
  Tag,
  Image as ImageIcon,
  Clock,
  Send,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getArticles,
  createArticle,
  updateArticle,
  Article,
  CATEGORY_LABELS,
} from '@/lib/services/articles';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function ArticleEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams?.get('id');

  const [activeTab, setActiveTab] = useState<'EDIT' | 'PREVIEW'>('EDIT');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<Article['category']>('CHUYEN_DOI_SO');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [authorName, setAuthorName] = useState('Ban Biên Tập One Connect');
  const [readTime, setReadTime] = useState(5);
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('PUBLISHED');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // Load article if editing
  useEffect(() => {
    async function loadToEdit() {
      if (!articleId) return;
      try {
        const all = await getArticles({ status: undefined });
        const target = all.find((a) => a.id === articleId);
        if (target) {
          setTitle(target.title);
          setSlug(target.slug);
          setCategory(target.category);
          setExcerpt(target.excerpt);
          setContent(target.content);
          setCoverImage(target.coverImage || '');
          setTagsInput(target.tags.join(', '));
          setAuthorName(target.authorName);
          setReadTime(target.readTime);
          setStatus(target.status);
          setSeoTitle(target.seoTitle || '');
          setSeoDescription(target.seoDescription || '');
        }
      } catch (e) {
        console.error('Failed to load article to edit', e);
      }
    }
    loadToEdit();
  }, [articleId]);

  // Handle auto-generating slug from title if not manually customized
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!articleId) {
      setSlug(slugify(val));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập tiêu đề bài viết!');
      return;
    }
    if (!excerpt.trim()) {
      alert('Vui lòng nhập tóm tắt ngắn (excerpt)!');
      return;
    }
    if (!content.trim()) {
      alert('Vui lòng nhập nội dung bài viết!');
      return;
    }

    setIsSaving(true);
    setSuccessMessage(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const postData = {
      title,
      slug: slug || slugify(title),
      category,
      excerpt,
      content,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
      tags,
      authorName,
      authorAvatar: '/brand_logo_transparent.png',
      readTime: Number(readTime) || 5,
      status,
      seoTitle: seoTitle || title,
      seoDescription: seoDescription || excerpt,
      publishedAt: new Date().toISOString(),
    };

    try {
      if (articleId) {
        await updateArticle(articleId, postData);
        setSuccessMessage('Đã cập nhật bài viết thành công!');
      } else {
        await createArticle(postData);
        setSuccessMessage('Đã xuất bản bài viết mới thành công!');
      }
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1200);
    } catch (e) {
      alert('Có lỗi xảy ra khi lưu bài viết.');
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-20 antialiased">
      {/* 1. PAGE HEADER */}
      <PageHeader
        supertitle="ONE CONNECT NETWORK • SOẠN THẢO BÀI VIẾT"
        title={articleId ? 'Chỉnh Sửa Bài Viết' : 'Soạn Thảo Bài Viết Mới'}
        description="Tối ưu nội dung truyền thông, SEO Google và chia sẻ kiến thức hữu ích cho cộng đồng doanh nghiệp."
        icon={FileText}
        badge={status === 'PUBLISHED' ? 'PUBLISHED' : 'DRAFT'}
        badgeVariant={status === 'PUBLISHED' ? 'emerald' : 'amber'}
        backHref="/admin/articles"
        backLabel="Về Danh Sách"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'EDIT' ? 'PREVIEW' : 'EDIT')}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              {activeTab === 'EDIT' ? 'Xem Trước (Preview)' : 'Quay Lại Soạn Thảo'}
            </button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              size="sm"
              className="bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold rounded-xl h-9 px-4 gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Đang lưu...' : articleId ? 'Cập Nhật' : 'Xuất Bản'}
            </Button>
          </div>
        }
      />

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-2xs animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage} Đang chuyển hướng...</span>
        </div>
      )}

      {/* 2. EDITOR OR PREVIEW MODE */}
      {activeTab === 'PREVIEW' ? (
        /* Preview Component */
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 max-w-4xl mx-auto">
          <div className="space-y-3">
            <Badge className="bg-blue-50 text-[#0066FF] border-blue-200 text-[10px] font-bold">
              {CATEGORY_LABELS[category]}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
              {title || 'Tiêu đề bài viết xem trước'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              {excerpt || 'Tóm tắt bài viết xem trước...'}
            </p>
          </div>

          {coverImage && (
            <div className="rounded-2xl overflow-hidden aspect-video w-full bg-slate-100">
              <img src={coverImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
            {content || 'Nội dung bài viết xem trước...'}
          </div>
        </div>
      ) : (
        /* Edit Form */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Tiêu Đề Bài Viết *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="Ví dụ: Cẩm nang tổ chức sự kiện MICE 4.0 với trạm check-in NFC..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Slug URL */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Đường Dẫn URL (Slug) *
                </label>
                <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 text-xs text-slate-400 font-mono">
                  <span>/posts/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="cam-nang-su-kien-mice-4-0"
                    className="w-full py-2 bg-transparent text-slate-800 font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Tóm Tắt Ngắn (Excerpt) *
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="1-2 câu tóm tắt nội dung chính để hiển thị ngoài danh sách bài viết và thẻ mô tả chia sẻ mạng xã hội..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Nội Dung Chi Tiết (Hỗ trợ Markdown &amp; HTML) *
                </label>
                <textarea
                  rows={14}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Soạn thảo bài viết của bạn tại đây... Hỗ trợ ## Tiêu đề mục, - Gạch đầu dòng, **in đậm**..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

            </div>

            {/* SEO Settings Card */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2">
                <Globe className="w-4 h-4 text-blue-600" /> Cấu Hình SEO &amp; Chia Sẻ Mạng Xã Hội
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  SEO Meta Title (Để trống sẽ lấy theo tiêu đề bài viết)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Tiêu đề chuẩn SEO xuất hiện trên Google (tối ưu dưới 60 ký tự)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  SEO Meta Description
                </label>
                <textarea
                  rows={2}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  placeholder="Mô tả chuẩn SEO xuất hiện dưới kết quả tìm kiếm Google (tối ưu dưới 160 ký tự)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Status & Publication */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <span className="text-xs font-bold text-slate-800 block">Xuất Bản &amp; Trạng Thái</span>
              
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Trạng thái bài viết:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('PUBLISHED')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      status === 'PUBLISHED'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Công Khai
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('DRAFT')}
                    className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      status === 'DRAFT'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Bản Nháp
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Chuyên mục:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none"
                >
                  {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
                    <option key={k} value={k}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Thời gian đọc ước tính:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={readTime}
                    onChange={(e) => setReadTime(Number(e.target.value))}
                    className="w-24 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold"
                  />
                  <span className="text-xs text-slate-500">phút</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">Tác giả hiển thị:</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium"
                />
              </div>
            </div>

            {/* Thumbnail Image */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Ảnh Bìa Bài Viết (Thumbnail)</span>
              
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Dán URL ảnh (Unsplash hoặc CDN)..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none"
              />

              {coverImage ? (
                <div className="rounded-xl overflow-hidden aspect-video w-full bg-slate-100 border border-slate-200">
                  <img src={coverImage} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="rounded-xl aspect-video w-full bg-slate-50 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs">
                  <ImageIcon className="w-5 h-5 mr-1" /> Chưa có ảnh bìa
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
              <span className="text-xs font-bold text-slate-800 block">Thẻ Tags (Từ Khóa)</span>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Cách nhau bởi dấu phẩy, ví dụ: NFC, MICE, ESG..."
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Thẻ tag giúp bài viết dễ dàng được tìm kiếm và liên kết các chủ đề liên quan.
              </p>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
