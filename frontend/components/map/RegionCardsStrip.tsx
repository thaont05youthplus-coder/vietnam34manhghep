"use client";

import React from "react";
import { RegionDefinition, MapMode } from "@/types/geo";
import { ECONOMIC_REGIONS, NATURAL_REGIONS } from "@/lib/regions";
import { Layers, ChevronRight } from "lucide-react";

interface RegionCardsStripProps {
  mode: MapMode;
  isDetailPanelOpen: boolean;
  selectedRegionId: string | null;
  onSelectRegion: (regionId: string | null) => void;
  onHoverRegion: (regionId: string | null) => void;
}

export const RegionCardsStrip: React.FC<RegionCardsStripProps> = ({
  mode,
  isDetailPanelOpen,
  selectedRegionId,
  onSelectRegion,
  onHoverRegion,
}) => {
  // Chỉ hiển thị dải thẻ khi ở chế độ Kinh tế - Xã hội hoặc Tự nhiên
  if (mode === "hanh_chinh") return null;

  const regions: RegionDefinition[] =
    mode === "kinh_te" ? ECONOMIC_REGIONS : NATURAL_REGIONS;

  const title =
    mode === "kinh_te" ? "6 Vùng Kinh tế - Xã hội" : "7 Khu vực Tự nhiên";

  // Khi Panel chi tiết mở -> Nằm ngang ở dưới đáy bản đồ
  // Khi Panel chi tiết đóng -> Nằm dọc ở bên phải bản đồ
  return (
    <div
      className={`absolute z-20 transition-all duration-300 select-none ${
        isDetailPanelOpen
          ? "bottom-4 left-4 right-[380px] flex items-center bg-[#081a36]/95 border border-sky-700/60 rounded-2xl p-2.5 shadow-2xl shadow-sky-950/50 backdrop-blur-md overflow-x-auto custom-scroll"
          : "top-20 right-4 w-60 max-h-[calc(100vh-170px)] flex flex-col bg-[#081a36]/95 border border-sky-700/60 rounded-2xl p-3 shadow-2xl shadow-sky-950/50 backdrop-blur-xl overflow-y-auto custom-scroll"
      }`}
    >
      {/* Tiêu đề dải thẻ */}
      <div
        className={`flex items-center justify-between pb-2 mb-2 border-b border-sky-800/40 ${
          isDetailPanelOpen ? "mr-3 pr-3 border-b-0 border-r shrink-0" : ""
        }`}
      >
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <h5 className="font-bold text-xs text-white truncate">{title}</h5>
        </div>
        {selectedRegionId && (
          <button
            onClick={() => onSelectRegion(null)}
            className="text-[10px] text-amber-400 hover:underline shrink-0"
          >
            Bỏ chọn
          </button>
        )}
      </div>

      {/* Danh sách các thẻ vùng */}
      <div
        className={`flex gap-2 ${
          isDetailPanelOpen ? "flex-row shrink-0" : "flex-col"
        }`}
      >
        {regions.map((reg) => {
          const isSelected = selectedRegionId === reg.id;
          return (
            <div
              key={reg.id}
              onClick={() => onSelectRegion(isSelected ? null : reg.id)}
              onMouseEnter={() => onHoverRegion(reg.id)}
              onMouseLeave={() => onHoverRegion(null)}
              className={`p-2 rounded-xl cursor-pointer transition-all border flex items-center justify-between ${
                isDetailPanelOpen ? "min-w-[170px] shrink-0" : "w-full"
              } ${
                isSelected
                  ? "bg-gradient-to-r from-sky-900/50 to-amber-950/40 border-amber-400 shadow-md ring-1 ring-amber-400/40"
                  : "bg-[#061224]/80 border-sky-900/50 hover:border-sky-600/80 hover:bg-[#0c2347]"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-md shrink-0 shadow-sm"
                  style={{ backgroundColor: reg.color }}
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-100 truncate">
                    {reg.name}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {reg.provinceCodes.length} tỉnh/thành
                  </div>
                </div>
              </div>

              <ChevronRight
                className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                  isSelected ? "rotate-90 text-amber-400" : ""
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
