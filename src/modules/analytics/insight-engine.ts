import { AnalyticsContentItem, calculateAnalyticsSummary, getBestContent, getBestProduct } from "./analytics";

export type AffiliateInsight = {
  providerMode: "AI" | "TEMPLATE";
  masalahUtama: string;
  peluangPerbaikan: string;
  rekomendasiProduk: string;
  rekomendasiKonten: string;
  langkahTigaHari: string[];
};

export function generateAffiliateInsight(items: AnalyticsContentItem[], aiProviderConnected: boolean): AffiliateInsight {
  const summary = calculateAnalyticsSummary(items);
  const bestProduct = getBestProduct(items, "orders");
  const bestContent = getBestContent(items, "views");

  if (summary.views === 0) {
    return {
      providerMode: aiProviderConnected ? "AI" : "TEMPLATE",
      masalahUtama: "Belum ada data performa manual.",
      peluangPerbaikan: "Mulai input views, clicks, orders, dan revenue dari video yang sudah diposting.",
      rekomendasiProduk: "Pilih satu produk manual atau CSV dengan score tertinggi untuk dites.",
      rekomendasiKonten: "Buat konten demo sederhana dengan hook 3 detik pertama yang jelas.",
      langkahTigaHari: ["Posting 1 video demo produk", "Input performa manual setelah 24 jam", "Bandingkan hook dan CTA dari video pertama"]
    };
  }

  const masalahUtama = summary.ctr < 1
    ? "CTR masih rendah, CTA dan alasan klik perlu diperjelas."
    : summary.conversionRate < 2
      ? "Klik sudah ada, tapi order masih lemah."
      : "Performa mulai terbaca, lanjutkan pola konten terbaik.";

  return {
    providerMode: aiProviderConnected ? "AI" : "TEMPLATE",
    masalahUtama,
    peluangPerbaikan: summary.engagementRate < 3
      ? "Buat angle yang lebih relatable dan kuatkan opening 3 detik pertama."
      : "Pertahankan angle yang sudah menarik engagement, lalu perkuat CTA keranjang kuning.",
    rekomendasiProduk: bestProduct ? `Fokus dulu ke ${bestProduct.productName} karena orders/revenue paling menonjol.` : "Belum ada produk terbaik.",
    rekomendasiKonten: bestContent ? `Pelajari ulang hook: ${bestContent.contentHook}` : "Belum ada konten terbaik.",
    langkahTigaHari: [
      "Hari 1: ubah hook dan tampilkan problem lebih cepat.",
      "Hari 2: buat demo produk lebih jelas dengan close-up.",
      "Hari 3: test CTA keranjang kuning yang lebih langsung."
    ]
  };
}
