import { PromptInput, defaultPromptOptions } from "./types";

export function buildScenePlan({ product, options = defaultPromptOptions }: PromptInput) {
  return [
    `0-2s: tampilkan problem harian yang relate untuk ${options.targetAudience}.`,
    `2-5s: close-up ${product.productName} tanpa klaim berlebihan.`,
    "5-9s: demo satu cara pakai yang paling mudah direkam.",
    "9-12s: tampilkan hasil realistis atau perbandingan sederhana.",
    "12-15s: arahkan penonton cek detail di keranjang kuning.",
    "Versi 30s: tambahkan pros, batasan produk, dan reminder cek review."
  ];
}

export function buildEditingNotes() {
  return [
    "Pakai teks besar di 3 detik pertama.",
    "Tampilkan produk lebih awal, jangan terlalu lama intro.",
    "Gunakan close-up tangan atau faceless angle jika tidak ingin tampil wajah.",
    "Potong jeda kosong agar video terasa cepat.",
    "Jangan pakai before-after yang menyesatkan."
  ];
}

export function buildPostingNotes() {
  return [
    "Upload saat audiens aktif dan balas komentar awal.",
    "Pin komentar yang menjelaskan cara cek keranjang kuning.",
    "Tes ulang hook jika views rendah.",
    "Tes CTA berbeda jika klik rendah.",
    "Gunakan data 5 hari pertama untuk memilih angle berikutnya."
  ];
}
