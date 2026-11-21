import React from 'react';
import { TabRoute } from '../types';

interface FooterProps {
  setCurrentTab: (tab: TabRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const handleNavigate = (tab: TabRoute) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#002218] text-white border-t border-[#c5a059]/30">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-3">
          <h2 className="font-serif text-2xl font-bold text-[#ffdea5]">
            UD Rez Wan Jaya Banjarmasin
          </h2>
          <p className="text-xs sm:text-sm text-[#c1ecda] leading-relaxed max-w-md">
            Pusat grosir blangko undangan fisik siap cetak dan layanan website undangan pernikahan digital interaktif di Kalimantan Selatan sejak 2015.
          </p>
          <p className="text-xs text-[#dce5df]">
            Jl. Brigjen Katamso No. 22, Kel. Kertak Baru Ilir, Banjarmasin Tengah, Kalimantan Selatan 70111
          </p>
        </div>

        {/* Navigation Column */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffdea5]">
            Navigasi Cepat
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-[#c1ecda]">
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('beranda')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Beranda Utama
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('katalog')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Katalog Blangko & Digital
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('harga')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Daftar Harga & Kalkulator
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNavigate('perusahaan')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Profil Gerai & Portofolio
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="md:col-span-4 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#ffdea5]">
            Layanan & Jam Operasional
          </h3>
          <div className="space-y-1.5 text-xs sm:text-sm text-[#c1ecda]">
            <p>Senin – Sabtu: 08.30 – 17.30 WITA</p>
            <p>WhatsApp Hotline: 0851-0358-0450</p>
            <p>Email: udrezwanjaya@gmail.com</p>
          </div>
          <div className="pt-2">
            <a
              href="https://wa.me/6285103580450?text=Halo%20UD%20Rez%20Wan%20Jaya%20Banjarmasin,%20saya%20ingin%20bertanya%20mengenai%20blangko%20undangan."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chat</span>
              <span>Chat Admin Katamso</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Legal Line */}
      <div className="border-t border-white/10 py-4 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#c1ecda]/80">
          <span>© {new Date().getFullYear()} UD Rez Wan Jaya Banjarmasin. Hak Cipta Dilindungi.</span>
          <span>Grosir Blangko & Undangan Digital Kalimantan Selatan</span>
        </div>
      </div>
    </footer>
  );
};
