export type MapMode = "hanh_chinh" | "tu_nhien" | "kinh_te";

export interface ProvinceProperties {
  provinceCode: string;
  name: string;
  nameEn: string;
  areaSqKm: number;
  type: string;
  economicRegionId?: string;
  economicRegionName?: string;
  naturalRegionId?: string;
  naturalRegionName?: string;
}

export interface GeoJsonGeometry {
  type: "MultiPolygon" | "Polygon";
  coordinates: number[][][][];
}

export interface ProvinceFeature {
  type: "Feature";
  properties: ProvinceProperties;
  geometry: GeoJsonGeometry;
}

export interface ProvinceFeatureCollection {
  type: "FeatureCollection";
  name: string;
  features: ProvinceFeature[];
}

export interface RegionDefinition {
  id: string;
  name: string;
  color: string;
  type: "economic" | "natural";
  provinceCodes: string[];
}

export interface WardProperties {
  id: string;
  name: string;
  district: string;
  provinceCode: string;
  provinceName: string;
  type: string;
  role: string;
  isUrbanCenter?: boolean;
  isIsland?: boolean;
  isBorderOrExtreme?: boolean;
}

export interface WardFeature {
  type: "Feature";
  properties: WardProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lon, lat]
  };
}

export interface WardFeatureCollection {
  type: "FeatureCollection";
  name: string;
  features: WardFeature[];
}

