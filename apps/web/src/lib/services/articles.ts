import { supabase } from '@/lib/supabaseClient';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: 'CHUYEN_DOI_SO' | 'SU_KIEN_MICE' | 'ESG_XANH' | 'KET_NOI_B2B';
  tags: string[];
  authorName: string;
  authorAvatar?: string;
  status: 'DRAFT' | 'PUBLISHED';
  readTime: number; // in minutes
  viewsCount: number;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<Article['category'], string> = {
  CHUYEN_DOI_SO: 'Chuyển Đổi Số B2B',
  SU_KIEN_MICE: 'Sự Kiện MICE 4.0',
  ESG_XANH: 'ESG & Tương Lai Xanh',
  KET_NOI_B2B: 'Định Danh & Giao Thương',
};

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-001',
    slug: 'chuyen-doi-so-ket-noi-b2b-ky-nguyen-nfc-ai',
    title: 'Chuyển Đổi Số Kết Nối B2B: Khi Danh Thiếp Giấy Nhường Chỗ Cho Định Danh Số',
    excerpt: 'Hơn 88% danh thiếp giấy bị lãng quên hoặc vứt bỏ sau 1 tuần. Khám phá cách công nghệ NFC và định danh số One Connect đang định hình lại văn hóa giao thương doanh nhân.',
    category: 'CHUYEN_DOI_SO',
    coverImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
    tags: ['NFC', 'Chuyển đổi số', 'B2B', 'Định danh số', 'Công nghệ 4.0'],
    authorName: 'Ban Biên Tập One Connect',
    authorAvatar: '/brand_logo_transparent.png',
    status: 'PUBLISHED',
    readTime: 6,
    viewsCount: 1420,
    seoTitle: 'Chuyển Đổi Số Kết Nối B2B | Định Danh Số One Connect',
    seoDescription: 'Tìm hiểu xu hướng thay thế danh thiếp giấy bằng thẻ thông minh NFC và nền tảng kết nối B2B One Connect.',
    publishedAt: '2026-09-01T08:00:00Z',
    createdAt: '2026-09-01T08:00:00Z',
    updatedAt: '2026-09-01T08:00:00Z',
    content: `
## Thực Trạng Đầy Lãng Phí Của Danh Thiếp Truyền Thống

Trong nhiều thập kỷ, danh thiếp giấy luôn là vật bất ly thân của mọi doanh nhân khi tham gia các diễn đàn kinh tế, hội nghị xúc tiến đầu tư hay gặp gỡ đối tác. Tuy nhiên, theo các khảo sát thực tế:

- **88% danh thiếp giấy** bị vứt vào sọt rác hoặc bỏ quên trong ngăn kéo chỉ sau 7 ngày kể từ cuộc gặp.
- **Không cập nhật được thông tin**: Khi doanh nhân đổi số điện thoại, đổi chức vụ hoặc mở rộng ngành nghề, hàng ngàn tấm danh thiếp cũ lập tức trở nên vô giá trị.
- **Mất bối cảnh gặp gỡ**: Một xấp danh thiếp sau sự kiện không thể nhắc bạn nhớ: người này gặp ở đâu, họ đang có nhu cầu gì, ngân sách dự kiến bao nhiêu và ai là người giới thiệu.

## Đột Phá Từ Công Nghệ Thẻ Thông Minh NFC

Nền tảng **One Connect** ra đời nhằm giải quyết triệt để bài toán này bằng việc tích hợp vi mạch NFC (Near Field Communication) và Dynamic QR Code vào thẻ định danh cao cấp:

1. **Một Chạm Mở Toàn Bộ Hồ Sơ Doanh Nghiệp**: Không cần cài đặt bất kỳ ứng dụng nào, chỉ cần đưa thẻ lại gần điện thoại thông minh của đối tác là toàn bộ Profile số, E-Brochure, video giới thiệu công ty và danh bạ liên hệ sẽ hiện lên ngay lập tức.
2. **Lưu Danh Bạ Chỉ 1 Giây**: Đối tác bấm "Lưu danh bạ" (.vcf), toàn bộ họ tên, chức danh, email, website và avatar chính thức sẽ được nhập thẳng vào danh bạ điện thoại của họ.
3. **Cập Nhật Không Giới Hạn**: Mọi thay đổi về thông tin công ty đều được cập nhật theo thời gian thực trên đám mây, phôi thẻ vật lý không bao giờ bị lỗi thời.

## Tích Hợp Mini-CRM: Biến Cuộc Gặp Thành Doanh Số

Khác biệt cốt lõi của One Connect so với các loại namecard số thông thường là hệ sinh thái **Sổ tay quan hệ & Mini-CRM**:
- **Ghi nhớ bối cảnh**: Tự động lưu địa điểm sự kiện, thời gian tiếp xúc.
- **Voice & Text Note**: Ghi chú tức thời nhu cầu của đối tác (ví dụ: "Cần tìm nhà thầu nội thất trong Q4").
- **Phân loại Lead**: Đánh dấu WARM / HOT để ưu tiên follow-up.
- **Nhắc hẹn tự động**: Gợi ý gửi email hoặc tin nhắn Zalo chăm sóc đúng thời điểm vàng, ngăn chặn tình trạng "Gặp xong để đó".
    `,
  },
  {
    id: 'art-002',
    slug: 'cam-nang-to-chuc-su-kien-mice-4-0-checkin-sieu-toc',
    title: 'Cẩm Nang Sự Kiện MICE 4.0: Giải Quyết Ùn Tắc Check-in & Chăm Sóc Khách VIP',
    excerpt: 'Làm thế nào để đón tiếp 1.000 đại biểu trong chưa đầy 15 phút mà không cần danh sách giấy, không bỏ sót khách VIP và cập nhật số ghế tiệc realtime?',
    category: 'SU_KIEN_MICE',
    coverImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
    tags: ['MICE', 'Sự kiện', 'Check-in NFC', 'Khách VIP', 'Quản trị sự kiện'],
    authorName: 'Ban Chuyên Môn Sự Kiện',
    authorAvatar: '/brand_logo_transparent.png',
    status: 'PUBLISHED',
    readTime: 8,
    viewsCount: 980,
    seoTitle: 'Check-in Sự Kiện MICE 4.0 Siêu Tốc < 0.42s | One Connect',
    seoDescription: 'Giải pháp check-in sự kiện MICE tự động bằng thẻ NFC và QR động, giảm 100% rác thẻ giấy cho ban tổ chức.',
    publishedAt: '2026-08-28T09:30:00Z',
    createdAt: '2026-08-28T09:30:00Z',
    updatedAt: '2026-08-28T09:30:00Z',
    content: `
## Cơn Ác Mộng Của Ban Tổ Chức Sự Kiện Truyền Thống

Mọi ban tổ chức sự kiện hội nghị, triển lãm và diễn đàn doanh nghiệp đều từng đối mặt với những thách thức:
1. **Ùn tắc tại cửa ra vào**: Khách mời phải xếp hàng dài chờ nhân sự tra cứu tên trên danh sách Excel in giấy, gây ức chế ngay từ điểm chạm đầu tiên.
2. **Bỏ sót khách VIP**: Khi lãnh đạo cấp cao hoặc đối tác tài trợ kim cương đến, nhân sự tiếp tân không kịp nhận diện để mời vào phòng VIP Lounge hoặc thông báo cho Trưởng ban tổ chức.
3. **Mất kiểm soát vị trí ngồi**: Khách ngồi sai bàn tiệc, lộn xộn sơ đồ chỗ ngồi, thiếu công cụ cập nhật theo thời gian thực.
4. **Không có báo cáo đo lường**: Không biết chính xác tỷ lệ tham dự thực tế (show-up rate), thời gian cao điểm đại biểu vào cửa.

## Trạm Check-in One Connect: Tốc Độ Dưới 0.42 Giây

Giải pháp Trạm đón tiếp thông minh One Connect mang đến trải nghiệm hoàn toàn mới:
- **Tốc độ cực nhanh**: Đại biểu chỉ cần chạm thẻ đại biểu NFC hoặc quét mã QR trên điện thoại, hệ thống xác thực và in nhãn/mở cổng chỉ mất **0.42 giây**.
- **Cảnh báo Khách VIP tức thì**: Màn hình lễ tân lập tức hiển thị màu vàng kim sang trọng cùng hướng dẫn "Dẫn lối Bàn VIP A01 - Thông báo Chủ tịch hiệp hội đón tiếp".
- **Sơ đồ chỗ ngồi Realtime**: Hiển thị rõ ràng vị trí bàn tiệc, dãy ghế và tự động gửi tin nhắn điều hướng chỗ ngồi đến Zalo của khách mời.
- **Cơ chế Offline Sync**: Ngay cả khi hội trường bị mất kết nối Internet, hệ thống vẫn check-in mượt mà và tự động đồng bộ lên đám mây khi mạng phục hồi.
    `,
  },
  {
    id: 'art-003',
    slug: 'chien-luoc-esg-va-doanh-nghiep-xanh-voi-dinh-danh-so',
    title: 'Chiến Lược ESG & Chuyển Đổi Xanh: Giảm Phát Thải Từ Điểm Chạm Giao Tiếp Bền Vững',
    excerpt: 'ESG không chỉ là câu chuyện của các tập đoàn khổng lồ. Mọi doanh nghiệp vừa và nhỏ đều có thể bắt đầu hành trình Net Zero từ việc loại bỏ danh thiếp và tài liệu in ấn.',
    category: 'ESG_XANH',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
    tags: ['ESG', 'Chuyển đổi xanh', 'Zero Paper', 'Net Zero', 'Bền vững'],
    authorName: 'Hội Đồng Cố Vấn ESG',
    authorAvatar: '/brand_logo_transparent.png',
    status: 'PUBLISHED',
    readTime: 7,
    viewsCount: 1650,
    seoTitle: 'Chiến Lược ESG & Net Zero Bằng Thẻ Xanh Số Hóa | One Connect',
    seoDescription: 'Tìm hiểu cách nền tảng One Connect giúp doanh nghiệp giảm hàng tấn CO2 và rác thải giấy, đáp ứng chuẩn phát triển bền vững ESG.',
    publishedAt: '2026-08-25T14:00:00Z',
    createdAt: '2026-08-25T14:00:00Z',
    updatedAt: '2026-08-25T14:00:00Z',
    content: `
## Cam Kết Net Zero 2050 Và Áp Lực Lên Doanh Nghiệp Việt Nam

Xu hướng toàn cầu về tiêu chuẩn ESG (Môi trường - Xã hội - Quản trị) đang trở thành điều kiện tiên quyết trong chuỗi cung ứng quốc tế. Các ngân hàng, quỹ đầu tư và đối tác nước ngoài ngày càng ưu tiên những doanh nghiệp có minh chứng cụ thể về giảm phát thải carbon.

## Trụ Cột E (Environmental) - Giảm Thiểu Dấu Chân Carbon

Mỗi tấm thẻ One Connect bằng kim loại tái chế hoặc gỗ sinh thái cao cấp có vòng đời sử dụng lên đến 5-10 năm, thay thế cho trung bình **5.000 đến 10.000 danh thiếp giấy** mà một doanh nhân tiêu thụ trong suốt sự nghiệp.

- **Tiết kiệm tài nguyên gỗ & nước**: Sản xuất 1 tấn giấy tiêu tốn 17 cây xanh trưởng thành và hơn 26.000 lít nước sạch.
- **Giảm phát thải khí nhà kính**: Cắt giảm lượng mực in hóa chất và khí thải vận chuyển trong chuỗi cung ứng.
- **Chứng chỉ Xanh cho sự kiện**: One Connect cấp báo cáo định lượng số kg CO2 và số trang giấy đã tiết kiệm được sau mỗi hội nghị để ban tổ chức đưa vào Báo cáo Phát triển Bền vững (Sustainability Report).

## Trụ Cột S (Social) & G (Governance)

Bên cạnh yếu tố môi trường, One Connect củng cố:
- **Xã hội (Social)**: Thúc đẩy cơ hội tiếp cận công nghệ nhận diện đẳng cấp cho các startup, doanh nghiệp nhỏ và vừa (SMEs), tạo sự bình đẳng trên bàn đàm phán thương mại.
- **Quản trị (Governance)**: Tuân thủ nghiêm ngặt Luật Bảo vệ Dữ liệu Cá nhân PDPL 91 và Nghị định 13/2023/NĐ-CP, áp dụng cơ chế đồng thuận 2 chiều (Two-way Consent) nhằm bảo vệ quyền riêng tư và chấm dứt tình trạng rò rỉ dữ liệu.
    `,
  },
  {
    id: 'art-004',
    slug: 'nghi-dinh-13-va-luat-pdpl-91-bao-ve-du-lieu-trong-ket-noi-b2b',
    title: 'Nghị Định 13 & Luật PDPL 91: Doanh Nghiệp Cần Chuẩn Bị Gì Khi Thu Thập Dữ Liệu Khách Mời?',
    excerpt: 'Cơ chế đồng thuận 2 chiều (Two-way Consent) trong giao lưu thương mại giúp doanh nghiệp và ban tổ chức sự kiện tránh những mức phạt nghiêm khắc theo quy định mới.',
    category: 'KET_NOI_B2B',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200&auto=format&fit=crop',
    tags: ['PDPL 91', 'Nghị định 13', 'Bảo mật dữ liệu', 'Two-way Consent', 'Pháp lý'],
    authorName: 'Luật Sư Chuyên Trách Dữ Liệu',
    authorAvatar: '/brand_logo_transparent.png',
    status: 'PUBLISHED',
    readTime: 5,
    viewsCount: 1120,
    seoTitle: 'Tuân Thủ Nghị Định 13 & Luật PDPL 91 Trong Kết Nối B2B | One Connect',
    seoDescription: 'Bảo vệ quyền riêng tư và tuân thủ quy định bảo vệ dữ liệu cá nhân khi chia sẻ danh thiếp và tổ chức sự kiện với One Connect.',
    publishedAt: '2026-08-20T10:00:00Z',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
    content: `
## Quy Định Khắt Khe Về Bảo Vệ Dữ Liệu Cá Nhân Tại Việt Nam

Với Nghị định 13/2023/NĐ-CP và Luật Bảo vệ Dữ liệu Cá nhân số 91/2025/QH15 vừa được Quốc hội thông qua, việc tự ý thu thập, chia sẻ hoặc buôn bán danh sách số điện thoại, email của khách mời tham dự sự kiện có thể đối mặt với chế tài phạt hành chính rất nặng hoặc xử lý hình sự.

## Tiên Phong Cơ Chế "Đồng Thuận 2 Chiều" Của One Connect

Để giúp khách hàng và các hiệp hội kinh doanh an tâm tuyệt đối, nền tảng One Connect được xây dựng theo tôn chỉ **Privacy by Design**:

1. **Minh bạch hóa quyền truy cập**: Khi chạm thẻ hoặc quét QR, đối tác chỉ xem được những thông tin mà chủ thẻ cho phép công khai.
2. **Two-Way Consent**: Để lưu số điện thoại cá nhân hoặc kết nối CRM, hệ thống yêu cầu sự đồng ý xác nhận từ cả hai phía. Không ai có thể tự ý lấy cắp dữ liệu của người khác.
3. **Quyền được lãng quên**: Người dùng có toàn quyền thu hồi quyền chia sẻ hoặc xóa vĩnh viễn dữ liệu của mình khỏi hệ thống chỉ bằng 1 thao tác.
    `,
  },
];

// In-memory store fallback for client / offline usage
let localArticlesStore: Article[] = [...INITIAL_ARTICLES];

function syncToLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('one_connect_articles', JSON.stringify(localArticlesStore));
    } catch (e) {
      console.warn('Cannot sync articles to localStorage', e);
    }
  }
}

function initFromLocalStorage() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('one_connect_articles');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localArticlesStore = parsed;
        }
      }
    } catch (e) {
      console.warn('Cannot load articles from localStorage', e);
    }
  }
}

// Auto load stored articles if client
if (typeof window !== 'undefined') {
  initFromLocalStorage();
}

export async function getArticles(filter?: {
  category?: string;
  query?: string;
  status?: string;
}): Promise<Article[]> {
  // 1. Try Supabase first if online
  try {
    let query = supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (filter?.status) {
      query = query.eq('status', filter.status);
    } else {
      query = query.eq('status', 'PUBLISHED');
    }

    if (filter?.category && filter.category !== 'ALL') {
      query = query.eq('category', filter.category);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      // Map Supabase columns to camelCase
      const mapped = data.map((item: any) => ({
        id: item.id,
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content,
        coverImage: item.cover_image,
        category: item.category,
        tags: item.tags || [],
        authorName: item.author_name,
        authorAvatar: item.author_avatar,
        status: item.status,
        readTime: item.read_time,
        viewsCount: item.views_count,
        seoTitle: item.seo_title,
        seoDescription: item.seo_description,
        publishedAt: item.published_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      })) as Article[];

      if (filter?.query && filter.query.trim()) {
        const q = filter.query.toLowerCase().trim();
        return mapped.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.excerpt.toLowerCase().includes(q) ||
            a.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return mapped;
    }
  } catch (err) {
    // Fallback gracefully
  }

  // 2. Fallback to Local Store
  let results = [...localArticlesStore];

  if (filter?.status) {
    results = results.filter((a) => a.status === filter.status);
  } else {
    results = results.filter((a) => a.status === 'PUBLISHED');
  }

  if (filter?.category && filter.category !== 'ALL') {
    results = results.filter((a) => a.category === filter.category);
  }

  if (filter?.query && filter.query.trim()) {
    const q = filter.query.toLowerCase().trim();
    results = results.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return results.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  // 1. Try Supabase
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.cover_image,
        category: data.category,
        tags: data.tags || [],
        authorName: data.author_name,
        authorAvatar: data.author_avatar,
        status: data.status,
        readTime: data.read_time,
        viewsCount: data.views_count,
        seoTitle: data.seo_title,
        seoDescription: data.seo_description,
        publishedAt: data.published_at,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
    }
  } catch (err) {}

  // 2. Fallback to Local Store
  const found = localArticlesStore.find((a) => a.slug === slug);
  return found || null;
}

export async function createArticle(input: Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'viewsCount'>): Promise<Article> {
  const newArticle: Article = {
    ...input,
    id: `art-${Date.now()}`,
    viewsCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Try saving to Supabase
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert({
        slug: newArticle.slug,
        title: newArticle.title,
        excerpt: newArticle.excerpt,
        content: newArticle.content,
        cover_image: newArticle.coverImage,
        category: newArticle.category,
        tags: newArticle.tags,
        author_name: newArticle.authorName,
        author_avatar: newArticle.authorAvatar,
        status: newArticle.status,
        read_time: newArticle.readTime,
        views_count: 0,
        seo_title: newArticle.seoTitle,
        seo_description: newArticle.seoDescription,
        published_at: newArticle.publishedAt,
      })
      .select()
      .single();

    if (!error && data) {
      newArticle.id = data.id;
    }
  } catch (err) {}

  // Also update local store
  localArticlesStore.unshift(newArticle);
  syncToLocalStorage();
  return newArticle;
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  const index = localArticlesStore.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const current = localArticlesStore[index]!;
  const updated: Article = {
    ...current,
    ...updates,
    id: current.id,
    updatedAt: new Date().toISOString(),
  };

  // Try updating in Supabase
  try {
    await supabase
      .from('articles')
      .update({
        title: updated.title,
        slug: updated.slug,
        excerpt: updated.excerpt,
        content: updated.content,
        cover_image: updated.coverImage,
        category: updated.category,
        tags: updated.tags,
        author_name: updated.authorName,
        status: updated.status,
        read_time: updated.readTime,
        seo_title: updated.seoTitle,
        seo_description: updated.seoDescription,
        updated_at: updated.updatedAt,
      })
      .eq('id', id);
  } catch (err) {}

  localArticlesStore[index] = updated;
  syncToLocalStorage();
  return updated;
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    await supabase.from('articles').delete().eq('id', id);
  } catch (err) {}

  localArticlesStore = localArticlesStore.filter((a) => a.id !== id);
  syncToLocalStorage();
  return true;
}

export async function incrementArticleViews(id: string): Promise<void> {
  const article = localArticlesStore.find((a) => a.id === id);
  if (article) {
    article.viewsCount = (article.viewsCount || 0) + 1;
    syncToLocalStorage();
  }

  try {
    await supabase.rpc('increment_article_views', { article_id: id });
  } catch (err) {}
}
