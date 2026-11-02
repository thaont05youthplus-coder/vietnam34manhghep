"use client";

import React, { useState } from "react";
import {
  X,
  Sparkles,
  MapPin,
  Mountain,
  TrendingUp,
  Image as ImageIcon,
  BookCheck,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Plane,
  Anchor,
  Compass,
  Building2,
  FileText,
} from "lucide-react";
import { ProvinceFeature } from "@/types/geo";
import { CompleteProvinceDetail } from "@/types/province-details";
import { getCompleteProvinceDetail } from "@/data/provinces-detail-data";
import { ECONOMIC_REGIONS, NATURAL_REGIONS } from "@/lib/regions";

interface ProvinceDetailPanelProps {
  province: ProvinceFeature;
  onClose: () => void;
  onOpenAiChat: (provinceName: string) => void;
  onOpenNotes: (provinceName: string) => void;
}

type TabType = "overview" | "nature" | "economy" | "images" | "sources";

export const ProvinceDetailPanel: React.FC<ProvinceDetailPanelProps> = ({
  province,
  onClose,
  onOpenAiChat,
  onOpenNotes,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const { properties } = province;
  const eco = ECONOMIC_REGIONS.find((r) => r.provinceCodes.includes(properties.provinceCode));
  const nat = NATURAL_REGIONS.find((r) => r.provinceCodes.includes(properties.provinceCode));

  const detail: CompleteProvinceDetail = getCompleteProvinceDetail(
    properties.provinceCode,
    properties.name,
    properties.nameEn,
    properties.type,
    properties.areaSqKm,
    eco?.name,
    nat?.name
  );

  return (
    <aside className="absolute top-4 right-4 z-30 w-[360px] h-[calc(100vh-100px)] flex flex-col bg-[#081a36]/95 border border-sky-700/60 rounded-2xl shadow-2xl shadow-sky-950/60 backdrop-blur-xl animate-in slide-in-from-right duration-200 select-none overflow-hidden">
      {/* Header Panel */}
      <div className="p-4 bg-[#0a2144]/90 border-b border-sky-800/50 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider bg-amber-950/70 px-1.5 py-0.2 rounded border border-amber-600/50">
                {detail.overview.code}
              </span>
              <span className="text-[11px] text-sky-200/70 font-medium">
                {detail.overview.type}
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-0.5 tracking-tight">
              {detail.overview.name}
            </h3>
            <p className="text-xs text-sky-200/70 italic">{detail.overview.nameEn}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-sky-300 hover:text-white hover:bg-sky-900/50 transition-colors"
            title="Đóng thông tin chi tiết"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5 Thanh chuyển Tab nội dung chuẩn màu nhận diện */}
        <div className="grid grid-cols-5 gap-1 mt-3 bg-[#051124]/90 p-1 rounded-xl border border-sky-800/60 text-[11px] font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm"
                : "text-sky-200/70 hover:text-white"
            }`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab("nature")}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === "nature"
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-sm"
                : "text-sky-200/70 hover:text-white"
            }`}
          >
            Tự nhiên
          </button>
          <button
            onClick={() => setActiveTab("economy")}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === "economy"
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm"
                : "text-sky-200/70 hover:text-white"
            }`}
          >
            Kinh tế
          </button>
          <button
            onClick={() => setActiveTab("images")}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === "images"
                ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-sm"
                : "text-sky-200/70 hover:text-white"
            }`}
          >
            Hình ảnh
          </button>
          <button
            onClick={() => setActiveTab("sources")}
            className={`py-1.5 rounded-lg transition-all text-center ${
              activeTab === "sources"
                ? "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-sm"
                : "text-sky-200/70 hover:text-white"
            }`}
          >
            Nguồn
          </button>
        </div>
      </div>

      {/* Nội dung cuộn của 5 Tab */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs text-slate-200 custom-scroll">
        {/* TAB 1: TỔNG QUAN */}
        {activeTab === "overview" && (
          <div className="space-y-3">
            {/* Chú thích chủ quyền biển đảo đặc biệt */}
            {detail.overview.sovereigntyNote && (
              <div className="p-3 bg-red-950/60 border border-red-700/80 rounded-xl text-xs text-yellow-200 leading-relaxed shadow-sm">
                <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>CHỦ QUYỀN BIỂN ĐẢO THIÊNG LIÊNG</span>
                </div>
                <p>{detail.overview.sovereigntyNote}</p>
              </div>
            )}

            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Diện tích tự nhiên:</span>
                <span className="font-bold text-amber-300">
                  {detail.overview.areaSqKm.toLocaleString("vi-VN")} km²
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Dân số (ước tính):</span>
                <span className="font-semibold text-slate-100">
                  {detail.overview.population.toLocaleString("vi-VN")} người
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Mật độ dân số:</span>
                <span className="font-semibold text-slate-100">
                  {detail.overview.density} người/km²
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Trung tâm hành chính:</span>
                <span className="font-semibold text-slate-100">
                  {detail.overview.centerCity}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Đơn vị hành chính:</span>
                <span className="font-semibold text-slate-100">
                  {detail.overview.units.districts} Huyện/Quận, {detail.overview.units.communes} Xã/Phường
                </span>
              </div>
            </div>

            {/* Vùng kinh tế và Tự nhiên */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Vùng Kinh tế - Xã hội:</span>
                <span className="font-bold text-blue-300">{eco?.name || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Khu vực tự nhiên:</span>
                <span className="font-bold text-emerald-300">{nat?.name || "N/A"}</span>
              </div>
            </div>

            {/* Tiếp giáp 4 hướng */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <h5 className="font-bold text-slate-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                Vị trí tiếp giáp:
              </h5>
              <div className="text-[11px] text-slate-300 space-y-1 pl-1">
                <div>• Phía Bắc: {detail.overview.borders.north}</div>
                <div>• Phía Nam: {detail.overview.borders.south}</div>
                <div>• Phía Đông: {detail.overview.borders.east}</div>
                <div>• Phía Tây: {detail.overview.borders.west}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: TỰ NHIÊN */}
        {activeTab === "nature" && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <h5 className="font-bold text-emerald-300 flex items-center gap-1.5">
                <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                Địa hình & Cảnh quan
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">{detail.nature.terrain}</p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <h5 className="font-bold text-amber-300">Đặc điểm Khí hậu</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{detail.nature.climate}</p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <h5 className="font-bold text-blue-300">Thủy văn & Sông ngòi</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{detail.nature.hydrology}</p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <h5 className="font-bold text-slate-200">Khoáng sản tiêu biểu</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{detail.nature.minerals}</p>
            </div>

            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <h5 className="font-bold text-emerald-400">Vườn quốc gia & Khu bảo tồn</h5>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {detail.nature.conservation.map((c, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: KINH TẾ - XÃ HỘI */}
        {activeTab === "economy" && (
          <div className="space-y-3">
            {/* Chỉ số kinh tế chính */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400">Quy mô GRDP:</span>
                <div className="font-bold text-amber-400 text-sm mt-0.5">
                  {detail.economy.grdpTotal}
                </div>
              </div>
              <div className="p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400">GRDP/người:</span>
                <div className="font-bold text-blue-400 text-sm mt-0.5">
                  {detail.economy.grdpPerCapita}
                </div>
              </div>
            </div>

            {/* Thanh biểu đồ tỉ lệ Cơ cấu kinh tế */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  Cơ cấu kinh tế (%):
                </h5>
                <span className="text-[10px] text-emerald-400 font-mono">
                  Tăng trưởng: {detail.economy.growthRate}
                </span>
              </div>

              {/* Progress bar phân đoạn */}
              <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-800">
                <div
                  style={{ width: `${detail.economy.structure.agriculture}%` }}
                  className="bg-emerald-500"
                  title={`Nông nghiệp: ${detail.economy.structure.agriculture}%`}
                />
                <div
                  style={{ width: `${detail.economy.structure.industry}%` }}
                  className="bg-blue-500"
                  title={`Công nghiệp: ${detail.economy.structure.industry}%`}
                />
                <div
                  style={{ width: `${detail.economy.structure.services}%` }}
                  className="bg-amber-500"
                  title={`Dịch vụ: ${detail.economy.structure.services}%`}
                />
              </div>

              <div className="grid grid-cols-3 gap-1 text-[10px] pt-1 text-center">
                <span className="text-emerald-400">
                  Nông nghiệp: {detail.economy.structure.agriculture}%
                </span>
                <span className="text-blue-400">
                  Công nghiệp: {detail.economy.structure.industry}%
                </span>
                <span className="text-amber-400">
                  Dịch vụ: {detail.economy.structure.services}%
                </span>
              </div>
            </div>

            {/* Ngành kinh tế mũi nhọn */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <h5 className="font-bold text-slate-200">Ngành kinh tế mũi nhọn:</h5>
              <div className="space-y-1 text-xs text-slate-300">
                {detail.economy.keyIndustries.map((ind, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>{ind}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hạ tầng giao thông */}
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
              <h5 className="font-bold text-slate-200">Hạ tầng giao thông kết nối:</h5>
              {detail.economy.infrastructure.airports.length > 0 && (
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Plane className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{detail.economy.infrastructure.airports.join(", ")}</span>
                </div>
              )}
              {detail.economy.infrastructure.seaports.length > 0 && (
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <Anchor className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{detail.economy.infrastructure.seaports.join(", ")}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: HÌNH ẢNH */}
        {activeTab === "images" && (
          <div className="space-y-3">
            {detail.images.map((img) => (
              <div
                key={img.id}
                className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950/80 shadow-md group"
              >
                <div className="relative w-full h-36 overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur text-[10px] text-amber-300 font-semibold border border-slate-700">
                    {img.tag}
                  </span>
                </div>
                <div className="p-2.5">
                  <h6 className="font-bold text-xs text-white">{img.title}</h6>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{img.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: NGUỒN KIỂM CHỨNG */}
        {activeTab === "sources" && (
          <div className="space-y-3">
            <div className="p-2.5 bg-blue-950/40 border border-blue-800/60 rounded-xl text-[11px] text-blue-200 leading-relaxed">
              Mọi dữ liệu trên hệ thống VN34MG đều được trích xuất từ các tài liệu thống kê, văn bản pháp quy và sách giáo khoa chính thống.
            </div>

            <div className="space-y-2">
              {detail.sources.map((src) => (
                <div
                  key={src.id}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                      <BookCheck className="w-3 h-3 text-emerald-400" />
                      Đã kiểm chứng
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Năm {src.year}</span>
                  </div>
                  <h6 className="font-bold text-xs text-slate-100 leading-snug">{src.title}</h6>
                  <p className="text-[10px] text-slate-400">Cơ quan: {src.organization}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Hành động: Mở Chat AI hoặc Ghi chú */}
      <div className="p-3 bg-slate-850 border-t border-slate-800 shrink-0 flex gap-2">
        <button
          onClick={() => onOpenAiChat(detail.overview.name)}
          className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-colors flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Hỏi AI về tỉnh này</span>
        </button>
        <button
          onClick={() => onOpenNotes(detail.overview.name)}
          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold border border-slate-700 transition-colors"
          title="Tạo ghi chú cho tỉnh này"
        >
          <FileText className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
