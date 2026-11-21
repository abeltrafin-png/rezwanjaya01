import React, { useState } from 'react';
import { WHOLESALE_MATRIX, READY_PACKAGES, FAQS } from '../data/pricingData';

export const PricingView: React.FC = () => {
  // Main view toggle: 'fisik' | 'digital'
  const [pricingTab, setPricingTab] = useState<'fisik' | 'digital'>('fisik');

  // Calculator states
  const [calcType, setCalcType] = useState<'cetak' | 'kulakan' | 'web'>('cetak');
  const [calcQty, setCalcQty] = useState<number>(500);
  const [addonOpp, setAddonOpp] = useState<boolean>(true);
  const [addonLabel, setAddonLabel] = useState<boolean>(true);
  const [addonWeb, setAddonWeb] = useState<boolean>(true);

  // Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Calculation Logic
  const getCalculation = () => {
    let unitPrice = 0;
    let subtotal = 0;
    let addonCost = 0;
    let typeName = '';

    if (calcType === 'cetak') {
      typeName = 'Cetak Jadi Siap Sebar';
      if (calcQty <= 300) {
        unitPrice = 1500;
      } else if (calcQty <= 700) {
        unitPrice = 1200;
      } else {
        unitPrice = 950;
      }
      subtotal = calcQty * unitPrice;
      // In cetak tier, OPP and Label are already FREE included in package!
      // Add-on Web is promo bundling Rp 49.000
      if (addonWeb) {
        addonCost += 49000;
      }
    } else if (calcType === 'kulakan') {
      typeName = 'Kulakan Blangko Mentah';
      if (calcQty < 500) {
        unitPrice = 550;
      } else if (calcQty < 1000) {
        unitPrice = 500;
      } else {
        unitPrice = 460;
      }
      subtotal = calcQty * unitPrice;

      // In kulakan blangko mentah, OPP is +Rp 100/pcs if checked
      if (addonOpp) {
        addonCost += calcQty * 100;
      }
      // Label is +Rp 150/pcs if checked
      if (addonLabel) {
        addonCost += calcQty * 150;
      }
      // Web add-on is promo bundling Rp 49.000
      if (addonWeb) {
        addonCost += 49000;
      }
    } else {
      typeName = 'Web Undangan Saja';
      unitPrice = 125000;
      subtotal = 125000;
      addonCost = 0;
    }

    const grandTotal = subtotal + addonCost;

    return {
      typeName,
      unitPrice,
      subtotal,
      addonCost,
      grandTotal
    };
  };

  const calc = getCalculation();

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // WhatsApp formatted message generator
  const getWaMessage = () => {
    const qtyText = calcType === 'web' ? 'Paket 1 Tahun Unlimited' : `${calcQty} Pcs`;
    let addonNotes = [];
    if (calcType === 'cetak') {
      addonNotes.push('Gratis Plastik OPP & Label Nama');
      if (addonWeb) addonNotes.push('Bundling Web Undangan (+Rp 49.000)');
    } else if (calcType === 'kulakan') {
      if (addonOpp) addonNotes.push(`Plastik OPP (+${formatRupiah(calcQty * 100)})`);
      if (addonLabel) addonNotes.push(`Label Nama (+${formatRupiah(calcQty * 150)})`);
      if (addonWeb) addonNotes.push('Bundling Web Undangan (+Rp 49.000)');
    } else {
      addonNotes.push('Fitur Lengkap Premium (RSVP, Musik, 15 Foto, QRIS)');
    }

    const text = `Halo UD Rez Wan Jaya Banjarmasin,\n\n` +
      `Saya ingin konsultasi & mengunci harga pesanan:\n` +
      `• Tipe Layanan: ${calc.typeName}\n` +
      `• Jumlah Kuantiti: ${qtyText}\n` +
      `• Rincian Tambahan: ${addonNotes.join(', ')}\n` +
      `• Estimasi Total Biaya: ${formatRupiah(calc.grandTotal)}\n\n` +
      `Mohon info ketersediaan stok fisik & langkah pemesanannya. Terima kasih!`;

    return `https://wa.me/6285103580450?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="w-full flex flex-col">
      
      {/* 1. Header Banner */}
      <section className="relative w-full bg-[#edf6f0] py-12 px-4 md:px-8 border-b border-[#c1c8c3]/30 overflow-hidden">
        <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center relative z-10 space-y-4">
          
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-white shadow-sm border border-[#c1c8c3]/40">
            <span className="material-symbols-outlined text-[18px] text-[#775a19]">payments</span>
            <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider">
              Transparan & Garansi Termurah se-Kalsel-Kalteng
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#002218] max-w-3xl leading-tight">
            Daftar Harga Blangko & Paket Undangan
          </h1>

          <p className="text-sm sm:text-base text-[#414845] max-w-2xl leading-relaxed">
            Solusi kulakan grosir bagi mitra percetakan tanpa beban ongkir kargo kapal Jawa, serta paket siap sebar lengkap bagi calon mempelai dengan hasil cetak presisi.
          </p>

          {/* Segmented Two-way Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-[#dce5df] border border-[#c1c8c3]/40 shadow-inner gap-1 mt-4">
            <button
              onClick={() => setPricingTab('fisik')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                pricingTab === 'fisik'
                  ? 'bg-[#0f382c] text-white shadow-md'
                  : 'text-[#414845] hover:text-[#002218] hover:bg-white/50'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">inventory_2</span>
              <span>Harga Fisik & Grosir</span>
            </button>

            <button
              onClick={() => setPricingTab('digital')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                pricingTab === 'digital'
                  ? 'bg-[#0f382c] text-white shadow-md'
                  : 'text-[#414845] hover:text-[#002218] hover:bg-white/50'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">devices</span>
              <span>Paket Web Undangan</span>
            </button>
          </div>

        </div>
      </section>

      {/* 2. TAB 1: HARGA FISIK & GROSIR */}
      {pricingTab === 'fisik' && (
        <div className="w-full space-y-16 py-12 px-4 md:px-8 bg-[#f8faf8]">
          
          {/* Section A: B2B Wholesale Matrix */}
          <section className="max-w-[1280px] mx-auto space-y-6">
            
            {/* Highlight Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f382c] via-[#002218] to-[#0f382c] text-white p-6 sm:p-8 md:p-10 shadow-xl border border-[#c5a059]/40">
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-3xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-[#c5a059]/40 text-[#ffdea5] text-xs font-bold uppercase tracking-wider">
                    <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                    <span>Harga Pabrik Langsung di Banjarmasin</span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white leading-snug">
                    Bebas Ongkir Ekspedisi dari Jawa, Ready Stock di Gerai Katamso No. 22!
                  </h2>
                  <p className="text-xs sm:text-sm text-[#c1ecda] leading-relaxed">
                    Ambil eceran per pak (100 lbr) atau kartonan tanpa tunggu kargo kapal 5–10 hari. Jaminan tukar lembar cacat langsung di etalase toko fisik kami.
                  </p>
                </div>
                <div className="shrink-0 flex flex-col gap-1.5">
                  <a
                    href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya,%20saya%20ingin%20minta%20katalog%20lengkap%20grosir%20blangko%20dan%20sampel%20fisik."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-[#25D366] hover:bg-[#20ba5a] shadow-lg transition-all hover:scale-105"
                  >
                    <span className="material-symbols-outlined text-[20px]">chat</span>
                    <span>Minta Katalog & Sampel Fisik</span>
                  </a>
                  <span className="text-[11px] text-center text-[#ffdea5]/80">
                    Respon Cepat Tim CS Percetakan
                  </span>
                </div>
              </div>
            </div>

            {/* Wholesale Matrix Table Card */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#c1c8c3]/40 space-y-6">
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                <div>
                  <div className="inline-flex items-center gap-1 text-[#775a19] text-xs uppercase font-bold tracking-wider mb-1">
                    <span className="material-symbols-outlined text-[16px]">table_chart</span>
                    <span>B2B Wholesale Matrix Table</span>
                  </div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002218]">
                    Matriks Harga Grosir Mitra Percetakan
                  </h3>
                  <p className="text-xs text-[#717975] mt-0.5">
                    Update kuartal berjalan. 1 pak berisi 100 lembar. Diskon otomatis bertingkat sesuai kuantiti pesanan.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya,%20mohon%20kirimkan%20PDF%20Daftar%20Harga%20Grosir%20Blangko%20terkini."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#edf6f0] hover:bg-[#dce5df] text-[#002218] text-xs font-bold border border-[#c1c8c3]/40 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#775a19]">download</span>
                    <span>Download Pricelist PDF</span>
                  </a>
                  <a
                    href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya,%20saya%20ingin%20pesan%20grosir%20minimal%201%20Dus%20/%20Kartonan."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f382c] hover:bg-[#002218] text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px] text-[#ffdea5]">shopping_cart</span>
                    <span>Pesan 1 Karton Langsung</span>
                  </a>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto -mx-6 md:mx-0">
                <table className="w-full text-left min-w-[760px] border-separate border-spacing-0 text-sm">
                  <thead>
                    <tr className="bg-[#edf6f0] text-[#002218]">
                      <th className="py-3.5 px-4 font-bold rounded-l-xl border-y border-l border-[#c1c8c3]/30">
                        Kategori & Brand
                      </th>
                      <th className="py-3.5 px-4 font-bold border-y border-[#c1c8c3]/30">
                        Eceran (&lt; 1 Pak)
                      </th>
                      <th className="py-3.5 px-4 font-bold border-y border-[#c1c8c3]/30">
                        1 - 4 Pak <span className="block text-xs font-normal text-[#717975]">(100-400 pcs)</span>
                      </th>
                      <th className="py-3.5 px-4 font-bold border-y border-[#c1c8c3]/30">
                        5 - 9 Pak <span className="block text-xs font-normal text-[#717975]">(500-900 pcs)</span>
                      </th>
                      <th className="py-3.5 px-4 font-bold bg-[#fed488]/30 text-[#785a1a] border-y border-[#c5a059]/40">
                        <div className="flex items-center gap-1.5">
                          <span>1 Dus / Karton</span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#775a19] text-white">
                            HEMAT MAX
                          </span>
                        </div>
                        <span className="block text-xs font-semibold text-[#785a1a]">(1.000+ pcs)</span>
                      </th>
                      <th className="py-3.5 px-4 font-bold rounded-r-xl border-y border-r border-[#c1c8c3]/30">
                        Bonus & File Mitra
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {WHOLESALE_MATRIX.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#f8faf8] transition-colors">
                        <td className="py-4 px-4">
                          <strong className="text-[#002218] block">{row.category}</strong>
                          <span className="text-xs text-[#717975]">Merk: {row.brands}</span>
                        </td>
                        <td className="py-4 px-4 text-[#414845]">
                          <span className="font-semibold">{row.retail}</span>
                        </td>
                        <td className="py-4 px-4 text-[#414845]">
                          <span className="font-semibold">{row.tier1}</span>
                        </td>
                        <td className="py-4 px-4 text-[#002218]">
                          <span className="font-bold">{row.tier2}</span>
                        </td>
                        <td className="py-4 px-4 bg-[#fed488]/15 font-bold text-[#785a1a] border-x border-[#c5a059]/20">
                          <span className="text-base">{row.tierMax}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#edf6f0] text-[#002218] text-xs font-semibold">
                            <span className="material-symbols-outlined text-[16px] text-[#775a19]">folder_zip</span>
                            {row.bonus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Glossary Footer */}
              <div className="p-4 rounded-2xl bg-[#edf6f0] border border-[#c1c8c3]/40 flex flex-col md:flex-row gap-4 items-start justify-between text-xs text-[#414845]">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-[#002218] font-bold">
                    <span className="material-symbols-outlined text-[#775a19] text-[18px]">help_outline</span>
                    <span>Glosarium Istilah Cetak untuk Pemula & Mitra:</span>
                  </div>
                  <p>
                    <strong className="text-[#002218]">Master CDR:</strong> Template desain CorelDraw skala 1:1 siap cetak teks tanpa perlu ukur ulang manual. | <strong className="text-[#002218]">Pisau Pond:</strong> Pola potong lekukan & rel lipatan presisi agar blangko terlipat sempurna tanpa sobek.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white font-bold text-[#775a19] shrink-0 border border-[#c1c8c3]/40">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  Garansi Presisi 100%
                </span>
              </div>

            </div>
          </section>

          {/* Section B: Turn-Key Packages for Couples */}
          <section className="max-w-[1280px] mx-auto space-y-8 pt-4">
            
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider block">
                Turn-Key Consumer Packages
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#002218]">
                Paket Cetak Jadi Siap Sebar Calon Mempelai
              </h2>
              <p className="text-sm sm:text-base text-[#414845]">
                Undangan fisik siap sebar sudah termasuk cetak tinta tajam, plastik OPP, stiker label nama tamu terprint, barcode peta, dan diskon bundling web digital.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              {READY_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`flex flex-col justify-between rounded-3xl p-6 sm:p-8 shadow-sm transition-all duration-300 relative border ${
                    pkg.isPopular
                      ? 'bg-[#0f382c] text-white border-2 border-[#c5a059] shadow-xl -mt-2 lg:-mt-4'
                      : 'bg-white text-[#151d1a] border-[#c1c8c3]/40 hover:shadow-md'
                  }`}
                >
                  {pkg.badge && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c5a059] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">star</span>
                      {pkg.badge}
                    </div>
                  )}

                  <div className="space-y-5">
                    <div>
                      <span className={`text-xs font-bold uppercase tracking-wider block ${pkg.isPopular ? 'text-[#ffdea5]' : 'text-[#775a19]'}`}>
                        {pkg.subtitle}
                      </span>
                      <h3 className={`font-serif text-2xl font-bold mt-1 ${pkg.isPopular ? 'text-white' : 'text-[#002218]'}`}>
                        {pkg.title}
                      </h3>
                    </div>

                    <div className={`p-4 rounded-2xl ${pkg.isPopular ? 'bg-black/25' : 'bg-[#edf6f0]'}`}>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-gray-400">Mulai</span>
                        <span className={`font-serif text-3xl font-bold ${pkg.isPopular ? 'text-[#ffdea5]' : 'text-[#002218]'}`}>
                          {formatRupiah(pkg.unitPrice)}
                        </span>
                        <span className="text-xs text-gray-400">/ pcs</span>
                      </div>
                      <div className={`text-xs mt-1 ${pkg.isPopular ? 'text-white/80' : 'text-[#717975]'}`}>
                        Total Estimasi: {formatRupiah(pkg.totalPrice)} (Minimal {pkg.minQty} Pcs)
                      </div>
                    </div>

                    <ul className={`space-y-3 text-xs leading-relaxed ${pkg.isPopular ? 'text-white' : 'text-[#414845]'}`}>
                      {pkg.benefits.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5">
                          <span className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${pkg.isPopular ? 'text-[#ffdea5]' : 'text-[#25D366]'}`}>
                            check_circle
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <a
                      href={`https://wa.me/6285103580450?text=${encodeURIComponent(`Halo UD Rez Wan Jaya, saya ingin memesan ${pkg.title} (${formatRupiah(pkg.unitPrice)}/pcs). Mohon info katalog modelnya.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                        pkg.isPopular
                          ? 'bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-md'
                          : 'bg-[#0f382c] hover:bg-[#002218] text-white'
                      }`}
                    >
                      <span>Pilih {pkg.title}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      )}

      {/* 3. TAB 2: PAKET WEB UNDANGAN DIGITAL */}
      {pricingTab === 'digital' && (
        <div className="w-full space-y-16 py-12 px-4 md:px-8 bg-[#f8faf8]">
          <section className="max-w-[1280px] mx-auto space-y-8">
            
            <div className="text-center max-w-2xl mx-auto space-y-1.5">
              <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider block">
                Web Undangan Pernikahan Online
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#002218]">
                Paket Website Undangan Digital Interaktif
              </h2>
              <p className="text-sm sm:text-base text-[#414845]">
                Kirim kabar bahagia ke kerabat jauh & keluarga via WhatsApp hanya dalam hitungan detik. Cepat diakses di semua jaringan seluler tanpa lag.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
              
              {/* Tier 1: Paket Hemat */}
              <div className="flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c1c8c3]/40">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#717975] block">Pilihan Praktis</span>
                    <h3 className="font-serif text-2xl font-bold text-[#002218] mt-0.5">Paket Hemat</h3>
                    <p className="text-xs text-[#717975]">Esensial untuk undangan keluarga dan sahabat intim.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#edf6f0]">
                    <span className="font-serif text-3xl font-bold text-[#002218]">Rp 75.000</span>
                    <div className="text-xs text-[#717975] mt-0.5">Sekali bayar tanpa batasan kuota tamu</div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#414845]">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">timer</span>
                      <span>Masa aktif web hingga <strong>3 bulan</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">map</span>
                      <span>Peta lokasi terhubung Google Maps</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">hourglass_top</span>
                      <span>Hitung mundur hari bahagia (Countdown)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">account_balance_wallet</span>
                      <span>Amplop digital 1 nomor rekening bank</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">photo_library</span>
                      <span>Maksimal 5 foto galeri prewedding</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <a
                    href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya,%20saya%20ingin%20order%20Paket%20Web%20Hemat%20Rp%2075.000."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#edf6f0] hover:bg-[#dce5df] text-[#002218] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Order Paket Hemat</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </a>
                </div>
              </div>

              {/* Tier 2: Paket Premium */}
              <div className="flex flex-col justify-between bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-[#c1c8c3]/40">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#775a19] block">Fitur Lengkap Favorit</span>
                    <h3 className="font-serif text-2xl font-bold text-[#002218] mt-0.5">Paket Premium</h3>
                    <p className="text-xs text-[#717975]">Pengalaman terlengkap dengan RSVP langsung tembus WhatsApp.</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#edf6f0]">
                    <span className="font-serif text-3xl font-bold text-[#002218]">Rp 125.000</span>
                    <div className="text-xs text-[#717975] mt-0.5">Masa aktif 1 tahun penuh tanpa iklan</div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-[#414845]">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">event_available</span>
                      <span>Masa aktif <strong>1 tahun penuh</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">chat_bubble</span>
                      <span>Fitur RSVP konfirmasi WhatsApp otomatis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">group</span>
                      <span>Custom nama tamu tanpa batas (Link personal)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">library_music</span>
                      <span>Musik latar playlist custom dengan controller</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">videocam</span>
                      <span>Galeri 15 foto HD + Video teaser YouTube</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#775a19]">qr_code_2</span>
                      <span>QRIS barcode amplop digital multi-bank</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <a
                    href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya,%20saya%20ingin%20order%20Paket%20Web%20Premium%20Rp%20125.000."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-[#0f382c] hover:bg-[#002218] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Order Paket Premium</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </a>
                </div>
              </div>

              {/* Tier 3: Bundling Fisik + Web (BEST CHOICE) */}
              <div className="flex flex-col justify-between bg-[#0f382c] text-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-[#c5a059] relative -mt-2 lg:-mt-4">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#c5a059] text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase shadow-md flex items-center gap-1 whitespace-nowrap">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  BEST CHOICE & HEMAT 60%
                </div>

                <div className="space-y-4 pt-1">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ffdea5] block">
                      Rekomendasi Utama Pasangan
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                      Paket Bundling Fisik + Digital
                    </h3>
                    <p className="text-xs text-[#c1ecda]">
                      Syarat: cukup pesan cetak fisik minimal 300 pcs di toko kami.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/25">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-400 line-through">Rp 125.000</span>
                      <span className="font-serif text-3xl font-bold text-[#ffdea5]">HANYA Rp 49.000</span>
                    </div>
                    <div className="text-xs text-[#c1ecda] mt-0.5">Mendapatkan SEMUA fitur Paket Premium Unlimited</div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-white">
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#ffdea5] shrink-0 mt-0.5">check_circle</span>
                      <span><strong>Semua Fitur Paket Premium</strong> (RSVP, Musik, 15 Foto, QRIS, dll.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#ffdea5] shrink-0 mt-0.5">check_circle</span>
                      <span><strong>Bonus Video Undangan 9:16</strong> untuk IG Reels & WhatsApp Story</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#ffdea5] shrink-0 mt-0.5">check_circle</span>
                      <span><strong>Layanan Revisi Kilat 24 Jam</strong> siap sebar hari itu juga</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#ffdea5] shrink-0 mt-0.5">check_circle</span>
                      <span>Desain tema diselaraskan dengan warna fisik blangko undangan</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6">
                  <a
                    href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya,%20saya%20mau%20ambil%20Promo%20Bundling%20Fisik%20+%20Web%20Rp%2049.000."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Ambil Promo Bundling Rp 49.000</span>
                  </a>
                </div>
              </div>

            </div>
          </section>
        </div>
      )}

      {/* 4. INTERACTIVE LIVE COST ESTIMATOR (Real-time Calculator) */}
      <section className="w-full py-12 px-4 md:px-8 bg-white border-y border-[#c1c8c3]/30">
        <div className="max-w-[1280px] mx-auto bg-[#f8faf8] rounded-3xl p-6 sm:p-8 md:p-10 border-2 border-[#c5a059]/40 shadow-xl space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#c1c8c3]/40">
            <div>
              <div className="inline-flex items-center gap-1 text-[#775a19] text-xs uppercase font-bold tracking-wider mb-1">
                <span className="material-symbols-outlined text-[18px]">calculate</span>
                <span>Kalkulator Estimasi Biaya Pesanan Interaktif</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002218]">
                Hitung Simulasi Anggaran Undangan Seketika
              </h2>
              <p className="text-xs sm:text-sm text-[#414845] mt-1">
                Geser slider kuantiti dan pilih add-on. Rincian per lembar dan total dihitung otomatis sesuai pricelist resmi.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#edf6f0] text-[#002218] text-xs font-semibold shrink-0">
              <span className="material-symbols-outlined text-[18px] text-[#25D366]">sync_alt</span>
              <span>Simulasi Akurat 100%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Controls */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Option 1: Tipe Pesanan */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#002218] uppercase tracking-wider block">
                  1. Pilih Tipe Pesanan:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCalcType('cetak')}
                    className={`py-3 px-3 rounded-2xl font-bold text-center transition-all cursor-pointer border ${
                      calcType === 'cetak'
                        ? 'bg-[#0f382c] text-white border-[#0f382c] shadow-md'
                        : 'bg-white text-[#414845] border-[#c1c8c3]/40 hover:bg-[#edf6f0]'
                    }`}
                  >
                    Cetak Jadi Siap Sebar
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcType('kulakan')}
                    className={`py-3 px-3 rounded-2xl font-bold text-center transition-all cursor-pointer border ${
                      calcType === 'kulakan'
                        ? 'bg-[#0f382c] text-white border-[#0f382c] shadow-md'
                        : 'bg-white text-[#414845] border-[#c1c8c3]/40 hover:bg-[#edf6f0]'
                    }`}
                  >
                    Kulakan Blangko Mentah
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalcType('web')}
                    className={`py-3 px-3 rounded-2xl font-bold text-center transition-all cursor-pointer border ${
                      calcType === 'web'
                        ? 'bg-[#0f382c] text-white border-[#0f382c] shadow-md'
                        : 'bg-white text-[#414845] border-[#c1c8c3]/40 hover:bg-[#edf6f0]'
                    }`}
                  >
                    Web Undangan Saja
                  </button>
                </div>
              </div>

              {/* Option 2: Quantity Slider (only for cetak / kulakan) */}
              {calcType !== 'web' ? (
                <div className="space-y-3 p-4 bg-white rounded-2xl border border-[#c1c8c3]/40 shadow-sm">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#002218] uppercase tracking-wider">
                      2. Jumlah Kuantiti:
                    </label>
                    <span className="font-serif font-bold text-lg text-[#775a19]">
                      {calcQty} Pcs
                    </span>
                  </div>

                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={calcQty}
                    onChange={(e) => setCalcQty(Number(e.target.value))}
                    className="w-full accent-[#0f382c] cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-[#717975] px-1">
                    <span>100 pcs</span>
                    <span>300 pcs (Min Cetak)</span>
                    <span>500 pcs (Populer)</span>
                    <span>1.000 pcs (Grosir Max)</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-2xl border border-[#c1c8c3]/40 text-xs text-[#414845]">
                  <strong className="text-[#002218] block mb-1">Paket Web Undangan Digital Mandiri:</strong>
                  Masa aktif 1 tahun penuh, kuota nama tamu unlimited, RSVP WhatsApp, pemutar musik, dan amplop QRIS aktif.
                </div>
              )}

              {/* Option 3: Checkbox Add-ons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#002218] uppercase tracking-wider block">
                  3. Pilihan Perlengkapan & Add-on:
                </label>
                <div className="space-y-2 text-xs">
                  
                  {/* OPP */}
                  <div className="p-3 rounded-2xl bg-white border border-[#c1c8c3]/40 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={addonOpp}
                        onChange={(e) => setAddonOpp(e.target.checked)}
                        disabled={calcType === 'web'}
                        className="w-4 h-4 accent-[#0f382c] rounded"
                      />
                      <span className="font-medium text-[#002218]">
                        Plastik OPP Tebal Seal Lem (+Rp 100/pcs)
                      </span>
                    </label>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {calcType === 'cetak' ? 'GRATIS (Tier Cetak)' : '+Rp 100/pcs'}
                    </span>
                  </div>

                  {/* Label stiker */}
                  <div className="p-3 rounded-2xl bg-white border border-[#c1c8c3]/40 flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={addonLabel}
                        onChange={(e) => setAddonLabel(e.target.checked)}
                        disabled={calcType === 'web'}
                        className="w-4 h-4 accent-[#0f382c] rounded"
                      />
                      <span className="font-medium text-[#002218]">
                        Label Stiker Print Nama Tamu (+Rp 150/pcs)
                      </span>
                    </label>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-100 text-emerald-800">
                      {calcType === 'cetak' ? 'GRATIS (Tier Cetak)' : '+Rp 150/pcs'}
                    </span>
                  </div>

                  {/* Digital web bundling */}
                  <div className="p-3 rounded-2xl bg-white border border-[#c5a059]/40 flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={addonWeb}
                        onChange={(e) => setAddonWeb(e.target.checked)}
                        disabled={calcType === 'web'}
                        className="w-4 h-4 accent-[#c5a059] rounded"
                      />
                      <span className="font-medium text-[#002218]">
                        Bundling Website Undangan Digital (+Rp 49.000)
                      </span>
                    </label>
                    <span className="px-2.5 py-0.5 rounded font-bold text-[10px] bg-[#c5a059] text-white shrink-0">
                      HEMAT 60%
                    </span>
                  </div>

                </div>
              </div>

            </div>

            {/* Output Calculation Result Box */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-[#c1c8c3]/40 shadow-sm space-y-5 flex flex-col justify-between">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider">
                    Ringkasan Estimasi Biaya
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    Transparan 100%
                  </span>
                </div>

                <div className="flex items-baseline justify-between text-xs text-[#414845]">
                  <span>Harga Satuan:</span>
                  <strong className="text-sm text-[#002218]">
                    {calcType === 'web' ? 'Paket 1 Tahun' : `${formatRupiah(calc.unitPrice)} / pcs`}
                  </strong>
                </div>

                <div className="flex items-baseline justify-between text-xs text-[#414845]">
                  <span>Subtotal Kuantiti:</span>
                  <strong className="text-sm text-[#002218]">
                    {formatRupiah(calc.subtotal)}
                  </strong>
                </div>

                <div className="flex items-baseline justify-between text-xs text-[#414845]">
                  <span>Biaya Add-on Tambahan:</span>
                  <strong className="text-sm text-[#775a19]">
                    +{formatRupiah(calc.addonCost)}
                  </strong>
                </div>

                <div className="flex items-baseline justify-between pt-3 border-t border-gray-200">
                  <span className="font-bold text-sm sm:text-base text-[#002218]">Total Estimasi:</span>
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald-900">
                    {formatRupiah(calc.grandTotal)}
                  </span>
                </div>

                <p className="text-[11px] text-[#717975] text-right">
                  {calcType === 'cetak'
                    ? 'Sudah termasuk gratis plastik OPP & label stiker nama tamu.'
                    : 'Gratis template CDR CorelDraw presisi 1:1.'}
                </p>
              </div>

              {/* Dynamic Preview WhatsApp Box */}
              <div className="p-3.5 rounded-2xl bg-[#edf6f0] border border-[#c1c8c3]/40 space-y-1.5 text-xs">
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#775a19] uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  <span>Preview Pesan WhatsApp Otomatis:</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[#c1c8c3]/30 text-[11px] text-[#414845] italic leading-relaxed">
                  Halo UD Rez Wan Jaya, saya ingin konsultasi & mengunci harga: {calc.typeName} ({calcType === 'web' ? 'Paket 1 Tahun' : `${calcQty} Pcs`}){addonWeb && calcType !== 'web' ? ' + Bundling Web Rp 49.000' : ''}. Total estimasi: {formatRupiah(calc.grandTotal)}.
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href={getWaMessage()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">chat</span>
                  <span>Konsultasi & Kunci Harga via WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. FAQ ACCORDION SECTION */}
      <section className="w-full py-16 px-4 md:px-8 bg-[#f8faf8]">
        <div className="max-w-[960px] mx-auto space-y-8">
          
          <div className="text-center space-y-1.5">
            <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider block">
              Tanya Jawab Seputar Pemesanan
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002218]">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h2>
            <p className="text-sm text-[#414845]">
              Informasi praktis seputar armada pengiriman luar kota Banjarmasin, durasi cetak, hingga file setting Corel.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, fIdx) => (
              <div
                key={fIdx}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-[#c1c8c3]/40 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === fIdx ? null : fIdx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#edf6f0]/40 transition-colors cursor-pointer"
                >
                  <span className="font-serif font-bold text-sm sm:text-base text-[#002218] flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#775a19] text-[20px] shrink-0">
                      {faq.icon}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <span
                    className={`material-symbols-outlined text-[#717975] transition-transform duration-200 shrink-0 ${
                      openFaqIndex === fIdx ? 'rotate-180 text-[#0f382c]' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>

                {openFaqIndex === fIdx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#414845] leading-relaxed animate-fadeIn">
                    <div className="p-4 rounded-xl bg-[#edf6f0] border border-[#c1c8c3]/30">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Quick CS Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#edf6f0] text-center space-y-3 border border-[#c1c8c3]/40">
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#002218]">
              Masih Ada Pertanyaan Spesifik Tentang Kebutuhan Cetak Anda?
            </h3>
            <p className="text-xs sm:text-sm text-[#414845] max-w-xl mx-auto">
              Tim customer support kami standby melayani konsultasi jenis kertas, cek ketersediaan seri blangko terkini, atau estimasi tarif ongkir ke alamat Anda.
            </p>
            <div className="pt-2">
              <a
                href="https://wa.me/6285103580450?text=Halo%20Admin%20UD%20Rez%20Wan%20Jaya,%20saya%20ingin%20tanya%20seputar%20pemesanan%20undangan."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Konsultasi Bebas Biaya via WhatsApp (0851-0358-0450)</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
