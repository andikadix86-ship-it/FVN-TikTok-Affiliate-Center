import { AffiliateProduct } from "./types";

const now = "2026-06-15T00:00:00.000Z";

const seeds: Array<[
  string,
  string,
  string,
  number,
  number,
  number,
  number,
  AffiliateProduct["competitionLevel"],
  string,
  string,
  string
]> = [
  ["wireless-mic-pro", "Wireless Mic Pro Clip", "Electronics", 189000, 18, 1420, 88, "medium", "Audio video kurang jelas", "Suara lebih dekat dan jernih", "Bandingkan suara sebelum dan sesudah pakai mic"],
  ["portable-powerbank", "Power Bank Fast Charge 20000mAh", "Electronics", 229000, 12, 1900, 86, "high", "Baterai cepat habis saat live", "Backup daya untuk creator mobile", "Tampilkan charging 3 device sekaligus"],
  ["tripod-creator", "Tripod Creator Mini", "Electronics", 99000, 16, 1080, 82, "low", "Video goyang saat rekam sendiri", "Frame video lebih stabil", "Demo setup meja 30 detik"],
  ["linen-shirt", "Kemeja Linen Basic", "Fashion", 149000, 14, 1680, 84, "medium", "Sulit cari outfit rapi tapi santai", "Tampilan clean untuk harian", "Try-on 3 gaya kerja dan weekend"],
  ["sling-bag", "Sling Bag Daily Waterproof", "Fashion", 129000, 15, 1220, 79, "medium", "Barang harian berantakan", "Tas kecil rapi dan aman", "Isi tas harian sebelum pergi"],
  ["muslim-inner", "Inner Hijab Cooling Essential", "Fashion", 59000, 19, 2100, 87, "medium", "Inner panas saat dipakai lama", "Lebih adem untuk aktivitas", "Review bahan dan pemakaian 8 jam"],
  ["barrier-serum", "Serum Barrier Repair", "Beauty", 89000, 20, 2600, 91, "high", "Kulit terasa kering dan kusam", "Membantu rutinitas skincare lebih teratur", "Tampilkan tekstur dan urutan pakai"],
  ["daily-sunscreen", "Sunscreen Daily Glow SPF50", "Beauty", 78000, 17, 2400, 90, "high", "Takut sunscreen lengket", "Finish ringan untuk harian", "Demo apply dan cek finish"],
  ["lip-tint", "Lip Tint Long Wear", "Beauty", 49000, 18, 1750, 83, "medium", "Warna bibir cepat hilang", "Warna tahan untuk aktivitas", "Swatch 3 warna favorit"],
  ["mini-vacuum", "Mini Vacuum Cordless", "Home & Living", 199000, 13, 1320, 81, "medium", "Debu meja sulit dibersihkan", "Bersih cepat tanpa kabel", "Before-after meja kerja"],
  ["sensor-lamp", "Lampu Sensor Motion", "Home & Living", 69000, 16, 980, 78, "low", "Area gelap saat malam", "Lampu otomatis saat bergerak", "Demo lorong malam"],
  ["storage-box", "Storage Box Foldable", "Home & Living", 59000, 15, 1180, 77, "low", "Barang rumah menumpuk", "Penyimpanan lebih rapi", "Declutter 1 rak"],
  ["portable-blender", "Portable Smoothie Blender", "Kitchen", 149000, 15, 1500, 86, "high", "Ingin minuman praktis tanpa blender besar", "Bikin smoothie satu porsi lebih mudah", "Masukkan buah, blend, lalu minum langsung"],
  ["air-fryer-liner", "Air Fryer Paper Liner", "Kitchen", 39000, 22, 2300, 88, "medium", "Air fryer sulit dibersihkan", "Masak lebih praktis dan bersih", "Demo masak snack tanpa gosok lama"],
  ["knife-sharpener", "Knife Sharpener Compact", "Kitchen", 45000, 18, 1030, 75, "low", "Pisau dapur cepat tumpul", "Potong bahan lebih mudah", "Before-after potong tomat"],
  ["busy-book", "Busy Book Edukasi Anak", "Baby", 119000, 14, 920, 76, "medium", "Anak cepat bosan belajar", "Aktivitas belajar lebih interaktif", "Tunjukkan 5 halaman aktivitas"],
  ["kids-bottle", "Botol Minum Anak Anti Bocor", "Baby", 69000, 17, 1250, 79, "medium", "Botol anak sering tumpah", "Minum lebih aman saat sekolah", "Tes anti bocor di tas"],
  ["night-lamp-kids", "Night Lamp Kids Soft", "Baby", 85000, 16, 780, 73, "low", "Anak takut tidur gelap", "Cahaya lembut untuk tidur", "Demo kamar sebelum tidur"],
  ["hydration-tumbler", "Tumbler Reminder Hydration", "Health", 89000, 13, 1480, 82, "medium", "Sering lupa minum air", "Rutinitas minum lebih terjaga", "Checklist minum harian"],
  ["resistance-band", "Resistance Band Set", "Health", 99000, 15, 870, 74, "medium", "Olahraga di rumah membosankan", "Latihan ringan lebih fleksibel", "3 gerakan pemula"],
  ["neck-pillow", "Neck Pillow Ergonomic", "Health", 129000, 12, 760, 72, "low", "Leher pegal saat perjalanan", "Dukungan leher lebih nyaman", "Demo posisi duduk travel"],
  ["yoga-mat", "Yoga Mat Non Slip", "Sports", 139000, 14, 960, 78, "medium", "Mat licin saat latihan", "Gerakan lebih stabil", "Tes grip saat plank"],
  ["mini-pump", "Mini Pump Portable", "Sports", 69000, 16, 840, 71, "low", "Bola/ban kecil kurang angin", "Pompa praktis dibawa", "Demo isi bola dalam 30 detik"],
  ["car-holder", "Magnetic Car Holder", "Automotive", 79000, 18, 1650, 84, "medium", "HP sulit dilihat saat navigasi", "Navigasi lebih aman", "Demo pasang di dashboard"],
  ["creator-book", "Buku Ide Konten 30 Hari", "Books", 99000, 25, 690, 80, "low", "Bingung ide konten harian", "Punya panduan ide siap pakai", "Flip-through template ide"]
];

export const sampleProducts: AffiliateProduct[] = seeds.map((seed, index) => {
  const [id, productName, category, price, commissionRate, soldCount, salesScore, competitionLevel, problemSolved, mainBenefit, demoIdea] = seed;

  return {
    id,
    source: "DEMO",
    productName,
    platform: "TikTok",
    category,
    price,
    commissionRate,
    soldCount,
    salesScore,
    rating: 4.4 + (index % 5) / 10,
    reviewCount: 120 + index * 37,
    competitionLevel,
    productUrl: `https://example.com/demo/${id}`,
    imageUrl: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80&sig=${index}`,
    targetAudience: index % 2 === 0 ? "Creator affiliate pemula" : "Pembeli aktif TikTok Shop",
    problemSolved,
    mainBenefit,
    demoIdea,
    notes: "Marketplace API belum terhubung. Data ini masih contoh.",
    contentPotential: Math.min(95, 70 + (index % 9) * 3),
    beginnerFriendliness: Math.min(94, 72 + (index % 8) * 3),
    createdAt: now,
    updatedAt: now
  };
});
