import { NextResponse } from "next/server";

export interface FeedbackData {
  id: string;
  category: string;
  rating: number;
  authorName?: string;
  contact?: string;
  provinceCode?: string;
  provinceName?: string;
  title: string;
  content: string;
  createdAt: string;
  status: "Đã tiếp nhận" | "Đang xử lý" | "Đã hoàn tất";
}

// Bộ nhớ tạm trên máy chủ (In-memory storage) cho các phản hồi trong phiên chạy
const feedbackStore: FeedbackData[] = [];

export async function GET() {
  return NextResponse.json({
    total: feedbackStore.length,
    feedbacks: feedbackStore,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { category, rating, authorName, contact, provinceCode, provinceName, title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ tiêu đề và nội dung góp ý." },
        { status: 400 }
      );
    }

    const feedbackId = `FB-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;

    const newFeedback: FeedbackData = {
      id: feedbackId,
      category: category || "Ý kiến đóng góp chung",
      rating: typeof rating === "number" ? Math.max(1, Math.min(5, rating)) : 5,
      authorName: authorName?.trim() || "Người dùng ẩn danh",
      contact: contact?.trim() || "",
      provinceCode: provinceCode || undefined,
      provinceName: provinceName || undefined,
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      status: "Đã tiếp nhận",
    };

    feedbackStore.unshift(newFeedback);

    return NextResponse.json({
      success: true,
      message: "Cảm ơn bạn đã gửi đóng góp ý kiến quý báu cho dự án Việt Nam 34 Mảnh Ghép!",
      feedback: newFeedback,
    });
  } catch (error: any) {
    console.error("Feedback API error:", error);
    return NextResponse.json(
      { error: "Đã xảy ra lỗi khi tiếp nhận phản hồi." },
      { status: 500 }
    );
  }
}
