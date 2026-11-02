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
        if (ring.length >= 3) {
          const sample = ring[0];
          if (isHoangSa) {
            if (sample[0] >= 111.0 && sample[0] <= 113.5 && sample[1] >= 15.5 && sample[1] <= 17.5) {
              islandRings.push(ring);
            }
          } else {
            if (sample[0] >= 111.5 && sample[0] <= 118.0 && sample[1] >= 6.0 && sample[1] <= 12.5) {
              islandRings.push(ring);
            }
          }
        }
      }
    }
  }

  // Bounds for local projection within the inset box
  const minLon = isHoangSa ? 111.0 : 111.5;
  const maxLon = isHoangSa ? 113.2 : 117.5;
  const minLat = isHoangSa ? 15.5 : 6.5;
  const maxLat = isHoangSa ? 17.3 : 12.5;

  const w = 170;
  const h = 105;
  const pad = 10;

  const projectLocal = (lon: number, lat: number) => {
    const x = pad + ((lon - minLon) / (maxLon - minLon)) * (w - 2 * pad);
    const y = h - pad - ((lat - minLat) / (maxLat - minLat)) * (h - 2 * pad);
    return [x, y];
  };

  const pathString = islandRings
    .map((ring) => {
      return (
        ring
          .map((pt, idx) => {
            const [x, y] = projectLocal(pt[0], pt[1]);
            return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
          })
          .join(" ") + " Z"
      );
    })
    .join(" ");

  return (
    <div
      onClick={() => feature && onSelect(feature)}
      className={`relative bg-[#081a36]/95 border ${
        isSelected ? "border-amber-400 ring-2 ring-amber-400/40" : "border-sky-700/60 hover:border-amber-400"
      } rounded-xl p-2.5 shadow-2xl shadow-sky-950/50 backdrop-blur cursor-pointer transition-all duration-200 select-none w-48 group`}
      title={`Nhấp để chọn ${subTitle}`}
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-sky-800/40 mb-1.5">
        <div>
          <div className="text-xs font-bold text-amber-300 group-hover:text-amber-200">{title}</div>
          <div className="text-[10px] text-sky-200/70">{subTitle}</div>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gradient-to-r from-red-600 to-rose-600 text-yellow-300 font-bold border border-red-500 shadow-sm">
          VN ★
        </span>
      </div>

      <div className="relative w-full h-[105px] bg-[#051124] rounded-lg overflow-hidden border border-sky-800/50">
        <svg width={w} height={h} className="w-full h-full">
          <rect width={w} height={h} fill="#06152b" />
          {pathString ? (
            <path
              d={pathString}
              fill="#facc15"
              stroke="#ea580c"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          ) : (
            <text x="50%" y="50%" textAnchor="middle" fill="#64748b" fontSize="10">
              Đang vẽ tọa độ...
            </text>
          )}
        </svg>
      </div>

      <div className="flex justify-between items-center mt-1.5 text-[10px] text-slate-400 font-mono">
        <span>{coordsLabel}</span>
        <span className="text-amber-400 font-semibold group-hover:underline">Chi tiết →</span>
      </div>
    </div>
  );
};
