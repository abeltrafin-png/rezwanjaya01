import React, { useState } from 'react';
import { BlangkoProduct } from '../types';

interface SpecModalProps {
  product: BlangkoProduct | null;
  onClose: () => void;
}

export const SpecModal: React.FC<SpecModalProps> = ({ product, onClose }) => {
  const [orderQty, setOrderQty] = useState(100);

  if (!product) return null;

  const unitPrice = orderQty >= 500 ? product.priceWholesale : product.priceRetail;
  const estimatedTotal = orderQty * unitPrice;

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const generateWaLink = () => {
    const text = `Halo UD Rez Wan Jaya, saya ingin menanyakan ketersediaan & memesan blangko:\n\n` +
      `• Kode Seri: ${product.code} (${product.title})\n` +
      `• Bahan: ${product.material}\n` +
      `• Estimasi Kuantiti: ${orderQty} lembar\n` +
      `• Estimasi Biaya: ${formatRupiah(estimatedTotal)} (${formatRupiah(unitPrice)}/lbr)\n\n` +
      `Mohon info stok di gerai Katamso dan estimasi pengiriman. Terima kasih!`;
    return `https://wa.me/6285103580450?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#002218]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#c5a059]/30 overflow-hidden relative my-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Bar */}
        <div className="bg-[#0f382c] text-white p-6 flex items-center justify-between border-b border-[#c5a059]/30">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#c5a059] text-white text-[11px] font-bold uppercase tracking-wider">
                {product.code}
              </span>
              <span className="text-xs text-[#c1ecda]">Spesifikasi Teknis & Estimasi Grosir</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold mt-1 text-[#ffdea5]">
              {product.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Main Visual & Key Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-5 relative rounded-2xl overflow-hidden aspect-[4/5] bg-gray-100 shadow-md border border-gray-200">
              <img
                src={product.image}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold text-center">
                Foto Real Pict Gerai Katamso
              </span>
            </div>

            <div className="sm:col-span-7 space-y-3">
              <p className="text-sm text-[#414845] leading-relaxed">
                {product.description}
              </p>

              {/* Specification Grid */}
              <div className="bg-[#edf6f0] p-3.5 rounded-xl border border-[#c1c8c3]/40 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#717975]">Pabrikan Brand:</span>
                  <strong className="text-[#002218]">{product.brand} Collection</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717975]">Material Kertas:</span>
                  <strong className="text-[#002218]">{product.material}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717975]">Ukuran Terlipat:</span>
                  <strong className="text-[#002218]">{product.dimensions}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717975]">Tipe Lipatan:</span>
                  <strong className="text-[#002218]">{product.folds}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717975]">Finishing Foil:</span>
                  <strong className="text-[#775a19]">{product.foil}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717975]">Status Gudang:</span>
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {product.stockText}
                  </span>
                </div>
              </div>

              {/* Bonus Perks */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#775a19] uppercase tracking-wider block">
                  Keuntungan Pembelian:
                </span>
                <ul className="grid grid-cols-1 gap-1 text-xs text-[#414845]">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-emerald-600 text-[16px]">check_circle</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Real-time Order Quantity Simulator */}
          <div className="p-4 rounded-2xl bg-[#f3fbf6] border border-[#c5a059]/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-[#002218] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#775a19] text-[18px]">calculate</span>
                Simulasi Kuantiti & Harga Pesanan:
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                {orderQty >= 500 ? 'Harga Tier Grosir' : 'Harga Eceran'}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={orderQty}
                onChange={(e) => setOrderQty(Number(e.target.value))}
                className="w-full accent-[#0f382c] cursor-pointer"
              />
              <span className="font-serif font-bold text-lg text-[#002218] shrink-0 min-w-20 text-right tabular-nums">
                {orderQty} pcs
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#c1c8c3]/40 text-xs">
              <div>
                <span className="text-[#717975]">Harga Satuan: </span>
                <strong className="text-sm text-[#002218] tabular-nums">{formatRupiah(unitPrice)}/lbr</strong>
                {orderQty < 500 && (
                  <span className="text-[11px] text-amber-800 ml-1.5 block sm:inline">
                    (Ambil 500+ pcs hemat {formatRupiah(product.priceRetail - product.priceWholesale)}/lbr)
                  </span>
                )}
              </div>
              <div className="sm:text-right">
                <span className="text-[#717975]">Estimasi Total: </span>
                <span className="text-base font-bold text-emerald-900 font-serif tabular-nums">
                  {formatRupiah(estimatedTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={generateWaLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 px-6 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">chat</span>
              <span>Pesan Seri Ini via WhatsApp</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-xl bg-[#e7f0eb] hover:bg-[#dce5df] text-[#002218] font-bold text-sm transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
