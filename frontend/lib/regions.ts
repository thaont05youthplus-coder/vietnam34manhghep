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

// Bảng màu phân biệt sắc thái chuẩn Bản đồ Hành chính Việt Nam (SGK Địa lí & Atlas Quốc gia - Phụ lục C)
// Sử dụng các tông màu pastel thanh nhã, dịu mắt chuẩn quy ước kỹ thuật quốc gia:
// Tím nhạt, Vàng chanh, Xanh lá non, Hồng phấn, Xanh ngọc biển, Cam đào, Lam nhạt
export const ADMIN_PROVINCE_COLORS: Record<string, string> = {
  // Miền Bắc (Chuẩn SGK Địa lí theo bản chụp mẫu Phụ lục C)
  VN08: "#f3e8ff", // Tuyên Quang - Tím pastel
  VN04: "#fbcfe8", // Cao Bằng - Hồng phấn pastel
  VN12: "#bbf7d0", // Lai Châu - Xanh lá non pastel
  VN15: "#fef08a", // Lào Cai - Vàng chanh pastel
  VN19: "#bbf7d0", // Thái Nguyên - Xanh lá pastel
  VN11: "#bbf7d0", // Điện Biên - Xanh lá non pastel
  VN20: "#dbeafe", // Lạng Sơn - Lam phấn pastel
  VN14: "#f3e8ff", // Sơn La - Tím pastel
  VN25: "#cffafe", // Phú Thọ - Xanh ngọc pastel
  VN24: "#bbf7d0", // Bắc Ninh - Xanh lá non pastel
  VN22: "#fef08a", // Quảng Ninh - Vàng chanh pastel
  VN01: "#fbcfe8", // TP. Hà Nội - Hồng phấn pastel
  VN31: "#fed7aa", // TP. Hải Phòng - Cam đào pastel
  VN33: "#fbcfe8", // Hưng Yên - Hồng phấn pastel
  VN37: "#fef08a", // Ninh Bình - Vàng chanh pastel
  VN38: "#f3e8ff", // Thanh Hóa - Tím pastel

  // Miền Trung & Tây Nguyên
  VN40: "#bbf7d0", // Nghệ An - Xanh lá non pastel
  VN42: "#fef08a", // Hà Tĩnh - Vàng chanh pastel
  VN44: "#fbcfe8", // Quảng Trị - Hồng phấn pastel
  VN46: "#f3e8ff", // Huế - Tím pastel
  VN48: "#cffafe", // Đà Nẵng - Xanh ngọc pastel
  VN51: "#fef08a", // Quảng Ngãi - Vàng chanh pastel
  VN52: "#bbf7d0", // Gia Lai - Xanh lá pastel
  VN56: "#dbeafe", // Khánh Hòa - Lam phấn pastel
  VN66: "#fed7aa", // Đắk Lắk - Cam đào pastel
  VN68: "#f3e8ff", // Lâm Đồng - Tím pastel

  // Miền Nam (Đông Nam Bộ & ĐBSCL)
  VN75: "#fef08a", // Đồng Nai - Vàng chanh pastel
  VN79: "#fbcfe8", // TP. Hồ Chí Minh - Hồng phấn pastel
  VN80: "#bbf7d0", // Tây Ninh - Xanh lá pastel
  VN82: "#f3e8ff", // Đồng Tháp - Tím pastel
  VN86: "#cffafe", // Vĩnh Long - Xanh ngọc pastel
  VN91: "#fef08a", // An Giang - Vàng chanh pastel
  VN92: "#fed7aa", // Cần Thơ - Cam đào pastel
  VN96: "#bbf7d0", // Cà Mau - Xanh lá pastel
};

// Bảng màu dự phòng phân tầng hài hòa chuẩn Atlas giáo khoa
export const PROVINCE_PALETTE = [
  "#f3e8ff", "#fef08a", "#bbf7d0", "#fbcfe8", "#cffafe", "#fed7aa", "#dbeafe",
  "#e9d5ff", "#fef9c3", "#dcfce7", "#fce7f3", "#bae6fd", "#ffedd5", "#e0e7ff",
  "#ede9fe", "#fef08a", "#bbf7d0", "#fbcfe8", "#cffafe", "#fed7aa", "#dbeafe",
  "#f5d0fe", "#fef9c3", "#dcfce7", "#fce7f3", "#bae6fd", "#ffedd5", "#e0e7ff",
  "#ede9fe", "#fef08a", "#bbf7d0", "#fbcfe8", "#cffafe", "#fed7aa"
];
