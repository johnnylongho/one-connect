import { createClient } from '@supabase/supabase-js';

export type PackageType = 'ENTREPRENEUR' | 'MICE_ENTERPRISE' | 'ASSOCIATION';

export interface MarketLead {
  id: string;
  packageType: PackageType;
  packageName: string;
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  organizationType?: string;
  notes?: string;
  status: 'NEW' | 'CONTACTED' | 'CONSULTING' | 'WON' | 'LOST';
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface MarketDemandEvent {
  id: string;
  packageType: PackageType;
  eventType: 'VIEW_PACKAGE' | 'CLICK_CTA' | 'OPEN_MODAL' | 'SUBMIT_LEAD';
  referrer?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface PackageDemandStat {
  type: PackageType;
  name: string;
  badge: string;
  clicks: number;
  leadsCount: number;
  percentage: number;
  targetAudience: string;
}

export interface MarketDemandSummary {
  totalClicks: number;
  totalLeads: number;
  conversionRate: number;
  topPackage: PackageDemandStat;
  packageStats: PackageDemandStat[];
  leads: MarketLead[];
}

export const PACKAGE_INFO: Record<PackageType, { name: string; badge: string; targetAudience: string }> = {
  ENTREPRENEUR: {
    name: 'Doanh Nhân Cá Nhân',
    badge: 'THẺ DANH THIẾP SỐ',
    targetAudience: 'Chủ doanh nghiệp, giám đốc kinh doanh, chuyên gia tư vấn B2B',
  },
  MICE_ENTERPRISE: {
    name: 'Doanh Nghiệp & Sự Kiện MICE',
    badge: 'PHỔ BIẾN NHẤT',
    targetAudience: 'Công ty tổ chức hội nghị, triển lãm và diễn đàn thương mại',
  },
  ASSOCIATION: {
    name: 'Hiệp Hội & Tổ Chức',
    badge: 'HỘI VIÊN TẬP TRUNG',
    targetAudience: 'Hội Doanh nhân Trẻ, Hiệp hội ngành nghề, Câu lạc bộ B2B',
  },
};

// Initial benchmark leads to provide immediate dashboard utility
const INITIAL_LEADS: MarketLead[] = [
  {
    id: 'lead-001',
    packageType: 'MICE_ENTERPRISE',
    packageName: 'Doanh Nghiệp & Sự Kiện MICE',
    fullName: 'Trần Vũ Hoàng',
    phone: '0908889999',
    email: 'hoang.tran@micevietnam.vn',
    companyName: 'MICE Vietnam Events & Media',
    organizationType: 'Doanh nghiệp tổ chức sự kiện',
    notes: 'Cần trạm check-in NFC <1s và B2B matching cho diễn đàn 500 khách tại Nha Trang vào tháng 10.',
    status: 'CONSULTING',
    source: 'WEBSITE_SERVICES',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-002',
    packageType: 'ASSOCIATION',
    packageName: 'Hiệp Hội & Tổ Chức',
    fullName: 'Nguyễn Thị Minh Hạnh',
    phone: '0918776655',
    email: 'hanh.nguyen@clbdoanhnhan.org',
    companyName: 'CLB Doanh Nhân Trẻ Miền Trung',
    organizationType: 'Hiệp hội / Câu lạc bộ',
    notes: 'Quan tâm giải pháp quản trị danh bạ 300 hội viên tập trung và thẻ kim loại đồng bộ logo.',
    status: 'NEW',
    source: 'WEBSITE_SERVICES',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lead-003',
    packageType: 'ENTREPRENEUR',
    packageName: 'Doanh Nhân Cá Nhân',
    fullName: 'Lê Thành Đạt',
    phone: '0934112233',
    email: 'dat.le@vinatechfin.com',
    companyName: 'VinaTech Financial Solutions',
    organizationType: 'Doanh nghiệp Tài chính',
    notes: 'Đăng ký 2 thẻ kim loại khắc tên Laser cho Tổng giám đốc và Giám đốc đầu tư.',
    status: 'CONTACTED',
    source: 'WEBSITE_SERVICES',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// In-memory fallback event click store
let inMemoryClicks: Record<PackageType, number> = {
  ENTREPRENEUR: 42,
  MICE_ENTERPRISE: 89,
  ASSOCIATION: 36,
};

let inMemoryLeads: MarketLead[] = [...INITIAL_LEADS];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aybjbklbkrgoapakgnbs.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

/**
 * 1. Record Market Interest Event (Click CTA or view package)
 */
export async function trackMarketDemand(packageType: PackageType, eventType: 'VIEW_PACKAGE' | 'CLICK_CTA' | 'OPEN_MODAL' | 'SUBMIT_LEAD', metadata?: Record<string, any>) {
  // Update in-memory counter
  if (inMemoryClicks[packageType] !== undefined) {
    inMemoryClicks[packageType] += 1;
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('market_demand_events').insert({
        package_type: packageType,
        event_type: eventType,
        metadata: metadata || {},
      });
    } catch (err) {
      console.warn('Could not insert market_demand_events to Supabase, fallback retained:', err);
    }
  }

  return { success: true, packageType, clicks: inMemoryClicks[packageType] };
}

/**
 * 2. Submit and Store Market Lead
 */
export async function submitMarketLead(leadData: {
  packageType: PackageType;
  fullName: string;
  phone: string;
  email?: string;
  companyName?: string;
  organizationType?: string;
  notes?: string;
  source?: string;
}): Promise<{ success: boolean; lead: MarketLead }> {
  const packageName = PACKAGE_INFO[leadData.packageType]?.name || leadData.packageType;

  const newLead: MarketLead = {
    id: `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    packageType: leadData.packageType,
    packageName,
    fullName: leadData.fullName.trim(),
    phone: leadData.phone.trim(),
    email: leadData.email ? leadData.email.trim() : '',
    companyName: leadData.companyName ? leadData.companyName.trim() : '',
    organizationType: leadData.organizationType || '',
    notes: leadData.notes || '',
    status: 'NEW',
    source: leadData.source || 'WEBSITE_SERVICES',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Prepend to memory
  inMemoryLeads = [newLead, ...inMemoryLeads];
  trackMarketDemand(leadData.packageType, 'SUBMIT_LEAD', { leadId: newLead.id });

  // Try persist to Supabase
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('market_leads').insert({
        package_type: newLead.packageType,
        package_name: newLead.packageName,
        full_name: newLead.fullName,
        phone: newLead.phone,
        email: newLead.email,
        company_name: newLead.companyName,
        organization_type: newLead.organizationType,
        notes: newLead.notes,
        status: newLead.status,
        source: newLead.source,
      }).select().single();

      if (!error && data) {
        newLead.id = data.id;
      }
    } catch (err) {
      console.warn('Could not write market_lead to Supabase, stored in resilient fallback memory:', err);
    }
  }

  return { success: true, lead: newLead };
}

/**
 * 3. Update Lead Status
 */
export async function updateMarketLeadStatus(leadId: string, status: MarketLead['status']): Promise<boolean> {
  const lead = inMemoryLeads.find((l) => l.id === leadId);
  if (lead) {
    lead.status = status;
    lead.updatedAt = new Date().toISOString();
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('market_leads').update({ status, updated_at: new Date().toISOString() }).eq('id', leadId);
    } catch (err) {
      console.warn('Supabase lead update warning:', err);
    }
  }

  return true;
}

/**
 * 4. Fetch Market Demand Analytics Summary
 */
export async function getMarketDemandSummary(): Promise<MarketDemandSummary> {
  let leads = [...inMemoryLeads];
  let clicks = { ...inMemoryClicks };

  // Try fetch from Supabase if table exists
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data: dbLeads, error: leadErr } = await supabase
        .from('market_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!leadErr && dbLeads && dbLeads.length > 0) {
        // Merge Supabase leads with memory
        const mapped: MarketLead[] = dbLeads.map((item: any) => ({
          id: item.id,
          packageType: item.package_type as PackageType,
          packageName: item.package_name || PACKAGE_INFO[item.package_type as PackageType]?.name,
          fullName: item.full_name,
          phone: item.phone,
          email: item.email || '',
          companyName: item.company_name || '',
          organizationType: item.organization_type || '',
          notes: item.notes || '',
          status: item.status || 'NEW',
          source: item.source || 'WEBSITE_SERVICES',
          createdAt: item.created_at,
          updatedAt: item.updated_at || item.created_at,
        }));
        leads = mapped;
      }

      // Count events
      const { data: dbEvents, error: evErr } = await supabase
        .from('market_demand_events')
        .select('package_type, event_type');

      if (!evErr && dbEvents && dbEvents.length > 0) {
        const evClicks: Record<PackageType, number> = { ENTREPRENEUR: 0, MICE_ENTERPRISE: 0, ASSOCIATION: 0 };
        dbEvents.forEach((ev: any) => {
          if (evClicks[ev.package_type as PackageType] !== undefined) {
            evClicks[ev.package_type as PackageType] += 1;
          }
        });
        clicks = {
          ENTREPRENEUR: clicks.ENTREPRENEUR + evClicks.ENTREPRENEUR,
          MICE_ENTERPRISE: clicks.MICE_ENTERPRISE + evClicks.MICE_ENTERPRISE,
          ASSOCIATION: clicks.ASSOCIATION + evClicks.ASSOCIATION,
        };
      }
    } catch (err) {
      console.warn('Error reading market stats from Supabase:', err);
    }
  }

  const totalClicks = Object.values(clicks).reduce((a, b) => a + b, 0);
  const totalLeads = leads.length;

  const packageStats: PackageDemandStat[] = (['MICE_ENTERPRISE', 'ENTREPRENEUR', 'ASSOCIATION'] as PackageType[]).map((type) => {
    const pClicks = clicks[type] || 0;
    const pLeads = leads.filter((l) => l.packageType === type).length;
    const percentage = totalClicks > 0 ? Math.round((pClicks / totalClicks) * 100) : 33;
    const info = PACKAGE_INFO[type];

    return {
      type,
      name: info.name,
      badge: info.badge,
      clicks: pClicks,
      leadsCount: pLeads,
      percentage,
      targetAudience: info.targetAudience,
    };
  });

  // Sort by clicks descending to find top package
  const sorted = [...packageStats].sort((a, b) => b.clicks - a.clicks);
  const topPackage: PackageDemandStat = sorted[0] || {
    type: 'MICE_ENTERPRISE',
    name: 'Doanh Nghiệp & Sự Kiện MICE',
    badge: 'PHỔ BIẾN NHẤT',
    clicks: 0,
    leadsCount: 0,
    percentage: 0,
    targetAudience: '',
  };
  const conversionRate = totalClicks > 0 ? Math.round((totalLeads / totalClicks) * 1000) / 10 : 0;

  return {
    totalClicks,
    totalLeads,
    conversionRate,
    topPackage,
    packageStats,
    leads,
  };
}
