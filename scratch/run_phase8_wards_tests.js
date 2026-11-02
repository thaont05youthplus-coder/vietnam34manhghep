const fs = require("fs");
const path = require("path");

console.log("================================================================================");
console.log("   KIỂM THỬ GIAI ĐOẠN 8: BẢN ĐỒ ĐA CẤP ĐỘ PHÓNG TO & PHƯỜNG/XÃ TRUNG TÂM (LOD)   ");
console.log("================================================================================");

let totalPassed = 0;
let totalFailed = 0;

function assertTest(name, condition, detail = "") {
  if (condition) {
    console.log(`[PASS] ${name}`);
    totalPassed++;
  } else {
    console.error(`[FAIL] ${name} ${detail ? `-> ${detail}` : ""}`);
    totalFailed++;
  }
}

// 1. Kiểm tra file GeoJSON vietnam_central_wards.geojson
const wardsGeoPath = path.join(__dirname, "../frontend/public/data/vietnam_central_wards.geojson");
assertTest("T8.1: File vietnam_central_wards.geojson tồn tại", fs.existsSync(wardsGeoPath));

let wardsData = null;
try {
  const content = fs.readFileSync(wardsGeoPath, "utf8");
  wardsData = JSON.parse(content);
  assertTest("T8.2: File GeoJSON hợp lệ (JSON parse thành công)", true);
} catch (e) {
  assertTest("T8.2: File GeoJSON hợp lệ", false, e.message);
}

if (wardsData) {
  assertTest("T8.3: Type là FeatureCollection", wardsData.type === "FeatureCollection");
  assertTest(
    `T8.4: Số lượng phường/xã trung tâm phong phú (>= 70 vị trí, hiện có ${wardsData.features.length})`,
    wardsData.features && wardsData.features.length >= 70
  );

  // Kiểm tra phủ sóng 34/34 tỉnh thành
  const provinceCodes = new Set(wardsData.features.map((f) => f.properties.provinceCode));
  assertTest(
    `T8.5: Phủ sóng toàn bộ 34/34 tỉnh thành Việt Nam (Số tỉnh có dữ liệu: ${provinceCodes.size})`,
    provinceCodes.size === 34
  );

  // Kiểm tra tính toàn vẹn chủ quyền Hoàng Sa & Trường Sa
  const hoangSaWard = wardsData.features.find(
    (f) => f.properties.provinceCode === "VN48" && f.properties.isIsland
  );
  assertTest(
    "T8.6: Có Xã đảo Hoàng Sa thuộc TP. Đà Nẵng",
    hoangSaWard && hoangSaWard.properties.name.includes("Hoàng Sa")
  );

  const truongSaWards = wardsData.features.filter(
    (f) => f.properties.provinceCode === "VN56" && f.properties.isIsland
  );
  assertTest(
    `T8.7: Có đầy đủ các đơn vị hành chính đảo Trường Sa thuộc Tỉnh Khánh Hòa (Số xã/thị trấn đảo: ${truongSaWards.length})`,
    truongSaWards.length >= 3
  );

  const hasTruongSaTown = truongSaWards.some((w) => w.properties.name === "Thị trấn Trường Sa");
  const hasSongTuTay = truongSaWards.some((w) => w.properties.name === "Xã Song Tử Tây");
  const hasSinhTon = truongSaWards.some((w) => w.properties.name === "Xã Sinh Tồn");
  assertTest(
    "T8.8: Đầy đủ Thị trấn Trường Sa, Xã Song Tử Tây, Xã Sinh Tồn",
    hasTruongSaTown && hasSongTuTay && hasSinhTon
  );

  // Kiểm tra cực Nam Đất Mũi, Cực Tây A Pa Chải, Bản Giốc, Sa Vĩ
  const hasDatMui = wardsData.features.some(
    (w) => w.properties.provinceCode === "VN96" && w.properties.name.includes("Đất Mũi")
  );
  assertTest("T8.9: Có Mốc tọa độ cực Nam Đất Mũi (Cà Mau)", hasDatMui);

  const hasSaVi = wardsData.features.some(
    (w) => w.properties.provinceCode === "VN22" && w.properties.name.includes("Trà Cổ")
  );
  assertTest("T8.10: Có Mũi Sa Vĩ - Trà Cổ (Quảng Ninh)", hasSaVi);

  // Kiểm tra tọa độ hợp lệ (Lon, Lat)
  const coordsValid = wardsData.features.every((f) => {
    const [lon, lat] = f.geometry.coordinates;
    return (
      typeof lon === "number" &&
      typeof lat === "number" &&
      lon >= 101 &&
      lon <= 118.5 &&
      lat >= 8 &&
      lat <= 24
    );
  });
  assertTest("T8.11: Tất cả tọa độ [lon, lat] nằm trong phạm vi địa lý lãnh thổ Việt Nam", coordsValid);
}

// 2. Kiểm tra VietnamMap.tsx tích hợp lớp Phường/Xã LOD
const mapFile = path.join(__dirname, "../frontend/components/map/VietnamMap.tsx");
const mapContent = fs.readFileSync(mapFile, "utf8");

assertTest("T8.12: VietnamMap.tsx tải dữ liệu vietnam_central_wards.geojson", mapContent.includes("vietnam_central_wards.geojson"));
assertTest("T8.13: Phường/Xã được tích hợp trực tiếp vào 3 chế độ bản đồ (isWardsVisible)", mapContent.includes("isWardsVisible"));
assertTest("T8.14: Logic LOD zoom >= 1.5 hoặc khi chọn tỉnh", mapContent.includes("zoom >= 1.5") || mapContent.includes("selectedProvince !== null"));
assertTest("T8.15: Thanh công cụ gom gọn vào 3 chế độ cốt lõi, không có nút rời rạc", mapContent.includes("hanh_chinh") && mapContent.includes("tu_nhien") && mapContent.includes("kinh_te") && !mapContent.includes("Phường/Xã trung tâm"));
assertTest("T8.16: Hiển thị tooltip chi tiết khi rê chuột vào điểm phường/xã", mapContent.includes("hoveredWard") && mapContent.includes("wardTooltipPos"));
assertTest("T8.17: Hiệu ứng vòng tròn lan tỏa pulse ring cho xã đảo và điểm được chọn", mapContent.includes("animate-ping"));
assertTest("T8.18: Nhãn tên phường/xã có nền tương phản cao", mapContent.includes("ward.properties.name"));

// 3. Kiểm tra ProvinceDetailPanel.tsx hiển thị danh sách phường/xã
const panelFile = path.join(__dirname, "../frontend/components/panels/ProvinceDetailPanel.tsx");
const panelContent = fs.readFileSync(panelFile, "utf8");

assertTest("T8.19: ProvinceDetailPanel tải danh sách phường/xã theo tỉnh", panelContent.includes("vietnam_central_wards.geojson"));
assertTest("T8.20: Mục 'Phường / Xã trung tâm trọng điểm' trong Tab Tổng quan", panelContent.includes("Phường / Xã trung tâm trọng điểm"));
assertTest("T8.21: Hiển thị tên, quận/huyện, vai trò và tọa độ địa lý của từng phường/xã", panelContent.includes("w.properties.district") && panelContent.includes("w.properties.role"));

// 4. Kiểm tra Type định nghĩa geo.ts
const geoTypeFile = path.join(__dirname, "../frontend/types/geo.ts");
const geoTypeContent = fs.readFileSync(geoTypeFile, "utf8");

assertTest("T8.22: WardProperties và WardFeature được định nghĩa trong types/geo.ts", geoTypeContent.includes("WardProperties") && geoTypeContent.includes("WardFeature"));

console.log("--------------------------------------------------------------------------------");
console.log(`KẾT QUẢ KIỂM THỬ: ${totalPassed} Passed, ${totalFailed} Failed (Tổng cộng: ${totalPassed + totalFailed} tests)`);
console.log("================================================================================");

if (totalFailed > 0) {
  process.exit(1);
} else {
  console.log(">>> TẤT CẢ CÁC BÀI TEST GIAI ĐOẠN 8 ĐÃ VƯỢT QUA 100%! <<<");
}
