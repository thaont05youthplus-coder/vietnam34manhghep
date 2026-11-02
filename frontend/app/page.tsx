"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { WindowManager } from "@/components/workspace/WindowManager";
import { VietnamMap } from "@/components/map/VietnamMap";
import { ProvinceFeature, ProvinceFeatureCollection, MapMode } from "@/types/geo";
import { ToolId, WindowState, SnapPosition } from "@/types/workspace";
import { ECONOMIC_REGIONS, NATURAL_REGIONS } from "@/lib/regions";
import { X, ExternalLink, Layers, Sparkles } from "lucide-react";

export default function HomePage() {
  const [provinces, setProvinces] = useState<ProvinceFeature[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceFeature | null>(null);
  const [mode, setMode] = useState<MapMode>("hanh_chinh");

  // Trạng thái Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Z-index cao nhất hiện tại cho các cửa sổ
  const [maxZIndex, setMaxZIndex] = useState(40);

  // Quản lý trạng thái 4 cửa sổ công cụ (Window Manager)
  const [windows, setWindows] = useState<Record<ToolId, WindowState>>({
    chat: {
      id: "chat",
      title: "Chatbox AI Hỏi đáp Địa lí",
      iconName: "MessageSquare",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      snap: "right-half",
      x: 100,
      y: 90,
      width: 480,
      height: 560,
      zIndex: 40,
      minWidth: 320,
      minHeight: 380,
    },
    questions: {
      id: "questions",
      title: "Ngân hàng Câu hỏi 5 Cấp",
      iconName: "HelpCircle",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      snap: "right-half",
      x: 140,
      y: 110,
      width: 500,
      height: 560,
      zIndex: 40,
      minWidth: 340,
      minHeight: 400,
    },
    notes: {
      id: "notes",
      title: "Ghi chú kép iPad (Text + Canvas)",
      iconName: "PenTool",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      snap: "none",
      x: 180,
      y: 130,
      width: 460,
      height: 520,
      zIndex: 40,
      minWidth: 320,
      minHeight: 360,
    },
    study: {
      id: "study",
      title: "Học & Kiểm tra Quizlet-style",
      iconName: "GraduationCap",
      isOpen: false,
      isMinimized: false,
      isMaximized: false,
      snap: "none",
      x: 220,
      y: 150,
      width: 520,
      height: 540,
      zIndex: 40,
      minWidth: 360,
      minHeight: 400,
    },
  });

  // Tải danh sách tỉnh thành phục vụ tìm kiếm ở Header
  useEffect(() => {
    fetch("/data/vietnam_34_provinces.geojson")
      .then((res) => res.json())
      .then((data: ProvinceFeatureCollection) => {
        if (data && data.features) {
          setProvinces(data.features);
        }
      })
      .catch((err) => console.error("Lỗi tải danh sách tỉnh thành:", err));
  }, []);

  // Tiêu điểm cửa sổ (Bring to front)
  const handleFocusWindow = useCallback((id: ToolId) => {
    setMaxZIndex((prev) => {
      const nextZ = prev + 1;
      setWindows((curr) => ({
        ...curr,
        [id]: {
          ...curr[id],
          zIndex: nextZ,
          isMinimized: false,
        },
      }));
      return nextZ;
    });
  }, []);

  // Bật/tắt mở công cụ từ Sidebar
  const handleToggleTool = useCallback(
    (toolId: ToolId) => {
      setWindows((curr) => {
        const win = curr[toolId];
        const nextIsOpen = !win.isOpen;
        const nextMaxZ = maxZIndex + 1;
        setMaxZIndex(nextMaxZ);
        return {
          ...curr,
          [toolId]: {
            ...win,
            isOpen: nextIsOpen,
            isMinimized: false,
            zIndex: nextIsOpen ? nextMaxZ : win.zIndex,
          },
        };
      });
    },
    [maxZIndex]
  );

  // Đóng cửa sổ
  const handleCloseWindow = useCallback((toolId: ToolId) => {
    setWindows((curr) => ({
      ...curr,
      [toolId]: {
        ...curr[toolId],
        isOpen: false,
      },
    }));
  }, []);

  // Cập nhật thuộc tính của một cửa sổ
  const handleUpdateWindow = useCallback(
    (id: ToolId, updater: (prev: WindowState) => WindowState) => {
      setWindows((curr) => ({
        ...curr,
        [id]: updater(curr[id]),
      }));
    },
    []
  );

  // Nút "Đặt lại bố cục" (Reset Layout) - Bảo toàn tối thiểu 40% diện tích bản đồ
  const handleResetLayout = useCallback(() => {
    setSelectedProvince(null);
    setIsSidebarOpen(false);
    // Thu nhỏ hoặc đưa các cửa sổ về trạng thái docked gọn gàng
    setWindows((curr) => {
      const reset = { ...curr };
      (Object.keys(reset) as ToolId[]).forEach((key) => {
        reset[key] = {
          ...reset[key],
          isOpen: false,
          isMinimized: false,
          isMaximized: false,
          snap: "none",
        };
      });
      return reset;
    });
  }, []);

  // Trạng thái các công cụ đang mở
  const activeTools = {
    chat: windows.chat.isOpen && !windows.chat.isMinimized,
    questions: windows.questions.isOpen && !windows.questions.isMinimized,
    notes: windows.notes.isOpen && !windows.notes.isMinimized,
    study: windows.study.isOpen && !windows.study.isMinimized,
  };

  return (
    <main className="relative w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Header UI-01 (Chuẩn cao 68px) */}
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        provinces={provinces}
        onSelectProvince={(p) => {
          setSelectedProvince(p);
        }}
        onResetLayout={handleResetLayout}
      />

      {/* Thân ứng dụng: Sidebar (UI-02) + Vùng làm việc Map Workspace */}
      <div className="relative flex-1 w-full flex overflow-hidden">
        {/* Sidebar công cụ bên trái */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          activeTools={activeTools}
          onToggleTool={handleToggleTool}
          onResetLayout={handleResetLayout}
        />

        {/* Vùng bản đồ cốt lõi (Core Map Workspace) */}
        <div className="relative flex-1 h-full overflow-hidden bg-slate-950">
          <VietnamMap
            mode={mode}
            onModeChange={setMode}
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
          />

          {/* Panel chi tiết S2 tỉnh thành (Trượt ra khi nhấp chọn một tỉnh) */}
          {selectedProvince && (
            <aside className="absolute top-4 right-4 z-30 w-84 bg-slate-900/95 border border-slate-700/90 rounded-2xl p-5 shadow-2xl backdrop-blur-xl animate-in slide-in-from-right duration-200 max-w-sm select-none">
              <div className="flex justify-between items-start pb-3 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                    {selectedProvince.properties.provinceCode}
                  </span>
                  <h3 className="text-xl font-black text-white">
                    {selectedProvince.properties.name}
                  </h3>
                  <p className="text-xs text-slate-400 italic">
                    {selectedProvince.properties.nameEn}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProvince(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 text-base leading-none transition-colors"
                  title="Đóng thông tin"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Phân loại:</span>
                  <span className="font-semibold text-slate-100">
                    {selectedProvince.properties.type}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Diện tích:</span>
                  <span className="font-semibold text-amber-300">
                    {selectedProvince.properties.areaSqKm.toLocaleString("vi-VN")} km²
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Vùng KT-XH:</span>
                  <span className="font-semibold text-blue-300">
                    {
                      ECONOMIC_REGIONS.find((r) =>
                        r.provinceCodes.includes(selectedProvince.properties.provinceCode)
                      )?.name || "N/A"
                    }
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Khu vực tự nhiên:</span>
                  <span className="font-semibold text-emerald-300">
                    {
                      NATURAL_REGIONS.find((r) =>
                        r.provinceCodes.includes(selectedProvince.properties.provinceCode)
                      )?.name || "N/A"
                    }
                  </span>
                </div>

                {selectedProvince.properties.provinceCode === "VN48" && (
                  <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 mt-2.5 leading-relaxed">
                    🏝️ Bao gồm <strong>Huyện đảo Hoàng Sa</strong> với hơn 18.000 điểm đa giác hải đảo.
                  </div>
                )}
                {selectedProvince.properties.provinceCode === "VN56" && (
                  <div className="p-3 bg-amber-950/40 border border-amber-800/60 rounded-xl text-xs text-amber-200 mt-2.5 leading-relaxed">
                    🏝️ Bao gồm <strong>Huyện đảo Trường Sa</strong> trải rộng trên Biển Đông với hơn 54.000 điểm đa giác hải đảo.
                  </div>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => {
                    handleToggleTool("chat");
                  }}
                  className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hỏi AI về {selectedProvince.properties.name}</span>
                </button>
              </div>
            </aside>
          )}

          {/* Trình quản lý cửa sổ đa nhiệm (Workspace Window Manager UI-07) */}
          <WindowManager
            windows={windows}
            onUpdateWindow={handleUpdateWindow}
            onFocusWindow={handleFocusWindow}
            onCloseWindow={handleCloseWindow}
            selectedProvince={selectedProvince}
          />
        </div>
      </div>
    </main>
  );
}
