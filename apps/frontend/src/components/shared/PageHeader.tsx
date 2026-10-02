'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface PageHeaderProps {
  supertitle?: string;
  title: string;
  description?: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: 'blue' | 'emerald' | 'amber' | 'purple' | 'orange';
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}

export function PageHeader({
  supertitle,
  title,
  description,
  icon: Icon,
  badge,
  badgeVariant = 'blue',
  backHref,
  backLabel,
  actions,
}: PageHeaderProps) {
  const badgeColors: Record<string, string> = {
    blue: 'bg-blue-50 text-[#0066FF] border-blue-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-2xs w-full">
      {/* Background Soft Glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#0066FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#FF6B00]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Icon & Title Info */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
          {backHref && (
            <Link
              href={backHref}
              title={backLabel || 'Quay lại'}
              className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors shrink-0 cursor-pointer shadow-2xs mt-0.5 sm:mt-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}

          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0066FF] border border-blue-100 flex items-center justify-center shrink-0 shadow-2xs">
            <Icon className="w-5 h-5 text-[#0066FF]" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            {supertitle && (
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] sm:text-[11px] font-black tracking-widest text-[#0066FF] uppercase font-mono truncate">
                  {supertitle}
                </span>
                {badge && (
                  <Badge variant="outline" className={`text-[9.5px] font-bold px-1.5 py-0.2 shrink-0 ${badgeColors[badgeVariant] || badgeColors.blue}`}>
                    {badge}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading leading-tight">
                {title}
              </h1>
              {!supertitle && badge && (
                <Badge variant="outline" className={`text-[10px] font-bold px-2 py-0.5 shrink-0 ${badgeColors[badgeVariant] || badgeColors.blue}`}>
                  {badge}
                </Badge>
              )}
            </div>

            {description && (
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-normal">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right Side: Action Controls */}
        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-start md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
