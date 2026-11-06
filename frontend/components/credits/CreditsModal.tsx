"use client";

import React, { useState } from "react";
import {
  X,
  Award,
  ShieldCheck,
  BookOpen,
  Code2,
  HeartHandshake,
  Compass,
  ExternalLink,
  CheckCircle2,
  Scale,
} from "lucide-react";

interface CreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "authors" | "ethics" | "data" | "opensource";

export const CreditsModal: React.FC<CreditsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>("authors");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0d3b35] via-[#114b43] to-[#1a5d53] p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-xs">
              <Award className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold tracking-tight">
                  Thông tin Dự án, Tác giả &amp; Nguồn trích dẫn
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-800/80 text-teal-200 px-2 py-0.5 rounded-full border border-teal-500/30">
                  Credits &amp; Ethics
                </span>
              </div>
              <p className="text-[11px] text-teal-100/90">
                Cam kết liêm chính học thuật, đạo đức nghiên cứu và tôn trọng sở hữu trí tuệ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 gap-1 text-xs font-semibold shrink-0 overflow-x-auto custom-scroll">
          <button
            onClick={() => setActiveTab("authors")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "authors"
                ? "border-teal-700 text-teal-800 bg-white rounded-t-lg shadow-2xs font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>Dự án &amp; Bản quyền</span>
          </button>

          <button
            onClick={() => setActiveTab("ethics")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "ethics"
                ? "border-teal-700 text-teal-800 bg-white rounded-t-lg shadow-2xs font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Liêm chính &amp; Đạo đức (Ethics)</span>
          </button>

          <button
            onClick={() => setActiveTab("data")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "data"
                ? "border-teal-700 text-teal-800 bg-white rounded-t-lg shadow-2xs font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Nguồn dữ liệu chuẩn</span>
          </button>

          <button
            onClick={() => setActiveTab("opensource")}
            className={`flex items-center gap-1.5 px-3 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "opensource"
                ? "border-teal-700 text-teal-800 bg-white rounded-t-lg shadow-2xs font-bold"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Mã nguồn mở (Credits)</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 text-xs text-slate-700 space-y-4 overflow-y-auto flex-1 custom-scroll">
          {/* Tab 1: Dự án & Bản quyền */}
          {activeTab === "authors" && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-700 text-white flex items-center justify-center shrink-0 mt-0.5 font-black text-sm">
                    34
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-teal-950">
                      Dự án &quot;Việt Nam 34 Mảnh Ghép&quot; (VN34MG)
                    </h4>
                    <p className="text-[11px] text-teal-800 mt-1 leading-relaxed">
                      Nền tảng Bản đồ Công nghệ số và Môi trường học tập tương tác thông minh dành cho học sinh THCS &amp; THPT theo Chương trình GDPT 2018. Dự án hướng tới chuyển đổi số giáo dục Địa lí, khơi dậy niềm tự hào dân tộc và tình yêu quê hương đất nước.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-teal-700" />
                  <span>Đơn vị &amp; Nhóm tác giả phát triển:</span>
                </h5>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <p className="font-semibold text-slate-800">
                    Nhóm tác giả Đề tài Nghiên cứu Khoa học &amp; Đổi mới sáng tạo &quot;Việt Nam 34 Mảnh Ghép&quot;
                  </p>
                  <p className="text-slate-600 leading-relaxed text-[11px]">
                    Toàn bộ kiến trúc giải pháp, thuật toán tối ưu hóa GIS 34 tỉnh/thành, mô hình phân cấp hành chính đa mức (LOD), hệ thống 4 công cụ giáo dục (Chatbox AI, Ghi chú kép Canvas, Ngân hàng câu hỏi 5 cấp, Ôn tập Quizlet-style) được lên ý tưởng, thiết kế và phát triển độc quyền bởi nhóm tác giả.
                  </p>
                </div>
              </div>

              {/* Tuyên bố chủ quyền quốc gia thiêng liêng */}
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <div className="flex items-center gap-2 font-bold text-red-900 text-xs">
                  <Scale className="w-4 h-4 text-red-700" />
                  <span>Tuyên bố Chủ quyền Quốc gia:</span>
                </div>
                <p className="text-[11px] text-red-800 mt-1 leading-relaxed font-medium">
                  Bản đồ khẳng định chủ quyền toàn vẹn và bất khả xâm phạm của nước Cộng hòa Xã hội Chủ nghĩa Việt Nam đối với <strong>Quần đảo Hoàng Sa (thuộc Thành phố Đà Nẵng)</strong> và <strong>Quần đảo Trường Sa (thuộc Tỉnh Khánh Hòa)</strong>, cùng toàn bộ vùng đất, vùng trời và vùng biển thiêng liêng của Tổ quốc.
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Liêm chính học thuật & Đạo đức (Ethics) */}
          {activeTab === "ethics" && (
            <div className="space-y-3.5 animate-in fade-in duration-100">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-emerald-950 text-xs">
                    Tuyên ngôn Liêm chính Học thuật (Academic Ethics Statement)
                  </h4>
                  <p className="text-[11px] text-emerald-900 mt-1 leading-relaxed">
                    Dự án cam kết tuân thủ nghiêm ngặt chuẩn mực đạo đức khoa học và quy chế các cuộc thi sáng tạo khoa học kỹ thuật, đảm bảo tính minh bạch, trung thực và trung tín trong toàn bộ quy trình phát triển.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. Tính nguyên bản &amp; Tự chủ sáng tạo (Originality):</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                    Toàn bộ ý tưởng kịch bản sư phạm, giao diện người dùng, mã nguồn điều phối tương tác, logic xử lý bản đồ và kịch bản sư phạm 4 công cụ học tập do chính nhóm tác giả trực tiếp nghiên cứu, lập trình và tinh chỉnh.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>2. Mục đích Phi thương mại &amp; Phục vụ cộng đồng:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                    Dự án hoàn toàn phi thương mại, được phát triển nhằm mục đích phục vụ cộng đồng học sinh, giáo viên và những người yêu thích Địa lí Việt Nam trên khắp mọi miền đất nước.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>3. Đạo đức Trí tuệ Nhân tạo có trách nhiệm (Responsible AI Ethics):</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed pl-5">
                    Hệ thống AI Hỏi đáp được thiết kế với kịch bản sư phạm nghiêm cẩn, ràng buộc dữ liệu chặt chẽ vào SGK Địa lí và Nghị quyết 306/NQ-CP, không bịa đặt số liệu quy hoạch quốc gia và tuyệt đối không xâm phạm các vấn đề lịch sử hay chủ quyền.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Nguồn dữ liệu chính thống */}
          {activeTab === "data" && (
            <div className="space-y-3 animate-in fade-in duration-100">
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Mọi số liệu địa lý, ranh giới hành chính, không gian phát triển kinh tế - xã hội và tài liệu học tập trong dự án đều căn cứ từ các văn kiện và tài liệu chính thống của Nhà nước:
              </p>

              <div className="space-y-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      1. Nghị quyết số 306/NQ-CP của Chính phủ
                    </span>
                    <a
                      href="https://luatvietnam.vn/xay-dung/nghi-quyet-306-nq-cp-cua-chinh-phu-ve-viec-dieu-chinh-quy-hoach-tong-the-quoc-gia-thoi-ky-2021-2030-tam-nhin-den-nam-2050-413739-d1.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:text-teal-900 flex items-center gap-0.5 text-[11px] font-semibold"
                    >
                      <span>Văn bản gốc</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Về việc điều chỉnh quy hoạch tổng thể quốc gia thời kỳ 2021-2030, tầm nhìn đến năm 2050 (định hướng 6 vùng KT-XH, hành lang kinh tế và các cực tăng trưởng).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900">
                    2. Sách giáo khoa Địa lí THCS &amp; THPT - Chương trình GDPT 2018
                  </span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Bộ Giáo dục và Đào tạo (2024). Nguồn kiến thức nền tảng về đặc điểm tự nhiên, kinh tế - xã hội, cấu trúc địa lí các vùng và hệ thống câu hỏi trắc nghiệm.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900">
                    3. Niên giám Thống kê Quốc gia &amp; Dữ liệu Tổng cục Thống kê (GSO)
                  </span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Số liệu diện tích tự nhiên, quy mô dân số, mật độ dân cư và cơ cấu ngành kinh tế của 34 tỉnh/thành phố giai đoạn hiện hành.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="font-bold text-slate-900">
                    4. Dữ liệu Không gian Địa lý Hành chính (GIS Vietnam)
                  </span>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Ranh giới hành chính các cấp theo hệ quy chiếu VN-2000 và GeoJSON mở (Cục Đo đạc, Bản đồ và Thông tin địa lý Việt Nam / Open Data VN).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Công nghệ & Ghi nhận Mã nguồn mở (Credits) */}
          {activeTab === "opensource" && (
            <div className="space-y-3 animate-in fade-in duration-100">
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Nhóm tác giả trân trọng tri ân và ghi nhận sự đóng góp của cộng đồng phần mềm mã nguồn mở thế giới đã cung cấp các nền tảng công nghệ nền tảng:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Next.js 15 &amp; React 19</span>
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-mono border border-teal-200">
                      MIT License
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Framework ứng dụng web hiện đại phát triển bởi Vercel &amp; Meta.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Tailwind CSS</span>
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-mono border border-teal-200">
                      MIT License
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Thư viện tạo kiểu giao diện trực quan và thích ứng đa màn hình.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Lucide Icons</span>
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-mono border border-teal-200">
                      ISC License
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Bộ biểu tượng mã nguồn mở chuẩn thiết kế hiện đại.
                  </p>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Radix UI</span>
                    <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-mono border border-teal-200">
                      MIT License
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Thành phần giao diện chuẩn tiếp cận (WAI-ARIA Accessibility).
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[10px] leading-relaxed">
                <p className="text-emerald-400 font-bold mb-1">// Bản quyền giấy phép MIT &amp; Đạo đức nghiên cứu:</p>
                <p>&quot;Permission is hereby granted, free of charge, to any person obtaining a copy of this software... Subject to the conditions: The above copyright notice and this permission notice shall be included in all copies.&quot;</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500 font-medium">
            Việt Nam 34 Mảnh Ghép © 2026 - Tự hào tri thức Địa lí Việt Nam
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            Đã hiểu &amp; Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
