"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { WindowManager } from "@/components/workspace/WindowManager";
import { VietnamMap } from "@/components/map/VietnamMap";
import { RegionCardsStrip } from "@/components/map/RegionCardsStrip";
import { ProvinceDetailPanel } from "@/components/panels/ProvinceDetailPanel";
import { KeyboardShortcutsModal } from "@/components/workspace/KeyboardShortcutsModal";
import { ProvinceFeature, ProvinceFeatureCollection, MapMode } from "@/types/geo";
import { ToolId, WindowState, SnapPosition } from "@/types/workspace";
import { GeoQuestion } from "@/components/question-bank/QuestionBankModal";

export default function HomePage() {
  const [provinces, setProvinces] = useState<ProvinceFeature[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<ProvinceFeature | null>(null);
  const [mode, setMode] = useState<MapMode>("hanh_chinh");

  // Vùng đang chọn hoặc hover từ dải thẻ thông minh (RegionCardsStrip)
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // Trạng thái Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Z-index cao nhất hiện tại cho các cửa sổ
  const [maxZIndex, setMaxZIndex] = useState(40);

  // Nội dung ghi chú được chuyển từ Chatbox AI hoặc câu hỏi
  const [sharedNoteText, setSharedNoteText] = useState<string>("");

  // Trạng thái mở modal hướng dẫn phím tắt (Mục 14 Spec)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

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
      title: "Ghi chú",
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

  // Bật/tắt mở công cụ từ Sidebar hoặc Panel chi tiết
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

  // Mở Ghi chú và chèn nội dung trích từ Chatbox (Mục 16.6 Spec)
  const handleOpenNotesWithText = useCallback(
    (text: string) => {
      setSharedNoteText(text);
      setWindows((curr) => {
        const nextMaxZ = maxZIndex + 1;
        setMaxZIndex(nextMaxZ);
        return {
          ...curr,
          notes: {
            ...curr.notes,
            isOpen: true,
            isMinimized: false,
            zIndex: nextMaxZ,
          },
        };
      });
    },
    [maxZIndex]
  );

  // Định vị tỉnh từ Bộ câu hỏi hoặc Bài kiểm tra (T46)
  const handleLocateProvince = useCallback(
    (provinceCode: string) => {
      const found = provinces.find((p) => p.properties.provinceCode === provinceCode);
      if (found) {
        setSelectedProvince(found);
      }
    },
    [provinces]
  );

  // Đồng bộ trạng thái URL khi tải trang ban đầu (Mục 13 Spec)
  useEffect(() => {
    if (typeof window === "undefined" || provinces.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get("mode") as MapMode | null;
    const provinceParam = params.get("province");
    const toolParam = params.get("tool") as ToolId | null;

    if (modeParam && ["hanh_chinh", "tu_nhien", "kinh_te"].includes(modeParam)) {
      setMode(modeParam);
    }
    if (provinceParam) {
      const match = provinces.find(
        (p) =>
          p.properties.provinceCode.toLowerCase() === provinceParam.toLowerCase() ||
          p.properties.name.toLowerCase() === provinceParam.toLowerCase()
      );
      if (match) setSelectedProvince(match);
    }
    if (toolParam && ["chat", "questions", "notes", "study"].includes(toolParam)) {
      setWindows((curr) => ({
        ...curr,
        [toolParam]: {
          ...curr[toolParam],
          isOpen: true,
          isMinimized: false,
        },
      }));
    }
  }, [provinces]);

  // Điều hướng bằng Phím tắt (Keyboard Navigation & Accessibility - Mục 14 Spec)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bỏ qua nếu đang gõ trong input, textarea hoặc contenteditable
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();

      // Phím 1, 2, 3 chuyển chế độ bản đồ
      if (e.key === "1") {
        e.preventDefault();
        setMode("hanh_chinh");
        setSelectedRegionId(null);
      } else if (e.key === "2") {
        e.preventDefault();
        setMode("tu_nhien");
        setSelectedRegionId(null);
      } else if (e.key === "3") {
        e.preventDefault();
        setMode("kinh_te");
        setSelectedRegionId(null);
      }
      // Phím C, Q, N, S mở/tắt 4 công cụ
      else if (key === "c") {
        e.preventDefault();
        handleToggleTool("chat");
      } else if (key === "q") {
        e.preventDefault();
        handleToggleTool("questions");
      } else if (key === "n") {
        e.preventDefault();
        handleToggleTool("notes");
      } else if (key === "s") {
        e.preventDefault();
        handleToggleTool("study");
      }
      // Phím ? mở Cheat sheet phím tắt
      else if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
      // Phím Esc đóng cửa sổ / panel
      else if (e.key === "Escape") {
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
        } else if (selectedProvince) {
          setSelectedProvince(null);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProvince, isShortcutsOpen, handleToggleTool]);

  // Chia sẻ liên kết kèm trạng thái góc nhìn (Mục 13 Spec)
  const handleShare = useCallback(() => {
    const params = new URLSearchParams();
    params.set("mode", mode);
    if (selectedProvince) {
      params.set("province", selectedProvince.properties.provinceCode);
    }
    const openTool = (Object.keys(windows) as ToolId[]).find(
      (k) => windows[k].isOpen && !windows[k].isMinimized
    );
    if (openTool) {
      params.set("tool", openTool);
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", `?${params.toString()}`);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
  }, [mode, selectedProvince, windows]);

  // Lưu câu hỏi vào bộ Học & Kiểm tra
  const handleAddToStudy = useCallback((q: GeoQuestion) => {
    alert(`Đã lưu "${q.title}" vào bộ ôn tập Học & Kiểm tra!`);
  }, []);

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
    setSelectedRegionId(null);
    setHoveredRegionId(null);
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
    <main className="relative w-screen h-screen flex flex-col bg-[#061325] text-slate-100 overflow-hidden font-sans">
      {/* Header UI-01 (Chuẩn cao 68px) */}
      <Header
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        provinces={provinces}
        onSelectProvince={(p) => {
          setSelectedProvince(p);
        }}
        onResetLayout={handleResetLayout}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onShare={handleShare}
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
        <div className="relative flex-1 h-full overflow-hidden bg-[#061325]">
          <VietnamMap
            mode={mode}
            onModeChange={(newMode) => {
              setMode(newMode);
              setSelectedRegionId(null);
            }}
            selectedProvince={selectedProvince}
            onSelectProvince={setSelectedProvince}
            selectedRegionId={selectedRegionId}
            hoveredRegionId={hoveredRegionId}
          />

          {/* Dải thẻ ảnh vùng thông minh (Tự co giãn dọc/ngang theo Panel chi tiết) */}
          <RegionCardsStrip
            mode={mode}
            isDetailPanelOpen={!!selectedProvince}
            selectedRegionId={selectedRegionId}
            onSelectRegion={setSelectedRegionId}
            onHoverRegion={setHoveredRegionId}
          />

          {/* Panel chi tiết địa phương 5 tab (Trượt ra khi nhấp chọn một tỉnh - S2 state) */}
          {selectedProvince && (
            <ProvinceDetailPanel
              province={selectedProvince}
              onClose={() => setSelectedProvince(null)}
              onOpenAiChat={() => handleToggleTool("chat")}
              onOpenNotes={() => handleToggleTool("notes")}
            />
          )}

          {/* Trình quản lý cửa sổ đa nhiệm (Workspace Window Manager UI-07) */}
          <WindowManager
            windows={windows}
            onUpdateWindow={handleUpdateWindow}
            onFocusWindow={handleFocusWindow}
            onCloseWindow={handleCloseWindow}
            selectedProvince={selectedProvince}
            onLocateProvince={handleLocateProvince}
            onOpenNotesWithText={handleOpenNotesWithText}
            onAddToStudy={handleAddToStudy}
            sharedNoteText={sharedNoteText}
          />
        </div>
      </div>

      {/* Modal Hướng dẫn Phím tắt (Accessibility - Mục 14 Spec) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </main>
  );
}
