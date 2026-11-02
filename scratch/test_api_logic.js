const fs = require('fs');
const path = require('path');

const healthPath = path.join(__dirname, '..', 'frontend', 'app', 'api', 'health', 'route.ts');
const healthCode = fs.readFileSync(healthPath, 'utf-8');

const geoPath = path.join(__dirname, '..', 'frontend', 'public', 'data', 'vietnam_34_provinces.geojson');
let content = fs.readFileSync(geoPath, 'utf-8');
if (content.charCodeAt(0) === 0xfeff) content = content.substring(1);
const geo = JSON.parse(content);
const provList = geo.features.map(f => f.properties);

console.log(JSON.stringify({
    healthHasHoangSa: healthCode.includes('Hoàng Sa'),
    healthHasTruongSa: healthCode.includes('Trường Sa'),
    totalProvinces: provList.length,
    hasDaNang: provList.some(p => p.name === 'Đà Nẵng'),
    hasKhanhHoa: provList.some(p => p.name === 'Khánh Hòa'),
}));
