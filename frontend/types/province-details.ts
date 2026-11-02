export interface ProvinceOverview {
  name: string;
  officialName: string;
  nameEn: string;
  code: string;
  type: string; // Tỉnh / Thành phố trực thuộc Trung ương
  centerCity: string; // Thành phố / Thị xã trung tâm
  areaSqKm: number;
  population: number; // Người
  density: number; // Người/km²
  units: {
    districts: number; // Huyện / Quận / TX / TP
    communes: number; // Xã / Phường / Thị trấn
  };
  borders: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  sovereigntyNote?: string;
  mergerNote?: string;
}

export interface ProvinceNature {
  terrain: string;
  climate: string;
  hydrology: string;
  minerals: string;
  conservation: string[];
}

export interface ProvinceEconomy {
  grdpTotal: string; // Ví dụ: 250.000 tỉ VNĐ
  grdpPerCapita: string; // Ví dụ: 110 triệu VNĐ/người/năm
  growthRate: string; // Ví dụ: 7.2%
  structure: {
    agriculture: number; // %
    industry: number; // %
    services: number; // %
    taxes: number; // %
  };
  keyIndustries: string[];
  infrastructure: {
    airports: string[];
    seaports: string[];
    highways: string[];
  };
}

export interface ProvinceImageItem {
  id: string;
  title: string;
  url: string;
  description: string;
  tag: string;
}

export interface ProvinceSourceItem {
  id: string;
  title: string;
  organization: string;
  year: number | string;
  type: "statistical" | "legal" | "textbook" | "portal";
  documentNumber?: string;
  isVerified: boolean;
}

export interface CompleteProvinceDetail {
  code: string;
  overview: ProvinceOverview;
  nature: ProvinceNature;
  economy: ProvinceEconomy;
  images: ProvinceImageItem[];
  sources: ProvinceSourceItem[];
}
