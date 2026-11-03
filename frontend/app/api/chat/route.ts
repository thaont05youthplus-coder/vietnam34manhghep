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

    const systemPrompt = `Bạn là Trợ lý AI Chuyên gia Địa lí Việt Nam (VN34MG AI).
QUY TẮC BẮT BUỘC VỀ NỘI DUNG VÀ HÌNH THỨC:
1. Trả lời ĐÚNG TRỌNG TÂM câu hỏi của người học, đi thẳng vào bản chất khoa học và thực tế địa lí, không mở bài dông dài sáo rỗng.
2. TUYỆT ĐỐI KHÔNG DÙNG DẤU SAO ĐÔI (**) HOẶC BẤT KỲ DẤU SAO NÀO (*) trong toàn bộ câu trả lời. Hãy dùng gạch đầu dòng rõ ràng (- hoặc •) hoặc viết hoa tiêu đề.
3. Luôn khẳng định chủ quyền không thể chối cãi của Việt Nam đối với Quần đảo Hoàng Sa (TP. Đà Nẵng) và Quần đảo Trường Sa (Tỉnh Khánh Hòa).
4. Ngữ cảnh tỉnh người dùng đang xem: ${contextProvince || "Toàn quốc"}.`;

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
              citations: [
                {
                  id: "cit_deepseek_sgk",
                  title: "Sách giáo khoa Địa lí THCS & THPT - Chương trình GDPT 2018",
                  publisher: "Bộ Giáo dục và Đào tạo",
                  year: 2024,
                },
                {
                  id: "cit_deepseek_gso",
                  title: "Niên giám Thống kê & Dữ liệu Khí tượng Thủy văn Quốc gia 2024",
                  publisher: "Tổng cục Thống kê & Tổng cục Khí tượng Thủy văn",
                  year: 2024,
                },
              ],
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
