import React, { useState } from 'react';

export const FloatingWhatsApp: React.FC = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip Card */}
      <div
        className={`hidden md:flex flex-col items-end mr-3 bg-white px-4 py-2.5 rounded-2xl shadow-xl border border-[#c1c8c3]/40 transition-all duration-300 pointer-events-none ${
          hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}
      >
        <span className="text-xs font-bold text-[#002218]">
          Tanya CS Gerai Katamso
        </span>
        <span className="text-[11px] text-[#25D366] font-semibold flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
          Online • Balas &lt; 5 Menit WITA
        </span>
      </div>

      {/* Floating Action Button */}
      <a
        href="https://wa.me/6285103580450?text=Halo%20Admin%20UD%20Rez%20Wan%20Jaya,%20saya%20ingin%20tanya%20stok%20blangko%20dan%20undangan%20digital"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat WhatsApp UD Rez Wan Jaya Banjarmasin"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.4)] hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all cursor-pointer"
      >
        {/* Pulsing Beacon Ring */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-40 animate-ping"></span>
        <span className="material-symbols-outlined text-[32px] relative z-10">chat</span>

        {/* Mini Unread Count Badge */}
        <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white font-bold text-[10px] flex items-center justify-center shadow-md border-2 border-white">
          1
        </span>
      </a>
    </div>
  );
};
