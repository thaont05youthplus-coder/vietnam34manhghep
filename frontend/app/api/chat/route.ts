import { NextResponse } from "next/server";
import { DETAILED_PROVINCES, getCompleteProvinceDetail } from "@/data/provinces-detail-data";

interface ChatRequest {
  message: string;
  contextProvince?: string | null;
  history?: { role: "user" | "ai"; text: string }[];
  apiKey?: string;
}

export async function POST(req: Request) {
  try {
    const body: ChatRequest = await req.json();
    const { message, contextProvince, apiKey } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Tin nhắn không hợp lệ" }, { status: 400 });
    }

    const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

    // 1. Nếu có Gemini API Key, gọi trực tiếp Gemini 1.5 Flash
    if (effectiveApiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `Bạn là Trợ lí AI Chuyên gia Địa lí Việt Nam (VN34MG AI).
QUY TẮC BẮT BUỘC VỀ NỘI DUNG VÀ HÌNH THỨC:
1. Trả lời ĐÚNG TRỌNG TÂM câu hỏi của người học, đi thẳng vào câu trả lời, không mở bài dông dài sáo rỗng.
2. TUYỆT ĐỐI KHÔNG DÙNG DẤU SAO ĐÔI (**) HOẶC BẤT KỲ DẤU SAO NÀO (*) trong toàn bộ câu trả lời. Hãy dùng gạch đầu dòng rõ ràng (- hoặc •) hoặc viết hoa tiêu đề.
3. Luôn khẳng định chủ quyền không thể chối cãi của Việt Nam đối với Quần đảo Hoàng Sa (TP. Đà Nẵng) và Quần đảo Trường Sa (Tỉnh Khánh Hòa).
4. Ngữ cảnh tỉnh người dùng đang xem: ${contextProvince || "Toàn quốc"}.

Câu hỏi của người học: "${message}"`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 1000,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          let replyText: string =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Xin lỗi, mô hình AI không thể tạo câu trả lời vào lúc này.";

          // Tuyệt đối loại bỏ mọi dấu ** và * nếu có
          replyText = cleanAsterisks(replyText);

          return NextResponse.json({
            text: replyText,
            source: "gemini",
            citations: [
              {
                id: "cit_gemini_sgk",
                title: "Sách giáo khoa Địa lí THCS & THPT - Chương trình GDPT 2018",
                publisher: "Bộ Giáo dục và Đào tạo",
                year: 2024,
              },
              {
                id: "cit_gemini_gso",
                title: "Niên giám Thống kê Việt Nam 2024",
                publisher: "Tổng cục Thống kê (GSO)",
                year: 2024,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Gemini API call failed, falling back to local engine:", err);
      }
    }

    // 2. Bộ xử lí Tri thức Địa lí trả lời ĐÚNG TRỌNG TÂM & KHÔNG DẤU **
    const reply = generateGeographyAnswer(message, contextProvince);
    reply.text = cleanAsterisks(reply.text);
    return NextResponse.json(reply);
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xử lý câu hỏi địa lí." },
      { status: 500 }
    );
  }
}

// Hàm làm sạch triệt để mọi dấu sao ** và markdown header
function cleanAsterisks(str: string): string {
  return str
    .replace(/\*\*(.*?)\*\*/g, "$1") // Loại bỏ **in đậm** thành chữ sạch
    .replace(/\*(.*?)\*/g, "$1")     // Loại bỏ *in nghiêng*
    .replace(/\*{1,}/g, "")          // Loại bỏ toàn bộ dấu * còn lại
    .replace(/#{1,6}\s*/g, "")       // Loại bỏ ký tự markdown header ###
    .trim();
}

// Hàm chuẩn hóa tiếng Việt bỏ dấu để tìm kiếm chính xác
function removeAccents(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

// Danh mục 34 tỉnh/thành phố chuẩn hóa trong hệ thống VN34MG
const PROVINCES_MAP = [
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
function generateGeographyAnswer(query: string, contextProvince?: string | null) {
  const norm = removeAccents(query);

  // 1. Câu hỏi nhanh: Thủ đô của Việt Nam
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

  // 2. Số lượng tỉnh thành Việt Nam
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

  // 3. Tỉnh lớn nhất / nhỏ nhất / đông dân nhất / ít dân nhất
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

  // 4. Chủ đề: Hoàng Sa, Trường Sa & Biển đảo
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

  // 5. Giải thích hiện tượng thời tiết / Khí hậu / Mưa Huế
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

  // 6. So sánh Đồng bằng sông Hồng và Đồng bằng sông Cửu Long
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

  // 7. Bốn điểm cực lãnh thổ phần đất liền
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

  // 8. Tra cứu theo tỉnh thành (trong câu hỏi hoặc ngữ cảnh đang chọn trên bản đồ)
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

  // 9. Trả lời trực tiếp câu hỏi người dùng
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
