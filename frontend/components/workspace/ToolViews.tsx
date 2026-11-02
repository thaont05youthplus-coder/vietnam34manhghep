"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  HelpCircle,
  PenTool,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Share2,
  Trash2,
  Eraser,
  RotateCcw,
  Palette,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";
import { ToolId } from "@/types/workspace";
import { ProvinceFeature } from "@/types/geo";

interface ToolContentProps {
  toolId: ToolId;
  selectedProvince: ProvinceFeature | null;
}

// 1. Giao diện Chatbox AI (Tool 1)
export const ChatView: React.FC<{ selectedProvince: ProvinceFeature | null }> = ({
  selectedProvince,
}) => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: selectedProvince
        ? `Xin chào! Tôi là Trợ lí AI Địa lí VN34MG. Bạn đang tìm hiểu về **${selectedProvince.properties.name}** (${selectedProvince.properties.type}). Tôi có thể giúp bạn giải đáp về địa hình tự nhiên, khí hậu, kinh tế - xã hội hoặc liên kết với các vùng lân cận!`
        : "Xin chào! Tôi là Trợ lí AI Địa lí VN34MG. Hãy chọn một tỉnh/thành phố trên bản đồ hoặc gõ câu hỏi để tôi hỗ trợ học tập nhé!",
      citations: selectedProvince
        ? [`Niên giám Thống kê Việt Nam 2024 - ${selectedProvince.properties.name}`, "Cổng TTĐT Địa phương"]
        : ["Sách giáo khoa Địa lí THCS & THPT - Bộ GD&ĐT"],
      time: "Vừa xong",
    },
  ]);
  const [inputVal, setInputVal] = useState("");

  const handleSend = () => {
    if (!inputVal.trim()) return;
    const userText = inputVal;
    setInputVal("");
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userText, citations: [], time: "Bây giờ" },
      {
        sender: "ai",
        text: `Đang phân tích thông tin về "${userText}" dựa trên hệ thống cơ sở dữ liệu Địa lí 34 tỉnh thành và sách giáo khoa chuẩn...`,
        citations: ["Dữ liệu Địa lí VN34MG đã kiểm chứng"],
        time: "Vừa xong",
      },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-text">
      {/* Thanh thông tin ngữ cảnh địa phương */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-slate-400">Ngữ cảnh:</span>
          {selectedProvince ? (
            <span className="px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-semibold border border-blue-700/60 flex items-center gap-1">
              📍 {selectedProvince.properties.name}
            </span>
          ) : (
            <span className="text-slate-400 italic">Toàn lãnh thổ Việt Nam</span>
          )}
        </div>
        <span className="text-[10px] text-emerald-400 font-mono">● AI Sẵn sàng</span>
      </div>

      {/* Danh sách tin nhắn */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scroll">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-md ${
                m.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              {m.citations && m.citations.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-300">Nguồn trích dẫn:</span>
                  {m.citations.map((c, i) => (
                    <span key={i} className="flex items-center gap-1 text-blue-400">
                      • {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
          </div>
        ))}
      </div>

      {/* Khung nhập tin nhắn */}
      <div className="p-3 bg-slate-900/90 border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              selectedProvince
                ? `Hỏi về kinh tế, tự nhiên của ${selectedProvince.properties.name}...`
                : "Hỏi đáp kiến thức Địa lí Việt Nam..."
            }
            className="w-full h-10 pl-3 pr-10 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-inner"
          />
          <button
            onClick={handleSend}
            className="absolute right-1.5 p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 2. Giao diện Ngân hàng Câu hỏi (Tool 2)
export const QuestionBankView: React.FC<{ selectedProvince: ProvinceFeature | null }> = ({
  selectedProvince,
}) => {
  const [level, setLevel] = useState<number>(1);

  const sampleQuestions = [
    {
      id: 1,
      title: "Vị trí địa lí và phạm vi lãnh thổ",
      question: "Việt Nam có đường bờ biển dài khoảng bao nhiêu km và tiếp giáp với những quốc gia nào trên đất liền?",
      level: 1,
      topic: "Tự nhiên",
      province: "Toàn quốc",
    },
    {
      id: 2,
      title: "Chủ quyền 2 Quần đảo Hoàng Sa và Trường Sa",
      question: "Quần đảo Hoàng Sa và Quần đảo Trường Sa lần lượt thuộc quyền quản lí hành chính của đơn vị cấp tỉnh nào?",
      level: 2,
      topic: "Biển đảo",
      province: "Đà Nẵng & Khánh Hòa",
    },
    {
      id: 3,
      title: "Chuyển dịch cơ cấu kinh tế theo ngành",
      question: "Phân tích xu hướng chuyển dịch cơ cấu GDP giữa các khu vực Nông - Lâm - Thủy sản, Công nghiệp - Xây dựng và Dịch vụ.",
      level: 3,
      topic: "Kinh tế",
      province: "Toàn quốc",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-text">
      {/* Bộ lọc phân tầng 5 cấp Naugh Milk style */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-emerald-400" />
            Cấp độ câu hỏi (5 Tầng):
          </span>
          <span className="text-[11px] text-amber-300 font-medium">Cấp {level}/5</span>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevel(lvl)}
              className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                level === lvl
                  ? "bg-emerald-600 text-white border-emerald-400 shadow-sm"
                  : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750"
              }`}
            >
              Cấp {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách câu hỏi */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3 custom-scroll">
        {sampleQuestions.map((q) => (
          <div
            key={q.id}
            className="p-3.5 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl space-y-2 shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                {q.topic}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">📍 {q.province}</span>
            </div>
            <h5 className="font-bold text-xs text-white leading-snug">{q.title}</h5>
            <p className="text-xs text-slate-300 leading-relaxed">{q.question}</p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
              <button className="px-2.5 py-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 hover:underline">
                Xem trên bản đồ →
              </button>
              <button className="px-2.5 py-1 text-[11px] font-semibold rounded bg-blue-600/30 text-blue-200 border border-blue-500/30 hover:bg-blue-600/50">
                Lưu vào ôn tập
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 3. Giao diện Ghi chú kép iPad-style (Tool 3)
export const NotesView: React.FC<{ selectedProvince: ProvinceFeature | null }> = ({
  selectedProvince,
}) => {
  const [activeTab, setActiveTab] = useState<"text" | "canvas">("text");
  const [noteContent, setNoteContent] = useState(
    selectedProvince
      ? `### Ghi chú nghiên cứu: ${selectedProvince.properties.name}\n- Mã tỉnh: ${selectedProvince.properties.provinceCode}\n- Diện tích: ${selectedProvince.properties.areaSqKm.toLocaleString("vi-VN")} km²\n- Đặc điểm nổi bật:\n  + \n`
      : "### Ghi chú Địa lí Việt Nam\n- Nhập nội dung bài học hoặc kiến thức cần ghi nhớ tại đây..."
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-text">
      {/* Thanh công cụ ghi chú */}
      <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex bg-slate-800/90 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setActiveTab("text")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "text" ? "bg-amber-600 text-white shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            Văn bản
          </button>
          <button
            onClick={() => setActiveTab("canvas")}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === "canvas" ? "bg-amber-600 text-white shadow" : "text-slate-300 hover:text-white"
            }`}
          >
            Vẽ tay Canvas
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[10px] text-emerald-400 font-mono">Đã tự lưu</span>
          <button className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800" title="Chèn ảnh bản đồ">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Vùng soạn thảo */}
      <div className="flex-1 p-3">
        {activeTab === "text" ? (
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            className="w-full h-full p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500/80 resize-none custom-scroll shadow-inner"
            placeholder="Viết ghi chú học tập..."
          />
        ) : (
          <div className="w-full h-full bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-3 left-3 flex gap-1.5 bg-slate-800/90 border border-slate-700 p-1 rounded-lg">
              <button className="p-1.5 text-amber-400 hover:bg-slate-700 rounded" title="Bút mực">
                <PenTool className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 text-yellow-300 hover:bg-slate-700 rounded" title="Dạ quang">
                <Palette className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 text-slate-400 hover:bg-slate-700 rounded" title="Tẩy">
                <Eraser className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 italic">Bảng vẽ cảm ứng iPad-style (Pointer Events) sẵn sàng nhận nét bút.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 4. Giao diện Học & Kiểm tra (Tool 4)
export const StudyView: React.FC<{ selectedProvince: ProvinceFeature | null }> = ({
  selectedProvince,
}) => {
  const modes = [
    { id: "flashcards", name: "Thẻ ghi nhớ (Flashcards)", desc: "Lật mặt ôn tập 34 tỉnh thành và vùng địa lí", count: "34 thẻ" },
    { id: "learn", name: "Luyện tập (Learn)", desc: "Câu hỏi thích ứng theo tiến độ cá nhân", count: "50 câu" },
    { id: "test", name: "Kiểm tra (Test)", desc: "Bài thi chuẩn hóa có chấm điểm và rubric", count: "20 phút" },
    { id: "match", name: "Ghép cặp (Match)", desc: "Trò chơi ghép tỉnh thành với đặc điểm tự nhiên", count: "Tốc độ" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 p-4 space-y-4 select-text overflow-y-auto custom-scroll">
      <div className="p-3 bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-800/60 rounded-xl">
        <h4 className="font-bold text-sm text-purple-200">Ôn tập Quizlet-style</h4>
        <p className="text-xs text-slate-300 mt-1">Học tập địa phương và rèn luyện kỹ năng nhận diện bản đồ qua 4 chế độ tương tác.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {modes.map((m) => (
          <div
            key={m.id}
            className="p-3.5 bg-slate-900 border border-slate-800 hover:border-purple-500/60 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-md flex flex-col justify-between space-y-2 group"
          >
            <div>
              <div className="flex justify-between items-center">
                <h5 className="font-bold text-xs text-white group-hover:text-purple-300">{m.name}</h5>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-900/50 text-purple-300 border border-purple-800">
                  {m.count}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{m.desc}</p>
            </div>
            <button className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold shadow transition-colors">
              Bắt đầu ngay →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ToolContent: React.FC<ToolContentProps> = ({ toolId, selectedProvince }) => {
  switch (toolId) {
    case "chat":
      return <ChatView selectedProvince={selectedProvince} />;
    case "questions":
      return <QuestionBankView selectedProvince={selectedProvince} />;
    case "notes":
      return <NotesView selectedProvince={selectedProvince} />;
    case "study":
      return <StudyView selectedProvince={selectedProvince} />;
    default:
      return null;
  }
};
