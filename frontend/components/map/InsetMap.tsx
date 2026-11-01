"use client";

import React from "react";
import { ProvinceFeature } from "@/types/geo";

interface InsetMapProps {
  type: "hoang_sa" | "truong_sa";
  feature: ProvinceFeature | null;
  onSelect: (feature: ProvinceFeature) => void;
  isSelected: boolean;
}

export const InsetMap: React.FC<InsetMapProps> = ({
  type,
  feature,
  onSelect,
  isSelected,
}) => {
  const isHoangSa = type === "hoang_sa";
  const title = isHoangSa ? "QUẦN ĐẢO HOÀNG SA" : "QUẦN ĐẢO TRƯỜNG SA";
  const subTitle = isHoangSa ? "(TP. Đà Nẵng)" : "(Tỉnh Khánh Hòa)";
  const coordsLabel = isHoangSa ? "16°30'B - 112°00'Đ" : "10°00'B - 114°30'Đ";

  // Filter coordinates for this archipelago
  // Hoang Sa: lon [111.0, 113.5], lat [15.5, 17.5]
  // Truong Sa: lon [111.5, 118.0], lat [6.0, 12.5]
  const islandRings: number[][][] = [];

  if (feature && feature.geometry && feature.geometry.coordinates) {
    for (const poly of feature.geometry.coordinates) {
      for (const ring of poly) {
        if (!ring || ring.length < 3) continue;
        const firstPt = ring[0];
        const lon = firstPt[0];
        const lat = firstPt[1];

        if (isHoangSa && lon >= 111.0 && lon <= 113.5 && lat >= 15.5 && lat <= 17.5) {
          islandRings.push(ring);
        } else if (!isHoangSa && lon >= 111.5 && lon <= 118.0 && lat >= 6.0 && lat <= 12.5) {
          islandRings.push(ring);
        }
      }
    }
  }

  // Projection bounds for the inset box
  const minLon = isHoangSa ? 111.0 : 111.5;
  const maxLon = isHoangSa ? 113.2 : 117.5;
  const minLat = isHoangSa ? 15.5 : 6.5;
  const maxLat = isHoangSa ? 17.3 : 12.5;

  const width = 190;
  const height = 135;
  const padding = 12;

  const projectX = (lon: number) => {
    return padding + ((lon - minLon) / (maxLon - minLon)) * (width - 2 * padding);
  };

  const projectY = (lat: number) => {
    // Invert Y for SVG
    return height - padding - ((lat - minLat) / (maxLat - minLat)) * (height - 2 * padding);
  };

  return (
    <div
      onClick={() => feature && onSelect(feature)}
      className={`group relative bg-slate-900/90 border rounded-lg p-2.5 shadow-lg backdrop-blur cursor-pointer transition-all hover:border-amber-400 hover:shadow-amber-500/10 ${
        isSelected ? "border-amber-400 ring-2 ring-amber-400/50" : "border-slate-700/80"
      }`}
      style={{ width: `${width}px` }}
      title={`Nhấn để chọn ${subTitle}`}
    >
      <div className="flex items-center justify-between pb-1 border-b border-slate-700/50 mb-1">
        <div>
          <h4 className="text-[11px] font-bold text-amber-300 tracking-wide">{title}</h4>
          <p className="text-[9px] text-slate-400 font-medium">{subTitle}</p>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-900/80 text-yellow-300 font-bold border border-red-700">
          VN
        </span>
      </div>

      <svg width={width} height={height} className="rounded bg-slate-950/70 overflow-hidden">
        {/* Subtle coordinate grid lines */}
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#334155" strokeDasharray="2 3" />
        <line x1={width / 2} y1={0} x2={width / 2} y2={height} stroke="#334155" strokeDasharray="2 3" />

        {/* Island paths */}
        {islandRings.map((ring, idx) => {
          const pathD = ring
            .map((pt, pIdx) => `${pIdx === 0 ? "M" : "L"} ${projectX(pt[0]).toFixed(1)} ${projectY(pt[1]).toFixed(1)}`)
            .join(" ") + " Z";

          return (
            <path
              key={idx}
              d={pathD}
              fill="#fbbf24"
              stroke="#d97706"
              strokeWidth={1.5}
              className="transition-colors group-hover:fill-amber-300"
            />
          );
        })}

        {/* Representational beacon rings for visibility if islands are tiny */}
        {islandRings.slice(0, 15).map((ring, idx) => {
          const pt = ring[0];
          return (
            <circle
              key={`beacon-${idx}`}
              cx={projectX(pt[0])}
              cy={projectY(pt[1])}
              r={2.5}
              fill="#ef4444"
              opacity={0.7}
            />
          );
        })}
      </svg>

      <div className="flex justify-between items-center mt-1 text-[9px] text-slate-400">
        <span className="font-mono text-slate-500">{coordsLabel}</span>
        <span className="text-amber-400/90 font-medium group-hover:underline">Chi tiết →</span>
      </div>
    </div>
  );
};
