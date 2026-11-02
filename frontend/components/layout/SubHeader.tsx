"use client";

import React, { useState, useRef, useEffect } from "react";
import { Layers, ChevronDown, Check, Globe } from "lucide-react";
import { MapMode } from "@/types/geo";

export interface LayerSettings {
  wards: boolean;
  boundaries: boolean;
  sovereignty: boolean;
  grid: boolean;
}

interface SubHeaderProps {
  mode: MapMode;
  onModeChange: (mode: MapMode) => void;
  filterScope: "province" | "region";
  onFilterScopeChange: (scope: "province" | "region") => void;
  layers: LayerSettings;
  onToggleLayer: (key: keyof LayerSettings) => void;
}

export const SubHeader: React.FC<SubHeaderProps> = ({
  mode,
  onModeChange,
  filterScope,
  onFilterScopeChange,
  layers,
  onToggleLayer,
}) => {
  const [isLayerMenuOpen, setIsLayerMenuOpen] = useState(false);
  const layerMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (layerMenuRef.current && !layerMenuRef.current.contains(e.target as Node)) {
        setIsLayerMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-11 bg-slate-50 border-b border-slate-200 px-4 flex items-center justify-between z-20 shrink-0 select-none text-xs">
      {/* Cụm trái: 3 Chức năng cốt lõi (Hành chính, Tự nhiên, Kinh tế) + Chọn theo */}
      <div className="flex items-center gap-3">
        {/* Nhóm 3 chế độ bản đồ chính */}
        <div className="flex bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/60 shadow-inner">
          <button
            onClick={() => onModeChange("hanh_chinh")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === "hanh_chinh"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                mode === "hanh_chinh" ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            <span>Hành chính (34 tỉnh)</span>
          </button>

          <button
            onClick={() => onModeChange("tu_nhien")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === "tu_nhien"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                mode === "tu_nhien" ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            <span>Tự nhiên (7 khu vực)</span>
          </button>

          <button
            onClick={() => onModeChange("kinh_te")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all ${
              mode === "kinh_te"
                ? "bg-white text-slate-900 shadow-sm font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                mode === "kinh_te" ? "bg-emerald-500" : "bg-slate-400"
              }`}
            />
            <span>Kinh tế - Xã hội (6 vùng)</span>
          </button>
        </div>

        {/* Bộ chọn góc nhìn: Tỉnh/thành | Vùng */}
        <div className="hidden sm:flex items-center gap-1.5 text-slate-500 text-xs pl-2 border-l border-slate-300">
          <span>Chọn theo:</span>
          <div className="flex bg-slate-200/70 p-0.5 rounded-md border border-slate-300/60 font-medium">
            <button
              onClick={() => onFilterScopeChange("province")}
              className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                filterScope === "province"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tỉnh/thành
            </button>
            <button
              onClick={() => onFilterScopeChange("region")}
              className={`px-2 py-0.5 rounded text-[11px] transition-all ${
                filterScope === "region"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Vùng
            </button>
          </div>
        </div>
      </div>

      {/* Cụm phải: Trạng thái chuẩn GIS & Menu Lớp hiển thị */}
      <div className="flex items-center gap-3">
        {/* Tọa độ chuẩn GIS */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-600 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>GIS WGS84 • VN-2000</span>
        </div>

        {/* Dropdown Lớp hiển thị */}
        <div className="relative" ref={layerMenuRef}>
          <button
            onClick={() => setIsLayerMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold shadow-xs transition-colors"
          >
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Lớp hiển thị</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLayerMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Menu thả xuống */}
          {isLayerMenuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs space-y-1 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Quản lý các lớp dữ liệu
              </div>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                <span className="text-slate-700">Phường / Xã trung tâm</span>
                <input
                  type="checkbox"
                  checked={layers.wards}
                  onChange={() => onToggleLayer("wards")}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                <span className="text-slate-700">Ranh giới 34 tỉnh/thành</span>
                <input
                  type="checkbox"
                  checked={layers.boundaries}
                  onChange={() => onToggleLayer("boundaries")}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                <span className="text-slate-700">Nhãn chủ quyền Hoàng Sa & Trường Sa</span>
                <input
                  type="checkbox"
                  checked={layers.sovereignty}
                  onChange={() => onToggleLayer("sovereignty")}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                <span className="text-slate-700">Khung lưới tọa độ VN-2000</span>
                <input
                  type="checkbox"
                  checked={layers.grid}
                  onChange={() => onToggleLayer("grid")}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                />
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
