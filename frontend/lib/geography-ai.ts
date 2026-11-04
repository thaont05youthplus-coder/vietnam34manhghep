import { DETAILED_PROVINCES, getCompleteProvinceDetail } from "@/data/provinces-detail-data";

export interface GeoCitation {
  id: string;
  title: string;
  publisher: string;
  year: number | string;
  url?: string;
}

export interface GeoAnswer {
  text: string;
  citations: GeoCitation[];
  source?: string;
}

// Hàm làm sạch triệt để mọi dấu sao ** và markdown header
export function cleanAsterisks(str: string): string {
  if (!str) return "";
  return str
    .replace(/\*\*(.*?)\*\*/g, "$1") // Loại bỏ **in đậm** thành chữ sạch
    .replace(/\*(.*?)\*/g, "$1")     // Loại bỏ *in nghiêng*
    .replace(/\*{1,}/g, "")          // Loại bỏ toàn bộ dấu * còn lại
    .replace(/#{1,6}\s*/g, "")       // Loại bỏ ký tự markdown header ###
    .trim();
}

// Hàm chuẩn hóa tiếng Việt bỏ dấu để tìm kiếm chính xác
export function removeAccents(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

// Danh mục 34 tỉnh/thành phố chuẩn hóa trong hệ thống VN34MG
export const PROVINCES_MAP = [
  { code: "VN01", name: "Hà Nội", nameEn: "Hanoi", type: "Thành phố trực thuộc Trung ương", area: 3359.82, aliases: ["ha noi", "hanoi", "thu do"] },
  { code: "VN02", name: "Hải Phòng", nameEn: "Hai Phong", type: "Thành phố trực thuộc Trung ương", area: 1561.8, aliases: ["hai phong", "hoa phuong do"] },
  { code: "VN03", name: "TP. Hồ Chí Minh", nameEn: "Ho Chi Minh City", type: "Thành phố trực thuộc Trung ương", area: 2095.39, aliases: ["ho chi minh", "sai gon", "hcm", "tphcm"] },
  { code: "VN48", name: "Đà Nẵng", nameEn: "Da Nang", type: "Thành phố trực thuộc Trung ương", area: 1284.88, aliases: ["da nang", "tp da nang"] },
  { code: "VNCT", name: "Cần Thơ", nameEn: "Can Tho", type: "Thành phố trực thuộc Trung ương", area: 1439.2, aliases: ["can tho", "tay do"] },
  { code: "VN44", name: "An Giang", nameEn: "An Giang", type: "Tỉnh", area: 3536.7, aliases: ["an giang", "that son"] },
  { code: "VN54", name: "Bắc Ninh", nameEn: "Bac Ninh", type: "Tỉnh", area: 822.7, aliases: ["bac ninh", "kinh bac"] },
  { code: "VN64", name: "Cà Mau", nameEn: "Ca Mau", type: "Tỉnh", area: 5294.8, aliases: ["ca mau", "dat mui"] },
  { code: "VN04", name: "Cao Bằng", nameEn: "Cao Bang", type: "Tỉnh", area: 6700.3, aliases: ["cao bang", "ban gioc"] },
  { code: "VN33", name: "Đắk Lắk", nameEn: "Dak Lak", type: "Tỉnh", area: 13030.5, aliases: ["dak lak", "dac lac", "buon ma thuot"] },
  { code: "VN07", name: "Điện Biên", nameEn: "Dien Bien", type: "Tỉnh", area: 9541.2, aliases: ["dien bien", "a pa chai"] },
  { code: "VN39", name: "Đồng Nai", nameEn: "Dong Nai", type: "Tỉnh", area: 5907.2, aliases: ["dong nai", "bien hoa"] },
  { code: "VN45", name: "Đồng Tháp", nameEn: "Dong Thap", type: "Tỉnh", area: 3383.8, aliases: ["dong thap", "thap muoi", "cao lanh"] },
  { code: "VN30", name: "Gia Lai", nameEn: "Gia Lai", type: "Tỉnh", area: 15510.9, aliases: ["gia lai", "pleiku"] },
  { code: "VN23", name: "Hà Tĩnh", nameEn: "Ha Tinh", type: "Tỉnh", area: 5997.8, aliases: ["ha tinh", "vung ang"] },
  { code: "VN26", name: "Huế", nameEn: "Hue", type: "Tỉnh", area: 5048.2, aliases: ["hue", "thua thien hue", "co do hue"] },
  { code: "VN66", name: "Hưng Yên", nameEn: "Hung Yen", type: "Tỉnh", area: 930.2, aliases: ["hung yen", "pho hien"] },
  { code: "VN34", name: "Khánh Hòa", nameEn: "Khanh Hoa", type: "Tỉnh", area: 5217.7, aliases: ["khanh hoa", "nha trang", "cam ranh"] },
  { code: "VN08", name: "Lai Châu", nameEn: "Lai Chau", type: "Tỉnh", area: 9068.8, aliases: ["lai chau"] },
  { code: "VN35", name: "Lâm Đồng", nameEn: "Lam Dong", type: "Tỉnh", area: 9783.2, aliases: ["lam dong", "da lat"] },
  { code: "VN09", name: "Lạng Sơn", nameEn: "Lang Son", type: "Tỉnh", area: 8310.2, aliases: ["lang son", "dong dang"] },
  { code: "VN05", name: "Lào Cai", nameEn: "Lao Cai", type: "Tỉnh", area: 6383.9, aliases: ["lao cai", "sa pa", "sapa"] },
  { code: "VN22", name: "Nghệ An", nameEn: "Nghe An", type: "Tỉnh", area: 16490.0, aliases: ["nghe an", "vinh"] },
  { code: "VN18", name: "Ninh Bình", nameEn: "Ninh Binh", type: "Tỉnh", area: 1386.8, aliases: ["ninh binh", "trang an", "hoa lu"] },
  { code: "VN68", name: "Phú Thọ", nameEn: "Phu Tho", type: "Tỉnh", area: 3534.6, aliases: ["phu tho", "den hung", "viet tri"] },
  { code: "VN27", name: "Quảng Ngãi", nameEn: "Quang Ngai", type: "Tỉnh", area: 5155.8, aliases: ["quang ngai", "dung quat", "ly son"] },
  { code: "VN13", name: "Quảng Ninh", nameEn: "Quang Ninh", type: "Tỉnh", area: 6102.3, aliases: ["quang ninh", "ha long", "mong cai"] },
  { code: "VN25", name: "Quảng Trị", nameEn: "Quang Tri", type: "Tỉnh", area: 4739.8, aliases: ["quang tri", "dong ha", "hien luong"] },
  { code: "VN14", name: "Sơn La", nameEn: "Son La", type: "Tỉnh", area: 14123.4, aliases: ["son la", "moc chau"] },
  { code: "VN37", name: "Tây Ninh", nameEn: "Tay Ninh", type: "Tỉnh", area: 4041.2, aliases: ["tay ninh", "ba den"] },
  { code: "VN69", name: "Thái Nguyên", nameEn: "Thai Nguyen", type: "Tỉnh", area: 3526.6, aliases: ["thai nguyen", "tan cuong"] },
  { code: "VN21", name: "Thanh Hóa", nameEn: "Thanh Hoa", type: "Tỉnh", area: 11120.6, aliases: ["thanh hoa", "sam son"] },
  { code: "VN07b", name: "Tuyên Quang", nameEn: "Tuyen Quang", type: "Tỉnh", area: 5867.9, aliases: ["tuyen quang", "tan trao"] },
  { code: "VN49", name: "Vĩnh Long", nameEn: "Vinh Long", type: "Tỉnh", area: 1520.2, aliases: ["vinh long"] },
];

// =========================================================================
// BỘ SUY LUẬN TRẢ LỜI ĐÚNG TRỌNG TÂM ĐỊA LÍ (KHÔNG LAN MAN, KHÔNG DẤU **)
// =========================================================================
export function generateGeographyAnswer(query: string, contextProvince?: string | null): GeoAnswer {
  const norm = removeAccents(query);

  // 0. Trọng tâm chiến lược: Nghị quyết số 306/NQ-CP của Chính phủ về Quy hoạch tổng thể quốc gia & Định hướng 6 vùng kinh tế
  if (
    norm.includes("306") ||
    norm.includes("306/nq-cp") ||
    norm.includes("nghi quyet 306") ||
    (norm.includes("quy hoach") && (norm.includes("tong the") || norm.includes("quoc gia"))) ||
    norm.includes("vung dong luc") ||
    norm.includes("hanh lang kinh te") ||
    (norm.includes("dinh huong") && (norm.includes("vung") || norm.includes("kinh te"))) ||
    (norm.includes("6 vung") && norm.includes("kinh te"))
  ) {
    return {
      text: `Định hướng Quy hoạch tổng thể quốc gia thời kỳ 2021 - 2030, tầm nhìn đến năm 2050 (Theo Nghị quyết số 306/NQ-CP ngày 05/10/2025 của Chính phủ):

1. Mục tiêu chiến lược phát triển:
• Tốc độ tăng trưởng GDP bình quân cả nước đạt trên 8,0%/năm trong giai đoạn 2021 - 2030.
• Đến năm 2030: GDP bình quân đầu người đạt khoảng 8.500 USD; tỷ trọng kinh tế số đạt khoảng 30% GDP.

2. Hệ thống 2 Vùng động lực quốc gia & Cực tăng trưởng mới:
• Vùng động lực phía Bắc: Tam giác tăng trưởng Hà Nội - Hải Phòng - Quảng Ninh, đi đầu về chuyển đổi số, đổi mới sáng tạo và công nghệ cao.
• Vùng động lực phía Nam: Tứ giác kinh tế trọng điểm TP. Hồ Chí Minh - Bình Dương - Đồng Nai - Bà Rịa Vũng Tàu, trung tâm tài chính quốc tế, công nghệ bán dẫn và dịch vụ logistics hiện đại.
• Cực tăng trưởng miền Trung: Đà Nẵng - Quảng Ngãi và hình thành vùng động lực mới tại Khánh Hòa - Lâm Đồng (liên kết biển đảo với Tây Nguyên).
• Vùng động lực Đồng bằng sông Cửu Long: Cực tăng trưởng Thành phố Cần Thơ.

3. Các hành lang kinh tế chủ đạo:
• Hành lang kinh tế Bắc - Nam (trục xương sống kết nối theo cao tốc Bắc - Nam và Quốc lộ 1).
• Hành lang Lào Cai - Hà Nội - Hải Phòng - Quảng Ninh (kết nối liên vận quốc tế với Tây Nam Trung Quốc).
• Hành lang Mộc Bài - TP. Hồ Chí Minh - Cảng Cái Mép Thị Vải.
• Hành lang kinh tế Đông - Tây (trục Lao Bảo - Đông Hà - Đà Nẵng).
• Hành lang kinh tế kết nối Tây Nguyên với Duyên hải miền Trung (Quốc lộ 19, 26, 27).

4. Định hướng phát triển 6 Vùng Kinh tế - Xã hội:
• Vùng Trung du và miền núi phía Bắc: Kinh tế xanh, liên kết giao thương quốc tế với Trung Quốc và ASEAN, phát triển mạnh kinh tế cửa khẩu, chế biến nông - lâm sản và du lịch sinh thái.
• Vùng Đồng bằng sông Hồng: Đầu tàu chuyển đổi số, đổi mới sáng tạo, công nghiệp công nghệ cao, dịch vụ chất lượng cao; hạt nhân là vùng động lực phía Bắc với tam giác tăng trưởng Hà Nội - Hải Phòng - Quảng Ninh.
• Vùng Bắc Trung Bộ: Kinh tế biển kết hợp bảo đảm an ninh quốc phòng, chuỗi cảng nước sâu (Nghi Sơn, Cửa Lò, Vũng Áng, Chân Mây), công nghiệp lọc hóa dầu, thép, năng lượng sạch và du lịch di sản.
• Vùng Duyên hải Nam Trung Bộ và Tây Nguyên: Vùng động lực kinh tế biển mở gắn với cao nguyên sinh thái; chuỗi cảng nước sâu và logistics, cực tăng trưởng Đà Nẵng - Quảng Ngãi và vùng động lực mới Khánh Hòa - Lâm Đồng; trung tâm nông nghiệp sinh thái công nghệ cao, cây công nghiệp chủ lực, kinh tế rừng và năng lượng tái tạo.
• Vùng Đông Nam Bộ: Vùng động lực kinh tế lớn nhất cả nước; cực tăng trưởng TP. Hồ Chí Minh; dẫn đầu về công nghiệp công nghệ cao, vi mạch bán dẫn, trung tâm tài chính quốc tế và cụm cảng Cái Mép - Thị Vải.
• Vùng Đồng bằng sông Cửu Long: Bảo đảm an ninh lương thực quốc gia, trung tâm sản xuất và xuất khẩu nông - thủy sản toàn cầu, kinh tế biển, chủ động thích ứng biến đổi khí hậu.`,
      citations: [
        {
          id: "cit_nq306_cp",
          title: "Nghị quyết số 306/NQ-CP về điều chỉnh Quy hoạch tổng thể quốc gia 2021 - 2030, tầm nhìn 2050",
          publisher: "Chính phủ CHXHCN Việt Nam",
          year: 2025,
          url: "https://luatvietnam.vn/xay-dung/nghi-quyet-306-nq-cp-cua-chinh-phu-ve-viec-dieu-chinh-quy-hoach-tong-the-quoc-gia-thoi-ky-2021-2030-tam-nhin-den-nam-2050-413739-d1.html",
        },
        {
          id: "cit_luat_quy_hoach",
          title: "Luật Quy hoạch và Chiến lược phát triển kinh tế - xã hội 10 năm 2021 - 2030",
          publisher: "Quốc hội Nước CHXHCN Việt Nam",
          year: 2023,
        },
      ],
    };
  }

  // 1. Câu hỏi nâng cao: Tại sao bão ít vào Nam Bộ?
  if (
    (norm.includes("bao") && (norm.includes("nam bo") || norm.includes("mien nam") || norm.includes("it vao"))) ||
    (norm.includes("tai sao") && norm.includes("bao") && (norm.includes("nam") || norm.includes("it")))
  ) {
    return {
      text: `Nguyên nhân Nam Bộ (miền Nam) rất ít khi có bão đổ bộ:

1. Vị trí địa lí gần xích đạo và lực Coriolis yếu:
• Nam Bộ nằm ở vĩ độ thấp (khoảng 8°30'B - 11°B). Lực Coriolis (lực làm lệch hướng chuyển động do Trái Đất tự quay) ở vùng vĩ độ thấp rất nhỏ, không đủ lực quán tính để hình thành và duy trì xoáy thuận nhiệt đới (bão thường cần lực Coriolis đủ lớn từ vĩ độ 10° trở lên).

2. Quy luật di chuyển của bão trên Biển Đông:
• Các cơn bão hình thành ở vùng biển Tây Bắc Thái Bình Dương khi vượt qua Philippines vào Biển Đông thường di chuyển theo hướng Tây hoặc Tây Bắc, đổ bộ dồn dập vào Bắc Bộ và Bắc Trung Bộ vào đầu mùa (tháng 6 - 8), sau đó dịch dần xuống Trung Bộ vào các tháng 9 - 11.
• Đến tháng 12, khi dải hội tụ nhiệt đới lùi về phía Nam thì mùa bão cũng bước vào giai đoạn suy tàn; đồng thời các đợt không khí lạnh mạnh từ phương Bắc đẩy bão lệch xa bờ hoặc làm bão tan nhanh trên biển.

3. Tính chất dị thường và cảnh báo:
• Bão đổ bộ vào Nam Bộ là hiện tượng thời tiết hiếm gặp và dị thường (như cơn bão số 5 Linda năm 1997), vì vậy khi có bão xảy ra thường gây thiệt hại rất nặng do người dân ít có kinh nghiệm ứng phó.`,
      citations: [
        {
          id: "cit_typhoon_nambo",
          title: "Sách giáo khoa Địa lí 12 - Một số vấn đề về thiên tai và biện pháp phòng chống",
          publisher: "Bộ Giáo dục và Đào tạo",
          year: 2024,
        },
        {
          id: "cit_climate_vn",
          title: "Khí hậu học Việt Nam",
          publisher: "NXB Đại học Sư phạm",
          year: 2023,
        },
      ],
    };
  }

  // 2. Câu hỏi nâng cao: Hiện tượng gió phơn Tây Nam (Gió Lào)
  if (
    norm.includes("gio lao") ||
    norm.includes("gio phon") ||
    norm.includes("phon tay nam") ||
    (norm.includes("kho nong") && (norm.includes("mien trung") || norm.includes("bac trung bo")))
  ) {
    return {
      text: `Hiện tượng gió phơn Tây Nam (thường gọi là Gió Lào) ở Bắc Trung Bộ:

1. Nguồn gốc luồng gió:
• Đầu mùa hạ, khối khí nhiệt đới ẩm từ vịnh Bengan (Bắc Ấn Độ Dương) di chuyển theo hướng Tây Nam tràn vào lãnh thổ Việt Nam mang theo hàm lượng hơi nước rất lớn.

2. Hiệu ứng sườn đón gió và sườn khuất gió (Hiệu ứng Phơn):
• Khi gặp bức tường thành tự nhiên là dãy Trường Sơn Bắc và biên giới Việt - Lào, khối khí buộc phải bốc lên cao, không khí lạnh dần đi theo tiêu chuẩn đoạn nhiệt ẩm (giảm 0,6°C khi lên cao 100m) ngưng kết sinh mưa xối xả bên sườn tây (trên đất Lào).
• Khi vượt qua đỉnh núi tràn sang sườn đông (Bắc Trung Bộ và dải duyên hải miền Trung), luồng khí đã mất sạch hơi ẩm, bị nén lại và nóng dần lên theo tiêu chuẩn đoạn nhiệt khô (tăng 1°C khi xuống thấp 100m).

3. Hệ quả thời tiết:
• Khiến dải đất Bắc Trung Bộ có thời tiết cực kì khô nóng (nhiệt độ thường vượt 38 - 41°C, độ ẩm không khí có lúc tụt xuống dưới 45%), gây nguy cơ cháy rừng, hạn hán và thiếu nước tưới trầm trọng.`,
      citations: [
        {
          id: "cit_foehn",
          title: "Sách giáo khoa Địa lí 12 - Thiên nhiên nhiệt đới ẩm gió mùa",
          publisher: "NXB Giáo dục Việt Nam",
          year: 2024,
        },
      ],
    };
  }

  // 3. Câu hỏi nâng cao: Tại sao Tây Bắc ấm hơn Đông Bắc vào mùa đông?
  if (
    (norm.includes("tay bac") && norm.includes("dong bac")) ||
    (norm.includes("tay bac") && norm.includes("am hon")) ||
    (norm.includes("tay bac") && norm.includes("lanh") && norm.includes("vi sao"))
  ) {
    return {
      text: `Nguyên nhân vùng Tây Bắc có mùa đông ấm hơn và ít lạnh hơn Đông Bắc:

1. Tác động chắn gió của dãy núi Hoàng Liên Sơn:
• Dãy Hoàng Liên Sơn có độ cao đồ sộ bậc nhất Việt Nam (nhiều đỉnh cao trên 2.500 - 3.143m) chạy theo hướng Tây Bắc - Đông Nam đóng vai trò như một bức tường thành thiên nhiên khổng lồ, ngăn chặn các đợt gió mùa Đông Bắc lạnh buốt tràn từ phương Bắc sang.

2. Cấu trúc địa hình nan quạt của vùng Đông Bắc:
• Ngược lại, vùng Đông Bắc có 4 cánh cung núi lớn (Sông Gâm, Ngân Sơn, Bắc Sơn, Đông Triều) mở rộng về phía bắc, chụm đầu ở Tam Đảo như 4 chiếc phễu khổng lồ hút gió mùa Đông Bắc tràn sâu vào nội địa, khiến Đông Bắc chịu ảnh hưởng sớm nhất, sâu sắc nhất và có mùa đông lạnh kéo dài 2 - 3 tháng.

3. Hệ quả nhiệt độ:
• Vùng Tây Bắc (ở các thung lũng và độ cao dưới 1.000m) có mùa đông đến muộn hơn, kết thúc sớm hơn và nền nhiệt độ trung bình ấm hơn Đông Bắc từ 2 - 3°C.`,
      citations: [
        {
          id: "cit_nw_ne_compare",
          title: "Địa lí tự nhiên Việt Nam - Phân hóa lãnh thổ",
          publisher: "Bộ Giáo dục và Đào tạo",
          year: 2024,
        },
      ],
    };
  }

  // 4. Câu hỏi nâng cao: Chế độ nước sông Cửu Long điều hòa nhờ Biển Hồ Tonle Sap
  if (
    norm.includes("tonle sap") ||
    norm.includes("bien ho") ||
    (norm.includes("che do nuoc") && (norm.includes("cuu long") || norm.includes("song hong") || norm.includes("me kong"))) ||
    (norm.includes("dieu hoa") && norm.includes("song"))
  ) {
    return {
      text: `Nguyên nhân chế độ nước sông Cửu Long (Mê Kông) điều hòa hơn sông Hồng:

1. Vai trò điều tiết của Biển Hồ (Tonle Sap):
• Biển Hồ ở Campuchia là một hồ chứa nước ngọt tự nhiên khổng lồ nối với dòng chính sông Mê Kông qua sông Tonle Sap.
• Vào mùa lũ (mùa mưa): Nước sông Mê Kông dâng cao, dòng chảy tự động đảo chiều chảy ngược vào Biển Hồ tích trữ, giúp giảm đỉnh lũ cho hạ lưu.
• Vào mùa cạn (mùa khô): Mực nước sông Mê Kông hạ thấp, Biển Hồ lại xả nước trở lại dòng chính tiếp tế nguồn nước ngọt dồi dào cho Đồng bằng sông Cửu Long.

2. Địa hình bằng phẳng và hệ thống phân lũ tự nhiên:
• Đồng bằng sông Cửu Long có độ dốc địa hình cực nhỏ (trung bình chỉ 1 - 2 cm/km), hệ thống kênh rạch chằng chịt và các vùng trũng ngập lũ tự nhiên (Đồng Tháp Mười, Tứ giác Long Xuyên) giúp nước lũ tràn đồng êm ả, không có lũ ống, lũ quét đột ngột.

3. Ngược lại với lưu vực sông Hồng:
• Sông Hồng có mạng lưới hình nan quạt (3 sông lớn: Sông Đà, sông Lô, sông Thao cùng hội tụ tại Việt Trì), độ dốc lưu vực lớn và rừng đầu nguồn giảm sút, khiến nước mùa mưa dồn về đồng thời rất nhanh, lũ lên nhanh và rút đột ngột.`,
      citations: [
        {
          id: "cit_river_regime",
          title: "Sách giáo khoa Địa lí 12 - Thủy văn và sông ngòi Việt Nam",
          publisher: "Bộ Giáo dục và Đào tạo",
          year: 2024,
        },
      ],
    };
  }

  // 5. Câu hỏi nâng cao: Vùng cực Nam Trung Bộ (Ninh Thuận - Bình Thuận) khô hạn nhất cả nước
  if (
    (norm.includes("cuc nam trung bo") && (norm.includes("kho") || norm.includes("han"))) ||
    ((norm.includes("ninh thuan") || norm.includes("binh thuan")) && (norm.includes("kho") || norm.includes("mua it") || norm.includes("han")))
  ) {
    return {
      text: `Nguyên nhân dải Duyên hải cực Nam Trung Bộ (Ninh Thuận - Bình Thuận) là nơi khô hạn nhất Việt Nam:

1. Hướng bờ biển song song với cả hai hướng gió mùa:
• Đường bờ biển Ninh Thuận - Bình Thuận chạy theo hướng Đông Bắc - Tây Nam, gần như song song với hướng gió mùa mùa hạ (Tây Nam) và gió mùa mùa đông (Đông Bắc), do đó không có sườn núi vuông góc để đón gió tạo mưa địa hình.

2. Hiệu ứng sườn khuất gió (hiệu ứng phơn):
• Khối núi và cao nguyên Nam Trung Bộ (Lâm Đồng - Di Linh) nằm ở phía tây che chắn luồng gió mùa Tây Nam, khiến luồng khí khi trút hết mưa ở cao nguyên tràn xuống ven biển trở nên khô nóng.

3. Hiện tượng dòng biển lạnh và nước trồi (Upwelling):
• Vùng biển ven bờ Ninh Thuận - Bình Thuận có hiện tượng nước trồi (dòng hải lưu lạnh từ đáy biển dâng lên). Lớp nước biển mặt lạnh đi làm khối không khí sát mặt biển ổn định, không thể bốc hơi đối lưu để tạo mây gây mưa. Lượng mưa trung bình năm ở đây chỉ từ 700 - 800 mm.`,
      citations: [
        {
          id: "cit_drought_ntbt",
          title: "Khí hậu học Việt Nam và các vùng khô hạn ven biển",
          publisher: "NXB Đại học Quốc gia Hà Nội",
          year: 2023,
        },
      ],
    };
  }

  // 6. Câu hỏi nâng cao: 5 vùng biển Việt Nam theo UNCLOS 1982
  if (
    norm.includes("noi thuy") ||
    norm.includes("lanh hai") ||
    norm.includes("vung dac quyen kinh te") ||
    norm.includes("them luc dia") ||
    norm.includes("cac vung bien")
  ) {
    return {
      text: `Quy chế 5 vùng biển của Việt Nam theo Công ước Liên Hợp Quốc về Luật Biển (UNCLOS 1982) và Luật Biển Việt Nam 2012:

1. Nội thủy (Internal Waters):
• Vùng nước nằm phía trong đường cơ sở và giáp với bờ biển.
• Quốc gia ven biển có chủ quyền hoàn toàn, tuyệt đối và đầy đủ như trên lãnh thổ đất liền.

2. Lãnh hải (Territorial Sea):
• Vùng biển có chiều rộng 12 hải lý (khoảng 22,22 km) tính từ đường cơ sở ra phía biển.
• Ranh giới ngoài của lãnh hải chính là đường biên giới quốc gia trên biển của Việt Nam. Chủ quyền quốc gia mở rộng cả vùng trời phía trên, đáy biển và lòng đất dưới đáy biển.

3. Vùng tiếp giáp lãnh hải (Contiguous Zone):
• Vùng biển rộng 12 hải lý tiếp liền ngoài lãnh hải (cách đường cơ sở 24 hải lý).
• Nước ta thực hiện quyền kiểm soát an ninh, hải quan, thuế khóa, y tế và môi trường.

4. Vùng đặc quyền kinh tế (EEZ - Exclusive Economic Zone):
• Vùng biển tiếp liền ngoài lãnh hải, mở rộng đến 200 hải lý (khoảng 370,4 km) tính từ đường cơ sở.
• Việt Nam có quyền chủ quyền hoàn toàn về thăm dò, khai thác, bảo tồn và quản lí các tài nguyên sinh vật và khoáng sản phi sinh vật; các quốc gia khác có quyền tự do hàng hải và đặt cáp ngầm theo luật quốc tế.

5. Thềm lục địa (Continental Shelf):
• Vùng đáy biển và lòng đất dưới đáy biển mở rộng tự nhiên từ đất liền ra rìa ngoài lục địa (tối thiểu 200 hải lý và có thể mở rộng tới 350 hải lý).
• Việt Nam có quyền chủ quyền hoàn toàn và độc quyền về thăm dò, khai thác tài nguyên dầu khí, khoáng sản đáy biển.`,
      citations: [
        {
          id: "cit_unclos_5zones",
          title: "Luật Biển Việt Nam năm 2012 & UNCLOS 1982",
          publisher: "NXB Chính trị Quốc gia",
          year: 2020,
        },
      ],
    };
  }

  // 7. Câu hỏi nâng cao: Đất Feralit đỏ vàng
  if (norm.includes("feralit") || norm.includes("dat do vang")) {
    return {
      text: `Đặc điểm và nguyên nhân hình thành đất Feralit ở Việt Nam:

1. Quá trình Feralit:
• Là quá trình hình thành đất đặc trưng của vùng nhiệt đới ẩm gió mùa.
• Do nhiệt ẩm dồi dào và mưa nhiều tập trung, các chất bazơ dễ tan (như Ca²⁺, Mg²⁺, K⁺) cùng Silic (SiO₂) bị rửa trôi mạnh mẽ.
• Đồng thời diễn ra sự tích tụ oxit sắt (Fe₂O₃ - tạo nên sắc đỏ) và oxit nhôm (Al₂O₃ - tạo sắc vàng), tạo thành tầng đất feralit đỏ vàng đặc trưng.

2. Phân bố và giá trị kinh tế:
• Chiếm tới trên 65% diện tích tự nhiên của nước ta, phân bố chủ yếu ở vùng đồi núi thấp và trung du (dưới 1.000m).
• Tốt nhất là đất feralit phát triển trên đá bazan (Tây Nguyên, Đông Nam Bộ) và đá vôi, có tầng đất dày, tơi xốp, rất thích hợp trồng cây công nghiệp lâu năm (cà phê, cao su, chè, hồ tiêu) và cây ăn quả.`,
      citations: [
        {
          id: "cit_soil_feralit",
          title: "Sách giáo khoa Địa lí 12 - Thổ nhưỡng và sinh vật Việt Nam",
          publisher: "NXB Giáo dục Việt Nam",
          year: 2024,
        },
      ],
    };
  }

  // 8. Câu hỏi nâng cao: Vị trí nội chí tuyến và 2 lần Mặt Trời lên thiên đỉnh
  if (norm.includes("noi chi tuyen") || norm.includes("thien dinh") || (norm.includes("mat troi") && norm.includes("dinh"))) {
    return {
      text: `Ý nghĩa của vị trí địa lí nằm hoàn toàn trong vùng nội chí tuyến bán cầu Bắc của Việt Nam:

1. Nền nhiệt dồi dào và góc nhập xạ lớn:
• Lãnh thổ nước ta trải dài từ 8°34'B đến 23°23'B, nằm trọn trong vành đai nội chí tuyến Bắc bán cầu.
• Hàng năm, tất cả các địa điểm trên toàn lãnh thổ đều có hai lần Mặt Trời đi qua thiên đỉnh (bức xạ Mặt Trời chiếu thẳng đứng vào giữa trưa).
• Tổng lượng bức xạ Mặt Trời nhận được rất lớn (từ 100 - 150 kcal/cm²/năm), tổng số giờ nắng đạt 1.400 - 3.000 giờ/năm, nhiệt độ trung bình năm đều trên 20°C (trừ vùng núi cao).

2. Khí hậu và sinh vật:
• Tạo nên tính chất nhiệt đới của thiên nhiên, cung cấp nguồn năng lượng nhiệt và ánh sáng quanh năm để cây trồng sinh trưởng liên tục, cho phép thâm canh tăng vụ nhiều vụ trong năm.`,
      citations: [
        {
          id: "cit_tropical_position",
          title: "Sách giáo khoa Địa lí 12 - Vị trí địa lí và phạm vi lãnh thổ",
          publisher: "Bộ Giáo dục và Đào tạo",
          year: 2024,
        },
      ],
    };
  }

  // 9. Câu hỏi nâng cao: Xâm nhập mặn ở Đồng bằng sông Cửu Long
  if (norm.includes("xam nhap man") || (norm.includes("han man") && norm.includes("cuu long"))) {
    return {
      text: `Nguyên nhân và giải pháp ứng phó xâm nhập mặn ở Đồng bằng sông Cửu Long:

1. Nguyên nhân chính:
• Mùa khô kéo dài từ tháng 12 đến tháng 4 năm sau, lượng mưa tại chỗ giảm sâu.
• Lưu lượng nước từ thượng nguồn sông Mê Kông đổ về hạ lưu bị sụt giảm (do các đập thủy điện ở thượng lưu tích nước và tác động của hiện tượng El Nino).
• Địa hình đồng bằng thấp trũng, mạng lưới kênh rạch chằng chịt kết hợp với thủy triều Biển Đông và vịnh Thái Lan đẩy nước mặn xâm nhập sâu vào nội đồng từ 40 - 70 km, có nơi trên 90 km.

2. Giải pháp thích ứng:
• Chuyển đổi mô hình sản xuất từ 'thuần ngọt' sang mô hình 'thuận thiên' (mô hình lúa - tôm, nuôi trồng thủy sản nước lợ/mặn).
• Xây dựng hệ thống công trình cống ngăn mặn, trữ ngọt kiểm soát nguồn nước (như hệ thống thủy lợi Cái Lớn - Cái Bé).
• Sử dụng giống lúa và cây trồng chịu mặn, chuyển đổi lịch thời vụ né mặn.`,
      citations: [
        {
          id: "cit_saline_intrusion",
          title: "Nghị quyết 120/NQ-CP về phát triển bền vững ĐBSCL thích ứng với biến đổi khí hậu",
          publisher: "Chính phủ CHXHCN Việt Nam",
          year: 2021,
        },
      ],
    };
  }

  // 10. Câu hỏi nâng cao: Chăn nuôi gia súc lớn (trâu, bò)
  if (norm.includes("trau") || norm.includes("bo") || (norm.includes("gia suc") && norm.includes("chan nuoi"))) {
    return {
      text: `Đặc điểm phân bố chăn nuôi trâu, bò ở Việt Nam:

1. Chăn nuôi trâu:
• Phân bố nhiều nhất ở vùng Trung du và miền núi Bắc Bộ (chiếm trên 50% đàn trâu cả nước), kế đến là Bắc Trung Bộ.
• Nguyên nhân sinh thái: Con trâu ưa ẩm, chịu rét giỏi hơn bò, thích nghi hoàn hảo với điều kiện khí hậu mùa đông lạnh và địa hình đồi núi dốc vùng Đông Bắc - Tây Bắc.

2. Chăn nuôi bò (bò thịt và bò sữa):
• Bò thịt nuôi nhiều ở Bắc Trung Bộ, Duyên hải Nam Trung Bộ và Tây Nguyên (chiếm phần lớn đàn bò cả nước).
• Nguyên nhân: Con bò ưa khô ráo, chịu nóng tốt hơn trâu, phù hợp với các đồng cỏ trên cao nguyên bazan và vùng duyên hải.
• Bò sữa phát triển mạnh ở ven các đô thị lớn (TP. Hồ Chí Minh, Hà Nội, Lâm Đồng/Đà Lạt, Mộc Châu/Sơn La, Nghệ An) nhờ thị trường tiêu thụ rộng và công nghệ chế biến hiện đại.`,
      citations: [
        {
          id: "cit_livestock",
          title: "Địa lí ngành Nông nghiệp Việt Nam",
          publisher: "NXB Giáo dục Việt Nam",
          year: 2024,
        },
      ],
    };
  }

  // 11. Câu hỏi nhanh: Thủ đô của Việt Nam
  if (
    norm.includes("thu do") ||
    norm.includes("capital") ||
    (norm.includes("ha noi") && norm.includes("la gi"))
  ) {
    return {
      text: `Thủ đô của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam là Thành phố Hà Nội.

Hà Nội là trung tâm đầu não chính trị - hành chính quốc gia, đồng thời là trung tâm lớn về văn hóa, khoa học, giáo dục, kinh tế và giao dịch quốc tế của cả nước.
• Vị trí: Nằm ở trung tâm vùng Đồng bằng sông Hồng.
• Diện tích tự nhiên: 3.359,82 km².
• Dân số: Hơn 8,5 triệu người.
• Đơn vị hành chính: 30 quận, huyện, thị xã.`,
      citations: [
        {
          id: "cit_hanoi",
          title: "Luật Thủ đô & Niên giám Thống kê Hà Nội 2024",
          publisher: "Cục Thống kê TP. Hà Nội",
          year: 2024,
        },
      ],
    };
  }

  // 12. Số lượng tỉnh thành Việt Nam
  if (
    norm.includes("bao nhieu tinh") ||
    norm.includes("may tinh") ||
    norm.includes("so tinh") ||
    norm.includes("63 tinh") ||
    norm.includes("34 tinh")
  ) {
    return {
      text: `Số lượng tỉnh, thành phố của Việt Nam:

1. Hiện trạng hành chính quốc gia:
• Cả nước có 63 tỉnh, thành phố trực thuộc Trung ương (gồm 5 thành phố trực thuộc Trung ương: Hà Nội, TP. Hồ Chí Minh, Hải Phòng, Đà Nẵng, Cần Thơ và 58 tỉnh).

2. Không gian tích hợp số VN34MG (34 Mảnh ghép):
• Bản đồ số VN34MG tích hợp 34 đơn vị không gian địa lí hành chính - kinh tế đại diện, bao phủ toàn diện 7 vùng tự nhiên và 6 vùng kinh tế - xã hội.
• Hệ thống khẳng định đầy đủ chủ quyền biển đảo toàn vẹn của Tổ quốc với Quần đảo Hoàng Sa (TP. Đà Nẵng) và Quần đảo Trường Sa (Tỉnh Khánh Hòa).`,
      citations: [
        {
          id: "cit_provinces_count",
          title: "Danh mục đơn vị hành chính Việt Nam",
          publisher: "Tổng cục Thống kê (GSO)",
          year: 2024,
        },
      ],
    };
  }

  // 13. Tỉnh lớn nhất / nhỏ nhất / đông dân nhất / ít dân nhất
  if (
    norm.includes("lon nhat") ||
    norm.includes("rong nhat") ||
    (norm.includes("dien tich") && (norm.includes("lon") || norm.includes("cao")))
  ) {
    return {
      text: `Tỉnh có diện tích tự nhiên lớn nhất Việt Nam là Tỉnh Nghệ An.

• Diện tích: 16.490 km² (chiếm 3,2% diện tích cả nước).
• Vị trí: Thuộc vùng Bắc Trung Bộ, địa hình chuyển tiếp từ dãy Trường Sơn biên giới Việt - Lào xuống bờ biển vịnh Bắc Bộ.
• Trung tâm hành chính: Thành phố Vinh.`,
      citations: [
        {
          id: "cit_nghean",
          title: "Niên giám Thống kê Việt Nam 2024",
          publisher: "Tổng cục Thống kê (GSO)",
          year: 2024,
        },
      ],
    };
  }

  if (
    norm.includes("nho nhat") ||
    norm.includes("be nhat") ||
    (norm.includes("dien tich") && (norm.includes("nho") || norm.includes("thap")))
  ) {
    return {
      text: `Tỉnh có diện tích tự nhiên nhỏ nhất Việt Nam là Tỉnh Bắc Ninh.

• Diện tích: 822,7 km² (chưa bằng 1/20 diện tích Nghệ An).
• Vị trí: Nằm trong vùng Đồng bằng sông Hồng và Vùng kinh tế trọng điểm Bắc Bộ.
• Đặc điểm: Tỉnh có mật độ công nghiệp và giá trị sản xuất công nghiệp điện tử hàng đầu cả nước.`,
      citations: [
        {
          id: "cit_bacninh",
          title: "Niên giám Thống kê Việt Nam 2024",
          publisher: "Tổng cục Thống kê (GSO)",
          year: 2024,
        },
      ],
    };
  }

  if (
    norm.includes("dong dan") ||
    (norm.includes("dan so") && (norm.includes("lon") || norm.includes("dong") || norm.includes("cao")))
  ) {
    return {
      text: `Thành phố đông dân nhất Việt Nam là Thành phố Hồ Chí Minh.

• Dân số chính thức: Trên 9,4 triệu người (dân số thực tế cư trú trên 10 triệu người).
• Đóng góp kinh tế: Là đầu tàu kinh tế cả nước, đóng góp khoảng 16% GDP và hơn 25% tổng thu ngân sách quốc gia.
• Tỉnh, thành đông dân thứ nhì là Thủ đô Hà Nội (trên 8,5 triệu người).`,
      citations: [
        {
          id: "cit_pop_gso",
          title: "Kết quả điều tra Dân số và Nhà ở 2024",
          publisher: "Tổng cục Thống kê (GSO)",
          year: 2024,
        },
      ],
    };
  }

  if (
    norm.includes("it dan") ||
    (norm.includes("dan so") && (norm.includes("it") || norm.includes("thap") || norm.includes("nho")))
  ) {
    return {
      text: `Tỉnh có dân số ít nhất Việt Nam là Tỉnh Bắc Kạn.

• Dân số: Khoảng 325.000 người.
• Mật độ dân số: Khoảng 67 người/km² (thuộc hàng thấp nhất cả nước).
• Địa hình: Vùng núi Đông Bắc, nơi có danh thắng hồ Ba Bể nổi tiếng.`,
      citations: [
        {
          id: "cit_backan_pop",
          title: "Niên giám Thống kê Việt Nam 2024",
          publisher: "Tổng cục Thống kê (GSO)",
          year: 2024,
        },
      ],
    };
  }

  if (
    norm.includes("fansipan") ||
    norm.includes("dinh nui") ||
    norm.includes("noc nha") ||
    (norm.includes("nui") && norm.includes("cao nhat"))
  ) {
    return {
      text: `Đỉnh núi cao nhất Việt Nam là đỉnh Fansipan (Phan Xi Păng).

• Độ cao: 3.143 m so với mực nước biển.
• Vị trí: Nằm trên dãy núi Hoàng Liên Sơn, giáp ranh giữa tỉnh Lào Cai và tỉnh Lai Châu.
• Danh hiệu: Được mệnh danh là "Nóc nhà Đông Dương" (cao nhất 3 nước Việt Nam, Lào, Campuchia).`,
      citations: [
        {
          id: "cit_fansipan",
          title: "Địa lí tự nhiên Việt Nam - Địa hình và Khoáng sản",
          publisher: "NXB Giáo dục Việt Nam",
          year: 2023,
        },
      ],
    };
  }

  if (norm.includes("bo bien") || (norm.includes("chieu dai") && norm.includes("bien"))) {
    return {
      text: `Bờ biển Việt Nam có chiều dài 3.260 km (không tính bờ biển các hải đảo).

• Hình dạng: Chạy dọc theo bờ đông đất nước uốn cong hình chữ S, trải dài từ Móng Cái (tỉnh Quảng Ninh) ở phía bắc đến Hà Tiên (tỉnh Kiên Giang) ở phía tây nam.
• Vị thế: Có 28/63 tỉnh, thành phố trực thuộc Trung ương giáp biển. Vùng biển Việt Nam có diện tích khoảng 1 triệu km² trên Biển Đông với hàng nghìn hòn đảo lớn nhỏ.`,
      citations: [
        {
          id: "cit_coast",
          title: "Sách giáo khoa Địa lí 12 - Vị trí địa lí và phạm vi lãnh thổ",
          publisher: "Bộ Giáo dục và Đào tạo",
          year: 2024,
        },
      ],
    };
  }

  // 14. Chủ đề: Hoàng Sa, Trường Sa & Biển đảo
  if (
    norm.includes("hoang sa") ||
    norm.includes("truong sa") ||
    norm.includes("bien dong") ||
    norm.includes("chu quyen")
  ) {
    return {
      text: `Về chủ quyền biển đảo và vị thế chiến lược của Hoàng Sa và Trường Sa:

1. Quản lí hành chính Nhà nước:
• Quần đảo Hoàng Sa thuộc quyền quản lí hành chính của Ủy ban nhân dân Thành phố Đà Nẵng (Huyện đảo Hoàng Sa).
• Quần đảo Trường Sa thuộc quyền quản lí hành chính của Ủy ban nhân dân Tỉnh Khánh Hòa (Huyện đảo Trường Sa, gồm Thị trấn Trường Sa, Xã Song Tử Tây, Xã Sinh Tồn).
• Việt Nam có đầy đủ căn cứ lịch sử và cơ sở pháp lí khẳng định chủ quyền lâu đời, hòa bình và liên tục, hoàn toàn phù hợp với luật pháp quốc tế và Công ước UNCLOS 1982.

2. Ý nghĩa chiến lược:
• Án ngữ tuyến đường hàng hải quốc tế sôi động kết nối Thái Bình Dương và Ấn Độ Dương.
• Nguồn tài nguyên to lớn về hải sản, dầu khí và khoáng sản đáy biển.
• Tuyến tiền tiêu bảo vệ an ninh quốc phòng toàn vẹn lãnh thổ từ hướng biển.`,
      citations: [
        {
          id: "cit_sovereignty",
          title: "Chủ quyền của Việt Nam đối với Hoàng Sa và Trường Sa",
          publisher: "Bộ Ngoại giao CHXHCN Việt Nam",
          year: 2020,
        },
        {
          id: "cit_unclos",
          title: "Công ước Liên Hợp Quốc về Luật Biển (UNCLOS 1982)",
          publisher: "NXB Chính trị Quốc gia",
          year: 2012,
        },
      ],
    };
  }

  // 15. Giải thích hiện tượng thời tiết / Khí hậu / Mưa Huế
  if (
    (norm.includes("hue") && norm.includes("mua")) ||
    (norm.includes("mien trung") && norm.includes("mua"))
  ) {
    return {
      text: `Nguyên nhân Thành phố Huế và miền Trung mưa nhiều vào các tháng cuối năm (tháng 9 - 11):

1. Hướng gió mùa kết hợp mặt nước vịnh Bắc Bộ:
• Gió mùa Đông Bắc khi tràn xuống thổi qua vùng biển vịnh Bắc Bộ được tiếp thêm lượng hơi ẩm khổng lồ.

2. Tác động chắn gió của địa hình:
• Dãy núi Bạch Mã (đâm ngang ra biển) cùng dãy Trường Sơn Bắc tạo thành bức tường thành đón gió, buộc khối khí ẩm phải bốc lên cao ngưng kết tạo mưa địa hình cực lớn. Lượng mưa trung bình năm của Huế vượt 2.800 - 3.200 mm.

3. Hoạt động của bão và dải hội tụ nhiệt đới:
• Các cơn bão trên Biển Đông và dải hội tụ nhiệt đới thường đổ bộ dồn dập vào dải đất miền Trung vào các tháng 9, 10, 11 làm lượng mưa tăng đột biến.`,
      citations: [
        {
          id: "cit_hue_rain",
          title: "Khí hậu học Việt Nam - Giáo trình Đại học Sư phạm Hà Nội",
          publisher: "NXB Đại học Sư phạm",
          year: 2023,
        },
      ],
    };
  }

  if (
    (norm.includes("mien bac") && norm.includes("lanh")) ||
    (norm.includes("mua dong") && norm.includes("mien bac")) ||
    norm.includes("gio mua dong bac")
  ) {
    return {
      text: `Nguyên nhân miền Bắc Việt Nam có mùa đông lạnh:

1. Tác động trực tiếp của Gió mùa Đông Bắc:
• Nguồn gốc từ khối khí áp cao Xibia lạnh giá thổi từng đợt xuống nước ta từ tháng 11 đến tháng 4 năm sau.

2. Cấu trúc địa hình dạng nan quạt:
• Các cánh cung núi ở vùng Đông Bắc (Sông Gâm, Ngân Sơn, Bắc Sơn, Đông Triều) mở rộng về phía bắc tạo thành các phễu hút gió lạnh tràn sâu vào lãnh thổ, khiến miền Bắc có từ 2 đến 3 tháng nhiệt độ trung bình dưới 18°C.`,
      citations: [
        {
          id: "cit_winter_north",
          title: "Sách giáo khoa Địa lí 12 - Thiên nhiên nhiệt đới ẩm gió mùa",
          publisher: "NXB Giáo dục Việt Nam",
          year: 2024,
        },
      ],
    };
  }

  // 16. So sánh Đồng bằng sông Hồng và Đồng bằng sông Cửu Long
  if (
    norm.includes("so sanh") &&
    (norm.includes("song hong") || norm.includes("song cuu long") || norm.includes("dong bang"))
  ) {
    return {
      text: `So sánh 2 vùng đồng bằng châu thổ lớn nhất Việt Nam:

1. Đồng bằng sông Hồng (ĐBSH):
• Diện tích: Khoảng 15.000 km².
• Nguồn gốc phù sa: Bồi đắp từ hệ thống sông Hồng và sông Thái Bình.
• Hệ thống đê: Có đê kiên cố dài hơn 2.700 km ngăn lũ, chia ruộng thành các ô trũng; vùng trong đê không được bồi phù sa hàng năm.
• Thổ nhưỡng: Đất phù sa màu mỡ lâu đời, đất bạc màu ở rìa đồng bằng.
• Khí hậu: Nhiệt đới gió mùa có mùa đông lạnh rõ rệt.

2. Đồng bằng sông Cửu Long (ĐBSCL):
• Diện tích: Khoảng 40.000 km² (gấp gần 3 lần ĐBSH).
• Nguồn gốc phù sa: Bồi đắp từ hệ thống sông Mê Kông (sông Tiền và sông Hậu).
• Hệ thống đê: Không có đê lớn ngăn lũ; hàng năm đón mùa nước nổi mang theo nguồn lợi thủy sản và phù sa màu mỡ.
• Thổ nhưỡng: Diện tích đất phèn và đất mặn chiếm tỉ lệ lớn; đất phù sa ngọt ven sông chiếm khoảng 30%.
• Khí hậu: Cận xích đạo gió mùa, nắng ấm quanh năm với 2 mùa mưa - khô sâu sắc.`,
      citations: [
        {
          id: "cit_compare_deltas",
          title: "Địa lí kinh tế - xã hội các vùng Việt Nam",
          publisher: "Bộ Giáo dục và Đào tạo",
          year: 2024,
        },
      ],
    };
  }

  // 17. Bốn điểm cực lãnh thổ phần đất liền
  if (
    norm.includes("diem cuc") ||
    norm.includes("cuc bac") ||
    norm.includes("cuc nam") ||
    norm.includes("cuc dong") ||
    norm.includes("cuc tay")
  ) {
    return {
      text: `Tọa độ 4 điểm cực trên phần đất liền Việt Nam:

• Cực Bắc: Xã Lũng Cú, huyện Đồng Văn, tỉnh Hà Giang (vĩ độ 23°23'B).
• Cực Nam: Xã Đất Mũi, huyện Ngọc Hiển, tỉnh Cà Mau (vĩ độ 8°34'B).
• Cực Tây: Xã Sín Thầu, huyện Mường Nhé, tỉnh Điện Biên (kinh độ 102°09'Đ) - nơi ngã ba biên giới Việt Nam - Lào - Trung Quốc.
• Cực Đông: Mũi Đôi, xã Vạn Thạnh, huyện Vạn Ninh, tỉnh Khánh Hòa (kinh độ 109°28'Đ) - nơi đón ánh bình minh sớm nhất trên đất liền Việt Nam.`,
      citations: [
        {
          id: "cit_extreme_points",
          title: "Sách giáo khoa Địa lí 12 - Vị trí địa lí và lãnh thổ",
          publisher: "NXB Giáo dục Việt Nam",
          year: 2024,
        },
      ],
    };
  }

  // 18. Tra cứu theo tỉnh thành (trong câu hỏi hoặc ngữ cảnh đang chọn trên bản đồ)
  let matchedProv = PROVINCES_MAP.find((p) =>
    p.aliases.some((a) => norm.includes(a))
  );

  if (!matchedProv && contextProvince) {
    const normContext = removeAccents(contextProvince);
    matchedProv = PROVINCES_MAP.find(
      (p) =>
        normContext.includes(removeAccents(p.name)) ||
        p.aliases.some((a) => normContext.includes(a))
    );
  }

  if (matchedProv) {
    const pData = DETAILED_PROVINCES[matchedProv.code];
    const detail = getCompleteProvinceDetail(
      matchedProv.code,
      pData?.overview?.name || matchedProv.name,
      pData?.overview?.nameEn || matchedProv.nameEn,
      pData?.overview?.type || matchedProv.type,
      pData?.overview?.areaSqKm || matchedProv.area
    );

    return {
      text: `Hồ sơ tổng quan Địa lí của ${detail.overview.name} (${detail.overview.type}):

1. Quy mô & Vị trí:
• Trung tâm hành chính: ${detail.overview.centerCity}.
• Diện tích: ${detail.overview.areaSqKm.toLocaleString("vi-VN")} km² | Dân số: ${detail.overview.population.toLocaleString("vi-VN")} người (Mật độ: ${detail.overview.density} người/km²).
• Tiếp giáp: Phía Bắc giáp ${detail.overview.borders.north}; Nam giáp ${detail.overview.borders.south}; Đông giáp ${detail.overview.borders.east}; Tây giáp ${detail.overview.borders.west}.
${detail.overview.sovereigntyNote ? `• Chủ quyền: ${detail.overview.sovereigntyNote}\n` : ""}
2. Điều kiện tự nhiên:
• Địa hình: ${detail.nature.terrain}
• Khí hậu: ${detail.nature.climate}
• Thủy văn: ${detail.nature.hydrology}

3. Trụ cột kinh tế & Hạ tầng:
• Tổng GRDP: ${detail.economy.grdpTotal} (Bình quân: ${detail.economy.grdpPerCapita}).
• Cơ cấu: Nông nghiệp ${detail.economy.structure.agriculture}% | Công nghiệp ${detail.economy.structure.industry}% | Dịch vụ ${detail.economy.structure.services}%.
• Ngành mũi nhọn: ${detail.economy.keyIndustries.join(", ")}.
• Hạ tầng kết nối: ${detail.economy.infrastructure.highways.join(", ")}; Cảng: ${detail.economy.infrastructure.seaports.join(", ")}.`,
      citations: detail.sources.map((s) => ({
        id: s.id,
        title: s.title,
        publisher: s.organization,
        year: s.year,
      })),
    };
  }

  // 19. Trả lời trực tiếp câu hỏi người dùng
  return {
    text: `Về câu hỏi: "${query}":

1. Về bản chất địa lí:
• Đây là vấn đề thuộc hệ thống tự nhiên - kinh tế - xã hội Việt Nam, thể hiện rõ quy luật địa đới (theo vĩ độ) và phi địa đới (theo độ cao và hướng sườn đón gió).
• Vị trí địa lí nằm ở ngã tư giao lưu quốc tế giúp Việt Nam phát triển kinh tế mở, đồng thời thiên nhiên mang tính chất nhiệt đới ẩm gió mùa sâu sắc.

2. Hướng dẫn tra cứu bản đồ:
• Bạn hãy bấm chọn trực tiếp vào tỉnh thành hoặc chuyển đổi 3 chế độ "Hành chính (34 tỉnh)", "Tự nhiên (7 khu vực)", "Kinh tế - Xã hội (6 vùng)" ở thanh công cụ phía trên để đối chiếu không gian địa lí trực quan nhất.`,
    citations: [
      {
        id: "cit_general_geo",
        title: "Sách giáo khoa Địa lí 12 - Chương trình GDPT 2018",
        publisher: "Bộ Giáo dục và Đào tạo",
        year: 2024,
      },
    ],
  };
}
