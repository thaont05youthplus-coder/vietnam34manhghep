"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Minus,
  Square,
  Maximize2,
  Minimize2,
  LayoutGrid,
  Columns,
  Sparkles,
} from "lucide-react";
import { WindowState, SnapPosition } from "@/types/workspace";

interface WindowFrameProps {
  window: WindowState;
  onFocus: () => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  onSnap: (snap: SnapPosition) => void;
  onUpdatePosition: (x: number, y: number, width: number, height: number) => void;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({
  window: win,
  onFocus,
  onClose,
  onMinimize,
  onToggleMaximize,
  onSnap,
  onUpdatePosition,
  children,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [showSnapMenu, setShowSnapMenu] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);

  // Kéo di chuyển cửa sổ (Drag)
  const handleMouseDownHeader = (e: React.MouseEvent) => {
    if (win.isMaximized || win.snap !== "none") return;
    if ((e.target as HTMLElement).closest("button")) return; // Không drag khi bấm nút
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - win.x,
      y: e.clientY - win.y,
    });
    onFocus();
  };

  // Thay đổi kích thước (Resize)
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (win.isMaximized || win.snap !== "none") return;
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      w: win.width,
      h: win.height,
    });
    onFocus();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = Math.max(10, Math.min(e.clientX - dragOffset.x, window.innerWidth - win.width - 10));
        const newY = Math.max(75, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100));
        onUpdatePosition(newX, newY, win.width, win.height);
      } else if (isResizing) {
        const dx = e.clientX - resizeStart.x;
        const dy = e.clientY - resizeStart.y;
        // Giới hạn độ rộng tối đa để bảo vệ tối thiểu 40% diện tích bản đồ
        const maxAllowedW = window.innerWidth * 0.6;
        const newW = Math.max(win.minWidth, Math.min(resizeStart.w + dx, maxAllowedW));
        const newH = Math.max(win.minHeight, Math.min(resizeStart.h + dy, window.innerHeight - 120));
        onUpdatePosition(win.x, win.y, newW, newH);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStart, win, onUpdatePosition]);

  if (!win.isOpen || win.isMinimized) return null;

  // Tính toán vị trí và kích thước theo chế độ Ghim (Snap)
  let style: React.CSSProperties = {
    zIndex: win.zIndex,
  };

  if (win.isMaximized) {
    style = {
      ...style,
      top: 68,
      left: 64,
      width: "calc(100vw - 64px)",
      height: "calc(100vh - 68px)",
      borderRadius: 0,
    };
  } else if (win.snap === "right-half") {
    // Ghim nửa màn hình bên phải: Bảo toàn tối thiểu 45% bên trái cho bản đồ
    style = {
      ...style,
      top: 76,
      right: 12,
      width: "min(520px, 50vw)",
      height: "calc(100vh - 88px)",
    };
  } else if (win.snap === "left-half") {
    // Ghim nửa màn hình bên trái (kề sát sidebar)
    style = {
      ...style,
      top: 76,
      left: 76,
      width: "min(500px, 48vw)",
      height: "calc(100vh - 88px)",
    };
  } else if (win.snap === "top-right-quarter") {
    // Ghim góc 1/4 trên bên phải
    style = {
      ...style,
      top: 76,
      right: 12,
      width: "min(460px, 45vw)",
      height: "calc((100vh - 96px) / 2)",
    };
  } else if (win.snap === "bottom-right-quarter") {
    // Ghim góc 1/4 dưới bên phải
    style = {
      ...style,
      bottom: 12,
      right: 12,
      width: "min(460px, 45vw)",
      height: "calc((100vh - 96px) / 2)",
    };
  } else {
    // Chế độ Trôi nổi tự do (Floating)
    style = {
      ...style,
      top: win.y,
      left: win.x,
      width: win.width,
      height: win.height,
    };
  }

  return (
    <div
      ref={frameRef}
      style={style}
      onClick={onFocus}
      className={`fixed flex flex-col bg-[#081a36]/95 border border-sky-700/60 rounded-2xl shadow-2xl shadow-sky-950/60 backdrop-blur-xl overflow-hidden transition-all duration-150 ${
        win.zIndex >= 50 ? "ring-2 ring-sky-400/40" : ""
      }`}
    >
      {/* Title Bar / Header Cửa sổ */}
      <div
        onMouseDown={handleMouseDownHeader}
        className={`h-10 px-3 bg-[#0a2144]/90 border-b border-sky-800/50 flex items-center justify-between select-none ${
          win.snap === "none" && !win.isMaximized ? "cursor-grab active:cursor-grabbing" : ""
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-red-500 to-amber-400 shadow-sm" />
          <h4 className="font-bold text-xs text-white truncate">{win.title}</h4>
          {win.snap !== "none" && (
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-950/80 text-sky-200 border border-sky-700/60 font-mono">
              Ghim {win.snap.replace("-", " ")}
            </span>
          )}
        </div>

        {/* Nút điều khiển cửa sổ: Snap, Minimize, Maximize, Close */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Menu chọn chế độ Snap */}
          <div className="relative">
            <button
              onClick={() => setShowSnapMenu((prev) => !prev)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
              title="Ghim bố cục (1/2, 1/4, Trôi nổi)"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>

            {showSnapMenu && (
              <div className="absolute right-0 top-7 w-48 p-1.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 text-[11px] space-y-1">
                <button
                  onClick={() => {
                    onSnap("right-half");
                    setShowSnapMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                >
                  <span>Ghim 1/2 bên phải</span>
                  <span className="text-[9px] text-amber-400 font-mono">Bảo toàn 50% map</span>
                </button>
                <button
                  onClick={() => {
                    onSnap("left-half");
                    setShowSnapMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200"
                >
                  Ghim 1/2 bên trái
                </button>
                <button
                  onClick={() => {
                    onSnap("top-right-quarter");
                    setShowSnapMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200"
                >
                  Ghim 1/4 góc trên phải
                </button>
                <button
                  onClick={() => {
                    onSnap("bottom-right-quarter");
                    setShowSnapMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-200"
                >
                  Ghim 1/4 góc dưới phải
                </button>
                <div className="h-px bg-slate-800 my-1" />
                <button
                  onClick={() => {
                    onSnap("none");
                    setShowSnapMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-amber-300 font-semibold"
                >
                  Trôi nổi tự do (Kéo thả)
                </button>
              </div>
            )}
          </div>

          {/* Thu nhỏ xuống Taskbar */}
          <button
            onClick={onMinimize}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            title="Thu nhỏ xuống thanh tác vụ"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Phóng to / Khôi phục */}
          <button
            onClick={onToggleMaximize}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            title={win.isMaximized ? "Khôi phục kích thước" : "Phóng to tối đa"}
          >
            {win.isMaximized ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Đóng cửa sổ */}
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-red-950/50"
            title="Đóng cửa sổ"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Nội dung cửa sổ */}
      <div className="flex-1 overflow-hidden">{children}</div>

      {/* Resize Handle ở góc dưới bên phải (chỉ hiện khi ở chế độ floating) */}
      {win.snap === "none" && !win.isMaximized && (
        <div
          onMouseDown={handleMouseDownResize}
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center text-slate-600 hover:text-slate-300"
          title="Kéo để thay đổi kích thước"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" className="opacity-70">
            <line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.5" />
            <line x1="8" y1="5" x2="5" y2="8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
      )}
    </div>
  );
};
