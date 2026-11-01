import { RegionDefinition } from "@/types/geo";

// 6 Vùng Kinh tế - Xã hội theo Nghị quyết và Spec VN34MG
export const ECONOMIC_REGIONS: RegionDefinition[] = [
  {
    id: "kt_trung_du_mien_nui_phia_bac",
    name: "Trung du và miền núi phía Bắc",
    color: "#059669", // Xanh ngọc lục bảo
    type: "economic",
    provinceCodes: ["VN04", "VN08", "VN11", "VN12", "VN14", "VN15", "VN19", "VN20", "VN22", "VN25"],
  },
  {
    id: "kt_dong_bang_song_hong",
    name: "Đồng bằng sông Hồng",
    color: "#2563eb", // Xanh dương
    type: "economic",
    provinceCodes: ["VN01", "VN24", "VN31", "VN33", "VN37"],
  },
  {
    id: "kt_bac_trung_bo_duyen_hai_mien_trung",
    name: "Bắc Trung Bộ và Duyên hải miền Trung",
    color: "#d97706", // Cam hổ phách
    type: "economic",
    provinceCodes: ["VN38", "VN40", "VN42", "VN44", "VN46", "VN48", "VN51", "VN56"],
  },
  {
    id: "kt_tay_nguyen",
    name: "Tây Nguyên",
    color: "#7c3aed", // Tím
    type: "economic",
    provinceCodes: ["VN52", "VN66", "VN68"],
  },
  {
    id: "kt_dong_nam_bo",
    name: "Đông Nam Bộ",
    color: "#dc2626", // Đỏ gạch
    type: "economic",
    provinceCodes: ["VN75", "VN79", "VN80"],
  },
  {
    id: "kt_dong_bang_song_cuu_long",
    name: "Đồng bằng sông Cửu Long",
    color: "#0d9488", // Xanh teal
    type: "economic",
    provinceCodes: ["VN82", "VN86", "VN91", "VN92", "VN96"],
  },
];

// 7 Khu vực tra cứu tự nhiên theo tài liệu gốc VN34MG
export const NATURAL_REGIONS: RegionDefinition[] = [
  {
    id: "tn_dong_bac_bo",
    name: "Đông Bắc Bộ",
    color: "#15803d",
    type: "natural",
    provinceCodes: ["VN04", "VN08", "VN19", "VN20", "VN22", "VN25"],
  },
  {
    id: "tn_tay_bac_bo",
    name: "Tây Bắc Bộ",
    color: "#4d7c0f",
    type: "natural",
    provinceCodes: ["VN11", "VN12", "VN14", "VN15"],
  },
  {
    id: "tn_dong_bang_song_hong",
    name: "Đồng bằng sông Hồng",
    color: "#1d4ed8",
    type: "natural",
    provinceCodes: ["VN01", "VN24", "VN31", "VN33", "VN37"],
  },
  {
    id: "tn_bac_trung_bo",
    name: "Bắc Trung Bộ",
    color: "#ea580c",
    type: "natural",
    provinceCodes: ["VN38", "VN40", "VN42", "VN44", "VN46"],
  },
  {
    id: "tn_duyen_hai_nam_trung_bo",
    name: "Duyên hải Nam Trung Bộ",
    color: "#f59e0b",
    type: "natural",
    provinceCodes: ["VN48", "VN51", "VN56"],
  },
  {
    id: "tn_tay_nguyen",
    name: "Tây Nguyên",
    color: "#6b21a8",
    type: "natural",
    provinceCodes: ["VN52", "VN66", "VN68"],
  },
  {
    id: "tn_nam_bo",
    name: "Nam Bộ (Đông Nam Bộ & ĐBSCL)",
    color: "#0f766e",
    type: "natural",
    provinceCodes: ["VN75", "VN79", "VN80", "VN82", "VN86", "VN91", "VN92", "VN96"],
  },
];

// Bảng màu phân biệt 34 tỉnh trong chế độ Hành chính
export const PROVINCE_PALETTE: string[] = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4",
  "#84cc16", "#f97316", "#6366f1", "#14b8a6", "#eab308", "#a855f7",
  "#0284c7", "#059669", "#d97706", "#7c3aed", "#db2777", "#0891b2",
  "#65a30d", "#ea580c", "#4f46e5", "#0d9488", "#ca8a04", "#9333ea",
  "#2563eb", "#16a34a", "#b45309", "#6d28d9", "#be185d", "#0e7490",
  "#4d7c0f", "#c2410c", "#4338ca", "#047857"
];
