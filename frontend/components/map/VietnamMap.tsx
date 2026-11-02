"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { ProvinceFeature, ProvinceFeatureCollection, MapMode } from "@/types/geo";
import { ECONOMIC_REGIONS, NATURAL_REGIONS, PROVINCE_PALETTE } from "@/lib/regions";
import { InsetMap } from "./InsetMap";

interface VietnamMapProps {
  mode: MapMode;
  onModeChange?: (mode: MapMode) => void;
  selectedProvince: ProvinceFeature | null;
  onSelectProvince: (province: ProvinceFeature | null) => void;
  selectedRegionId?: string | null;
  hoveredRegionId?: string | null;
}

export const VietnamMap: React.FC<VietnamMapProps> = ({
  mode,
  onModeChange,
  selectedProvince,
  onSelectProvince,
  selectedRegionId,
  hoveredRegionId,
}) => {
  const [geoData, setGeoData] = useState<ProvinceFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Zoom & Pan transforms
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Hover state (S1)
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceFeature | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch GeoJSON
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    fetch("/data/vietnam_34_provinces.geojson")
      .then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu bản đồ 34 tỉnh thành");
        return res.json();
      })
      .then((data: ProvinceFeatureCollection) => {
        if (isMounted) {
          setGeoData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Lỗi tải bản đồ");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Vietnam Geographic bounding box including Hoang Sa & Truong Sa
  const minLon = 101.8;
  const maxLon = 118.2;
  const minLat = 6.8;
  const maxLat = 23.8;

  const svgWidth = 1000;
  const svgHeight = 1100;
  const padding = 40;

  // Simple equirectangular projection centered on Vietnam
  const project = useCallback((lon: number, lat: number): [number, number] => {
    const x = padding + ((lon - minLon) / (maxLon - minLon)) * (svgWidth - 2 * padding);
    const y = svgHeight - padding - ((lat - minLat) / (maxLat - minLat)) * (svgHeight - 2 * padding);
    return [x, y];
  }, []);

  // Determine fill color by active mode
  const getProvinceColor = useCallback(
    (feature: ProvinceFeature, index: number): string => {
      const code = feature.properties.provinceCode;

      if (mode === "kinh_te") {
        const region = ECONOMIC_REGIONS.find((r) => r.provinceCodes.includes(code));
        return region ? region.color : "#64748b";
      }

      if (mode === "tu_nhien") {
        const region = NATURAL_REGIONS.find((r) => r.provinceCodes.includes(code));
        return region ? region.color : "#64748b";
      }

      return PROVINCE_PALETTE[index % PROVINCE_PALETTE.length];
    },
    [mode]
  );

  // Danh sách các mã tỉnh thuộc vùng đang chọn/hover từ Dải thẻ vùng (RegionCardsStrip)
  const activeRegionCodes = useMemo(() => {
    const targetId = hoveredRegionId || selectedRegionId;
    if (!targetId || mode === "hanh_chinh") return [];
    const list = mode === "kinh_te" ? ECONOMIC_REGIONS : NATURAL_REGIONS;
    const reg = list.find((r) => r.id === targetId);
    return reg ? reg.provinceCodes : [];
  }, [hoveredRegionId, selectedRegionId, mode]);

  // Pre-calculate SVG path data
  const pathsData = useMemo(() => {
    if (!geoData) return [];

    return geoData.features.map((feature, index) => {
      const { geometry, properties } = feature;
      let pathString = "";

      if (geometry && geometry.coordinates) {
        for (const polygon of geometry.coordinates) {
          for (const ring of polygon) {
            if (ring.length < 3) continue;
            ring.forEach((pt, idx) => {
              const [px, py] = project(pt[0], pt[1]);
              pathString += `${idx === 0 ? "M" : "L"} ${px.toFixed(1)} ${py.toFixed(1)} `;
            });
            pathString += "Z ";
          }
        }
      }

      const isSelected = selectedProvince?.properties.provinceCode === properties.provinceCode;
      const isHovered = hoveredProvince?.properties.provinceCode === properties.provinceCode;
      const isRegionActive = activeRegionCodes.includes(properties.provinceCode);
      const hasActiveRegion = activeRegionCodes.length > 0;

      // Tính toán opacity và stroke để nổi bật tỉnh/vùng
      let fillOpacity = 0.68;
      let strokeColor = "#0f172a";
      let strokeWidth = 0.8;

      if (isSelected) {
        fillOpacity = 0.95;
        strokeColor = "#f59e0b";
        strokeWidth = 2.5;
      } else if (isHovered) {
        fillOpacity = 0.88;
        strokeColor = "#ffffff";
        strokeWidth = 1.8;
      } else if (isRegionActive) {
        fillOpacity = 0.9;
        strokeColor = "#38bdf8";
        strokeWidth = 1.6;
      } else if (hasActiveRegion) {
        fillOpacity = 0.3; // Làm mờ các tỉnh không thuộc vùng đang chọn
      }

      return {
        feature,
        index,
        pathString,
        color: getProvinceColor(feature, index),
        isSelected,
        isHovered,
        isRegionActive,
        fillOpacity,
        strokeColor,
        strokeWidth,
      };
    });
  }, [geoData, project, getProvinceColor, selectedProvince, hoveredProvince, activeRegionCodes]);

  // Pan event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => Math.min(Math.max(prev * factor, 0.6), 8));
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.25, 8));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev * 0.8, 0.6));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Find Da Nang and Khanh Hoa features for inset maps
  const daNangFeature = useMemo(
    () => geoData?.features.find((f) => f.properties.provinceCode === "VN48") || null,
    [geoData]
  );
  const khanhHoaFeature = useMemo(
    () => geoData?.features.find((f) => f.properties.provinceCode === "VN56") || null,
    [geoData]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#061325] overflow-hidden select-none"
      style={{
        backgroundImage: "radial-gradient(circle at 65% 35%, #0a254a 0%, #061325 70%)",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Background subtle ocean waves & grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:28px_28px] opacity-30 pointer-events-none" />

      {/* Mode Switcher (UI-04) - Chuẩn màu nhận diện: Xanh Trời, Ngọc Non Nước, Cam Vàng Đỏ */}
      <div className="absolute top-4 left-4 z-20 flex bg-[#081a36]/90 border border-sky-700/50 rounded-xl p-1 shadow-xl shadow-sky-950/40 backdrop-blur">
        <button
          onClick={() => onModeChange?.("hanh_chinh")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === "hanh_chinh"
              ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/30"
              : "text-sky-200/80 hover:text-white hover:bg-sky-900/40"
          }`}
        >
          Hành chính (34 tỉnh)
        </button>
        <button
          onClick={() => onModeChange?.("tu_nhien")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === "tu_nhien"
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/30"
              : "text-sky-200/80 hover:text-white hover:bg-sky-900/40"
          }`}
        >
          Tự nhiên (7 khu vực)
        </button>
        <button
          onClick={() => onModeChange?.("kinh_te")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            mode === "kinh_te"
              ? "bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white shadow-md shadow-amber-500/30"
              : "text-sky-200/80 hover:text-white hover:bg-sky-900/40"
          }`}
        >
          Kinh tế - Xã hội (6 vùng)
        </button>
      </div>

      {/* Navigation Controls: Zoom In / Zoom Out / Reset VN */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-[#081a36]/90 border border-sky-700/50 rounded-xl p-1.5 shadow-xl shadow-sky-950/40 backdrop-blur">
        <button
          onClick={handleZoomIn}
          className="w-8 h-8 flex items-center justify-center text-sky-200 hover:text-white hover:bg-sky-900/50 rounded-lg text-lg font-bold transition-colors"
          title="Phóng to (+)"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-8 h-8 flex items-center justify-center text-sky-200 hover:text-white hover:bg-sky-900/50 rounded-lg text-lg font-bold transition-colors"
          title="Thu nhỏ (−)"
        >
          −
        </button>
        <div className="w-full h-px bg-slate-700 my-0.5" />
        <button
          onClick={handleReset}
          className="w-8 h-8 flex items-center justify-center text-amber-300 hover:bg-slate-800 rounded-lg text-xs font-extrabold transition-colors"
          title="Căn giữa toàn Việt Nam"
        >
          VN
        </button>
      </div>

      {/* Main SVG Vector Map */}
      <svg
        className={`w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
          {/* Province Vector Shapes */}
          {pathsData.map((item) => (
            <path
              key={item.feature.properties.provinceCode}
              d={item.pathString}
              fill={item.color}
              fillOpacity={item.fillOpacity}
              stroke={item.strokeColor}
              strokeWidth={item.strokeWidth}
              strokeLinejoin="round"
              filter={item.isSelected ? "url(#glow)" : undefined}
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={(e) => {
                setHoveredProvince(item.feature);
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({
                    x: e.clientX - rect.left + 15,
                    y: e.clientY - rect.top + 15,
                  });
                }
              }}
              onMouseMove={(e) => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) {
                  setTooltipPos({
                    x: e.clientX - rect.left + 15,
                    y: e.clientY - rect.top + 15,
                  });
                }
              }}
              onMouseLeave={() => setHoveredProvince(null)}
              onClick={(e) => {
                e.stopPropagation();
                onSelectProvince(
                  selectedProvince?.properties.provinceCode === item.feature.properties.provinceCode
                    ? null
                    : item.feature
                );
              }}
            />
          ))}

          {/* Biển Đông Watermark */}
          <text
            x="660"
            y="460"
            fill="#334155"
            fontSize="20"
            fontWeight="bold"
            letterSpacing="6"
            className="pointer-events-none select-none uppercase opacity-60"
          >
            BIỂN ĐÔNG
          </text>
          <text
            x="645"
            y="490"
            fill="#475569"
            fontSize="12"
            className="pointer-events-none select-none opacity-50"
          >
            (VIỆT NAM)
          </text>

          {/* Archipelago Map Labels */}
          <g className="pointer-events-none select-none">
            <text x="690" y="420" fill="#fbbf24" fontSize="13" fontWeight="bold">
              ★ QĐ. HOÀNG SA
            </text>
            <text x="690" y="442" fill="#94a3b8" fontSize="11">
              (TP. Đà Nẵng)
            </text>

            <text x="710" y="820" fill="#fbbf24" fontSize="13" fontWeight="bold">
              ★ QĐ. TRƯỜNG SA
            </text>
            <text x="710" y="842" fill="#94a3b8" fontSize="11">
              (Tỉnh Khánh Hòa)
            </text>
          </g>
        </g>
      </svg>

      {/* Hover Tooltip (S1) */}
      {hoveredProvince && (
        <div
          className="absolute z-40 pointer-events-none bg-slate-900/95 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 shadow-2xl backdrop-blur max-w-xs text-xs animate-in fade-in duration-150"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h5 className="font-bold text-amber-300 text-sm">
              {hoveredProvince.properties.name}
            </h5>
            <span className="text-xs text-slate-400 font-mono">
              ({hoveredProvince.properties.provinceCode})
            </span>
          </div>
          <div className="text-xs text-slate-300 mt-1.5 flex flex-col gap-1">
            <span>Loại: {hoveredProvince.properties.type}</span>
            <span>
              Diện tích: {hoveredProvince.properties.areaSqKm.toLocaleString("vi-VN")} km²
            </span>
            {mode === "kinh_te" && (
              <span className="text-amber-200 font-medium">
                Vùng:{" "}
                {
                  ECONOMIC_REGIONS.find((r) =>
                    r.provinceCodes.includes(hoveredProvince.properties.provinceCode)
                  )?.name
                }
              </span>
            )}
            {mode === "tu_nhien" && (
              <span className="text-emerald-200 font-medium">
                Khu vực:{" "}
                {
                  NATURAL_REGIONS.find((r) =>
                    r.provinceCodes.includes(hoveredProvince.properties.provinceCode)
                  )?.name
                }
              </span>
            )}
          </div>
        </div>
      )}

      {/* Brand Identity Watermark (Bottom-left of Map) */}
      <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center gap-2.5 p-2 bg-[#081a36]/80 border border-sky-700/50 rounded-2xl backdrop-blur-md shadow-xl select-none group pointer-events-none">
        <div className="w-10 h-10 rounded-xl bg-white p-0.5 border border-sky-400/50 shadow-sm overflow-hidden flex items-center justify-center">
          <img
            src="/logo.jpg"
            alt="Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-xs font-black">
            <span className="text-white">Việt Nam</span>
            <span className="text-amber-400">34</span>
            <span className="text-sky-300 font-semibold text-[11px]">mảnh ghép</span>
          </div>
          <span className="text-[10px] text-sky-200/70 font-medium">
            Chỉ có Việt Nam • Trọn vẹn chủ quyền
          </span>
        </div>
      </div>

      {/* 2 Inset Maps for Hoang Sa & Truong Sa (UI bottom-right) */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col sm:flex-row gap-3">
        <InsetMap
          type="hoang_sa"
          feature={daNangFeature}
          onSelect={onSelectProvince}
          isSelected={selectedProvince?.properties.provinceCode === "VN48"}
        />
        <InsetMap
          type="truong_sa"
          feature={khanhHoaFeature}
          onSelect={onSelectProvince}
          isSelected={selectedProvince?.properties.provinceCode === "VN56"}
        />
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-300 font-medium">
              Đang tải bản đồ số 34 tỉnh thành...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-950/90 border border-red-700 text-red-200 px-4 py-2.5 rounded-lg text-xs shadow-xl backdrop-blur">
          {error}
        </div>
      )}
    </div>
  );
};
