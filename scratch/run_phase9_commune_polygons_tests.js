const fs = require("fs");
const path = require("path");

console.log("================================================================================");
console.log("   KIỂM THỬ GIAI ĐOẠN 9: RANH GIỚI ĐA GIÁC XÃ/PHƯỜNG (TÁCH TỪNG MẢNG CHUẨN GIS.VN)");
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

// 1. Kiểm tra file GeoJSON tổng
const fullGeoPath = path.join(__dirname, "../frontend/public/data/vietnam_communes_34.geojson");
assertTest("T9.1: File vietnam_communes_34.geojson tồn tại", fs.existsSync(fullGeoPath));

// 2. Kiểm tra thư mục per-province JSON
const wardsDir = path.join(__dirname, "../frontend/public/data/wards");
assertTest("T9.2: Thư mục public/data/wards tồn tại", fs.existsSync(wardsDir));

const provCodes = [
  "VN01", "VN04", "VN08", "VN11", "VN12", "VN14", "VN15", "VN19", "VN20", "VN22",
  "VN24", "VN25", "VN31", "VN33", "VN37", "VN38", "VN40", "VN42", "VN44", "VN46",
  "VN48", "VN51", "VN52", "VN56", "VN66", "VN68", "VN75", "VN79", "VN80", "VN82",
  "VN86", "VN91", "VN92", "VN96"
];

let all34FilesExist = true;
let totalCommunesFound = 0;
for (const code of provCodes) {
  const filePath = path.join(wardsDir, `${code}.json`);
  if (!fs.existsSync(filePath)) {
    all34FilesExist = false;
    break;
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  totalCommunesFound += (data.features ? data.features.length : 0);
}

assertTest("T9.3: Đầy đủ 34 file GeoJSON xã/phường cho cả 34 tỉnh thành", all34FilesExist);
assertTest(`T9.4: Tổng số xã/phường phủ sóng toàn quốc (>3,000 xã, hiện có ${totalCommunesFound})`, totalCommunesFound >= 3000);

// 3. Kiểm tra tỉnh Nghệ An (VN40) - theo yêu cầu trực tiếp của user
const ngheAnPath = path.join(wardsDir, "VN40.json");
const ngheAnData = JSON.parse(fs.readFileSync(ngheAnPath, "utf8"));
assertTest("T9.5: Nghệ An (VN40) có trên 100 xã/phường sau sáp nhập", ngheAnData.features && ngheAnData.features.length >= 100);

const hasMuongQuang = ngheAnData.features.some(f => f.properties.name && f.properties.name.includes("Mường Quàng"));
const hasQuePhong = ngheAnData.features.some(f => f.properties.name && f.properties.name.includes("Quế Phong"));
const hasAnhSon = ngheAnData.features.some(f => f.properties.name && f.properties.name.includes("Anh Sơn"));
assertTest("T9.6: Nghệ An có các xã Mường Quàng, Quế Phong, Anh Sơn như trong ảnh gis.vn", hasMuongQuang && hasQuePhong && hasAnhSon);

// 4. Kiểm tra cấu trúc đa giác khép kín (Polygon/MultiPolygon) và tâm centroid
const sample = ngheAnData.features[0];
assertTest("T9.7: Xã/phường là đa giác khép kín (Polygon hoặc MultiPolygon)", sample.geometry.type === "Polygon" || sample.geometry.type === "MultiPolygon");
assertTest("T9.8: Có tâm centroid địa lý chuẩn [lon, lat] để đặt nhãn", Array.isArray(sample.properties.centroid) && sample.properties.centroid.length === 2);
assertTest("T9.9: Có thông tin diện tích (areaKm2) và dân số (population)", typeof sample.properties.areaKm2 === "number" && typeof sample.properties.population === "number");

// 5. Kiểm tra mã nguồn VietnamMap.tsx
const mapCode = fs.readFileSync(path.join(__dirname, "../frontend/components/map/VietnamMap.tsx"), "utf8");
assertTest("T9.10: VietnamMap.tsx có lớp commune-polygons-layer (mảng đa giác xã/phường)", mapCode.includes("commune-polygons-layer"));
assertTest("T9.11: VietnamMap.tsx có lớp commune-labels-layer (nhãn tên đặt tại tâm)", mapCode.includes("commune-labels-layer"));
assertTest("T9.12: Đường viền ranh giới xã/phường màu trắng mỏng tinh tế", mapCode.includes("rgba(255, 255, 255, 0.85)") || mapCode.includes("stroke=\"rgba(255, 255, 255"));
assertTest("T9.13: Có tooltip hiển thị chi tiết xã/phường khi rê chuột", mapCode.includes("hoveredCommune") && mapCode.includes("Trụ sở UBND"));

console.log("--------------------------------------------------------------------------------");
console.log(`KẾT QUẢ KIỂM THỬ: ${totalPassed} Passed, ${totalFailed} Failed (Tổng cộng: ${totalPassed + totalFailed} tests)`);
console.log("================================================================================");

if (totalFailed > 0) {
  process.exit(1);
}
