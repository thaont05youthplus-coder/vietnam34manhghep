import { NextResponse } from "next/server";
import { ECONOMIC_REGIONS, NATURAL_REGIONS } from "@/lib/regions";

export async function GET() {
  return NextResponse.json({
    success: true,
    economicRegions: ECONOMIC_REGIONS,
    naturalRegions: NATURAL_REGIONS,
    timestamp: new Date().toISOString(),
  });
}
