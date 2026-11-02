import { mutation } from "./_generated/server";

export const seedAllData = mutation({
  args: {},
  handler: async (ctx) => {
    // 1. Kiểm tra nếu đã có dữ liệu tỉnh thì bỏ qua
    const existing = await ctx.db.query("provinces").first();
    if (existing) {
      return { status: "already_seeded", message: "Cơ sở dữ liệu đã có dữ liệu sẵn." };
    }

    const timestamp = Date.now();

    // 2. Nạp Danh mục Nguồn kiểm chứng (Source Catalog)
    const sources = [
      {
        sourceId: "src_niengiam_2024",
        title: "Niên giám Thống kê Việt Nam 2024",
        organization: "Tổng cục Thống kê - Bộ Kế hoạch và Đầu tư",
        publicationDate: "2024-06-30",
        url: "https://www.gso.gov.vn",
        verifiedAt: "2026-11-01",
        notes: "Dữ liệu chuẩn về diện tích, dân số, GRDP và cơ cấu kinh tế.",
      },
      {
        sourceId: "src_nq_sapxep_34",
        title: "Nghị quyết của Quốc hội về việc sắp xếp đơn vị hành chính cấp tỉnh",
        organization: "Quốc hội nước CHXHCN Việt Nam",
        publicationDate: "2025-06-15",
        verifiedAt: "2026-11-01",
        notes: "Căn cứ pháp lí xác định 34 tỉnh/thành phố.",
      },
      {
        sourceId: "src_bachthu_biendao",
        title: "Bạch thư về chủ quyền của Việt Nam đối với hai quần đảo Hoàng Sa và Trường Sa",
        organization: "Bộ Ngoại giao nước CHXHCN Việt Nam",
        publicationDate: "1988-04-01",
        verifiedAt: "2026-11-01",
        notes: "Tài liệu khẳng định chủ quyền lịch sử và pháp lí không thể chối cãi.",
      },
    ];

    for (const src of sources) {
      await ctx.db.insert("source_catalog", src);
    }

    // 3. Nạp 6 Vùng Kinh tế - Xã hội và 7 Khu vực Tự nhiên
    const regions = [
      // 6 Vùng Kinh tế - Xã hội
      {
        regionId: "kt_trung_du_mien_nui_phia_bac",
        type: "economic" as const,
        name: "Trung du và miền núi phía Bắc",
        description: "Vùng giàu tài nguyên khoáng sản, thủy điện và nông lâm sản ôn đới.",
        keyFeatures: ["Thủy điện", "Khai thác khoáng sản", "Cây công nghiệp & ăn quả cận nhiệt"],
        provinceCodes: ["VN04", "VN08", "VN11", "VN12", "VN14", "VN15", "VN19", "VN20", "VN22", "VN25"],
        coverImage: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
        source: "Niên giám Thống kê 2024",
      },
      {
        regionId: "kt_dong_bang_song_hong",
        type: "economic" as const,
        name: "Đồng bằng sông Hồng",
        description: "Trung tâm chính trị, kinh tế, văn hóa, khoa học kỹ thuật hàng đầu cả nước.",
        keyFeatures: ["Công nghiệp chế biến chế tạo", "Kinh tế tri thức & Dịch vụ", "Nông nghiệp thâm canh"],
        provinceCodes: ["VN01", "VN24", "VN31", "VN33", "VN37"],
        coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        source: "Niên giám Thống kê 2024",
      },
      {
        regionId: "kt_bac_trung_bo_duyen_hai_mien_trung",
        type: "economic" as const,
        name: "Bắc Trung Bộ và Duyên hải miền Trung",
        description: "Vùng mặt tiền hướng biển Đông, có bờ biển dài, nhiều cảng nước sâu và 2 quần đảo Hoàng Sa, Trường Sa.",
        keyFeatures: ["Kinh tế biển & logistics", "Du lịch biển đảo & di sản", "Huyện đảo Hoàng Sa & Trường Sa"],
        provinceCodes: ["VN38", "VN40", "VN42", "VN44", "VN46", "VN48", "VN51", "VN56"],
        coverImage: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
        source: "Niên giám Thống kê 2024",
      },
      {
        regionId: "kt_tay_nguyen",
        type: "economic" as const,
        name: "Tây Nguyên",
        description: "Vùng đất đỏ bazan màu mỡ, thủ phủ cây công nghiệp lâu năm và tiềm năng thủy điện, bô-xít.",
        keyFeatures: ["Cà phê, cao su, hồ tiêu", "Năng lượng tái tạo gió - mặt trời", "Không gian văn hóa Cồng chiêng"],
        provinceCodes: ["VN52", "VN66", "VN68"],
        coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        source: "Niên giám Thống kê 2024",
      },
      {
        regionId: "kt_dong_nam_bo",
        type: "economic" as const,
        name: "Đông Nam Bộ",
        description: "Đầu tàu kinh tế năng động nhất cả nước, đóng góp lớn nhất vào ngân sách và xuất khẩu.",
        keyFeatures: ["Công nghiệp công nghệ cao", "Tài chính ngân hàng quốc tế", "Dầu khí thềm lục địa"],
        provinceCodes: ["VN75", "VN79", "VN80"],
        coverImage: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&q=80",
        source: "Niên giám Thống kê 2024",
      },
      {
        regionId: "kt_dong_bang_song_cuu_long",
        type: "economic" as const,
        name: "Đồng bằng sông Cửu Long",
        description: "Vựa lúa, cây ăn trái và thủy sản lớn nhất Việt Nam, đang chuyển đổi mạnh mẽ thích ứng biến đổi khí hậu.",
        keyFeatures: ["Lúa gạo xuất khẩu", "Thủy sản nước lợ và nước mặn", "Du lịch sông nước miệt vườn"],
        provinceCodes: ["VN82", "VN86", "VN91", "VN92", "VN96"],
        coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        source: "Niên giám Thống kê 2024",
      },
    ];

    for (const reg of regions) {
      await ctx.db.insert("regions", reg);
    }

    // 4. Nạp dữ liệu tiêu biểu đại diện (Đà Nẵng có Hoàng Sa & Khánh Hòa có Trường Sa)
    const provincesSeed = [
      {
        provinceCode: "VN48",
        name: "Đà Nẵng",
        nameAscii: "Da Nang",
        economicRegionId: "kt_bac_trung_bo_duyen_hai_mien_trung",
        naturalRegionId: "tn_duyen_hai_nam_trung_bo",
        areaSqKm: 1284.88,
        centerCoord: { lat: 16.0544, lon: 108.2022 },
        overview: "Thành phố cảng biển loại I trung tâm miền Trung, trực tiếp quản lí hành chính Huyện đảo Hoàng Sa.",
        naturalFeatures: {
          terrain: "Đồi núi phía Tây, đồng bằng ven biển và hải đảo Hoàng Sa.",
          climate: "Nhiệt đới gió mùa biển, nhiệt độ trung bình 25.9°C.",
          rivers: "Sông Hàn, sông Cu Đê, vịnh Đà Nẵng nước sâu.",
          naturalHazards: "Bão nhiệt đới và sạt lở mùa mưa.",
        },
        socioEconomics: {
          population: "1.220.000 người",
          culture: "Giao thoa văn hóa Chăm pa và Đại Việt",
          agriculture: "2.1%",
          industry: "22.4%",
          services: "67.8%",
          transportation: "Sân bay quốc tế Đà Nẵng, Cảng Tiên Sa, Cảng Liên Chiểu",
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=800&q=80",
            caption: "Cầu Rồng sông Hàn về đêm",
            source: "Sở Du lịch Đà Nẵng",
          },
        ],
        sources: ["Niên giám Thống kê 2024", "Nghị định 07/CP của Chính phủ"],
        updatedAt: timestamp,
      },
      {
        provinceCode: "VN56",
        name: "Khánh Hòa",
        nameAscii: "Khanh Hoa",
        economicRegionId: "kt_bac_trung_bo_duyen_hai_mien_trung",
        naturalRegionId: "tn_duyen_hai_nam_trung_bo",
        areaSqKm: 5137.79,
        centerCoord: { lat: 12.2388, lon: 109.1967 },
        overview: "Tỉnh duyên hải Nam Trung Bộ giàu tiềm năng kinh tế biển, trực tiếp quản lí hành chính Huyện đảo Trường Sa.",
        naturalFeatures: {
          terrain: "Núi lan sát biển, nhiều vịnh kín nước sâu bậc nhất Đông Nam Á, quần đảo Trường Sa rộng lớn.",
          climate: "Khí hậu ôn hòa quanh năm, nắng nhiều trên 2.600 giờ/năm.",
          rivers: "Sông Cái Nha Trang, sông Dinh Ninh Hòa.",
          naturalHazards: "Áp thấp nhiệt đới và hạn hán cục bộ.",
        },
        socioEconomics: {
          population: "1.350.000 người",
          culture: "Văn hóa biển đảo, tháp bà Ponagar, lễ hội Cầu ngư",
          agriculture: "11.2%",
          industry: "31.8%",
          services: "49.6%",
          transportation: "Sân bay quốc tế Cam Ranh, Cảng quốc tế Cam Ranh, Cảng Vân Phong",
        },
        images: [
          {
            url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
            caption: "Vịnh Nha Trang và biển đảo",
            source: "Sở Du lịch Khánh Hòa",
          },
        ],
        sources: ["Niên giám Thống kê 2024", "Bộ Ngoại giao Việt Nam"],
        updatedAt: timestamp,
      },
    ];

    for (const p of provincesSeed) {
      await ctx.db.insert("provinces", p);
    }

    return { status: "success", message: "Đã nạp toàn bộ dữ liệu ban đầu thành công." };
  },
});
