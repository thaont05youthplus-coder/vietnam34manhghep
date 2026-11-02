"use client";

import React from "react";
import {
  Map,
  MessageSquare,
  HelpCircle,
  PenTool,
  GraduationCap,
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
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
    name: "Hỏi đáp",
    shortDesc: "Chatbox AI trích dẫn nguồn",
    icon: MessageSquare,
    badge: "AI",
    color: "from-sky-500 to-blue-600",
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
    id: "questions",
    name: "Bộ câu hỏi",
    shortDesc: "Ngân hàng 5 cấp Naugh Milk style",
    icon: HelpCircle,
    badge: "5 Cấp",
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "study",
    name: "Học & kiểm tra",
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
  const isAnyToolActive = Object.values(activeTools).some(Boolean);

  return (
    <aside
      className={`relative z-20 h-full bg-white border-r border-slate-200 transition-all duration-300 flex flex-col justify-between shrink-0 select-none shadow-xs text-slate-700 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      {/* Cụm trên: Nút Bản đồ (chính) & 4 công cụ học tập */}
      <div className="flex flex-col p-2 space-y-1.5">
        {/* Nút Bản đồ chính (Active màu xanh đậm đặc trưng chuẩn như ảnh thiết kế) */}
        <button
          onClick={onResetLayout}
          title="Bản đồ GIS toàn cảnh Việt Nam"
          className={`flex items-center rounded-xl p-2.5 transition-all text-left ${
            !isAnyToolActive
              ? "bg-[#114b43] text-white shadow-xs font-bold"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent font-medium"
          } ${isOpen ? "gap-3 px-3" : "flex-col justify-center gap-1"}`}
        >
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              !isAnyToolActive
                ? "bg-white/20 text-white shadow-xs"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            <Map className="w-4 h-4" />
          </div>
          <span className={`truncate text-xs ${!isOpen ? "text-[10px]" : ""}`}>
            Bản đồ
          </span>
        </button>

        {/* Danh sách 4 công cụ */}
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
                  ? "bg-[#114b43] text-white font-bold shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent font-medium"
              } ${isOpen ? "gap-3 px-3" : "flex-col justify-center gap-1"}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                  isActive
                    ? "bg-white/20 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span
                className={`truncate text-xs ${
                  !isOpen ? "text-[10px] text-center" : "flex-1"
                }`}
              >
                {tool.name}
              </span>

              {/* Chấm tròn biểu thị trạng thái đang mở */}
              {isActive && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-teal-300 ring-2 ring-[#114b43]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Cụm dưới: Feedback (💬), Settings (⚙️) & Nút thu gọn / mở rộng */}
      <div className="p-2 border-t border-slate-200 flex flex-col gap-1.5">
        {/* Nút Phản hồi */}
        <button
          onClick={() => alert("Hòm thư góp ý & phản hồi dự án Việt Nam 34 Mảnh Ghép.")}
          className={`flex items-center rounded-xl p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
            isOpen ? "gap-2.5 px-3" : "justify-center"
          }`}
          title="Góp ý &amp; Phản hồi"
        >
          <MessageCircle className="w-4 h-4" />
          {isOpen && <span className="text-xs font-medium">Góp ý</span>}
        </button>

        {/* Nút Cài đặt */}
        <button
          onClick={() => alert("Cài đặt hiển thị & dữ liệu bản đồ.")}
          className={`flex items-center rounded-xl p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors ${
            isOpen ? "gap-2.5 px-3" : "justify-center"
          }`}
          title="Cài đặt hệ thống"
        >
          <Settings className="w-4 h-4" />
          {isOpen && <span className="text-xs font-medium">Cài đặt</span>}
        </button>

        {/* Nút Thu gọn / Mở rộng Sidebar */}
        <button
          onClick={onToggle}
          className={`flex items-center rounded-xl p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ${
            isOpen ? "justify-between px-3" : "justify-center"
          }`}
          title={isOpen ? "Thu gọn menu (64px)" : "Mở rộng menu (240px)"}
        >
          {isOpen && <span className="text-xs font-medium">Thu gọn</span>}
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
