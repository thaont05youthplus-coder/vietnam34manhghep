"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Layers,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Timer,
  Trophy,
  MapPin,
  Sparkles,
} from "lucide-react";
import { ProvinceFeature } from "@/types/geo";

export interface StudyItem {
  id: string;
  front: string;
  back: string;
  hint: string;
  provinceCode?: string;
  provinceName?: string;
  options?: string[];
  correctIndex?: number;
}

const DEFAULT_STUDY_SET: StudyItem[] = [
  {
    id: "s_01",
    front: "Quần đảo Hoàng Sa thuộc quyền quản lí hành chính của đơn vị cấp tỉnh nào?",
    back: "Thành phố Đà Nẵng (Huyện đảo Hoàng Sa)",
    hint: "Thành phố có sông Hàn và bãi biển Mỹ Khê",
    provinceCode: "VN48",
    provinceName: "Đà Nẵng",
    options: ["Tỉnh Quảng Nam", "Thành phố Đà Nẵng", "Tỉnh Quảng Ngãi", "Tỉnh Thừa Thiên Huế"],
    correctIndex: 1,
  },
  {
    id: "s_02",
    front: "Quần đảo Trường Sa thuộc quyền quản lí hành chính của đơn vị cấp tỉnh nào?",
    back: "Tỉnh Khánh Hòa (Huyện đảo Trường Sa)",
    hint: "Địa phương có thành phố Nha Trang và vịnh Cam Ranh",
    provinceCode: "VN56",
    provinceName: "Khánh Hòa",
    options: ["Tỉnh Ninh Thuận", "Tỉnh Bình Thuận", "Tỉnh Khánh Hòa", "Tỉnh Phú Yên"],
    correctIndex: 2,
  },
  {
    id: "s_03",
    front: "Vùng đất cực Nam trên đất liền của Tổ quốc thuộc địa phận tỉnh nào?",
    back: "Tỉnh Cà Mau (Mũi Cà Mau, 8°34'B)",
    hint: "Vùng đất cuối cùng của bán đảo Tây Nam Bộ",
    provinceCode: "VN96",
    provinceName: "Cà Mau",
    options: ["Tỉnh Bạc Liêu", "Tỉnh Kiên Giang", "Tỉnh Cà Mau", "Tỉnh Sóc Trăng"],
    correctIndex: 2,
  },
  {
    id: "s_04",
    front: "Dãy núi nào đóng vai trò là bức chắn địa hình ngăn gió mùa Đông Bắc tại miền Trung?",
    back: "Dãy Bạch Mã (ngăn giữa Huế và Đà Nẵng)",
    hint: "Ranh giới tự nhiên giữa Thừa Thiên Huế và Đà Nẵng",
    provinceCode: "VN44",
    provinceName: "Thừa Thiên Huế",
    options: ["Dãy Hoàng Liên Sơn", "Dãy Hoành Sơn", "Dãy Bạch Mã", "Dãy Trường Sơn Nam"],
    correctIndex: 2,
  },
  {
    id: "s_05",
    front: "Cụm cảng nước sâu kín gió có tiềm năng trung chuyển quốc tế lớn nhất Nam Trung Bộ?",
    back: "Vịnh Vân Phong & Cam Ranh (Khánh Hòa)",
    hint: "Nằm sát tuyến hải trình quốc tế trên Biển Đông",
    provinceCode: "VN56",
    provinceName: "Khánh Hòa",
    options: ["Cảng Quy Nhơn", "Vịnh Cam Ranh & Vân Phong", "Cảng Dung Quất", "Cảng Chân Mây"],
    correctIndex: 1,
  },
];

interface StudyQuizletModalProps {
  selectedProvince: ProvinceFeature | null;
  onLocateProvince?: (provinceCode: string) => void;
}

type StudyMode = "flashcards" | "learn" | "test" | "match";

export const StudyQuizletModal: React.FC<StudyQuizletModalProps> = ({
  selectedProvince,
  onLocateProvince,
}) => {
  const [activeMode, setActiveMode] = useState<StudyMode>("flashcards");
  const [studyList, setStudyList] = useState<StudyItem[]>(DEFAULT_STUDY_SET);

  // FLASHCARDS STATE
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [rememberedIds, setRememberedIds] = useState<string[]>([]);

  // LEARN STATE
  const [learnIndex, setLearnIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showLearnResult, setShowLearnResult] = useState(false);

  // TEST STATE
  const [testAnswers, setTestAnswers] = useState<Record<number, number>>({});
  const [isTestSubmitted, setIsTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // MATCH STATE
  const [matchSelected, setMatchSelected] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchSeconds, setMatchSeconds] = useState(0);
  const [isMatchFinished, setIsMatchFinished] = useState(false);

  // Lọc bài học ưu tiên theo tỉnh đang chọn nếu có
  useEffect(() => {
    if (selectedProvince) {
      const match = DEFAULT_STUDY_SET.filter(
        (s) => s.provinceCode === selectedProvince.properties.provinceCode
      );
      if (match.length > 0) {
        setStudyList([...match, ...DEFAULT_STUDY_SET.filter((s) => !match.includes(s))]);
      }
    }
  }, [selectedProvince]);

  // Bộ đếm thời gian cho game Match
  useEffect(() => {
    let interval: any = null;
    if (activeMode === "match" && !isMatchFinished) {
      interval = setInterval(() => setMatchSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [activeMode, isMatchFinished]);

  // FLASHCARD HANDLERS
  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % studyList.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev === 0 ? studyList.length - 1 : prev - 1));
  };

  const handleToggleRemember = (id: string) => {
    if (rememberedIds.includes(id)) {
      setRememberedIds((prev) => prev.filter((i) => i !== id));
    } else {
      setRememberedIds((prev) => [...prev, id]);
    }
    handleNextCard();
  };

  const handleShuffle = () => {
    setStudyList((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCardIndex(0);
    setIsFlipped(false);
  };

  // LEARN HANDLERS
  const handleSelectOption = (idx: number) => {
    if (showLearnResult) return;
    setSelectedOption(idx);
    setShowLearnResult(true);
  };

  const handleNextLearn = () => {
    setShowLearnResult(false);
    setSelectedOption(null);
    setLearnIndex((prev) => (prev + 1) % studyList.length);
  };

  // TEST HANDLERS
  const handleSubmitTest = () => {
    let score = 0;
    studyList.forEach((q, idx) => {
      if (testAnswers[idx] === q.correctIndex) {
        score++;
      }
    });
    setTestScore(score);
    setIsTestSubmitted(true);
  };

  const currentCard = studyList[cardIndex] || studyList[0];
  const currentLearn = studyList[learnIndex] || studyList[0];

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-text">
      {/* Thanh Header chọn chế độ ôn tập Quizlet */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scroll text-xs">
          {[
            { id: "flashcards", label: "Thẻ ghi nhớ" },
            { id: "learn", label: "Luyện tập" },
            { id: "test", label: "Kiểm tra" },
            { id: "match", label: "Ghép cặp" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMode(m.id as StudyMode);
                setIsFlipped(false);
                setIsTestSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-xl font-bold text-[11px] shrink-0 transition-all ${
                activeMode === m.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-900/30"
                  : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {selectedProvince && (
          <span className="text-[10px] text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800/60 shrink-0">
            📍 {selectedProvince.properties.name}
          </span>
        )}
      </div>

      {/* CHẾ ĐỘ 1: THẺ GHI NHỚ FLASHCARDS (T42) */}
      {activeMode === "flashcards" && (
        <div className="flex-1 p-5 flex flex-col items-center justify-between select-none">
          {/* Thanh tiến độ */}
          <div className="w-full flex items-center justify-between text-xs text-slate-400">
            <span>
              Thẻ {cardIndex + 1} / {studyList.length}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">
                ✓ {rememberedIds.length} đã nhớ
              </span>
              <button
                onClick={handleShuffle}
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Trộn ngẫu nhiên thẻ"
              >
                <Shuffle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Thẻ 3D Flip Card */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className="w-full max-w-md h-64 bg-slate-900 border border-slate-700 hover:border-purple-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.02] relative group"
          >
            <span className="absolute top-4 left-4 text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
              {isFlipped ? "Đáp án & Giải thích" : "Mặt trước - Câu hỏi"}
            </span>
            <span className="absolute top-4 right-4 text-[10px] text-slate-500 group-hover:text-purple-300">
              Nhấp để lật ⟲
            </span>

            <div className="my-auto px-4">
              {isFlipped ? (
                <div className="space-y-2 animate-in fade-in">
                  <h4 className="text-lg font-black text-amber-300">{currentCard.back}</h4>
                  <p className="text-xs text-slate-400 italic">Gợi ý: {currentCard.hint}</p>
                </div>
              ) : (
                <h4 className="text-base font-bold text-white leading-relaxed animate-in fade-in">
                  {currentCard.front}
                </h4>
              )}
            </div>

            <div className="text-[10px] text-slate-500 font-mono">
              Phím Space hoặc click để lật mặt thẻ
            </div>
          </div>

          {/* Cụm điều khiển Đã nhớ / Chưa nhớ / Trước / Tiếp */}
          <div className="w-full max-w-md flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handlePrevCard}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
              title="Thẻ trước"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleToggleRemember(currentCard.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                rememberedIds.includes(currentCard.id)
                  ? "bg-slate-800 text-slate-400 hover:text-white"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white"
              }`}
            >
              {rememberedIds.includes(currentCard.id) ? "Đánh dấu chưa nhớ" : "✓ Đã ghi nhớ"}
            </button>

            <button
              onClick={handleNextCard}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
              title="Thẻ tiếp theo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* CHẾ ĐỘ 2: LUYỆN TẬP (LEARN T43) */}
      {activeMode === "learn" && (
        <div className="flex-1 p-5 flex flex-col justify-between select-none">
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-slate-400">
              <span>
                Câu {learnIndex + 1} / {studyList.length}
              </span>
              <span className="text-purple-400 font-bold">Chế độ luyện tập</span>
            </div>

            <h4 className="text-sm font-black text-white leading-relaxed">
              {currentLearn.front}
            </h4>

            {/* Các lựa chọn trắc nghiệm */}
            <div className="space-y-2">
              {currentLearn.options?.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentLearn.correctIndex;
                let btnStyle = "bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800";

                if (showLearnResult) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold";
                  } else if (isSelected) {
                    btnStyle = "bg-red-600/30 border-red-500 text-red-200 font-bold";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {showLearnResult && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {showLearnResult && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Phản hồi giải thích */}
            {showLearnResult && (
              <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1.5 animate-in fade-in">
                <span className="font-bold text-amber-300">Giải thích chi tiết:</span>
                <p className="text-slate-300 leading-relaxed">{currentLearn.back}</p>
              </div>
            )}
          </div>

          {showLearnResult && (
            <button
              onClick={handleNextLearn}
              className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg transition-colors mt-4"
            >
              Câu tiếp theo →
            </button>
          )}
        </div>
      )}

      {/* CHẾ ĐỘ 3: KIỂM TRA (TEST T44, T45, T46) */}
      {activeMode === "test" && (
        <div className="flex-1 p-5 overflow-y-auto space-y-4 custom-scroll select-none">
          {!isTestSubmitted ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white">Bài kiểm tra tổng hợp Địa lí</span>
                <span className="text-amber-400 font-mono">5 Câu hỏi trắc nghiệm</span>
              </div>

              {studyList.map((q, qIdx) => (
                <div key={q.id} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                  <h5 className="font-bold text-xs text-white">
                    Câu {qIdx + 1}: {q.front}
                  </h5>
                  <div className="space-y-1.5">
                    {q.options?.map((opt, oIdx) => (
                      <label
                        key={oIdx}
                        className={`p-2.5 rounded-xl border flex items-center gap-2.5 text-xs cursor-pointer transition-colors ${
                          testAnswers[qIdx] === oIdx
                            ? "bg-purple-600/30 border-purple-500 text-purple-200"
                            : "bg-slate-950/60 border-slate-800 hover:bg-slate-800 text-slate-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`test_q_${qIdx}`}
                          checked={testAnswers[qIdx] === oIdx}
                          onChange={() => setTestAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                          className="accent-purple-500"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmitTest}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold shadow-lg transition-colors"
              >
                Nộp bài kiểm tra
              </button>
            </div>
          ) : (
            /* Màn hình kết quả kiểm tra (T44, T45, T46) */
            <div className="space-y-4 text-center">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
                <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
                <h4 className="font-black text-xl text-white">Kết quả kiểm tra</h4>
                <div className="text-3xl font-black text-amber-400">
                  {testScore} / {studyList.length}
                </div>
                <p className="text-xs text-slate-400">
                  {testScore >= 4 ? "Xuất sắc! Bạn nắm rất vững kiến thức địa phương." : "Hãy tiếp tục ôn tập thêm các địa danh chưa nhớ nhé!"}
                </p>
              </div>

              {/* Danh sách câu hỏi cần ôn lại & Nút "Xem trên bản đồ" (T46) */}
              <div className="text-left space-y-2.5">
                <h5 className="font-bold text-xs text-slate-300">Chi tiết từng câu hỏi:</h5>
                {studyList.map((q, idx) => {
                  const isCorrect = testAnswers[idx] === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        isCorrect
                          ? "bg-emerald-950/30 border-emerald-800 text-emerald-200"
                          : "bg-red-950/30 border-red-800 text-red-200"
                      }`}
                    >
                      <div className="flex justify-between font-bold">
                        <span>Câu {idx + 1}: {isCorrect ? "✓ Đúng" : "✗ Chưa đúng"}</span>
                        {q.provinceCode && onLocateProvince && (
                          <button
                            onClick={() => onLocateProvince(q.provinceCode!)}
                            className="text-[10px] text-blue-400 hover:underline flex items-center gap-0.5"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>Xem trên map</span>
                          </button>
                        )}
                      </div>
                      <p className="text-slate-300">{q.front}</p>
                      <div className="text-[11px] text-slate-400">
                        Đáp án chuẩn: <strong>{q.back}</strong>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setIsTestSubmitted(false);
                  setTestAnswers({});
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700"
              >
                Làm lại bài kiểm tra
              </button>
            </div>
          )}
        </div>
      )}

      {/* CHẾ ĐỘ 4: GHÉP CẶP (MATCH) */}
      {activeMode === "match" && (
        <div className="flex-1 p-5 flex flex-col justify-between select-none">
          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white">Trò chơi Ghép cặp tốc độ</span>
              <span className="text-purple-400 font-mono flex items-center gap-1">
                <Timer className="w-3.5 h-3.5" />
                {matchSeconds}s
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { id: "m_1", text: "TP. Đà Nẵng", pair: "p_1" },
                { id: "p_1", text: "Huyện đảo Hoàng Sa", pair: "m_1" },
                { id: "m_2", text: "Tỉnh Khánh Hòa", pair: "p_2" },
                { id: "p_2", text: "Huyện đảo Trường Sa", pair: "m_2" },
                { id: "m_3", text: "Tỉnh Cà Mau", pair: "p_3" },
                { id: "p_3", text: "Mũi Cà Mau cực Nam", pair: "m_3" },
                { id: "m_4", text: "Dãy Bạch Mã", pair: "p_4" },
                { id: "p_4", text: "Ranh giới chắn gió Huế - Đà Nẵng", pair: "m_4" },
              ].map((tile) => {
                const isMatched = matchedIds.includes(tile.id);
                if (isMatched) {
                  return (
                    <div
                      key={tile.id}
                      className="h-16 rounded-xl border border-dashed border-slate-800 opacity-20"
                    />
                  );
                }

                const isSelected = matchSelected === tile.id;
                return (
                  <button
                    key={tile.id}
                    onClick={() => {
                      if (!matchSelected) {
                        setMatchSelected(tile.id);
                      } else if (matchSelected === tile.pair) {
                        setMatchedIds((prev) => [...prev, tile.id, matchSelected]);
                        setMatchSelected(null);
                        if (matchedIds.length + 2 >= 8) {
                          setIsMatchFinished(true);
                        }
                      } else {
                        setMatchSelected(null);
                      }
                    }}
                    className={`h-16 p-2 rounded-xl border text-xs font-semibold flex items-center justify-center text-center transition-all ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-400 scale-105 shadow-lg"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-200"
                    }`}
                  >
                    <span>{tile.text}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {matchedIds.length >= 8 && (
            <div className="p-4 bg-emerald-950/60 border border-emerald-700 rounded-2xl text-center space-y-2 animate-in zoom-in">
              <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
              <h5 className="font-bold text-sm text-emerald-300">Tuyệt vời! Bạn đã hoàn thành trong {matchSeconds} giây</h5>
              <button
                onClick={() => {
                  setMatchedIds([]);
                  setMatchSelected(null);
                  setMatchSeconds(0);
                  setIsMatchFinished(false);
                }}
                className="py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
              >
                Chơi lại
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
