"use client";

import React, { useState, useMemo } from "react";
import {
  HelpCircle,
  Search,
  Filter,
  ChevronRight,
  BookOpen,
  MapPin,
  BookmarkPlus,
  CheckCircle2,
  Lightbulb,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import { ProvinceFeature } from "@/types/geo";

export interface GeoQuestion {
  id: string;
  code: string;
  domain: "Tự nhiên" | "Kinh tế - xã hội" | "Vị trí - lãnh thổ" | "Biển đảo";
  topic: string;
  level: 1 | 2 | 3 | 4 | 5;
  levelName: string;
  scope: string;
  provinceCode?: string;
  provinceName?: string;
  title: string;
  question: string;
  hint: string;
  answer: string;
  source: string;
}

const SAMPLE_QUESTION_BANK: GeoQuestion[] = [
  {
    id: "q_01",
    code: "Q-GEO-01",
    domain: "Biển đảo",
    topic: "Chủ quyền lãnh thổ",
    level: 1,
    levelName: "Khái quát / Nhận biết",
    scope: "Cả nước",
    provinceCode: "VN48",
    provinceName: "Đà Nẵng",
    title: "Quản lí hành chính Quần đảo Hoàng Sa",
    question: "Quần đảo Hoàng Sa thuộc quyền quản lí hành chính của đơn vị cấp tỉnh nào của nước ta?",
    hint: "Đây là một thành phố trực thuộc Trung ương ở vùng Duyên hải Nam Trung Bộ có cây Cầu Rồng nổi tiếng.",
    answer: "Quần đảo Hoàng Sa là huyện đảo thuộc quyền quản lí hành chính của Thành phố Đà Nẵng theo Nghị định số 07/CP ngày 23/01/1997 của Chính phủ.",
    source: "Nghị định 07/CP của Chính phủ & SGK Địa lí 12",
  },
  {
    id: "q_02",
    code: "Q-GEO-02",
    domain: "Biển đảo",
    topic: "Chủ quyền lãnh thổ",
    level: 1,
    levelName: "Khái quát / Nhận biết",
    scope: "Cả nước",
    provinceCode: "VN56",
    provinceName: "Khánh Hòa",
    title: "Quản lí hành chính Quần đảo Trường Sa",
    question: "Huyện đảo Trường Sa trực thuộc địa giới hành chính của tỉnh nào?",
    hint: "Tỉnh này có thành phố biển Nha Trang và vịnh Cam Ranh nước sâu kín gió.",
    answer: "Huyện đảo Trường Sa trực thuộc tỉnh Khánh Hòa theo Nghị quyết của Quốc hội nước CHXHCN Việt Nam.",
    source: "Nghị quyết Quốc hội & Bộ Ngoại giao Việt Nam",
  },
  {
    id: "q_03",
    code: "Q-GEO-03",
    domain: "Tự nhiên",
    topic: "Khí hậu & Thủy văn",
    level: 3,
    levelName: "Vận dụng / Giải thích",
    scope: "Bắc Trung Bộ và Duyên hải miền Trung",
    provinceCode: "VN44",
    provinceName: "Thừa Thiên Huế",
    title: "Cơ chế gây mưa lớn vào các tháng cuối năm tại Huế",
    question: "Vì sao khu vực Huế và duyên hải miền Trung thường có lượng mưa rất lớn và kéo dài vào các tháng 9 đến tháng 11?",
    hint: "Hãy kết hợp hướng gió mùa Đông Bắc qua biển Đông với bức chắn địa hình dãy Bạch Mã.",
    answer: "Do tác động đồng thời của: (1) Gió mùa Đông Bắc di chuyển qua Biển Đông thu nhận lượng ẩm dồi dào gặp bức chắn địa hình dãy Bạch Mã vuông góc với hướng gió; (2) Hoạt động của dải hội tụ nhiệt đới và các cơn bão/áp thấp nhiệt đới tập trung vào cuối năm.",
    source: "SGK Địa lí 12 - Bài 9: Thiên nhiên nhiệt đới ẩm gió mùa",
  },
  {
    id: "q_04",
    code: "Q-GEO-04",
    domain: "Kinh tế - xã hội",
    topic: "Dịch vụ & Cảng biển",
    level: 4,
    levelName: "Vận dụng cao / Phân tích",
    scope: "Duyên hải Nam Trung Bộ",
    provinceCode: "VN56",
    provinceName: "Khánh Hòa",
    title: "Tiềm năng xây dựng cảng nước sâu vịnh Vân Phong và Cam Ranh",
    question: "Những điều kiện tự nhiên nào thuận lợi nhất để Khánh Hòa phát triển cụm cảng biển trung chuyển quốc tế?",
    hint: "Chú ý đến độ sâu luồng hàng hải, độ kín gió nhờ các bán đảo bao bọc và khoảng cách tới tuyến hàng hải quốc tế.",
    answer: "Vịnh Cam Ranh và Vân Phong có độ sâu tự nhiên lớn (>15m - 20m), kín gió nhờ các bán đảo và đảo che chắn, hầu như không bị sa bồi, nằm sát hải phận quốc tế trên Biển Đông.",
    source: "Quy hoạch hệ thống cảng biển Việt Nam thời kỳ 2021-2030",
  },
  {
    id: "q_05",
    code: "Q-GEO-05",
    domain: "Kinh tế - xã hội",
    topic: "Chuyển dịch cơ cấu",
    level: 2,
    levelName: "Thông hiểu",
    scope: "Đồng bằng sông Cửu Long",
    provinceCode: "VN96",
    provinceName: "Cà Mau",
    title: "Thích ứng biến đổi khí hậu tại vùng bán đảo Cà Mau",
    question: "Địa phương Cà Mau đã chuyển đổi mô hình kinh tế nông nghiệp như thế nào để thích ứng với hiện tượng xâm nhập mặn?",
    hint: "Mô hình kết hợp giữa trồng lúa mùa mưa và nuôi trồng thủy sản mùa khô.",
    answer: "Phát triển mạnh mô hình 'lúa - tôm' sinh thái, chuyển đổi diện tích trũng ngập mặn sang nuôi tôm công nghệ cao và bảo vệ rừng ngập mặn phòng hộ ven biển.",
    source: "Nghị quyết 120/NQ-CP về phát triển bền vững ĐBSCL",
  },
];

interface QuestionBankModalProps {
  selectedProvince: ProvinceFeature | null;
  onLocateProvince?: (provinceCode: string) => void;
  onAddToStudy?: (question: GeoQuestion) => void;
}

export const QuestionBankModal: React.FC<QuestionBankModalProps> = ({
  selectedProvince,
  onLocateProvince,
  onAddToStudy,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState<number | "all">("all");
  const [openHintId, setOpenHintId] = useState<string | null>(null);
  const [openAnswerId, setOpenAnswerId] = useState<string | null>(null);
  const [savedQuestionIds, setSavedQuestionIds] = useState<string[]>([]);
  const [filterBySelectedProvince, setFilterBySelectedProvince] = useState(true);

  // Lọc câu hỏi theo đa tiêu chí (T31, T32, T34)
  const filteredQuestions = useMemo(() => {
    return SAMPLE_QUESTION_BANK.filter((q) => {
      // Lọc theo tỉnh đang chọn nếu đang bật
      if (filterBySelectedProvince && selectedProvince) {
        if (q.provinceCode && q.provinceCode !== selectedProvince.properties.provinceCode) {
          return false;
        }
      }

      // Lọc theo lĩnh vực lớn
      if (selectedDomain !== "Tất cả" && q.domain !== selectedDomain) {
        return false;
      }

      // Lọc theo cấp độ
      if (selectedLevel !== "all" && q.level !== selectedLevel) {
        return false;
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.title.toLowerCase().includes(query) ||
          q.question.toLowerCase().includes(query) ||
          q.topic.toLowerCase().includes(query) ||
          (q.provinceName && q.provinceName.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [selectedProvince, filterBySelectedProvince, selectedDomain, selectedLevel, searchQuery]);

  const handleToggleSave = (q: GeoQuestion) => {
    if (savedQuestionIds.includes(q.id)) {
      setSavedQuestionIds((prev) => prev.filter((id) => id !== q.id));
    } else {
      setSavedQuestionIds((prev) => [...prev, q.id]);
      onAddToStudy?.(q);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-text">
      {/* Thanh điều hướng Breadcrumb Naugh Milk style (T34) */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs shrink-0">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-300 overflow-x-auto custom-scroll">
          <span
            onClick={() => {
              setSelectedDomain("Tất cả");
              setSelectedLevel("all");
              setFilterBySelectedProvince(false);
            }}
            className="hover:text-blue-400 cursor-pointer font-semibold"
          >
            Ngân hàng câu hỏi
          </span>
          <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="text-blue-400 font-medium">{selectedDomain}</span>
          {selectedProvince && filterBySelectedProvince && (
            <>
              <ChevronRight className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="text-amber-400 font-semibold truncate">
                📍 {selectedProvince.properties.name}
              </span>
            </>
          )}
        </div>

        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono shrink-0">
          {filteredQuestions.length} câu hỏi
        </span>
      </div>

      {/* Thông báo ngữ cảnh tỉnh nếu đang chọn */}
      {selectedProvince && filterBySelectedProvince && (
        <div className="px-3 py-2 bg-blue-950/40 border-b border-blue-900/60 flex items-center justify-between text-[11px] text-blue-200">
          <span>Ưu tiên đề xuất câu hỏi cho <strong>{selectedProvince.properties.name}</strong></span>
          <button
            onClick={() => setFilterBySelectedProvince(false)}
            className="text-[10px] text-blue-400 hover:text-white underline"
          >
            Xem tất cả câu hỏi
          </button>
        </div>
      )}

      {/* Thanh tìm kiếm & Bộ lọc đa tiêu chí */}
      <div className="p-3 bg-slate-900/70 border-b border-slate-800 space-y-2.5 shrink-0">
        {/* Ô tìm kiếm */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm câu hỏi (khí hậu, biển đảo, kinh tế, địa danh)..."
            className="w-full h-9 pl-9 pr-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-inner"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
        </div>

        {/* Lọc theo Lĩnh vực lớn */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scroll text-xs">
          {["Tất cả", "Biển đảo", "Tự nhiên", "Kinh tế - xã hội"].map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-colors ${
                selectedDomain === dom
                  ? "bg-emerald-600 text-white shadow"
                  : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750"
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Lọc theo 5 Cấp độ Naugh Milk style */}
        <div className="grid grid-cols-6 gap-1 text-[10px] font-bold">
          <button
            onClick={() => setSelectedLevel("all")}
            className={`py-1 rounded-md text-center transition-colors ${
              selectedLevel === "all"
                ? "bg-blue-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            Tất cả
          </button>
          {[1, 2, 3, 4, 5].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl as any)}
              className={`py-1 rounded-md text-center transition-colors ${
                selectedLevel === lvl
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              Cấp {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách các thẻ câu hỏi */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-3.5 custom-scroll">
        {filteredQuestions.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <HelpCircle className="w-8 h-8 text-slate-600" />
            <p>Không tìm thấy câu hỏi phù hợp với bộ lọc hiện tại.</p>
            <button
              onClick={() => {
                setSelectedDomain("Tất cả");
                setSelectedLevel("all");
                setSearchQuery("");
                setFilterBySelectedProvince(false);
              }}
              className="text-emerald-400 hover:underline font-semibold text-xs mt-1"
            >
              Đặt lại tất cả bộ lọc
            </button>
          </div>
        ) : (
          filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl space-y-2.5 shadow-md transition-all"
            >
              {/* Header thẻ câu hỏi */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-800 text-blue-300 border border-slate-700">
                    {q.code}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {q.domain} • {q.topic}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-amber-300 font-mono">
                  Cấp {q.level}: {q.levelName}
                </span>
              </div>

              {/* Tên & Nội dung câu hỏi */}
              <h5 className="font-black text-sm text-white leading-snug">{q.title}</h5>
              <p className="text-xs text-slate-300 leading-relaxed">{q.question}</p>

              {/* Khung Gợi ý (Hint T33) */}
              {openHintId === q.id && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 leading-relaxed animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-amber-400 mb-1">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>Gợi ý tư duy:</span>
                  </div>
                  <p>{q.hint}</p>
                </div>
              )}

              {/* Khung Lời giải có nguồn kiểm chứng (Solution T33) */}
              {openAnswerId === q.id && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 leading-relaxed space-y-2 animate-in fade-in">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Đáp án chi tiết:</span>
                  </div>
                  <p className="text-xs leading-relaxed">{q.answer}</p>
                  <div className="text-[10px] text-slate-400 pt-1.5 border-t border-slate-850 flex items-center gap-1">
                    <span className="font-semibold text-slate-300">Nguồn:</span>
                    <span>{q.source}</span>
                  </div>
                </div>
              )}

              {/* Thanh công cụ tương tác của câu hỏi (T33, T46) */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOpenHintId(openHintId === q.id ? null : q.id)}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 hover:underline"
                  >
                    {openHintId === q.id ? "Ẩn gợi ý" : "💡 Gợi ý"}
                  </button>
                  <span className="text-slate-600">•</span>
                  <button
                    onClick={() => setOpenAnswerId(openAnswerId === q.id ? null : q.id)}
                    className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 hover:underline"
                  >
                    {openAnswerId === q.id ? "Ẩn lời giải" : "📖 Xem đáp án"}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {q.provinceCode && onLocateProvince && (
                    <button
                      onClick={() => onLocateProvince(q.provinceCode!)}
                      className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-blue-900/50 hover:bg-blue-800/60 text-blue-300 border border-blue-700/60 flex items-center gap-1 transition-colors"
                      title="Định vị và làm nổi bật trên bản đồ"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>Xem trên map</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleToggleSave(q)}
                    className={`px-2 py-1 text-[11px] font-semibold rounded-lg border transition-colors flex items-center gap-1 ${
                      savedQuestionIds.includes(q.id)
                        ? "bg-purple-600 text-white border-purple-400"
                        : "bg-slate-800 text-slate-300 hover:text-white border-slate-700"
                    }`}
                    title="Lưu vào bộ ôn tập Học & Kiểm tra"
                  >
                    <BookmarkPlus className="w-3 h-3" />
                    <span>{savedQuestionIds.includes(q.id) ? "Đã lưu" : "Lưu ôn tập"}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
