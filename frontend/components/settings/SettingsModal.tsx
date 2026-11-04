"use client";

import React, { useState } from "react";
import {
  X,
  Settings,
  Layers,
  Eye,
  Sliders,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { LayerSettings } from "@/components/layout/SubHeader";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  layers?: LayerSettings;
  onToggleLayer?: (layerKey: keyof LayerSettings) => void;
  onResetLayout?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  layers,
  onToggleLayer,
  onResetLayout,
}) => {
  const [autoZoom, setAutoZoom] = useState(true);
  const [showCoordinates, setShowCoordinates] = useState(true);
  const [highContrastLabels, setHighContrastLabels] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <Settings className="w-4 h-4 text-teal-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Cài đặt hệ thống &amp; Bản đồ</h3>
              <p className="text-[11px] text-slate-300">Tùy biến hiển thị theo nhu cầu học tập</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Nhóm lớp bản đồ */}
          {layers && onToggleLayer && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 pb-1">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                <span>Lớp hiển thị bản đồ (GIS Layers)</span>
              </div>

              <div className="grid grid-cols-1 gap-2 pt-1">
                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer">
                  <span className="font-medium text-slate-800">Ranh giới cấp Xã / Phường</span>
                  <input
                    type="checkbox"
                    checked={layers.wards}
                    onChange={() => onToggleLayer("wards")}
                    className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer">
                  <span className="font-medium text-slate-800">Đường ranh giới 34 tỉnh thành</span>
                  <input
                    type="checkbox"
                    checked={layers.boundaries}
                    onChange={() => onToggleLayer("boundaries")}
                    className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer">
                  <span className="font-medium text-slate-800">Lưới tọa độ GIS VN-2000</span>
                  <input
                    type="checkbox"
                    checked={layers.grid}
                    onChange={() => onToggleLayer("grid")}
                    className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Nhóm tương tác */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-100 pb-1">
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              <span>Tương tác &amp; Điều hướng</span>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer">
                <div>
                  <div className="font-medium text-slate-800">Tự động căn chỉnh khi chọn tỉnh/xã</div>
                  <div className="text-[10px] text-slate-400">Tự động phóng to và căn vừa vùng nhìn</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoZoom}
                  onChange={(e) => setAutoZoom(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100 transition-colors cursor-pointer">
                <div>
                  <div className="font-medium text-slate-800">Hiển thị tọa độ địa lý khi rê chuột</div>
                  <div className="text-[10px] text-slate-400">Vĩ độ (°B) và Kinh độ (°Đ)</div>
                </div>
                <input
                  type="checkbox"
                  checked={showCoordinates}
                  onChange={(e) => setShowCoordinates(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Đặt lại bố cục */}
          {onResetLayout && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onResetLayout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-teal-700" />
                <span>Đặt lại bố cục giao diện mặc định</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            {savedSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Đã lưu cài đặt!
              </span>
            ) : (
              "Phiên bản VN34MG 2.0"
            )}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
