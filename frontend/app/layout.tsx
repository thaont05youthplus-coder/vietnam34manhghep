import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Việt Nam 34 Mảnh Ghép - Bản Đồ Công Nghệ Số",
  description: "Bản đồ Công nghệ số Việt Nam 34 Mảnh ghép - Nền tảng học tập Địa lí tương tác 2D thông minh dành cho học sinh THCS và THPT.",
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans bg-[#071326] text-slate-100 overflow-hidden h-screen w-screen">
        {children}
      </body>
    </html>
  );
}
