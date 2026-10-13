import React, { useState } from 'react';
import { 
  Sparkles, 
  GitCompare, 
  Building2, 
  ArrowRight, 
  CalendarClock, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  Search,
  Users
} from 'lucide-react';

interface MatchPair {
  tableNumber: number;
  timeSlot: string;
  partyA: {
    name: string;
    company: string;
    role: string;
    demand: string;
  };
  partyB: {
    name: string;
    company: string;
    role: string;
    supply: string;
  };
  matchScore: number;
  estimatedDealVnd: string;
  industry: string;
  status: 'SCHEDULED' | 'IN_SESSION' | 'COMPLETED';
}

export const AiMatchmakingView: React.FC = () => {
  const [activeSlot, setActiveSlot] = useState<string>('09:30 - 10:00');
  const [filterIndustry, setFilterIndustry] = useState<string>('ALL');

  const matchPairs: MatchPair[] = [
    {
      tableNumber: 14,
      timeSlot: '09:30 - 10:00',
      partyA: {
        name: 'Đặng Quốc Huy',
        company: 'Logistics Cảng Quốc Tế Cam Ranh',
        role: 'Giám đốc Chuỗi Cung ứng',
        demand: 'Tìm kiếm đối tác vận tải container lạnh & kho bảo quản thủy sản xuất khẩu',
      },
      partyB: {
        name: 'Lê Minh Thảo',
        company: 'Khánh Hòa Marine Seafoods Corp',
        role: 'GĐ Kinh doanh Quốc tế',
        supply: 'Cung ứng 2.000 tấn tôm hùm, cá ngừ đại dương xuất khẩu sang EU & Nhật Bản',
      },
      matchScore: 96,
      estimatedDealVnd: '22.0 Tỷ',
      industry: 'Thủy sản & Logistics',
      status: 'IN_SESSION',
    },
    {
      tableNumber: 8,
      timeSlot: '09:30 - 10:00',
      partyA: {
        name: 'Trần Thị Thu Trang',
        company: 'Nha Trang Heritage Eco Resort',
        role: 'Tổng Quản lý Điều hành',
        demand: 'Tìm kiếm giải pháp số hóa thẻ khóa phòng & cổng check-in MICE không chạm',
      },
      partyB: {
        name: 'Hồ Hoàng Long (Johnny Long Hồ)',
        company: 'Tập đoàn Công nghệ số A+ (Aplusvn)',
        role: 'Trưởng Dự án One Connect',
        supply: 'Hạ tầng thẻ NFC Obsidian & trạm tiếp đón MICE 0.42s chuẩn Luật PDPL 91/2025',
      },
      matchScore: 98,
      estimatedDealVnd: '12.8 Tỷ',
      industry: 'Du lịch MICE & Tech',
      status: 'IN_SESSION',
    },
    {
      tableNumber: 21,
      timeSlot: '09:30 - 10:00',
      partyA: {
        name: 'Phạm Hương Ly',
        company: 'Kharesco Yến Sào Khánh Hòa',
        role: 'Phó Tổng Giám đốc',
        demand: 'Mở rộng kênh phân phối cao cấp tại các chuỗi khách sạn 5 sao Nha Trang - Cam Ranh',
      },
      partyB: {
        name: 'Nguyễn Văn Quang',
        company: 'CP Du lịch & Dịch vụ Biển Nha Trang',
        role: 'Phó Chủ tịch HĐQT',
        supply: 'Sở hữu mạng lưới 4 khu nghỉ dưỡng & trung tâm hội nghị quốc tế tại Bãi Dài',
      },
      matchScore: 92,
      estimatedDealVnd: '18.5 Tỷ',
      industry: 'Quà tặng VIP & Nghỉ dưỡng',
      status: 'SCHEDULED',
    },
    {
      tableNumber: 5,
      timeSlot: '10:15 - 10:45',
      partyA: {
        name: 'Vũ Đức Nam',
        company: 'Năng Lượng Tái Tạo Nam Trung Bộ',
        role: 'Chủ tịch HĐQT',
        demand: 'Đầu tư hệ thống điện mặt trời mái nhà cho các nhà máy chế biến thủy sản',
      },
      partyB: {
        name: 'Bùi Gia Phúc',
        company: 'CP Xây dựng & Hạ tầng Đô thị Biển',
        role: 'Giám đốc Dự án',
        supply: 'Thi công tổng thầu EPC nhà xưởng công nghiệp tại Khu kinh tế Vân Phong',
      },
      matchScore: 89,
      estimatedDealVnd: '35.0 Tỷ',
      industry: 'Năng lượng & Xây dựng',
      status: 'SCHEDULED',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 rounded-2xl p-6 text-white border border-purple-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[11px] font-semibold border border-purple-400/30">
              PHÂN HỆ 4 · THUẬT TOÁN AI MATCHMAKING
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Khớp nối Cung - Cầu Tự Động &lt;1s
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Sàn Đàm Phán Giao Thương B2B 1:1 Do AI Điều Phối
          </h2>
          <p className="text-xs text-purple-200/80 max-w-xl">
            Tự động bóc tách hồ sơ năng lực doanh nghiệp, phân loại nhu cầu Cung - Cầu và bố trí 32 bàn đàm phán 1:1 theo từng khung giờ sự kiện.
          </p>
        </div>

        {/* Thống kê nhanh */}
        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/15 backdrop-blur-xs">
          <div className="text-center px-2">
            <span className="text-[10px] text-purple-200 block uppercase">Bàn Đang Họp</span>
            <span className="font-bold text-lg text-white tabular-nums">32 / 32</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-center px-2">
            <span className="text-[10px] text-purple-200 block uppercase">Độ Chuẩn Ghép</span>
            <span className="font-bold text-lg text-emerald-400 tabular-nums">91.4%</span>
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <div className="text-center px-2">
            <span className="text-[10px] text-purple-200 block uppercase">Deal Pipeline</span>
            <span className="font-bold text-lg text-amber-300 tabular-nums">48.5 Tỷ</span>
          </div>
        </div>
      </div>

      {/* Bộ Lọc Khung Giờ & Ngành Nghề */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Khung giờ:</span>
          {['09:00 - 09:30', '09:30 - 10:00', '10:15 - 10:45', '11:00 - 11:30'].map((slot) => (
            <button
              key={slot}
              onClick={() => setActiveSlot(slot)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeSlot === slot
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Lọc ngành:</span>
          <select 
            value={filterIndustry} 
            onChange={(e) => setFilterIndustry(e.target.value)}
            className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none"
          >
            <option value="ALL">Tất cả ngành nghề</option>
            <option value="SEAFOOD">Thủy sản & Logistics</option>
            <option value="TOURISM">Du lịch MICE & Dịch vụ</option>
            <option value="ENERGY">Năng lượng & Xây dựng</option>
          </select>
        </div>
      </div>

      {/* Danh Sách Các Cặp Bàn Đàm Phán 1:1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matchPairs.map((pair) => (
          <div
            key={pair.tableNumber}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-purple-300 transition-all space-y-4"
          >
            {/* Header Thẻ Bàn */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-extrabold text-sm flex items-center justify-center font-mono">
                  #{pair.tableNumber}
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Bàn Đàm Phán #{pair.tableNumber}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {pair.timeSlot} · {pair.industry}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  Khớp {pair.matchScore}%
                </span>
                <span className="text-xs font-bold text-rose-600 font-mono">
                  {pair.estimatedDealVnd}
                </span>
              </div>
            </div>

            {/* Chi tiết 2 bên đối tác */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Bên A: Nhu Cầu Tìm Kiếm */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                  BÊN A · BÊN CẦU (DEMAND)
                </span>
                <div className="font-bold text-slate-800">{pair.partyA.name}</div>
                <div className="text-[11px] text-slate-500">{pair.partyA.company}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-slate-200/60 mt-1">
                  "{pair.partyA.demand}"
                </p>
              </div>

              {/* Bên B: Năng Lực Cung Ứng */}
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">
                  BÊN B · BÊN CUNG (SUPPLY)
                </span>
                <div className="font-bold text-slate-800">{pair.partyB.name}</div>
                <div className="text-[11px] text-slate-500">{pair.partyB.company}</div>
                <p className="text-[11px] text-slate-600 leading-relaxed pt-1 border-t border-purple-200/60 mt-1">
                  "{pair.partyB.supply}"
                </p>
              </div>
            </div>

            {/* Chân Thẻ */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Tuân thủ giao thức 2-Way Consent PDPL
              </span>
              <button
                onClick={() => alert(`Đã kích hoạt hỗ trợ điều phối viên tại Bàn #${pair.tableNumber}`)}
                className="font-bold text-purple-700 hover:text-purple-900 hover:underline"
              >
                Hỗ trợ đàm phán →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
