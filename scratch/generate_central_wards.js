const fs = require("fs");
const path = require("path");

const wards = [
  // --- THỦ ĐÔ HÀ NỘI (VN01) ---
  {
    id: "ward_hn_01",
    name: "Phường Hoàn Kiếm",
    district: "Quận Hoàn Kiếm",
    provinceCode: "VN01",
    provinceName: "Hà Nội",
    type: "Phường",
    role: "Trung tâm văn hóa, lịch sử và không gian đi bộ Hồ Hoàn Kiếm",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.8524,
    lat: 21.0285
  },
  {
    id: "ward_hn_02",
    name: "Phường Điện Biên",
    district: "Quận Ba Đình",
    provinceCode: "VN01",
    provinceName: "Hà Nội",
    type: "Phường",
    role: "Trung tâm chính trị quốc gia, Quảng trường Ba Đình & Tòa nhà Quốc hội",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.8365,
    lat: 21.0345
  },
  {
    id: "ward_hn_03",
    name: "Phường Tràng Tiền",
    district: "Quận Hoàn Kiếm",
    provinceCode: "VN01",
    provinceName: "Hà Nội",
    type: "Phường",
    role: "Trung tâm ngoại giao, nghệ thuật, Nhà hát Lớn Hà Nội",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.8570,
    lat: 21.0245
  },
  {
    id: "ward_hn_04",
    name: "Phường Mỹ Đình 1",
    district: "Quận Nam Từ Liêm",
    provinceCode: "VN01",
    provinceName: "Hà Nội",
    type: "Phường",
    role: "Trung tâm thể thao quốc gia Mỹ Đình & trung tâm hội nghị quốc tế",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.7725,
    lat: 21.0210
  },

  // --- TP. HỒ CHÍ MINH (VN79) ---
  {
    id: "ward_hcm_01",
    name: "Phường Bến Nghé",
    district: "Quận 1",
    provinceCode: "VN79",
    provinceName: "TP. Hồ Chí Minh",
    type: "Phường",
    role: "Trung tâm tài chính - ngoại giao, Phố đi bộ Nguyễn Huệ & UBND Thành phố",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.7025,
    lat: 10.7765
  },
  {
    id: "ward_hcm_02",
    name: "Phường Bến Thành",
    district: "Quận 1",
    provinceCode: "VN79",
    provinceName: "TP. Hồ Chí Minh",
    type: "Phường",
    role: "Biểu tượng giao thương Chợ Bến Thành & ga ngầm Metro số 1",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.6980,
    lat: 10.7720
  },
  {
    id: "ward_hcm_03",
    name: "Phường An Phú",
    district: "TP. Thủ Đức",
    provinceCode: "VN79",
    provinceName: "TP. Hồ Chí Minh",
    type: "Phường",
    role: "Trung tâm đô thị sáng tạo, công nghệ cao & tài chính mới phía Đông",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.7450,
    lat: 10.8010
  },
  {
    id: "ward_hcm_04",
    name: "Phường Tân Phú",
    district: "Quận 7",
    provinceCode: "VN79",
    provinceName: "TP. Hồ Chí Minh",
    type: "Phường",
    role: "Trung tâm đô thị quốc tế Phú Mỹ Hưng, hội chợ triển lãm SECC",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.7195,
    lat: 10.7305
  },

  // --- TP. ĐÀ NẴNG (VN48) & QUẦN ĐẢO HOÀNG SA ---
  {
    id: "ward_dn_01",
    name: "Phường Hải Châu 1",
    district: "Quận Hải Châu",
    provinceCode: "VN48",
    provinceName: "Đà Nẵng",
    type: "Phường",
    role: "Trung tâm hành chính TP. Đà Nẵng, ven sông Hàn & cầu Rồng",
    isUrbanCenter: true,
    isIsland: false,
    lon: 108.2230,
    lat: 16.0680
  },
  {
    id: "ward_dn_02",
    name: "Phường Thạch Thang",
    district: "Quận Hải Châu",
    provinceCode: "VN48",
    provinceName: "Đà Nẵng",
    type: "Phường",
    role: "Tòa nhà Trung tâm Hành chính tập trung và hệ thống cơ quan chỉ đạo thành phố",
    isUrbanCenter: true,
    isIsland: false,
    lon: 108.2185,
    lat: 16.0740
  },
  {
    id: "ward_dn_03",
    name: "Phường An Hải Bắc",
    district: "Quận Sơn Trà",
    provinceCode: "VN48",
    provinceName: "Đà Nẵng",
    type: "Phường",
    role: "Trung tâm du lịch biển bán đảo Sơn Trà & bờ Đông vịnh Đà Nẵng",
    isUrbanCenter: true,
    isIsland: false,
    lon: 108.2370,
    lat: 16.0650
  },
  {
    id: "ward_dn_hs",
    name: "Xã đảo Hoàng Sa",
    district: "Huyện Hoàng Sa",
    provinceCode: "VN48",
    provinceName: "Đà Nẵng",
    type: "Xã đảo",
    role: "Đơn vị hành chính khẳng định chủ quyền biển đảo thiêng liêng toàn vẹn của Việt Nam",
    isUrbanCenter: false,
    isIsland: true,
    lon: 112.3330,
    lat: 16.5330
  },

  // --- TỈNH KHÁNH HÒA (VN56) & QUẦN ĐẢO TRƯỜNG SA ---
  {
    id: "ward_kh_01",
    name: "Phường Lộc Thọ",
    district: "TP. Nha Trang",
    provinceCode: "VN56",
    provinceName: "Khánh Hòa",
    type: "Phường",
    role: "Trung tâm du lịch vịnh Nha Trang, Quảng trường 2/4 và phố ven biển Trần Phú",
    isUrbanCenter: true,
    isIsland: false,
    lon: 109.1960,
    lat: 12.2390
  },
  {
    id: "ward_kh_02",
    name: "Phường Xương Huân",
    district: "TP. Nha Trang",
    provinceCode: "VN56",
    provinceName: "Khánh Hòa",
    type: "Phường",
    role: "Khu đô thị cổ ven sông Cái & Chợ Đầm lịch sử",
    isUrbanCenter: true,
    isIsland: false,
    lon: 109.1940,
    lat: 12.2530
  },
  {
    id: "ward_kh_03",
    name: "Phường Cam Lộc",
    district: "TP. Cam Ranh",
    provinceCode: "VN56",
    provinceName: "Khánh Hòa",
    type: "Phường",
    role: "Trung tâm vịnh Cam Ranh & khu công nghiệp cảng biển quân sự - dân sự",
    isUrbanCenter: true,
    isIsland: false,
    lon: 109.1350,
    lat: 11.9160
  },
  {
    id: "ward_kh_ts_01",
    name: "Thị trấn Trường Sa",
    district: "Huyện Trường Sa",
    provinceCode: "VN56",
    provinceName: "Khánh Hòa",
    type: "Thị trấn đảo",
    role: "Thủ phủ huyện đảo Trường Sa, trung tâm chính trị văn hóa nơi đầu sóng ngọn gió",
    isUrbanCenter: false,
    isIsland: true,
    lon: 111.9190,
    lat: 8.6440
  },
  {
    id: "ward_kh_ts_02",
    name: "Xã Song Tử Tây",
    district: "Huyện Trường Sa",
    provinceCode: "VN56",
    provinceName: "Khánh Hòa",
    type: "Xã đảo",
    role: "Xã đảo tiền tiêu cực Bắc quần đảo Trường Sa, ngọn hải đăng chỉ đường quốc tế",
    isUrbanCenter: false,
    isIsland: true,
    lon: 114.3320,
    lat: 11.4280
  },
  {
    id: "ward_kh_ts_03",
    name: "Xã Sinh Tồn",
    district: "Huyện Trường Sa",
    provinceCode: "VN56",
    provinceName: "Khánh Hòa",
    type: "Xã đảo",
    role: "Xã đảo kiên cường giữa Biển Đông, lá chắn vững chắc bảo vệ vùng trời vùng biển",
    isUrbanCenter: false,
    isIsland: true,
    lon: 114.3210,
    lat: 9.8850
  },

  // --- TP. HẢI PHÒNG (VN31) ---
  {
    id: "ward_hp_01",
    name: "Phường Hoàng Văn Thụ",
    district: "Quận Hồng Bàng",
    provinceCode: "VN31",
    provinceName: "Hải Phòng",
    type: "Phường",
    role: "Trung tâm hành chính cổ kính, Nhà hát Lớn Hải Phòng & dải vườn hoa trung tâm",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.6800,
    lat: 20.8620
  },
  {
    id: "ward_hp_02",
    name: "Phường Đông Khê",
    district: "Quận Ngô Quyền",
    provinceCode: "VN31",
    provinceName: "Hải Phòng",
    type: "Phường",
    role: "Trung tâm đô thị mới phía Đông & trục giao thông hướng ra Cảng Đình Vũ",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.6980,
    lat: 20.8490
  },
  {
    id: "ward_hp_03",
    name: "Thị trấn Cát Bà",
    district: "Huyện Cát Hải",
    provinceCode: "VN31",
    provinceName: "Hải Phòng",
    type: "Thị trấn đảo",
    role: "Trung tâm Khu dự trữ sinh quyển thế giới và di sản thiên nhiên Quần đảo Cát Bà",
    isUrbanCenter: false,
    isIsland: true,
    lon: 107.0500,
    lat: 20.7250
  },

  // --- TP. HUẾ (VN46) ---
  {
    id: "ward_hue_01",
    name: "Phường Vĩnh Ninh",
    district: "TP. Huế",
    provinceCode: "VN46",
    provinceName: "Huế",
    type: "Phường",
    role: "Trung tâm hành chính mới, bệnh viện TW Huế & bờ Nam sông Hương",
    isUrbanCenter: true,
    isIsland: false,
    lon: 107.5850,
    lat: 16.4600
  },
  {
    id: "ward_hue_02",
    name: "Phường Thuận Lộc",
    district: "TP. Huế",
    provinceCode: "VN46",
    provinceName: "Huế",
    type: "Phường",
    role: "Trung tâm Đại Nội Kinh thành Huế di sản văn hóa thế giới UNESCO",
    isUrbanCenter: true,
    isIsland: false,
    lon: 107.5780,
    lat: 16.4740
  },
  {
    id: "ward_hue_03",
    name: "Phường Phú Hội",
    district: "TP. Huế",
    provinceCode: "VN46",
    provinceName: "Huế",
    type: "Phường",
    role: "Trung tâm dịch vụ du lịch, phố đi bộ đêm Chu Văn An - Võ Thị Sáu",
    isUrbanCenter: true,
    isIsland: false,
    lon: 107.5950,
    lat: 16.4660
  },

  // --- TP. CẦN THƠ (VN92) ---
  {
    id: "ward_ct_01",
    name: "Phường Tân An",
    district: "Quận Ninh Kiều",
    provinceCode: "VN92",
    provinceName: "Cần Thơ",
    type: "Phường",
    role: "Tượng đài Bác Hồ Bến Ninh Kiều, trái tim du lịch đô thị sông nước Miền Tây",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.7860,
    lat: 10.0340
  },
  {
    id: "ward_ct_02",
    name: "Phường An Cư",
    district: "Quận Ninh Kiều",
    provinceCode: "VN92",
    provinceName: "Cần Thơ",
    type: "Phường",
    role: "Trung tâm hành chính quận Ninh Kiều và khu dân cư sầm uất ven hồ Xáng Thổi",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.7800,
    lat: 10.0380
  },
  {
    id: "ward_ct_03",
    name: "Phường Lê Bình",
    district: "Quận Cái Răng",
    provinceCode: "VN92",
    provinceName: "Cần Thơ",
    type: "Phường",
    role: "Di sản Chợ nổi Cái Răng, trung tâm thương mại lúa gạo và trái cây Nam Bộ",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.7560,
    lat: 10.0020
  },

  // --- AN GIANG (VN91) ---
  {
    id: "ward_ag_01",
    name: "Phường Mỹ Long",
    district: "TP. Long Xuyên",
    provinceCode: "VN91",
    provinceName: "An Giang",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh lỵ An Giang, chợ Long Xuyên bên bờ sông Hậu",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.4380,
    lat: 10.3830
  },
  {
    id: "ward_ag_02",
    name: "Phường Châu Phú A",
    district: "TP. Châu Đốc",
    provinceCode: "VN91",
    provinceName: "An Giang",
    type: "Phường",
    role: "Trung tâm du lịch tâm linh Núi Sam & ngã ba sông Châu Đốc",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.1150,
    lat: 10.7020
  },

  // --- BẮC NINH (VN24) ---
  {
    id: "ward_bn_01",
    name: "Phường Suối Hoa",
    district: "TP. Bắc Ninh",
    provinceCode: "VN24",
    provinceName: "Bắc Ninh",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh Bắc Ninh, quảng trường Trung tâm Văn hóa Kinh Bắc",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.0750,
    lat: 21.1850
  },
  {
    id: "ward_bn_02",
    name: "Phường Đồng Kỵ",
    district: "TP. Từ Sơn",
    provinceCode: "VN24",
    provinceName: "Bắc Ninh",
    type: "Phường",
    role: "Làng nghề gỗ mỹ nghệ Đồng Kỵ nổi tiếng cả nước",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.9620,
    lat: 21.1270
  },

  // --- CÀ MAU (VN96) ---
  {
    id: "ward_cm_01",
    name: "Phường 5",
    district: "TP. Cà Mau",
    provinceCode: "VN96",
    provinceName: "Cà Mau",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh Cà Mau, ngã ba sông Gành Hào",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.1500,
    lat: 9.1760
  },
  {
    id: "ward_cm_02",
    name: "Xã Đất Mũi",
    district: "Huyện Ngọc Hiển",
    provinceCode: "VN96",
    provinceName: "Cà Mau",
    type: "Xã",
    role: "Mốc tọa độ quốc gia GPS 0001, điểm cực Nam thiêng liêng của Tổ quốc trên đất liền",
    isUrbanCenter: false,
    isIsland: false,
    isBorderOrExtreme: true,
    lon: 104.7500,
    lat: 8.6120
  },

  // --- CAO BẰNG (VN04) ---
  {
    id: "ward_cb_01",
    name: "Phường Hợp Giang",
    district: "TP. Cao Bằng",
    provinceCode: "VN04",
    provinceName: "Cao Bằng",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh lỵ Cao Bằng, hợp lưu sông Bằng Giang và sông Hiến",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.2570,
    lat: 22.6680
  },
  {
    id: "ward_cb_02",
    name: "Xã Đàm Thủy",
    district: "Huyện Trùng Khánh",
    provinceCode: "VN04",
    provinceName: "Cao Bằng",
    type: "Xã",
    role: "Thác Bản Giốc di sản danh thắng biên giới quốc tế lớn nhất Đông Nam Á",
    isUrbanCenter: false,
    isIsland: false,
    isBorderOrExtreme: true,
    lon: 106.7230,
    lat: 22.8550
  },

  // --- ĐẮK LẮK (VN66) ---
  {
    id: "ward_dl_01",
    name: "Phường Thắng Lợi",
    district: "TP. Buôn Ma Thuột",
    provinceCode: "VN66",
    provinceName: "Đắk Lắk",
    type: "Phường",
    role: "Ngã 6 Ban Mê, Tượng đài Chiến thắng, trung tâm thủ phủ cà phê Buôn Ma Thuột",
    isUrbanCenter: true,
    isIsland: false,
    lon: 108.0450,
    lat: 12.6800
  },

  // --- ĐIỆN BIÊN (VN11) ---
  {
    id: "ward_db_01",
    name: "Phường Mường Thanh",
    district: "TP. Điện Biên Phủ",
    provinceCode: "VN11",
    provinceName: "Điện Biên",
    type: "Phường",
    role: "Cầu Mường Thanh, Đồi A1, trung tâm quần thể di tích Chiến thắng Điện Biên Phủ",
    isUrbanCenter: true,
    isIsland: false,
    lon: 103.0180,
    lat: 21.3850
  },
  {
    id: "ward_db_02",
    name: "Xã Sín Thầu",
    district: "Huyện Mường Nhé",
    provinceCode: "VN11",
    provinceName: "Điện Biên",
    type: "Xã",
    role: "Cột mốc số 0 A Pa Chải, ngã ba biên giới Việt Nam - Lào - Trung Quốc",
    isUrbanCenter: false,
    isIsland: false,
    isBorderOrExtreme: true,
    lon: 102.1480,
    lat: 22.4010
  },

  // --- ĐỒNG NAI (VN75) ---
  {
    id: "ward_dna_01",
    name: "Phường Thanh Bình",
    district: "TP. Biên Hòa",
    provinceCode: "VN75",
    provinceName: "Đồng Nai",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh Đồng Nai và đô thị Biên Hòa hơn 300 năm lịch sử",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.8180,
    lat: 10.9520
  },
  {
    id: "ward_dna_02",
    name: "Xã Bình Sơn",
    district: "Huyện Long Thành",
    provinceCode: "VN75",
    provinceName: "Đồng Nai",
    type: "Xã",
    role: "Đại công trình Cảng hàng không quốc tế Long Thành, cửa ngõ hàng không quốc tế tương lai",
    isUrbanCenter: false,
    isIsland: false,
    lon: 107.0120,
    lat: 10.7810
  },

  // --- ĐỒNG THÁP (VN82) ---
  {
    id: "ward_dt_01",
    name: "Phường 1",
    district: "TP. Cao Lãnh",
    provinceCode: "VN82",
    provinceName: "Đồng Tháp",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh Đồng Tháp và Khu di tích Cụ Phó bảng Nguyễn Sinh Sắc",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.6320,
    lat: 10.4600
  },
  {
    id: "ward_dt_02",
    name: "Phường 2",
    district: "TP. Sa Đéc",
    provinceCode: "VN82",
    provinceName: "Đồng Tháp",
    type: "Phường",
    role: "Thủ phủ làng hoa Sa Đéc ven sông Tiền trù phú",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.7650,
    lat: 10.2970
  },

  // --- GIA LAI (VN52) ---
  {
    id: "ward_gl_01",
    name: "Phường Tây Sơn",
    district: "TP. Pleiku",
    provinceCode: "VN52",
    provinceName: "Gia Lai",
    type: "Phường",
    role: "Quảng trường Đại Đoàn Kết, trung tâm chính trị văn hóa tỉnh Gia Lai",
    isUrbanCenter: true,
    isIsland: false,
    lon: 108.0050,
    lat: 13.9820
  },

  // --- HÀ TĨNH (VN42) ---
  {
    id: "ward_ht_01",
    name: "Phường Bắc Hà",
    district: "TP. Hà Tĩnh",
    provinceCode: "VN42",
    provinceName: "Hà Tĩnh",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh lỵ Hà Tĩnh",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.9060,
    lat: 18.3430
  },
  {
    id: "ward_ht_02",
    name: "Phường Kỳ Long",
    district: "Thị xã Kỳ Anh",
    provinceCode: "VN42",
    provinceName: "Hà Tĩnh",
    type: "Phường",
    role: "Khu kinh tế Vũng Áng, cảng nước sâu Sơn Dương và cụm công nghiệp thép quy mô lớn",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.3150,
    lat: 18.0620
  },

  // --- HƯNG YÊN (VN33) ---
  {
    id: "ward_hy_01",
    name: "Phường Hiến Nam",
    district: "TP. Hưng Yên",
    provinceCode: "VN33",
    provinceName: "Hưng Yên",
    type: "Phường",
    role: "Quần thể di tích Phố Hiến cổ kính ven sông Hồng",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.0520,
    lat: 20.6550
  },
  {
    id: "ward_hy_02",
    name: "Xã Phụng Công",
    district: "Huyện Văn Giang",
    provinceCode: "VN33",
    provinceName: "Hưng Yên",
    type: "Xã",
    role: "Đô thị sinh thái Ecopark và làng nghề truyền thống hoa cây cảnh",
    isUrbanCenter: false,
    isIsland: false,
    lon: 105.9280,
    lat: 20.9480
  },

  // --- LAI CHÂU (VN12) ---
  {
    id: "ward_lc_01",
    name: "Phường Tân Phong",
    district: "TP. Lai Châu",
    provinceCode: "VN12",
    provinceName: "Lai Châu",
    type: "Phường",
    role: "Quảng trường nhân dân và trung tâm hành chính tỉnh Lai Châu",
    isUrbanCenter: true,
    isIsland: false,
    lon: 103.4680,
    lat: 22.3980
  },

  // --- LÂM ĐỒNG (VN68) ---
  {
    id: "ward_ld_01",
    name: "Phường 1",
    district: "TP. Đà Lạt",
    provinceCode: "VN68",
    provinceName: "Lâm Đồng",
    type: "Phường",
    role: "Hồ Xuân Hương, Chợ đêm Đà Lạt, trái tim của Thành phố Ngàn hoa",
    isUrbanCenter: true,
    isIsland: false,
    lon: 108.4380,
    lat: 11.9420
  },
  {
    id: "ward_ld_02",
    name: "Phường B'Lao",
    district: "TP. Bảo Lộc",
    provinceCode: "VN68",
    provinceName: "Lâm Đồng",
    type: "Phường",
    role: "Trung tâm văn hóa trà B'Lao và công nghiệp tơ lụa Bảo Lộc",
    isUrbanCenter: true,
    isIsland: false,
    lon: 107.8050,
    lat: 11.5450
  },

  // --- LẠNG SƠN (VN20) ---
  {
    id: "ward_ls_01",
    name: "Phường Vĩnh Trại",
    district: "TP. Lạng Sơn",
    provinceCode: "VN20",
    provinceName: "Lạng Sơn",
    type: "Phường",
    role: "Chợ Kỳ Lừa, Đền Kỳ Cùng, trung tâm giao thương xứ Lạng bên sông Kỳ Cùng",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.7620,
    lat: 21.8480
  },
  {
    id: "ward_ls_02",
    name: "Thị trấn Đồng Đăng",
    district: "Huyện Cao Lộc",
    provinceCode: "VN20",
    provinceName: "Lạng Sơn",
    type: "Thị trấn",
    role: "Cửa khẩu quốc tế Hữu Nghị, đầu mối liên vận đường sắt quốc tế",
    isUrbanCenter: false,
    isIsland: false,
    isBorderOrExtreme: true,
    lon: 106.7280,
    lat: 21.9420
  },

  // --- LÀO CAI (VN15) ---
  {
    id: "ward_lca_01",
    name: "Phường Kim Tân",
    district: "TP. Lào Cai",
    provinceCode: "VN15",
    provinceName: "Lào Cai",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh Lào Cai, ngã ba sông Nậm Thi và sông Hồng",
    isUrbanCenter: true,
    isIsland: false,
    lon: 103.9650,
    lat: 22.4850
  },
  {
    id: "ward_lca_02",
    name: "Phường Sa Pa",
    district: "Thị xã Sa Pa",
    provinceCode: "VN15",
    provinceName: "Lào Cai",
    type: "Phường",
    role: "Khu du lịch quốc gia Sa Pa, Nhà thờ đá cổ và chân đỉnh Fansipan hùng vĩ",
    isUrbanCenter: true,
    isIsland: false,
    lon: 103.8430,
    lat: 22.3360
  },

  // --- NGHỆ AN (VN40) ---
  {
    id: "ward_na_01",
    name: "Phường Trường Thi",
    district: "TP. Vinh",
    provinceCode: "VN40",
    provinceName: "Nghệ An",
    type: "Phường",
    role: "Quảng trường Hồ Chí Minh, trung tâm chính trị - hành chính tỉnh Nghệ An",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.6880,
    lat: 18.6720
  },
  {
    id: "ward_na_02",
    name: "Xã Kim Liên",
    district: "Huyện Nam Đàn",
    provinceCode: "VN40",
    provinceName: "Nghệ An",
    type: "Xã",
    role: "Khu di tích quốc gia đặc biệt Quê hương Chủ tịch Hồ Chí Minh (Làng Sen, Làng Hoàng Trù)",
    isUrbanCenter: false,
    isIsland: false,
    lon: 105.5520,
    lat: 18.7050
  },

  // --- NINH BÌNH (VN37) ---
  {
    id: "ward_nb_01",
    name: "Phường Vân Giang",
    district: "TP. Ninh Bình",
    provinceCode: "VN37",
    provinceName: "Ninh Bình",
    type: "Phường",
    role: "Trung tâm hành chính đô thị Ninh Bình, bên bờ sông Đáy",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.9750,
    lat: 20.2520
  },
  {
    id: "ward_nb_02",
    name: "Xã Ninh Xuân",
    district: "Huyện Hoa Lư",
    provinceCode: "VN37",
    provinceName: "Ninh Bình",
    type: "Xã",
    role: "Quần thể danh thắng Tràng An di sản văn hóa và thiên nhiên thế giới kép của UNESCO",
    isUrbanCenter: false,
    isIsland: false,
    lon: 105.9250,
    lat: 20.2480
  },

  // --- PHÚ THỌ (VN25) ---
  {
    id: "ward_pt_01",
    name: "Phường Gia Cẩm",
    district: "TP. Việt Trì",
    provinceCode: "VN25",
    provinceName: "Phú Thọ",
    type: "Phường",
    role: "Trung tâm hành chính TP. Việt Trì - Thành phố lễ hội cội nguồn",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.3950,
    lat: 21.3220
  },
  {
    id: "ward_pt_02",
    name: "Xã Hy Cương",
    district: "TP. Việt Trì",
    provinceCode: "VN25",
    provinceName: "Phú Thọ",
    type: "Xã",
    role: "Khu di tích lịch sử Quốc gia đặc biệt Đền Hùng, nơi thờ tự các Vua Hùng dựng nước",
    isUrbanCenter: false,
    isIsland: false,
    lon: 105.3280,
    lat: 21.3620
  },

  // --- QUẢNG NGÃI (VN51) & HUYỆN ĐẢO LÝ SƠN ---
  {
    id: "ward_qn_01",
    name: "Phường Trần Phú",
    district: "TP. Quảng Ngãi",
    provinceCode: "VN51",
    provinceName: "Quảng Ngãi",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh Quảng Ngãi bên dòng sông Trà Khúc",
    isUrbanCenter: true,
    isIsland: false,
    lon: 108.8020,
    lat: 15.1220
  },
  {
    id: "ward_qn_ls",
    name: "Xã An Vĩnh",
    district: "Huyện đảo Lý Sơn",
    provinceCode: "VN51",
    provinceName: "Quảng Ngãi",
    type: "Xã đảo",
    role: "Huyện đảo Lý Sơn - Quê hương Hải đội Hoàng Sa kiêm quản Trường Sa từ thế kỷ XVII",
    isUrbanCenter: false,
    isIsland: true,
    lon: 109.1120,
    lat: 15.3780
  },

  // --- QUẢNG NINH (VN22) ---
  {
    id: "ward_qni_01",
    name: "Phường Hồng Gai",
    district: "TP. Hạ Long",
    provinceCode: "VN22",
    provinceName: "Quảng Ninh",
    type: "Phường",
    role: "Trung tâm chính trị hành chính tỉnh Quảng Ninh, Bảo tàng Quảng Ninh bên bờ Vịnh Hạ Long",
    isUrbanCenter: true,
    isIsland: false,
    lon: 107.0750,
    lat: 20.9520
  },
  {
    id: "ward_qni_02",
    name: "Phường Bãi Cháy",
    district: "TP. Hạ Long",
    provinceCode: "VN22",
    provinceName: "Quảng Ninh",
    type: "Phường",
    role: "Cảng tàu khách quốc tế Hạ Long & trung tâm du lịch di sản thiên nhiên thế giới",
    isUrbanCenter: true,
    isIsland: false,
    lon: 107.0380,
    lat: 20.9580
  },
  {
    id: "ward_qni_03",
    name: "Phường Trà Cổ",
    district: "TP. Móng Cái",
    provinceCode: "VN22",
    provinceName: "Quảng Ninh",
    type: "Phường",
    role: "Mũi Sa Vĩ - Nơi đặt nét bút đầu tiên vẽ nên dải hình chữ S của Tổ quốc",
    isUrbanCenter: false,
    isIsland: false,
    isBorderOrExtreme: true,
    lon: 108.0120,
    lat: 21.4920
  },

  // --- QUẢNG TRỊ (VN44) ---
  {
    id: "ward_qt_01",
    name: "Phường 1",
    district: "TP. Đông Hà",
    provinceCode: "VN44",
    provinceName: "Quảng Trị",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh lỵ Quảng Trị bên bờ sông Hiếu",
    isUrbanCenter: true,
    isIsland: false,
    lon: 107.0980,
    lat: 16.8220
  },
  {
    id: "ward_qt_02",
    name: "Phường 2",
    district: "Thị xã Quảng Trị",
    provinceCode: "VN44",
    provinceName: "Quảng Trị",
    type: "Phường",
    role: "Di tích quốc gia đặc biệt Thành cổ Quảng Trị, tượng đài bất tử 81 ngày đêm",
    isUrbanCenter: true,
    isIsland: false,
    lon: 107.1950,
    lat: 16.7480
  },

  // --- SƠN LA (VN14) ---
  {
    id: "ward_sl_01",
    name: "Phường Quyết Thắng",
    district: "TP. Sơn La",
    provinceCode: "VN14",
    provinceName: "Sơn La",
    type: "Phường",
    role: "Quảng trường Tây Bắc, Di tích Nhà tù Sơn La, trung tâm hành chính tỉnh Sơn La",
    isUrbanCenter: true,
    isIsland: false,
    lon: 103.9150,
    lat: 21.3280
  },
  {
    id: "ward_sl_02",
    name: "Thị trấn Mộc Châu",
    district: "Huyện Mộc Châu",
    provinceCode: "VN14",
    provinceName: "Sơn La",
    type: "Thị trấn",
    role: "Khu du lịch quốc gia Mộc Châu, đồi chè trái tim và cao nguyên xanh mát",
    isUrbanCenter: false,
    isIsland: false,
    lon: 104.6480,
    lat: 20.8420
  },

  // --- TÂY NINH (VN80) ---
  {
    id: "ward_tn_01",
    name: "Phường 3",
    district: "TP. Tây Ninh",
    provinceCode: "VN80",
    provinceName: "Tây Ninh",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh lỵ Tây Ninh",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.1050,
    lat: 11.3120
  },
  {
    id: "ward_tn_02",
    name: "Phường Ninh Sơn",
    district: "TP. Tây Ninh",
    provinceCode: "VN80",
    provinceName: "Tây Ninh",
    type: "Phường",
    role: "Chân Quần thể danh thắng Núi Bà Đen - Nóc nhà Nam Bộ",
    isUrbanCenter: true,
    isIsland: false,
    lon: 106.1680,
    lat: 11.3780
  },

  // --- THÁI NGUYÊN (VN19) ---
  {
    id: "ward_tng_01",
    name: "Phường Phan Đình Phùng",
    district: "TP. Thái Nguyên",
    provinceCode: "VN19",
    provinceName: "Thái Nguyên",
    type: "Phường",
    role: "Quảng trường Võ Nguyên Giáp, Bảo tàng Văn hóa các Dân tộc Việt Nam",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.8450,
    lat: 21.5950
  },

  // --- THANH HÓA (VN38) ---
  {
    id: "ward_th_01",
    name: "Phường Điện Biên",
    district: "TP. Thanh Hóa",
    provinceCode: "VN38",
    provinceName: "Thanh Hóa",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh Thanh Hóa, Cầu Hàm Rồng lịch sử",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.7820,
    lat: 19.8050
  },
  {
    id: "ward_th_02",
    name: "Phường Bắc Sơn",
    district: "TP. Sầm Sơn",
    provinceCode: "VN38",
    provinceName: "Thanh Hóa",
    type: "Phường",
    role: "Đô thị du lịch biển Sầm Sơn, Đền Độc Cước và Hòn Trống Mái",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.9080,
    lat: 19.7420
  },

  // --- TUYÊN QUANG (VN08) ---
  {
    id: "ward_tq_01",
    name: "Phường Phan Thiết",
    district: "TP. Tuyên Quang",
    provinceCode: "VN08",
    provinceName: "Tuyên Quang",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh lỵ Tuyên Quang, Quảng trường Nguyễn Tất Thành bên dòng sông Lô",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.2180,
    lat: 21.8220
  },
  {
    id: "ward_tq_02",
    name: "Xã Tân Trào",
    district: "Huyện Sơn Dương",
    provinceCode: "VN08",
    provinceName: "Tuyên Quang",
    type: "Xã",
    role: "Khu di tích quốc gia đặc biệt Tân Trào - Thủ đô Khu giải phóng, Thủ đô Kháng chiến",
    isUrbanCenter: false,
    isIsland: false,
    lon: 105.5180,
    lat: 21.7850
  },

  // --- VĨNH LONG (VN86) ---
  {
    id: "ward_vl_01",
    name: "Phường 1",
    district: "TP. Vĩnh Long",
    provinceCode: "VN86",
    provinceName: "Vĩnh Long",
    type: "Phường",
    role: "Trung tâm hành chính tỉnh Vĩnh Long, công viên bờ sông Cổ Chiên hiền hòa",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.9750,
    lat: 10.2520
  },
  {
    id: "ward_vl_02",
    name: "Thị trấn Cái Vồn",
    district: "Thị xã Bình Minh",
    provinceCode: "VN86",
    provinceName: "Vĩnh Long",
    type: "Thị trấn",
    role: "Trung tâm đô thị cửa ngõ cầu Cần Thơ, đối bờ sông Hậu",
    isUrbanCenter: true,
    isIsland: false,
    lon: 105.7820,
    lat: 10.0450
  }
];

const featureCollection = {
  type: "FeatureCollection",
  name: "vietnam_central_wards",
  crs: {
    type: "name",
    properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" }
  },
  features: wards.map(w => ({
    type: "Feature",
    properties: {
      id: w.id,
      name: w.name,
      district: w.district,
      provinceCode: w.provinceCode,
      provinceName: w.provinceName,
      type: w.type,
      role: w.role,
      isUrbanCenter: !!w.isUrbanCenter,
      isIsland: !!w.isIsland,
      isBorderOrExtreme: !!w.isBorderOrExtreme
    },
    geometry: {
      type: "Point",
      coordinates: [w.lon, w.lat]
    }
  }))
};

const outputPath = path.join(__dirname, "../frontend/public/data/vietnam_central_wards.geojson");
fs.writeFileSync(outputPath, JSON.stringify(featureCollection, null, 2), "utf8");
console.log(`Successfully generated ${featureCollection.features.length} wards/communes in ${outputPath}`);
