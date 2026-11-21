export type TabRoute = 'beranda' | 'katalog' | 'harga' | 'perusahaan';

export interface BlangkoProduct {
  id: string;
  code: string;
  title: string;
  brand: string;
  category: 'softcover' | 'hardcover' | 'amplop-belt' | 'foil-gold';
  subCategoryTitle: string;
  priceRetail: number; // e.g. 750
  priceWholesale: number; // e.g. 650
  minOrder: number;
  stockText: string;
  material: string;
  dimensions: string;
  folds: string;
  foil: string;
  image: string;
  badge?: string;
  badgeColor?: string;
  description: string;
  features: string[];
}

export interface DigitalTheme {
  id: string;
  code: string;
  name: string;
  category: 'luxury' | 'rustic' | 'minimalist' | 'traditional';
  originalPrice: number;
  promoPrice: number;
  bundlePrice: number;
  musicTitle: string;
  image: string;
  demoNames: string;
  demoDate: string;
  location: string;
  description: string;
  features: string[];
}

export interface PortfolioItem {
  id: string;
  title: string;
  client: string;
  location: string;
  category: 'foil-hardcover' | 'softcover' | 'digital' | 'kemasan-grosir';
  categoryLabel: string;
  spec: string;
  duration: string;
  quantity: string;
  image: string;
  badge: string;
}
