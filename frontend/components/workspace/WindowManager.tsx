"use client";

import React, { useState } from "react";
import { ToolId, WindowState, SnapPosition } from "@/types/workspace";
import { WindowFrame } from "./WindowFrame";
import { ToolContent } from "./ToolViews";
import { ProvinceFeature } from "@/types/geo";
import { GeoQuestion } from "@/components/question-bank/QuestionBankModal";

interface WindowManagerProps {
  windows: Record<ToolId, WindowState>;
  onUpdateWindow: (id: ToolId, updater: (prev: WindowState) => WindowState) => void;
  onFocusWindow: (id: ToolId) => void;
  onCloseWindow: (id: ToolId) => void;
  selectedProvince: ProvinceFeature | null;
  onLocateProvince?: (provinceCode: string) => void;
  onOpenNotesWithText?: (text: string) => void;
  onAddToStudy?: (question: GeoQuestion) => void;
  sharedNoteText?: string;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  onUpdateWindow,
  onFocusWindow,
  onCloseWindow,
  selectedProvince,
  onLocateProvince,
  onOpenNotesWithText,
  onAddToStudy,
  sharedNoteText,
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
            <ToolContent
              toolId={win.id}
              selectedProvince={selectedProvince}
              onLocateProvince={onLocateProvince}
              onOpenNotesWithText={onOpenNotesWithText}
              onAddToStudy={onAddToStudy}
              sharedNoteText={sharedNoteText}
            />
          </WindowFrame>
        ))}

      {/* Thanh Taskbar Dock nổi ở góc dưới cho các cửa sổ bị thu nhỏ */}
      {minimizedWindowList.length > 0 && (
        <div className="fixed bottom-4 left-24 z-40 flex items-center gap-2 p-1.5 bg-[#081a36]/95 border border-sky-700/60 rounded-2xl shadow-2xl shadow-sky-950/60 backdrop-blur-xl animate-in slide-in-from-bottom duration-200">
          <span className="text-[10px] font-bold text-sky-300 px-2 uppercase tracking-wider">
            Thu nhỏ:
          </span>
          {minimizedWindowList.map((win) => (
            <button
              key={win.id}
              onClick={() => {
                onUpdateWindow(win.id, (prev) => ({ ...prev, isMinimized: false }));
                onFocusWindow(win.id);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-sky-950/80 hover:bg-sky-900/90 border border-sky-600/60 text-sky-200 rounded-xl text-xs font-semibold transition-all hover:scale-105 shadow-md"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{win.title}</span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};
