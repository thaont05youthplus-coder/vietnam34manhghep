import { NextResponse } from "next/server";
import { DETAILED_PROVINCES, getCompleteProvinceDetail } from "@/data/provinces-detail-data";
import { ECONOMIC_REGIONS, NATURAL_REGIONS } from "@/lib/regions";

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

    // 1. Nếu có Gemini API Key, gọi trực tiếp mô hình Gemini 1.5 Flash
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
Nhiệm vụ: Giải đáp kiến thức Địa lí học đường THCS & THPT (Chương trình GDPT 2018), Địa lí tự nhiên, Địa lí kinh tế - xã hội 34 tỉnh thành và 6 vùng kinh tế.
Nguyên tắc bất di bất dịch: Khẳng định chủ quyền không thể tranh cãi của Việt Nam đối với Quần đảo Hoàng Sa (thuộc TP. Đà Nẵng) và Quần đảo Trường Sa (thuộc Tỉnh Khánh Hòa).
Ngữ cảnh tỉnh hiện tại người dùng đang xem: ${contextProvince || "Toàn quốc"}.

Câu hỏi của người học: "${message}"

Hãy trả lời chuyên sâu, có cấu trúc rõ ràng (đề mục, gạch đầu dòng, giải thích nguyên nhân - hệ quả), văn phong sư phạm chuẩn mực. Cuối câu trả lời, hãy ghi kèm danh mục trích dẫn nguồn sách giáo khoa hoặc tài liệu thống kê.`,
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.4,
                maxOutputTokens: 1200,
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const replyText =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "Xin lỗi, mô hình AI không thể tạo câu trả lời vào lúc này.";

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

    // 2. Local Geographic Knowledge Engine (RAG quy tắc chuyên sâu chuẩn SGK)
    const reply = generateGeographyAnswer(message, contextProvince);
    return NextResponse.json(reply);
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi xử lý câu hỏi địa lí." },
      { status: 500 }
    );
  }
}

// =========================================================================
// CƠ SỞ TRI THỨC ĐỊA LÍ CHUYÊN SÂU (GEOGRAPHIC KNOWLEDGE ENGINE)
// =========================================================================
function generateGeographyAnswer(query: string, contextProvince?: string | null) {
  const q = query.toLowerCase();

  // Chủ đề: Hoàng Sa, Trường Sa & Biển đảo Việt Nam
  if (
    q.includes("hoàng sa") ||
    q.includes("trường sa") ||
    q.includes("biển đông") ||
    q.includes("hải đảo") ||
    q.includes("chủ quyền") ||
    q.includes("đường cơ sở")
  ) {
    return {
      text: `### 🌊 Chủ Quyền Biển Đảo & Vị Thế Chiến Lược Của Hoàng Sa & Trường Sa

1. **Căn cứ pháp lí và quản lí hành chính Nhà nước:**
   - **Quần đảo Hoàng Sa** thuộc quyền quản lí hành chính của **Ủy ban nhân dân Thành phố Đà Nẵng** (Huyện đảo Hoàng Sa thành lập theo Nghị định 07/CP).
   - **Quần đảo Trường Sa** thuộc quyền quản lí hành chính của **Ủy ban nhân dân Tỉnh Khánh Hòa** (Huyện đảo Trường Sa gồm Thị trấn Trường Sa, Xã Song Tử Tây, Xã Sinh Tồn).
   - Việt Nam có đầy đủ bằng chứng lịch sử và cơ sở pháp lí khẳng định chủ quyền lâu đời, liên tục và hòa bình đối với hai quần đảo theo luật pháp quốc tế và Công ước Liên Hợp Quốc về Luật Biển (**UNCLOS 1982**).

2. **Ý nghĩa chiến lược về kinh tế & an ninh quốc phòng:**
   - **Tuyến hàng hải quốc tế huyết mạch:** Án ngữ hành lang hàng hải sôi động bậc nhất thế giới nối Thái Bình Dương và Ấn Độ Dương.
   - **Tài nguyên biển phong phú:** Ngư trường đánh bắt hải sản xa bờ trù phú; tiềm năng dầu khí và băng cháy ở thềm lục địa.
   - **Tiền tiêu bảo vệ đất liền:** Tuyến phòng thủ từ xa bảo đảm chủ quyền, an ninh quốc phòng và toàn vẹn lãnh thổ thiêng liêng của Tổ quốc.`,
      citations: [
        {
          id: "cit_sovereignty_doc",
          title: "Sách trắng: Quần đảo Hoàng Sa và Quần đảo Trường Sa - Lãnh thổ Việt Nam",
          publisher: "Bộ Ngoại giao CHXHCN Việt Nam",
          year: 2020,
        },
        {
          id: "cit_unclos",
          title: "Công ước Liên Hợp Quốc về Luật Biển (UNCLOS 1982) & Luật Biển Việt Nam",
          publisher: "Nhà xuất bản Chính trị Quốc gia Sự thật",
          year: 2012,
        },
      ],
    };
  }

  // Chủ đề: Khí hậu, Gió mùa, Thời tiết, Mưa lũ
  if (
    q.includes("khí hậu") ||
    q.includes("gió mùa") ||
    q.includes("mưa") ||
    q.includes("bão") ||
    q.includes("nhiệt độ") ||
    q.includes("thời tiết") ||
    q.includes("phơn")
  ) {
    let specificDetail = "";
    if (q.includes("huế") || contextProvince?.includes("Huế")) {
      specificDetail = `\n\n> **Giải thích hiện tượng mưa đặc biệt ở Huế:**\n> - Huế có lượng mưa rất lớn vào các tháng 9-11 (trung bình > 2.800 mm/năm) do **Gió mùa Đông Bắc** đi qua biển vịnh Bắc Bộ ngậm hơi ẩm gặp bức chắn địa hình **Dãy Bạch Mã** và Trường Sơn Bắc đâm ngang ra biển, gây ra hiện tượng mưa địa hình dữ dội kèm theo hoạt động của dải hội tụ nhiệt đới và bão.`;
    }

    return {
      text: `### 🌦️ Phân Tích Cơ Chế Khí Hậu Nhiệt Đới Gió Mùa Ẩm Việt Nam

1. **Tính chất nhiệt đới ẩm dồi dào:**
   - Vị trí nội chí tuyến bán cầu Bắc mang lại bức xạ mặt trời lớn: nhiệt độ trung bình năm toàn quốc vượt $20^\\circ\\text{C}$ (trừ vùng núi cao), tổng số giờ nắng từ 1.400 - 3.000 giờ/năm.
   - Độ ẩm tương đối cao, thường trên $80\\%$, lượng mưa trung bình năm từ 1.500 - 2.000 mm.

2. **Cơ chế hoạt động của các khối khí gió mùa:**
   - **Gió mùa mùa đông (Gió mùa Đông Bắc):** Hoạt động từ tháng 11 đến tháng 4 năm sau từ áp cao Xibia, làm miền Bắc có mùa đông lạnh; nửa đầu mùa đông lạnh khô, nửa sau mùa đông lạnh ẩm có mưa phùn.
   - **Gió mùa mùa hạ (Gió mùa Tây Nam):** Đầu mùa hạ gây mưa lớn cho Nam Bộ và Tây Nguyên, vượt dãy Trường Sơn tạo hiệu ứng **Gió Tây khô nóng (gió phơn)** gay gắt cho Bắc Trung Bộ. Giữa và cuối mùa hạ mang gió Tây Nam tầng sâu gây mưa trên phạm vi cả nước.${specificDetail}`,
      citations: [
        {
          id: "cit_geo_climate",
          title: "Địa lí tự nhiên Việt Nam - Khí hậu và Thủy văn",
          publisher: "NXB Đại học Sư phạm Hà Nội",
          year: 2023,
        },
      ],
    };
  }

  // Chủ đề: Địa hình, Sông ngòi, Đất đai
  if (
    q.includes("địa hình") ||
    q.includes("núi") ||
    q.includes("đồng bằng") ||
    q.includes("sông ngòi") ||
    q.includes("sông hồng") ||
    q.includes("sông cửu long") ||
    q.includes("khoáng sản")
  ) {
    return {
      text: `### ⛰️ Đặc Điểm Cốt Lõi Địa Hình & Mạng Lưới Thủy Văn Việt Nam

1. **Địa hình chủ yếu là đồi núi nhưng chủ yếu là đồi núi thấp:**
   - Đồi núi chiếm $3/4$ diện tích lãnh thổ, nhưng núi cao trên 2.000m chỉ chiếm khoảng $1\\%$.
   - Hai hướng núi chính: **Hướng Tây Bắc - Đông Nam** (dãy Hoàng Liên Sơn, Trường Sơn Bắc) và **Hướng vòng cung** (4 cánh cung Đông Bắc: Sông Gâm, Ngân Sơn, Bắc Sơn, Đông Triều và Trường Sơn Nam).
   - Địa hình chịu tác động mạnh mẽ của khí hậu nhiệt đới ẩm (hiện tượng xâm thực mạnh ở vùng đồi núi và bồi tụ nhanh ở đồng bằng châu thổ).

2. **Mạng lưới sông ngòi dày đặc, nhiều nước, giàu phù sa:**
   - Có 2.360 con sông dài từ 10km trở lên. Hai hệ thống sông lớn nhất là **Hệ thống sông Hồng** và **Hệ thống sông Mê Công (sông Cửu Long)**.
   - Thủy chế chia thành hai mùa rõ rệt: Mùa lũ (chiếm 70 - 80% lượng nước cả năm) và Mùa cạn, gắn liền với chế độ mưa mùa.`,
      citations: [
        {
          id: "cit_geo_terrain",
          title: "Sách giáo khoa Địa lí 12 - Địa lí Tự nhiên",
          publisher: "NXB Giáo dục Việt Nam",
          year: 2024,
        },
      ],
    };
  }

  // Chủ đề: So sánh Đồng bằng sông Hồng và Đồng bằng sông Cửu Long
  if (
    (q.includes("so sánh") && q.includes("đồng bằng")) ||
    (q.includes("sông hồng") && q.includes("sông cửu long"))
  ) {
    return {
      text: `### 📊 So Sánh Hai Vùng Đồng Bằng Châu Thổ Lớn Nhất Việt Nam

| Đặc điểm | Đồng bằng sông Hồng (ĐBSH) | Đồng bằng sông Cửu Long (ĐBSCL) |
| :--- | :--- | :--- |
| **Diện tích** | Khoảng 15.000 $\\text{km}^2$ | Khoảng 40.000 $\\text{km}^2$ (Gấp gần 3 lần) |
| **Nguồn gốc phù sa** | Phù sa bồi đắp từ hệ thống sông Hồng và sông Thái Bình | Phù sa bồi đắp từ hệ thống sông Mê Công (sông Tiền & sông Hậu) |
| **Hệ thống đê điều** | **Có hệ thống đê điều kiên cố** dài hơn 2.700 km ngăn lũ, chia ruộng thành các ô trũng, vùng trong đê không được bồi phù sa hàng năm | **Không có đê lớn ngăn lũ**, chỉ có bờ bao nhỏ; hàng năm có mùa nước nổi mang theo nguồn lợi thủy sản và phù sa |
| **Đặc điểm thổ nhưỡng** | Đất phù sa màu mỡ lâu đời, đất bạc màu ở rìa | Đất phù sa ngọt ven sông ($30\\%$), diện tích đất phèn và đất mặn chiếm tỉ lệ lớn |
| **Khí hậu** | Nhiệt đới gió mùa có một mùa đông lạnh | Cận xích đạo gió mùa, nắng ấm quanh năm, 2 mùa mưa - khô sâu sắc |
| **Vai trò kinh tế** | Vùng sản xuất lúa có năng suất cao nhất, trung tâm kinh tế phía Bắc | Vựa lúa, vựa thủy sản và trái cây xuất khẩu lớn nhất cả nước |`,
      citations: [
        {
          id: "cit_compare_deltas",
          title: "Chuyên đề Địa lí các Vùng Kinh tế Việt Nam",
          publisher: "Bộ Giáo dục và Đào tạo",
          year: 2024,
        },
      ],
    };
  }

  // Tra cứu theo tỉnh cụ thể được chọn trong ngữ cảnh
  const targetProvince = contextProvince || (q.includes("hà nội") ? "Hà Nội" : q.includes("đà nẵng") ? "Đà Nẵng" : q.includes("hồ chí minh") ? "TP. Hồ Chí Minh" : null);

  if (targetProvince) {
    // Tìm mã tỉnh
    const provEntry = Object.entries(DETAILED_PROVINCES).find(([_, p]) =>
      p.overview?.name?.toLowerCase().includes(targetProvince.toLowerCase())
    );

    const provCode = provEntry ? provEntry[0] : "";
    const pData = provEntry ? provEntry[1] : null;
    const detail = provEntry && pData
      ? getCompleteProvinceDetail(
          provCode,
          pData.overview?.name || targetProvince,
          pData.overview?.nameEn || targetProvince,
          pData.overview?.type || "Tỉnh",
          pData.overview?.areaSqKm || 5000
        )
      : null;

    if (detail) {
      return {
        text: `### 🏛️ Hồ Sơ Toàn Cảnh Địa Lí: **${detail.overview.name}** (${detail.overview.type})

1. **Vị trí địa lí & Quy mô hành chính:**
   - **Trung tâm hành chính:** ${detail.overview.centerCity}.
   - **Diện tích tự nhiên:** ${detail.overview.areaSqKm.toLocaleString("vi-VN")} $\\text{km}^2$ | **Dân số:** ${detail.overview.population.toLocaleString("vi-VN")} người (Mật độ: ${detail.overview.density} người/$\\text{km}^2$).
   - **Tứ cận tiếp giáp:**
     - Phía Bắc: ${detail.overview.borders.north}
     - Phía Nam: ${detail.overview.borders.south}
     - Phía Đông: ${detail.overview.borders.east}
     - Phía Tây: ${detail.overview.borders.west}
   ${detail.overview.sovereigntyNote ? `\n> 🛡️ **Khẳng định chủ quyền:** ${detail.overview.sovereigntyNote}\n` : ""}

2. **Điều kiện tự nhiên & Tài nguyên sinh thái:**
   - **Địa hình:** ${detail.nature.terrain}
   - **Khí hậu:** ${detail.nature.climate}
   - **Mạng lưới thủy văn:** ${detail.nature.hydrology}
   - **Khu bảo tồn & Vườn quốc gia:** ${detail.nature.conservation.join(", ")}.

3. **Thế mạnh phát triển kinh tế & Hạ tầng kết nối:**
   - **Tổng GRDP:** ${detail.economy.grdpTotal} (Bình quân: ${detail.economy.grdpPerCapita}, Tăng trưởng: ${detail.economy.growthRate}).
   - **Cơ cấu kinh tế:** Nông nghiệp ${detail.economy.structure.agriculture}% | Công nghiệp ${detail.economy.structure.industry}% | Dịch vụ ${detail.economy.structure.services}%.
   - **Ngành mũi nhọn:** ${detail.economy.keyIndustries.join(" • ")}.
   - **Hạ tầng giao thông:** Sân bay (${detail.economy.infrastructure.airports.join(", ")}), Cảng biển (${detail.economy.infrastructure.seaports.join(", ")}), Cao tốc (${detail.economy.infrastructure.highways.join(", ")}).`,
        citations: detail.sources.map((s) => ({
          id: s.id,
          title: s.title,
          publisher: s.organization,
          year: s.year,
        })),
      };
    }
  }

  // Mặc định: Phân tích Địa lí tổng quan thông minh theo câu hỏi người dùng
  return {
    text: `### 💡 Phân Tích Chuyên Sâu Địa Lí: "${query}"

1. **Khái quát bản chất hiện tượng địa lí:**
   - Đối tượng bạn quan tâm thuộc hệ thống tự nhiên - kinh tế - xã hội Việt Nam với tính chất phân hóa sâu sắc theo không gian và thời gian.
   - Thể hiện sự tác động tương hỗ giữa các quy luật địa lí (quy luật địa đới qua vĩ độ và quy luật phi địa đới qua độ cao địa hình và khoảng cách ra biển).

2. **Mối liên hệ nhân quả:**
   - Vị trí địa lí nằm ở ngã tư giao thương quốc tế tạo điều kiện thuận lợi cho mở cửa, hội nhập kinh tế biển và phát triển các hành lang kinh tế liên vùng.
   - Địa hình chuyển tiếp từ Tây Bắc xuống Đông Nam giúp hướng gió mùa thâm nhập sâu vào nội địa, tạo nên tính chất gió mùa ẩm sâu sắc.

3. **Định hướng ứng dụng học tập & Đọc Atlat:**
   - Bạn có thể kết hợp xem trực tiếp bản đồ tại 3 chế độ: **Hành chính (34 tỉnh)**, **Tự nhiên (7 khu vực)**, và **Kinh tế - Xã hội (6 vùng)** trên thanh công cụ phía trên để đối chiếu không gian trực quan!`,
    citations: [
      {
        id: "cit_atlas_vn",
        title: "Atlat Địa lí Việt Nam - NXB Giáo dục Việt Nam",
        publisher: "Bộ Giáo dục và Đào tạo",
        year: 2024,
      },
      {
        id: "cit_gso_summary",
        title: "Niên giám Thống kê Tóm tắt Việt Nam 2024",
        publisher: "Tổng cục Thống kê",
        year: 2024,
      },
    ],
  };
}
