"use client";

import React from "react";
import {
  MessageSquare,
  HelpCircle,
  PenTool,
  GraduationCap,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  Sparkles,
} from "lucide-react";
import { ToolId } from "@/types/workspace";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeTools: Record<ToolId, boolean>;
  onToggleTool: (toolId: ToolId) => void;
  onResetLayout: () => void;
}

interface ToolItem {
  id: ToolId;
  name: string;
  shortDesc: string;
  icon: React.ElementType;
  badge?: string;
  color: string;
}

const TOOLS: ToolItem[] = [
  {
    id: "chat",
    name: "Chatbox AI Địa lí",
    shortDesc: "Hỏi đáp ngữ cảnh & trích dẫn nguồn",
    icon: MessageSquare,
    badge: "AI",
    color: "from-sky-500 to-blue-600",
  },
  {
    id: "questions",
    name: "Ngân hàng Câu hỏi",
    shortDesc: "Phân tầng 5 cấp Naugh Milk style",
    icon: HelpCircle,
    badge: "5 Cấp",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "notes",
    name: "Ghi chú",
    shortDesc: "Văn bản & vẽ tay tự lưu",
    icon: PenTool,
    badge: "Canvas",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "study",
    name: "Học & Kiểm tra",
    shortDesc: "Flashcard, Luyện tập, Test, Ghép thẻ",
    icon: GraduationCap,
    badge: "Quizlet",
    color: "from-rose-500 to-red-600",
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeTools,
  onToggleTool,
  onResetLayout,
}) => {
  return (
    <aside
      className={`relative z-20 h-full bg-[#07152b]/95 border-r border-sky-900/40 transition-all duration-300 flex flex-col justify-between shrink-0 select-none shadow-xl ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Phần trên: Danh sách 4 công cụ chính */}
      <div className="flex flex-col p-2 space-y-1">
        {isOpen && (
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Công cụ học tập</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-800">
              4 Modules
            </span>
          </div>
        )}

        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTools[tool.id];

          return (
            <button
              key={tool.id}
              onClick={() => onToggleTool(tool.id)}
              title={!isOpen ? `${tool.name} - ${tool.shortDesc}` : undefined}
              className={`group relative flex items-center rounded-xl p-2.5 transition-all text-left ${
                isActive
                  ? "bg-blue-600/20 text-white border border-blue-500/40 shadow-sm"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent"
              } ${isOpen ? "gap-3 px-3" : "justify-center"}`}
            >
              {/* Icon với hiệu ứng gradient */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-md ${
                  isActive
                    ? `bg-gradient-to-tr ${tool.color} text-white shadow-blue-500/20`
                    : "bg-slate-800 text-slate-300 group-hover:text-white group-hover:bg-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              {/* Thông tin nhãn khi Sidebar mở rộng */}
              {isOpen && (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate">
                      {tool.name}
                    </span>
                    {tool.badge && (
                      <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {tool.shortDesc}
                  </p>
                </div>
              )}

              {/* Chấm tròn biểu thị trạng thái đang mở */}
              {isActive && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400 ring-2 ring-blue-900 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Phần dưới: Thông số hệ thống & Nút thu gọn / mở rộng */}
      <div className="p-2 border-t border-slate-800/80 flex flex-col gap-2">
        {/* Hộp thông số thu gọn/mở rộng */}
        {isOpen ? (
          <div className="p-2.5 bg-[#050f1f]/80 border border-sky-800/40 rounded-xl text-[11px] text-sky-200/70 space-y-2">
            <div className="flex items-center gap-2">
              <img
                src="/logo.jpg"
                alt="Logo"
                className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 border border-sky-400/40 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-white text-[11px] truncate">Việt Nam 34 Mảnh ghép</span>
                <span className="text-[9px] text-amber-300 font-medium">Bản đồ số Quốc gia</span>
              </div>
            </div>
            <div className="pt-1.5 border-t border-sky-900/50 space-y-1">
              <div className="flex justify-between text-[10px]">
                <span>Tỉnh / Thành phố:</span>
                <span className="text-white font-bold">34</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Vùng KT-XH / Tự nhiên:</span>
                <span className="text-white font-bold">6 / 7</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>Chủ quyền biển đảo:</span>
                <span className="text-emerald-300 font-bold">Hoàng Sa + Trường Sa</span>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="w-10 h-10 mx-auto rounded-xl bg-white/90 p-0.5 border border-sky-400/40 flex items-center justify-center cursor-pointer shadow-sm overflow-hidden"
            title="Dự án Việt Nam 34 Mảnh Ghép"
          >
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
        )}

        {/* Nút bấm chuyển đổi thu gọn / mở rộng */}
        <button
          onClick={onToggle}
          className={`flex items-center rounded-xl p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors ${
            isOpen ? "justify-between px-3" : "justify-center"
          }`}
          title={isOpen ? "Thu gọn thanh công cụ (56px)" : "Mở rộng thanh công cụ (240px)"}
        >
          {isOpen && <span className="text-xs font-medium">Thu gọn menu</span>}
          {isOpen ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </aside>
  );
};
