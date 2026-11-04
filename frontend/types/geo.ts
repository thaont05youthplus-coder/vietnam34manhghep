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
  subtitle?: string;
  imageUrl?: string;
  description?: string;
  resolutionGuideline?: string;
  growthCorridors?: string[];
  dynamicZone?: string;
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

export interface CommunePolygonProperties {
  id: string;
  code: string;
  name: string;
  provinceCode: string;
  provinceName: string;
  type: string;
  mergedFrom?: string;
  headquarters?: string;
  areaKm2: number;
  population: number;
  density: number;
  centroid: [number, number]; // [lon, lat]
  bbox: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
}

export interface CommunePolygonFeature {
  type: "Feature";
  id: string;
  properties: CommunePolygonProperties;
  geometry: GeoJsonGeometry;
}

export interface CommunePolygonCollection {
  type: "FeatureCollection";
  provinceCode?: string;
  features: CommunePolygonFeature[];
}
