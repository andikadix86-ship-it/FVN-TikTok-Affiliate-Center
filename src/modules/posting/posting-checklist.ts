export const postingChecklistItems = [
  "Hook sudah kuat di 3 detik pertama",
  "Produk terlihat jelas",
  "Manfaat produk jelas",
  "Demo produk mudah dipahami",
  "Caption sudah siap",
  "Hashtag sudah siap",
  "CTA keranjang kuning sudah jelas",
  "Klaim aman / tidak berlebihan",
  "Video sudah diedit",
  "Siap upload ke platform"
] as const;

export type PostingReadinessStatus = "Belum Siap" | "Hampir Siap" | "Siap Posting";

export function getPostingChecklistStatus(checkedCount: number): PostingReadinessStatus {
  if (checkedCount >= 9) {
    return "Siap Posting";
  }

  if (checkedCount >= 5) {
    return "Hampir Siap";
  }

  return "Belum Siap";
}
