'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useOneConnectStore } from '@/lib/store';
import { ShieldCheck, ArrowRight, CreditCard, Sparkles, UserPlus, LogIn, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DbService } from '@/lib/db-service';

export default function NfcLandingRouter() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const cardUid = (params?.cardUid as string) || '';
  const action = searchParams?.get('action') || '';
  const eventId = searchParams?.get('eventId') || 'evt-001';
  const { state, performCheckIn } = useOneConnectStore();

  const [loading, setLoading] = useState(true);
  const [matchedCard, setMatchedCard] = useState<any>(null);
  const [matchedIdentity, setMatchedIdentity] = useState<any>(null);

  useEffect(() => {
    let isCancelled = false;

    const RESERVED_PATHS = [
      'dashboard',
      'admin',
      'events',
      'onboarding',
      'operator',
      'attendee',
      'auth',
      'login',
      'register',
      'p',
      'api',
      'organizer',
      'services',
      'social-value',
      'posts',
    ];
    if (RESERVED_PATHS.includes(cardUid.toLowerCase())) {
      return;
    }

    // Mobile Haptic feedback when card is tapped
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(80);
      } catch {}
    }

    const cleanUid = decodeURIComponent(cardUid).trim();
    const cleanUidLower = cleanUid.toLowerCase();

    // 1. First priority: Query Production Cloud Supabase directly
    DbService.resolveCardUid(cleanUid)
      .then((cloudRes) => {
        if (isCancelled) return;
        if (cloudRes.card && cloudRes.identity) {
          setMatchedCard(cloudRes.card);
          setMatchedIdentity(cloudRes.identity);
          if (action === 'checkin') {
            performCheckIn(eventId, cloudRes.card.cardUid, 'NFC');
          }
          const targetUrl = `/p/${cloudRes.identity.username || cloudRes.identity.id}${action === 'checkin' ? '?checked_in=1' : ''}`;
          router.replace(targetUrl);
          return;
        }

        // 2. Secondary check: Search in local store cards
        const localCard = state.cards.find(
          (c) =>
            c.cardUid.toLowerCase() === cleanUidLower ||
            c.id.toLowerCase() === cleanUidLower ||
            c.nfcIdentifier?.toLowerCase() === cleanUidLower
        );

        if (localCard && localCard.personIdentityId) {
          const localIdentity = state.identities.find((i) => i.id === localCard.personIdentityId);
          if (localIdentity) {
            setMatchedCard(localCard);
            setMatchedIdentity(localIdentity);
            if (action === 'checkin') {
              performCheckIn(eventId, localCard.cardUid, 'NFC');
            }
            const targetUrl = `/p/${localIdentity.username || localIdentity.id}${action === 'checkin' ? '?checked_in=1' : ''}`;
            router.replace(targetUrl);
            return;
          }
        }

        // 3. Check direct username or profile ID matching
        const directIdentity = state.identities.find(
          (i) =>
            i.username.toLowerCase() === cleanUidLower ||
            i.id.toLowerCase() === cleanUidLower
        );

        if (directIdentity) {
          setMatchedIdentity(directIdentity);
          if (action === 'checkin') {
            performCheckIn(eventId, cleanUid, 'NFC');
          }
          const targetUrl = `/p/${directIdentity.username || directIdentity.id}${action === 'checkin' ? '?checked_in=1' : ''}`;
          router.replace(targetUrl);
          return;
        }

        // Unassigned or new blank card: finish loading and display activation screen
        setLoading(false);
      })
      .catch((err) => {
        console.warn('NFC resolution error:', err);
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [cardUid, action, eventId, state.cards, state.identities, performCheckIn, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A1124] text-white flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <div className="w-14 h-14 rounded-full border-4 border-cyan-400 border-t-transparent animate-spin shadow-[0_0_20px_rgba(0,229,255,0.4)]" />
        <p className="text-xs font-mono font-bold text-cyan-300 tracking-wider animate-pulse">
          Đang nhận diện thẻ NFC ({cardUid})...
        </p>
      </div>
    );
  }

  if (!matchedIdentity) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0A1124] to-[#050811] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#0D162B]/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.5)] text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.25)]">
            <CreditCard className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-mono px-3 py-1 rounded-full">
              UID: {cardUid}
            </Badge>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading tracking-tight">
              Thẻ Doanh Nhân Chưa Được Kích Hoạt
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
              Chào mừng Quý Doanh nhân! Thẻ thông minh NFC này đang ở trạng thái phôi chuẩn bị. Vui lòng kích hoạt để liên kết danh thiếp số chính chủ ngay hôm nay.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link href={`/register?cardUid=${encodeURIComponent(cardUid)}`} className="block w-full">
              <Button className="w-full bg-gradient-to-r from-[#0066FF] to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-2xl text-xs sm:text-sm py-5 shadow-lg shadow-cyan-500/20 transition-all active:scale-98 cursor-pointer">
                <UserPlus className="w-4 h-4 mr-2" /> Kích Hoạt Thẻ &amp; Đăng Ký Hồ Sơ Mới
              </Button>
            </Link>

            <Link href={`/login?cardUid=${encodeURIComponent(cardUid)}`} className="block w-full">
              <Button variant="outline" className="w-full border-slate-700 bg-white/5 hover:bg-white/10 text-slate-200 rounded-2xl text-xs py-5 transition-all cursor-pointer">
                <LogIn className="w-4 h-4 mr-2 text-cyan-400" /> Đăng Nhập Để Gán Vào Tài Khoản Có Sẵn
              </Button>
            </Link>

            <Link href="/" className="block w-full">
              <Button variant="ghost" className="w-full text-slate-400 hover:text-white hover:bg-transparent text-xs py-2">
                <Compass className="w-3.5 h-3.5 mr-1.5" /> Về Cổng Thông Tin One Connect
              </Button>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10.5px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Mã hóa chuẩn NFC ISO/IEC 14443A • Bảo vệ dữ liệu PDPL</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
