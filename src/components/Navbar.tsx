import React, { useState, useEffect } from 'react';
import { TabRoute } from '../types';

interface NavbarProps {
  currentTab: TabRoute;
  setCurrentTab: (tab: TabRoute) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems: { id: TabRoute; line1: string; line2?: string; fullLabel: string; icon: string }[] = [
    { id: 'beranda', line1: 'Beranda', fullLabel: 'Beranda', icon: 'home' },
    { id: 'katalog', line1: 'Katalog', line2: 'Produk', fullLabel: 'Katalog Produk', icon: 'grid_view' },
    { id: 'harga', line1: 'Harga &', line2: 'Kalkulator', fullLabel: 'Harga & Kalkulator', icon: 'calculate' },
    { id: 'perusahaan', line1: 'Perusahaan &', line2: 'Kontak', fullLabel: 'Perusahaan & Kontak', icon: 'storefront' },
  ];

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  const handleSelectTab = (tab: TabRoute) => {
    setCurrentTab(tab);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#c1c8c3]/40 shadow-sm">
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#00281c] text-white py-1.5 sm:py-2 px-3 sm:px-4 md:px-8 text-[10.5px] sm:text-xs">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#19b355] shrink-0"></span>
            <p className="text-[#e2ece7] truncate sm:whitespace-normal">
              <strong className="font-bold text-white">Ready Stock</strong>{' '}
              <span className="hidden sm:inline">di Gerai </span>
              Jl. Brigjen Katamso No. 22 Banjarmasin{' '}
              <span className="hidden md:inline">Tengah • Kirim Cepat se-Kalselteng</span>
            </p>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <a
              href="https://wa.me/6285103580450"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#ffdea5] hover:underline whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[14px] sm:text-[15px] text-[#25D366]">chat</span>
              <span className="hidden sm:inline">WA: </span>
              <span>0851-0358-0450</span>
            </a>
            <span className="hidden lg:inline text-white/25">|</span>
            <span className="hidden lg:inline text-[#d4e0da] whitespace-nowrap">
              Senin - Sabtu: 08.30 - 17.30 WITA
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 lg:gap-4">
        {/* Left: RW Emblem & Brand Name */}
        <button
          type="button"
          onClick={() => handleSelectTab('beranda')}
          className="flex items-center gap-2.5 sm:gap-3 text-left cursor-pointer group shrink-0 min-w-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[#0f382c] to-[#002218] border border-[#c5a059]/40 flex items-center justify-center shadow-sm shrink-0">
            <span className="font-serif font-bold text-[#ffdea5] text-base sm:text-lg tracking-tight">
              RW
            </span>
          </div>
          <div className="min-w-0">
            <span className="font-serif font-bold text-base sm:text-lg lg:text-[20px] text-[#002218] tracking-tight leading-none block group-hover:text-[#0f382c] transition-colors whitespace-nowrap">
              UD REZ WAN JAYA
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] lg:text-[10px] font-bold tracking-[0.1em] sm:tracking-[0.12em] text-[#775a19] uppercase leading-tight block mt-1 max-w-[185px] sm:max-w-[230px] lg:max-w-[255px]">
              PUSAT BLANGKO &amp; UNDANGAN DIGITAL BANJARMASIN
            </span>
          </div>
        </button>

        {/* Center: Segmented Navigation Pills (Tablet md+ and Desktop) */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center p-1 lg:p-1.5 rounded-2xl bg-[#f1f4f2] border border-[#c1c8c3]/40 gap-0.5 lg:gap-1 shrink-0"
        >
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`px-3 lg:px-4 xl:px-5 py-2 rounded-xl text-[11.5px] lg:text-[12.5px] xl:text-[13px] transition-all cursor-pointer text-center leading-tight min-w-[74px] lg:min-w-[92px] xl:min-w-[104px] whitespace-nowrap ${
                  isActive
                    ? 'bg-[#0f382c] text-white font-bold shadow-sm'
                    : 'text-[#3a423f] hover:text-[#002218] hover:bg-white/70 font-medium'
                }`}
              >
                <span>{item.line1}</span>
                {item.line2 && (
                  <>
                    <br />
                    <span>{item.line2}</span>
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: Open Hours Badge, Chat WA Admin CTA, and Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="hidden xl:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#f4f7f5] border border-[#c1c8c3]/40 text-xs shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#25D366] shrink-0"></span>
            <span className="font-bold text-[#002218]">Buka:</span>
            <span className="text-[#414845] leading-tight text-[11px] tabular-nums">
              08.30 - 17.30
              <br />
              WITA
            </span>
          </div>

          <a
            href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya%20Banjarmasin,%20saya%20ingin%20konsultasi%20stok%20blangko%20dan%20undangan."
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 lg:gap-2 px-3.5 md:px-4 xl:px-5 py-2 lg:py-2.5 rounded-xl lg:rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs xl:text-[13px] font-bold shadow-[0_6px_16px_rgba(37,211,102,0.3)] transition-all leading-tight shrink-0"
          >
            <span className="material-symbols-outlined text-[18px] lg:text-[20px]">chat</span>
            <span className="text-left">
              Chat WA
              <br className="hidden lg:inline" />
              <span className="lg:hidden"> </span>Admin
            </span>
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={mobileOpen}
            className="md:hidden min-w-[44px] min-h-[44px] w-11 h-11 rounded-xl bg-[#edf6f0] text-[#002218] flex items-center justify-center cursor-pointer hover:bg-[#dce5df] transition-colors border border-[#c1c8c3]/40"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (< 768px) */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-[#c1c8c3]/40 px-4 py-4 space-y-2 shadow-xl animate-fade-in">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full min-h-[44px] flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#0f382c] text-white shadow-sm'
                      : 'text-[#414845] bg-[#f8faf8] hover:bg-[#edf6f0] hover:text-[#002218]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-[19px] ${isActive ? 'text-[#ffdea5]' : 'text-[#775a19]'}`}>
                      {item.icon}
                    </span>
                    <span>{item.fullLabel}</span>
                  </span>
                  <span className="material-symbols-outlined text-[18px] opacity-70">
                    chevron_right
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[#e5ebe7] flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#f4f7f5] text-xs text-[#414845]">
              <span className="flex items-center gap-1.5 font-semibold text-[#002218]">
                <span className="w-2 h-2 rounded-full bg-[#25D366]"></span>
                Jam Buka Gerai
              </span>
              <span className="font-medium tabular-nums">Sen–Sab, 08.30–17.30 WITA</span>
            </div>

            <a
              href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya%20Banjarmasin,%20saya%20ingin%20konsultasi%20stok%20blangko%20dan%20undangan."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-sm font-bold shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[19px]">chat</span>
              <span>Chat WA Admin (0851-0358-0450)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
