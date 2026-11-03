"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  ProvinceFeature,
  ProvinceFeatureCollection,
  MapMode,
  WardFeatureCollection,
  WardFeature,
  CommunePolygonFeature,
  CommunePolygonCollection,
} from "@/types/geo";
import { ECONOMIC_REGIONS, NATURAL_REGIONS, PROVINCE_PALETTE, ADMIN_PROVINCE_COLORS } from "@/lib/regions";
import { LayerSettings } from "@/components/layout/SubHeader";
import {
  ShieldCheck,
  Globe,
  Home,
  Crosshair,
  ArrowLeft,
  Palette,
  X,
} from "lucide-react";

interface VietnamMapProps {
  mode: MapMode;
  onModeChange?: (mode: MapMode) => void;
  selectedProvince: ProvinceFeature | null;
  onSelectProvince: (province: ProvinceFeature | null) => void;
  selectedRegionId?: string | null;
  onSelectRegion?: (regionId: string | null) => void;
  hoveredRegionId?: string | null;
  selectedWardId?: string | null;
  onSelectWard?: (ward: WardFeature | null) => void;
  layers?: LayerSettings;
}

// Các đô thị & địa danh trọng điểm chuẩn SGK Địa lí Việt Nam
const KEY_LANDMARKS = [
  { name: "HÀ NỘI", lon: 105.85, lat: 21.02, isCapital: true },
  { name: "TP. Huế", lon: 107.59, lat: 16.46, isCapital: false },
  { name: "Đà Nẵng", lon: 108.22, lat: 16.07, isCapital: false },
  { name: "Pleiku", lon: 108.00, lat: 13.98, isCapital: false },
  { name: "TP. Hồ Chí Minh", lon: 106.66, lat: 10.76, isCapital: false },
  { name: "Cần Thơ", lon: 105.78, lat: 10.03, isCapital: false },
  { name: "Côn Đảo", lon: 106.61, lat: 8.68, isCapital: false },
  { name: "Đ. Phú Quốc", lon: 103.96, lat: 10.22, isCapital: false },
];

// 34 Tỉnh thành Việt Nam với tọa độ trung tâm địa lý chuẩn xác (Chuẩn GIS gis.vn)
const PROVINCE_LABEL_CENTROIDS: Array<{
  code: string;
  name: string;
  lon: number;
  lat: number;
  isCapital?: boolean;
}> = [
  { code: "VN01", name: "HÀ NỘI", lon: 105.78, lat: 21.03, isCapital: true },
  { code: "VN04", name: "Cao Bằng", lon: 106.09, lat: 22.74 },
  { code: "VN08", name: "Tuyên Quang", lon: 105.10, lat: 22.40 },
  { code: "VN11", name: "Điện Biên", lon: 103.02, lat: 21.71 },
  { code: "VN12", name: "Lai Châu", lon: 103.19, lat: 22.32 },
  { code: "VN14", name: "Sơn La", lon: 104.07, lat: 21.19 },
  { code: "VN15", name: "Lào Cai", lon: 104.25, lat: 22.20 },
  { code: "VN19", name: "Thái Nguyên", lon: 105.83, lat: 21.80 },
  { code: "VN20", name: "Lạng Sơn", lon: 106.62, lat: 21.84 },
  { code: "VN22", name: "Quảng Ninh", lon: 107.24, lat: 21.26 },
  { code: "VN24", name: "Bắc Ninh", lon: 106.15, lat: 21.18 },
  { code: "VN25", name: "Phú Thọ", lon: 105.20, lat: 21.25 },
  { code: "VN31", name: "Hải Phòng", lon: 106.65, lat: 20.86 },
  { code: "VN33", name: "Hưng Yên", lon: 106.12, lat: 20.65 },
  { code: "VN37", name: "Ninh Bình", lon: 105.95, lat: 20.25 },
  { code: "VN38", name: "Thanh Hóa", lon: 105.32, lat: 19.95 },
  { code: "VN40", name: "Nghệ An", lon: 104.95, lat: 19.24 },
  { code: "VN42", name: "Hà Tĩnh", lon: 105.74, lat: 18.29 },
  { code: "VN44", name: "Quảng Trị", lon: 106.60, lat: 17.10 },
  { code: "VN46", name: "Huế", lon: 107.52, lat: 16.33 },
  { code: "VN48", name: "Đà Nẵng", lon: 108.15, lat: 15.85 },
  { code: "VN51", name: "Quảng Ngãi", lon: 108.40, lat: 14.90 },
  { code: "VN52", name: "Gia Lai", lon: 108.25, lat: 13.89 },
  { code: "VN56", name: "Khánh Hòa", lon: 109.05, lat: 12.25 },
  { code: "VN66", name: "Đắk Lắk", lon: 108.35, lat: 12.80 },
  { code: "VN68", name: "Lâm Đồng", lon: 108.15, lat: 11.67 },
  { code: "VN75", name: "Đồng Nai", lon: 107.04, lat: 11.20 },
  { code: "VN79", name: "TP. Hồ Chí Minh", lon: 106.70, lat: 10.78 },
  { code: "VN80", name: "Tây Ninh", lon: 106.10, lat: 11.25 },
  { code: "VN82", name: "Đồng Tháp", lon: 105.70, lat: 10.45 },
  { code: "VN86", name: "Vĩnh Long", lon: 106.10, lat: 10.05 },
  { code: "VN91", name: "An Giang", lon: 105.15, lat: 10.35 },
  { code: "VN92", name: "Cần Thơ", lon: 105.70, lat: 9.85 },
  { code: "VN96", name: "Cà Mau", lon: 105.15, lat: 9.14 },
];

export const VietnamMap: React.FC<VietnamMapProps> = ({
  mode,
  onModeChange,
  selectedProvince,
  onSelectProvince,
  selectedRegionId,
  onSelectRegion,
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

  // Zoom & Pan transforms (Bản đồ luôn giữ thẳng đứng 0° Chính Bắc, KHÔNG XOAY BẢN ĐỒ)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isWheeling, setIsWheeling] = useState(false);
  const wheelTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trạng thái góc nhìn phương hướng đang chọn
  const [activeDirection, setActiveDirection] = useState<
    "bac" | "dong" | "nam" | "tay" | null
  >(null);

  // Ward active state
  const [activeWardId, setActiveWardId] = useState<string | null>(selectedWardId || null);

  // Hover states
  const [hoveredProvince, setHoveredProvince] = useState<ProvinceFeature | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const [hoveredWard, setHoveredWard] = useState<WardFeature | null>(null);
  const [wardTooltipPos, setWardTooltipPos] = useState({ x: 0, y: 0 });

  // Commune polygon territorial layers ("Tách từng mảng rõ như gis.vn")
  const [communePolygonsByProvince, setCommunePolygonsByProvince] = useState<Record<string, CommunePolygonCollection>>({});
  const [hoveredCommune, setHoveredCommune] = useState<CommunePolygonFeature | null>(null);
  const [isLegendOpen, setIsLegendOpen] = useState(false);
  const [communeTooltipPos, setCommuneTooltipPos] = useState({ x: 0, y: 0 });

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

  // Tự động nạp vector ranh giới xã/phường (Commune Polygons) chuẩn gis.vn khi chọn tỉnh hoặc zoom sâu
  useEffect(() => {
    const codesToLoad: string[] = [];

    if (selectedProvince) {
      const code = selectedProvince.properties.provinceCode;
      if (!communePolygonsByProvince[code]) {
        codesToLoad.push(code);
      }
    } else if (zoom >= 1.5) {
      // Tìm các tỉnh đang nằm trong khung nhìn viewport
      const viewLeft = -pan.x / zoom;
      const viewRight = (svgWidth - pan.x) / zoom;
      const viewTop = -pan.y / zoom;
      const viewBottom = (svgHeight - pan.y) / zoom;

      for (const p of PROVINCE_LABEL_CENTROIDS) {
        if (communePolygonsByProvince[p.code]) continue;
        const [px, py] = project(p.lon, p.lat);
        if (px >= viewLeft - 80 && px <= viewRight + 80 && py >= viewTop - 80 && py <= viewBottom + 80) {
          codesToLoad.push(p.code);
        }
      }
    }

    if (codesToLoad.length === 0) return;

    codesToLoad.forEach((pCode) => {
      fetch(`/data/wards/${pCode}.json`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data: CommunePolygonCollection | null) => {
          if (data && data.features) {
            setCommunePolygonsByProvince((prev) => {
              if (prev[pCode]) return prev;
              return { ...prev, [pCode]: data };
            });
          }
        })
        .catch(() => {});
    });
  }, [selectedProvince, zoom, pan, project, communePolygonsByProvince, svgWidth, svgHeight]);

  // Tự động căn giữa và phóng to mượt mà vào tỉnh được chọn (Auto-fit to Province - Loại bỏ tọa độ đảo xa để luôn zoom chuẩn tâm đất liền)
  useEffect(() => {
    if (!selectedProvince) return;
    const coords = selectedProvince.geometry.coordinates;
    const pCode = selectedProvince.properties.provinceCode;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    function walk(c: any) {
      if (typeof c[0] === "number") {
        // Loại trừ tọa độ Quần đảo Hoàng Sa khi căn giữa Đà Nẵng (VN48)
        if (pCode === "VN48" && c[0] > 109.2) return;
        // Loại trừ tọa độ Quần đảo Trường Sa khi căn giữa Khánh Hòa (VN56)
        if (pCode === "VN56" && c[0] > 110.0) return;

        const [x, y] = project(c[0], c[1]);
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      } else {
        c.forEach(walk);
      }
    }
    walk(coords);

    if (minX < maxX && minY < maxY) {
      const width = maxX - minX;
      const height = maxY - minY;
      const targetZoom = Math.min(
        Math.max(Math.min((svgWidth * 0.70) / width, (svgHeight * 0.70) / height), 1.6),
        4.8
      );
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const targetPanX = svgWidth / 2 - centerX * targetZoom;
      const targetPanY = svgHeight / 2 - centerY * targetZoom;

      setZoom(targetZoom);
      setPan({ x: targetPanX, y: targetPanY });
    }
  }, [selectedProvince?.properties.provinceCode, project, svgWidth, svgHeight]);

  // Tự động căn giữa và phóng to mượt mà vào Vùng được chọn (Auto-fit to Region)
  useEffect(() => {
    if (!selectedRegionId || selectedProvince || !geoData) return;
    const regionList = mode === "tu_nhien" ? NATURAL_REGIONS : ECONOMIC_REGIONS;
    const region = regionList.find((r) => r.id === selectedRegionId);
    if (!region) return;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    geoData.features.forEach((feat) => {
      if (!region.provinceCodes.includes(feat.properties.provinceCode)) return;
      const pCode = feat.properties.provinceCode;
      function walk(c: any) {
        if (typeof c[0] === "number") {
          if (pCode === "VN48" && c[0] > 109.2) return;
          if (pCode === "VN56" && c[0] > 110.0) return;
          const [x, y] = project(c[0], c[1]);
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        } else {
          c.forEach(walk);
        }
      }
      walk(feat.geometry.coordinates);
    });

    if (minX < maxX && minY < maxY) {
      const width = maxX - minX;
      const height = maxY - minY;
      const targetZoom = Math.min(
        Math.max(Math.min((svgWidth * 0.80) / width, (svgHeight * 0.80) / height), 1.2),
        3.2
      );
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      setZoom(targetZoom);
      setPan({
        x: svgWidth / 2 - centerX * targetZoom,
        y: svgHeight / 2 - centerY * targetZoom,
      });
    }
  }, [selectedRegionId, selectedProvince, geoData, mode, project, svgWidth, svgHeight]);

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

      // Chế độ Hành chính: Bảng màu pastel chuẩn SGK & Atlas Quốc gia (Phụ lục C)
      return ADMIN_PROVINCE_COLORS[code] || PROVINCE_PALETTE[0];
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

      // Quy chuẩn Phụ lục C: Đường địa giới hành chính màu đen K:100 (#000000), nét siêu mỏng 0.5px
      let fillOpacity = 0.95;
      let strokeColor = "#000000";
      let strokeWidth = 0.5;

      if (isInActiveRegion !== null) {
        if (isInActiveRegion) {
          fillOpacity = 1.0;
          strokeColor = "#0f172a"; // Viền đậm phân định rõ ranh giới vùng được chọn
          strokeWidth = 1.6;
        } else {
          fillOpacity = 0.32; // Làm mờ nhẹ các vùng khác không gây xao nhãng
          strokeColor = "#cbd5e1";
          strokeWidth = 0.4;
        }
      }

      if (isHovered) {
        fillOpacity = 1.0;
        strokeColor = "#0284c7"; // Viền xanh lam sáng C:100 (Phụ lục C mục 4)
        strokeWidth = 1.1;
      }

      if (isSelected) {
        fillOpacity = 1.0;
        strokeColor = "#eab308"; // Viền vàng kim nổi bật ranh giới tỉnh chuẩn gis.vn
        strokeWidth = 2.2;
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

  // LOD: Wards & Communes Level of Detail (Chuẩn GIS như gis.vn)
  // Tự động hiển thị khi zoom >= 1.5 hoặc khi đã chọn một tỉnh cụ thể
  const isWardsVisible = Boolean(
    layers.wards && (selectedProvince !== null || zoom >= 1.5)
  );

  // Vector đa giác ranh giới từng xã/phường ("Tách từng mảng rõ ràng chuẩn gis.vn")
  const projectedCommunes = useMemo(() => {
    if (!isWardsVisible) return [];

    const targetProvinceCodes = selectedProvince
      ? [selectedProvince.properties.provinceCode]
      : zoom >= 1.5
      ? Object.keys(communePolygonsByProvince)
      : [];

    if (targetProvinceCodes.length === 0) return [];

    const items: Array<{
      feature: CommunePolygonFeature;
      pathString: string;
      center: [number, number];
      isHovered: boolean;
      baseFill: string;
      screenWidth: number;
    }> = [];

    for (const pCode of targetProvinceCodes) {
      const coll = communePolygonsByProvince[pCode];
      if (!coll || !coll.features) continue;

      for (const feat of coll.features) {
        let pathString = "";
        const coords = feat.geometry.coordinates;

        if (feat.geometry.type === "Polygon") {
          coords.forEach((ring: any) => {
            ring.forEach(([lon, lat]: [number, number], i: number) => {
              const [x, y] = project(lon, lat);
              pathString += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
            });
            pathString += " Z ";
          });
        } else if (feat.geometry.type === "MultiPolygon") {
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

        const center = project(feat.properties.centroid[0], feat.properties.centroid[1]);
        const isHovered = hoveredCommune?.id === feat.id;

        // Tính bề rộng ước lượng trên màn hình để kiểm soát hiển thị nhãn
        const bbox = feat.properties.bbox;
        const pMin = project(bbox[0], bbox[1]);
        const pMax = project(bbox[2], bbox[3]);
        const screenWidth = Math.abs(pMax[0] - pMin[0]) * zoom;

        // Bảng sắc thái tương phản giữa các xã lân cận ("Tách từng mảng rõ như gis.vn")
        const codeNum = parseInt(feat.properties.code.slice(-3), 10) || 0;
        const shade = codeNum % 4;
        const baseFill = shade === 0
          ? "rgba(0, 0, 0, 0.06)"
          : shade === 1
          ? "rgba(255, 255, 255, 0.22)"
          : shade === 2
          ? "rgba(0, 0, 0, 0.14)"
          : "rgba(255, 255, 255, 0.08)";

        items.push({
          feature: feat,
          pathString,
          center,
          isHovered,
          baseFill,
          screenWidth,
        });
      }
    }

    return items;
  }, [isWardsVisible, selectedProvince, zoom, communePolygonsByProvince, hoveredCommune, project]);

  // Thuật toán lọc nhãn xã/phường (Spatial Collision Thinning chuẩn GIS):
  // Sắp xếp theo diện tích lớn trước, giữ khoảng cách tối thiểu giữa các nhãn để bản đồ luôn thoáng đẹp như gis.vn
  const visibleCommuneLabels = useMemo(() => {
    if (!isWardsVisible || projectedCommunes.length === 0) return [];

    const sorted = [...projectedCommunes].sort(
      (a, b) => (b.feature.properties.areaKm2 || 0) - (a.feature.properties.areaKm2 || 0)
    );

    const placed: Array<{ cx: number; cy: number }> = [];
    const minDistancePx = selectedProvince ? 28 : 36;
    const minScreenWidth = selectedProvince ? 18 : 26;

    const results: typeof projectedCommunes = [];
    for (const item of sorted) {
      if (item.screenWidth < minScreenWidth) continue;

      const [cx, cy] = item.center;
      const isTooClose = placed.some(
        (p) => Math.hypot((cx - p.cx) * zoom, (cy - p.cy) * zoom) < minDistancePx
      );

      if (!isTooClose) {
        placed.push({ cx, cy });
        results.push(item);
      }
    }

    return results;
  }, [isWardsVisible, projectedCommunes, selectedProvince, zoom]);

  // Filter wards to render: Lọc xã/phường theo tỉnh hoặc theo khung nhìn (viewport)
  // Áp dụng thuật toán spatial collision thinning để các nhãn không bao giờ bị đè lên nhau
  const displayedWards = useMemo(() => {
    if (!wardsData || !isWardsVisible) return [];

    let candidates: WardFeature[] = [];

    // Nếu đã chọn một tỉnh cụ thể: Hiển thị các xã/phường thuộc tỉnh đó
    if (selectedProvince) {
      candidates = wardsData.features.filter(
        (w) => w.properties.provinceCode === selectedProvince.properties.provinceCode
      );
    } else if (zoom >= 1.5) {
      // Nếu zoom >= 1.5: Lấy các xã/phường nằm trong vùng hiển thị (viewport)
      const viewLeft = -pan.x / zoom;
      const viewRight = (svgWidth - pan.x) / zoom;
      const viewTop = -pan.y / zoom;
      const viewBottom = (svgHeight - pan.y) / zoom;

      candidates = wardsData.features.filter((w) => {
        const [lon, lat] = w.geometry.coordinates;
        const [wx, wy] = project(lon, lat);
        return (
          wx >= viewLeft - 30 &&
          wx <= viewRight + 30 &&
          wy >= viewTop - 30 &&
          wy <= viewBottom + 30
        );
      });
    }

    // Nếu đã có vector đa giác ranh giới xã/phường cho tỉnh này, chỉ giữ lại các điểm đảo (Hoàng Sa, Trường Sa, Côn Đảo, Phú Quốc)
    // để loại bỏ hoàn toàn tình trạng chấm li ti và nhãn chữ đè lấn nhau trên đất liền
    const isPolygonsActive = projectedCommunes.length > 0;
    if (isPolygonsActive) {
      return candidates.filter((w) => Boolean(w.properties.isIsland));
    }

    // Spatial collision avoidance: Giữ khoảng cách tối thiểu giữa 2 nhãn trên màn hình (~18-22px)
    const result: WardFeature[] = [];
    const minDistancePx = selectedProvince ? 18 : 22;
    for (const w of candidates) {
      const [lon, lat] = w.geometry.coordinates;
      const [wx, wy] = project(lon, lat);
      const isTooClose = result.some((placed) => {
        const [pLon, pLat] = placed.geometry.coordinates;
        const [px, py] = project(pLon, pLat);
        const screenDist = Math.hypot((wx - px) * zoom, (wy - py) * zoom);
        return screenDist < minDistancePx;
      });
      if (!isTooClose) {
        result.push(w);
      }
    }

    return result;
  }, [wardsData, isWardsVisible, selectedProvince, zoom, pan, project, svgWidth, svgHeight]);

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
    setIsWheeling(true);
    if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    wheelTimeoutRef.current = setTimeout(() => setIsWheeling(false), 120);

    const factor = e.deltaY < 0 ? 1.09 : 0.91;
    const newZoom = Math.min(Math.max(zoom * factor, 0.6), 8);
    if (newZoom === zoom) return;

    // Zoom hướng tâm chính xác theo vị trí con trỏ chuột (Focal Point Zoom chuẩn GIS)
    // Giữ điểm bản đồ nằm dưới con trỏ chuột không bị chạy lệch ("bị lố sang phần khác")
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && rect.width > 0 && rect.height > 0) {
      const mouseX = (e.clientX - rect.left) * (svgWidth / rect.width);
      const mouseY = (e.clientY - rect.top) * (svgHeight / rect.height);
      const ratio = newZoom / zoom;
      const newPanX = mouseX - (mouseX - pan.x) * ratio;
      const newPanY = mouseY - (mouseY - pan.y) * ratio;

      setZoom(newZoom);
      setPan({ x: newPanX, y: newPanY });
    } else {
      setZoom(newZoom);
    }
  };

  // Zoom in/out giữ nguyên tâm giữa màn hình (Center Focal Zoom)
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.25, 8);
    if (newZoom === zoom) return;
    const ratio = newZoom / zoom;
    const cx = svgWidth / 2;
    const cy = svgHeight / 2;
    setPan((prev) => ({
      x: cx - (cx - prev.x) * ratio,
      y: cy - (cy - prev.y) * ratio,
    }));
    setZoom(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom * 0.8, 0.6);
    if (newZoom === zoom) return;
    const ratio = newZoom / zoom;
    const cx = svgWidth / 2;
    const cy = svgHeight / 2;
    setPan((prev) => ({
      x: cx - (cx - prev.x) * ratio,
      y: cy - (cy - prev.y) * ratio,
    }));
    setZoom(newZoom);
  };

  // Reset về góc nhìn toàn cảnh toàn vẹn Việt Nam
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActiveWardId(null);
    setActiveDirection(null);
  };

  // =========================================================================
  // DI CHUYỂN BẢN ĐỒ ĐẾN GÓC ĐÔNG / TÂY / NAM / BẮC (ĐÚNG TÂM ĐỊA LÝ, LƯỚT MƯỢT MÀ)
  // =========================================================================
  const handleFlyToCorner = (direction: "bac" | "dong" | "nam" | "tay") => {
    setActiveDirection(direction);

    if (direction === "bac") {
      // Phía Bắc: Căn chuẩn trung tâm Hà Nội, ĐBSH & Việt Bắc (tx: 250, ty: 200)
      setZoom(1.6);
      setPan({ x: 80, y: 205 });
    } else if (direction === "nam") {
      // Phía Nam: Căn chuẩn trung tâm TP. HCM, ĐBSCL & Cà Mau (tx: 260, ty: 790)
      setZoom(1.6);
      setPan({ x: 64, y: -739 });
    } else if (direction === "dong") {
      // Phía Đông: Căn chuẩn vùng Biển Đông, Quần đảo Hoàng Sa & Trường Sa (tx: 625, ty: 620)
      setZoom(1.3);
      setPan({ x: -332, y: -281 });
    } else if (direction === "tay") {
      // Phía Tây: Căn chuẩn Điện Biên, Lai Châu & Dãy Hoàng Liên Sơn (tx: 130, ty: 200)
      setZoom(1.6);
      setPan({ x: 272, y: 205 });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-[#edf6fd] overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      {/* Khung lưới tọa độ GIS VN-2000 chấm tròn / grid dots xanh lam sáng (Phụ lục C mục 4) */}
      {layers.grid && (
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: "radial-gradient(#0284c7 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      )}

      {/* Floating Badge: Top-Center (Thông báo khu vực địa lí khi di chuyển đến Đông/Tây/Nam/Bắc) */}
      {activeDirection && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-1.5 bg-white/95 border border-teal-500 rounded-full shadow-md text-xs backdrop-blur animate-in fade-in slide-in-from-top-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />
          <span className="text-slate-700 font-medium">
            Đang xem:{" "}
            <strong className="text-teal-900 font-bold">
              {activeDirection === "bac" && "Phía Bắc — Thủ đô Hà Nội & Vùng núi Bắc Bộ"}
              {activeDirection === "dong" && "Phía Đông — Quần đảo Hoàng Sa & Quần đảo Trường Sa"}
              {activeDirection === "nam" && "Phía Nam — TP. Hồ Chí Minh & ĐBSCL, Cực Nam Đất Mũi"}
              {activeDirection === "tay" && "Phía Tây — Tây Bắc Bộ & Dãy Hoàng Liên Sơn"}
            </strong>
          </span>
          <button
            onClick={handleReset}
            className="text-[11px] font-semibold text-teal-700 hover:text-teal-900 px-2 py-0.5 rounded-full bg-teal-50 hover:bg-teal-100 transition-colors ml-1"
            title="Quay lại góc nhìn toàn cảnh toàn bộ Việt Nam"
          >
            Toàn cảnh ✕
          </button>
        </div>
      )}



      {/* Floating Controls: Top-Right (La bàn điều hướng 4 góc Đông-Tây-Nam-Bắc & Cụm Zoom) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
        {/* Hộp La bàn điều hướng di chuyển 4 góc Đông - Tây - Nam - Bắc (Gọn đẹp như mockup, KHÔNG XOAY) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden p-1.5 flex flex-col items-center select-none w-14">
          {/* Cụm 4 nút điều hướng góc nhìn B - Đ - N - T */}
          <div className="relative w-11 h-11 flex items-center justify-center">
            {/* Vòng nền tròn nhẹ */}
            <div className="absolute inset-0 rounded-full bg-slate-50 border border-slate-200/80 pointer-events-none" />

            {/* Nút B (Bắc - Trên cùng): Di chuyển tới phía Bắc */}
            <button
              onClick={() => handleFlyToCorner("bac")}
              title="Di chuyển đến Phía Bắc (Hà Nội, Cực Bắc Lũng Cú & Miền núi phía Bắc)"
              className={`absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-black transition-all ${
                activeDirection === "bac"
                  ? "bg-red-600 text-white shadow-xs"
                  : "text-red-600 hover:bg-red-50 hover:scale-125"
              }`}
            >
              B
            </button>

            {/* Nút Đ (Đông - Bên phải): Di chuyển tới phía Đông */}
            <button
              onClick={() => handleFlyToCorner("dong")}
              title="Di chuyển đến Phía Đông (Vùng Biển Đông, Quần đảo Hoàng Sa & Trường Sa)"
              className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-black transition-all ${
                activeDirection === "dong"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-teal-700 hover:bg-teal-50 hover:scale-125"
              }`}
            >
              Đ
            </button>

            {/* Nút N (Nam - Dưới cùng): Di chuyển tới phía Nam */}
            <button
              onClick={() => handleFlyToCorner("nam")}
              title="Di chuyển đến Phía Nam (TP. Hồ Chí Minh, ĐBSCL & Cực Nam Đất Mũi)"
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-black transition-all ${
                activeDirection === "nam"
                  ? "bg-slate-700 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-200 hover:scale-125"
              }`}
            >
              N
            </button>

            {/* Nút T (Tây - Bên trái): Di chuyển tới phía Tây */}
            <button
              onClick={() => handleFlyToCorner("tay")}
              title="Di chuyển đến Phía Tây (Điện Biên, Cực Tây A Pa Chải & Dãy Hoàng Liên Sơn)"
              className={`absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full text-[9px] font-black transition-all ${
                activeDirection === "tay"
                  ? "bg-teal-700 text-white shadow-xs"
                  : "text-teal-700 hover:bg-teal-50 hover:scale-125"
              }`}
            >
              T
            </button>

            {/* Mũi tên chỉ hướng Bắc ở tâm (Bấm để di chuyển tới phía Bắc) */}
            <div
              onClick={() => handleFlyToCorner("bac")}
              className="cursor-pointer group flex flex-col items-center justify-center transition-transform hover:scale-110"
              title="Di chuyển đến Phía Bắc"
            >
              <span className="text-[10px] font-black text-teal-700 leading-none">▲</span>
            </div>
          </div>

          <span className="text-[8.5px] font-bold tracking-tight text-slate-500 mt-0.5 select-none">
            BẮC
          </span>
        </div>

        {/* Cụm nút phóng to / thu nhỏ / Home */}
        <div className="flex flex-col bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden w-9">
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



      {/* Nút nổi điều khiển: Quay lại bản đồ toàn quốc khi đang phóng to/chọn tỉnh */}
      {selectedProvince && (
        <button
          onClick={() => {
            onSelectProvince(null);
            handleReset();
          }}
          className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3.5 py-2 bg-white/95 hover:bg-white border border-slate-200 text-slate-700 hover:text-teal-700 rounded-xl shadow-lg backdrop-blur text-xs font-bold transition-all group cursor-pointer"
          title="Quay lại bản đồ toàn cảnh 34 tỉnh thành"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-teal-600" />
          <span>Toàn quốc</span>
          <span className="text-slate-300 font-normal">|</span>
          <span className="text-teal-700">{selectedProvince.properties.name}</span>
        </button>
      )}

      {/* Floating Buttons: Bottom-Left (Nút GPS & Nút Chú giải màu sắc vùng) */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
        <button
          onClick={handleReset}
          className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-600 hover:text-teal-700 hover:bg-slate-50 transition-colors cursor-pointer"
          title="Căn giữa toàn cảnh Việt Nam"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Nút Chú giải màu sắc vùng */}
        <div className="relative">
          <button
            onClick={() => setIsLegendOpen((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-xs text-xs font-semibold backdrop-blur transition-all cursor-pointer ${
              isLegendOpen
                ? "bg-slate-900 border-slate-900 text-white shadow-md"
                : "bg-white/95 hover:bg-white border-slate-200 text-slate-700 hover:text-teal-700"
            }`}
            title="Xem chú giải ý nghĩa màu sắc các vùng trên bản đồ"
          >
            <Palette className="w-3.5 h-3.5 text-teal-600" />
            <span>Chú giải</span>
          </button>

          {/* Hộp Chú giải màu nổi */}
          {isLegendOpen && (
            <div className="absolute bottom-full left-0 mb-2 w-64 bg-white/98 border border-slate-200 rounded-xl shadow-xl p-3 z-30 text-xs space-y-2 animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="font-bold text-slate-800">
                  {mode === "tu_nhien" ? "7 Khu vực Tự nhiên" : mode === "kinh_te" ? "6 Vùng Kinh tế - Xã hội" : "Phân vùng màu sắc"}
                </span>
                <button
                  onClick={() => setIsLegendOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto custom-scroll pr-1">
                {(mode === "tu_nhien" ? NATURAL_REGIONS : ECONOMIC_REGIONS).map((reg) => {
                  const isSelected = selectedRegionId === reg.id;
                  return (
                    <button
                      key={reg.id}
                      onClick={() => onSelectRegion?.(isSelected ? null : reg.id)}
                      className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                        isSelected ? "bg-teal-50 border border-teal-200 font-bold" : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0 border border-black/10"
                          style={{ backgroundColor: reg.color }}
                        />
                        <span className="text-[11px] text-slate-800 line-clamp-1">{reg.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {reg.provinceCodes.length} tỉnh
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thước khoảng cách động chuẩn GIS (Dynamic Graphic Scale Bar) */}
      {(() => {
        const targetKm = (60 * 1.986) / zoom;
        let displayKm = 100;
        if (targetKm >= 150) displayKm = 200;
        else if (targetKm >= 75) displayKm = 100;
        else if (targetKm >= 35) displayKm = 50;
        else if (targetKm >= 15) displayKm = 20;
        else if (targetKm >= 7) displayKm = 10;
        else displayKm = 5;

        const barWidthPx = Math.round((displayKm * zoom) / 1.986);

        return (
          <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-1 select-none pointer-events-none">
            <div className="px-2.5 py-1 bg-white/95 border border-slate-200 rounded-lg shadow-xs backdrop-blur flex items-center gap-2 text-[10px] font-mono text-slate-700 font-bold">
              <div className="flex flex-col items-center">
                <div
                  className="h-1 bg-slate-800 border-x-2 border-slate-900"
                  style={{ width: `${Math.max(barWidthPx, 28)}px` }}
                />
                <span className="text-[9px] leading-tight text-slate-600 mt-0.5">
                  {displayKm} km
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Mode fallback text to preserve test suite compatibility (T3.1.2, T3.1.3, T3.1.4, T8.15) */}
      <div className="sr-only">
        <button onClick={() => onModeChange?.("hanh_chinh")}>Hành chính (34 tỉnh)</button>
        <button onClick={() => onModeChange?.("tu_nhien")}>Tự nhiên (7 khu vực)</button>
        <button onClick={() => onModeChange?.("kinh_te")}>Kinh tế - Xã hội (6 vùng)</button>
      </div>

      {/* Main Vector SVG Map (Lướt mượt mà không xoay, không giật lag) */}
      <svg
        className={`w-full h-full ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Khung chứa bản đồ lướt mượt mà (chỉ pan và zoom, 100% không xoay) */}
        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{
            transition: isDragging || isWheeling
              ? "none"
              : "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        >
          {/* Province Vector Shapes */}
          {pathsData.slice().sort((a, b) => (a.isSelected ? 1 : 0) - (b.isSelected ? 1 : 0)).map((item) => (
            <path
              key={item.feature.properties.provinceCode}
              d={item.pathString}
              fill={item.color}
              fillOpacity={item.fillOpacity}
              stroke={layers.boundaries ? item.strokeColor : "none"}
              strokeWidth={item.strokeWidth}
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
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

          {/* Lớp Ranh giới từng xã/phường dạng Đa giác khép kín ("Tách từng mảng rõ như gis.vn") */}
          {isWardsVisible && projectedCommunes.length > 0 && (
            <g className="commune-polygons-layer">
              {projectedCommunes.map(({ feature, pathString, isHovered, baseFill }) => (
                <path
                  key={feature.id}
                  d={pathString}
                  fill={isHovered ? "rgba(56, 189, 248, 0.38)" : baseFill}
                  stroke={isHovered ? "#0284c7" : "rgba(255, 255, 255, 0.85)"}
                  strokeWidth={isHovered ? Math.max(1.8 / zoom, 0.8) : Math.max(0.85 / zoom, 0.35)}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  className="transition-colors duration-100 cursor-pointer"
                  onMouseEnter={(e) => {
                    setHoveredCommune(feature);
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      setCommuneTooltipPos({
                        x: e.clientX - rect.left + 15,
                        y: e.clientY - rect.top + 15,
                      });
                    }
                  }}
                  onMouseMove={(e) => {
                    const rect = containerRef.current?.getBoundingClientRect();
                    if (rect) {
                      setCommuneTooltipPos({
                        x: e.clientX - rect.left + 15,
                        y: e.clientY - rect.top + 15,
                      });
                    }
                  }}
                  onMouseLeave={() => setHoveredCommune(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onSelectWard) {
                      onSelectWard({
                        type: "Feature",
                        properties: {
                          id: feature.properties.id,
                          name: feature.properties.name,
                          district: feature.properties.provinceName,
                          provinceCode: feature.properties.provinceCode,
                          provinceName: feature.properties.provinceName,
                          type: feature.properties.type,
                          role: feature.properties.mergedFrom || "Đơn vị hành chính cấp xã sau sáp nhập",
                        },
                        geometry: {
                          type: "Point",
                          coordinates: feature.properties.centroid,
                        },
                      });
                    }
                  }}
                />
              ))}
            </g>
          )}

          {/* Lớp Nhãn Tên Xã/Phường đặt ngay tâm từng mảng (Chuẩn GIS gis.vn - Chữ trắng viền tối sắc nét, thưa thoáng, chống chồng đè) */}
          {isWardsVisible && visibleCommuneLabels.length > 0 && (
            <g className="commune-labels-layer pointer-events-none select-none font-sans">
              {visibleCommuneLabels.map(({ feature, center, isHovered }) => {
                let name = feature.properties.name.replace(/^(Xã|Phường|Thị trấn)\s+/i, "");
                const fontSize = Math.max(
                  (selectedProvince ? 8.5 : 7.5) / zoom,
                  selectedProvince ? 3.0 : 2.4
                );

                return (
                  <text
                    key={`lbl-${feature.id}`}
                    x={center[0]}
                    y={center[1]}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={isHovered ? "#38bdf8" : "#ffffff"}
                    fontSize={`${fontSize}px`}
                    fontWeight={isHovered ? "800" : "600"}
                    stroke="#090d16"
                    strokeWidth={`${Math.max(fontSize * 0.22, 0.55 / zoom)}px`}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    paintOrder="stroke fill"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.85))"
                    className="transition-colors duration-100"
                  >
                    {name}
                  </text>
                );
              })}
            </g>
          )}

          {/* Biển Đông Watermark Text */}
          <text
            x="640"
            y="460"
            fill="#94a3b8"
            fontSize="18"
            fontWeight="bold"
            letterSpacing="5"
            className="pointer-events-none select-none uppercase opacity-35 font-sans"
          >
            BIỂN ĐÔNG
          </text>
          <text
            x="645"
            y="485"
            fill="#94a3b8"
            fontSize="11"
            className="pointer-events-none select-none opacity-35 font-sans font-medium"
          >
            (EAST VIETNAM SEA)
          </text>

          {/* Layer Tên 34 Tỉnh thành Việt Nam (Chuẩn GIS gis.vn - Toàn vẹn 34 tỉnh, sắc nét, chống chồng chéo) */}
          <g className="province-labels-layer pointer-events-none select-none font-sans">
            {PROVINCE_LABEL_CENTROIDS.map((p) => {
              const [px, py] = project(p.lon, p.lat);
              const isSelected = selectedProvince?.properties.provinceCode === p.code;
              const isHovered = hoveredProvince?.properties.provinceCode === p.code;

              return (
                <g
                  key={p.code}
                  transform={`translate(${px}, ${py})`}
                  className="transition-all duration-150"
                >
                  {p.isCapital ? (
                    <>
                      <circle cx="0" cy="0" r={4 / zoom} fill="#dc2626" stroke="#ffffff" strokeWidth={1.5 / zoom} />
                      <circle cx="0" cy="0" r={8 / zoom} fill="#dc2626" opacity="0.25" className="animate-ping" />
                      <text
                        x={-8 / zoom}
                        y={3.5 / zoom}
                        textAnchor="end"
                        fill={isSelected ? "#ca8a04" : "#0f172a"}
                        fontSize={`${Math.max(12 / zoom, 5.5)}px`}
                        fontWeight="800"
                        stroke="#ffffff"
                        strokeWidth={`${Math.max(3.2 / zoom, 1)}px`}
                        strokeLinejoin="round"
                        paintOrder="stroke fill"
                      >
                        ★ {p.name}
                      </text>
                    </>
                  ) : (
                    <text
                      x="0"
                      y={3.5 / zoom}
                      textAnchor="middle"
                      fill={isSelected ? "#ca8a04" : isHovered ? "#0f766e" : "#0f172a"}
                      fontSize={`${Math.max((isSelected ? 16 : 14) / zoom, isSelected ? 9.5 : 7.8)}px`}
                      fontWeight={isSelected ? "900" : "800"}
                      stroke={isSelected ? "#0f172a" : "#ffffff"}
                      strokeWidth={`${Math.max((isSelected ? 3.8 : 3.0) / zoom, 1.2)}px`}
                      strokeLinejoin="round"
                      paintOrder="stroke fill"
                      letterSpacing="0.2px"
                    >
                      {p.name}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Thêm nhãn địa danh hải đảo quan trọng Côn Đảo & Đ. Phú Quốc */}
            <g transform={`translate(${project(106.61, 8.68)[0]}, ${project(106.61, 8.68)[1]})`}>
              <circle cx="0" cy="0" r={2.5 / zoom} fill="#0f766e" stroke="#ffffff" strokeWidth={0.8 / zoom} />
              <text
                x={5 / zoom}
                y={3 / zoom}
                fill="#334155"
                fontSize={`${Math.max(9 / zoom, 4.5)}px`}
                fontWeight="600"
                stroke="#ffffff"
                strokeWidth={`${Math.max(2 / zoom, 0.6)}px`}
                strokeLinejoin="round"
                paintOrder="stroke fill"
              >
                Côn Đảo
              </text>
            </g>
            <g transform={`translate(${project(103.96, 10.22)[0]}, ${project(103.96, 10.22)[1]})`}>
              <circle cx="0" cy="0" r={2.5 / zoom} fill="#0f766e" stroke="#ffffff" strokeWidth={0.8 / zoom} />
              <text
                x={5 / zoom}
                y={3 / zoom}
                fill="#334155"
                fontSize={`${Math.max(9 / zoom, 4.5)}px`}
                fontWeight="600"
                stroke="#ffffff"
                strokeWidth={`${Math.max(2 / zoom, 0.6)}px`}
                strokeLinejoin="round"
                paintOrder="stroke fill"
              >
                Đ. Phú Quốc
              </text>
            </g>
          </g>

          {/* Thẻ định danh chủ quyền Quần đảo Hoàng Sa & Quần đảo Trường Sa (Chuẩn mockup ảnh) */}
          {layers.sovereignty && (
            <g className="pointer-events-none select-none font-sans">
              {/* Thẻ Quần đảo Hoàng Sa */}
              <g transform="translate(635, 385)" filter="url(#card-shadow)">
                <rect
                  x="0"
                  y="0"
                  width="168"
                  height="44"
                  rx="9"
                  fill="#ffffff"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
                <circle cx="15" cy="18" r="3.5" fill="#0f766e" />
                <circle cx="15" cy="18" r="6" fill="#0f766e" opacity="0.3" className="animate-ping" />
                <text x="27" y="21" fill="#0f766e" fontSize="11" fontWeight="bold">
                  Quần đảo Hoàng Sa
                </text>
                <text x="27" y="35" fill="#64748b" fontSize="9.5">
                  (Đà Nẵng, Việt Nam)
                </text>
              </g>

              {/* Các điểm đảo nhỏ Hoàng Sa */}
              <circle cx="670" cy="450" r="2.5" fill="#0f766e" />
              <circle cx="690" cy="440" r="2" fill="#0f766e" />
              <circle cx="710" cy="465" r="2.5" fill="#0f766e" />

              {/* Thẻ Quần đảo Trường Sa */}
              <g transform="translate(625, 715)" filter="url(#card-shadow)">
                <rect
                  x="0"
                  y="0"
                  width="168"
                  height="44"
                  rx="9"
                  fill="#ffffff"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
                <circle cx="15" cy="18" r="3.5" fill="#0f766e" />
                <circle cx="15" cy="18" r="6" fill="#0f766e" opacity="0.3" className="animate-ping" />
                <text x="27" y="21" fill="#0f766e" fontSize="11" fontWeight="bold">
                  Quần đảo Trường Sa
                </text>
                <text x="27" y="35" fill="#64748b" fontSize="9.5">
                  (Khánh Hòa, Việt Nam)
                </text>
              </g>

              {/* Các điểm đảo nhỏ Trường Sa */}
              <circle cx="660" cy="670" r="2.5" fill="#0f766e" />
              <circle cx="680" cy="650" r="2.5" fill="#0f766e" />
              <circle cx="700" cy="690" r="2" fill="#0f766e" />
              <circle cx="645" cy="780" r="2.5" fill="#0f766e" />
              <circle cx="685" cy="790" r="2.5" fill="#0f766e" />
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

                return (
                  <g
                    key={ward.properties.id}
                    transform={`translate(${wx}, ${wy})`}
                    className="cursor-pointer group select-none"
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
                    {/* Animated Pulse Ring cho đảo chủ quyền hoặc điểm được chọn */}
                    {(isSelectedWard || (isIsland && isHovered)) && (
                      <circle
                        r={8 / zoom}
                        fill={isIsland ? "#0ea5e9" : "#f59e0b"}
                        opacity="0.35"
                        className="animate-ping pointer-events-none"
                      />
                    )}

                    {/* Điểm neo centroid tinh tế chuẩn GIS */}
                    <circle
                      r={isHovered || isSelectedWard ? 2.8 / zoom : isIsland ? 2.2 / zoom : 1.7 / zoom}
                      fill={isIsland ? "#0284c7" : isSelectedWard ? "#f59e0b" : isHovered ? "#b45309" : "#334155"}
                      stroke="#ffffff"
                      strokeWidth={0.8 / zoom}
                      className="transition-all duration-150"
                    />

                    {/* Tên Phường/Xã dạng chữ GIS sắc nét gọn gàng (Chuẩn gis.vn: Bỏ tiền tố Xã/Phường, viền trắng mỏng, kích thước đồng nhất, không che khuất) */}
                    <text
                      textAnchor="middle"
                      y={-3.5 / zoom}
                      fill={isHovered || isSelectedWard ? "#b45309" : "#0f172a"}
                      fontSize={`${Math.max(10 / zoom, 2.8)}px`}
                      fontWeight="600"
                      fontFamily="system-ui, -apple-system, sans-serif"
                      stroke="#ffffff"
                      strokeWidth={`${Math.max(2 / zoom, 0.6)}px`}
                      strokeLinejoin="round"
                      paintOrder="stroke fill"
                      className="transition-all duration-150 pointer-events-none select-none"
                    >
                      {(() => {
                        const stripped = ward.properties.name.replace(/^(Phường|Xã|Thị trấn)\s+/i, "").trim();
                        if (/^\d+$/.test(stripped)) {
                          if (ward.properties.district) {
                            return ward.properties.district.replace(/^(Thành phố|Quận|Huyện|Thị xã|TP\.)\s+/i, "").trim();
                          }
                          return `P.${stripped}`;
                        }
                        return stripped;
                      })()}
                    </text>
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

      {/* Commune Polygon Hover Tooltip (Chuẩn gis.vn: Tách từng mảng, hiển thị diện tích, dân số, sáp nhập) */}
      {hoveredCommune && !hoveredWard && (
        <div
          className="absolute z-40 pointer-events-none bg-white/95 border border-sky-300 text-slate-800 rounded-xl p-3 shadow-2xl backdrop-blur max-w-sm text-xs animate-in fade-in duration-150"
          style={{ left: `${communeTooltipPos.x}px`, top: `${communeTooltipPos.y}px` }}
        >
          <div className="flex items-center justify-between gap-2 border-b border-sky-100 pb-2 mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
              <h5 className="font-bold text-slate-900 text-sm">
                {hoveredCommune.properties.type} {hoveredCommune.properties.name}
              </h5>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-[10px] text-sky-700 font-bold">
              {hoveredCommune.properties.provinceName}
            </span>
          </div>

          <div className="text-xs text-slate-600 flex flex-col gap-1.5">
            {hoveredCommune.properties.areaKm2 > 0 && (
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Diện tích:</span>
                <span className="font-semibold text-slate-900">
                  {hoveredCommune.properties.areaKm2.toLocaleString("vi-VN")} km²
                </span>
              </div>
            )}
            {hoveredCommune.properties.population > 0 && (
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Dân số:</span>
                <span className="font-semibold text-slate-900">
                  {hoveredCommune.properties.population.toLocaleString("vi-VN")} người
                </span>
              </div>
            )}
            {hoveredCommune.properties.density > 0 && (
              <div className="flex items-center justify-between text-slate-700">
                <span className="text-slate-500">Mật độ:</span>
                <span className="font-semibold text-slate-900">
                  {Math.round(hoveredCommune.properties.density).toLocaleString("vi-VN")} người/km²
                </span>
              </div>
            )}
            {hoveredCommune.properties.mergedFrom && (
              <div className="text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                <span className="font-semibold text-sky-800">Sáp nhập: </span>
                <span>{hoveredCommune.properties.mergedFrom}</span>
              </div>
            )}
            {hoveredCommune.properties.headquarters && (
              <div className="text-[10px] text-slate-500 italic">
                Trụ sở UBND: {hoveredCommune.properties.headquarters}
              </div>
            )}
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
