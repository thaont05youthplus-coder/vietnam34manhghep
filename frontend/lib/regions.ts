import { RegionDefinition } from "@/types/geo";

// 6 Vùng Kinh tế - Xã hội theo Nghị quyết số 306/NQ-CP của Chính phủ về Quy hoạch tổng thể quốc gia
export const ECONOMIC_REGIONS: RegionDefinition[] = [
  {
    id: "kt_trung_du_mien_nui_phia_bac",
    name: "Trung du & Miền núi Bắc Bộ",
    subtitle: "Vùng sinh thái xanh, liên kết giao thương quốc tế & kinh tế cửa khẩu",
    description: "Theo Nghị quyết 306/NQ-CP: Tập trung phát triển xanh, bền vững và toàn diện; là trung tâm kết nối giao thương giữa ASEAN với Trung Quốc và châu Âu; phát triển mạnh kinh tế cửa khẩu, du lịch sinh thái - văn hóa và công nghiệp chế biến khoáng sản, nông lâm sản.",
    dynamicZone: "Hành lang kinh tế Lào Cai - Hà Nội - Hải Phòng - Quảng Ninh",
    growthCorridors: ["Hành lang kinh tế Bắc - Nam", "Hành lang kinh tế Lào Cai - Hà Nội - Hải Phòng - Quảng Ninh"],
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=400&q=80",
    color: "#059669", // Xanh ngọc lục bảo
    type: "economic",
    provinceCodes: ["VN04", "VN08", "VN11", "VN12", "VN14", "VN15", "VN19", "VN20", "VN22", "VN25"],
  },
  {
    id: "kt_dong_bang_song_hong",
    name: "Đồng bằng sông Hồng",
    subtitle: "Đầu tàu chuyển đổi số, đổi mới sáng tạo, công nghệ cao & dịch vụ hiện đại",
    description: "Theo Nghị quyết 306/NQ-CP: Vùng động lực phía Bắc với tam giác tăng trưởng Hà Nội - Hải Phòng - Quảng Ninh; đi đầu trong chuyển đổi số, đổi mới sáng tạo, công nghiệp công nghệ cao, dịch vụ chất lượng cao, giáo dục - đào tạo và y tế chuyên sâu.",
    dynamicZone: "Tam giác tăng trưởng Hà Nội - Hải Phòng - Quảng Ninh (Vùng động lực phía Bắc)",
    growthCorridors: ["Hành lang kinh tế Bắc - Nam", "Hành lang kinh tế ven biển vịnh Bắc Bộ"],
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80",
    color: "#2563eb", // Xanh dương
    type: "economic",
    provinceCodes: ["VN01", "VN24", "VN31", "VN33", "VN37"],
  },
  {
    id: "kt_bac_trung_bo_duyen_hai_mien_trung",
    name: "Bắc Trung Bộ & Duyên hải",
    subtitle: "Dải kinh tế biển, cảng nước sâu, năng lượng sạch & cực tăng trưởng mới",
    description: "Theo Nghị quyết 306/NQ-CP: Phát triển mạnh kinh tế biển (hệ thống cảng biển, logistics, du lịch biển đảo, nuôi trồng chế biến hải sản), năng lượng tái tạo, đô thị - công nghiệp ven biển; phát triển cực tăng trưởng Đà Nẵng - Quảng Nam - Quảng Ngãi và hình thành vùng động lực mới tại Khánh Hòa - Lâm Đồng.",
    dynamicZone: "Cực tăng trưởng Đà Nẵng - Quảng Ngãi & Vùng động lực mới Khánh Hòa - Lâm Đồng",
    growthCorridors: ["Hành lang kinh tế Bắc - Nam", "Hành lang kinh tế Đông - Tây (Lao Bảo - Đà Nẵng)"],
    imageUrl: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=400&q=80",
    color: "#d97706", // Cam hổ phách
    type: "economic",
    provinceCodes: ["VN38", "VN40", "VN42", "VN44", "VN46", "VN48", "VN51", "VN56"],
  },
  {
    id: "kt_tay_nguyen",
    name: "Tây Nguyên",
    subtitle: "Vùng nông nghiệp công nghệ cao, lâm nghiệp bền vững & năng lượng tái tạo",
    description: "Theo Nghị quyết 306/NQ-CP: Phát triển kinh tế xanh, bảo vệ an ninh nguồn nước và hệ sinh thái rừng; trung tâm sản xuất cây công nghiệp chủ lực, chế biến nông - lâm sản công nghệ cao, du lịch văn hóa cồng chiêng; liên kết chặt chẽ với duyên hải miền Trung qua trục Khánh Hòa - Lâm Đồng.",
    dynamicZone: "Vùng động lực liên kết Khánh Hòa - Lâm Đồng và phụ cận",
    growthCorridors: ["Hành lang kinh tế Tây Nguyên - Duyên hải miền Trung (Quốc lộ 19, 26, 27)"],
    imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=400&q=80",
    color: "#7c3aed", // Tím
    type: "economic",
    provinceCodes: ["VN52", "VN66", "VN68"],
  },
  {
    id: "kt_dong_nam_bo",
    name: "Đông Nam Bộ",
    subtitle: "Trung tâm kinh tế, tài chính quốc tế, công nghệ cao & bán dẫn",
    description: "Theo Nghị quyết 306/NQ-CP: Vùng động lực kinh tế lớn nhất cả nước; cực tăng trưởng TP. Hồ Chí Minh; đi đầu trong chuyển đổi mô hình tăng trưởng, kinh tế số, kinh tế tuần hoàn, công nghệ cao, vi mạch bán dẫn và trung tâm tài chính quốc tế.",
    dynamicZone: "Vùng động lực phía Nam (TP. Hồ Chí Minh - Bình Dương - Đồng Nai - Bà Rịa Vũng Tàu)",
    growthCorridors: ["Hành lang kinh tế Bắc - Nam", "Hành lang Mộc Bài - TP. Hồ Chí Minh - Vũng Tàu"],
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=400&q=80",
    color: "#ea580c", // Cam đất ấm áp (Terracotta), không gây cảm giác cảnh báo
    type: "economic",
    provinceCodes: ["VN75", "VN79", "VN80"],
  },
  {
    id: "kt_dong_bang_song_cuu_long",
    name: "Đồng bằng sông Cửu Long",
    subtitle: "Trung tâm sản xuất, xuất khẩu nông thủy sản & chủ động thích ứng BĐKH",
    description: "Theo Nghị quyết 306/NQ-CP: Trung tâm sản xuất nông nghiệp, thủy sản bảo đảm an ninh lương thực quốc gia và xuất khẩu toàn cầu; kinh tế biển, hành lang kinh tế ven biển, logistics nông nghiệp; chủ động thích ứng biến đổi khí hậu và nước biển dâng.",
    dynamicZone: "Cực tăng trưởng Cần Thơ và vùng đô thị sông nước sinh thái",
    growthCorridors: ["Hành lang kinh tế Bắc - Nam (trục Cần Thơ - Cà Mau)", "Hành lang kinh tế ven biển Tây Nam"],
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
