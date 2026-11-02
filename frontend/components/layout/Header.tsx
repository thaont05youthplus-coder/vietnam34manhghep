"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  RotateCcw,
  User,
  ShieldCheck,
  X,
  Compass,
  MapPin,
  Share2,
  Keyboard,
  Check,
} from "lucide-react";
import { ProvinceFeature } from "@/types/geo";

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  provinces: ProvinceFeature[];
  onSelectProvince: (province: ProvinceFeature) => void;
  onResetLayout: () => void;
  onOpenShortcuts?: () => void;
  onShare?: () => void;
}

// Hàm chuẩn hóa chuỗi tiếng Việt không dấu để tìm kiếm thông minh
function removeVietnameseTones(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  provinces,
  onSelectProvince,
  onResetLayout,
  onOpenShortcuts,
  onShare,
}) => {
  const [query, setQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Lọc kết quả tìm kiếm
  const filteredProvinces = React.useMemo(() => {
    if (!query.trim()) return [];
    const normalizedQ = removeVietnameseTones(query.trim());
    return provinces.filter((p) => {
      const nameNorm = removeVietnameseTones(p.properties.name);
      const nameEnNorm = removeVietnameseTones(p.properties.nameEn || "");
      const codeNorm = p.properties.provinceCode.toLowerCase();
      return (
        nameNorm.includes(normalizedQ) ||
        nameEnNorm.includes(normalizedQ) ||
        codeNorm.includes(normalizedQ)
      );
    });
  }, [query, provinces]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (p: ProvinceFeature) => {
    onSelectProvince(p);
    setQuery("");
    setIsDropdownOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isDropdownOpen || filteredProvinces.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredProvinces.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) =>
        prev === 0 ? filteredProvinces.length - 1 : prev - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredProvinces[selectedIndex]) {
        handleSelect(filteredProvinces[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="h-[68px] bg-[#091b36]/95 border-b border-sky-800/40 px-4 flex items-center justify-between z-30 backdrop-blur-md shadow-xl shadow-sky-950/30 shrink-0 select-none">
      {/* Cụm Trái: Nút Menu 3 gạch & Logo chính thức Việt Nam 34 Mảnh Ghép */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Chuyển đổi thanh công cụ"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-sky-950/70 hover:bg-sky-900/80 border border-sky-700/60 text-sky-200 hover:text-white transition-all shadow-sm"
          title={isSidebarOpen ? "Thu gọn menu (56px)" : "Mở rộng menu (240px)"}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 cursor-pointer group" onClick={onResetLayout}>
          {/* Ảnh Logo Việt Nam 34 Mảnh ghép */}
          <div className="w-11 h-11 rounded-2xl bg-white p-0.5 border-2 border-sky-400/60 shadow-md shadow-sky-500/20 flex items-center justify-center overflow-hidden transition-all group-hover:scale-105 group-hover:border-amber-400">
            <img
              src="/logo.jpg"
              alt="Logo Việt Nam 34 Mảnh Ghép"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight flex items-center gap-1.5">
                <span className="text-sky-100 font-bold">Việt Nam</span>
                <span className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-400 bg-clip-text text-transparent font-black text-xl">
                  34
                </span>
                <span className="text-amber-300 font-semibold text-xs sm:text-sm">
                  mảnh ghép
                </span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-sky-500/20 via-amber-500/20 to-red-500/20 text-sky-200 px-2 py-0.5 rounded-full border border-sky-400/30 hidden md:inline">
                Bản đồ 34
              </span>
            </div>
            <p className="text-[11px] text-sky-200/70 hidden lg:block leading-tight font-medium">
              Bản đồ Công nghệ số &amp; Khám phá Địa phương
            </p>
          </div>
        </div>
      </div>

      {/* Cụm Giữa: Ô tìm kiếm thông minh có gợi ý (Autocomplete) */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-lg mx-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsDropdownOpen(true);
              setSelectedIndex(0);
            }}
            onFocus={() => {
              if (query.trim()) setIsDropdownOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Tìm kiếm 34 tỉnh/thành (Huế, Đà Nẵng, Khánh Hòa, Cà Mau)..."
            className="w-full h-10 pl-10 pr-9 text-xs sm:text-sm bg-[#0c2242]/90 border border-sky-700/60 rounded-xl text-slate-100 placeholder-sky-300/50 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 transition-all shadow-inner"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsDropdownOpen(false);
              }}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown danh sách gợi ý */}
        {isDropdownOpen && filteredProvinces.length > 0 && (
          <div className="absolute top-12 left-0 right-0 max-h-80 overflow-y-auto bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-xl z-50 divide-y divide-slate-800 custom-scroll">
            {filteredProvinces.map((p, idx) => (
              <div
                key={p.properties.provinceCode}
                onClick={() => handleSelect(p)}
                className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                  idx === selectedIndex
                    ? "bg-blue-600/30 text-white"
                    : "hover:bg-slate-800/70 text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 font-mono text-[10px] font-bold">
                    {p.properties.provinceCode}
                  </div>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      <span>{p.properties.name}</span>
                      <span className="text-[10px] font-normal text-slate-400 px-1.5 py-0.2 rounded bg-slate-800">
                        {p.properties.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      {p.properties.nameEn}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-amber-300 font-medium">
                  {p.properties.areaSqKm.toLocaleString("vi-VN")} km²
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cụm Phải: Chỉ số chủ quyền + Nút Đặt lại bố cục + Tài khoản */}
      <div className="flex items-center gap-2.5">
        {/* Badge chủ quyền Hoàng Sa - Trường Sa (Màu Quốc kỳ & Biển đảo) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-sky-950/80 via-blue-950/80 to-emerald-950/80 border border-sky-600/50 text-sky-200 rounded-xl text-xs font-semibold shadow-sm">
          <span className="text-amber-400 font-black text-sm drop-shadow">★</span>
          <span>Hoàng Sa &amp; Trường Sa: Đầy đủ</span>
        </div>

        {/* Nút Phím tắt (?) (Mục 14 Spec) */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            title="Xem danh sách phím tắt điều hướng nhanh (Nhấn ?)"
            className="h-10 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-xl bg-sky-950/70 hover:bg-sky-900/80 border border-sky-700/60 text-sky-200 hover:text-white text-xs font-semibold transition-all shadow-sm"
          >
            <Keyboard className="w-4 h-4 text-sky-400" />
            <span className="hidden lg:inline">Phím tắt</span>
            <kbd className="hidden sm:inline px-1 bg-slate-900 border border-sky-700/60 rounded text-[10px] text-amber-300 font-mono">?</kbd>
          </button>
        )}

        {/* Nút Chia sẻ (Share URL State - Mục 13 Spec) */}
        {onShare && (
          <button
            onClick={() => {
              onShare();
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
            title="Sao chép liên kết góc nhìn bản đồ & công cụ hiện tại"
            className="h-10 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-900/70 to-blue-900/70 hover:from-sky-800/80 hover:to-blue-800/80 border border-sky-500/60 text-sky-100 hover:text-white text-xs font-semibold transition-all shadow-sm"
          >
            {isCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline text-emerald-300">Đã chép link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-sky-300" />
                <span className="hidden sm:inline">Chia sẻ</span>
              </>
            )}
          </button>
        )}

        {/* Nút Đặt lại bố cục (Reset Layout) */}
        <button
          onClick={onResetLayout}
          title="Đặt lại bố cục cửa sổ và căn giữa bản đồ (Bảo toàn 40% diện tích map)"
          className="h-10 px-3 flex items-center gap-1.5 rounded-xl bg-sky-950/70 hover:bg-sky-900/80 border border-sky-700/60 text-sky-200 hover:text-amber-300 text-xs font-semibold transition-all shadow-sm group"
        >
          <RotateCcw className="w-4 h-4 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
          <span className="hidden md:inline">Đặt lại</span>
        </button>

        {/* Avatar / Hồ sơ học tập */}
        <div className="flex items-center gap-2 pl-1 border-l border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white cursor-pointer transition-all hover:border-blue-500/50 shadow-sm" title="Tài khoản Học sinh THCS / THPT">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
