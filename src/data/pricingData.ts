export interface WholesaleRow {
  category: string;
  brands: string;
  retail: string; // < 1 pak
  tier1: string;  // 1-4 pak (100-400)
  tier2: string;  // 5-9 pak (500-900)
  tierMax: string; // 1 dus / 1000+ pcs
  bonus: string;
}

export const WHOLESALE_MATRIX: WholesaleRow[] = [
  {
    category: 'Seri Ekonomis',
    brands: 'HEPI, Rizki, Byar, Falah',
    retail: 'Rp 650/lbr',
    tier1: 'Rp 550/lbr',
    tier2: 'Rp 500/lbr',
    tierMax: 'Rp 460/lbr',
    bonus: 'Master CDR Presisi + Font Pack'
  },
  {
    category: 'Seri Standar Medium',
    brands: 'Jago, Cantik, Salma, Mentari',
    retail: 'Rp 750/lbr',
    tier1: 'Rp 650/lbr',
    tier2: 'Rp 600/lbr',
    tierMax: 'Rp 540/lbr',
    bonus: 'Master CDR + Buku Album Sampel'
  },
  {
    category: 'Seri Premium Jasmine & Foil',
    brands: 'Avis, Beliya, Maliq, Amplop Foil',
    retail: 'Rp 950/lbr',
    tier1: 'Rp 850/lbr',
    tier2: 'Rp 780/lbr',
    tierMax: 'Rp 720/lbr',
    bonus: 'Master CDR + Mockup HD 3D'
  },
  {
    category: 'Seri Hardcover / Board Tebal',
    brands: 'Royal Board, Samara, Lintang Lux',
    retail: 'Rp 2.800/lbr',
    tier1: 'Rp 2.450/lbr',
    tier2: 'Rp 2.200/lbr',
    tierMax: 'Rp 1.950/lbr',
    bonus: 'Pola Pisau Pond & File CDR Siap Naik'
  }
];

export interface FaqItem {
  question: string;
  answer: string;
  icon: string;
}

export const FAQS: FaqItem[] = [
  {
    question: 'Apakah percetakan luar kota Banjarmasin bisa order kirim?',
    answer: 'Bisa banget! Kami secara rutin melayani pengiriman kargo dan travel darat & sungai ke seluruh penjuru Kalimantan Selatan (Banjarbaru, Martapura, Pelaihari, Rantau, Kandangan, Barabai, Amuntai, Tanjung, Batulicin, Kotabaru) serta Kalimantan Tengah (Kapuas, Palangkaraya, Pulang Pisau, Kasongan, Sampit). Ekspedisi via Travel L300, truk kargo darat, bus antarkota, maupun klotok dermaga sungai.',
    icon: 'local_shipping'
  },
  {
    question: 'Berapa lama proses pengerjaan undangan paket cetak jadi siap sebar?',
    answer: 'Untuk paket cetak siap sebar (Paket 300, 500, atau 1.000 Pcs), estimasi rata-rata pengerjaan adalah 3 hingga 5 hari kerja terhitung sejak draf tata letak dan teks disetujui (ACC Fix) oleh calon mempelai. Kami juga menyediakan opsi pengerjaan kilat ekspres jika hari bahagia sudah sangat dekat.',
    icon: 'timer'
  },
  {
    question: 'Apakah pembelian blangko kosongan ada syarat minimal order kartonan?',
    answer: 'Tidak ada syarat wajib beli kartonan untuk memulai. Anda bisa membeli secara eceran per pak (isi 100 lembar) untuk memenuhi pesanan dadakan atau kebutuhan kecil. Mitra percetakan yang mengambil mulai 5 pak atau 1 karton (isi 1.000+ lembar) akan otomatis mendapatkan potongan harga grosir tier pabrik terendah.',
    icon: 'shopping_bag'
  },
  {
    question: 'Bagaimana cara mendapatkan file template setting CorelDraw (.CDR) untuk mitra?',
    answer: 'Setiap pembelian blangko di toko fisik atau via WhatsApp, tim kami membagikan tautan unduh (Google Drive) berisi master template file CorelDraw versi X7/X8/2020 lengkap dengan font kaligrafi dan ornamen yang telah disesuaikan 1:1 dengan lekukan garis pond masing-masing tipe blangko.',
    icon: 'palette'
  },
  {
    question: 'Bagaimana jika ditemukan lembar blangko yang cacat atau robek?',
    answer: 'Kami memberikan jaminan garansi retur 1-to-1 pabrik. Cukup bawa atau fotokan lembar yang cacat (foil rontok, potongan miring pabrik, robek kemasan), maka kami gantikan lembar baru secara langsung di gerai Jl. Brigjen Katamso No. 22 tanpa birokrasi rumit.',
    icon: 'verified_user'
  }
];

export interface PricingPackage {
  id: string;
  title: string;
  subtitle: string;
  minQty: number;
  unitPrice: number;
  totalPrice: number;
  badge?: string;
  isPopular?: boolean;
  benefits: string[];
}

export const READY_PACKAGES: PricingPackage[] = [
  {
    id: 'pkg-300',
    title: 'Paket 300 Pcs',
    subtitle: 'Akad & Resepsi Intim Keluarga',
    minQty: 300,
    unitPrice: 1500,
    totalPrice: 450000,
    benefits: [
      'Gratis Plastik OPP seal lem per lembar',
      'Gratis Label Stiker Nama Tamu terprint rapi',
      'Gratis Setting Desain & Revisi sampai ACC',
      'Gratis Barcode Lokasi / QR Code Google Maps',
      'Kupon Diskon Web Undangan Digital (Klaim Rp 49.000)'
    ]
  },
  {
    id: 'pkg-500',
    title: 'Paket 500 Pcs',
    subtitle: 'Best Value — Paling Banyak Dipesan',
    minQty: 500,
    unitPrice: 1200,
    totalPrice: 600000,
    badge: 'BEST VALUE (FAVORIT)',
    isPopular: true,
    benefits: [
      'Gratis Plastik OPP seal lem per lembar',
      'Gratis Label Stiker Nama Tamu terprint rapi',
      'Gratis Setting Desain & Revisi sepuasnya',
      'Gratis Barcode Lokasi / QR Code Google Maps',
      'Gratis 2 Buah Buku Tamu Fisik (Guest Book) eksklusif',
      'Klaim Tambah Web Undangan Digital Rp 49.000 saja'
    ]
  },
  {
    id: 'pkg-1000',
    title: 'Paket 1.000 Pcs',
    subtitle: 'Mega Hemat Maksimal Resepsi Akbar',
    minQty: 1000,
    unitPrice: 950,
    totalPrice: 950000,
    badge: 'MEGA HEMAT MAKSIMAL',
    benefits: [
      'Gratis Plastik OPP seal lem per lembar',
      'Gratis Label Stiker Nama Tamu terprint rapi',
      'Gratis Setting Desain & Revisi sepuasnya',
      'Gratis Barcode Lokasi / QR Code Google Maps',
      'GRATIS Website Undangan Digital Premium + Video Reels',
      'Gratis Ongkir Antar ke alamat dalam kota Banjarmasin'
    ]
  }
];
