'use client';

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  href?: string;
}

export function Logo({
  variant = 'auto',
  size = 'md',
  showText = true,
  className = '',
  href = '/dashboard',
}: LogoProps) {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
  };

  const content = (
    <div className={`flex items-center gap-2.5 shrink-0 group select-none ${className}`}>
      {/* Crisp Vector SVG Emblem */}
      <div className="relative shrink-0 transition-transform group-hover:scale-105 duration-200">
        <svg
          className={`${sizeClasses[size]} w-auto aspect-square`}
          viewBox="0 0 60 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoEmblemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0066FF" />
              <stop offset="50%" stopColor="#00C2FF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="logoGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FBBF24" />
            </linearGradient>
          </defs>
          <rect x="0" y="0" width="60" height="60" rx="16" fill="url(#logoEmblemGrad)" />
          <rect x="3" y="3" width="54" height="54" rx="13" fill="#0A1128" />
          <path d="M26 18 L33 14 L33 46 L25 46" fill="url(#logoEmblemGrad)" />
          <path d="M37 22 A 10 10 0 0 1 37 38" stroke="url(#logoGoldGrad)" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M42 17 A 17 17 0 0 1 42 43" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M47 12 A 24 24 0 0 1 47 48" stroke="#0066FF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
          <circle cx="21" cy="44" r="3" fill="#FBBF24" />
          <circle cx="39" cy="44" r="3" fill="#00C2FF" />
          <line x1="21" y1="44" x2="39" y2="44" stroke="#00C2FF" strokeWidth="2" strokeDasharray="2 2" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <div className="flex items-center gap-1.5">
            <span className="font-heading font-black text-slate-900 tracking-tight text-base sm:text-lg">
              ONE <span className="bg-gradient-to-r from-[#0066FF] to-[#00C2FF] bg-clip-text text-transparent">CONNECT</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-blue-50 text-[#0066FF] border border-blue-200/80">
              B2B
            </span>
          </div>
          <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
            Business Relationship Network
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} title="One Connect Network">
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
