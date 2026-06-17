# Affiliate Center Audit

Date: 2026-06-17

## Bug dari hasil testing user

- Product Intelligence perlu default 10 produk, tombol Lihat Lebih Banyak menjadi 25 produk, filter kategori, dan aksi Add to TikTok Showcase dengan status NOT_CONNECTED saat OAuth belum aktif.
- Content Factory harus mengganti script saat content type berubah.
- Story Engine harus mengganti struktur saat story mode berubah.
- Multi Video Engine perlu jumlah video 1-30, preview card, image prompt, video prompt, Edit Satu-Satu, Simpan Semua ke Content Library, dan Jadwalkan Batch.
- Content Library harus menerima hasil dari Multi Video Engine, Content Factory, Story Engine, dan Creative Studio dengan source label dan status.

## Fix yang dilakukan

- Product Intelligence memakai `productDisplayLimit(false) = 10` dan `productDisplayLimit(true) = 25`.
- Tombol Lihat Lebih Banyak mengubah jumlah produk yang ditampilkan ke 25.
- Filter kategori tetap mengubah list produk berdasarkan kategori yang dipilih.
- Action produk sekarang mencakup Save Opportunity, Create Content, Create Campaign, dan Add to TikTok Showcase.
- Add to TikTok Showcase mengembalikan status NOT_CONNECTED jika TikTok OAuth/account belum connected.
- Content Factory memakai template berbeda untuk Video Review, Story Selling, Edukasi, dan Testimoni.
- Story Engine memakai struktur berbeda untuk Affiliate Story, Education Story, Business Story, Islamic Story, Kids Animation Story, dan Motivational Story.
- Multi Video Engine menghasilkan 1 sampai 30 variasi video dengan title, duration, platform, hook, scene list, image prompt, video prompt, voice over, subtitle, caption, CTA, placeholder image/video, dan status.
- Simpan Semua ke Content Library dan Jadwalkan Batch menyimpan item ke local generated Content Library fallback dengan source label Multi Video Engine.

## Tombol yang sudah aktif

- Lihat Lebih Banyak
- Filter Kategori
- Add to TikTok Showcase
- Create Content
- Create Campaign
- Generate Script
- Change Content Type
- Change Story Mode
- Generate Multi Video
- Edit Satu-Satu
- Simpan Semua ke Content Library
- Jadwalkan Batch
- Preview Image
- Preview Video

## Flow Product -> Showcase TikTok

1. User memilih produk di Product Intelligence.
2. User klik Add to TikTok Showcase.
3. Sistem menyimpan konteks produk.
4. Jika TikTok account belum connected, sistem menampilkan:
   `TikTok account is not connected yet. Connect account first to add product to showcase.`
5. Status showcase menjadi NOT_CONNECTED sampai OAuth/API TikTok tersedia.

## Flow Multi Video -> Content Library

1. User memilih jumlah video 1 sampai 30.
2. User klik Generate Multi Video.
3. Sistem membuat preview card untuk tiap video.
4. User klik Simpan Semua ke Content Library atau Jadwalkan Batch.
5. Sistem menyimpan item dengan source label Multi Video Engine dan status Saved/Scheduled.
6. Content Library membaca generated library fallback dari browser storage dan menampilkan item tanpa menu baru.

## Status provider image/video

- Provider real image/video belum dianggap connected.
- UI menampilkan placeholder preview dan badge:
  `Preview generated from prompt only - real media provider not connected.`
- Prompt image dan video tetap tersedia agar siap dikirim ke Nano Banana/Veo 3 ketika provider aktif.

## Known limitations

- TikTok Showcase belum push produk ke TikTok karena OAuth/API TikTok Shop belum aktif.
- Generated Content Library fallback masih memakai browser storage untuk workflow lokal.
- Real media URL baru bisa tampil setelah provider image/video production terhubung.
