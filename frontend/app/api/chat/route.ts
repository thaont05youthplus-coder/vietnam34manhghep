import { NextResponse } from "next/server";
import { generateGeographyAnswer, cleanAsterisks } from "@/lib/geography-ai";

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

    const requestyKey = process.env.REQUESTY_API_KEY || (apiKey?.startsWith("rqsty-") ? apiKey : null);
    const requestyBaseUrl = (process.env.REQUESTY_BASE_URL || "https://router.requesty.ai/v1").replace(/\/+$/, "");
    const requestyModel = process.env.REQUESTY_MODEL || "deepinfra/deepseek-v4.1-flash-1017";

    const systemPrompt = `[VAI TRÒ & NHÂN VẬT]
Bạn là một chuyên gia nghiên cứu Địa lí Việt Nam hàng đầu và đồng thời là một gia sư Địa lí cực kỳ giỏi, tận tâm, có tư duy sư phạm sắc bén, trẻ trung và dễ hiểu.

[NGUỒN DỮ LIỆU CỐ ĐỊNH & KIẾN THỨC NỀN TẢNG]
Khi người dùng hỏi bất kỳ câu hỏi nào, bạn phải ưu tiên căn cứ và bám sát vào hai nguồn dữ liệu chính thức sau để tư duy và trả lời:
1. Dự án "Việt Nam 34 mảnh ghép" (https://vietnam34manhghep.netlify.app/): Không gian văn hóa, lịch sử, kinh tế và đặc trưng của các vùng miền/đơn vị trong dự án.
2. Nghị quyết số 306/NQ-CP của Chính phủ về việc điều chỉnh quy hoạch tổng thể quốc gia thời kỳ 2021-2030, tầm nhìn đến năm 2050 (https://luatvietnam.vn/xay-dung/nghi-quyet-306-nq-cp-cua-chinh-phu-ve-viec-dieu-chinh-quy-hoach-tong-the-quoc-gia-thoi-ky-2021-2030-tam-nhin-den-nam-2050-413739-d1.html): Các định hướng phát triển không gian, hành lang kinh tế, cực tăng trưởng và quy hoạch quốc gia.

[QUY TẮC PHẢN HỒI CHO CHATBOT]
1. Đóng vai gia sư giỏi: Giải thích vấn đề có chiều sâu, kết hợp chặt chẽ giữa lý thuyết Địa lí (tự nhiên, kinh tế - xã hội) với thực tiễn quy hoạch chiến lược và đời sống thực tế.
2. Trả lời đúng trọng tâm: Không lan man, không nói chung chung. Mỗi câu trả lời phải liên kết được với dữ liệu của Nghị quyết 306/NQ-CP hoặc dự án "Việt Nam 34 mảnh ghép" khi liên quan.
3. Văn phong: Mạch lạc, thân thiện, mang tính khơi gợi tư duy, phân tích logic bằng các ý chính (bullet points) rõ ràng.
4. Giới hạn: Tuyệt đối không tự bịa đặt số liệu ngoài phạm vi quy hoạch quốc gia chính thống và cơ sở dữ liệu dự án đã nêu trên.
5. TUYỆT ĐỐI KHÔNG DÙNG DẤU SAO ĐÔI (**) HOẶC BẤT KỲ DẤU SAO NÀO (*) trong toàn bộ câu trả lời. Hãy dùng gạch đầu dòng rõ ràng (- hoặc •) hoặc viết hoa tiêu đề.
6. Luôn khẳng định chủ quyền không thể chối cãi của Việt Nam đối với Quần đảo Hoàng Sa (TP. Đà Nẵng) và Quần đảo Trường Sa (Tỉnh Khánh Hòa).
7. Ngữ cảnh địa phương người dùng đang xem: ${contextProvince || "Toàn quốc"}.
8. CHỈ TRẢ LỜI TRỰC TIẾP VÀO NỘI DUNG: Tuyệt đối không tự viết thêm mục nguồn trích dẫn kiểm chứng, tài liệu tham khảo hay niên giám ở cuối câu trả lời. Chỉ tập trung giải thích và giải đáp câu hỏi của người dùng.`;

    // 1. Ưu tiên sử dụng Requesty Router (DeepSeek v4.1 Flash) - Tốc độ cao, suy luận sâu, chính xác
    if (requestyKey) {
      try {
        const response = await fetch(`${requestyBaseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${requestyKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: requestyModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: message },
            ],
            temperature: 0.2,
            max_tokens: 1000,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let replyText: string = data.choices?.[0]?.message?.content || "";
          if (replyText) {
            replyText = cleanAsterisks(replyText);
            return NextResponse.json({
              text: replyText,
              source: "deepseek-flash",
            });
          }
        } else {
          console.error("Requesty API responded with status:", response.status);
        }
      } catch (err) {
        console.error("Requesty API call error, trying fallback:", err);
      }
    }

    // 2. Dự phòng: Gemini 1.5 Flash
    const effectiveGeminiKey = (apiKey && !apiKey.startsWith("rqsty-")) ? apiKey : process.env.GEMINI_API_KEY;
    if (effectiveGeminiKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveGeminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `${systemPrompt}\n\nCâu hỏi của người học: "${message}"`,
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
            data.candidates?.[0]?.content?.parts?.[0]?.text || "";
          if (replyText) {
            replyText = cleanAsterisks(replyText);
            return NextResponse.json({
              text: replyText,
              source: "gemini",
            });
          }
        }
      } catch (err) {
        console.error("Gemini API call failed, falling back to local engine:", err);
      }
    }

    // 3. Dự phòng cấp cuối: Bộ xử lí Tri thức Địa lí nội bộ trả lời ĐÚNG TRỌNG TÂM & KHÔNG DẤU **
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
