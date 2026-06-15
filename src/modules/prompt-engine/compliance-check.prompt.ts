import { ComplianceResult } from "./types";

const riskRules = [
  { pattern: /sembuh|mengobati|menyembuhkan|anti\s*penyakit/i, finding: "health/medical claims" },
  { pattern: /pasti berhasil|dijamin|100%|garansi hasil/i, finding: "guaranteed results" },
  { pattern: /auto kaya|penghasilan pasti|income pasti|jutaan per hari/i, finding: "income promises" },
  { pattern: /stok tinggal|habis hari ini|cuma hari ini/i, finding: "fake urgency or stock scarcity" },
  { pattern: /diskon palsu|harga termurah se-?indonesia|paling murah/i, finding: "misleading discount or price claim" },
  { pattern: /langsung putih|turun \d+ kg|hasil instan/i, finding: "exaggerated or misleading before-after" }
];

export function checkCompliance(text: string): ComplianceResult {
  const findings = riskRules.filter((rule) => rule.pattern.test(text)).map((rule) => rule.finding);
  const uniqueFindings = Array.from(new Set(findings));
  const status = uniqueFindings.length === 0 ? "Safe" : uniqueFindings.length <= 2 ? "Needs Revision" : "Risky";

  return {
    status,
    findings: uniqueFindings,
    saferRewriteSuggestions:
      uniqueFindings.length === 0
        ? ["Konten aman secara template. Tetap cek detail produk sebelum posting."]
        : uniqueFindings.map((finding) => `Revisi bagian ${finding}: ubah menjadi pengalaman pribadi, demo realistis, dan ajakan cek detail produk.`)
  };
}

export function buildSafeClaimChecklist() {
  return [
    "Tidak ada klaim medis atau kesehatan.",
    "Tidak menjanjikan hasil pasti.",
    "Tidak menjanjikan penghasilan.",
    "Tidak memakai fake urgency atau stok palsu.",
    "Tidak membuat klaim diskon tanpa bukti.",
    "Before-after harus realistis dan bisa ditunjukkan di video.",
    "Ajak penonton cek harga, review, dan detail produk sendiri."
  ];
}
