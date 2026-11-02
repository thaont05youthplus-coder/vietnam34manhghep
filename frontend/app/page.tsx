"use client";

import React, { useState } from "react";
import { VietnamMap } from "@/components/map/VietnamMap";
import { ProvinceFeature, MapMode } from "@/types/geo";
import { ECONOMIC_REGIONS, NATURAL_REGIONS } from "@/lib/regions";

export default function HomePage() {
  const [mode, setMode] = useState<MapMode>("hanh_chinh");
  const [selectedProvince, setSelectedProvince] = useState<ProvinceFeature | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main className="relative w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Top Header (UI-01) */}
      <header className="h-16 bg-slate-900/95 border-b border-slate-800 px-5 flex items-center justify-between z-20 backdrop-blur shadow-md shrink-0">
        {/* Logo & Project Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-base shadow">
            34
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base">VN34MG</span>
              <span className="text-[11px] font-semibold bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700/50">
                GIAI ĐOẠN 1
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Bản đồ số tương tác 34 Tỉnh thành Việt Nam (Chỉ có Việt Nam)
            </p>
          </div>
        </div>

        {/* Search Input Box */}
        <div className="flex-1 max-w-md mx-6 hidden md:block">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tỉnh/thành (Huế, Đà Nẵng, Khánh Hòa, Cà Mau)..."
              className="w-full h-9 pl-9 pr-3 text-xs bg-slate-800/90 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1 bg-emerald-950/80 border border-emerald-700 text-emerald-300 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Hoàng Sa &amp; Trường Sa: Đầy đủ
          </div>
        </div>
      </header>

      {/* Main Map Container */}
      <div className="relative flex-1 w-full h-[calc(100vh-64px)]">
        <VietnamMap
          mode={mode}
          onModeChange={setMode}
          selectedProvince={selectedProvince}
          onSelectProvince={setSelectedProvince}
        />

        {/* Selected Province Slide-out Card (S2 State preview) */}
        {selectedProvince && (
          <aside className="absolute top-4 right-4 z-30 w-84 bg-slate-900/95 border border-slate-700 rounded-xl p-5 shadow-2xl backdrop-blur animate-in slide-in-from-right duration-200 max-w-sm">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  {selectedProvince.properties.provinceCode}
                </span>
                <h3 className="text-xl font-black text-white">{selectedProvince.properties.name}</h3>
                <p className="text-xs text-slate-400 italic">{selectedProvince.properties.nameEn}</p>
              </div>
              <button
                onClick={() => setSelectedProvince(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-base leading-none"
                title="Đóng"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2.5 text-xs text-slate-300">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Phân loại:</span>
                <span className="font-semibold text-slate-100">{selectedProvince.properties.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Diện tích:</span>
                <span className="font-semibold text-amber-300">
                  {selectedProvince.properties.areaSqKm.toLocaleString("vi-VN")} km²
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Vùng KT-XH:</span>
                <span className="font-semibold text-blue-300">
                  {
                    ECONOMIC_REGIONS.find((r) =>
                      r.provinceCodes.includes(selectedProvince.properties.provinceCode)
                    )?.name || "N/A"
                  }
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Khu vực tự nhiên:</span>
                <span className="font-semibold text-emerald-300">
                  {
                    NATURAL_REGIONS.find((r) =>
                      r.provinceCodes.includes(selectedProvince.properties.provinceCode)
                    )?.name || "N/A"
                  }
                </span>
              </div>

              {selectedProvince.properties.provinceCode === "VN48" && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs text-amber-200 mt-2.5 leading-relaxed">
                  🏝️ Bao gồm <strong>Huyện đảo Hoàng Sa</strong> với hơn 18.000 điểm đa giác hải đảo.
                </div>
              )}
              {selectedProvince.properties.provinceCode === "VN56" && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-lg text-xs text-amber-200 mt-2.5 leading-relaxed">
                  🏝️ Bao gồm <strong>Huyện đảo Trường Sa</strong> trải rộng trên Biển Đông với hơn 54.000 điểm đa giác hải đảo.
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex gap-2">
              <button
                onClick={() =>
                  alert(
                    `Đã chọn ${selectedProvince.properties.name}! Bảng chi tiết 5 tab nội dung (Tổng quan, Tự nhiên, Kinh tế, Hình ảnh, Nguồn) sẽ liên kết đầy đủ ở Giai đoạn 3.`
                  )
                }
                className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-lg transition-colors"
              >
                Khám phá chi tiết địa phương
              </button>
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}
