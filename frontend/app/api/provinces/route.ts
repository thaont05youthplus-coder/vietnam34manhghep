import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const geoJsonPath = path.join(process.cwd(), "public", "data", "vietnam_34_provinces.geojson");
    if (!fs.existsSync(geoJsonPath)) {
      return NextResponse.json({ error: "GeoJSON file not found" }, { status: 404 });
    }

    let fileContent = fs.readFileSync(geoJsonPath, "utf-8");
    // Xóa ký tự UTF-8 BOM nếu có để JSON.parse hoạt động an toàn
    if (fileContent.charCodeAt(0) === 0xfeff) {
      fileContent = fileContent.substring(1);
    }
    const geoJson = JSON.parse(fileContent);

    const provincesList = geoJson.features.map((f: any) => {
      const { properties } = f;
      return {
        provinceCode: properties.provinceCode,
        name: properties.name,
        nameEn: properties.nameEn,
        type: properties.type,
        areaSqKm: properties.areaSqKm,
      };
    });

    return NextResponse.json({
      success: true,
      total: provincesList.length,
      data: provincesList,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
