import React, { useState } from 'react';
import { TabRoute, BlangkoProduct } from '../types';
import { BLANGKO_PRODUCTS, BRAND_PARTNERS } from '../data/products';

interface HomeViewProps {
  setCurrentTab: (tab: TabRoute) => void;
  onOpenProductSpec: (product: BlangkoProduct) => void;
  onSearchCatalog: (query: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  setCurrentTab,
  onOpenProductSpec,
  onSearchCatalog
}) => {
  const [isPlayingHeroMusic, setIsPlayingHeroMusic] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const sampleChips = ['Jago 82', 'Avis 115', 'Byar 64', 'Beliya 08', 'Tema Floral'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onSearchCatalog(searchInput.trim());
      setCurrentTab('katalog');
    }
  };

  const handleChipClick = (chip: string) => {
    onSearchCatalog(chip);
    setCurrentTab('katalog');
  };

  return (
    <div className="flex flex-col w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#f3fbf6] via-[#edf6f0] to-[#f3fbf6] pt-8 pb-16 lg:pb-24 border-b border-[#c1c8c3]/30">
        
        {/* Ambient background glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[850px] h-[450px] bg-[#0f382c]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-48 -right-24 w-96 h-96 bg-[#c5a059]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="max-w-[1280px] mx-auto px-4 md:px-8 relative z-10">
          
          {/* Announcement pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-[#c1c8c3]/40 mb-6">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#25D366] animate-pulse"></span>
            <span className="text-[11px] sm:text-xs font-bold text-[#002218] uppercase tracking-wider">
              Pusat Grosir Resmi Blangko & Web Undangan Digital No. 1 di Kalsel
            </span>
          </div>

          {/* Main Grid: Left Copy & Right Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-12 items-center">
            
            {/* Left Column: Headlines & Dual Fast Track */}
            <div className="lg:col-span-7 space-y-6">
              
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-[#002218] font-bold tracking-tight leading-[1.15]">
                Pusat Grosir Blangko & Undangan Digital Eksklusif di <span className="italic text-[#775a19]">Banjarmasin</span>
              </h1>

              <p className="text-base sm:text-lg text-[#414845] max-w-2xl leading-relaxed">
                Melayani kulakan blangko ready stock untuk mitra percetakan tanpa tunggu ekspedisi Jawa, serta paket cetak jadi & undangan web interaktif siap sebar untuk calon mempelai berkelas.
              </p>

              {/* Interactive Search Mockup with Chips */}
              <div className="space-y-2 pt-1 max-w-xl">
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative bg-white rounded-2xl p-1.5 shadow-md border border-[#c1c8c3]/50 flex items-center gap-2"
                >
                  <div className="flex items-center pl-3 text-[#775a19]">
                    <span className="material-symbols-outlined text-[22px]">search</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Cari kode seri (misal: Jago 82, Avis 115, Byar 64, atau tema floral)..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-transparent py-2.5 text-sm text-[#151d1a] placeholder:text-[#717975] focus:outline-none"
                    aria-label="Pencarian cepat blangko atau tema"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1 px-5 py-2.5 rounded-xl bg-[#0f382c] text-white font-semibold text-xs sm:text-sm hover:bg-[#002218] transition-colors shrink-0 shadow-sm cursor-pointer"
                  >
                    <span>Cari</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </form>

                {/* Sample Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-[#717975] font-semibold">Pencarian Cepat:</span>
                  {sampleChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleChipClick(chip)}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#edf6f0] border border-[#c1c8c3]/40 text-[11px] text-[#0f382c] font-medium transition-colors cursor-pointer"
                    >
                      [{chip}]
                    </button>
                  ))}
                </div>
              </div>

              {/* Dual-Persona Fast Track Section */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs uppercase tracking-wider text-[#775a19] font-bold">
                  Pilih Jalur Cepat Anda:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                  
                  {/* Persona 1: Mitra Percetakan */}
                  <button
                    onClick={() => setCurrentTab('harga')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#0f382c] text-white hover:bg-[#002218] transition-all shadow-md group text-left cursor-pointer border border-[#c5a059]/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#ffdea5] shrink-0">
                        <span className="material-symbols-outlined text-[20px]">storefront</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Saya Mitra Percetakan</div>
                        <div className="text-xs text-[#c1ecda]">Kulakan grosir & stok ready toko</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-[#ffdea5] group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>

                  {/* Persona 2: Calon Pengantin */}
                  <button
                    onClick={() => setCurrentTab('harga')}
                    className="flex items-center justify-between p-4 rounded-2xl bg-[#c5a059] text-white hover:bg-[#b08d46] transition-all shadow-md group text-left cursor-pointer border border-white/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0">
                        <span className="material-symbols-outlined text-[20px]">favorite</span>
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Saya Calon Pengantin</div>
                        <div className="text-xs text-white/90">Paket cetak jadi + web siap sebar</div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[20px] text-white group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>

              {/* 4 Key Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 max-w-xl">
                <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-[#c1c8c3]/30">
                  <div className="font-serif text-2xl font-bold text-[#002218]">500+</div>
                  <div className="text-xs text-[#717975] mt-0.5">Model Blangko Ready</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-[#c1c8c3]/30">
                  <div className="font-serif text-2xl font-bold text-[#775a19]">10+</div>
                  <div className="text-xs text-[#717975] mt-0.5">Brand Pabrikan Resmi</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-[#c1c8c3]/30">
                  <div className="font-serif text-2xl font-bold text-[#002218]">1.200+</div>
                  <div className="text-xs text-[#717975] mt-0.5">Mitra Percetakan Kalsel</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white shadow-sm border border-[#c1c8c3]/30">
                  <div className="flex items-center gap-1 font-serif text-2xl font-bold text-[#002218]">
                    <span>4.9</span>
                    <span className="material-symbols-outlined text-[#d4af37] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                  <div className="text-xs text-[#717975] mt-0.5">Rating Google Maps</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase (Overlapping Physical Card & Digital Phone) */}
            <div className="lg:col-span-5 relative pt-4 pb-8">
              <div className="relative w-full max-w-[460px] mx-auto lg:max-w-none">
                
                {/* Physical Invitation Card (Gold foil emboss Jago 82) */}
                <div
                  onClick={() => {
                    const jago = BLANGKO_PRODUCTS.find(p => p.id === 'jago-82');
                    if (jago) onOpenProductSpec(jago);
                  }}
                  className="relative w-4/5 rounded-3xl bg-white shadow-xl overflow-hidden p-3.5 group cursor-pointer border border-[#c5a059]/30 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBoaIQKjYaEaaO8KbiZF3Abb0HIXaIerEzjWhHopOuQC7FZSouPBZLCXt0n8r178UIIH4xmiaNhdfpFJx6lMiMMhq5FMgVHwdzSP4rmUWXU6kE2uxnw9DhaQfV0i6eWfDHfWTFZ3TsBkg_TPD10WJpZIJMYNW4WqvJmFvXuxAIOLcHsXpvn4BOoF8aYM8_DiGAnm1t-bucLYeIrIHcr6stRpJVMqVLWmrRmfNFY4R5"
                      alt="Sample Blangko Undangan Jago 82 Emas Mewah"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f382c]/85 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-3 left-3 bg-[#0f382c]/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md border border-[#c5a059]/40">
                      Seri Best Seller: Jago 82
                    </div>

                    <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                      <div className="text-xs font-semibold text-[#ffdea5]">Hotprint Foil Emas 3D</div>
                      <div className="font-serif font-bold text-base sm:text-lg">Brief Card 210gsm • Lipat Tiga</div>
                      <div className="text-[11px] text-white/80 mt-0.5">Klik untuk lihat rincian spek ↗</div>
                    </div>
                  </div>
                </div>

                {/* Overlapping Phone Digital Invitation Preview */}
                <div className="absolute -bottom-6 -right-2 sm:-right-4 w-[62%] rounded-[2.5rem] bg-[#1a202c] text-white shadow-2xl p-2.5 border-4 border-gray-700 transition-transform duration-300 hover:scale-[1.02]">
                  {/* Notch */}
                  <div className="h-4 w-24 bg-black rounded-full mx-auto mb-2 opacity-80"></div>
                  
                  {/* Inner Screen */}
                  <div className="relative rounded-[2rem] bg-gradient-to-b from-[#0f382c] via-[#002218] to-[#0f382c] overflow-hidden text-white p-3.5 flex flex-col justify-between aspect-[9/17]">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold text-[#c1ecda]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse"></span> LIVE DEMO
                      </span>
                      <button
                        onClick={() => setIsPlayingHeroMusic(!isPlayingHeroMusic)}
                        className="w-7 h-7 rounded-full bg-[#c5a059] text-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                        aria-label="Toggle sound demo"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {isPlayingHeroMusic ? 'volume_up' : 'music_note'}
                        </span>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="text-center my-auto py-1">
                      <span className="text-[9px] uppercase tracking-widest text-[#ffdea5] font-bold">
                        The Wedding of
                      </span>
                      <h3 className="font-serif font-bold text-lg text-white my-0.5">
                        Radit & Sarah
                      </h3>
                      <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] text-[#c1ecda]">
                        Sabtu, 18 Oktober 2025
                      </div>

                      {/* Mini Countdown */}
                      <div className="grid grid-cols-4 gap-1 mt-2.5 px-0.5 text-center text-[10px] font-mono">
                        <div className="bg-white/10 p-1 rounded-md">
                          <span className="block font-bold text-white">124</span>
                          <span className="text-[7px] text-white/60">HARI</span>
                        </div>
                        <div className="bg-white/10 p-1 rounded-md">
                          <span className="block font-bold text-white">16</span>
                          <span className="text-[7px] text-white/60">JAM</span>
                        </div>
                        <div className="bg-white/10 p-1 rounded-md">
                          <span className="block font-bold text-white">42</span>
                          <span className="text-[7px] text-white/60">MNT</span>
                        </div>
                        <div className="bg-white/10 p-1 rounded-md">
                          <span className="block font-bold text-white">09</span>
                          <span className="text-[7px] text-white/60">DTK</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA in Mockup */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] px-2 py-1 rounded-lg bg-white/10">
                        <span className="text-[#ffdea5]">Amplop QRIS & BCA</span>
                        <span className="text-emerald-400 font-bold">Aktif ✓</span>
                      </div>
                      <button
                        onClick={() => setCurrentTab('katalog')}
                        className="w-full text-center py-2 rounded-xl bg-[#c5a059] text-white text-[11px] font-bold shadow-sm hover:bg-[#d4af37] transition-colors cursor-pointer"
                      >
                        Buka Surat Undangan
                      </button>
                    </div>
                  </div>
                </div>

                {/* Floating Stock Stamp */}
                <div className="absolute -top-3 -left-3 bg-[#c5a059] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 border border-white/30">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Stok Fisik Gudang Banjarmasin</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. DUAL-MARKET AUDIENCE SELECTOR SECTION */}
      <section className="w-full py-16 bg-white border-b border-[#c1c8c3]/30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#775a19] uppercase tracking-widest block mb-1">
              Pilihan Jalur Layanan
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#002218]">
              Solusi Tepat Sesuai Kebutuhan Anda
            </h2>
            <p className="text-sm sm:text-base text-[#414845] mt-2">
              Dua pintu layanan praktis untuk pengusaha percetakan lokal maupun calon mempelai yang ingin serba siap beres.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* B2B Card */}
            <div className="p-8 rounded-3xl bg-[#edf6f0] border border-[#c1c8c3]/40 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0f382c] text-white text-xs font-bold uppercase mb-4">
                  <span className="material-symbols-outlined text-[16px] text-[#ffdea5]">storefront</span>
                  <span>Khusus Mitra & Percetakan</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#002218] leading-tight">
                  Kulakan Blangko Murah & Siap Kirim Hari Ini
                </h3>
                <p className="text-sm sm:text-base text-[#414845] mt-3 mb-6">
                  Solusi pasokan bahan baku cetak terpercaya untuk percetakan, sablon, fotokopi, & agen reseller se-Kalimantan Selatan dan Kalimantan Tengah.
                </p>

                <ul className="space-y-3.5 mb-8 text-sm text-[#151d1a]">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#775a19] text-[20px] mt-0.5 shrink-0">check_circle</span>
                    <span><strong>Harga Grosir Langsung Pabrik:</strong> Tanpa beban ongkir kargo kapal Jawa, margin usaha percetakan maksimal.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#775a19] text-[20px] mt-0.5 shrink-0">check_circle</span>
                    <span><strong>Minimal Order Rendah:</strong> Mulai 1 pak (isi 100 lembar), tidak ada modal tertimbun.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#775a19] text-[20px] mt-0.5 shrink-0">check_circle</span>
                    <span><strong>Diskon Potongan Kartonan:</strong> Potongan harga ekstra untuk pembelian volume 1 dus / 1.000 lembar ke atas.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#775a19] text-[20px] mt-0.5 shrink-0">check_circle</span>
                    <span><strong>File Template Setting Gratis:</strong> Format CorelDraw (.CDR) & Font Pack presisi tinggal ganti nama mempelai.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentTab('harga')}
                className="inline-flex items-center justify-between px-6 py-4 rounded-2xl bg-[#0f382c] text-white font-bold text-sm shadow-md hover:bg-[#002218] transition-all cursor-pointer"
              >
                <span>Lihat Matriks Harga Grosir Mitra</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>

            {/* B2C Card */}
            <div className="p-8 rounded-3xl bg-[#f8faf8] border border-[#c5a059]/40 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#c5a059] text-white text-xs font-bold uppercase mb-4">
                  <span className="material-symbols-outlined text-[16px]">favorite</span>
                  <span>Calon Pengantin & Keluarga</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#002218] leading-tight">
                  Paket Cetak Jadi & Web Undangan Siap Sebar
                </h3>
                <p className="text-sm sm:text-base text-[#414845] mt-3 mb-6">
                  Tidak mau repot setting cetak dan plastik sendiri? Kami sediakan paket all-in-one undangan fisik cetak tajam plus website mewah interaktif siap kirim ke keluarga.
                </p>

                <ul className="space-y-3.5 mb-8 text-sm text-[#151d1a]">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#c5a059] text-[20px] mt-0.5 shrink-0">verified</span>
                    <span><strong>Terima Beres Lengkap:</strong> Cetak rapi + plastik OPP kedap seal lem + label stiker nama tamu terprint rapi.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#c5a059] text-[20px] mt-0.5 shrink-0">verified</span>
                    <span><strong>Website Undangan Digital Interaktif:</strong> Nama tamu tanpa batas, musik otomatis, dan RSVP WhatsApp.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#c5a059] text-[20px] mt-0.5 shrink-0">verified</span>
                    <span><strong>Bonus Video Reels & TikTok:</strong> Format vertikal 9:16 untuk disebar di Instagram Story & WhatsApp status.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#c5a059] text-[20px] mt-0.5 shrink-0">verified</span>
                    <span><strong>Bisa Uji Raba Sampel Fisik:</strong> Datang langsung ke galeri Jl. Brigjen Katamso No. 22 Banjarmasin.</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setCurrentTab('harga')}
                className="inline-flex items-center justify-between px-6 py-4 rounded-2xl bg-[#c5a059] text-white font-bold text-sm shadow-md hover:bg-[#b08d46] transition-all cursor-pointer"
              >
                <span>Pilih Paket Undangan Siap Sebar</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 3. OFFICIAL MANUFACTURER BRAND PARTNERS */}
      <section className="w-full py-14 bg-[#edf6f0] border-b border-[#c1c8c3]/30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#775a19] uppercase tracking-widest block mb-1">
                Koleksi Brand Pabrikan Resmi
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002218]">
                Bermitra dengan Pabrikan Blangko Terpopuler di Indonesia
              </h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0f382c] bg-white px-3 py-1.5 rounded-xl border border-[#c1c8c3]/40 shrink-0">
              <span className="material-symbols-outlined text-[#25D366] text-[18px]">inventory_2</span>
              <span>Seluruh brand ready stock di gerai Banjarmasin</span>
            </div>
          </div>

          {/* Brand Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {BRAND_PARTNERS.map((brand, idx) => (
              <div
                key={idx}
                onClick={() => {
                  onSearchCatalog(brand.name);
                  setCurrentTab('katalog');
                }}
                className="p-4 rounded-2xl bg-white shadow-sm border border-[#c1c8c3]/30 hover:border-[#c5a059] hover:shadow-md hover:-translate-y-1 transition-all text-center group cursor-pointer"
              >
                <div className="font-serif text-lg font-bold text-[#002218] group-hover:text-[#775a19] transition-colors">
                  {brand.name}
                </div>
                <div className="mt-1 text-[11px] text-[#717975] font-medium">
                  {brand.subtitle}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. VALUE PROPOSITION: 4 CORE STRATEGIC PILLARS */}
      <section className="w-full py-16 bg-white border-b border-[#c1c8c3]/30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#775a19] uppercase tracking-widest block mb-1">
              Mengapa Memilih Kami
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#002218]">
              4 Keunggulan Utama UD Rez Wan Jaya
            </h2>
            <p className="text-sm sm:text-base text-[#414845] mt-2">
              Dukungan penuh untuk kelancaran bisnis percetakan lokal dan ketenangan momen bahagia para calon mempelai.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl bg-[#f8faf8] border border-[#c1c8c3]/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#0f382c] text-white flex items-center justify-center mb-5 shadow-sm">
                <span className="material-symbols-outlined text-[26px] text-[#ffdea5]">store</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#002218]">
                Toko Fisik Sentral di Banjarmasin
              </h3>
              <p className="text-xs sm:text-sm text-[#414845] mt-2 leading-relaxed">
                Terletak tepat di <strong>Jl. Brigjen Katamso No. 22</strong> (kawasan niaga sentral Banjarmasin Tengah). Akses mudah, parkir leluasa, dan bisa cek raba fisik tekstur kertas secara langsung.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl bg-[#f8faf8] border border-[#c1c8c3]/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#0f382c] text-white flex items-center justify-center mb-5 shadow-sm">
                <span className="material-symbols-outlined text-[26px] text-[#ffdea5]">inventory_2</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#002218]">
                Stok Ready Tanpa Tunggu Kargo Jawa
              </h3>
              <p className="text-xs sm:text-sm text-[#414845] mt-2 leading-relaxed">
                Gudang ber-QC kami menyimpan puluhan ribu lembar dari katalog terbitan terbaru. Bebas risiko keterlambatan kapal feri Jawa yang mengganggu tenggat cetak klien Anda.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl bg-[#f8faf8] border border-[#c1c8c3]/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#0f382c] text-white flex items-center justify-center mb-5 shadow-sm">
                <span className="material-symbols-outlined text-[26px] text-[#ffdea5]">devices</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#002218]">
                Web Undangan Digital Interaktif
              </h3>
              <p className="text-xs sm:text-sm text-[#414845] mt-2 leading-relaxed">
                Server cepat berbasis cloud CDN, buku tamu tanpa batas nama, musik otomatis tanpa lag, hitung mundur hari H, dan amplop digital QRIS multi-bank tanpa potongan.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl bg-[#f8faf8] border border-[#c1c8c3]/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#0f382c] text-white flex items-center justify-center mb-5 shadow-sm">
                <span className="material-symbols-outlined text-[26px] text-[#ffdea5]">price_change</span>
              </div>
              <h3 className="font-serif text-lg font-bold text-[#002218]">
                Diskon Progresif & Garansi Nyata
              </h3>
              <p className="text-xs sm:text-sm text-[#414845] mt-2 leading-relaxed">
                Skema harga grosir bersahabat khusus mitra percetakan dan pengrajin sablon di Kalsel & Kalteng demi menjamin perputaran modal usaha Anda kian sehat dan menguntungkan.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. 3 REAL GUARANTEES */}
      <section className="w-full py-12 bg-[#edf6f0] border-b border-[#c1c8c3]/30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c1c8c3]/40">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold text-[#775a19] uppercase tracking-widest block mb-1">
                Jaminan Ketenangan Belanja
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#002218]">
                3 Garansi Nyata Belanja di UD Rez Wan Jaya
              </h3>
              <p className="text-xs sm:text-sm text-[#414845] mt-1">
                Kami memahami pentingnya ketepatan waktu cetak dan kepuasan hasil akhir pernikahan Anda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-5 rounded-2xl bg-[#f8faf8] border border-[#c1c8c3]/30 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0f382c] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px] text-[#ffdea5]">verified_user</span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#002218]">
                    Garansi Retur Cacat Pabrik 1-to-1
                  </h4>
                  <p className="text-xs text-[#414845] mt-1 leading-relaxed">
                    Jika ditemukan lembar robek atau foil cacat bawaan pabrik, tukar langsung 1-to-1 di toko tanpa prosedur rumit berbelit.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#f8faf8] border border-[#c1c8c3]/30 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0f382c] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px] text-[#ffdea5]">flash_on</span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#002218]">
                    Ready Stock Tanpa Drama Inden
                  </h4>
                  <p className="text-xs text-[#414845] mt-1 leading-relaxed">
                    Stok tersimpan ribuan pack di gudang Banjarmasin. Percetakan tidak perlu menunda janji deadline kepada klien pengantin.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#f8faf8] border border-[#c1c8c3]/30 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#0f382c] text-white flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px] text-[#ffdea5]">palette</span>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-base text-[#002218]">
                    Gratis Template Setting CorelDraw (.CDR)
                  </h4>
                  <p className="text-xs text-[#414845] mt-1 leading-relaxed">
                    Disediakan file mentah Corel/PSD presisi 1:1 garis lipatan pond dan font pack lengkap agar desainer Anda langsung siap cetak.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 6. 4 SIMPLE WORKFLOW STEPS */}
      <section className="w-full py-16 bg-white border-b border-[#c1c8c3]/30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#775a19] uppercase tracking-widest block mb-1">
              Alur Transaksi Mudah
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#002218]">
              4 Langkah Belanja Cepat di UD Rez Wan Jaya
            </h2>
            <p className="text-sm sm:text-base text-[#414845] mt-2">
              Dari konsultasi hingga barang siap di tangan Anda, prosesnya transparan dan terstruktur.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-[#f8faf8] border border-[#c1c8c3]/40 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0f382c] text-[#ffdea5] font-serif text-lg font-bold flex items-center justify-center mb-4 shadow-sm">
                  1
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#002218]">
                  Pilih Model / Seri
                </h3>
                <p className="text-xs sm:text-sm text-[#414845] mt-2 leading-relaxed">
                  Pilih seri blangko fisik favorit di katalog atau tentukan tema web undangan yang diinginkan bersama pasangan.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#c1c8c3]/30 text-[11px] text-[#717975] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#775a19]">menu_book</span>
                <span>Bisa cek katalog di galeri toko</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-[#f8faf8] border border-[#c1c8c3]/40 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0f382c] text-[#ffdea5] font-serif text-lg font-bold flex items-center justify-center mb-4 shadow-sm">
                  2
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#002218]">
                  Cek Stok via WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-[#414845] mt-2 leading-relaxed">
                  Kirimkan kode seri dan kuantiti yang diinginkan. Admin kami merespon cepat info stok dan kalkulasi total harga grosir.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#c1c8c3]/30 text-[11px] text-[#717975] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#25D366]">chat</span>
                <span>Respon dalam ± 5 menit kerja</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-[#f8faf8] border border-[#c1c8c3]/40 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0f382c] text-[#ffdea5] font-serif text-lg font-bold flex items-center justify-center mb-4 shadow-sm">
                  3
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#002218]">
                  Pembayaran & Approval
                </h3>
                <p className="text-xs sm:text-sm text-[#414845] mt-2 leading-relaxed">
                  Selesaikan transaksi via transfer bank atau kasir toko. Untuk paket cetak jadi & web, proofing divalidasi hingga sesuai.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#c1c8c3]/30 text-[11px] text-[#717975] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#775a19]">check_box</span>
                <span>Koreksi teks fleksibel sebelum cetak</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-[#f8faf8] border border-[#c1c8c3]/40 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#0f382c] text-[#ffdea5] font-serif text-lg font-bold flex items-center justify-center mb-4 shadow-sm">
                  4
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#002218]">
                  Pick-up / Ekspedisi Kargo
                </h3>
                <p className="text-xs sm:text-sm text-[#414845] mt-2 leading-relaxed">
                  Ambil pesanan langsung di galeri Jl. Brigjen Katamso atau kami kirimkan via armada Travel L300, dermaga klotok, atau kargo.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#c1c8c3]/30 text-[11px] text-[#717975] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-[#775a19]">local_shipping</span>
                <span>Packing kardus tebal & anti air</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS & REPUTATION */}
      <section className="w-full py-16 bg-[#edf6f0] border-b border-[#c1c8c3]/30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold text-[#775a19] uppercase tracking-widest block mb-1">
                Ulasan Pelanggan Asli
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002218]">
                Dipercaya Mitra Percetakan & Pengantin se-Kalselteng
              </h2>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-[#c1c8c3]/40">
              <div className="flex text-[#d4af37]">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                ))}
              </div>
              <span className="text-xs font-bold text-[#002218]">4.9 / 5.0 di Google Maps</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Review 1 */}
            <div className="p-6 rounded-3xl bg-white border border-[#c1c8c3]/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#d4af37] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-sm text-[#414845] italic leading-relaxed">
                  “Langganan kulakan blangko undangan sudah 4 tahun untuk usaha percetakan saya di Banjarbaru. Stok serinya paling lengkap, apalagi seri Jago dan Avis selalu ready. Nggak pusing cari bahan saat musim nikah tanpa tunggu kargo Jawa.”
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#0f382c] text-[#ffdea5] flex items-center justify-center font-bold text-sm shrink-0">
                  HA
                </div>
                <div>
                  <div className="font-bold text-sm text-[#002218]">H. Akhmad Rizani</div>
                  <div className="text-xs text-[#717975]">Owner Percetakan Mandiri, Banjarbaru</div>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="p-6 rounded-3xl bg-white border border-[#c1c8c3]/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#d4af37] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-sm text-[#414845] italic leading-relaxed">
                  “Pesan paket cetak fisik 500 lembar sekalian undangan website interaktifnya. Tamu undangan banyak yang memuji webnya elegan dan lagunya otomatis muter tanpa ribet. Lokasi tokonya di Katamso juga gampang banget dicari.”
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#c5a059] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  DS
                </div>
                <div>
                  <div className="font-bold text-sm text-[#002218]">Dina & Surya</div>
                  <div className="text-xs text-[#717975]">Mempelai • Akad & Resepsi Banjarmasin</div>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="p-6 rounded-3xl bg-white border border-[#c1c8c3]/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex text-[#d4af37] mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-sm text-[#414845] italic leading-relaxed">
                  “Paling suka karena dikasih template setting CDR gratis yang presisi. Jadi nggak makan waktu buat desainer saya ngepasin margin cetak. Pelayanan mbak dan mas di toko juga ramah dan tanggap.”
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#0f382c] text-[#ffdea5] flex items-center justify-center font-bold text-sm shrink-0">
                  MK
                </div>
                <div>
                  <div className="font-bold text-sm text-[#002218]">Muhammad Kamil</div>
                  <div className="text-xs text-[#717975]">Kamil Grafika Sablon, Banjarmasin</div>
                </div>
              </div>
            </div>

          </div>

          {/* Activity Gallery & Instagram Preview */}
          <div className="rounded-3xl bg-white p-6 sm:p-8 border border-[#c1c8c3]/40 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0f382c] text-[#ffdea5] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[22px]">photo_camera</span>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#002218]">
                    Aktivitas Gerai & Kiriman Harian
                  </h3>
                  <p className="text-xs text-[#717975]">
                    Ikuti update seri blangko baru dan kiriman kargo di Instagram resmi kami
                  </p>
                </div>
              </div>
              <a
                href="https://instagram.com/ud_rezwan_jaya"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#775a19] hover:underline"
              >
                <span>@ud_rezwan_jaya</span>
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuByEIT60kE121rdZofJvq4fCYCndqIHRL6OgstIEnqVraJN4DJ8IW_EZWpfZRIMnRELd0BeolTmtA5bJQ0LoAD1yc73xH4owBMc-_f04Awc4uGZSx6cuFFRNwgHAhfoUbs5dmK1hB_k_1UqxXNQ91sEYl_3Tap0BogBFcevFuojr2V9nyYXuhqCRqfskGTQTUfNbY9pvjve2Fb4jma-FyeZ4EhTxJ5n1c87kKp8Cq4K"
                  alt="Kardus pengiriman grosir blangko Banjarmasin"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSHmMgAfoBpeOfADR_N-WryPGj_oFl00Xc4bh2XRcdTm7eb91Sdh05mwPmjsuGXZbCdJMscQSq2V4vwIyof34uWe24yiUa4v0VtkgHDa9TAQwMrNjmtZ4orFo0FOAt5kh-yNs8xYu7JUjqZW_7cAO085vl8uAj4EgWPssBKz_VN_k5HebXduly_vVm5je9CMHZ6GSPLQEDic3OQbGvtjLsatty_5eX2pk_-D0IKh47"
                  alt="Etalase buku sampel fisik UD Rez Wan Jaya"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGy0AgwHAMfWkN4VN7ZMWlvr3SXzqysICDQY0qvOZ0eK11Mhj44jtpQOFYBH0LZCMr8WAmvA4RQZKDrB4PQMdZDEwGVs97YQ4NWthEPOe6u4NrHl4k_F4Kb-uUAKisRbVQsh1cxUgDRDjb7Mdb4PfkpEJ-nGdNXxZ7oVYvYTgbq4f6-yPVaNQkiC-hThuqHY5jTADbGumP4MP1qrgrLZSR1Mj9S3oh3U9ZLq0qlhH-"
                  alt="Hot foil stamping emas mengkilap"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square rounded-2xl bg-gray-100 overflow-hidden relative group">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQhQPokioFmR6LpqaTPwVYAnguAsMNTab47TcMpWnmxSwrr8mFaZKXrfDYoGer0yx22UJhw2IuOnPJEg38zT4Qqupwkb2naDcRepQIKimb_V64Q6nq5dvnMeGwVqibvE-9s6vH7675uY92mUDsT8zok3y2uxuxD696SBxapnSin4frxW4EqAsc9GEwQcENNMUop13SXN35l4Ew66gFPiYwOGs2bOU6lrgjDbc1fyUk"
                  alt="Gudang penyimpanan blangko Banjarmasin"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. PHYSICAL STORE LOCATION CARD */}
      <section className="w-full py-16 bg-white border-b border-[#c1c8c3]/30">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f8faf8] p-6 sm:p-8 rounded-3xl border border-[#c1c8c3]/40 shadow-sm">
            
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fed488] text-[#785a1a] text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">pin_drop</span>
                <span>Kunjungi Toko Langsung</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#002218]">
                Lokasi Mudah Dijangkau di Jantung Banjarmasin
              </h3>
              <p className="text-sm text-[#414845] leading-relaxed">
                Silakan mampir untuk melihat buku sampel fisik, memegang langsung tekstur kertas Brief Card / Jasmine glitter, dan berkonsultasi mengenai kebutuhan kulakan atau undangan digital.
              </p>
              
              <div className="space-y-2 text-xs text-[#151d1a] pt-1">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#775a19] text-[18px] mt-0.5 shrink-0">store</span>
                  <span><strong>Alamat:</strong> Jl. Brigjen Katamso No. 22, RT. 07, Kertak Baru Ilir, Kec. Banjarmasin Tengah, Kota Banjarmasin, Kalimantan Selatan 70111</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#775a19] text-[18px] shrink-0">schedule</span>
                  <span><strong>Buka:</strong> Senin – Sabtu, 08.30 – 17.30 WITA</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://maps.google.com/?q=UD+Rez+Wan+Jaya+Jl+Brigjen+Katamso+No+22+Banjarmasin"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0f382c] text-white font-bold text-xs sm:text-sm hover:bg-[#002218] transition-colors shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">directions</span>
                  <span>Buka Petunjuk Rute Google Maps ↗</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="w-full h-80 rounded-2xl bg-cover bg-center shadow-inner relative overflow-hidden border border-[#c1c8c3]/40" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIUG-vVE1AH4XEoaFGRkVHH5agOcJVY5u3VwDeIcheU9z76ZdOxOAMGWSAICR9-zITfFyIOxy3yGoI_xOwvB2o0NmdgHNNRzEVMqj8Mpv2fSS51ylTUcSst-Dtvd3wZpDRhop4Kf8kHfKD-TcvCC_LYMPjMiLncwdeozRN7tryz2GElg5BgYwl_-U71tNjLKCiLme016vp0ZWmTeuIeD6B5biWyYFt1P_8QXFdoUnx')" }}>
                <div className="absolute inset-0 bg-[#002218]/15"></div>
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-md flex items-center gap-2 text-[#002218] border border-white/60">
                  <span className="material-symbols-outlined text-[#c5a059] text-[22px]">location_on</span>
                  <div>
                    <span className="text-xs font-bold block">UD Rez Wan Jaya Banjarmasin</span>
                    <span className="text-[10px] text-[#717975]">Jl. Brigjen Katamso No. 22</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. BOTTOM HIGH-CONVERTING CTA BANNER */}
      <section className="w-full py-16 bg-[#0f382c] text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#c5a059]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 text-center relative z-10">
          <span className="text-xs font-bold text-[#ffdea5] uppercase tracking-widest block mb-2">
            Layanan Fast Response WITA
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white max-w-3xl mx-auto leading-tight">
            Siap Memulai Cetak atau Butuh Pasokan Blangko Hari Ini?
          </h2>
          <p className="text-sm sm:text-base text-[#c1ecda] max-w-2xl mx-auto mt-4 leading-relaxed">
            Konsultasikan kebutuhan blangko grosir, cek ketersediaan seri favorit, atau request aktivasi demo web undangan bersama admin UD Rez Wan Jaya sekarang.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
            <a
              href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya,%20saya%20ingin%20tanya%20stok%20blangko%20dan%20harga"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#25D366] text-white font-bold text-sm sm:text-base shadow-xl hover:bg-[#20ba5a] transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[24px]">chat</span>
              <span>Chat WhatsApp: 0851-0358-0450</span>
            </a>
            <button
              onClick={() => setCurrentTab('katalog')}
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white text-[#002218] font-bold text-sm sm:text-base shadow-md hover:bg-[#edf6f0] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-[#775a19]">explore</span>
              <span>Eksplor Katalog Produk</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-[#c1ecda]">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffdea5] text-[16px]">check_circle</span>
              Fast Respon WITA
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffdea5] text-[16px]">check_circle</span>
              Bisa Kirim se-Kalselteng
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#ffdea5] text-[16px]">check_circle</span>
              Jaminan Tukar Lembar Cacat
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};
