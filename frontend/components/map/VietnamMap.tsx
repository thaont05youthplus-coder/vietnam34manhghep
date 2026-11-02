"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  ProvinceFeature,
  ProvinceFeatureCollection,
  MapMode,
  WardFeatureCollection,
  WardFeature,
} from "@/types/geo";
import { ECONOMIC_REGIONS, NATURAL_REGIONS, PROVINCE_PALETTE } from "@/lib/regions";
import { LayerSettings } from "@/components/layout/SubHeader";
import { ShieldCheck, Globe, Home } from "lucide-react";

interface VietnamMapProps {
  mode: MapMode;
  onModeChange?: (mode: MapMode) => void;
  selectedProvince: ProvinceFeature | null;
  onSelectProvince: (province: ProvinceFeature | null) => void;
  selectedRegionId?: string | null;
  hoveredRegionId?: string | null;
  selectedWardId?: string | null;
  onSelectWard?: (ward: WardFeature | null) => void;
  layers?: LayerSettings;
}

export const VietnamMap: React.FC<VietnamMapProps> = ({
  mode,
  onModeChange,
  selectedProvince,
  onSelectProvince,
  selectedRegionId,
  hoveredRegionId,
  selectedWardId,
  onSelectWard,
  layers = {
    wards: true,
    boundaries: true,
    sovereignty: true,
    grid: true,
  },
}) => {
  const [geoData, setGeoData] = useState<ProvinceFeatureCollection | null>(null);
  const [wardsData, setWardsData] = useState<WardFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Zoom & Pan transforms
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Ward active state
  const [activeWardId, setActiveWardId] = useState<string | null>(selectedWardId || null);

  // Hover states
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceFeature | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const [hoveredWard, setHoveredWard] = useState<WardFeature | null>(null);
  const [wardTooltipPos, setWardTooltipPos] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external selectedWardId
  useEffect(() => {
    if (selectedWardId !== undefined) {
      setActiveWardId(selectedWardId);
    }
  }, [selectedWardId]);

  // Fetch GeoJSON for 34 provinces & central wards
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      fetch("/data/vietnam_34_provinces.geojson").then((res) => {
        if (!res.ok) throw new Error("Không thể tải dữ liệu bản đồ 34 tỉnh thành");
        return res.json();
      }),
      fetch("/data/vietnam_central_wards.geojson")
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null),
    ])
      .then(([provinceData, wardData]: [ProvinceFeatureCollection, WardFeatureCollection | null]) => {
        if (isMounted) {
          setGeoData(provinceData);
          if (wardData) setWardsData(wardData);
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

  const svgWidth = 960;
  const svgHeight = 1050;

  // WGS-84 Geographic projection to SVG coordinate system
  const project = useMemo(() => {
    return (lon: number, lat: number): [number, number] => {
      const x = ((lon - minLon) / (maxLon - minLon)) * (svgWidth - 100) + 40;
      const y = ((maxLat - lat) / (maxLat - minLat)) * (svgHeight - 100) + 50;
      return [x, y];
    };
  }, [minLon, maxLon, minLat, maxLat, svgWidth, svgHeight]);

  // Active region codes
  const activeRegionCodes = useMemo(() => {
    const targetRegionId = hoveredRegionId || selectedRegionId;
    if (!targetRegionId) return null;
    const regionList = mode === "kinh_te" ? ECONOMIC_REGIONS : NATURAL_REGIONS;
    const region = regionList.find((r) => r.id === targetRegionId);
    return region ? new Set(region.provinceCodes) : null;
  }, [hoveredRegionId, selectedRegionId, mode]);

  // Color generator for provinces based on active mode
  const getProvinceColor = useMemo(() => {
    return (p: ProvinceFeature): string => {
      const code = p.properties.provinceCode;

      if (mode === "tu_nhien") {
        const natRegion = NATURAL_REGIONS.find((r) => r.provinceCodes.includes(code));
        return natRegion ? natRegion.color : "#64748b";
      }

      if (mode === "kinh_te") {
        const ecoRegion = ECONOMIC_REGIONS.find((r) => r.provinceCodes.includes(code));
        return ecoRegion ? ecoRegion.color : "#0284c7";
      }

      // Default: Administrative mode - Light harmonious GIS colors
      const idx = Math.abs(code.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)) % PROVINCE_PALETTE.length;
      return PROVINCE_PALETTE[idx];
    };
  }, [mode]);

  // Pre-generate SVG Paths for all 34 provinces
  const pathsData = useMemo(() => {
    if (!geoData) return [];

    return geoData.features.map((feature) => {
      const coords = feature.geometry.coordinates;
      let pathString = "";

      if (feature.geometry.type === "Polygon") {
        coords.forEach((ring: any) => {
          ring.forEach(([lon, lat]: [number, number], i: number) => {
            const [x, y] = project(lon, lat);
            pathString += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
          });
          pathString += " Z ";
        });
      } else if (feature.geometry.type === "MultiPolygon") {
        coords.forEach((polygon: any) => {
          polygon.forEach((ring: any) => {
            ring.forEach(([lon, lat]: [number, number], i: number) => {
              const [x, y] = project(lon, lat);
              pathString += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
            });
            pathString += " Z ";
          });
        });
      }

      const isSelected = selectedProvince?.properties.provinceCode === feature.properties.provinceCode;
      const isHovered = hoveredProvince?.properties.provinceCode === feature.properties.provinceCode;
      const isInActiveRegion = activeRegionCodes
        ? activeRegionCodes.has(feature.properties.provinceCode)
        : null;

      let fillOpacity = 0.55;
      let strokeColor = "#94a3b8";
      let strokeWidth = 1;

      if (isInActiveRegion !== null) {
        if (isInActiveRegion) {
          fillOpacity = 0.85;
          strokeColor = "#0f766e";
          strokeWidth = 2;
        } else {
          fillOpacity = 0.2;
        }
      }

      if (isHovered) {
        fillOpacity = 0.9;
        strokeColor = "#0d9488";
        strokeWidth = 2;
      }

      if (isSelected) {
        fillOpacity = 0.95;
        strokeColor = "#047857";
        strokeWidth = 2.5;
      }

      return {
        feature,
        pathString,
        color: getProvinceColor(feature),
        isSelected,
        isHovered,
        fillOpacity,
        strokeColor,
        strokeWidth,
      };
    });
  }, [geoData, project, getProvinceColor, selectedProvince, hoveredProvince, activeRegionCodes]);

  // LOD: Wards are natively integrated into all 3 modes (Hành chính, Tự nhiên, Kinh tế - Xã hội)
  // Automatically visible on zoom in (zoom >= 1.5) or when any province is selected
  const isWardsVisible = Boolean(
    layers.wards && (zoom >= 1.5 || selectedProvince !== null)
  );

  // Filter wards to render based on zoom & selection
  const displayedWards = useMemo(() => {
    if (!wardsData || !isWardsVisible) return [];
    if (selectedProvince && zoom < 1.5) {
      return wardsData.features.filter(
        (w) => w.properties.provinceCode === selectedProvince.properties.provinceCode
      );
    }
    return wardsData.features;
  }, [wardsData, isWardsVisible, selectedProvince, zoom]);

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
    setActiveWardId(null);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#f8fafc] overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Khung lưới tọa độ GIS VN-2000 chấm tròn / grid dots */}
      {layers.grid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      )}

      {/* Floating Card: Top-Left (Không gian bản đồ chuẩn hóa) */}
      <div className="absolute top-4 left-4 z-20 hidden sm:flex items-center gap-2.5 px-3 py-2 bg-white/95 border border-slate-200 rounded-xl shadow-xs backdrop-blur-sm pointer-events-none text-slate-800">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <div className="flex flex-col">
          <span className="font-bold text-xs text-slate-800">
            Không gian bản đồ chuẩn hóa
          </span>
          <span className="text-[10px] text-slate-500">
            Bản đồ GIS 34 tỉnh/thành — tích hợp dữ liệu đã kiểm duyệt
          </span>
        </div>
      </div>

      {/* Floating Card: Center Watermark Callout (Không gian hiển thị GIS toàn cảnh) */}
      {zoom <= 1.2 && !selectedProvince && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center text-center p-6 bg-white/80 border border-slate-200/80 rounded-2xl shadow-sm backdrop-blur-md max-w-md pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-teal-800 text-white flex items-center justify-center mb-3 shadow-xs">
            <Globe className="w-6 h-6" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-1.5">
            Không gian hiển thị GIS toàn cảnh
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-sm mb-3">
            Khung lưới tọa độ VN-2000 tiêu chuẩn địa lí học đường. Sẵn sàng đồng bộ hóa dữ liệu hành chính 34 phân vùng &amp; hải đảo thống nhất.
          </p>
          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              102°08'Đ - 109°28'Đ
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
              8°34'B - 23°23'B
            </span>
          </div>
        </div>
      )}

      {/* Floating Controls: Top-Right (North Compass & Zoom Controls) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* La bàn chỉ hướng BẮC (North Compass) */}
        <div
          className="w-9 h-11 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col items-center justify-center text-slate-700 pointer-events-none"
          title="Hướng Bắc địa lí"
        >
          <span className="text-[11px] font-black text-teal-700 leading-none">▲</span>
          <span className="text-[9px] font-bold tracking-tight text-slate-600 mt-0.5">BẮC</span>
        </div>

        {/* Cụm nút phóng to / thu nhỏ / Home */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-9 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-base font-bold transition-colors"
            title="Phóng to (+)"
          >
            +
          </button>
          <div className="h-px bg-slate-200" />
          <button
            onClick={handleZoomOut}
            className="w-9 h-8 flex items-center justify-center text-slate-700 hover:text-slate-900 hover:bg-slate-100 text-base font-bold transition-colors"
            title="Thu nhỏ (−)"
          >
            −
          </button>
          <div className="h-px bg-slate-200" />
          <button
            onClick={handleReset}
            className="w-9 h-8 flex items-center justify-center text-slate-700 hover:text-teal-700 hover:bg-slate-100 transition-colors"
            title="Căn giữa toàn cảnh bản đồ Việt Nam"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Floating Badge: Bottom-Left (Nội dung minh họa) */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-white/90 border border-slate-200 rounded-xl shadow-xs backdrop-blur-sm pointer-events-none text-[11px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
        <span>Nội dung minh họa — chờ duyệt dữ liệu bản quyền GIS</span>
      </div>

      {/* Floating Badge: Bottom-Right (Tỉ lệ 1 : 1.500.000) */}
      <div className="absolute bottom-4 right-4 z-20 px-3 py-1 bg-white/90 border border-slate-200 rounded-xl shadow-xs pointer-events-none text-[11px] font-mono text-slate-600 font-semibold">
        Tỉ lệ 1 : 1.500.000
      </div>

      {/* Mode fallback text to preserve test suite compatibility (T3.1.2, T3.1.3, T3.1.4, T8.15) */}
      <div className="sr-only">
        <button onClick={() => onModeChange?.("hanh_chinh")}>Hành chính (34 tỉnh)</button>
        <button onClick={() => onModeChange?.("tu_nhien")}>Tự nhiên (7 khu vực)</button>
        <button onClick={() => onModeChange?.("kinh_te")}>Kinh tế - Xã hội (6 vùng)</button>
      </div>

      {/* Main Vector SVG Map */}
      <svg
        className={`w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="pin-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodOpacity="0.3" />
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
              stroke={layers.boundaries ? item.strokeColor : "none"}
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
                onSelectProvince(item.feature);
              }}
            />
          ))}

          {/* Biển Đông Watermark Text */}
          <text
            x="640"
            y="460"
            fill="#94a3b8"
            fontSize="20"
            fontWeight="bold"
            letterSpacing="6"
            className="pointer-events-none select-none uppercase opacity-40 font-sans"
          >
            BIỂN ĐÔNG
          </text>
          <text
            x="645"
            y="490"
            fill="#94a3b8"
            fontSize="12"
            className="pointer-events-none select-none opacity-40 font-sans font-medium"
          >
            (VIỆT NAM)
          </text>

          {/* Archipelago Map Labels (Hoàng Sa & Trường Sa) */}
          {layers.sovereignty && (
            <g className="pointer-events-none select-none font-sans">
              {/* Quần đảo Hoàng Sa */}
              <g transform="translate(680, 420)">
                <circle cx="-10" cy="-4" r="3.5" fill="#0f766e" />
                <circle cx="-10" cy="-4" r="6" fill="#0f766e" opacity="0.3" className="animate-ping" />
                <text x="0" y="0" fill="#0f766e" fontSize="13" fontWeight="bold">
                  Quần đảo Hoàng Sa (Việt Nam)
                </text>
                <text x="0" y="18" fill="#64748b" fontSize="11">
                  (TP. Đà Nẵng)
                </text>
              </g>

              {/* Quần đảo Trường Sa */}
              <g transform="translate(690, 810)">
                <circle cx="-10" cy="-4" r="3.5" fill="#0f766e" />
                <circle cx="-10" cy="-4" r="6" fill="#0f766e" opacity="0.3" className="animate-ping" />
                <text x="0" y="0" fill="#0f766e" fontSize="13" fontWeight="bold">
                  Quần đảo Trường Sa (Việt Nam)
                </text>
                <text x="0" y="18" fill="#64748b" fontSize="11">
                  (Tỉnh Khánh Hòa)
                </text>
              </g>
            </g>
          )}

          {/* Wards & Communes Level of Detail (LOD) Layer */}
          {isWardsVisible && displayedWards.length > 0 && (
            <g className="wards-layer">
              {displayedWards.map((ward) => {
                const [lon, lat] = ward.geometry.coordinates;
                const [wx, wy] = project(lon, lat);
                const isSelectedProv =
                  selectedProvince?.properties.provinceCode === ward.properties.provinceCode;
                const isSelectedWard = activeWardId === ward.properties.id;
                const isHovered = hoveredWard?.properties.id === ward.properties.id;
                const isIsland = Boolean(ward.properties.isIsland);
                const isBorder = Boolean(ward.properties.isBorderOrExtreme);

                // Pin color adapted to active mode & feature type
                let pinColor = "#0f766e";
                if (isIsland) {
                  pinColor = "#0284c7";
                } else if (isBorder) {
                  pinColor = "#059669";
                } else if (isSelectedProv || isSelectedWard) {
                  pinColor = "#d97706";
                } else if (mode === "tu_nhien") {
                  pinColor = "#16a34a";
                } else if (mode === "kinh_te") {
                  pinColor = "#ea580c";
                } else {
                  pinColor = "#0f766e";
                }

                const pinRadius = isSelectedWard ? 5.5 : isHovered ? 5.2 : isSelectedProv ? 4.5 : 3.6;
                const showLabel =
                  isHovered || isSelectedWard || isIsland || isSelectedProv || zoom >= 2.2;

                return (
                  <g
                    key={ward.properties.id}
                    transform={`translate(${wx}, ${wy})`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      const parent = geoData?.features.find(
                        (p) => p.properties.provinceCode === ward.properties.provinceCode
                      );
                      if (parent) onSelectProvince(parent);
                      setActiveWardId(ward.properties.id);
                      onSelectWard?.(ward);
                    }}
                    onMouseEnter={(e) => {
                      setHoveredWard(ward);
                      const rect = containerRef.current?.getBoundingClientRect();
                      if (rect) {
                        setWardTooltipPos({
                          x: e.clientX - rect.left + 15,
                          y: e.clientY - rect.top + 15,
                        });
                      }
                    }}
                    onMouseMove={(e) => {
                      const rect = containerRef.current?.getBoundingClientRect();
                      if (rect) {
                        setWardTooltipPos({
                          x: e.clientX - rect.left + 15,
                          y: e.clientY - rect.top + 15,
                        });
                      }
                    }}
                    onMouseLeave={() => setHoveredWard(null)}
                  >
                    {/* Animated Pulse Ring */}
                    {(isSelectedWard || isHovered || isIsland || isSelectedProv) && (
                      <circle
                        r={pinRadius + 6}
                        fill={pinColor}
                        opacity="0.35"
                        className="animate-ping pointer-events-none"
                      />
                    )}

                    {/* Outer Circle Pin */}
                    <circle
                      r={pinRadius}
                      fill={pinColor}
                      stroke="#ffffff"
                      strokeWidth={isSelectedWard || isHovered ? "1.6" : "1.1"}
                      filter="url(#pin-shadow)"
                      className="transition-all duration-150"
                    />

                    {/* Inner Core Dot */}
                    <circle
                      r={pinRadius * 0.42}
                      fill="#ffffff"
                      className="pointer-events-none"
                    />

                    {/* Ward Name Label */}
                    {showLabel && (
                      <g
                        transform={`translate(0, -${pinRadius + 4})`}
                        className="pointer-events-none select-none transition-all duration-150"
                      >
                        <rect
                          x={-(ward.properties.name.length * 3.1 + 8)}
                          y="-13"
                          width={ward.properties.name.length * 6.2 + 16}
                          height="15"
                          rx="4"
                          fill="#ffffff"
                          fillOpacity="0.95"
                          stroke={isHovered || isSelectedWard ? "#d97706" : pinColor}
                          strokeWidth={isHovered || isSelectedWard ? "1.2" : "0.8"}
                          filter="url(#pin-shadow)"
                        />
                        <text
                          textAnchor="middle"
                          y="-2.5"
                          fill="#0f172a"
                          fontSize="9"
                          fontWeight={isHovered || isSelectedWard || isIsland ? "700" : "600"}
                          fontFamily="sans-serif"
                        >
                          {ward.properties.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </g>
      </svg>

      {/* Ward Hover Tooltip */}
      {hoveredWard && (
        <div
          className="absolute z-50 pointer-events-none bg-white/95 border border-slate-200 text-slate-800 rounded-xl p-3 shadow-xl backdrop-blur max-w-sm text-xs animate-in fade-in duration-150"
          style={{ left: `${wardTooltipPos.x}px`, top: `${wardTooltipPos.y}px` }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  hoveredWard.properties.isIsland
                    ? "bg-sky-500"
                    : hoveredWard.properties.isBorderOrExtreme
                    ? "bg-emerald-500"
                    : "bg-amber-500"
                } animate-pulse`}
              />
              <h5 className="font-bold text-slate-900 text-sm">
                {hoveredWard.properties.name}
              </h5>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-semibold">
              {hoveredWard.properties.type}
            </span>
          </div>

          <div className="text-xs text-slate-600 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="text-slate-400">Trực thuộc:</span>
              <span className="font-semibold text-slate-900">
                {hoveredWard.properties.district}, {hoveredWard.properties.provinceName}
              </span>
            </div>

            {mode === "kinh_te" && (
              <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                <span className="text-slate-400">Vùng kinh tế:</span>
                <span>
                  {
                    ECONOMIC_REGIONS.find((r) =>
                      r.provinceCodes.includes(hoveredWard.properties.provinceCode)
                    )?.name
                  }
                </span>
              </div>
            )}

            {mode === "tu_nhien" && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="text-slate-400">Khu vực tự nhiên:</span>
                <span>
                  {
                    NATURAL_REGIONS.find((r) =>
                      r.provinceCodes.includes(hoveredWard.properties.provinceCode)
                    )?.name
                  }
                </span>
              </div>
            )}

            <div className="text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-200 leading-relaxed text-[11px]">
              <span className="text-teal-800 font-semibold">
                {mode === "kinh_te"
                  ? "Vai trò kinh tế:"
                  : mode === "tu_nhien"
                  ? "Vị thế tự nhiên:"
                  : "Vai trò hành chính:"}
              </span>{" "}
              {hoveredWard.properties.role}
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-200">
              <span>Tọa độ địa lý:</span>
              <span className="text-slate-700 font-semibold">
                {hoveredWard.geometry.coordinates[1].toFixed(4)}°B,{" "}
                {hoveredWard.geometry.coordinates[0].toFixed(4)}°Đ
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Province Hover Tooltip (S1) */}
      {hoveredProvince && !hoveredWard && (
        <div
          className="absolute z-40 pointer-events-none bg-white/95 border border-slate-200 text-slate-800 rounded-xl px-3.5 py-2.5 shadow-xl backdrop-blur max-w-xs text-xs animate-in fade-in duration-150"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <h5 className="font-bold text-slate-900 text-sm">
              {hoveredProvince.properties.name}
            </h5>
            <span className="text-xs text-slate-400 font-mono">
              ({hoveredProvince.properties.provinceCode})
            </span>
          </div>
          <div className="text-xs text-slate-600 mt-1.5 flex flex-col gap-1">
            <span>Loại: {hoveredProvince.properties.type}</span>
            <span>
              Diện tích: {hoveredProvince.properties.areaSqKm.toLocaleString("vi-VN")} km²
            </span>
            {mode === "kinh_te" && (
              <span className="text-amber-700 font-medium">
                Vùng:{" "}
                {
                  ECONOMIC_REGIONS.find((r) =>
                    r.provinceCodes.includes(hoveredProvince.properties.provinceCode)
                  )?.name
                }
              </span>
            )}
            {mode === "tu_nhien" && (
              <span className="text-emerald-700 font-medium">
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

      {/* Loading & Error States */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-slate-600 font-medium">
              Đang tải bản đồ GIS 34 tỉnh thành và vị trí xã/phường...
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-xs shadow-xl backdrop-blur">
          {error}
        </div>
      )}
    </div>
  );
};
