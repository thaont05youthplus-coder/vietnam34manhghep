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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans bg-slate-950 text-slate-100 overflow-hidden h-screen w-screen">
        {children}
      </body>
    </html>
  );
}
