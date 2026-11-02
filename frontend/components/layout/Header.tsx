"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  Search,
  RotateCcw,
  User,
  X,
  Keyboard,
  Share2,
  Check,
  HelpCircle,
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
    <header className="h-[68px] bg-white border-b border-slate-200 px-4 flex items-center justify-between z-30 shadow-xs shrink-0 select-none text-slate-800">
      {/* Cụm Trái: Nút Menu & Logo chính thức Việt Nam 34 Mảnh Ghép */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Chuyển đổi thanh công cụ"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 transition-all shadow-xs"
          title={isSidebarOpen ? "Thu gọn menu (64px)" : "Mở rộng menu (240px)"}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={onResetLayout}
        >
          {/* Logo hình ảnh tròn */}
          <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-slate-200 shadow-xs flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
            <img
              src="/logo.jpg"
              alt="Logo Việt Nam 34 Mảnh Ghép"
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base text-slate-900 tracking-tight leading-tight">
                Việt Nam 34 mảnh ghép
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full border border-slate-200 hidden xl:inline">
                Bản đồ 34
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight font-medium">
              Không gian học tập Địa lí
            </p>
          </div>
        </div>
      </div>

      {/* Cụm Giữa: Ô tìm kiếm thông minh có gợi ý (Autocomplete) */}
      <div ref={searchContainerRef} className="relative flex-1 max-w-md mx-4">
        <div className="relative flex items-center">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
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
            placeholder="Tìm tỉnh, thành phố hoặc vùng..."
            className="w-full h-10 pl-10 pr-14 text-xs sm:text-sm bg-slate-100/90 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 transition-all shadow-inner"
          />
          {query ? (
            <button
              onClick={() => {
                setQuery("");
                setIsDropdownOpen(false);
              }}
              className="absolute right-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="absolute right-3 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-400 shadow-xs pointer-events-none">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Dropdown danh sách gợi ý */}
        {isDropdownOpen && filteredProvinces.length > 0 && (
          <div className="absolute top-12 left-0 right-0 max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-2xl z-50 divide-y divide-slate-100 custom-scroll animate-in fade-in zoom-in-95 duration-100">
            {filteredProvinces.map((p, idx) => (
              <div
                key={p.properties.provinceCode}
                onClick={() => handleSelect(p)}
                className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                  idx === selectedIndex
                    ? "bg-teal-50 text-teal-900"
                    : "hover:bg-slate-50 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 font-mono text-[10px] font-bold">
                    {p.properties.provinceCode}
                  </div>
                  <div>
                    <div className="font-semibold text-sm flex items-center gap-2">
                      <span>{p.properties.name}</span>
                      <span className="text-[10px] font-normal text-slate-500 px-1.5 py-0.2 rounded bg-slate-100">
                        {p.properties.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 italic">
                      {p.properties.nameEn}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs text-amber-600 font-medium">
                  {p.properties.areaSqKm.toLocaleString("vi-VN")} km²
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cụm Phải: Chỉ số chủ quyền + Phím tắt + Chia sẻ + Đặt lại + Avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Badge chủ quyền Hoàng Sa & Trường Sa */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-medium shadow-xs">
          <span className="text-amber-500 font-black text-xs">★</span>
          <span>Hoàng Sa &amp; Trường Sa: Đầy đủ</span>
        </div>

        {/* Nút Phím tắt (?) */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            title="Xem danh sách phím tắt điều hướng nhanh (Nhấn ?)"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 text-xs font-semibold transition-all shadow-xs"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="sr-only">Phím tắt</span>
          </button>
        )}

        {/* Nút Chia sẻ */}
        {onShare && (
          <button
            onClick={() => {
              onShare();
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 2000);
            }}
            title="Sao chép liên kết góc nhìn bản đồ & công cụ hiện tại"
            className="hidden sm:flex h-9 px-2.5 items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium transition-all shadow-xs"
          >
            {isCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Đã chép link!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Chia sẻ</span>
              </>
            )}
          </button>
        )}

        {/* Nút Đặt lại bố cục */}
        <button
          onClick={onResetLayout}
          title="Đặt lại bố cục cửa sổ và căn giữa bản đồ"
          className="hidden md:flex h-9 px-2.5 items-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium transition-all shadow-xs group"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500 group-hover:rotate-180 transition-transform duration-500" />
          <span>Đặt lại</span>
        </button>

        {/* Avatar Hồ sơ người dùng (Dark teal circle matching mockup) */}
        <div className="flex items-center pl-1">
          <div
            className="w-9 h-9 rounded-full bg-[#114b43] text-white flex items-center justify-center hover:opacity-90 cursor-pointer transition-opacity shadow-xs"
            title="Tài khoản Học sinh THCS / THPT"
          >
            <User className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};
