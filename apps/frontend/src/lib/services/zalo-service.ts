/**
 * ONE CONNECT NETWORK — ZALO ZNS & OPEN API GATEWAY SERVICE
 * Chuẩn hóa gửi thông báo Zalo Notification Service (ZNS) theo Luật PDPL 91/2025
 */

export interface ZnsPayload {
  phone: string;
  template_id: string;
  template_data: Record<string, any>;
  tracking_id?: string;
}

export interface ZnsResponse {
  success: boolean;
  messageId?: string;
  sentAt?: string;
  simulated?: boolean;
  error?: string;
}

export class ZaloService {
  private static OA_ACCESS_TOKEN = process.env.ZALO_OA_ACCESS_TOKEN || '';
  private static OA_SECRET_KEY = process.env.ZALO_OA_SECRET_KEY || '';

  /**
   * Chuẩn hóa số điện thoại Việt Nam sang định dạng quốc tế 84xxxxxxxxx
   */
  public static formatPhone(phone: string): string {
    let clean = phone.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '84' + clean.substring(1);
    }
    if (!clean.startsWith('84') && clean.length === 9) {
      clean = '84' + clean;
    }
    return clean;
  }

  /**
   * Gửi thông báo ZNS tới số điện thoại người dùng
   */
  public static async sendZns(payload: ZnsPayload): Promise<ZnsResponse> {
    const formattedPhone = this.formatPhone(payload.phone);
    const trackingId = payload.tracking_id || `oc_zns_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Nếu chưa cấu hình Access Token thực tế trên môi trường, chạy chế độ Smart Sandbox Simulator
    if (!this.OA_ACCESS_TOKEN || this.OA_ACCESS_TOKEN.includes('placeholder')) {
      console.log(`[Zalo ZNS Sandbox] Sending to ${formattedPhone} with template ${payload.template_id}:`, payload.template_data);
      return {
        success: true,
        messageId: `msg_${Date.now()}_mock`,
        sentAt: new Date().toISOString(),
        simulated: true,
      };
    }

    try {
      const response = await fetch('https://business.openapi.zalo.me/message/template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'access_token': this.OA_ACCESS_TOKEN,
          'secret_key': this.OA_SECRET_KEY,
        },
        body: JSON.stringify({
          phone: formattedPhone,
          template_id: payload.template_id,
          template_data: payload.template_data,
          tracking_id: trackingId,
        }),
      });

      const data = await response.json();

      if (data.error === 0) {
        return {
          success: true,
          messageId: data.data?.msg_id || trackingId,
          sentAt: new Date().toISOString(),
        };
      } else {
        return {
          success: false,
          error: data.message || `Mã lỗi Zalo: ${data.error}`,
        };
      }
    } catch (err: any) {
      console.error('[Zalo Service Exception]:', err);
      return {
        success: false,
        error: err.message || 'Lỗi kết nối máy chủ Zalo OpenAPI',
      };
    }
  }

  /**
   * Trigger ZNS 01: Xác nhận check-in cửa thành công + Báo số bàn tiệc VIP
   */
  public static async triggerCheckinSuccessAlert(params: {
    fullName: string;
    phone: string;
    eventName: string;
    tableNumber: string;
    seatRole?: string;
  }): Promise<ZnsResponse> {
    return this.sendZns({
      phone: params.phone,
      template_id: 'ZNS_CHECKIN_TABLE_ASSIGNMENT',
      template_data: {
        customer_name: params.fullName,
        event_name: params.eventName,
        table_number: params.tableNumber || 'Bàn Tự Do',
        seat_role: params.seatRole || 'Đại Biểu Doanh Nghiệp',
        checkin_time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        portal_url: 'https://one-connect-network.vercel.app/dashboard',
      },
    });
  }

  /**
   * Trigger ZNS 02: Yêu cầu kết nối giao thương đồng thuận 2 chiều (Mutual Consent)
   */
  public static async triggerConsentRequestAlert(params: {
    recipientPhone: string;
    recipientName: string;
    senderName: string;
    senderTitle: string;
    senderCompany: string;
    consentLink: string;
  }): Promise<ZnsResponse> {
    return this.sendZns({
      phone: params.recipientPhone,
      template_id: 'ZNS_MUTUAL_CONSENT_REQUEST',
      template_data: {
        recipient_name: params.recipientName,
        sender_name: params.senderName,
        sender_title: params.senderTitle,
        sender_company: params.senderCompany,
        consent_url: params.consentLink,
        request_time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      },
    });
  }

  /**
   * Trigger ZNS 03: Nhắc lịch hẹn chăm sóc đối tác B2B (Follow-up Reminder)
   */
  public static async triggerFollowUpReminder(params: {
    userPhone: string;
    userName: string;
    partnerName: string;
    partnerCompany: string;
    actionNote: string;
    scheduledTime: string;
  }): Promise<ZnsResponse> {
    return this.sendZns({
      phone: params.userPhone,
      template_id: 'ZNS_B2B_FOLLOWUP_REMINDER',
      template_data: {
        user_name: params.userName,
        partner_name: params.partnerName,
        partner_company: params.partnerCompany,
        action_note: params.actionNote,
        scheduled_time: params.scheduledTime,
      },
    });
  }
}
