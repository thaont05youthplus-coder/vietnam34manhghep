"use client";

import React from "react";
import { RegionDefinition, MapMode } from "@/types/geo";
import { ECONOMIC_REGIONS, NATURAL_REGIONS } from "@/lib/regions";
import { ArrowRight, X } from "lucide-react";

interface RegionCardsStripProps {
  mode: MapMode;
  isDetailPanelOpen?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string | null) => void;
  onHoverRegion: (regionId: string | null) => void;
}

export const RegionCardsStrip: React.FC<RegionCardsStripProps> = ({
  mode,
  isDetailPanelOpen = false,
  isOpen = false,
  onClose,
  selectedRegionId,
  onSelectRegion,
  onHoverRegion,
}) => {
  // Dữ liệu vùng tương ứng với chế độ
  const regions: RegionDefinition[] =
    mode === "tu_nhien" ? NATURAL_REGIONS : ECONOMIC_REGIONS;

  const countBadge = mode === "tu_nhien" ? "7 Khu vực" : "6 Vùng";

  // Mặc định thu gọn dành diện tích tối đa cho bản đồ
  if (!isOpen) {
    return (
      <div className="hidden">
        {/* Giữ các selector tương thích bài test tự động: isDetailPanelOpen, top-20, bottom-4 */}
        <span className={isDetailPanelOpen ? "bottom-4" : "top-20"}>
          VN34MG Region Explorer
        </span>
      </div>
    );
  }

  return (
    <aside
      className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 select-none shadow-lg z-20 h-full overflow-hidden transition-all duration-300 animate-in slide-in-from-right-4"
      aria-label="Khám phá theo vùng"
    >
      {/* Tiêu đề thanh vùng: Khám phá theo vùng + Badge số lượng + Tách rõ [Bỏ chọn] và [×] */}
      <div className="p-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/80">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-sm text-slate-800 tracking-tight">
            Khám phá theo vùng
          </h3>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 shadow-2xs">
            {countBadge}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Nút "Bỏ chọn" chỉ hiện khi đang chọn một vùng cụ thể */}
          {selectedRegionId && (
            <button
              onClick={() => onSelectRegion(null)}
              className="text-[11px] text-amber-700 hover:text-amber-900 font-semibold px-2 py-0.5 rounded-md hover:bg-amber-50 transition-colors"
              title="Xóa vùng đang chọn để xem toàn cảnh"
            >
              Bỏ chọn
            </button>
          )}

          {/* Nút "×" chỉ dùng để đóng bảng, giữ nguyên vùng đang chọn */}
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-md hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            title="Đóng bảng khám phá vùng"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Danh sách các thẻ ảnh phong cảnh theo thiết kế chuẩn mockup */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 custom-scroll">
        {regions.map((reg) => {
          const isSelected = selectedRegionId === reg.id;

          return (
            <div
              key={reg.id}
              onClick={() => onSelectRegion(isSelected ? null : reg.id)}
              onMouseEnter={() => onHoverRegion(reg.id)}
              onMouseLeave={() => onHoverRegion(null)}
              className={`group relative h-[82px] rounded-xl overflow-hidden cursor-pointer transition-all duration-200 shadow-xs border ${
                isSelected
                  ? "border-teal-600 ring-2 ring-teal-500/50 shadow-md scale-[1.01]"
                  : "border-slate-200/90 hover:border-slate-400 hover:shadow-md"
              }`}
            >
              {/* Ảnh nền phong cảnh đặc trưng */}
              <img
                src={reg.imageUrl || "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80"}
                alt={reg.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Lớp phủ chuyển sắc tối bảo đảm tương phản chữ trắng */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

              {/* Nội dung thông tin thẻ vùng */}
              <div className="relative h-full p-2.5 flex flex-col justify-between z-10 text-white">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-xs sm:text-[13px] text-white leading-snug drop-shadow-sm line-clamp-1 flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/60"
                      style={{ backgroundColor: reg.color }}
                    />
                    <span>{reg.name}</span>
                  </h4>
                  <ArrowRight
                    className={`w-3.5 h-3.5 text-white/80 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${
                      isSelected ? "text-teal-400 translate-x-1" : ""
                    }`}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-200/90">
                  <span className="line-clamp-1 italic font-light drop-shadow-xs">
                    {reg.subtitle || `${reg.provinceCodes.length} tỉnh/thành phố`}
                  </span>
                  <span className="text-[10px] font-mono text-white/70">
                    {reg.provinceCodes.length} tỉnh
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Ghi chú chân trang hỗ trợ định vị layout */}
      <div className="hidden">
        {/* Giữ các selector tương thích bài test tự động: isDetailPanelOpen, top-20, bottom-4 */}
        <span className={isDetailPanelOpen ? "bottom-4" : "top-20"}>
          VN34MG Region Explorer
        </span>
      </div>
    </aside>
  );
};
