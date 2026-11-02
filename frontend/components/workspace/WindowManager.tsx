"use client";

import React, { useState } from "react";
import { ToolId, WindowState, SnapPosition } from "@/types/workspace";
import { WindowFrame } from "./WindowFrame";
import { ToolContent } from "./ToolViews";
import { ProvinceFeature } from "@/types/geo";
import { MessageSquare, HelpCircle, PenTool, GraduationCap } from "lucide-react";

interface WindowManagerProps {
  windows: Record<ToolId, WindowState>;
  onUpdateWindow: (id: ToolId, updater: (prev: WindowState) => WindowState) => void;
  onFocusWindow: (id: ToolId) => void;
  onCloseWindow: (id: ToolId) => void;
  selectedProvince: ProvinceFeature | null;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  onUpdateWindow,
  onFocusWindow,
  onCloseWindow,
  selectedProvince,
}) => {
  // Danh sách các cửa sổ đang mở hoặc bị thu nhỏ
  const activeWindowList = Object.values(windows).filter((w) => w.isOpen);
  const minimizedWindowList = activeWindowList.filter((w) => w.isMinimized);

  return (
    <>
      {/* Hiển thị các cửa sổ đang mở (không bị thu nhỏ) */}
      {activeWindowList
        .filter((w) => !w.isMinimized)
        .map((win) => (
          <WindowFrame
            key={win.id}
            window={win}
            onFocus={() => onFocusWindow(win.id)}
            onClose={() => onCloseWindow(win.id)}
            onMinimize={() => {
              onUpdateWindow(win.id, (prev) => ({ ...prev, isMinimized: true }));
            }}
            onToggleMaximize={() => {
              onUpdateWindow(win.id, (prev) => ({
                ...prev,
                isMaximized: !prev.isMaximized,
                snap: prev.isMaximized ? "none" : prev.snap,
              }));
            }}
            onSnap={(snap: SnapPosition) => {
              onUpdateWindow(win.id, (prev) => ({
                ...prev,
                snap,
                isMaximized: false,
              }));
            }}
            onUpdatePosition={(x, y, width, height) => {
              onUpdateWindow(win.id, (prev) => ({
                ...prev,
                x,
                y,
                width,
                height,
              }));
            }}
          >
            <ToolContent toolId={win.id} selectedProvince={selectedProvince} />
          </WindowFrame>
        ))}

      {/* Thanh Taskbar Dock nổi ở góc dưới cho các cửa sổ bị thu nhỏ */}
      {minimizedWindowList.length > 0 && (
        <div className="fixed bottom-4 left-24 z-40 flex items-center gap-2 p-1.5 bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
          <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
            Thu nhỏ:
          </span>
          {minimizedWindowList.map((win) => (
            <button
              key={win.id}
              onClick={() => {
                onUpdateWindow(win.id, (prev) => ({ ...prev, isMinimized: false }));
                onFocusWindow(win.id);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600/70 text-slate-200 rounded-xl text-xs font-semibold transition-all hover:scale-105 shadow-md"
            >
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>{win.title}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};
