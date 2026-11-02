import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    project: "VN34MG - Bản đồ Công nghệ số Việt Nam 34 Mảnh ghép",
    version: "1.0.0",
    provincesCount: 34,
    archipelagos: ["Hoàng Sa", "Trường Sa"],
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
}
