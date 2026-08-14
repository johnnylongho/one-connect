'use client';

import React, { useState } from 'react';
import { QrCode, Camera, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QrScannerProps {
  onScanResult?: (result: string) => void;
}

export default function QrScanner({ onScanResult }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      const mockResult = 'ONECONNECT_CARD_UID_' + Math.random().toString(36).substring(2, 9).toUpperCase();
      setScannedCode(mockResult);
      setIsScanning(false);
      if (onScanResult) {
        onScanResult(mockResult);
      }
    }, 1200);
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 border border-slate-800 rounded-2xl bg-slate-900/60 backdrop-blur-md max-w-sm mx-auto text-center space-y-4 shadow-xl">
      <div className="relative flex items-center justify-center w-44 h-44 rounded-2xl border-2 border-dashed border-blue-500/50 bg-slate-950/80 overflow-hidden">
        {isScanning ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-blue-400 font-mono animate-pulse">Đang phân tích camera/QR...</p>
          </div>
        ) : scannedCode ? (
          <div className="flex flex-col items-center space-y-2 p-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            <p className="text-xs font-mono text-emerald-300 break-all">{scannedCode}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2 text-slate-400">
            <QrCode className="w-12 h-12 text-blue-400 animate-pulse" />
            <p className="text-xs">Đưa mã QR vào tầm quét</p>
          </div>
        )}
      </div>

      <Button
        onClick={handleSimulateScan}
        disabled={isScanning}
        variant="emerald"
        className="w-full gap-2"
      >
        <Camera className="w-4 h-4" />
        {isScanning ? 'Đang quét...' : 'Thử Quét QR Code'}
      </Button>
    </div>
  );
}
