"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  PenTool,
  Palette,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Share2,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Plus,
  Camera,
} from "lucide-react";
import { ProvinceFeature } from "@/types/geo";

interface NoteStroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
  isHighlighter: boolean;
  isEraser: boolean;
}

interface DualNotesModalProps {
  selectedProvince: ProvinceFeature | null;
  initialNoteText?: string;
}

export const DualNotesModal: React.FC<DualNotesModalProps> = ({
  selectedProvince,
  initialNoteText,
}) => {
  const [activeMode, setActiveMode] = useState<"text" | "canvas">("text");

  // State văn bản
  const [noteTitle, setNoteTitle] = useState(
    selectedProvince
      ? `Ghi chú Địa lí: ${selectedProvince.properties.name}`
      : "Ghi chú Địa lí Việt Nam"
  );
  const [textContent, setTextContent] = useState(
    initialNoteText ||
      (selectedProvince
        ? `### Khảo cứu địa phương: ${selectedProvince.properties.name}\n- Mã tỉnh: ${selectedProvince.properties.provinceCode}\n- Phân loại: ${selectedProvince.properties.type}\n- Diện tích tự nhiên: ${selectedProvince.properties.areaSqKm.toLocaleString("vi-VN")} km²\n\n#### 1. Đặc điểm tự nhiên & Địa hình:\n- \n\n#### 2. Thế mạnh kinh tế & Định hướng:\n- \n`
        : `### Ghi chú tổng hợp Địa lí Việt Nam 34 Mảnh ghép\n- Ngày ghi chú: ${new Date().toLocaleDateString("vi-VN")}\n- Kiến thức trọng tâm:\n  + \n`)
  );

  // Trạng thái lưu (Auto-save T38)
  const [saveStatus, setSaveStatus] = useState<"saving" | "saved">("saved");
  const [lastSavedTime, setLastSavedTime] = useState<string>("Vừa xong");

  // State công cụ vẽ Canvas
  const [activeTool, setActiveTool] = useState<"pen" | "highlighter" | "eraser">("pen");
  const [penColor, setPenColor] = useState<string>("#fbbf24"); // Mặc định màu vàng hổ phách
  const [penWidth, setPenWidth] = useState<number>(3);

  // Lịch sử nét vẽ (Undo / Redo T37)
  const [strokes, setStrokes] = useState<NoteStroke[]>([]);
  const [redoStack, setRedoStack] = useState<NoteStroke[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<NoteStroke | null>(null);

  // Cập nhật khi có initialNoteText từ Chatbox gửi qua
  useEffect(() => {
    if (initialNoteText) {
      setTextContent((prev) => `${prev}\n\n---\n**Trích từ Trợ lí AI:**\n${initialNoteText}`);
      setActiveMode("text");
    }
  }, [initialNoteText]);

  // Tự động lưu sau 1 giây ngừng nhập (T38)
  useEffect(() => {
    setSaveStatus("saving");
    const timer = setTimeout(() => {
      setSaveStatus("saved");
      setLastSavedTime(
        new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      // Lưu vào localStorage
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("vn34mg_note_title", noteTitle);
          localStorage.setItem("vn34mg_note_text", textContent);
        } catch (e) {
          console.warn("Không thể lưu localStorage:", e);
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [textContent, noteTitle]);

  // Khôi phục từ localStorage khi mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTitle = localStorage.getItem("vn34mg_note_title");
      const savedText = localStorage.getItem("vn34mg_note_text");
      if (savedTitle && !selectedProvince) setNoteTitle(savedTitle);
      if (savedText && !initialNoteText && !selectedProvince) setTextContent(savedText);
    }
  }, []);

  // Vẽ lại toàn bộ strokes lên Canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.isEraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = stroke.width * 3;
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      } else if (stroke.isHighlighter) {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = stroke.color;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = stroke.width * 3.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.stroke();
      }
    });
  }, [strokes]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Pointer Events trên Canvas (T36)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    const newStroke: NoteStroke = {
      points: [{ x, y }],
      color: penColor,
      width: penWidth,
      isHighlighter: activeTool === "highlighter",
      isEraser: activeTool === "eraser",
    };
    currentStrokeRef.current = newStroke;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.arc(x, y, penWidth / 2, 0, Math.PI * 2);
      ctx.fillStyle = activeTool === "eraser" ? "#000" : penColor;
      ctx.fill();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentStrokeRef.current.points.push({ x, y });

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pts = currentStrokeRef.current.points;
    if (pts.length >= 2) {
      const p1 = pts[pts.length - 2];
      const p2 = pts[pts.length - 1];

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (currentStrokeRef.current.isEraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = penWidth * 3;
        ctx.stroke();
        ctx.globalCompositeOperation = "source-over";
      } else if (currentStrokeRef.current.isHighlighter) {
        ctx.strokeStyle = penColor;
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = penWidth * 3.5;
        ctx.stroke();
        ctx.globalAlpha = 1.0;
      } else {
        ctx.strokeStyle = penColor;
        ctx.lineWidth = penWidth;
        ctx.stroke();
      }
    }
  };

  const handlePointerUp = () => {
    if (isDrawingRef.current && currentStrokeRef.current) {
      isDrawingRef.current = false;
      setStrokes((prev) => [...prev, currentStrokeRef.current!]);
      setRedoStack([]); // Xóa redo khi có nét vẽ mới
      currentStrokeRef.current = null;
    }
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    setStrokes((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, last]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setStrokes((prev) => [...prev, next]);
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ nét vẽ trên bảng vẽ?")) {
      setStrokes([]);
      setRedoStack([]);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Chèn ảnh chụp bản đồ vào ghi chú (Mục 16.4.2)
  const handleInsertMapSnapshot = () => {
    const provName = selectedProvince?.properties.name || "Toàn cảnh Việt Nam";
    setTextContent((prev) => `${prev}\n\n![Bản đồ ${provName}](https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=600&q=80)\n*Ảnh chụp bản đồ tham chiếu không gian địa phương ${provName}*\n`);
    alert(`Đã chèn ảnh bản đồ minh họa của ${provName} vào ghi chú!`);
  };

  // Xuất file ghi chú dạng Markdown (.md)
  const handleExportNote = () => {
    const filename = `${noteTitle.replace(/[^a-zA-Z0-9\u00C0-\u024F\u1EA0-\u1EF9]/g, "_")}.md`;
    const fullContent = `# ${noteTitle}\n\n*Ngày xuất: ${new Date().toLocaleString("vi-VN")}*\n\n${textContent}`;
    const blob = new Blob([fullContent], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 select-text">
      {/* Header thanh công cụ Ghi chú */}
      <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          {/* Chuyển đổi Văn bản / Vẽ tay */}
          <div className="flex bg-slate-800 p-0.5 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveMode("text")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeMode === "text"
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Văn bản</span>
            </button>
            <button
              onClick={() => setActiveMode("canvas")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeMode === "canvas"
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Vẽ tay</span>
            </button>
          </div>

          {selectedProvince && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-blue-300 border border-slate-700 font-semibold hidden sm:inline">
              📍 {selectedProvince.properties.name}
            </span>
          )}
        </div>

        {/* Trạng thái tự lưu, Chèn ảnh map & Xuất file (T38) */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
            {saveStatus === "saving" ? (
              <span className="text-amber-400 animate-pulse">Đang lưu...</span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>Đã tự lưu: {lastSavedTime}</span>
              </span>
            )}
          </div>

          <button
            onClick={handleInsertMapSnapshot}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors border border-slate-700"
            title="Chèn ảnh bản đồ đang xem vào ghi chú"
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={handleExportNote}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors border border-slate-700 flex items-center gap-1 text-[11px]"
            title="Tải ghi chú về máy dạng Markdown (.md)"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Xuất file</span>
          </button>
        </div>
      </div>

      {/* Vùng Tiêu đề Ghi chú */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800/80 shrink-0">
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Tiêu đề trang ghi chú..."
          className="w-full bg-transparent font-bold text-sm text-white focus:outline-none placeholder-slate-500"
        />
      </div>

      {/* VÙNG 1: GÕ VĂN BẢN (Text mode) */}
      {activeMode === "text" && (
        <div className="flex-1 p-3">
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Nhập nội dung bài học, ý chính, bài tập hoặc dàn ý nghiên cứu..."
            className="w-full h-full p-4 bg-slate-900/40 border border-slate-800 rounded-2xl text-xs text-slate-100 font-mono leading-relaxed focus:outline-none focus:border-amber-500/80 resize-none custom-scroll shadow-inner"
          />
        </div>
      )}

      {/* VÙNG 2: BẢNG VẼ TAY IPAD-STYLE CANVAS (Canvas mode T36, T37) */}
      {activeMode === "canvas" && (
        <div className="flex-1 flex flex-col p-3 overflow-hidden">
          {/* Bảng công cụ bút vẽ (Palette & Thickness) */}
          <div className="p-2 mb-2 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between shrink-0">
            {/* Bộ công cụ: Bút mực, Dạ quang, Tẩy */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTool("pen")}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeTool === "pen"
                    ? "bg-amber-600 text-white shadow"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
                title="Bút mực nét rõ"
              >
                <PenTool className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool("highlighter")}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeTool === "highlighter"
                    ? "bg-yellow-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
                title="Bút dạ quang (trong suốt)"
              >
                <Palette className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTool("eraser")}
                className={`p-1.5 rounded-lg transition-colors ${
                  activeTool === "eraser"
                    ? "bg-red-600 text-white shadow"
                    : "text-slate-400 hover:bg-slate-800"
                }`}
                title="Tẩy nét vẽ"
              >
                <Eraser className="w-4 h-4" />
              </button>
            </div>

            {/* Bảng màu sắc */}
            {activeTool !== "eraser" && (
              <div className="flex items-center gap-1">
                {["#fbbf24", "#38bdf8", "#10b981", "#ef4444", "#f8fafc"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setPenColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-5 h-5 rounded-full border transition-transform ${
                      penColor === c ? "scale-125 border-white shadow" : "border-slate-700"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Độ dày nét vẽ */}
            <div className="flex items-center gap-1">
              {[2, 4, 8].map((w) => (
                <button
                  key={w}
                  onClick={() => setPenWidth(w)}
                  className={`w-6 h-6 rounded-lg text-[10px] font-bold border transition-colors ${
                    penWidth === w
                      ? "bg-slate-700 text-white border-amber-400"
                      : "bg-slate-850 text-slate-400 border-slate-800"
                  }`}
                >
                  {w}px
                </button>
              ))}
            </div>

            {/* Undo / Redo / Clear */}
            <div className="flex items-center gap-1 pl-2 border-l border-slate-800">
              <button
                onClick={handleUndo}
                disabled={strokes.length === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                title="Hoàn tác (Undo)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={redoStack.length === 0}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800"
                title="Làm lại (Redo)"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleClearAll}
                className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800"
                title="Xóa toàn bộ bản vẽ"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Khung Canvas Pointer Events */}
          <div className="relative flex-1 bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={750}
              height={500}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerUp}
              className="touch-none cursor-crosshair bg-transparent"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
