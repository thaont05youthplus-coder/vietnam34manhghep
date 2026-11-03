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
