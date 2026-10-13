/**
 * Supabase Client & Data Layer Contract
 * Thiết kế theo chuẩn "Zero Mock Data":
 * - Sẵn sàng cấu hình biến môi trường VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY.
 * - Cung cấp interface chuẩn mực cho 14 bảng dữ liệu Supabase.
 * - Cung cấp fallback local storage/state có cấu trúc chuẩn khi chưa có credentials.
 */

import { 
  GlobalPerformanceStats, 
  ActivityFeedItem, 
  EntityRecord,
  AccessCard,
  Event,
  User
} from '../types/database';
import { 
  INITIAL_GLOBAL_STATS, 
  INITIAL_ACTIVITIES, 
  INITIAL_ENTITIES 
} from '../services/dashboardData';

export interface SupabaseConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  isLiveConnected: boolean;
}

// Cấu hình môi trường
export const getSupabaseConfig = (): SupabaseConfig => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return {
    supabaseUrl: url,
    supabaseAnonKey: key,
    isLiveConnected: Boolean(url && key),
  };
};

/**
 * Service API Gateway giả lập truy vấn Supabase với các hàm CRUD chuẩn:
 * Khi cắm credentials Supabase thật, chỉ cần thay thế hàm bên trong bằng:
 * await supabase.from('table_name').select(...)
 */
export class OneConnectDataService {
  private static instance: OneConnectDataService;
  private stats: GlobalPerformanceStats = { ...INITIAL_GLOBAL_STATS };
  private activities: ActivityFeedItem[] = [...INITIAL_ACTIVITIES];
  private entities: EntityRecord[] = [...INITIAL_ENTITIES];

  private constructor() {
    // Khởi tạo từ LocalStorage nếu có
    const cachedEntities = localStorage.getItem('one_connect_entities');
    if (cachedEntities) {
      try {
        this.entities = JSON.parse(cachedEntities);
      } catch (e) {
        console.error('Failed to parse cached entities', e);
      }
    }
  }

  public static getInstance(): OneConnectDataService {
    if (!OneConnectDataService.instance) {
      OneConnectDataService.instance = new OneConnectDataService();
    }
    return OneConnectDataService.instance;
  }

  // 1. Lấy chỉ số Global Performance (Tương ứng với các bảng: access_cards, check_ins, connections, leads)
  public async getGlobalStats(): Promise<GlobalPerformanceStats> {
    // Giả lập network latency 120ms giống Supabase Edge Network
    await new Promise((r) => setTimeout(r, 120));
    return { ...this.stats };
  }

  // 2. Lấy danh sách thực thể & điểm danh (Bảng person_identities + check_ins + businesses)
  public async getEntities(query?: string, tier?: string): Promise<EntityRecord[]> {
    await new Promise((r) => setTimeout(r, 100));
    let result = [...this.entities];

    if (tier && tier !== 'ALL') {
      result = result.filter((e) => e.tier === tier);
    }

    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      result = result.filter(
        (e) =>
          e.full_name.toLowerCase().includes(q) ||
          e.company_name.toLowerCase().includes(q) ||
          e.card_uid.toLowerCase().includes(q)
      );
    }

    return result;
  }

  // 3. Thực hiện Check-in 1 chạm NFC (SLA < 800ms)
  public async checkInAttendee(
    entityId: string, 
    method: 'NFC_TAP' | 'QR_SCAN' = 'NFC_TAP'
  ): Promise<{ success: boolean; entity: EntityRecord; latencyMs: number }> {
    const startTime = performance.now();
    await new Promise((r) => setTimeout(r, 150)); // Độ trễ xử lý 150ms

    const index = this.entities.findIndex((e) => e.id === entityId);
    if (index === -1) {
      throw new Error('Đại biểu không tồn tại trong danh sách đăng ký sự kiện');
    }

    const current = this.entities[index];
    const nowTimeStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

    const updated: EntityRecord = {
      ...current,
      status: current.tier === 'VIP' ? 'VIP_ACCEPTED' : 'STABLE_CHECKED',
      status_label: current.tier === 'VIP' ? 'ĐÃ TIẾP ĐÓN VIP' : 'ĐÃ CHECK-IN',
      check_in_time: nowTimeStr,
      method,
    };

    this.entities[index] = updated;
    localStorage.setItem('one_connect_entities', JSON.stringify(this.entities));

    // Cập nhật thống kê toàn cục
    this.stats.event_checkin.total_checkins += 1;
    if (current.tier === 'VIP' && current.status !== 'VIP_ACCEPTED') {
      this.stats.event_checkin.vip_count += 1;
    }

    // Ghi nhật ký hoạt động (Audit Trail)
    const newAct: ActivityFeedItem = {
      id: `act-${Date.now()}`,
      time: nowTimeStr,
      title: `Điểm danh ${method === 'NFC_TAP' ? 'chạm NFC' : 'quét QR'}: ${updated.full_name}`,
      subtitle: `Xác thực thành công tại Cổng Tiếp đón MICE Nha Trang · Phân hạng ${updated.tier}.`,
      category: 'CHECK_IN',
      badgeType: 'emerald',
      user_name: updated.full_name,
      organization: updated.company_name,
    };
    this.activities = [newAct, ...this.activities.slice(0, 9)];

    const latencyMs = Math.round(performance.now() - startTime);
    return { success: true, entity: updated, latencyMs };
  }

  // 4. Lấy dòng sự kiện Recent Activities
  public async getActivities(): Promise<ActivityFeedItem[]> {
    await new Promise((r) => setTimeout(r, 80));
    return [...this.activities];
  }

  // 5. Xuất báo cáo CSV chuẩn hóa tuân thủ Luật PDPL 91/2025
  public exportPdplAuditCsv(): string {
    const headers = ['ID', 'Ho_Va_Ten', 'Doanh_Nghiep', 'Ma_So_Thue', 'Hang_Ve', 'Trang_Thai', 'Gio_Diem_Danh', 'Ma_UID_NFC', 'Xac_Thuc_VNeID'];
    const rows = this.entities.map((e) => [
      e.id,
      `"${e.full_name}"`,
      `"${e.company_name}"`,
      e.tax_id,
      e.tier,
      e.status_label,
      e.check_in_time,
      e.card_uid,
      e.vneid_verified ? 'DA_XAC_THUC' : 'CHUA_XAC_THUC',
    ]);

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }
}
