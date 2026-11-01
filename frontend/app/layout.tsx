import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VN34MG - Bản Đồ Công Nghệ Số Việt Nam 34 Mảnh Ghép",
  description: "Nền tảng học tập Địa lí Việt Nam tương tác 2D thông minh dành cho học sinh THCS và THPT.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="antialiased font-sans bg-slate-50 text-slate-900 overflow-hidden h-screen w-screen">
        {children}
      </body>
    </html>
  );
}
