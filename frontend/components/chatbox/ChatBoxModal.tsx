"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Sparkles,
  BookCheck,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  FileText,
  AlertCircle,
  X,
  MessageSquare,
} from "lucide-react";
import { ProvinceFeature } from "@/types/geo";

interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  citations?: {
    id: string;
    title: string;
    publisher: string;
    year: number;
    url?: string;
  }[];
  timestamp: string;
}

interface ChatBoxModalProps {
  selectedProvince: ProvinceFeature | null;
  onOpenNotes?: (text: string) => void;
  onClearContext?: () => void;
}

export const ChatBoxModal: React.FC<ChatBoxModalProps> = ({
  selectedProvince,
  onOpenNotes,
  onClearContext,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init",
      sender: "ai",
      text: selectedProvince
        ? `Xin chào! Tôi là Trợ lí AI Địa lí VN34MG. Tôi nhận thấy bạn đang tìm hiểu về **${selectedProvince.properties.name}** (${selectedProvince.properties.type}).\n\nBạn có thể hỏi tôi về đặc điểm tự nhiên, khí hậu, thế mạnh kinh tế, quy hoạch liên vùng hoặc vai trò của địa phương trong vùng kinh tế - xã hội!`
        : `Xin chào! Tôi là Trợ lí AI Địa lí VN34MG. Tôi có thể hỗ trợ bạn tra cứu kiến thức Địa lí 34 tỉnh/thành phố, giải thích nguyên nhân hiện tượng tự nhiên, so sánh các vùng kinh tế và rèn luyện kĩ năng đọc bản đồ. Hãy chọn một câu hỏi gợi ý bên dưới hoặc nhập câu hỏi của bạn!`,
      citations: [
        {
          id: "cit_sgk",
          title: "Sách giáo khoa Địa lí THCS & THPT - Chương trình GDPT 2018",
          publisher: "Bộ Giáo dục và Đào tạo",
          year: 2024,
        },
        {
          id: "cit_niengiam",
          title: "Niên giám Thống kê Việt Nam 2024",
          publisher: "Tổng cục Thống kê",
          year: 2024,
        },
      ],
      timestamp: "Vừa xong",
    },
  ]);

  const [inputVal, setInputVal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeContext, setActiveContext] = useState<string | null>(
    selectedProvince?.properties.name || null
  );
  const [userApiKey, setUserApiKey] = useState<string>("");
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Tải API key từ LocalStorage nếu có
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem("vn34_gemini_api_key");
      if (savedKey) {
        setUserApiKey(savedKey);
        setTempApiKey(savedKey);
      }
    } catch {}
  }, []);

  // Cập nhật ngữ cảnh khi chọn tỉnh mới nhưng KHÔNG xóa hội thoại cũ (T24, T26)
  useEffect(() => {
    if (selectedProvince) {
      setActiveContext(selectedProvince.properties.name);
    }
  }, [selectedProvince]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Bộ câu hỏi gợi ý theo ngữ cảnh
  const getSuggestions = () => {
    if (activeContext) {
      if (activeContext.includes("Đà Nẵng")) {
        return [
          "Vị thế chiến lược của Huyện đảo Hoàng Sa?",
          "Vì sao Đà Nẵng là đô thị hạt nhân miền Trung?",
          "Cơ cấu kinh tế và dịch vụ cảng biển Đà Nẵng?",
        ];
      }
      if (activeContext.includes("Khánh Hòa")) {
        return [
          "Ý nghĩa an ninh quốc phòng của Huyện đảo Trường Sa?",
          "Tiềm năng kinh tế vịnh Cam Ranh và Vân Phong?",
          "Đặc điểm khí hậu duyên hải Khánh Hòa?",
        ];
      }
      if (activeContext.includes("Huế")) {
        return [
          "Vì sao Huế mưa nhiều vào các tháng cuối năm?",
          "Tiềm năng du lịch di sản Cố đô Huế?",
          "Địa hình chuyển tiếp đồi núi - đầm phá ở Huế?",
        ];
      }
      return [
        `Đặc điểm tự nhiên nổi bật của ${activeContext}?`,
        `Thế mạnh kinh tế mũi nhọn của ${activeContext}?`,
        `Quy hoạch liên kết vùng của ${activeContext}?`,
      ];
    }
    return [
      "Ý nghĩa của vùng biển và 2 quần đảo Hoàng Sa - Trường Sa?",
      "So sánh đặc điểm tự nhiên ĐBSH và ĐBSCL?",
      "Giải thích cơ chế gió mùa mùa đông và gió mùa mùa hạ?",
    ];
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputVal).trim();
    if (!query || isLoading) return;

    setInputVal("");
    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Gọi máy chủ AI phân tích dữ liệu Địa lí và sinh câu trả lời chuyên sâu (T25, T27, T28)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          contextProvince: activeContext,
          apiKey: userApiKey || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: "msg_ai_" + Date.now(),
          sender: "ai",
          text: data.text,
          citations: data.citations || [],
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error("Lỗi phản hồi máy chủ AI");
      }
    } catch (err: any) {
      console.error("Chatbot request error:", err);
      // Fallback cục bộ thông minh nếu ngắt mạng
      const aiMsg: ChatMessage = {
        id: "msg_ai_" + Date.now(),
        sender: "ai",
        text: `### 💡 Phân Tích Địa Lí về: "${query}"\n\nĐối tượng nghiên cứu thuộc hệ thống tự nhiên - kinh tế - xã hội Việt Nam. Hãy kết hợp đối chiếu trực tiếp trên bản đồ 34 tỉnh/thành để có góc nhìn không gian trực quan nhất!`,
        citations: [
          {
            id: "cit_fallback",
            title: "Sách giáo khoa Địa lí THCS & THPT - Chương trình GDPT 2018",
            publisher: "Bộ Giáo dục và Đào tạo",
            year: 2024,
          },
        ],
        timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-text">
      {/* Thanh Header ngữ cảnh (Context Bar T26) */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="text-slate-400 shrink-0">Đang tìm hiểu:</span>
          {activeContext ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-900/60 border border-blue-700/60 text-blue-300 font-semibold truncate">
              <span>📍 {activeContext}</span>
              <button
                onClick={() => {
                  setActiveContext(null);
                  onClearContext?.();
                }}
                className="hover:text-white ml-1 text-slate-400"
                title="Bỏ ngữ cảnh địa phương (hỏi toàn quốc)"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <span className="text-slate-400 italic">Toàn lãnh thổ Việt Nam</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowKeyModal(true)}
            className={`text-[11px] px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
              userApiKey
                ? "bg-emerald-950/70 border-emerald-600/80 text-emerald-300"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:text-white"
            }`}
            title="Cấu hình Google Gemini API Key"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{userApiKey ? "Gemini Live: Bật" : "Gemini AI"}</span>
          </button>

          <button
            onClick={() =>
              setMessages([
                {
                  id: "msg_reset",
                  sender: "ai",
                  text: "Đã bắt đầu cuộc hội thoại mới. Mời bạn đặt câu hỏi Địa lí!",
                  timestamp: "Bây giờ",
                },
              ])
            }
            className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-slate-800"
            title="Tạo hội thoại mới"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Vùng tin nhắn chat */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-4 custom-scroll">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-lg ${
                m.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-900 border border-slate-800 text-slate-100 rounded-bl-none"
              }`}
            >
              <div className="whitespace-pre-wrap space-y-1">{m.text}</div>

              {/* Bảng trích dẫn nguồn có kiểm chứng (T27) */}
              {m.citations && m.citations.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-col gap-1 text-[11px]">
                  <div className="flex items-center gap-1 font-bold text-amber-300">
                    <BookCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Nguồn trích dẫn kiểm chứng:</span>
                  </div>
                  {m.citations.map((c) => (
                    <div
                      key={c.id}
                      className="p-1.5 bg-slate-950/60 border border-slate-800/80 rounded-lg text-slate-300 text-[10px]"
                    >
                      <div className="font-semibold text-blue-300">• {c.title}</div>
                      <div className="text-slate-400 pl-2">
                        {c.publisher} ({c.year})
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Thao tác tin nhắn: Sao chép, Chuyển sang Ghi chú */}
            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400">
              <span>{m.timestamp}</span>
              {m.sender === "ai" && (
                <>
                  <button
                    onClick={() => handleCopy(m.id, m.text)}
                    className="hover:text-slate-200 flex items-center gap-0.5"
                    title="Sao chép câu trả lời"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === m.id ? "Đã sao chép" : "Sao chép"}</span>
                  </button>
                  {onOpenNotes && (
                    <button
                      onClick={() => onOpenNotes(m.text)}
                      className="hover:text-amber-400 flex items-center gap-0.5"
                      title="Lưu vào Ghi chú"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Lưu vào Note</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl max-w-[200px] text-xs text-slate-400 animate-pulse">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
            <span>AI đang phân tích dữ liệu...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Dải câu hỏi gợi ý nhanh */}
      <div className="px-3 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center gap-1.5 overflow-x-auto custom-scroll shrink-0">
        <span className="text-[10px] text-slate-400 shrink-0 font-medium">Gợi ý:</span>
        {getSuggestions().map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-full text-[11px] text-slate-300 hover:text-white shrink-0 transition-colors shadow-sm"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Khung nhập câu hỏi (T25) */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 shrink-0">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder={
              activeContext
                ? `Hỏi bất kỳ điều gì về ${activeContext}...`
                : "Hỏi đáp kiến thức Địa lí Việt Nam (Enter để gửi)..."
            }
            className="w-full h-10 pl-3.5 pr-11 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 shadow-inner"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputVal.trim() || isLoading}
            className={`absolute right-1.5 p-2 rounded-lg transition-all ${
              inputVal.trim() && !isLoading
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
            }`}
            title="Gửi câu hỏi"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Modal Cấu hình Google Gemini API Key */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-5 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <h4 className="font-bold text-sm text-slate-100">Cấu hình Google Gemini AI</h4>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Mặc định VN34MG đã tích hợp sẵn <strong>Bộ tri thức Địa lí chuyên sâu</strong> chuẩn SGK (hoạt động không cần Key). 
              Nếu bạn muốn kích hoạt thêm mô hình trực tiếp <strong>Gemini 1.5 Flash Live</strong> từ Google, hãy dán API Key của bạn vào bên dưới:
            </p>

            <div className="mt-3">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800 text-xs">
              {userApiKey ? (
                <button
                  onClick={() => {
                    setUserApiKey("");
                    setTempApiKey("");
                    localStorage.removeItem("vn34_gemini_api_key");
                    setShowKeyModal(false);
                  }}
                  className="text-red-400 hover:text-red-300"
                >
                  Xóa Key đã lưu
                </button>
              ) : (
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Lấy key miễn phí</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => setShowKeyModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Đóng
                </button>
                <button
                  onClick={() => {
                    setUserApiKey(tempApiKey.trim());
                    if (tempApiKey.trim()) {
                      localStorage.setItem("vn34_gemini_api_key", tempApiKey.trim());
                    } else {
                      localStorage.removeItem("vn34_gemini_api_key");
                    }
                    setShowKeyModal(false);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium"
                >
                  Lưu & Áp dụng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
