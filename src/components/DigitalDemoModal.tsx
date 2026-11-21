import React, { useState, useEffect } from 'react';
import { DigitalTheme } from '../types';

interface DigitalDemoModalProps {
  theme: DigitalTheme | null;
  onClose: () => void;
}

export const DigitalDemoModal: React.FC<DigitalDemoModalProps> = ({ theme, onClose }) => {
  const [isCoverOpen, setIsCoverOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [rsvpStatus, setRsvpStatus] = useState<'hadir' | 'ragu' | null>(null);
  const [guestName, setGuestName] = useState('Bapak H. Ahmad & Keluarga');

  useEffect(() => {
    setIsCoverOpen(false);
    setRsvpStatus(null);
    setIsMusicPlaying(true);
  }, [theme]);

  useEffect(() => {
    if (!theme) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [theme, onClose]);

  if (!theme) return null;

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Live Simulator Tema ${theme.name}`}
      className="fixed inset-0 z-50 bg-[#002218]/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-[#c5a059]/30 overflow-hidden grid grid-cols-1 md:grid-cols-12 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Smartphone Simulator */}
        <div className="md:col-span-5 bg-[#edf6f0] p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-[#c1c8c3]/40">
          <div className="w-full max-w-[280px] aspect-[9/18] rounded-[34px] bg-[#1a202c] p-2.5 shadow-2xl border-4 border-gray-800 relative flex flex-col overflow-hidden">
            {/* Notch */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-black rounded-full z-30"></div>

            {/* Screen */}
            <div className="relative w-full h-full rounded-[26px] overflow-hidden bg-[#002218] text-white flex flex-col">
              <img
                src={theme.image}
                alt={theme.name}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover opacity-55"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#002218] via-[#002218]/65 to-[#002218]/40"></div>

              {/* Top Audio Bar */}
              <div className="relative z-20 flex items-center justify-between px-4 pt-6 pb-2 text-[10px]">
                <span className="font-semibold text-[#ffdea5]">{theme.code}</span>
                <button
                  type="button"
                  onClick={() => setIsMusicPlaying(!isMusicPlaying)}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/45 text-[#ffdea5] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {isMusicPlaying ? 'volume_up' : 'volume_off'}
                  </span>
                  <span>{isMusicPlaying ? 'Musik Aktif' : 'Diam'}</span>
                </button>
              </div>

              {!isCoverOpen ? (
                <div className="relative z-20 flex-1 flex flex-col items-center justify-end text-center p-5 pb-8 space-y-3">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#ffdea5] font-bold">
                    The Wedding Of
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-white leading-tight">
                    {theme.demoNames}
                  </h4>
                  <p className="text-[11px] text-[#c1ecda]">
                    {theme.demoDate}
                    <br />
                    {theme.location}
                  </p>
                  <div className="w-full p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-[10px] space-y-1">
                    <span className="text-[#ffdea5] block">Kepada Yth:</span>
                    <strong className="text-white block truncate">{guestName}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCoverOpen(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#c5a059] hover:bg-[#d4af37] text-[#002218] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">mail</span>
                    <span>Buka Undangan</span>
                  </button>
                </div>
              ) : (
                <div className="relative z-20 flex-1 overflow-y-auto p-4 space-y-3 text-center">
                  <span className="text-[10px] uppercase tracking-widest text-[#ffdea5] font-bold block">
                    Assalamu&apos;alaikum Wr. Wb.
                  </span>
                  <h4 className="font-serif text-xl font-bold">{theme.demoNames}</h4>
                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-[11px] space-y-1 text-left">
                    <div className="font-bold text-[#ffdea5]">Resepsi & Akad Nikah</div>
                    <div className="text-[#c1ecda]">{theme.demoDate}</div>
                    <div className="text-white/90">{theme.location}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-[11px] space-y-2 text-left">
                    <div className="font-bold text-[#ffdea5]">Simulasi RSVP Tamu</div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setRsvpStatus('hadir')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                          rsvpStatus === 'hadir' ? 'bg-[#25D366] text-white' : 'bg-white/15 text-white'
                        }`}
                      >
                        InsyaAllah Hadir
                      </button>
                      <button
                        type="button"
                        onClick={() => setRsvpStatus('ragu')}
                        className={`py-1.5 rounded-lg text-[10px] font-bold cursor-pointer ${
                          rsvpStatus === 'ragu' ? 'bg-[#c5a059] text-[#002218]' : 'bg-white/15 text-white'
                        }`}
                      >
                        Masih Ragu
                      </button>
                    </div>
                    {rsvpStatus && (
                      <p className="text-[10px] text-[#c1ecda]">
                        Konfirmasi simulasi tersimpan untuk {guestName}.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsCoverOpen(false)}
                    className="text-[10px] text-[#ffdea5] underline cursor-pointer"
                  >
                    Kembali ke Cover Depan
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Theme Details & Order Actions */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#775a19]">
                  {theme.code} · Live Theme Simulator
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#002218] mt-0.5">
                  {theme.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Tutup simulator"
                className="w-9 h-9 rounded-full bg-[#edf6f0] hover:bg-[#dce5df] text-[#002218] flex items-center justify-center cursor-pointer transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-sm text-[#414845] leading-relaxed">{theme.description}</p>

            {/* Test Custom Guest Name */}
            <div className="space-y-1">
              <label htmlFor="demo-guest-name" className="text-xs font-bold text-[#002218] block">
                Uji Coba Nama Tamu di Cover:
              </label>
              <input
                id="demo-guest-name"
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#edf6f0] border border-[#c1c8c3]/50 text-xs text-[#002218] focus:outline-none focus:bg-white"
              />
            </div>

            <div className="text-xs text-[#414845] flex items-center gap-2 bg-[#f8faf8] p-3 rounded-xl border border-[#c1c8c3]/40">
              <span className="material-symbols-outlined text-[18px] text-[#775a19]">music_note</span>
              <span>Musik Latar: <strong className="text-[#002218]">{theme.musicTitle}</strong></span>
            </div>

            {/* Features */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#414845]">
              {theme.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-700 shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pricing & CTA */}
          <div className="space-y-3 pt-4 border-t border-[#e5ebe7]">
            <div className="flex items-center justify-between bg-[#edf6f0] p-3.5 rounded-2xl">
              <div>
                <span className="text-[11px] text-[#717975] line-through block tabular-nums">
                  {formatRupiah(theme.originalPrice)}
                </span>
                <strong className="font-serif text-xl text-[#002218] tabular-nums">
                  {formatRupiah(theme.promoPrice)}
                </strong>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-[#717975] block">Bundling Cetak Fisik:</span>
                <strong className="font-serif text-base text-emerald-800 tabular-nums">
                  {formatRupiah(theme.bundlePrice)}
                </strong>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <a
                href={`https://wa.me/6285103580450?text=${encodeURIComponent(`Halo UD Rez Wan Jaya, saya ingin memesan website undangan tema ${theme.name} (${theme.code}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>Pesan Tema Ini via WA</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="py-3 px-5 rounded-xl bg-[#edf6f0] hover:bg-[#dce5df] text-[#002218] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
