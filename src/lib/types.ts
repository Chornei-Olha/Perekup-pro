export type Brand = { id: number; name: string };
export type Model = { id: number; name: string };
export type Region = { id: number; name: string };

export type Car = {
  id: number;
  title: string;
  year: number;
  price: number;
  marketPrice: number;
  mileage: number;
  engineVolume: number;
  gearbox: number;
  fuel: string;
  city: string;
  daysInSale: number;
  sellerCarCount: number;
  description: string;
  url: string;
  image: string;
  lastUpdate: string;
  model: string;
};

export interface CarSearchFilters {
  brands: number[];
  models: number[];
  region?: number;
  minPrice?: number;
  maxPrice?: number;
  minYear: number;
  maxYear: number;
  minEngineVolume?: number;
  maxEngineVolume?: number;
  minMileage?: number;
  maxMileage?: number;
  gearbox?: number;
  fuel?: number;
  paint?: boolean;
  transfer?: boolean;
  sold?: boolean;
  includeDealers?: boolean;
  includeBanned?: boolean;
  state?: number;
  marketPriceDeviation?: number;
  period?: number;
}
