import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { BlangkoProduct, DigitalTheme } from '../types';
import { BLANGKO_PRODUCTS, DIGITAL_THEMES } from '../data/products';

interface CatalogViewProps {
  onOpenProductSpec: (product: BlangkoProduct) => void;
  onOpenDigitalDemo: (theme: DigitalTheme) => void;
  initialSearchQuery?: string;
}

// ============================================================================
// SELF-CONTAINED TYPES & CONSTANTS FOR VIEW A (PHYSICAL INVITATION BLANKS)
// ============================================================================

type SegmentTier = 'PREMIUM' | 'MENENGAH' | 'EKONOMIS' | 'SUPER HEMAT';
type OrientationType = 'Portrait' | 'Lanskap' | 'Persegi';
type ViewMode = 'galeri-grid-4-kolom' | 'galeri-compact-6-kolom' | 'galeri-tabel-data';
type SortOption = 'series-az' | 'series-za' | 'popular' | 'latest';

interface FilterState {
  segment: string;
  primaryColor: string;
  secondaryColor: string;
  foldingType: string;
  orientation: string;
  hasEnvelope: string;
}

interface RawAppsScriptItem {
  Series: string;
  'Nomor Kode': string | number;
  'Warna Dominan': string;
  'Warna Sekunder': string;
  Lipatan: string;
  'Orientasi Layout': string;
  Amplop: string;
  'Segmen Harga': string;
  'Lihat Drive': string;
  DriveUrl: string;
  ThumbnailUrl: string;
}

interface AppsScriptResponse {
  status: string;
  data: RawAppsScriptItem[];
}

interface InvitationItem {
  id: string;
  series: string;
  code: string;
  primaryColor: string;
  secondaryColor: string;
  folding: string;
  orientation: OrientationType;
  envelope: string;
  priceSegment: SegmentTier;
  imageFilename: string;
  driveUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  segment: SegmentTier;
  primaryColorName: string;
  primaryColorHex: string;
  secondaryColorName: string;
  secondaryColorHex: string;
  foldingType: string;
  hasEnvelope: boolean;
  image: string;
  paperType: string;
  dimensions: string;
  envelopeType: string;
  foilType?: string;
  popularityScore?: number;
  releaseDate?: string;
}

const APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzInTSFhwdXKIqG_wbBXFvqY8BIb5JWW148FE4B8528r1Hi8hLfx3oqFL541XUsg4x_Qw/exec';

const CACHE_KEY = 'rezwan_catalog_apps_script_cache';

const DEFAULT_FALLBACK_COVER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAHN6q_GJKk9sMGQJ8K4E3wa4d5uv7hF5xgmgHLszooEahvwNzkaIxn41Zp8xTnWwjgm5LhYZzkSzY_8q24zHjJTGp2R2MBD7-9rIe4slDQ7zadSTu6dk1X6AvHMmYplLyKzE3Kqt3V5jX1Rv0rlfj1gOPbAtulqvQ3woci3u6rVxVgnSYHXttipegQGlcmQlFEEF3nrd8KslSK7DH04lEbjkS69On-uPZLE-i0T6w';

const SEGMENTS: {
  id: SegmentTier;
  name: string;
  bg: string;
  text: string;
  border: string;
  icon: string;
}[] = [
  { id: 'SUPER HEMAT', name: 'Super Hemat', bg: '#F3E8FF', text: '#6B21A8', border: '#E9D5FF', icon: 'price_check' },
  { id: 'EKONOMIS', name: 'Ekonomis', bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0', icon: 'savings' },
  { id: 'MENENGAH', name: 'Menengah', bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE', icon: 'workspace_premium' },
  { id: 'PREMIUM', name: 'Premium', bg: '#FEF3C7', text: '#92400E', border: '#FDE68A', icon: 'star' },
];

const COLOR_HEX_MAP: Record<string, string> = {
  cokelat: '#78350F',
  biru: '#2563EB',
  pink: '#EC4899',
  hitam: '#1E293B',
  krem: '#D97706',
  hijau: '#16A34A',
  'kuning / emas': '#D4AF37',
  kuning: '#EAB308',
  emas: '#D4AF37',
  putih: '#FFFFFF',
  ungu: '#9333EA',
  'abu-abu': '#64748B',
  merah: '#DC2626',
  sage: '#8A9A86',
  navy: '#0F172A',
  maroon: '#800020',
  terracotta: '#E07A5F',
  lilac: '#C084FC',
};

function getColorHex(colorName: string): string {
  if (!colorName) return '#CBD5E1';
  const clean = colorName.toLowerCase().trim();
  for (const [key, hex] of Object.entries(COLOR_HEX_MAP)) {
    if (clean.includes(key)) return hex;
  }
  return '#94A3B8';
}

function normalizeOrientation(raw: string): OrientationType {
  const clean = (raw || '').toLowerCase().trim();
  if (clean.includes('land') || clean.includes('lan') || clean.includes('horizontal')) return 'Lanskap';
  if (clean.includes('square') || clean.includes('persegi')) return 'Persegi';
  return 'Portrait';
}

function normalizeSegment(raw: string): SegmentTier {
  const clean = (raw || '').toLowerCase().trim();
  if (clean.includes('super') || clean.includes('hemat')) return 'SUPER HEMAT';
  if (clean.includes('ekonomis')) return 'EKONOMIS';
  if (clean.includes('menengah')) return 'MENENGAH';
  return 'PREMIUM';
}

function formatProductCode(series: string, rawCode: string | number): string {
  if (rawCode === null || rawCode === undefined || rawCode === '') {
    return series || 'PROD';
  }

  let codeStr = String(rawCode).trim();
  if (/^\d+$/.test(codeStr)) {
    const num = parseInt(codeStr, 10);
    codeStr = num < 10 ? `0${num}` : `${num}`;
  }

  if (/[a-zA-Z]/.test(codeStr) || codeStr.includes('-')) {
    return codeStr;
  }

  const prefix = (series || 'UND').trim();
  return `${prefix}-${codeStr}`;
}

function mapRawItemToInvitation(raw: RawAppsScriptItem, index: number): InvitationItem {
  const series = (raw.Series || 'Katalog Undangan').trim();
  const rawCode = raw['Nomor Kode'];
  const formattedCode = formatProductCode(series, rawCode);
  const primaryColor = (raw['Warna Dominan'] || 'Putih').trim();
  const secondaryColor = (raw['Warna Sekunder'] || 'Emas').trim();
  const folding = (raw.Lipatan || 'Lipat 2').trim();
  const orientation = normalizeOrientation(raw['Orientasi Layout']);
  const envelope = (raw.Amplop || 'Tanpa Amplop').trim();
  const hasEnvelope = envelope.toLowerCase().includes('dengan');
  const priceSegment = normalizeSegment(raw['Segmen Harga']);
  const imageFilename = raw['Lihat Drive'] || '';
  const driveUrl = raw.DriveUrl || '';
  const thumbnailUrl = raw.ThumbnailUrl || '';

  const image = thumbnailUrl.trim() || DEFAULT_FALLBACK_COVER;

  let paperType = 'Concorde Linen 260gsm';
  if (priceSegment === 'SUPER HEMAT') paperType = 'BC Super White 210gsm';
  else if (priceSegment === 'EKONOMIS') paperType = 'Art Carton 230gsm Doff';
  else if (priceSegment === 'MENENGAH') paperType = 'Jasmine Shimmer 230gsm';
  else if (priceSegment === 'PREMIUM') paperType = 'Hardcover Linen / Beludru';

  const dimensions =
    orientation === 'Lanskap'
      ? '21 cm x 15 cm'
      : orientation === 'Persegi'
      ? '15 cm x 15 cm'
      : '15 cm x 21 cm';

  return {
    id: `item-${series}-${rawCode || index}`,
    series,
    code: formattedCode,
    primaryColor,
    secondaryColor,
    folding,
    orientation,
    envelope,
    priceSegment,
    imageFilename,
    driveUrl,
    thumbnailUrl,
    title: series,
    description: `Undangan seri ${series} dengan konsep ${folding} dan format ${orientation}.`,
    segment: priceSegment,
    primaryColorName: primaryColor,
    primaryColorHex: getColorHex(primaryColor),
    secondaryColorName: secondaryColor,
    secondaryColorHex: getColorHex(secondaryColor),
    foldingType: folding,
    hasEnvelope,
    image,
    paperType,
    dimensions,
    envelopeType: envelope,
    foilType: secondaryColor,
    popularityScore: 90 - (index % 30),
    releaseDate: '2025-01-01',
  };
}

function inferPrimaryColor(product: BlangkoProduct): string {
  const text = `${product.title} ${product.description} ${product.material}`.toLowerCase();
  if (text.includes('emerald') || text.includes('hijau') || text.includes('sage')) return 'Hijau';
  if (text.includes('maroon') || text.includes('ruby')) return 'Merah';
  if (text.includes('navy') || text.includes('biru')) return 'Biru';
  if (text.includes('krem') || text.includes('cream')) return 'Krem';
  if (text.includes('hitam')) return 'Hitam';
  return 'Putih';
}

function inferSegment(product: BlangkoProduct): SegmentTier {
  if (product.priceWholesale <= 600) return 'SUPER HEMAT';
  if (product.priceWholesale <= 700) return 'EKONOMIS';
  if (product.priceWholesale <= 850) return 'MENENGAH';
  return 'PREMIUM';
}

function mapBlangkoToFallbackInvitations(products: BlangkoProduct[]): InvitationItem[] {
  return products.map((product, index) => {
    const segment = inferSegment(product);
    const primaryColor = inferPrimaryColor(product);
    const secondaryColor = product.foil.toLowerCase().includes('emas') || product.foil.toLowerCase().includes('gold')
      ? 'Kuning / Emas'
      : 'Putih';
    const hasEnvelope = product.folds.toLowerCase().includes('amplop') || product.category === 'amplop-belt';
    const orientation = normalizeOrientation(product.folds);

    return {
      id: product.id,
      series: product.brand,
      code: product.code,
      primaryColor,
      secondaryColor,
      folding: product.folds,
      orientation,
      envelope: hasEnvelope ? 'Dengan Amplop' : 'Tanpa Amplop',
      priceSegment: segment,
      imageFilename: '',
      driveUrl: '',
      thumbnailUrl: product.image,
      title: product.title,
      description: product.description,
      segment,
      primaryColorName: primaryColor,
      primaryColorHex: getColorHex(primaryColor),
      secondaryColorName: secondaryColor,
      secondaryColorHex: getColorHex(secondaryColor),
      foldingType: product.folds,
      hasEnvelope,
      image: product.image || DEFAULT_FALLBACK_COVER,
      paperType: product.material,
      dimensions: product.dimensions,
      envelopeType: hasEnvelope ? 'Dengan Amplop' : 'Tanpa Amplop',
      foilType: product.foil,
      popularityScore: 100 - index,
      releaseDate: '2025-01-01',
    };
  });
}

const FALLBACK_CATALOG: InvitationItem[] = mapBlangkoToFallbackInvitations(BLANGKO_PRODUCTS);

function getCachedCatalog(): InvitationItem[] | null {
  try {
    const saved = localStorage.getItem(CACHE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

async function fetchCatalogFromAppsScript(): Promise<InvitationItem[]> {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Gagal menghubungi Google Apps Script`);
    }

    const json: AppsScriptResponse = await response.json();

    if (json.status !== 'success' || !Array.isArray(json.data)) {
      throw new Error('Format data Google Apps Script tidak valid atau status bukan success');
    }

    const items = json.data.map((item, idx) => mapRawItemToInvitation(item, idx));

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(items));
      localStorage.setItem(`${CACHE_KEY}_time`, new Date().toISOString());
    } catch {
      // ignore storage errors
    }

    return items;
  } catch (error) {
    const cached = getCachedCatalog();
    if (cached && cached.length > 0) {
      return cached;
    }
    throw error;
  }
}

function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const target = e.currentTarget;
  if (target.src !== DEFAULT_FALLBACK_COVER) {
    target.src = DEFAULT_FALLBACK_COVER;
  }
}

function useDraggableScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const hasMovedRef = useRef(false);

  const checkScrollability = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    const observer = new ResizeObserver(() => {
      checkScrollability();
    });
    observer.observe(el);

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
      observer.disconnect();
    };
  }, [checkScrollability]);

  const scroll = useCallback((direction: 'left' | 'right', amount = 220) => {
    const el = containerRef.current;
    if (!el) return;
    const offset = direction === 'left' ? -amount : amount;
    el.scrollBy({ left: offset, behavior: 'smooth' });
  }, []);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDownRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDownRef.current) return;
    const el = containerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startXRef.current) * 1.3;
    if (Math.abs(walk) > 4) {
      hasMovedRef.current = true;
      setIsDragging(true);
    }
    el.scrollLeft = scrollLeftRef.current - walk;
  }, []);

  const onMouseUp = useCallback(() => {
    isDownRef.current = false;
    setTimeout(() => {
      hasMovedRef.current = false;
      setIsDragging(false);
    }, 60);
  }, []);

  const onMouseLeave = useCallback(() => {
    isDownRef.current = false;
    setTimeout(() => {
      hasMovedRef.current = false;
      setIsDragging(false);
    }, 60);
  }, []);

  return {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    isDragging,
    hasMovedRef,
    dragHandlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
  };
}

function getSegmentMeta(segment: string) {
  return (
    SEGMENTS.find((s) => s.id === segment) || {
      id: segment,
      name: segment,
      bg: '#FEF3C7',
      text: '#92400E',
      border: '#FDE68A',
      icon: 'star',
    }
  );
}

// ============================================================================
// INTERNAL SUBCOMPONENTS FOR VIEW A
// ============================================================================

interface ViewAHeaderProps {
  totalCount: number;
  segmentCounts: Record<SegmentTier, number>;
  selectedSegment: string;
  onSelectSegment: (segment: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastSyncTime?: Date | null;
}

const ViewAHeader: React.FC<ViewAHeaderProps> = ({
  totalCount,
  segmentCounts,
  selectedSegment,
  onSelectSegment,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  isRefreshing = false,
  lastSyncTime = null,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    containerRef: priceRailRef,
    canScrollLeft: canScrollPriceLeft,
    canScrollRight: canScrollPriceRight,
    scroll: scrollPrice,
    hasMovedRef: priceHasMovedRef,
    dragHandlers: priceDragHandlers,
  } = useDraggableScroll();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    if (isMobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleSelectViewMode = (mode: ViewMode) => {
    onViewModeChange(mode);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="relative z-30 w-full bg-white/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#dce2f7]">
      {/* Primary Top Bar */}
      <div className="w-full px-3.5 sm:px-6 py-2.5 sm:py-3 border-b border-[#e9edff] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0 min-w-0">
          <div className="relative p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#fff9f4] via-[#ffffff] to-[#f4f6ff] border border-[#dec1af]/70 shadow-xs flex items-center justify-center shrink-0 group transition-all duration-300 hover:shadow-md hover:border-[#f57c00]/50">
            <img
              alt="Logo"
              title="Logo"
              className="h-8 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1UyxsX4j-OkCArZ6JY7dk31eB53Jv4WnycTKzFYop1zzFONuBB9Vc16Hi8Ro_XlT-TUqoyScsuhoY9F7bHQ7Z4zKbgIXrTfsKRChiTS-1Lrp5ez05Yh-82EpIcYqKPlsUWmcFmA5uPhx7REFR_zvjeYmyWqF76TXTd_HhWH3ZBiYeGp1ZX5lOPw9aNqUHbrcZvOU0MiC8Suj6Ir5w3LLuhiSEVG59o2iDFL2liPJdd1"
            />
          </div>

          <div className="flex flex-col min-w-0 justify-center">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f57c00] shrink-0" />
              <span className="text-[10px] sm:text-[11px] md:text-[11.5px] tracking-[0.16em] uppercase text-[#964900] font-extrabold truncate">
                UD REZ WAN JAYA
              </span>
            </div>

            <h2 className="text-[16px] sm:text-[20px] md:text-[23px] font-serif font-bold tracking-tight text-[#141b2b] leading-tight truncate">
              <span>Katalog Galeri </span>
              <span className="italic font-normal text-[#964900]">Undangan</span>
            </h2>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e9edff] text-[#574235] text-[11px] font-semibold border border-[#dce2f7] shrink-0 ml-1">
            <span className="material-symbols-outlined text-[16px] text-[#964900]">verified</span>
            <span className="font-bold text-[#141b2b] tabular-nums">{totalCount} Desain</span> Terverifikasi
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              aria-label="Sinkronkan data katalog dari Google Spreadsheet"
              title={
                lastSyncTime
                  ? `Terakhir sinkron: ${lastSyncTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                  : 'Sinkronkan data dari Google Spreadsheet'
              }
              className="hidden sm:inline-flex items-center justify-center gap-1.5 min-h-[44px] px-3.5 rounded-lg border border-[#dec1af] bg-white text-[12px] font-semibold text-[#574235] hover:text-[#964900] hover:border-[#f57c00] transition-colors cursor-pointer shadow-2xs disabled:opacity-60"
            >
              <span className={`material-symbols-outlined text-[18px] text-[#964900] ${isRefreshing ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span className="hidden md:inline">
                {isRefreshing ? 'Menyinkron...' : 'Sinkron'}
              </span>
            </button>
          )}

          <nav aria-label="Mode Tampilan Desktop" className="hidden md:flex items-center p-1 bg-[#e9edff] rounded-lg text-[12px] font-semibold shrink-0">
            <button
              type="button"
              onClick={() => handleSelectViewMode('galeri-grid-4-kolom')}
              className={`min-h-[38px] px-3 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'galeri-grid-4-kolom'
                  ? 'bg-[#f57c00] text-[#572800] font-bold shadow-xs'
                  : 'text-[#574235] hover:text-[#141b2b]'
              }`}
              title="Tampilan Grid 4 Kolom"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span className="hidden lg:inline">Grid 4 Kolom</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectViewMode('galeri-compact-6-kolom')}
              className={`min-h-[38px] px-3 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'galeri-compact-6-kolom'
                  ? 'bg-[#f57c00] text-[#572800] font-bold shadow-xs'
                  : 'text-[#574235] hover:text-[#141b2b]'
              }`}
              title="Tampilan Grid Compact 6 Kolom"
            >
              <span className="material-symbols-outlined text-[16px]">view_compact</span>
              <span className="hidden lg:inline">Compact 6</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectViewMode('galeri-tabel-data')}
              className={`min-h-[38px] px-3 rounded transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'galeri-tabel-data'
                  ? 'bg-[#f57c00] text-[#572800] font-bold shadow-xs'
                  : 'text-[#574235] hover:text-[#141b2b]'
              }`}
              title="Tampilan List / Tabel"
            >
              <span className="material-symbols-outlined text-[16px]">table_rows</span>
              <span className="hidden lg:inline">Tabel Data</span>
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Tutup menu' : 'Buka menu navigasi dan tampilan'}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden flex items-center justify-center min-w-[44px] min-h-[44px] w-11 h-11 rounded-lg bg-[#e9edff] text-[#574235] hover:text-[#141b2b] hover:bg-[#dce2f7] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search and Sort */}
      <div className="w-full px-3.5 sm:px-6 py-2.5 sm:py-2 bg-[#f9f9ff] border-b border-[#e9edff]">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4">
          <div className="relative flex-1">
            <label htmlFor="catalog-search" className="sr-only">
              Cari nama seri, kode produk, jenis kertas
            </label>
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7263] text-[20px] pointer-events-none">
              search
            </span>
            <input
              id="catalog-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari nama seri, kode produk, kertas..."
              className="w-full min-h-[44px] pl-10 pr-10 rounded-lg border border-[#dec1af] bg-white text-[15px] sm:text-[14px] text-[#141b2b] placeholder:text-[#8b7263]/70 focus:outline-none focus:border-[#f57c00] focus:ring-2 focus:ring-[#f57c00]/20 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Bersihkan pencarian"
                className="absolute right-0 top-0 bottom-0 min-w-[44px] min-h-[44px] flex items-center justify-center text-[#8b7263] hover:text-[#141b2b] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="catalog-sort" className="sr-only">
              Urutkan katalog undangan
            </label>
            <div className="relative w-full sm:w-auto">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                sort
              </span>
              <select
                id="catalog-sort"
                value={sortOption}
                onChange={(e) => onSortChange(e.target.value as SortOption)}
                className="w-full sm:w-auto min-h-[44px] pl-8 pr-8 rounded-lg border border-[#dec1af] bg-white text-[13px] sm:text-[12px] font-semibold text-[#141b2b] focus:outline-none focus:border-[#f57c00] shadow-2xs cursor-pointer appearance-none"
              >
                <option value="series-az">Series & Kode (A–Z)</option>
                <option value="series-za">Series & Kode (Z–A)</option>
                <option value="popular">Model Terpopuler</option>
                <option value="latest">Rilisan Terbaru</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Harga / Segmen Horizontal Rail */}
      <nav aria-label="Filter Segmen Harga" className="relative w-full bg-white/90 border-b border-[#e9edff] select-none">
        {canScrollPriceLeft && (
          <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-2 pr-3 bg-gradient-to-r from-white via-white/90 to-transparent">
            <button
              type="button"
              onClick={() => scrollPrice('left', 220)}
              aria-label="Geser kategori harga ke kiri"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-[#dce2f7] text-[#964900] hover:bg-[#f57c00] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">chevron_left</span>
            </button>
          </div>
        )}

        {canScrollPriceRight && (
          <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center pr-2 pl-3 bg-gradient-to-l from-white via-white/90 to-transparent">
            <button
              type="button"
              onClick={() => scrollPrice('right', 220)}
              aria-label="Geser kategori harga ke kanan"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white shadow-md border border-[#dce2f7] text-[#964900] hover:bg-[#f57c00] hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">chevron_right</span>
            </button>
          </div>
        )}

        <div
          ref={priceRailRef}
          {...priceDragHandlers}
          className="flex items-center gap-2 px-3.5 sm:px-6 py-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-center gap-1 text-[11px] text-[#8b7263] uppercase tracking-wider font-bold whitespace-nowrap pl-0.5 shrink-0">
            <span className="material-symbols-outlined text-[15px] text-[#964900]">sell</span>
            <span>Harga:</span>
          </div>

          {SEGMENTS.map((seg) => {
            const isSelected = selectedSegment === seg.id;
            const count = segmentCounts[seg.id] ?? 0;
            return (
              <button
                key={seg.id}
                type="button"
                onClick={() => {
                  if (priceHasMovedRef.current) return;
                  onSelectSegment(isSelected ? '' : seg.id);
                }}
                style={{
                  backgroundColor: seg.bg,
                  color: seg.text,
                  borderColor: seg.border,
                }}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-full border text-[12px] font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95 select-none ${
                  isSelected ? 'ring-2 ring-[#f57c00] ring-offset-1 font-extrabold shadow-sm' : 'hover:opacity-90'
                }`}
                title={`Filter harga: ${seg.name}`}
              >
                <span className="material-symbols-outlined text-[14px]">{seg.icon}</span>
                <span>{seg.name}</span>
                <span className="opacity-80 text-[10.5px] tabular-nums">({count})</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu Opsi Navigasi dan Tampilan"
          className="fixed inset-0 z-50 bg-[#141b2b]/70 backdrop-blur-sm flex flex-col justify-end md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-full bg-gradient-to-b from-white via-[#fcfdff] to-[#f5f7fd] rounded-t-[32px] p-5 sm:p-6 shadow-[0_-10px_35px_rgba(0,0,0,0.18)] border-t border-white/80 max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-[#dec1af]/70 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3.5 border-b border-[#e9edff] mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ffeedd] to-[#ffe2c7] border border-[#f57c00]/30 flex items-center justify-center text-[#964900] shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">dashboard_customize</span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-[18px] text-[#141b2b] leading-tight">
                    Menu & Tampilan
                  </h3>
                  <p className="text-[11.5px] text-[#8b7263] mt-0.5">
                    Pilih tata letak galeri & kelola katalog
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Tutup menu"
                className="min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center rounded-full bg-[#f1f3ff] text-[#574235] hover:text-[#141b2b] hover:bg-[#e1e8fd] active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#fffaf4] via-white to-[#f4f7fe] border border-[#dec1af]/60 shadow-xs mb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-[14px] text-[#141b2b] tabular-nums">{totalCount} Desain</span>
                    </div>
                    <p className="text-[11px] text-[#8b7263]">
                      {lastSyncTime
                        ? `Terakhir sinkron: ${lastSyncTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`
                        : 'Katalog Blangko Undangan'}
                    </p>
                  </div>
                </div>

                {onRefresh && (
                  <button
                    type="button"
                    onClick={onRefresh}
                    disabled={isRefreshing}
                    className="min-h-[42px] px-3.5 rounded-xl bg-white border border-[#dec1af] hover:border-[#f57c00] text-[12px] font-bold text-[#964900] flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 transition-all disabled:opacity-60"
                  >
                    <span className={`material-symbols-outlined text-[17px] ${isRefreshing ? 'animate-spin' : ''}`}>
                      sync
                    </span>
                    <span>{isRefreshing ? 'Sinkron...' : 'Sinkron'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <span className="text-[11px] font-bold text-[#8b7263] uppercase tracking-wider block mb-2.5 px-0.5">
                Tata Letak Tampilan
              </span>
              <div className="space-y-2.5">
                {[
                  {
                    mode: 'galeri-grid-4-kolom' as ViewMode,
                    icon: 'grid_view',
                    title: 'Grid Galeri (Foto Besar)',
                    badge: 'Favorit',
                    desc: 'Fokus pada foto mockup, label segmen harga & palet warna',
                  },
                  {
                    mode: 'galeri-compact-6-kolom' as ViewMode,
                    icon: 'view_compact',
                    title: 'Grid Compact (2 Kolom HP)',
                    badge: 'Ringkas',
                    desc: 'Hemat ruang untuk membandingkan banyak seri dengan cepat',
                  },
                  {
                    mode: 'galeri-tabel-data' as ViewMode,
                    icon: 'table_rows',
                    title: 'Tabel & List Spesifikasi',
                    badge: 'Detail',
                    desc: 'Lengkap dengan bahan kertas, jenis lipatan & amplop',
                  },
                ].map((opt) => {
                  const active = viewMode === opt.mode;
                  return (
                    <button
                      key={opt.mode}
                      type="button"
                      onClick={() => handleSelectViewMode(opt.mode)}
                      className={`w-full min-h-[58px] p-3 rounded-2xl flex items-center justify-between border transition-all text-left cursor-pointer active:scale-[0.99] ${
                        active
                          ? 'bg-gradient-to-r from-[#fff3e6] to-[#fff8f0] border-[#f57c00] shadow-[0_2px_10px_rgba(245,124,0,0.15)] ring-1 ring-[#f57c00]'
                          : 'bg-white border-[#dec1af]/60 hover:bg-[#f1f3ff]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            active ? 'bg-[#f57c00] text-white shadow-xs' : 'bg-[#f4f6ff] text-[#574235]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">{opt.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13.5px] font-bold text-[#141b2b]">{opt.title}</span>
                            <span className="px-1.5 py-0.5 rounded-md bg-[#eef2fe] text-[#293040] text-[9.5px] font-extrabold uppercase">
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#574235] mt-0.5">{opt.desc}</p>
                        </div>
                      </div>

                      <div className="shrink-0 ml-2">
                        {active ? (
                          <span className="material-symbols-outlined text-[22px] text-[#f57c00]">check_circle</span>
                        ) : (
                          <span className="w-5 h-5 rounded-full border border-[#dec1af] inline-block" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-3.5">
              <a
                href="https://wa.me/6285103580450?text=Halo%20UD%20REZ%20WAN%20JAYA%2C%20saya%20tertarik%20tanya%20info%20katalog%20cetak%20undangan."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-[13px] font-bold flex items-center justify-center gap-2 shadow-2xs transition-all"
              >
                <span className="material-symbols-outlined text-[20px] text-emerald-700">chat</span>
                <span>Konsultasi Cetak via WhatsApp</span>
              </a>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full min-h-[48px] rounded-2xl bg-[#eef2fe] hover:bg-[#dce2f7] text-[#293040] text-[13.5px] font-bold transition-colors cursor-pointer"
            >
              Tutup Menu
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

interface SeriesFilterRailProps {
  selectedSeries: string;
  onSelectSeries: (series: string) => void;
  seriesCounts: Record<string, number>;
  totalCount: number;
  seriesList: string[];
}

const SeriesFilterRail: React.FC<SeriesFilterRailProps> = ({
  selectedSeries,
  onSelectSeries,
  seriesCounts,
  totalCount,
  seriesList,
}) => {
  const { containerRef, canScrollLeft, canScrollRight, scroll, hasMovedRef, dragHandlers } =
    useDraggableScroll();

  return (
    <section
      aria-label="Navigasi Series Undangan"
      className="relative w-full bg-white px-3 sm:px-6 py-2 border-b border-[#e9edff] shadow-2xs select-none"
    >
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center pl-2 pr-4 bg-gradient-to-r from-white via-white/90 to-transparent">
          <button
            type="button"
            onClick={() => scroll('left', 260)}
            aria-label="Geser seri ke kiri"
            className="w-8 h-8 rounded-full bg-white shadow-md border border-[#dce2f7] text-[#964900] hover:bg-[#f57c00] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </button>
        </div>
      )}

      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 z-20 flex items-center pr-2 pl-4 bg-gradient-to-l from-white via-white/90 to-transparent">
          <button
            type="button"
            onClick={() => scroll('right', 260)}
            aria-label="Geser seri ke kanan"
            className="w-8 h-8 rounded-full bg-white shadow-md border border-[#dce2f7] text-[#964900] hover:bg-[#f57c00] hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      )}

      <div
        ref={containerRef}
        {...dragHandlers}
        className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden scroll-smooth py-0.5 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-center gap-1 text-[11px] text-[#8b7263] uppercase tracking-wider font-bold whitespace-nowrap pl-0.5 pr-1 shrink-0">
          <span className="material-symbols-outlined text-[16px] text-[#964900]">auto_awesome</span>
          <span>Seri:</span>
        </div>

        {seriesList.map((series) => {
          const isAll = series === 'Semua Series';
          const isSelected =
            selectedSeries === series || (isAll && (!selectedSeries || selectedSeries === 'Semua Series'));
          const count = isAll ? totalCount : seriesCounts[series] ?? 0;

          return (
            <button
              key={series}
              type="button"
              onClick={() => {
                if (hasMovedRef.current) return;
                onSelectSeries(isAll ? '' : series);
              }}
              className={`min-h-[42px] sm:min-h-[38px] px-3.5 py-1.5 rounded-full text-[12.5px] whitespace-nowrap transition-all duration-200 flex items-center gap-2 cursor-pointer select-none shrink-0 active:scale-95 ${
                isSelected
                  ? 'bg-[#f57c00] text-[#572800] font-bold shadow-[0_2px_8px_rgba(245,124,0,0.25)] ring-1 ring-[#9b4500]/20'
                  : 'bg-[#e9edff] text-[#574235] hover:text-[#141b2b] hover:bg-[#dce2f7] font-medium'
              }`}
            >
              <span>{series}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-semibold tabular-nums ${
                  isSelected ? 'bg-white/40 text-[#572800]' : 'bg-white/70 text-[#8b7263]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

interface ParameterFiltersProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  totalFiltered: number;
  totalCatalog: number;
  startIndex: number;
  endIndex: number;
  sortLabel: string;
  availableColors: string[];
  availableFoldings: string[];
}

const ParameterFilters: React.FC<ParameterFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  isFiltered,
  totalFiltered,
  totalCatalog,
  startIndex,
  endIndex,
  sortLabel,
  availableColors,
  availableFoldings,
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <section
      aria-label="Filter Parameter Produk"
      className="w-full px-3.5 sm:px-6 py-2.5 sm:py-3 bg-[#f1f3ff] border-b border-[#dce2f7]"
    >
      {/* Mobile Accordion Header */}
      <div className="flex items-center justify-between gap-2 lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          aria-expanded={isMobileExpanded}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-[#dec1af]/70 text-[#141b2b] text-[13px] font-semibold flex items-center gap-2 shadow-2xs hover:border-[#f57c00] transition-colors cursor-pointer flex-1 sm:flex-none justify-between sm:justify-start"
        >
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[19px] text-[#964900]">tune</span>
            <span>Filter Spesifikasi</span>
            {activeCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#f57c00] text-white text-[10.5px] font-bold">
                {activeCount}
              </span>
            )}
          </div>
          <span className="material-symbols-outlined text-[18px] text-[#8b7263]">
            {isMobileExpanded ? 'expand_less' : 'expand_more'}
          </span>
        </button>

        {isFiltered && (
          <button
            type="button"
            onClick={onResetFilters}
            className="min-h-[44px] px-3 py-2 rounded-xl bg-[#e9edff] hover:bg-[#dce2f7] text-[#574235] text-[12px] font-bold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[17px]">restart_alt</span>
            <span>Reset</span>
          </button>
        )}

        <div className="text-[12px] text-[#574235] hidden sm:block shrink-0">
          <strong className="text-[#141b2b] tabular-nums">{totalFiltered}</strong> Produk
        </div>
      </div>

      {/* Filter Options */}
      <div className={`${isMobileExpanded ? 'block mt-3' : 'hidden'} lg:block`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap items-center gap-2 flex-1">
            {/* Segmen Harga */}
            <div className="relative w-full lg:w-auto lg:min-w-[130px]">
              <label htmlFor="filter-segment" className="sr-only">Filter Berdasarkan Segmen</label>
              <select
                id="filter-segment"
                value={filters.segment}
                onChange={(e) => onFilterChange('segment', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Segmen: Semua</option>
                <option value="SUPER HEMAT">Super Hemat</option>
                <option value="EKONOMIS">Ekonomis</option>
                <option value="MENENGAH">Menengah</option>
                <option value="PREMIUM">Premium</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Warna Dominan */}
            <div className="relative w-full lg:w-auto lg:min-w-[130px]">
              <label htmlFor="filter-primary-color" className="sr-only">Filter Warna Dominan</label>
              <select
                id="filter-primary-color"
                value={filters.primaryColor}
                onChange={(e) => onFilterChange('primaryColor', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Warna Dominan</option>
                {availableColors.map((color) => (
                  <option key={`p-${color}`} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Warna Sekunder */}
            <div className="relative w-full lg:w-auto lg:min-w-[130px]">
              <label htmlFor="filter-secondary-color" className="sr-only">Filter Warna Sekunder</label>
              <select
                id="filter-secondary-color"
                value={filters.secondaryColor}
                onChange={(e) => onFilterChange('secondaryColor', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Warna Sekunder</option>
                {availableColors.map((color) => (
                  <option key={`s-${color}`} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Jenis Lipatan */}
            <div className="relative w-full lg:w-auto lg:min-w-[130px]">
              <label htmlFor="filter-folding" className="sr-only">Filter Jenis Lipatan</label>
              <select
                id="filter-folding"
                value={filters.foldingType}
                onChange={(e) => onFilterChange('foldingType', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Jenis Lipatan</option>
                {availableFoldings.map((fold) => (
                  <option key={fold} value={fold}>
                    {fold}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Orientasi */}
            <div className="relative w-full lg:w-auto lg:min-w-[110px]">
              <label htmlFor="filter-orientation" className="sr-only">Filter Orientasi Layout</label>
              <select
                id="filter-orientation"
                value={filters.orientation}
                onChange={(e) => onFilterChange('orientation', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Orientasi</option>
                <option value="Portrait">Portrait</option>
                <option value="Lanskap">Lanskap</option>
                <option value="Persegi">Persegi</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {/* Amplop */}
            <div className="relative w-full lg:w-auto lg:min-w-[125px]">
              <label htmlFor="filter-envelope" className="sr-only">Filter Status Amplop</label>
              <select
                id="filter-envelope"
                value={filters.hasEnvelope}
                onChange={(e) => onFilterChange('hasEnvelope', e.target.value)}
                className="w-full min-h-[44px] sm:min-h-[38px] pl-3 pr-8 rounded-lg bg-white text-[#141b2b] text-[13px] sm:text-[11.5px] font-semibold shadow-xs border border-[#dec1af]/60 focus:outline-none focus:ring-2 focus:ring-[#f57c00]/20 appearance-none cursor-pointer"
              >
                <option value="">Amplop</option>
                <option value="dengan-amplop">Dengan Amplop</option>
                <option value="tanpa-amplop">Tanpa Amplop</option>
              </select>
              <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={onResetFilters}
                className="hidden lg:flex min-h-[38px] px-3 rounded-lg bg-[#e9edff] text-[#574235] hover:text-[#964900] hover:bg-[#dce2f7] text-[11px] font-bold items-center gap-1 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                <span>Reset</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-3 shrink-0 pt-2 lg:pt-0 border-t border-[#dce2f7]/60 lg:border-t-0">
            <div className="flex items-center gap-1.5 text-[#574235] text-[12px] sm:text-[12.5px]">
              <span className="w-2 h-2 rounded-full bg-[#f57c00] shrink-0" />
              <span>
                Menampilkan{' '}
                <strong className="text-[#141b2b] font-bold tabular-nums">
                  {totalFiltered === 0 ? 0 : `${startIndex}–${endIndex}`}
                </strong>{' '}
                dari <strong className="text-[#141b2b] font-bold tabular-nums">{totalFiltered}</strong> Produk
                {totalFiltered !== totalCatalog && (
                  <span className="text-[#8b7263] ml-1 tabular-nums">(total {totalCatalog})</span>
                )}
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[#8b7263] text-[11px] font-semibold">
              <span className="material-symbols-outlined text-[15px]">sync_alt</span>
              <span>{sortLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const CardGrid4: React.FC<{ items: InvitationItem[]; onPreview: (item: InvitationItem) => void }> = ({
  items,
  onPreview,
}) => {
  const getFoldingIcon = (folding: string) => {
    if (folding.includes('Gatefold') || folding.includes('splitscreen')) return 'splitscreen';
    if (folding.includes('Z-Fold') || folding.includes('density_medium')) return 'density_medium';
    if (folding.includes('Horizontal') || folding.includes('view_stream')) return 'view_stream';
    if (folding.includes('Hardcover') || folding.includes('inventory_2')) return 'inventory_2';
    if (folding.includes('Single')) return 'crop_portrait';
    return 'view_column';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item) => {
        const seg = getSegmentMeta(item.segment);

        return (
          <article
            key={item.id}
            onClick={() => onPreview(item)}
            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#dec1af]/40 cursor-pointer"
          >
            <div className="relative w-full aspect-[4/3] bg-[#f1f3ff] overflow-hidden flex items-center justify-center p-3 select-none">
              <img
                src={item.image}
                alt={`Undangan seri ${item.series}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-sm"
              />

              <div className="absolute top-3.5 left-3.5 z-10">
                <span
                  style={{
                    backgroundColor: seg.bg,
                    color: seg.text,
                    borderColor: seg.border,
                  }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide shadow-xs flex items-center gap-1.5 border"
                >
                  <span className="material-symbols-outlined text-[13px]">{seg.icon}</span>
                  <span>{item.segment}</span>
                </span>
              </div>

              <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full shadow-sm border border-white">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                  style={{ backgroundColor: item.primaryColorHex }}
                  title={`Warna Dominan: ${item.primaryColorName}`}
                />
                <span
                  className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                  style={{ backgroundColor: item.secondaryColorHex }}
                  title={`Warna Sekunder: ${item.secondaryColorName}`}
                />
              </div>

              <div className="hidden sm:flex absolute inset-0 bg-[#293040]/30 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center p-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(item);
                  }}
                  className="min-h-[44px] py-2.5 px-5 rounded-lg bg-white text-[#141b2b] text-[13px] font-bold hover:bg-[#964900] hover:text-white transition-all flex items-center justify-center gap-1.5 shadow-lg cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>Lihat Pratinjau</span>
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  <h3 className="text-[18px] sm:text-[20px] text-[#141b2b] font-serif font-bold group-hover:text-[#964900] transition-colors leading-tight">
                    {item.series}
                  </h3>
                  <span className="text-[11px] font-mono font-semibold text-[#8b7263] shrink-0 tracking-wider bg-[#f1f3ff] px-2 py-0.5 rounded-md">
                    {item.code.includes('-') ? item.code.replace('-', ' - ') : item.code}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1 mb-3">
                  <span className="px-2.5 py-1 rounded-md bg-[#eef2fe] text-[#293040] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#574235]">
                      {getFoldingIcon(item.foldingType)}
                    </span>
                    <span>{item.foldingType}</span>
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-[#eef2fe] text-[#293040] font-medium">
                    {item.orientation}
                  </span>

                  <span className="px-2.5 py-1 rounded-md bg-[#eef2fe] text-[#293040] font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[15px] text-[#574235]">mail</span>
                    <span>{item.hasEnvelope ? 'Dengan Amplop' : 'Tanpa Amplop'}</span>
                  </span>
                </div>
              </div>

              <div className="sm:hidden pt-2 border-t border-[#f1f3ff]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(item);
                  }}
                  className="w-full min-h-[44px] rounded-xl bg-[#f4f6ff] active:bg-[#e1e8fd] text-[#964900] text-[12.5px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>Lihat Detail Spesifikasi</span>
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

const CardGridCompact6: React.FC<{ items: InvitationItem[]; onPreview: (item: InvitationItem) => void }> = ({
  items,
  onPreview,
}) => {
  const getShortFolding = (folding: string) => {
    if (folding.includes('Gatefold')) return 'Gatefold';
    if (folding.includes('Single')) return 'Single';
    if (folding.includes('Lipat 3')) return 'Lipat 3';
    if (folding.includes('Lipat 2')) return 'Lipat 2';
    if (folding.includes('Hardcover')) return 'Hardcover';
    return folding;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5">
      {items.map((item) => {
        const seg = getSegmentMeta(item.segment);

        return (
          <div
            key={item.id}
            onClick={() => onPreview(item)}
            className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-[#dce2f7] hover:shadow-lg hover:border-[#f57c00] active:scale-[0.99] transition-all cursor-pointer"
          >
            <div className="relative w-full aspect-square bg-[#f1f3ff] overflow-hidden p-2">
              <img
                src={item.image}
                alt={`Undangan seri ${item.series}`}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 shadow-2xs"
              />

              <div className="absolute top-2.5 left-2.5">
                <span
                  style={{
                    backgroundColor: seg.bg,
                    color: seg.text,
                    borderColor: seg.border,
                  }}
                  className="px-1.5 sm:px-2 py-0.5 rounded-md text-[9.5px] sm:text-[10px] font-bold tracking-tight shadow-2xs border capitalize"
                >
                  {seg.name}
                </span>
              </div>

              <div className="hidden sm:flex absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center p-2">
                <span className="px-3 py-1.5 rounded-lg bg-white text-[#141b2b] text-[11px] font-bold shadow-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  Lihat
                </span>
              </div>
            </div>

            <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 bg-white">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11.5px] sm:text-[12px] font-mono font-bold text-[#964900] truncate">
                  {item.code}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: item.primaryColorHex }}
                    title={item.primaryColorName}
                  />
                  <span
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-black/15 shadow-2xs"
                    style={{ backgroundColor: item.secondaryColorHex }}
                    title={item.secondaryColorName}
                  />
                </div>
              </div>

              <h3 className="text-[13px] sm:text-[14px] font-serif font-bold text-[#141b2b] leading-tight group-hover:text-[#964900] transition-colors mb-2 line-clamp-1">
                {item.series}
              </h3>

              <div className="pt-2 border-t border-[#f1f3ff] flex items-center justify-between text-[10.5px] sm:text-[11px] text-[#574235]">
                <div className="flex items-center gap-0.5 sm:gap-1 font-medium truncate">
                  <span className="material-symbols-outlined text-[12px] sm:text-[13px] text-[#8b7263]">
                    menu_book
                  </span>
                  <span className="truncate">{getShortFolding(item.foldingType)}</span>
                </div>

                <div className="shrink-0 font-medium">
                  {item.hasEnvelope ? (
                    <span className="text-[#964900] font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px] text-[#964900]">mail</span>
                      <span>+Amplop</span>
                    </span>
                  ) : (
                    <span className="text-[#8b7263]">No Amplop</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DataTable: React.FC<{ items: InvitationItem[]; onPreview: (item: InvitationItem) => void }> = ({
  items,
  onPreview,
}) => {
  return (
    <div className="w-full">
      {/* Mobile Cards View */}
      <div className="md:hidden space-y-3">
        {items.map((item) => {
          const seg = getSegmentMeta(item.segment);

          return (
            <article
              key={`mob-${item.id}`}
              onClick={() => onPreview(item)}
              className="bg-white rounded-2xl p-4 border border-[#dec1af]/50 shadow-xs hover:border-[#f57c00] transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#f1f3ff] border border-[#dce2f7] shrink-0">
                  <img
                    src={item.image}
                    alt={item.series}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-serif font-bold text-[16px] text-[#141b2b] truncate">
                      {item.series}
                    </h3>
                    <span
                      style={{
                        backgroundColor: seg.bg,
                        color: seg.text,
                        borderColor: seg.border,
                      }}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold border shrink-0 capitalize"
                    >
                      {seg.name}
                    </span>
                  </div>
                  <div className="font-mono text-[12px] text-[#964900] font-semibold mt-0.5">
                    {item.code}
                  </div>
                  <div className="text-[11.5px] text-[#574235] truncate mt-0.5">
                    {item.paperType}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] mb-3 pt-2.5 border-t border-[#f1f3ff]">
                <div className="flex items-center gap-1.5 text-[#293040] bg-[#f4f6ff] px-2.5 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-[15px] text-[#8b7263]">view_column</span>
                  <span className="truncate">{item.foldingType}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#293040] bg-[#f4f6ff] px-2.5 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-[15px] text-[#8b7263]">crop_portrait</span>
                  <span className="truncate">{item.orientation}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#293040] bg-[#f4f6ff] px-2.5 py-1.5 rounded-lg">
                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: item.primaryColorHex }}
                    />
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-2xs"
                      style={{ backgroundColor: item.secondaryColorHex }}
                    />
                  </div>
                  <span className="truncate">{item.primaryColorName}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#293040] bg-[#f4f6ff] px-2.5 py-1.5 rounded-lg">
                  <span className="material-symbols-outlined text-[15px] text-[#8b7263]">mail</span>
                  <span className="truncate">{item.hasEnvelope ? 'Dengan Amplop' : 'Tanpa Amplop'}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(item);
                }}
                className="w-full min-h-[44px] rounded-xl bg-[#eef2fe] hover:bg-[#dce2f7] text-[#141b2b] text-[13px] font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px] text-[#964900]">visibility</span>
                <span>Lihat Detail Spesifikasi</span>
              </button>
            </article>
          );
        })}
      </div>

      {/* Desktop & Tablet Table */}
      <div className="hidden md:block w-full bg-white rounded-2xl shadow-xs border border-[#dec1af]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#f4f6ff] border-b border-[#e9edff] text-[11px] font-bold uppercase tracking-wider text-[#574235]">
                <th scope="col" className="py-4 px-5">1. DESAIN</th>
                <th scope="col" className="py-4 px-5">2. SERIES & KODE</th>
                <th scope="col" className="py-4 px-5">3. WARNA DOMINAN</th>
                <th scope="col" className="py-4 px-5">4. LIPATAN</th>
                <th scope="col" className="py-4 px-5">5. ORIENTASI</th>
                <th scope="col" className="py-4 px-5">6. AMPLOP</th>
                <th scope="col" className="py-4 px-5 text-center">7. KATEGORI</th>
                <th scope="col" className="py-4 px-5 text-center">8. AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3ff] text-[13px] text-[#141b2b]">
              {items.map((item) => {
                const seg = getSegmentMeta(item.segment);

                return (
                  <tr
                    key={`tbl-${item.id}`}
                    className="hover:bg-[#f9f9ff] transition-colors group cursor-pointer"
                    onClick={() => onPreview(item)}
                  >
                    <td className="py-3.5 px-5 w-20">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#f1f3ff] border border-[#dce2f7] shrink-0 shadow-2xs">
                        <img
                          src={item.image}
                          alt={item.series}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          onError={handleImageError}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#141b2b] text-[14px] group-hover:text-[#964900] transition-colors">
                        {item.series}
                      </div>
                      <div className="font-mono text-[11px] text-[#8b7263] mt-0.5 tracking-wider">
                        {item.code}
                      </div>
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                            style={{ backgroundColor: item.primaryColorHex }}
                            title={item.primaryColorName}
                          />
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-2xs"
                            style={{ backgroundColor: item.secondaryColorHex }}
                            title={item.secondaryColorName}
                          />
                        </div>
                        <span className="text-[12px] font-medium text-[#293040]">
                          {item.primaryColorName} / {item.secondaryColorName}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-md bg-[#eef2fe] text-[#293040] text-[12px] font-medium inline-block">
                        {item.foldingType}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#293040]">
                        <span className="material-symbols-outlined text-[16px] text-[#8b7263]">crop_portrait</span>
                        <span>{item.orientation}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap">
                      {item.hasEnvelope ? (
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-md bg-[#ecfdf5] text-[#065f46]">
                          <span className="material-symbols-outlined text-[15px]">mail</span>
                          <span>Dengan Amplop</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-3 py-1 rounded-md bg-[#f3f4f6] text-[#4b5563]">
                          <span className="material-symbols-outlined text-[15px]">mark_email_read</span>
                          <span>Tanpa Amplop</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 whitespace-nowrap text-center">
                      <span
                        style={{
                          backgroundColor: seg.bg,
                          color: seg.text,
                        }}
                        className="px-3.5 py-1 rounded-full text-[11px] font-bold shadow-2xs capitalize inline-block"
                      >
                        {seg.name}
                      </span>
                    </td>

                    <td
                      className="py-3.5 px-5 text-center whitespace-nowrap"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreview(item);
                      }}
                    >
                      <button
                        type="button"
                        className="min-w-[44px] min-h-[44px] rounded-full text-[#574235] hover:text-[#964900] hover:bg-[#eef2fe] transition-colors inline-flex items-center justify-center cursor-pointer"
                        title="Lihat Pratinjau Undangan"
                        aria-label={`Lihat pratinjau ${item.series}`}
                      >
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface FooterPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  startIndex: number;
  endIndex: number;
}

const FooterPagination: React.FC<FooterPaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  startIndex,
  endIndex,
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('•••');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('•••');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="w-full bg-white px-3.5 sm:px-6 py-4 shadow-sm border-t border-[#e9edff] mt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-3 w-full md:w-auto">
          <span className="text-[12.5px] sm:text-[13px] text-[#574235]">
            Menampilkan{' '}
            <span className="font-bold text-[#141b2b] tabular-nums">
              {totalItems === 0 ? 0 : `${startIndex}–${endIndex}`}
            </span>{' '}
            dari <span className="font-bold text-[#141b2b] tabular-nums">{totalItems}</span> produk
          </span>

          <div className="flex items-center gap-2">
            <label htmlFor="page-size-select" className="text-[11px] text-[#8b7263] uppercase font-bold">
              Tampil:
            </label>
            <div className="relative">
              <select
                id="page-size-select"
                value={pageSize}
                onChange={(e) => onPageSizeChange(Number(e.target.value))}
                className="min-h-[44px] sm:min-h-[38px] pl-3 pr-7 rounded-lg bg-[#e9edff] text-[#141b2b] text-[12px] font-bold focus:outline-none focus:ring-2 focus:ring-[#964900] appearance-none cursor-pointer border border-[#dce2f7]"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
                <option value={96}>96</option>
              </select>
              <span className="material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[#8b7263] text-[18px] pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        <nav aria-label="Halaman Katalog" className="flex items-center justify-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-[#e9edff] text-[#574235] hover:text-[#141b2b] hover:bg-[#dce2f7] flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            title="Halaman Sebelumnya"
            aria-label="Halaman sebelumnya"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>

          {getPageNumbers().map((p, idx) => {
            if (p === '•••') {
              return (
                <span key={`dots-${idx}`} className="px-1 text-[#8b7263] text-[12px] select-none">
                  •••
                </span>
              );
            }

            const pageNum = Number(p);
            const isActive = pageNum === currentPage;

            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-label={`Halaman ${p}`}
                aria-current={isActive ? 'page' : undefined}
                className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl text-[13px] font-bold transition-all cursor-pointer flex items-center justify-center tabular-nums ${
                  isActive
                    ? 'bg-[#964900] text-white shadow-xs font-extrabold'
                    : 'bg-[#e9edff] hover:bg-[#dce2f7] text-[#141b2b]'
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-[#e9edff] text-[#141b2b] hover:text-[#964900] hover:bg-[#dce2f7] flex items-center justify-center transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
            title="Halaman Berikutnya"
            aria-label="Halaman berikutnya"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

const PreviewModal: React.FC<{ item: InvitationItem | null; onClose: () => void }> = ({
  item,
  onClose,
}) => {
  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [item, onClose]);

  if (!item) return null;

  const seg = getSegmentMeta(item.segment);
  const formattedCode = item.code.includes('-') ? item.code.replace('-', ' - ') : item.code;
  const waHref = `https://wa.me/6285103580450?text=${encodeURIComponent(
    `Halo UD REZ WAN JAYA, saya tertarik konsultasi cetak untuk undangan ${item.series} (${item.code}). Mohon info detail harga & minimal order.`
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
      className="fixed inset-0 z-50 bg-[#293040]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row p-4 sm:p-7 md:p-8 gap-5 md:gap-8 border border-[#dec1af]/40 max-h-[94vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full md:w-7/12 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                style={{
                  backgroundColor: seg.bg,
                  color: seg.text,
                  borderColor: seg.border,
                }}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold tracking-wide border flex items-center gap-1.5 shadow-2xs"
              >
                <span className="material-symbols-outlined text-[13px]">{seg.icon}</span>
                <span>{item.segment}</span>
              </span>

              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold bg-[#f4f6ff] text-[#293040] border border-[#dce2f7] shadow-2xs tracking-wider">
                {formattedCode}
              </span>
            </div>

            <div className="w-full aspect-[16/10] bg-[#f1f3ff] rounded-xl sm:rounded-2xl overflow-hidden shadow-xs border border-[#dec1af]/30 select-none">
              <img
                src={item.image}
                alt={`Mockup undangan ${item.series}`}
                loading="eager"
                referrerPolicy="no-referrer"
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mt-3.5 flex items-center justify-center gap-2 text-[12px] font-medium text-[#293040]">
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs shrink-0"
                style={{ backgroundColor: item.primaryColorHex }}
              />
              <span>{item.primaryColorName}</span>
            </div>
            <span className="text-[#8b7263]">•</span>
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs shrink-0"
                style={{ backgroundColor: item.secondaryColorHex }}
              />
              <span>{item.foilType || item.secondaryColorName}</span>
            </div>
          </div>
        </div>

        <div className="w-full md:w-5/12 flex flex-col justify-between pt-2 md:pt-0 border-t md:border-t-0 border-[#f1f3ff]">
          <div>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2
                  id="preview-modal-title"
                  className="text-[20px] sm:text-[24px] md:text-[26px] font-serif font-bold text-[#141b2b] leading-tight"
                >
                  {item.series}
                </h2>
                <div className="text-[12px] font-mono text-[#8b7263] mt-0.5">
                  Kode Produk: {item.code}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-[#f1f4ff] hover:bg-[#e1e8fd] text-[#574235] hover:text-[#141b2b] flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Tutup pratinjau"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="space-y-2 text-[12px]">
              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">sell</span>
                  <span>Segmen Harga</span>
                </div>
                <span className="font-bold text-[#141b2b] capitalize">{seg.name}</span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">texture</span>
                  <span>Bahan Kertas</span>
                </div>
                <span className="font-bold text-[#141b2b] text-right truncate max-w-[170px]">
                  {item.paperType}
                </span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">view_column</span>
                  <span>Jenis Lipatan</span>
                </div>
                <span className="font-bold text-[#141b2b]">{item.foldingType}</span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">crop_portrait</span>
                  <span>Orientasi</span>
                </div>
                <span className="font-bold text-[#141b2b]">{item.orientation}</span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">mail</span>
                  <span>Jenis Amplop</span>
                </div>
                <span className="font-bold text-[#141b2b] text-right">{item.envelopeType}</span>
              </div>

              <div className="flex items-center justify-between px-3 py-2 bg-[#f4f6ff] rounded-xl">
                <div className="flex items-center gap-2 text-[#574235]">
                  <span className="material-symbols-outlined text-[17px] text-[#8b7263]">palette</span>
                  <span>Warna Dominan / Aksen</span>
                </div>
                <span className="font-bold text-[#141b2b] text-right">
                  {item.primaryColorName.split(' ')[0]} / {item.secondaryColorName.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-5 pt-2">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-3 px-4 rounded-xl bg-[#f57c00] hover:bg-[#e65100] active:scale-[0.99] text-white text-[13.5px] font-bold flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(245,124,0,0.25)] transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>Konsultasi Cetak Seri Ini</span>
            </a>

            <button
              type="button"
              onClick={onClose}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#eef2fe] hover:bg-[#dce2f7] text-[#293040] text-[13px] font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN CATALOG VIEW COMPONENT
// ============================================================================

export const CatalogView: React.FC<CatalogViewProps> = ({
  onOpenDigitalDemo,
  initialSearchQuery = ''
}) => {
  const [activeCatalogTab, setActiveCatalogTab] = useState<'fisik' | 'digital'>('fisik');

  // VIEW A STATE
  const [catalog, setCatalog] = useState<InvitationItem[]>(() => getCachedCatalog() || FALLBACK_CATALOG);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [usingFallbackNotice, setUsingFallbackNotice] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  const [selectedSeries, setSelectedSeries] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>(initialSearchQuery);
  const [sortOption, setSortOption] = useState<SortOption>('series-az');
  const [viewMode, setViewMode] = useState<ViewMode>('galeri-grid-4-kolom');

  const [filters, setFilters] = useState<FilterState>({
    segment: '',
    primaryColor: '',
    secondaryColor: '',
    foldingType: '',
    orientation: '',
    hasEnvelope: '',
  });

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12);
  const [previewItem, setPreviewItem] = useState<InvitationItem | null>(null);

  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const loadCatalog = useCallback(async (isBackground = false) => {
    if (isBackground) {
      setIsSyncing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const items = await fetchCatalogFromAppsScript();
      if (items && items.length > 0) {
        setCatalog(items);
        setLastSyncTime(new Date());
        setUsingFallbackNotice(false);
      } else {
        setCatalog((prev) => (prev.length > 0 ? prev : FALLBACK_CATALOG));
        setUsingFallbackNotice(true);
      }
    } catch {
      setCatalog((prev) => (prev.length > 0 ? prev : FALLBACK_CATALOG));
      setUsingFallbackNotice(true);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog(true);

    const interval = setInterval(() => {
      loadCatalog(true);
    }, 60000);

    return () => clearInterval(interval);
  }, [loadCatalog]);

  const dynamicSeriesList = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((item) => {
      if (item.series && item.series.trim()) {
        set.add(item.series.trim());
      }
    });
    return ['Semua Series', ...Array.from(set).sort()];
  }, [catalog]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((item) => {
      if (item.primaryColorName && item.primaryColorName.trim()) {
        set.add(item.primaryColorName.trim());
      }
    });
    return Array.from(set).sort();
  }, [catalog]);

  const availableFoldings = useMemo(() => {
    const set = new Set<string>();
    catalog.forEach((item) => {
      if (item.foldingType && item.foldingType.trim()) {
        set.add(item.foldingType.trim());
      }
    });
    return Array.from(set).sort();
  }, [catalog]);

  const seriesCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    catalog.forEach((item) => {
      counts[item.series] = (counts[item.series] || 0) + 1;
    });
    return counts;
  }, [catalog]);

  const segmentCounts = useMemo(() => {
    const counts: Record<SegmentTier, number> = {
      'SUPER HEMAT': 0,
      'EKONOMIS': 0,
      'MENENGAH': 0,
      'PREMIUM': 0,
    };
    catalog.forEach((item) => {
      if (counts[item.segment] !== undefined) {
        counts[item.segment]++;
      }
    });
    return counts;
  }, [catalog]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedSeries('');
    setSearchQuery('');
    setFilters({
      segment: '',
      primaryColor: '',
      secondaryColor: '',
      foldingType: '',
      orientation: '',
      hasEnvelope: '',
    });
    setCurrentPage(1);
  };

  const isFiltered = Boolean(
    selectedSeries ||
      searchQuery ||
      filters.segment ||
      filters.primaryColor ||
      filters.secondaryColor ||
      filters.foldingType ||
      filters.orientation ||
      filters.hasEnvelope
  );

  const filteredItems = useMemo(() => {
    return catalog
      .filter((item) => {
        if (selectedSeries && selectedSeries !== 'Semua Series' && item.series !== selectedSeries) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const match =
            item.code.toLowerCase().includes(q) ||
            item.series.toLowerCase().includes(q) ||
            item.title.toLowerCase().includes(q) ||
            item.paperType.toLowerCase().includes(q) ||
            item.foldingType.toLowerCase().includes(q) ||
            item.primaryColorName.toLowerCase().includes(q) ||
            item.secondaryColorName.toLowerCase().includes(q);
          if (!match) return false;
        }
        if (filters.segment && item.segment !== filters.segment) {
          return false;
        }
        if (
          filters.primaryColor &&
          !item.primaryColorName.toLowerCase().includes(filters.primaryColor.toLowerCase())
        ) {
          return false;
        }
        if (
          filters.secondaryColor &&
          !item.secondaryColorName.toLowerCase().includes(filters.secondaryColor.toLowerCase())
        ) {
          return false;
        }
        if (
          filters.foldingType &&
          !item.foldingType.toLowerCase().includes(filters.foldingType.toLowerCase())
        ) {
          return false;
        }
        if (filters.orientation && item.orientation !== filters.orientation) {
          return false;
        }
        if (filters.hasEnvelope === 'dengan-amplop' && !item.hasEnvelope) return false;
        if (filters.hasEnvelope === 'tanpa-amplop' && item.hasEnvelope) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'series-az') {
          const seriesCompare = a.series.localeCompare(b.series);
          if (seriesCompare !== 0) return seriesCompare;
          return a.code.localeCompare(b.code, undefined, { numeric: true });
        }
        if (sortOption === 'series-za') {
          const seriesCompare = b.series.localeCompare(a.series);
          if (seriesCompare !== 0) return seriesCompare;
          return b.code.localeCompare(a.code, undefined, { numeric: true });
        }
        if (sortOption === 'popular') {
          return (b.popularityScore || 0) - (a.popularityScore || 0);
        }
        if (sortOption === 'latest') {
          return (b.releaseDate || '').localeCompare(a.releaseDate || '');
        }
        return 0;
      });
  }, [catalog, selectedSeries, searchQuery, filters, sortOption]);

  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (safeCurrentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, safeCurrentPage, pageSize]);

  const startIndex = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endIndex = Math.min(safeCurrentPage * pageSize, totalItems);

  const sortLabels: Record<SortOption, string> = {
    'series-az': 'A–Z Series',
    'series-za': 'Z–A Series',
    popular: 'Model Terpopuler',
    latest: 'Rilisan Terbaru',
  };

  // VIEW B STATE (DIGITAL THEMES)
  const [digitalCategory, setDigitalCategory] = useState<string>('all');

  const filteredDigitalThemes = useMemo(() => {
    if (digitalCategory === 'all') return DIGITAL_THEMES;
    return DIGITAL_THEMES.filter((t) => t.category === digitalCategory);
  }, [digitalCategory]);

  return (
    <div className="w-full flex flex-col">
      {/* 1. Header Banner & View Switcher */}
      <section className="w-full bg-[#edf6f0] py-8 px-4 md:px-8 border-b border-[#c1c8c3]/30">
        <div className="max-w-[1280px] mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#fed488] text-[#785a1a] text-xs font-bold uppercase tracking-wider">
                Grosir & Eceran Terlengkap Banjarmasin
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#002218]">
                Katalog Lengkap Blangko & Undangan Digital
              </h1>
              <p className="text-sm sm:text-base text-[#414845]">
                Telusuri lebih dari 500+ koleksi blangko fisik siap cetak dan puluhan tema website undangan pernikahan modern untuk mitra percetakan dan calon pengantin.
              </p>
            </div>

            {/* Warehouse Status Card */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#c1c8c3]/40 shadow-sm flex items-center gap-3 shrink-0 self-start lg:self-auto">
              <div className="w-10 h-10 rounded-xl bg-[#0f382c] text-[#ffdea5] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">inventory_2</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#775a19] uppercase tracking-wider block">
                  Status Gudang
                </span>
                <span className="text-sm font-bold text-[#002218] block">500+ Model Siap Kirim</span>
                <span className="text-[11px] text-[#717975]">Update stok harian Jl. Brigjen Katamso</span>
              </div>
            </div>
          </div>

          {/* Segmented Top View Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="grid grid-cols-2 p-1.5 rounded-2xl bg-[#dce5df] border border-[#c1c8c3]/40 shadow-inner w-full sm:w-auto sm:inline-grid gap-1.5">
              <button
                type="button"
                onClick={() => setActiveCatalogTab('fisik')}
                className={`flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-normal cursor-pointer ${
                  activeCatalogTab === 'fisik'
                    ? 'bg-[#0f382c] text-white shadow-md'
                    : 'text-[#414845] hover:text-[#002218] hover:bg-white/50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] shrink-0">inventory</span>
                <span className="leading-snug">Undangan Fisik & Blangko Kosong</span>
                <span className="px-2 py-0.5 rounded-full bg-[#c5a059] text-white text-[10px] shrink-0 whitespace-nowrap">
                  {catalog.length > 0 ? `${catalog.length} Model` : '500+ Model'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveCatalogTab('digital')}
                className={`flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-normal cursor-pointer ${
                  activeCatalogTab === 'digital'
                    ? 'bg-[#0f382c] text-white shadow-md'
                    : 'text-[#414845] hover:text-[#002218] hover:bg-white/50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] shrink-0">devices</span>
                <span className="leading-snug">Web Undangan Digital Interaktif</span>
                <span className="px-2 py-0.5 rounded-full bg-[#25D366] text-white text-[10px] shrink-0 whitespace-nowrap">
                  48 Tema
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* VIEW A: PHYSICAL INVITATION BLANKS (SELF-CONTAINED) */}
      {activeCatalogTab === 'fisik' && (
        <section className="w-full bg-[#f9f9ff] text-[#141b2b] flex flex-col">
          <ViewAHeader
            totalCount={catalog.length}
            segmentCounts={segmentCounts}
            selectedSegment={filters.segment}
            onSelectSegment={(seg) => handleFilterChange('segment', seg)}
            searchQuery={searchQuery}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
            sortOption={sortOption}
            onSortChange={setSortOption}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onRefresh={() => loadCatalog(false)}
            isRefreshing={isSyncing || isLoading}
            lastSyncTime={lastSyncTime}
          />

          <div className="w-full bg-[#f9f9ff] flex-1 flex flex-col">
            <SeriesFilterRail
              selectedSeries={selectedSeries}
              onSelectSeries={(series) => {
                setSelectedSeries(series);
                setCurrentPage(1);
              }}
              seriesCounts={seriesCounts}
              totalCount={catalog.length}
              seriesList={dynamicSeriesList}
            />

            <ParameterFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              isFiltered={isFiltered}
              totalFiltered={totalItems}
              totalCatalog={catalog.length}
              startIndex={startIndex}
              endIndex={endIndex}
              sortLabel={sortLabels[sortOption]}
              availableColors={availableColors}
              availableFoldings={availableFoldings}
            />

            <div className="w-full px-3.5 sm:px-6 py-4 sm:py-6 md:py-8 flex-1">
              {usingFallbackNotice && (
                <div className="mb-4 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-amber-700">info</span>
                    <span>
                      Menampilkan data katalog lokal (Apps Script sedang tidak terjangkau).
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadCatalog(false)}
                    className="font-bold text-[#964900] hover:underline cursor-pointer"
                  >
                    Coba Sinkron Ulang
                  </button>
                </div>
              )}

              {isLoading && catalog.length === 0 && (
                <div className="w-full py-12 sm:py-20 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-[#dce2f7] shadow-2xs p-5 sm:p-8 max-w-2xl mx-auto">
                  <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-full border-4 border-[#ffddb9] border-t-[#f57c00] animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px] text-[#964900]">database</span>
                    </div>
                  </div>
                  <h3 className="font-serif font-bold text-[18px] sm:text-[20px] text-[#141b2b] mb-2">
                    Memuat Katalog Undangan...
                  </h3>
                  <p className="text-[13px] text-[#574235] max-w-md leading-relaxed">
                    Menghubungkan dan menyinkronkan data katalog blangko undangan. Mohon tunggu sebentar.
                  </p>
                </div>
              )}

              {!isLoading && catalog.length > 0 && totalItems === 0 && (
                <div className="w-full py-12 sm:py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-[#dec1af] p-5 sm:p-6 shadow-2xs max-w-xl mx-auto">
                  <div className="w-16 h-16 rounded-full bg-[#f1f3ff] flex items-center justify-center text-[#964900] mb-3">
                    <span className="material-symbols-outlined text-[32px]">filter_alt_off</span>
                  </div>
                  <h3 className="font-serif font-bold text-[18px] sm:text-[20px] text-[#141b2b] mb-1">
                    Tidak ada desain undangan yang cocok
                  </h3>
                  <p className="text-[13px] text-[#574235] max-w-md mb-5 leading-relaxed">
                    Coba sesuaikan kata kunci pencarian atau bersihkan parameter filter untuk melihat koleksi lainnya.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#f57c00] text-[#572800] hover:bg-[#9b4500] hover:text-white font-bold text-[13px] transition-colors cursor-pointer shadow-xs"
                  >
                    Reset Semua Filter
                  </button>
                </div>
              )}

              {catalog.length > 0 && totalItems > 0 && (
                <>
                  {viewMode === 'galeri-grid-4-kolom' && (
                    <CardGrid4 items={paginatedItems} onPreview={setPreviewItem} />
                  )}

                  {viewMode === 'galeri-compact-6-kolom' && (
                    <CardGridCompact6 items={paginatedItems} onPreview={setPreviewItem} />
                  )}

                  {viewMode === 'galeri-tabel-data' && (
                    <DataTable items={paginatedItems} onPreview={setPreviewItem} />
                  )}
                </>
              )}
            </div>

            {catalog.length > 0 && (
              <FooterPagination
                currentPage={safeCurrentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={(page) => {
                  setCurrentPage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
                startIndex={startIndex}
                endIndex={endIndex}
              />
            )}
          </div>

          <PreviewModal item={previewItem} onClose={() => setPreviewItem(null)} />
        </section>
      )}

      {/* VIEW B: DIGITAL THEMES */}
      {activeCatalogTab === 'digital' && (
        <section className="w-full py-10 px-4 md:px-8 bg-[#f8faf8]">
          <div className="max-w-[1280px] mx-auto">
            <div className="space-y-8">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-gray-200">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-[#002218]">
                    Koleksi Tema Website Undangan Digital
                  </h2>
                  <p className="text-sm text-[#414845] mt-0.5">
                    Semua tema responsif smartphone, integrasi musik autoplay, RSVP WhatsApp, dan amplop QRIS aktif.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => setDigitalCategory('all')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      digitalCategory === 'all'
                        ? 'bg-[#0f382c] text-white shadow-sm'
                        : 'bg-white text-[#414845] hover:bg-gray-100 border border-[#c1c8c3]/40'
                    }`}
                  >
                    Semua Tema ({DIGITAL_THEMES.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDigitalCategory('luxury')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      digitalCategory === 'luxury'
                        ? 'bg-[#0f382c] text-white shadow-sm'
                        : 'bg-white text-[#414845] hover:bg-gray-100 border border-[#c1c8c3]/40'
                    }`}
                  >
                    Luxury Gold
                  </button>
                  <button
                    type="button"
                    onClick={() => setDigitalCategory('rustic')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      digitalCategory === 'rustic'
                        ? 'bg-[#0f382c] text-white shadow-sm'
                        : 'bg-white text-[#414845] hover:bg-gray-100 border border-[#c1c8c3]/40'
                    }`}
                  >
                    Rustic & Sage
                  </button>
                  <button
                    type="button"
                    onClick={() => setDigitalCategory('minimalist')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      digitalCategory === 'minimalist'
                        ? 'bg-[#0f382c] text-white shadow-sm'
                        : 'bg-white text-[#414845] hover:bg-gray-100 border border-[#c1c8c3]/40'
                    }`}
                  >
                    Modern Monokrom
                  </button>
                  <button
                    type="button"
                    onClick={() => setDigitalCategory('traditional')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                      digitalCategory === 'traditional'
                        ? 'bg-[#0f382c] text-white shadow-sm'
                        : 'bg-white text-[#414845] hover:bg-gray-100 border border-[#c1c8c3]/40'
                    }`}
                  >
                    Adat Banjar / Sasirangan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDigitalThemes.map((theme) => (
                  <div
                    key={theme.id}
                    className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-[#c1c8c3]/40 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div
                        onClick={() => onOpenDigitalDemo(theme)}
                        className="relative w-full aspect-[9/16] rounded-3xl bg-[#1a202c] p-2.5 shadow-xl flex flex-col justify-between overflow-hidden border-4 border-gray-700 cursor-pointer group-hover:scale-[1.02] transition-transform"
                      >
                        <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-black rounded-full z-20" />

                        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#0f382c] via-[#002218] to-[#0f382c] flex flex-col justify-between p-3.5">
                          <img
                            src={theme.image}
                            alt={theme.name}
                            referrerPolicy="no-referrer"
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0f382c]/95 via-[#0f382c]/40 to-transparent" />

                          <div className="relative z-10 flex items-center justify-between text-white text-[11px] font-semibold">
                            <span>09:41</span>
                            <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-[#ffdea5]">
                              <span className="material-symbols-outlined text-[14px]">volume_up</span>
                            </div>
                          </div>

                          <div className="relative z-10 text-white text-center space-y-1">
                            <span className="text-[10px] uppercase tracking-widest text-[#ffdea5] font-bold">
                              The Wedding of
                            </span>
                            <h4 className="font-serif text-xl font-bold">{theme.demoNames}</h4>
                            <p className="text-[11px] text-[#c1ecda]">
                              {theme.demoDate} • {theme.location}
                            </p>
                            <div className="pt-1 flex justify-center">
                              <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full font-bold">
                                <span className="material-symbols-outlined text-[12px]">touch_app</span>
                                Klik untuk Buka Live Simulator
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif font-bold text-lg text-[#002218]">{theme.name}</h3>
                          <div className="text-right">
                            <span className="text-xs text-[#717975] line-through block leading-none">
                              Rp {theme.originalPrice.toLocaleString('id-ID')}
                            </span>
                            <span className="font-serif font-bold text-base text-[#775a19]">
                              Rp {theme.promoPrice.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-[#414845] leading-relaxed">{theme.description}</p>

                        <div className="p-2.5 rounded-xl bg-[#edf6f0] border border-[#c1c8c3]/40 flex items-center justify-between text-xs">
                          <span className="font-bold text-[#002218]">Bundling Cetak Fisik:</span>
                          <span className="font-serif font-bold text-emerald-800 text-sm">
                            Hanya Rp {theme.bundlePrice.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenDigitalDemo(theme)}
                        className="py-2.5 px-3 rounded-xl bg-[#0f382c] hover:bg-[#002218] text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px] text-[#ffdea5]">
                          play_circle
                        </span>
                        <span>Buka Live Demo</span>
                      </button>

                      <a
                        href={`https://wa.me/6285103580450?text=${encodeURIComponent(
                          `Halo UD Rez Wan Jaya, saya ingin memesan website undangan tema ${theme.name} (${theme.code})`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                      >
                        <span className="material-symbols-outlined text-[16px]">chat</span>
                        <span>Pesan Tema</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};