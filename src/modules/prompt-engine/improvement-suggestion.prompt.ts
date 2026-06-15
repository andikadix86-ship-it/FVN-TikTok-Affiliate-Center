import { calculatePerformanceSummary, CampaignPerformanceDay } from "@/modules/campaign/performance";

export function buildImprovementSuggestions(days: CampaignPerformanceDay[]) {
  const summary = calculatePerformanceSummary(days);
  const suggestions: string[] = [];
  const engagement = summary.totalViews > 0 ? ((days.reduce((sum, day) => sum + day.likes + day.comments + day.shares, 0) / summary.totalViews) * 100) : 0;

  if (summary.totalViews < 1500) {
    suggestions.push("Low views: perbaiki hook dan 3 detik pertama. Tampilkan problem lebih cepat.");
  }

  if (summary.ctr < 1.5) {
    suggestions.push("Low clicks: perjelas CTA dan benefit produk sebelum ajakan klik keranjang.");
  }

  if (summary.totalOrders === 0 || summary.conversionRate < 1) {
    suggestions.push("Low orders: tambah trust, demo produk lebih jelas, dan reminder cek review.");
  }

  if (engagement < 2) {
    suggestions.push("Low engagement: pakai angle yang lebih relatable dan ajukan pertanyaan di caption.");
  }

  if (summary.totalViews >= 1500 && summary.totalOrders === 0) {
    suggestions.push("High views low orders: cek ulang product match atau buat demo manfaat yang lebih kuat.");
  }

  return suggestions.length > 0 ? suggestions : ["Performa cukup sehat. Lanjutkan testing angle baru dan pertahankan hook yang paling kuat."];
}
