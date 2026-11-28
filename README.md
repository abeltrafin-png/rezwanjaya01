# UD Rez Wan Jaya Banjarmasin

Aplikasi web resmi **UD Rez Wan Jaya Banjarmasin** — Pusat Grosir Blangko Undangan & Spesialis Undangan Pernikahan Digital Interaktif di Kalimantan Selatan (Banjarmasin, Banjarbaru, Martapura, dan sekitarnya).

## Fitur Utama

- **Beranda (`HomeView`)**: Pencarian cepat seri/kode blangko maupun tema digital, etalase unggulan, mitra pabrikan blangko, serta alur pemesanan grosir & cetak jadi.
- **Katalog Lengkap (`CatalogView`)**:
  - **Undangan Fisik & Blangko Kosong**: Sinkronisasi data katalog dari Google Apps Script dengan cache `localStorage` dan fallback data lokal. Dilengkapi filter segmen harga (*Super Hemat*, *Ekonomis*, *Menengah*, *Premium*), seri blangko, warna dominan/sekunder, jenis lipatan, orientasi, amplop, pencarian teks, pengurutan, serta 3 mode tampilan (Grid 4 Kolom, Grid Compact 6 Kolom, dan Tabel Data).
  - **Web Undangan Digital Interaktif**: Galeri koleksi tema website undangan lengkap dengan simulator pratinjau smartphone interaktif (`DigitalDemoModal`).
- **Harga & Paket (`PricingView`)**: Matriks harga grosir kulakan blangko, paket cetak jadi siap sebar, paket undangan digital, FAQ, serta kalkulator estimasi biaya interaktif yang terhubung langsung ke WhatsApp.
- **Perusahaan & Kontak (`CompanyView`)**: Informasi lokasi gerai fisik (Jl. Brigjen Katamso No. 22, Banjarmasin Tengah), jam operasional, formulir konsultasi cepat ke WhatsApp, kurasi portofolio hasil cetak & web digital (`PortfolioModal`), serta profil perusahaan.
- **Akses Cepat WhatsApp**: Tombol *Floating WhatsApp* dan tautan pemesanan otomatis di setiap detail spesifikasi produk (`SpecModal`).

## Teknologi yang Digunakan

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Ikon & Animasi**: Material Symbols Outlined, Lucide React, Motion

## Struktur Direktori

```text
├── index.html                  # Entry HTML, metadata SEO/OpenGraph, Google Fonts & Material Symbols
├── metadata.json               # Metadata aplikasi AI Studio
├── package.json                # Daftar dependensi dan skrip NPM
├── vite.config.ts              # Konfigurasi Vite & Tailwind CSS
└── src/
    ├── App.tsx                 # Root aplikasi, navigasi tab & manajemen modal
    ├── main.tsx                # Entry point React
    ├── index.css               # Konfigurasi tema & utilitas CSS global
    ├── types.ts                # Definisi tipe TypeScript utama
    ├── components/             # Komponen UI reusable (Navbar, Footer, Modal, Grid, Tabel, Filter)
    ├── data/                   # Data katalog awal, produk blangko, tema digital, dan matriks harga
    ├── hooks/                  # Custom React hooks (useDraggableScroll)
    ├── services/               # Layanan pengambilan data katalog
    ├── types/                  # Tipe tambahan untuk katalog undangan
    ├── utils/                  # Utilitas pembantu (imageFallback)
    └── views/                  # Halaman utama (HomeView, CatalogView, PricingView, CompanyView)
```

## Menjalankan Proyek Secara Lokal

Pastikan Node.js telah terpasang di sistem Anda.

1. **Instalasi dependensi**
   ```bash
   npm install
   ```

2. **Konfigurasi environment (opsional)**
   Salin `.env.example` menjadi `.env` apabila dibutuhkan untuk variabel lingkungan lokal:
   ```bash
   cp .env.example .env
   ```

3. **Jalankan server pengembangan**
   ```bash
   npm run dev
   ```
   Aplikasi berjalan secara default di `http://localhost:3000`.

4. **Pengecekan tipe TypeScript & Build produksi**
   ```bash
   npm run lint
   npm run build
   ```

5. **Pratinjau hasil build produksi**
   ```bash
   npm run preview
   ```

## Informasi Gerai

- **Alamat**: Jl. Brigjen Katamso No. 22, RT. 07, Kel. Kertak Baru Ilir, Kec. Banjarmasin Tengah, Kota Banjarmasin, Kalimantan Selatan 70111
- **Jam Operasional**: Senin – Sabtu, 08.30 – 17.30 WITA
- **WhatsApp**: `0851-0358-0450`
