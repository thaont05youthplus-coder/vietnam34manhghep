"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Send,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Inbox,
  AlertCircle,
  MapPin,
  Heart,
  MessageSquareHeart,
  RotateCcw,
} from "lucide-react";
import { ProvinceFeature } from "@/types/geo";

export interface FeedbackRecord {
  id: string;
  category: string;
  rating: number;
  authorName: string;
  contact: string;
  provinceName?: string;
  title: string;
  content: string;
  createdAt: string;
  status: "Đã tiếp nhận" | "Đang xử lý" | "Đã hoàn tất";
}

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  provinces?: ProvinceFeature[];
  defaultProvinceName?: string;
}

const CATEGORIES = [
  "Dữ liệu bản đồ & Địa giới hành chính (Nghị quyết 306/NQ-CP)",
  "Ranh giới Xã/Phường sáp nhập & Trụ sở",
  "Trợ lí AI & Độ chính xác kiến thức Địa lí",
  "Giao diện người dùng & Trải nghiệm xem bản đồ (UI/UX)",
  "Ngân hàng câu hỏi trắc nghiệm & Ôn tập",
  "Đóng góp ý kiến khác",
];

const STORAGE_KEY = "vn34_feedback_history";

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  provinces = [],
  defaultProvinceName,
}) => {
  const [activeTab, setActiveTab] = useState<"compose" | "history">("compose");

  // Form State
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [contact, setContact] = useState("");
  const [selectedProvName, setSelectedProvName] = useState(defaultProvinceName || "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedFeedbackId, setSubmittedFeedbackId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // History State
  const [historyList, setHistoryList] = useState<FeedbackRecord[]>([]);

  // Load history from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setHistoryList(JSON.parse(saved));
      }
    } catch {
      // Ignore parse error
    }
  }, [isOpen]);

  useEffect(() => {
    if (defaultProvinceName) {
      setSelectedProvName(defaultProvinceName);
    }
  }, [defaultProvinceName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Vui lòng nhập tiêu đề ý kiến đóng góp.");
      return;
    }
    if (!content.trim()) {
      setErrorMessage("Vui lòng nhập nội dung góp ý chi tiết.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          rating,
          authorName: authorName.trim(),
          contact: contact.trim(),
          provinceName: selectedProvName || undefined,
          title: title.trim(),
          content: content.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Gửi phản hồi không thành công.");
      }

      const newRecord: FeedbackRecord = data.feedback || {
        id: `FB-${Date.now().toString(36).toUpperCase()}`,
        category,
        rating,
        authorName: authorName.trim() || "Người dùng ẩn danh",
        contact: contact.trim(),
        provinceName: selectedProvName || undefined,
        title: title.trim(),
        content: content.trim(),
        createdAt: new Date().toISOString(),
        status: "Đã tiếp nhận",
      };

      // Save to localStorage
      const updated = [newRecord, ...historyList];
      setHistoryList(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore storage error
      }

      setSubmittedFeedbackId(newRecord.id);
      setSubmitSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Đã xảy ra lỗi khi gửi. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setTitle("");
    setContent("");
    setSubmitSuccess(false);
    setSubmittedFeedbackId("");
    setErrorMessage("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-700 p-4 text-white flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20 shadow-xs">
              <MessageSquareHeart className="w-5 h-5 text-teal-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">Hòm thư góp ý &amp; Phản hồi</h3>
                <span className="text-[10px] bg-teal-600/70 text-teal-100 px-2 py-0.5 rounded-full font-semibold border border-teal-500/40">
                  VN34MG
                </span>
              </div>
              <p className="text-xs text-teal-100/80 mt-0.5">
                Dự án Bản đồ Công nghệ số Việt Nam 34 Mảnh Ghép
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng hòm thư"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab chuyển đổi: Gửi ý kiến mới / Lịch sử góp ý */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab("compose")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "compose"
                ? "border-teal-700 text-teal-800 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Send className="w-3.5 h-3.5 text-teal-600" />
            <span>Gửi góp ý mới</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === "history"
                ? "border-teal-700 text-teal-800 bg-white rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Ý kiến đã gửi của bạn ({historyList.length})</span>
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 overflow-y-auto flex-1 select-text text-slate-700">
          {activeTab === "compose" ? (
            submitSuccess ? (
              /* Màn hình gửi thành công */
              <div className="py-8 px-4 flex flex-col items-center text-center space-y-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-slate-900">
                  Tiếp nhận phản hồi thành công!
                </h4>
                <div className="text-xs text-slate-600 max-w-md leading-relaxed">
                  Cảm ơn bạn đã đóng góp ý kiến quý báu cho dự án <strong>Việt Nam 34 Mảnh Ghép</strong>. Ý kiến của bạn đã được chuyển tới Ban nghiên cứu và biên tập địa lý để rà soát, hoàn thiện bản đồ.
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 flex items-center gap-2">
                  <span className="text-slate-400">Mã tra cứu phản hồi:</span>
                  <span className="font-bold text-teal-800">{submittedFeedbackId}</span>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <button
                    onClick={handleResetForm}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Gửi ý kiến khác</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Đóng hòm thư
                  </button>
                </div>
              </div>
            ) : (
              /* Form gửi phản hồi */
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Danh mục góp ý */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Danh mục đóng góp <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 font-medium"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Đánh giá trải nghiệm (1-5 sao) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mức độ hài lòng với dự án hiện tại
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = (hoverRating ?? rating) >= star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(null)}
                          onClick={() => setRating(star)}
                          className="p-1 text-slate-300 hover:scale-115 transition-transform cursor-pointer"
                          title={`${star} sao`}
                        >
                          <Star
                            className={`w-5 h-5 ${
                              isFilled
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                    <span className="text-xs text-slate-500 ml-2 font-medium">
                      {rating === 5 && "Rất tốt, rất bổ ích"}
                      {rating === 4 && "Tốt, cần hoàn thiện thêm"}
                      {rating === 3 && "Bình thường"}
                      {rating === 2 && "Cần chỉnh sửa nhiều"}
                      {rating === 1 && "Chưa hài lòng"}
                    </span>
                  </div>
                </div>

                {/* Grid 2 cột: Họ tên & Thông tin liên hệ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và tên (hoặc Xưng danh)
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Thầy Hoàng, Bạn Minh..."
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email hoặc SĐT liên hệ (tùy chọn)
                    </label>
                    <input
                      type="text"
                      placeholder="Để nhận phản hồi từ ban dự án"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800"
                    />
                  </div>
                </div>

                {/* Tỉnh/thành liên quan */}
                {provinces.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Địa phương liên quan (nếu có)
                    </label>
                    <select
                      value={selectedProvName}
                      onChange={(e) => setSelectedProvName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 font-medium"
                    >
                      <option value="">-- Toàn quốc / Không chỉ định cụ thể --</option>
                      {provinces.map((p) => (
                        <option key={p.properties.provinceCode} value={p.properties.name}>
                          {p.properties.name} ({p.properties.type})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Tiêu đề góp ý */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tiêu đề ý kiến <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Tóm tắt ngắn gọn ý kiến hoặc lỗi bạn gặp phải..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 font-medium"
                  />
                </div>

                {/* Nội dung góp ý */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nội dung góp ý chi tiết <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Mô tả cụ thể thông tin bạn muốn đóng góp, góp ý số liệu quy hoạch, lỗi ranh giới xã hoặc trải nghiệm chưa phù hợp..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:outline-hidden text-slate-800 leading-relaxed"
                  />
                </div>

                {/* Footer action buttons */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-1.5 px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Đang gửi..." : "Gửi góp ý ngay"}</span>
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Tab Lịch sử góp ý */
            <div className="space-y-3">
              {historyList.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-2 text-slate-400">
                  <Inbox className="w-10 h-10 text-slate-300" />
                  <p className="text-xs">Bạn chưa gửi ý kiến đóng góp nào từ thiết bị này.</p>
                  <button
                    onClick={() => setActiveTab("compose")}
                    className="text-xs text-teal-700 font-bold hover:underline cursor-pointer"
                  >
                    Bấm vào đây để gửi ý kiến đầu tiên
                  </button>
                </div>
              ) : (
                historyList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-bold">
                          {item.id}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 mt-1 truncate">
                          {item.title}
                        </h5>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>

                    <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{item.category}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
