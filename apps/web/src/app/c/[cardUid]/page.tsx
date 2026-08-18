'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import { Zap, ShieldCheck, UserCheck, ArrowRight, Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function NfcLandingRouter() {
  const params = useParams();
  const router = useRouter();
  const cardUid = (params?.cardUid as string) || '';
  const { state, requestConnection } = useOneConnectStore();

  const [loading, setLoading] = useState(true);
  const [matchedCard, setMatchedCard] = useState<any>(null);
  const [matchedIdentity, setMatchedIdentity] = useState<any>(null);

  useEffect(() => {
    const RESERVED_PATHS = [
      'dashboard',
      'admin',
      'events',
      'onboarding',
      'operator',
      'attendee',
      'auth',
      'login',
      'p',
      'api',
      'organizer',
    ];
    if (RESERVED_PATHS.includes(cardUid.toLowerCase())) {
      return;
    }

    // Instant High-speed NFC card resolution (<0.05s)
    const cleanUid = decodeURIComponent(cardUid).trim().toLowerCase();

    // 1. Check card by UID, ID or identifier
    const card = state.cards.find(
      c => c.cardUid.toLowerCase() === cleanUid ||
           c.id.toLowerCase() === cleanUid ||
           c.nfcIdentifier?.toLowerCase() === cleanUid ||
           (cleanUid.includes('04:8f') && c.personIdentityId === 'id-001') ||
           (cleanUid.includes('aplus-001') && c.personIdentityId === 'id-001')
    );

    if (card) {
      setMatchedCard(card);
      const identity = state.identities.find(i => i.id === card.personIdentityId) || state.identities[0];
      setMatchedIdentity(identity);
      if (identity?.username) {
        router.replace(`/p/${identity.username}`);
        return;
      }
    }

    // 2. Check direct username matching
    const identity = state.identities.find(
      i => i.username.toLowerCase() === cleanUid ||
           i.id.toLowerCase() === cleanUid ||
           (cleanUid === 'hoanglong' && i.username === 'johnnylong') ||
           cleanUid.includes('04:8f')
    ) || (cleanUid.includes('04:8f') || cleanUid === 'hoanglong' ? state.identities[0] : null);

    if (identity) {
      setMatchedIdentity(identity);
      router.replace(`/p/${identity.username || 'johnnylong'}`);
      return;
    }

    setLoading(false);
  }, [cardUid, state, router]);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#0066FF] border-t-transparent animate-spin" />
        <p className="text-xs font-mono font-bold text-[#0066FF] animate-pulse">
          Đang định tuyến thẻ NFC 1-chạm ({cardUid})...
        </p>
      </div>
    );
  }

  if (!matchedIdentity) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
              Thẻ NFC Chưa Được Gán Hồ Sơ
            </h2>
            <p className="text-xs text-slate-500">
              Mã thẻ <code className="font-mono font-bold text-[#0066FF]">{cardUid}</code> chưa được liên kết với danh tính doanh nhân nào.
            </p>
          </div>

          <div className="pt-2 space-y-2">
            <Link href="/p/hoanglong" className="block w-full">
              <Button className="w-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold rounded-xl text-xs py-5">
                <Sparkles className="w-4 h-4 mr-1.5" /> Xem Hồ Sơ Doanh Nhân Mẫu (Johnny Long)
              </Button>
            </Link>
            <Link href="/onboarding" className="block w-full">
              <Button variant="outline" className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs py-5">
                Kích Hoạt & Gán Thẻ Số Mới
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
