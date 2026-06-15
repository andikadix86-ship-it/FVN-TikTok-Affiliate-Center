import { PromptInput, defaultPromptOptions } from "./types";

const audiencePain: Record<string, string> = {
  "Ibu Rumah Tangga": "yang urusan rumahnya sering numpuk",
  "Affiliate Pemula": "yang baru mulai bikin konten affiliate",
  "Affiliate Menengah": "yang mau angle kontennya lebih variatif",
  "Kaum Rebahan": "yang suka solusi praktis tanpa ribet",
  Mahasiswa: "yang pengen barang kepake buat harian",
  "Pekerja Kantoran": "yang aktivitasnya padat dan butuh praktis",
  UMKM: "yang butuh alat bantu sederhana buat kerja",
  "General TikTok Audience": "yang sering nemu masalah kecil tiap hari"
};

export function buildHooks({ product, options = defaultPromptOptions }: PromptInput) {
  const productName = product.productName;
  const category = product.category.toLowerCase();
  const pain = audiencePain[options.targetAudience] ?? audiencePain["General TikTok Audience"];

  return [
    `Yang ${pain}, coba lihat ini...`,
    `Aku kira ${productName} biasa aja, ternyata kepake banget...`,
    `Barang kecil ini bikin urusan ${category} jadi lebih rapi.`,
    `Buat yang sering ribet soal ${category}, ini ngebantu banget...`,
    `Sebelum beli produk ${category}, lihat demo singkat ini dulu.`,
    `Ini bukan barang wajib, tapi kalau problem kamu sama, lumayan membantu.`,
    `Awalnya aku skeptis, tapi bagian ini yang bikin aku ngerti fungsinya.`,
    `Kalau kamu suka solusi praktis, ${productName} ini menarik buat dicek.`,
    `Hasil demonya keliatan dalam beberapa detik pertama.`,
    `Coba bandingin sebelum dan sesudah pakai ini.`
  ];
}
