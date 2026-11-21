import React, { useState } from 'react';
import { PortfolioItem } from '../types';
import { PORTFOLIO_ITEMS } from '../data/products';

interface CompanyViewProps {
  onOpenPortfolioModal: (item: PortfolioItem) => void;
}

export const CompanyView: React.FC<CompanyViewProps> = ({ onOpenPortfolioModal }) => {
  // Sub-tabs: 'kontak' | 'portofolio' | 'tentang'
  const [subTab, setSubTab] = useState<'kontak' | 'portofolio' | 'tentang'>('kontak');

  // Portfolio filter category
  const [portfolioCategory, setPortfolioCategory] = useState<string>('all');

  // Contact Inquiry Form States
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formNeed, setFormNeed] = useState('Kulakan Blangko Reseller / Grosir Percetakan');
  const [formNotes, setFormNotes] = useState('');

  const filteredPortfolio = portfolioCategory === 'all'
    ? PORTFOLIO_ITEMS
    : PORTFOLIO_ITEMS.filter((item) => item.category === portfolioCategory);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) return;

    const text = `Halo UD Rez Wan Jaya Banjarmasin,\n\n` +
      `Saya ingin berkonsultasi mengenai kebutuhan undangan:\n` +
      `• Nama / Usaha Cetak: ${formName}\n` +
      `• No. WhatsApp: ${formPhone}\n` +
      `• Kebutuhan Layanan: ${formNeed}\n` +
      (formNotes ? `• Catatan / Estimasi Kuantiti: ${formNotes}\n\n` : `\n`) +
      `Mohon dibantu informasi stok sampel fisik & penawaran harga grosir. Terima kasih!`;

    window.open(`https://wa.me/6285103580450?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full flex flex-col">
      
      {/* 1. Page Header & Subtab Bar */}
      <section className="w-full bg-[#edf6f0] py-10 px-4 md:px-8 border-b border-[#c1c8c3]/30">
        <div className="max-w-[1280px] mx-auto space-y-5">
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#775a19] text-xs font-bold uppercase tracking-wider border border-[#c1c8c3]/40">
            <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
            <span>Profil Perusahaan, Portofolio & Gerai Resmi</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#002218] leading-tight">
            Tentang UD Rez Wan Jaya Banjarmasin
          </h1>

          <p className="text-sm sm:text-base text-[#414845] max-w-3xl leading-relaxed">
            Pusat kulakan blangko undangan pernikahan terlengkap & solusi undangan digital interaktif di Kalimantan Selatan sejak 2015. Menjembatani tradisi cetak fisik elegan bertekstur luhur dengan inovasi digital kontemporer Banua.
          </p>

          {/* Subtab Navigator */}
          <div className="pt-2">
            <div className="grid grid-cols-3 p-1.5 rounded-2xl bg-[#dce5df] border border-[#c1c8c3]/40 shadow-inner w-full sm:w-auto sm:inline-grid gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => setSubTab('kontak')}
                className={`flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1 sm:gap-2 px-2 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all whitespace-normal cursor-pointer ${
                  subTab === 'kontak'
                    ? 'bg-[#0f382c] text-white shadow-md'
                    : 'text-[#414845] hover:text-[#002218] hover:bg-white/50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] shrink-0">pin_drop</span>
                <span className="leading-snug">Kontak & Lokasi Gerai</span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab('portofolio')}
                className={`flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1 sm:gap-2 px-2 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all whitespace-normal cursor-pointer ${
                  subTab === 'portofolio'
                    ? 'bg-[#0f382c] text-white shadow-md'
                    : 'text-[#414845] hover:text-[#002218] hover:bg-white/50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] shrink-0">photo_library</span>
                <span className="leading-snug">Portofolio & Hasil Cetak</span>
                <span className="px-2 py-0.5 rounded-full bg-[#c5a059] text-white text-[9px] sm:text-[10px] shrink-0 whitespace-nowrap">
                  Real Pict
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSubTab('tentang')}
                className={`flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-1 sm:gap-2 px-2 sm:px-5 py-2.5 rounded-xl text-[11px] sm:text-sm font-bold transition-all whitespace-normal cursor-pointer ${
                  subTab === 'tentang'
                    ? 'bg-[#0f382c] text-white shadow-md'
                    : 'text-[#414845] hover:text-[#002218] hover:bg-white/50'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] shrink-0">storefront</span>
                <span className="leading-snug">Tentang Kami & Dedikasi</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SUBTAB 1: KONTAK & LOKASI GERAI */}
      {subTab === 'kontak' && (
        <section className="w-full py-12 px-4 md:px-8 bg-[#f8faf8]">
          <div className="max-w-[1280px] mx-auto space-y-12">
            
            {/* Top Grid: Interactive Map Card + Operating Hours */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* Map & Direction */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#c1c8c3]/40 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#775a19] text-[22px]">map</span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002218]">
                        Peta Lokasi Interaktif Gerai
                      </h3>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#edf6f0] text-xs font-bold text-[#0f382c]">
                      Banjarmasin Tengah
                    </span>
                  </div>
                  
                  <p className="text-xs sm:text-sm text-[#414845]">
                    Akses cepat di jantung pusat niaga kota Banjarmasin, bersebelahan dengan deretan ruko grosir utama Pasar Sudimampir dan dermaga penyeberangan sungai Martapura.
                  </p>

                  {/* Visual Map Frame */}
                  <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-inner bg-gray-100 border border-[#c1c8c3]/40">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBIUG-vVE1AH4XEoaFGRkVHH5agOcJVY5u3VwDeIcheU9z76ZdOxOAMGWSAICR9-zITfFyIOxy3yGoI_xOwvB2o0NmdgHNNRzEVMqj8Mpv2fSS51ylTUcSst-Dtvd3wZpDRhop4Kf8kHfKD-TcvCC_LYMPjMiLncwdeozRN7tryz2GElg5BgYwl_-U71tNjLKCiLme016vp0ZWmTeuIeD6B5biWyYFt1P_8QXFdoUnx')" }}
                    ></div>
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md text-[#002218] text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[16px] text-[#775a19]">pin_drop</span>
                      <span>Jl. Brigjen Katamso No. 22</span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/60">
                      <div className="flex items-start gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-[#0f382c] flex items-center justify-center text-[#ffdea5] shrink-0">
                          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>storefront</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#002218] leading-tight">UD Rez Wan Jaya</h4>
                          <p className="text-[11px] text-[#717975] mt-0.5">Pusat Blangko Undangan & Cetak Banua</p>
                          <p className="text-[11px] text-emerald-800 font-bold mt-1 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block"></span>
                            Buka Sekarang (08.30 – 17.30 WITA)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Landmarks */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-[#414845]">
                    <div className="p-3 bg-[#edf6f0] rounded-xl border border-[#c1c8c3]/40 flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#775a19] text-[18px] mt-0.5 shrink-0">navigation</span>
                      <div>
                        <strong className="text-[#002218] block">Landmark & Patokan:</strong>
                        <span>Dekat Pasar Sudimampir & Dermaga Klotok Sungai Martapura.</span>
                      </div>
                    </div>
                    <div className="p-3 bg-[#edf6f0] rounded-xl border border-[#c1c8c3]/40 flex items-start gap-2">
                      <span className="material-symbols-outlined text-[#775a19] text-[18px] mt-0.5 shrink-0">local_shipping</span>
                      <div>
                        <strong className="text-[#002218] block">Akses Angkutan Muatan:</strong>
                        <span>Sangat leluasa untuk mobil pikap, box L300, dan kurir motor.</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <a
                    href="https://maps.google.com/?q=UD+Rez+Wan+Jaya+Jl+Brigjen+Katamso+No+22+Banjarmasin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0f382c] text-white hover:bg-[#002218] font-bold text-xs sm:text-sm transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">directions</span>
                    <span>Buka Rute Google Maps ↗</span>
                  </a>
                  <a
                    href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya,%20saya%20ingin%20berkunjung%20ke%20toko%20Jl.%20Brigjen%20Katamso%20untuk%20melihat%20sampel%20blangko."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#25D366] text-white hover:bg-[#20ba5a] font-bold text-xs sm:text-sm transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Panduan Rute via WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Operating Info Card */}
              <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#c1c8c3]/40 shadow-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#775a19] block mb-1">
                      Informasi Operasional & Kontak
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002218]">
                      Detail Gerai Fisik
                    </h3>
                  </div>

                  <div className="space-y-3 text-xs text-[#414845]">
                    <div className="p-3.5 bg-[#edf6f0] rounded-2xl space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#775a19] text-[20px] mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                        <div>
                          <strong className="text-[#002218] text-sm block">Alamat Lengkap Toko</strong>
                          <p className="mt-0.5 leading-relaxed text-[#151d1a]">
                            Jl. Brigjen Katamso No. 22, RT. 07, Kel. Kertak Baru Ilir, Kec. Banjarmasin Tengah, Kota Banjarmasin, Kalimantan Selatan 70111.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#edf6f0] rounded-2xl space-y-1">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[#775a19] text-[20px] mt-0.5 shrink-0">schedule</span>
                        <div className="w-full">
                          <strong className="text-[#002218] text-sm block mb-1">Jam Operasional Gerai</strong>
                          <div className="flex justify-between">
                            <span>Senin – Sabtu:</span>
                            <strong className="text-[#002218]">08.30 – 17.30 WITA</strong>
                          </div>
                          <div className="flex justify-between text-red-700 font-semibold pt-1 border-t border-gray-200 mt-1">
                            <span>Minggu:</span>
                            <span>Tutup (Chat WA Tetap Buka)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-[#edf6f0] rounded-2xl space-y-2">
                      <strong className="text-[#002218] text-xs uppercase block">Fasilitas di Toko Fisik:</strong>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-emerald-700">ac_unit</span> Ruang Display AC</span>
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-emerald-700">local_parking</span> Parkir Motor & Mobil</span>
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-emerald-700">warehouse</span> Gudang Ready Stock</span>
                        <span className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-emerald-700">point_of_sale</span> Tunai, QRIS & Transfer</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between bg-[#edf6f0] p-4 rounded-2xl">
                  <div>
                    <span className="text-[11px] text-[#717975] block font-semibold">Hotline WhatsApp Gerai:</span>
                    <strong className="text-base text-[#002218] font-serif">0851-0358-0450</strong>
                    <span className="text-[10px] text-emerald-700 block">Respon &lt; 5 Menit WITA</span>
                  </div>
                  <a
                    href="https://wa.me/6285103580450"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#25D366] text-white rounded-xl text-xs font-bold hover:bg-[#20ba5a] transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Chat Sekarang</span>
                  </a>
                </div>
              </div>

            </div>

            {/* Bottom Grid: Consultation Form + Social Channels */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Form */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#c1c8c3]/40 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#775a19]">
                      Formulir Cepat Konsultasi & Kunjungan
                    </span>
                    <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-semibold">
                      Respon CS 3–5 menit
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#002218]">
                    Konsultasikan Kebutuhan Undangan Anda
                  </h3>
                  <p className="text-xs sm:text-sm text-[#414845] mt-1">
                    Isi data singkat berikut untuk menghubungkan langsung ke staf WhatsApp toko kami dengan draft pesan otomatis.
                  </p>
                </div>

                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#002218] block">
                        Nama Lengkap / Usaha Percetakan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Pak Herman (Grafika Banua)"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-[#edf6f0] text-sm text-[#151d1a] border border-[#c1c8c3]/40 focus:outline-none focus:bg-white focus:border-[#0f382c]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#002218] block">
                        Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="Contoh: 0812-3456-7890"
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-[#edf6f0] text-sm text-[#151d1a] border border-[#c1c8c3]/40 focus:outline-none focus:bg-white focus:border-[#0f382c]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#002218] block">
                      Kategori Layanan yang Dibutuhkan <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formNeed}
                      onChange={(e) => setFormNeed(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#edf6f0] text-sm text-[#151d1a] border border-[#c1c8c3]/40 focus:outline-none focus:bg-white focus:border-[#0f382c] cursor-pointer"
                    >
                      <option value="Kulakan Blangko Reseller / Grosir Percetakan">
                        Kulakan Blangko Reseller / Grosir Percetakan (Mitra)
                      </option>
                      <option value="Cetak Jadi Calon Pengantin (Fisik Siap Sebar)">
                        Cetak Jadi Calon Pengantin (Fisik Siap Sebar)
                      </option>
                      <option value="Undangan Digital Responsive Web (RSVP & Galeri)">
                        Undangan Digital Responsive Web (RSVP & Galeri)
                      </option>
                      <option value="Janji Temu Uji Raba Tekstur Kertas di Gerai Katamso">
                        Janji Temu Uji Raba Tekstur Kertas di Gerai Katamso
                      </option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#002218] block">
                      Catatan Pesan / Jumlah Estimasi & Seri
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Tuliskan perkiraan jumlah eksemplar, seri blangko yang diminati, atau tanggal acara..."
                      value={formNotes}
                      onChange={(e) => setFormNotes(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#edf6f0] text-sm text-[#151d1a] border border-[#c1c8c3]/40 focus:outline-none focus:bg-white focus:border-[#0f382c] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">send</span>
                    <span>Kirim Ringkasan via WhatsApp (1-Klik)</span>
                  </button>
                </form>
              </div>

              {/* Social Channels */}
              <div className="lg:col-span-5 space-y-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#775a19] block mb-1">
                    Kanal Resmi
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002218]">
                    Terhubung di Setiap Waktu
                  </h3>
                  <p className="text-xs sm:text-sm text-[#414845] mt-1">
                    Ikuti update stok kedatangan seri baru, video unboxing blangko, dan panduan setting cetak di kanal media sosial kami.
                  </p>
                </div>

                <div className="space-y-2.5">
                  <a
                    href="https://wa.me/6285103580450"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-2xl border border-[#c1c8c3]/40 shadow-sm flex items-center justify-between group hover:border-[#25D366] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#25D366] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">chat</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#002218] group-hover:text-[#25D366] transition-colors">
                          WhatsApp Hotline
                        </h4>
                        <p className="text-xs text-[#717975]">0851-0358-0450 • Respon Cepat WITA</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#25D366] text-[18px]">
                      arrow_forward
                    </span>
                  </a>

                  <a
                    href="https://instagram.com/ud_rezwan_jaya"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-2xl border border-[#c1c8c3]/40 shadow-sm flex items-center justify-between group hover:border-[#c5a059] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#775a19] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">photo_camera</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#002218] group-hover:text-[#775a19] transition-colors">
                          Instagram Resmi
                        </h4>
                        <p className="text-xs text-[#717975]">@ud_rezwan_jaya • Katalog & Video Unboxing</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#775a19] text-[18px]">
                      arrow_forward
                    </span>
                  </a>

                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white p-4 rounded-2xl border border-[#c1c8c3]/40 shadow-sm flex items-center justify-between group hover:border-[#0f382c] transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0f382c] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">public</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#002218] group-hover:text-[#0f382c] transition-colors">
                          Facebook Fanpage
                        </h4>
                        <p className="text-xs text-[#717975]">UD Rez Wan Jaya Banjarmasin</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-[#0f382c] text-[18px]">
                      arrow_forward
                    </span>
                  </a>

                  <a
                    href="mailto:udrezwanjaya@gmail.com"
                    className="bg-white p-4 rounded-2xl border border-[#c1c8c3]/40 shadow-sm flex items-center justify-between group hover:border-gray-500 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#414845] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[22px]">mail</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#002218] transition-colors">
                          Surel Korespondensi
                        </h4>
                        <p className="text-xs text-[#717975]">udrezwanjaya@gmail.com</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 text-[18px]">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </section>
      )}

      {/* 3. SUBTAB 2: PORTOFOLIO & HASIL CETAK */}
      {subTab === 'portofolio' && (
        <section className="w-full py-12 px-4 md:px-8 bg-[#f8faf8]">
          <div className="max-w-[1280px] mx-auto space-y-8">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-gray-200">
              <div>
                <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider block mb-1">
                  Koleksi Realisasi Klien & Mitra Cetak
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#002218]">
                  Kurasi Portofolio Undangan Fisik & Digital Banua
                </h2>
                <p className="text-sm text-[#414845] mt-1">
                  Klik karya untuk memeriksa spesifikasi gramatur kertas, hotprint emas, dan sistem pengiriman kargo.
                </p>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                <button
                  onClick={() => setPortfolioCategory('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    portfolioCategory === 'all'
                      ? 'bg-[#0f382c] text-white shadow-sm'
                      : 'bg-white text-[#414845] border border-[#c1c8c3]/40'
                  }`}
                >
                  Semua ({PORTFOLIO_ITEMS.length})
                </button>
                <button
                  onClick={() => setPortfolioCategory('foil-hardcover')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    portfolioCategory === 'foil-hardcover'
                      ? 'bg-[#0f382c] text-white shadow-sm'
                      : 'bg-white text-[#414845] border border-[#c1c8c3]/40'
                  }`}
                >
                  Hardcover Foil 3D
                </button>
                <button
                  onClick={() => setPortfolioCategory('softcover')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    portfolioCategory === 'softcover'
                      ? 'bg-[#0f382c] text-white shadow-sm'
                      : 'bg-white text-[#414845] border border-[#c1c8c3]/40'
                  }`}
                >
                  Blangko Softcover
                </button>
                <button
                  onClick={() => setPortfolioCategory('digital')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    portfolioCategory === 'digital'
                      ? 'bg-[#0f382c] text-white shadow-sm'
                      : 'bg-white text-[#414845] border border-[#c1c8c3]/40'
                  }`}
                >
                  Web Digital
                </button>
                <button
                  onClick={() => setPortfolioCategory('kemasan-grosir')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                    portfolioCategory === 'kemasan-grosir'
                      ? 'bg-[#0f382c] text-white shadow-sm'
                      : 'bg-white text-[#414845] border border-[#c1c8c3]/40'
                  }`}
                >
                  Kemasan Grosir QC
                </button>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredPortfolio.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenPortfolioModal(item)}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#c1c8c3]/40 flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    <div className="relative h-60 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0f382c]/90 text-white text-[10px] font-bold uppercase backdrop-blur-md">
                        {item.categoryLabel}
                      </span>
                      <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-[#002218] text-[10px] font-bold flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                        <span>Klik Spek</span>
                      </span>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-[#775a19]">
                        <span>{item.client}</span>
                        <span className="text-[#717975]">{item.location}</span>
                      </div>
                      <h3 className="font-serif font-bold text-base text-[#002218] group-hover:text-[#775a19] transition-colors leading-snug">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#414845] line-clamp-2 leading-relaxed">
                        {item.spec}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-gray-100 mt-2 flex items-center justify-between text-xs text-[#717975]">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-[#775a19]">inventory</span>
                      <span>{item.quantity}</span>
                    </span>
                    <span className="text-[#0f382c] font-bold group-hover:underline">
                      Rincian ↗
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* 4. SUBTAB 3: TENTANG KAMI & DEDIKASI */}
      {subTab === 'tentang' && (
        <section className="w-full py-12 px-4 md:px-8 bg-[#f8faf8]">
          <div className="max-w-[1280px] mx-auto space-y-12">
            
            {/* Storytelling Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#c1c8c3]/40 shadow-sm relative overflow-hidden">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#edf6f0] text-[#0f382c] text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-[16px]">military_tech</span>
                  <span>Dedikasi 1 Dekade di Pasar Niaga Banjarmasin</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#002218] leading-tight">
                  Memangkas Rantai Pasok, Memberdayakan Percetakan Lokal Banua Sejak 2015
                </h2>
                <p className="text-sm sm:text-base text-[#414845] leading-relaxed">
                  Berdiri sejak 2015 di kawasan niaga sentral Jl. Brigjen Katamso No. 22 Banjarmasin, kami hadir dengan satu tekad nyata: menghapuskan hambatan tunggu ekspedisi kapal 5-10 hari dari Jawa bagi pengusaha percetakan lokal di Kalimantan Selatan dan Kalimantan Tengah.
                </p>
                <p className="text-sm sm:text-base text-[#414845] leading-relaxed">
                  Dengan stok siap kirim puluhan ribu lembar blangko dari 10+ pabrikan besar nasional dan integrasi teknologi website undangan digital interaktif terkini, kami memastikan setiap pesanan terselesaikan dengan hasil cetak terbaik dan tepat waktu.
                </p>
              </div>
            </div>

            {/* 4 Core Commitments */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#c1c8c3]/40 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#0f382c] text-[#ffdea5] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#002218]">
                  Sentra Kulakan Terbesar
                </h3>
                <p className="text-xs text-[#414845] leading-relaxed">
                  500+ seri terpopuler selalu ready stock ribuan pack tanpa harus menunggu ekspedisi kargo pulau Jawa.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#c1c8c3]/40 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#0f382c] text-[#ffdea5] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">touch_app</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#002218]">
                  Uji Raba Kertas di Toko
                </h3>
                <p className="text-xs text-[#414845] leading-relaxed">
                  Bebas memeriksa gramatur Jasmine 220gsm glitter, Brief Card, dan foil 3D sebelum memesan massal.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#c1c8c3]/40 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#0f382c] text-[#ffdea5] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">shield</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#002218]">
                  Gudang Ber-QC Anti-Lembap
                </h3>
                <p className="text-xs text-[#414845] leading-relaxed">
                  Palet kayu tebal berventilasi dan bungkusan OPP rapat menjaga kertas tetap kering di iklim sungai Kalimantan.
                </p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#c1c8c3]/40 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-[#0f382c] text-[#ffdea5] flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-[24px]">support_agent</span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#002218]">
                  Dukungan Penuh Mitra Cetak
                </h3>
                <p className="text-xs text-[#414845] leading-relaxed">
                  Gratis master template CorelDraw (.CDR) presisi font dan garansi tukar lembar rusak tanpa biaya tambahan.
                </p>
              </div>

            </div>

            {/* Key Milestones Metrics */}
            <div className="bg-[#edf6f0] p-8 rounded-3xl border border-[#c1c8c3]/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#c1c8c3]/40">
                <div>
                  <span className="text-xs font-bold text-[#775a19] uppercase tracking-wider block">
                    Capaian Nyata & Rekam Jejak
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#002218]">
                    Dampak Pertumbuhan Ekosistem Percetakan Banua
                  </h3>
                </div>
                <span className="text-xs font-bold text-[#0f382c] bg-white px-3 py-1 rounded-full border border-[#c1c8c3]/40">
                  Periode 2015 – 2025
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#c1c8c3]/30">
                  <span className="font-serif text-3xl font-bold text-[#002218] block">9+ Tahun</span>
                  <span className="text-xs font-bold text-[#775a19] block mt-1">Pengalaman Industri</span>
                  <p className="text-[11px] text-[#717975] mt-1">Dedikasi konsisten di pasar percetakan Banjarmasin.</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#c1c8c3]/30">
                  <span className="font-serif text-3xl font-bold text-[#775a19] block">500+ Seri</span>
                  <span className="text-xs font-bold text-[#002218] block mt-1">Ready Stock di Toko</span>
                  <p className="text-[11px] text-[#717975] mt-1">Mulai seri ekonomis hingga hardcover foil mutiara.</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#c1c8c3]/30">
                  <span className="font-serif text-3xl font-bold text-[#002218] block">1.200+</span>
                  <span className="text-xs font-bold text-[#775a19] block mt-1">Mitra Aktif Percetakan</span>
                  <p className="text-[11px] text-[#717975] mt-1">Pelaku sablon, fotokopi, & agen di Kalselteng.</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#c1c8c3]/30">
                  <span className="font-serif text-3xl font-bold text-[#775a19] block">15.000+</span>
                  <span className="text-xs font-bold text-[#002218] block mt-1">Pasangan Berbahagia</span>
                  <p className="text-[11px] text-[#717975] mt-1">Undangan pernikahan terselenggara berkesan.</p>
                </div>
              </div>
            </div>

          </div>
        </section>
      )}

    </div>
  );
};
