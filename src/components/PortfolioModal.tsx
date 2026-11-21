import React, { useEffect } from 'react';
import { PortfolioItem } from '../types';

interface PortfolioModalProps {
  item: PortfolioItem | null;
  onClose: () => void;
}

export const PortfolioModal: React.FC<PortfolioModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    if (!item) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Detail Portofolio ${item.title}`}
      className="fixed inset-0 z-50 bg-[#002218]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#c5a059]/30 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0f382c] text-white p-6 flex items-start justify-between gap-4 border-b border-[#c5a059]/30">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#ffdea5] block">
              {item.categoryLabel} · {item.badge}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-white">
              {item.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail portofolio"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-[#edf6f0] border border-[#c1c8c3]/40">
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#edf6f0]">
              <span className="text-[#717975] block">Klien & Lokasi</span>
              <strong className="text-[#002218] block mt-0.5">{item.client}</strong>
              <span className="text-[#775a19]">{item.location}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#edf6f0]">
              <span className="text-[#717975] block">Kuantiti Realisasi</span>
              <strong className="text-[#002218] block mt-0.5">{item.quantity}</strong>
            </div>
            <div className="p-3 rounded-xl bg-[#edf6f0]">
              <span className="text-[#717975] block">Durasi Pengerjaan</span>
              <strong className="text-[#002218] block mt-0.5">{item.duration}</strong>
            </div>
          </div>

          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#775a19]">
              Spesifikasi Produksi
            </h4>
            <p className="text-sm text-[#414845] leading-relaxed">{item.spec}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={`https://wa.me/6285103580450?text=${encodeURIComponent(`Halo UD Rez Wan Jaya, saya ingin memesan undangan serupa portofolio "${item.title}" (${item.quantity}).`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>Pesan Model Serupa via WA</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-xl bg-[#edf6f0] hover:bg-[#dce5df] text-[#002218] font-bold text-sm transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
