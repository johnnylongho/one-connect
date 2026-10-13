'use client';

import React, { useState, useMemo } from 'react';
import { 
  ActivityFeedItem 
} from './types';
import { 
  CreditCard, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Calendar,
  Clock,
  Activity
} from 'lucide-react';

interface RecentActivityListProps {
  activities: ActivityFeedItem[];
  onActivityClick?: (item: ActivityFeedItem) => void;
  onViewAuditTrail?: () => void;
}

export const RecentActivityList: React.FC<RecentActivityListProps> = ({
  activities,
  onActivityClick,
  onViewAuditTrail,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filteredActivities = useMemo(() => {
    if (selectedCategory === 'ALL') return activities;
    return activities.filter((item) => item.category === selectedCategory);
  }, [activities, selectedCategory]);

  const getIcon = (category: ActivityFeedItem['category']) => {
    switch (category) {
      case 'CHECK_IN':
        return <CreditCard className="w-3.5 h-3.5 text-blue-600" />;
      case 'CONSENT_MATCH':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'AI_PAIR':
        return <Sparkles className="w-3.5 h-3.5 text-purple-600" />;
      case 'CARD_ISSUE':
        return <Layers className="w-3.5 h-3.5 text-amber-600" />;
      case 'EVENT_LAUNCH':
        return <Calendar className="w-3.5 h-3.5 text-indigo-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getBadgeStyle = (category: ActivityFeedItem['category']) => {
    switch (category) {
      case 'CHECK_IN':
        return 'bg-blue-50 border-blue-200';
      case 'CONSENT_MATCH':
        return 'bg-emerald-50 border-emerald-200';
      case 'AI_PAIR':
        return 'bg-purple-50 border-purple-200';
      case 'CARD_ISSUE':
        return 'bg-amber-50 border-amber-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs h-full flex flex-col">
      {/* Title Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Nhật Ký Hoạt Động (Recent Activity)
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold font-mono">
              {filteredActivities.length} sự kiện
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Dòng sự kiện kết nối thời gian thực từ Supabase
          </p>
        </div>
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Dữ liệu kết nối trực tiếp" />
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 border-b border-slate-100/70 text-[11px] scrollbar-none">
        {[
          { id: 'ALL', label: 'Tất cả' },
          { id: 'CHECK_IN', label: 'Check-in' },
          { id: 'CONSENT_MATCH', label: 'PDPL Consent' },
          { id: 'AI_PAIR', label: 'AI Match' },
          { id: 'CARD_ISSUE', label: 'Cấp Thẻ' },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg font-medium shrink-0 transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white font-bold shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Timeline List */}
      {filteredActivities.length === 0 ? (
        <div className="flex-1 py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center space-y-2">
          <Activity className="w-8 h-8 text-slate-300" />
          <p>Chưa có hoạt động nào được ghi nhận gần đây.</p>
        </div>
      ) : (
        <div className="flex-1 space-y-4 relative before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-0.5 before:bg-slate-100 max-h-[500px] overflow-y-auto pr-1">
          {filteredActivities.map((item) => (
            <div
              key={item.id}
              onClick={() => onActivityClick?.(item)}
              className="flex items-start gap-3 relative group cursor-pointer hover:bg-slate-50/70 p-2 -mx-2 rounded-xl transition-colors"
            >
              {/* Timeline Node Icon */}
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 z-10 ${getBadgeStyle(item.category)}`}>
                {getIcon(item.category)}
              </div>

              {/* Event Description */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="text-[11px] font-semibold text-slate-400 tabular-nums">
                    {item.time}
                  </span>
                  <span className="text-[10px] font-medium text-slate-500 truncate max-w-[120px]">
                    {item.organization}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Filter Footer */}
      <div className="pt-3 mt-auto border-t border-slate-100 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 font-medium">Tự động đồng bộ Supabase Cloud</span>
        {onViewAuditTrail && (
          <button 
            onClick={onViewAuditTrail}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Xem toàn bộ Audit Log →
          </button>
        )}
      </div>
    </div>
  );
};
