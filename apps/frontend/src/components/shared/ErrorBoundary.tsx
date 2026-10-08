'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary Uncaught Exception]:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-3xl bg-white border border-rose-200 text-center space-y-4 max-w-lg mx-auto shadow-sm my-6">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 mx-auto flex items-center justify-center">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-base font-bold text-slate-900">
              {this.props.fallbackTitle || 'Đã Xảy Ra Lỗi Khởi Chạy Thiết Bị'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {this.props.fallbackMessage ||
                'Trình điều khiển thiết bị (Camera QR hoặc Đầu đọc NFC) gặp sự cố tạm thời hoặc quyền truy cập phần cứng bị từ chối.'}
            </p>
            {this.state.error?.message && (
              <p className="text-[11px] font-mono text-rose-700 bg-rose-50/80 p-2 rounded-xl border border-rose-200/60 break-all text-left">
                {this.state.error.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              onClick={this.handleReset}
              className="bg-[#0066FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Khởi Động Lại Máy Quét
            </Button>
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              Về Dashboard
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
