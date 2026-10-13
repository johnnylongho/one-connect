import React, { useState } from 'react';
import { 
  Users, 
  CreditCard, 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  Download, 
  MoreHorizontal, 
  CheckCircle2,
  Building,
  Mail,
  Phone
} from 'lucide-react';
import { EntityRecord } from '../../types/database';

interface MembersManagementViewProps {
  entities: EntityRecord[];
  onSelectMember: (entity: EntityRecord) => void;
}

export const MembersManagementView: React.FC<MembersManagementViewProps> = ({
  entities,
  onSelectMember,
}) => {
  const [viewMode, setViewMode] = useState<'CARD' | 'TABLE'>('CARD');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredMembers = entities.filter((e) => {
    const matchesSearch = 
      e.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tax_id.includes(searchQuery);

    const matchesRole = roleFilter === 'ALL' || e.tier === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 rounded-2xl p-6 text-white border border-slate-700 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[11px] font-semibold border border-blue-400/30">
              PHÂN HỆ 2 · CỔNG QUẢN TRỊ HIỆP HỘI
            </span>
            <span className="text-[11px] text-slate-300 font-medium">
              Hội Doanh Nhân Trẻ Tỉnh Khánh Hòa
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Quản Lý Danh Bạ Hội Viên & Định Danh Doanh Nghiệp (RBAC)
          </h2>
          <p className="text-xs text-blue-200/80 max-w-xl">
            Tập trung dữ liệu hội đồng quản trị, cấp phát thẻ doanh nhân số NFC hàng loạt, giám sát mức độ gắn kết giao thương và tích hợp xác thực VNeID Đề án 06.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => alert("Mở form thêm mới hội viên và gán mã UID thẻ NFC")}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" />
            Thêm Hội Viên Mới
          </button>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm hội viên, công ty, mã số thuế..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Lọc vai trò */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400 font-medium mr-1">Phân quyền:</span>
            {['ALL', 'VIP', 'ORGANIZER', 'DELEGATE'].map((tier) => (
              <button
                key={tier}
                onClick={() => setRoleFilter(tier)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  roleFilter === tier
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {tier === 'ALL' ? 'Tất cả' : tier}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          {/* Chuyển chế độ Card View / Table View */}
          <div className="flex items-center p-0.5 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('CARD')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                viewMode === 'CARD' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Card View (Tablet)
            </button>
            <button
              onClick={() => setViewMode('TABLE')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                viewMode === 'TABLE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Bảng Chi Tiết
            </button>
          </div>
        </div>
      </div>

      {/* Grid Danh Sách Dạng Card View */}
      {viewMode === 'CARD' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member)}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm group-hover:scale-105 transition-transform">
                    {member.full_name.charAt(0)}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    member.tier === 'VIP' 
                      ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {member.tier}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5 truncate">
                  {member.full_name}
                  {member.vneid_verified && (
                    <span title="Đã xác thực CCCD/VNeID">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-600 font-medium truncate mt-0.5">
                  {member.title}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {member.company_name}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Mã thẻ NFC:</span>
                  <span className="font-mono text-slate-700 font-bold">{member.card_uid}</span>
                </div>
                <div className="flex justify-between text-slate-500 text-[11px]">
                  <span>Điểm gắn kết B2B:</span>
                  <span className="font-bold text-emerald-600">{member.connection_score}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Chế độ Bảng */
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-2.5 pr-4">Họ và Tên Hội Viên</th>
                <th className="py-2.5 px-3">Doanh Nghiệp & Chức Vụ</th>
                <th className="py-2.5 px-3">Mã Số Thuế</th>
                <th className="py-2.5 px-3">Mã Thẻ NFC</th>
                <th className="py-2.5 px-3">Phân Quyền</th>
                <th className="py-2.5 pl-3 text-right">Tác Vụ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((m) => (
                <tr 
                  key={m.id} 
                  onClick={() => onSelectMember(m)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="py-3 pr-4 font-bold text-slate-900 flex items-center gap-1.5">
                    {m.full_name}
                    {m.vneid_verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />}
                  </td>
                  <td className="py-3 px-3 text-slate-600">{m.title} · {m.company_name}</td>
                  <td className="py-3 px-3 font-mono text-slate-500">{m.tax_id}</td>
                  <td className="py-3 px-3 font-mono text-blue-600">{m.card_uid}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                      {m.tier}
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right">
                    <button className="p-1 rounded text-slate-400 hover:text-slate-700">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
