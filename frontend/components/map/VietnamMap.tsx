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
}

export const VietnamMap: React.FC<VietnamMapProps> = ({
  mode,
  onModeChange,
  selectedProvince,
  onSelectProvince,
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
          setError(err.message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Standard Vietnam bounds (including archipelagos)
  // Lon: 102.0 to 118.0 deg E
  // Lat: 6.5 to 23.8 deg N
  const bounds = useMemo(() => {
    return {
      minLon: 101.8,
      maxLon: 118.2,
      minLat: 6.8,
      maxLat: 23.8,
    };
  }, []);

  const svgViewBox = useMemo(() => {
    return { width: 1000, height: 1100, padding: 40 };
  }, []);

  // Projection: Equirectangular / Mercator tuned for Vietnam
  const projectCoords = useCallback(
    (lon: number, lat: number) => {
      const { width, height, padding } = svgViewBox;
      const x = padding + ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * (width - 2 * padding);
      // Invert Y axis
      const y = height - padding - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (height - 2 * padding);
      return [x, y];
    },
    [bounds, svgViewBox]
  );

  // Build SVG Path strings for each province
  const featurePaths = useMemo(() => {
    if (!geoData) return new Map<string, string>();
    const map = new Map<string, string>();

    for (const feat of geoData.features) {
      const code = feat.properties.provinceCode;
      let combinedPath = "";

      for (const poly of feat.geometry.coordinates) {
        for (const ring of poly) {
          if (!ring || ring.length < 3) continue;
          let ringD = "";
          for (let i = 0; i < ring.length; i++) {
            const [x, y] = projectCoords(ring[i][0], ring[i][1]);
            ringD += `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)} `;
          }
          ringD += "Z ";
          combinedPath += ringD;
        }
      }

      map.set(code, combinedPath);
    }
    return map;
  }, [geoData, projectCoords]);

  // Determine fill color by current mode
  const getProvinceColor = useCallback(
    (feat: ProvinceFeature, index: number) => {
      const code = feat.properties.provinceCode;

      if (mode === "kinh_te") {
        const reg = ECONOMIC_REGIONS.find((r) => r.provinceCodes.includes(code));
        return reg ? reg.color : "#94a3b8";
      }

      if (mode === "tu_nhien") {
        const reg = NATURAL_REGIONS.find((r) => r.provinceCodes.includes(code));
        return reg ? reg.color : "#94a3b8";
      }

      // Default: Hanh chinh palette
      return PROVINCE_PALETTE[index % PROVINCE_PALETTE.length];
    },
    [mode]
  );

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click for pan
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

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left + 15,
        y: e.clientY - rect.top + 15,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.7), 8));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const daNangFeature = useMemo(() => {
    return geoData?.features.find((f) => f.properties.provinceCode === "VN48") || null;
  }, [geoData]);

  const khanhHoaFeature = useMemo(() => {
    return geoData?.features.find((f) => f.properties.provinceCode === "VN56") || null;
  }, [geoData]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      className={`relative w-full h-full select-none overflow-hidden bg-slate-950 flex items-center justify-center ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
    >
      {/* Background Grid & Water texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      {/* Mode Switcher Tabs */}
      {onModeChange && (
        <div className="absolute top-4 left-4 z-20 flex bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 shadow-xl backdrop-blur">
          <button
            onClick={() => onModeChange("hanh_chinh")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "hanh_chinh"
                ? "bg-blue-600 text-white shadow"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            Hành chính (34 tỉnh)
          </button>
          <button
            onClick={() => onModeChange("tu_nhien")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "tu_nhien"
                ? "bg-emerald-600 text-white shadow"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            Tự nhiên (7 khu vực)
          </button>
          <button
            onClick={() => onModeChange("kinh_te")}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              mode === "kinh_te"
                ? "bg-amber-600 text-white shadow"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            Kinh tế – XH (6 vùng)
          </button>
        </div>
      )}

      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 border border-slate-700/80 rounded-lg p-1 shadow-xl backdrop-blur">
        <button
          onClick={() => setZoom((prev) => Math.min(prev * 1.25, 8))}
          className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-800 rounded text-base font-bold"
          title="Phóng to (+)"
        >
          +
        </button>
        <button
          onClick={() => setZoom((prev) => Math.max(prev * 0.8, 0.7))}
          className="w-8 h-8 flex items-center justify-center text-slate-200 hover:bg-slate-800 rounded text-base font-bold"
          title="Thu nhỏ (-)"
        >
          −
        </button>
        <div className="w-full h-px bg-slate-700 my-0.5" />
        <button
          onClick={handleResetView}
          className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 rounded text-[10px] font-semibold"
          title="Về toàn Việt Nam"
        >
          VN
        </button>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 z-30">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-300 font-medium">Đang tải bản đồ 34 tỉnh thành...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute z-30 p-4 bg-red-950/90 border border-red-700 text-red-200 rounded-lg text-sm max-w-md text-center">
          {error}
        </div>
      )}

      {/* SVG Vector Canvas */}
      {!isLoading && geoData && (
        <svg
          viewBox={`0 0 ${svgViewBox.width} ${svgViewBox.height}`}
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
          }}
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render 34 Provinces */}
          {geoData.features.map((feat, idx) => {
            const code = feat.properties.provinceCode;
            const pathD = featurePaths.get(code) || "";
            const isHovered = hoveredProvince?.properties.provinceCode === code;
            const isSelected = selectedProvince?.properties.provinceCode === code;
            const fillColor = getProvinceColor(feat, idx);

            return (
              <path
                key={code}
                d={pathD}
                fill={fillColor}
                fillOpacity={isSelected ? 0.95 : isHovered ? 0.85 : 0.65}
                stroke={isSelected ? "#f59e0b" : isHovered ? "#ffffff" : "#0f172a"}
                strokeWidth={isSelected ? 2.5 : isHovered ? 1.8 : 0.8}
                strokeLinejoin="round"
                filter={isSelected ? "url(#glow)" : undefined}
                className="transition-all duration-150 cursor-pointer"
                onMouseEnter={() => setHoveredProvince(feat)}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectProvince(isSelected ? null : feat);
                }}
              />
            );
          })}

          {/* Sea Labels (Biển Đông) */}
          <text
            x={svgViewBox.width * 0.65}
            y={svgViewBox.height * 0.42}
            fill="#334155"
            fontSize="18"
            fontWeight="bold"
            letterSpacing="6"
            className="pointer-events-none select-none uppercase tracking-widest opacity-60"
          >
            BIỂN ĐÔNG
          </text>
          <text
            x={svgViewBox.width * 0.63}
            y={svgViewBox.height * 0.45}
            fill="#475569"
            fontSize="11"
            className="pointer-events-none select-none opacity-50"
          >
            (VIỆT NAM)
          </text>

          {/* Archipelago Annotations on Main Map */}
          <g className="pointer-events-none select-none">
            {/* Hoang Sa */}
            <text x={svgViewBox.width * 0.68} y={svgViewBox.height * 0.38} fill="#fbbf24" fontSize="12" fontWeight="bold">
              ★ QĐ. HOÀNG SA
            </text>
            <text x={svgViewBox.width * 0.68} y={svgViewBox.height * 0.40} fill="#94a3b8" fontSize="10">
              (TP. Đà Nẵng)
            </text>

            {/* Truong Sa */}
            <text x={svgViewBox.width * 0.70} y={svgViewBox.height * 0.75} fill="#fbbf24" fontSize="12" fontWeight="bold">
              ★ QĐ. TRƯỜNG SA
            </text>
            <text x={svgViewBox.width * 0.70} y={svgViewBox.height * 0.77} fill="#94a3b8" fontSize="10">
              (Tỉnh Khánh Hòa)
            </text>
          </g>
        </svg>
      )}

      {/* Floating Tooltip (S1) */}
      {hoveredProvince && (
        <div
          className="absolute z-40 pointer-events-none bg-slate-900/95 border border-slate-700/80 text-white rounded-lg px-3 py-2 shadow-2xl backdrop-blur transition-opacity duration-100 max-w-xs"
          style={{
            left: `${tooltipPos.x}px`,
            top: `${tooltipPos.y}px`,
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <h5 className="font-bold text-sm text-amber-300">{hoveredProvince.properties.name}</h5>
            <span className="text-[10px] text-slate-400 font-mono">({hoveredProvince.properties.provinceCode})</span>
          </div>
          <div className="text-[11px] text-slate-300 mt-1 flex flex-col gap-0.5">
            <span>Loại: {hoveredProvince.properties.type}</span>
            <span>Diện tích: {hoveredProvince.properties.areaSqKm.toLocaleString("vi-VN")} km²</span>
          </div>
        </div>
      )}

      {/* Inset Maps (Hoàng Sa & Trường Sa) at Bottom-Right */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col sm:flex-row gap-2.5">
        <InsetMap
          type="hoang_sa"
          feature={daNangFeature}
          onSelect={(f) => onSelectProvince(f)}
          isSelected={selectedProvince?.properties.provinceCode === "VN48"}
        />
        <InsetMap
          type="truong_sa"
          feature={khanhHoaFeature}
          onSelect={(f) => onSelectProvince(f)}
          isSelected={selectedProvince?.properties.provinceCode === "VN56"}
        />
      </div>

      {/* Legend / Chú giải at Bottom-Left */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 shadow-xl backdrop-blur text-xs text-slate-300 max-w-xs hidden md:block">
        <h6 className="font-bold text-slate-200 mb-1.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          {mode === "hanh_chinh"
            ? "34 Đơn vị hành chính cấp Tỉnh"
            : mode === "tu_nhien"
            ? "7 Khu vực tra cứu Tự nhiên"
            : "6 Vùng Kinh tế – Xã hội"}
        </h6>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
          {mode === "kinh_te" &&
            ECONOMIC_REGIONS.map((r) => (
              <div key={r.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: r.color }} />
                <span className="truncate">{r.name}</span>
              </div>
            ))}
          {mode === "tu_nhien" &&
            NATURAL_REGIONS.map((r) => (
              <div key={r.id} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: r.color }} />
                <span className="truncate">{r.name}</span>
              </div>
            ))}
          {mode === "hanh_chinh" && (
            <div className="col-span-2 text-[10px] text-slate-400">
              Bao gồm đầy đủ 34 tỉnh/thành, Hoàng Sa (Đà Nẵng), Trường Sa (Khánh Hòa) theo phương án sắp xếp hành chính.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
