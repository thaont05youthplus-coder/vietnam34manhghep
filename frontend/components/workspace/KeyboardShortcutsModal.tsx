"use client";

import React from "react";
import { Keyboard, X, Sparkles, Map, MessageSquare, HelpCircle, PenTool, GraduationCap } from "lucide-react";

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      group: "Chế độ Bản đồ (Mục 4 Spec)",
      items: [
        { key: "1", desc: "Chuyển sang chế độ Hành chính (34 tỉnh)", icon: Map },
        { key: "2", desc: "Chuyển sang chế độ Tự nhiên (7 khu vực)", icon: Map },
        { key: "3", desc: "Chuyển sang chế độ Kinh tế - Xã hội (6 vùng)", icon: Map },
      ],
    },
    {
      group: "Mở nhanh 4 Công cụ Học tập (Mục 16 Spec)",
      items: [
        { key: "C", desc: "Mở / Thu nhỏ Chatbox AI Địa lí", icon: MessageSquare },
        { key: "Q", desc: "Mở / Thu nhỏ Ngân hàng Câu hỏi 5 Cấp", icon: HelpCircle },
        { key: "N", desc: "Mở / Thu nhỏ Ghi chú (Text + Canvas)", icon: PenTool },
        { key: "S", desc: "Mở / Thu nhỏ Học & Kiểm tra Quizlet", icon: GraduationCap },
      ],
    },
    {
      group: "Điều hướng & Thao tác Không gian làm việc",
      items: [
        { key: "Esc", desc: "Đóng cửa sổ đang chọn hoặc Panel chi tiết tỉnh", icon: X },
        { key: "?", desc: "Bật / tắt bảng hướng dẫn phím tắt này", icon: Keyboard },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Phím tắt Bàn phím (Accessibility)</h3>
              <p className="text-[11px] text-slate-400">Thao tác nhanh không cần dùng chuột theo chuẩn Mục 14</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto custom-scroll">
          {shortcutGroups.map((grp, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90">
                {grp.group}
              </h4>
              <div className="grid gap-2">
                {grp.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={iIdx}
                      className="flex items-center justify-between p-2.5 bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 text-xs text-slate-200">
                        <Icon className="w-4 h-4 text-slate-400" />
                        <span>{item.desc}</span>
                      </div>
                      <kbd className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono font-bold text-amber-300 shadow-inner">
                        {item.key}
                      </kbd>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Nhấn <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-amber-300 font-mono">?</kbd> để bật tắt bảng này mọi lúc</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
