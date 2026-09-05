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

// Pure real-time volatile memory for running process (Zero mock data)
let inMemoryClicks: Record<PackageType, number> = {
  ENTREPRENEUR: 0,
  MICE_ENTERPRISE: 0,
  ASSOCIATION: 0,
};

let inMemoryLeads: MarketLead[] = [];

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aybjbklbkrgoapakgnbs.supabase.co';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey);
}

/**
 * 1. Record Real-time Market Interest Event (Click CTA or view package)
 */
export async function trackMarketDemand(
  packageType: PackageType,
  eventType: 'VIEW_PACKAGE' | 'CLICK_CTA' | 'OPEN_MODAL' | 'SUBMIT_LEAD',
  metadata?: Record<string, any>
) {
  if (inMemoryClicks[packageType] !== undefined) {
    inMemoryClicks[packageType] += 1;
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // 1. Attempt primary dedicated table
      const { error } = await supabase.from('market_demand_events').insert({
        package_type: packageType,
        event_type: eventType,
        metadata: metadata || {},
      });

      // 2. If table doesn't exist yet, insert into live production audit_logs
      if (error) {
        await supabase.from('audit_logs').insert({
          action: 'MARKET_DEMAND_EVENT',
          entity_type: 'MARKET_DEMAND_EVENT',
          details: {
            package_type: packageType,
            event_type: eventType,
            metadata: metadata || {},
            recorded_at: new Date().toISOString(),
          },
        });
      }
    } catch (err) {
      console.warn('Could not record demand event to Supabase:', err);
    }
  }

  return { success: true, packageType, clicks: inMemoryClicks[packageType] };
}

/**
 * 2. Submit and Store Real Market Lead (100% Real data, No mock)
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

  // Prepend to current process memory
  inMemoryLeads = [newLead, ...inMemoryLeads];
  trackMarketDemand(leadData.packageType, 'SUBMIT_LEAD', { leadId: newLead.id });

  // Persist directly to Supabase production database
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('market_leads')
        .insert({
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
        })
        .select()
        .single();

      if (!error && data) {
        newLead.id = data.id;
      } else {
        // Resilient fallback into production audit_logs table
        await supabase.from('audit_logs').insert({
          action: 'MARKET_LEAD_SUBMIT',
          entity_type: 'MARKET_LEAD',
          details: {
            id: newLead.id,
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
            created_at: newLead.createdAt,
            updated_at: newLead.updatedAt,
          },
        });
      }
    } catch (err) {
      console.warn('Error saving market lead to Supabase:', err);
    }
  }

  return { success: true, lead: newLead };
}

/**
 * 3. Update Real Lead Status
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
      const { error } = await supabase
        .from('market_leads')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', leadId);

      if (error) {
        // Update in audit_logs
        const { data: logs } = await supabase
          .from('audit_logs')
          .select('id, details')
          .eq('entity_type', 'MARKET_LEAD');

        if (logs) {
          const targetLog = logs.find((row: any) => row.details?.id === leadId);
          if (targetLog) {
            await supabase
              .from('audit_logs')
              .update({
                details: { ...targetLog.details, status, updated_at: new Date().toISOString() },
              })
              .eq('id', targetLog.id);
          }
        }
      }
    } catch (err) {
      console.warn('Supabase lead status update warning:', err);
    }
  }

  return true;
}

/**
 * 4. Fetch Real Market Demand Analytics Summary (Strictly 100% Real Data)
 */
export async function getMarketDemandSummary(): Promise<MarketDemandSummary> {
  let leads: MarketLead[] = [];
  let clicks: Record<PackageType, number> = {
    ENTREPRENEUR: 0,
    MICE_ENTERPRISE: 0,
    ASSOCIATION: 0,
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // 1. Fetch leads from market_leads
      const { data: dbLeads, error: leadErr } = await supabase
        .from('market_leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (!leadErr && dbLeads && dbLeads.length > 0) {
        leads = dbLeads.map((item: any) => ({
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
      } else {
        // Query audit_logs
        const { data: logLeads } = await supabase
          .from('audit_logs')
          .select('*')
          .eq('entity_type', 'MARKET_LEAD')
          .order('created_at', { ascending: false });

        if (logLeads && logLeads.length > 0) {
          leads = logLeads.map((row: any) => ({
            id: row.details?.id || row.id,
            packageType: row.details?.package_type as PackageType,
            packageName: row.details?.package_name || PACKAGE_INFO[row.details?.package_type as PackageType]?.name,
            fullName: row.details?.full_name || 'Khách hàng',
            phone: row.details?.phone || '',
            email: row.details?.email || '',
            companyName: row.details?.company_name || '',
            organizationType: row.details?.organization_type || '',
            notes: row.details?.notes || '',
            status: row.details?.status || 'NEW',
            source: row.details?.source || 'WEBSITE_SERVICES',
            createdAt: row.details?.created_at || row.created_at,
            updatedAt: row.details?.updated_at || row.created_at,
          }));
        }
      }

      // 2. Fetch events from market_demand_events
      const { data: dbEvents, error: evErr } = await supabase
        .from('market_demand_events')
        .select('package_type, event_type');

      if (!evErr && dbEvents && dbEvents.length > 0) {
        dbEvents.forEach((ev: any) => {
          if (clicks[ev.package_type as PackageType] !== undefined) {
            clicks[ev.package_type as PackageType] += 1;
          }
        });
      } else {
        // Query audit_logs
        const { data: logEvents } = await supabase
          .from('audit_logs')
          .select('details')
          .eq('entity_type', 'MARKET_DEMAND_EVENT');

        if (logEvents && logEvents.length > 0) {
          logEvents.forEach((row: any) => {
            const pType = row.details?.package_type as PackageType;
            if (pType && clicks[pType] !== undefined) {
              clicks[pType] += 1;
            }
          });
        }
      }
    } catch (err) {
      console.warn('Error reading market stats from Supabase:', err);
    }
  }

  // Merge any leads created in the current runtime if not yet indexed in query
  inMemoryLeads.forEach((memLead) => {
    if (!leads.some((l) => l.id === memLead.id || (l.phone === memLead.phone && l.packageType === memLead.packageType))) {
      leads.unshift(memLead);
    }
  });

  // Calculate genuine real-time metrics
  const totalClicks = Object.values(clicks).reduce((a, b) => a + b, 0);
  const totalLeads = leads.length;

  const packageStats: PackageDemandStat[] = (['MICE_ENTERPRISE', 'ENTREPRENEUR', 'ASSOCIATION'] as PackageType[]).map((type) => {
    const pClicks = clicks[type] || 0;
    const pLeads = leads.filter((l) => l.packageType === type).length;
    const percentage = totalClicks > 0 ? Math.round((pClicks / totalClicks) * 100) : 0;
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

  const sorted = [...packageStats].sort((a, b) => b.clicks - a.clicks);
  const firstPackage = sorted[0];
  const topPackage: PackageDemandStat = (firstPackage && firstPackage.clicks > 0 ? firstPackage : null) || {
    type: 'MICE_ENTERPRISE',
    name: (firstPackage && totalClicks > 0) ? firstPackage.name : 'Chưa có dữ liệu tương tác',
    badge: 'REALTIME',
    clicks: 0,
    leadsCount: 0,
    percentage: 0,
    targetAudience: 'Đang lắng nghe dữ liệu truy cập thực tế từ thị trường',
  };

  const conversionRate = totalClicks > 0 ? Math.round((totalLeads / totalClicks) * 1000) / 10 : (totalLeads > 0 ? 100 : 0);

  return {
    totalClicks,
    totalLeads,
    conversionRate,
    topPackage,
    packageStats,
    leads,
  };
}
