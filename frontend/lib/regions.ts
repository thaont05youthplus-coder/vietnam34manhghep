import { RegionDefinition } from "@/types/geo";

// 6 Vùng Kinh tế - Xã hội theo Nghị quyết và Spec VN34MG
export const ECONOMIC_REGIONS: RegionDefinition[] = [
  {
    id: "kt_trung_du_mien_nui_phia_bac",
    name: "Trung du & Miền núi Bắc Bộ",
    subtitle: "Địa hình cao nguyên & khoáng sản",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
    color: "#059669", // Xanh ngọc lục bảo
    type: "economic",
    provinceCodes: ["VN04", "VN08", "VN11", "VN12", "VN14", "VN15", "VN19", "VN20", "VN22", "VN25"],
  },
  {
    id: "kt_dong_bang_song_hong",
    name: "Đồng bằng sông Hồng",
    subtitle: "Cội nguồn văn minh châu thổ",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80",
    color: "#2563eb", // Xanh dương
    type: "economic",
    provinceCodes: ["VN01", "VN24", "VN31", "VN33", "VN37"],
  },
  {
    id: "kt_bac_trung_bo_duyen_hai_mien_trung",
    name: "Bắc Trung Bộ & Duyên hải",
    subtitle: "Dải đất ven biển & cảng biển",
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=400&q=80",
    color: "#d97706", // Cam hổ phách
    type: "economic",
    provinceCodes: ["VN38", "VN40", "VN42", "VN44", "VN46", "VN48", "VN51", "VN56"],
  },
  {
    id: "kt_tay_nguyen",
    name: "Tây Nguyên",
    subtitle: "Đất đỏ badan & cây công nghiệp",
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80",
    color: "#7c3aed", // Tím
    type: "economic",
    provinceCodes: ["VN52", "VN66", "VN68"],
  },
  {
    id: "kt_dong_nam_bo",
    name: "Đông Nam Bộ",
    subtitle: "Động lực kinh tế & đô thị hóa",
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=400&q=80",
    color: "#dc2626", // Đỏ gạch
    type: "economic",
    provinceCodes: ["VN75", "VN79", "VN80"],
  },
  {
    id: "kt_dong_bang_song_cuu_long",
    name: "Đồng bằng sông Cửu Long",
    subtitle: "Vựa lúa miền Tây & thủy sản",
    imageUrl: "https://images.unsplash.com/photo-1579618218290-25a2e5d1e7c5?auto=format&fit=crop&w=400&q=80",
    color: "#0d9488", // Xanh lam mòng két
    type: "economic",
    provinceCodes: ["VN82", "VN86", "VN91", "VN92", "VN96"],
  },
];

// 7 Khu vực Tự nhiên theo Địa lí tự nhiên Việt Nam
export const NATURAL_REGIONS: RegionDefinition[] = [
  {
    id: "tn_dong_bac_bo",
    name: "Đông Bắc Bộ",
    subtitle: "Vịnh Hạ Long & vùng núi cánh cung",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    color: "#15803d",
    type: "natural",
    provinceCodes: ["VN04", "VN08", "VN19", "VN20", "VN22", "VN25"],
  },
  {
    id: "tn_tay_bac_bo",
    name: "Tây Bắc Bộ",
    subtitle: "Hoàng Liên Sơn & nóc nhà Fansipan",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
    color: "#4d7c0f",
    type: "natural",
    provinceCodes: ["VN11", "VN12", "VN14", "VN15"],
  },
  {
    id: "tn_dong_bang_song_hong",
    name: "Đồng bằng sông Hồng",
    subtitle: "Châu thổ màu mỡ sông Hồng - Thái Bình",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80",
    color: "#1d4ed8",
    type: "natural",
    provinceCodes: ["VN01", "VN24", "VN31", "VN33", "VN37"],
  },
  {
    id: "tn_bac_trung_bo",
    name: "Bắc Trung Bộ",
    subtitle: "Dải Trường Sơn Bắc & di sản Phong Nha",
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=400&q=80",
    color: "#ea580c",
    type: "natural",
    provinceCodes: ["VN38", "VN40", "VN42", "VN44", "VN46"],
  },
  {
    id: "tn_duyen_hai_nam_trung_bo",
    name: "Duyên hải Nam Trung Bộ",
    subtitle: "Vịnh nước sâu, bán đảo & hải đảo",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    color: "#f59e0b",
    type: "natural",
    provinceCodes: ["VN48", "VN51", "VN56"],
  },
  {
    id: "tn_tay_nguyen",
    name: "Tây Nguyên",
    subtitle: "Các cao nguyên xếp tầng màu mỡ",
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80",
    color: "#6b21a8",
    type: "natural",
    provinceCodes: ["VN52", "VN66", "VN68"],
  },
  {
    id: "tn_nam_bo",
    name: "Nam Bộ",
    subtitle: "Đồng bằng phù sa sông Cửu Long & biển Tây",
    imageUrl: "https://images.unsplash.com/photo-1579618218290-25a2e5d1e7c5?auto=format&fit=crop&w=400&q=80",
    color: "#0f766e",
    type: "natural",
    provinceCodes: ["VN75", "VN79", "VN80", "VN82", "VN86", "VN91", "VN92", "VN96"],
  },
];

// 34 Màu phân biệt sắc thái cho chế độ Hành chính
export const PROVINCE_PALETTE = [
  "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4",
  "#84cc16", "#f97316", "#6366f1", "#14b8a6", "#eab308", "#a855f7",
  "#0284c7", "#059669", "#d97706", "#7c3aed", "#db2777", "#0891b2",
  "#65a30d", "#ea580c", "#4f46e5", "#0d9488", "#ca8a04", "#9333ea",
  "#2563eb", "#16a34a", "#b45309", "#6d28d9", "#be185d", "#0e7490",
  "#4d7c0f", "#c2410c", "#4338ca", "#047857"
];
